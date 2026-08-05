<?php

declare(strict_types=1);

namespace App\Services;

use App\Exceptions\AppointmentSlotUnavailableException;
use App\Repositories\Contracts\AppointmentRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;

/**
 * Randevu icin secilen tarih/saatin is kurallarina uygunlugunu dogrular.
 */
class AppointmentScheduleValidator
{
    public function __construct(
        private readonly AppointmentRepositoryInterface $appointments,
    ) {}

    /**
     * @throws ValidationException
     * @throws AppointmentSlotUnavailableException
     */
    public function validate(Carbon $scheduledAt): void
    {
        $this->assertNotPast($scheduledAt);
        $this->assertWithinBusinessHours($scheduledAt);
        $this->assertSlotAvailable($scheduledAt);
    }

    private function assertNotPast(Carbon $scheduledAt): void
    {
        if ($scheduledAt->isPast()) {
            throw ValidationException::withMessages([
                'scheduledAt' => ['Geçmiş bir tarihe randevu oluşturulamaz.'],
            ]);
        }
    }

    private function assertWithinBusinessHours(Carbon $scheduledAt): void
    {
        $businessDays = config('appointments.business_days');

        if (! in_array($scheduledAt->dayOfWeek, $businessDays, true)) {
            throw ValidationException::withMessages([
                'scheduledAt' => ['Randevular yalnızca Pazartesi - Cuma günleri arasında oluşturulabilir.'],
            ]);
        }

        $start = $scheduledAt->clone()->setTimeFromTimeString(config('appointments.business_hours.start'));
        $end = $scheduledAt->clone()->setTimeFromTimeString(config('appointments.business_hours.end'));

        if ($scheduledAt->lt($start) || $scheduledAt->gte($end)) {
            $startLabel = $start->format('H:i');
            $endLabel = $end->format('H:i');

            throw ValidationException::withMessages([
                'scheduledAt' => ["Randevu saati {$startLabel} - {$endLabel} arasında olmalıdır."],
            ]);
        }
    }

    /**
     * @throws AppointmentSlotUnavailableException
     */
    private function assertSlotAvailable(Carbon $scheduledAt): void
    {
        if ($this->appointments->slotTaken($scheduledAt)) {
            throw new AppointmentSlotUnavailableException;
        }
    }
}
