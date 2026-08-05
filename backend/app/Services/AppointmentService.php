<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\AppointmentStatus;
use App\Mail\AppointmentConfirmationMail;
use App\Mail\AppointmentCustomerNotificationMail;
use App\Models\Appointment;
use App\Models\Customer;
use App\Repositories\Contracts\AppointmentRepositoryInterface;
use App\Repositories\Contracts\CustomerRepositoryInterface;
use App\Support\ListQuery;
use Carbon\Carbon;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AppointmentService
{
    public function __construct(
        private readonly AppointmentRepositoryInterface $appointments,
        private readonly CustomerRepositoryInterface $customers,
        private readonly AppointmentTokenValidator $tokenValidator,
        private readonly AppointmentScheduleValidator $scheduleValidator,
        private readonly QueuedMailDispatcher $mail,
    ) {}

    public function list(
        ListQuery $listQuery,
        ?string $status,
        ?string $from,
        ?string $to,
    ): LengthAwarePaginator {
        return $this->appointments->paginateForAdmin($listQuery, $status, $from, $to);
    }

    /**
     * @return array{email: string, tokenExpiresAt: mixed}
     */
    public function validateToken(string $token): array
    {
        $subscriber = $this->tokenValidator->validate($token);

        return [
            'email' => $subscriber->email,
            'tokenExpiresAt' => $subscriber->token_expires_at,
        ];
    }

    /**
     * @return array{id: int, scheduledAt: mixed}
     */
    public function create(string $token, Carbon $scheduledAt): array
    {
        $subscriber = $this->tokenValidator->validate($token);
        $this->scheduleValidator->validate($scheduledAt);

        $customer = $this->customers->findDefault() ?? $this->customers->first();

        $appointment = DB::transaction(function () use ($subscriber, $customer, $scheduledAt) {
            return $this->appointments->createForSubscriber([
                'subscriber_id' => $subscriber->id,
                'customer_id' => $customer?->id,
                'scheduled_at' => $scheduledAt,
                'status' => AppointmentStatus::Pending,
            ]);
        });

        $appointment->loadMissing('subscriber');
        $this->dispatchNotifications($appointment, $customer);

        return [
            'id' => $appointment->id,
            'scheduledAt' => $appointment->scheduled_at,
        ];
    }

    public function updateStatus(Appointment $appointment, string $status): Appointment
    {
        /** @var Appointment $updated */
        $updated = $this->appointments->update($appointment, ['status' => $status]);
        $updated->loadMissing(['subscriber', 'customer']);

        return $updated;
    }

    public function delete(Appointment $appointment): void
    {
        $this->appointments->delete($appointment);
    }

    private function dispatchNotifications(Appointment $appointment, ?Customer $customer): void
    {
        if ($customer) {
            $this->mail->queue(
                $customer->email,
                new AppointmentCustomerNotificationMail($appointment),
                'Randevu mail bildirimleri gonderilirken hata olustu.',
                ['appointment_id' => $appointment->id],
            );
        } else {
            Log::warning('Randevu bildirimi gonderilemedi: tanimli musteri/yetkili bulunamadi.', [
                'appointment_id' => $appointment->id,
            ]);
        }

        $this->mail->queue(
            $appointment->subscriber->email,
            new AppointmentConfirmationMail($appointment),
            'Randevu mail bildirimleri gonderilirken hata olustu.',
            ['appointment_id' => $appointment->id],
        );
    }
}
