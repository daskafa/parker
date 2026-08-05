<?php

declare(strict_types=1);

namespace App\Services;

use App\Exceptions\ConflictException;
use App\Mail\SubscriberRegisteredMail;
use App\Models\Subscriber;
use App\Repositories\Contracts\SubscriberRepositoryInterface;
use App\Support\ListQuery;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class SubscriberService
{
    public function __construct(
        private readonly SubscriberRepositoryInterface $subscribers,
        private readonly QueuedMailDispatcher $mail,
    ) {}

    public function list(ListQuery $listQuery, ?string $search): LengthAwarePaginator
    {
        return $this->subscribers->paginateForAdmin($listQuery, $search);
    }

    /**
     * @return array{id: int, email: string, createdAt: mixed}
     *
     * @throws ConflictException
     */
    public function register(string $email): array
    {
        if ($this->subscribers->existsByEmail($email)) {
            throw new ConflictException('Bu e-posta adresi zaten kayıtlı.');
        }

        try {
            /** @var Subscriber $subscriber */
            $subscriber = $this->subscribers->create($this->freshTokenAttributes(['email' => $email]));
        } catch (UniqueConstraintViolationException) {
            throw new ConflictException('Bu e-posta adresi zaten kayıtlı.');
        }

        $this->sendRegistrationMail($subscriber);

        return [
            'id' => $subscriber->id,
            'email' => $subscriber->email,
            'createdAt' => $subscriber->created_at,
        ];
    }

    public function delete(Subscriber $subscriber): void
    {
        $this->subscribers->delete($subscriber);
    }

    /**
     * @throws ConflictException
     */
    public function resendAppointmentLink(Subscriber $subscriber): void
    {
        if ($this->subscribers->hasAppointment($subscriber)) {
            throw new ConflictException('Bu kayıt için zaten bir randevu oluşturulmuş.');
        }

        if ($subscriber->isTokenExpired()) {
            $this->subscribers->update($subscriber, $this->freshTokenAttributes());
        }

        $this->sendRegistrationMail($subscriber);
    }

    private function sendRegistrationMail(Subscriber $subscriber): void
    {
        $this->mail->queue(
            $subscriber->email,
            new SubscriberRegisteredMail($subscriber),
            'Subscriber registration mail could not be queued.',
            ['subscriber_id' => $subscriber->id],
        );
    }

    /**
     * @param  array<string, mixed>  $extra
     * @return array<string, mixed>
     */
    private function freshTokenAttributes(array $extra = []): array
    {
        return [
            ...$extra,
            'token' => Str::random(48),
            'token_expires_at' => now()->addDays((int) config('appointments.token_ttl_days')),
        ];
    }
}
