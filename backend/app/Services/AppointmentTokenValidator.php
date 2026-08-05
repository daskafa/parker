<?php

declare(strict_types=1);

namespace App\Services;

use App\Exceptions\InvalidAppointmentTokenException;
use App\Repositories\Contracts\SubscriberRepositoryInterface;

/**
 * Randevu linkindeki token'in gecerliligini kontrol eder.
 */
class AppointmentTokenValidator
{
    public function __construct(
        private readonly SubscriberRepositoryInterface $subscribers,
    ) {}

    public function validate(string $token): \App\Models\Subscriber
    {
        $subscriber = $this->subscribers->findByToken($token);

        if (! $subscriber) {
            throw new InvalidAppointmentTokenException('not_found', 'Bu randevu bağlantısı geçersiz.');
        }

        if ($subscriber->isTokenExpired()) {
            throw new InvalidAppointmentTokenException('expired', 'Bu randevu bağlantısının süresi dolmuş.');
        }

        if ($this->subscribers->hasAppointment($subscriber)) {
            throw new InvalidAppointmentTokenException('used', 'Bu bağlantı ile daha önce bir randevu oluşturulmuş.');
        }

        return $subscriber;
    }
}
