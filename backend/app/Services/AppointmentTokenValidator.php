<?php

declare(strict_types=1);

namespace App\Services;

use App\Exceptions\InvalidAppointmentTokenException;
use App\Models\Subscriber;

/**
 * Randevu linkindeki token'in gecerliligini kontrol eder.
 * Hem token dogrulama ucu (GET) hem de randevu olusturma ucu (POST)
 * tarafindan ortak olarak kullanilir.
 */
class AppointmentTokenValidator
{
    public function validate(string $token): Subscriber
    {
        $subscriber = Subscriber::where('token', $token)->first();

        if (! $subscriber) {
            throw new InvalidAppointmentTokenException('not_found', 'Bu randevu bağlantısı geçersiz.');
        }

        if ($subscriber->isTokenExpired()) {
            throw new InvalidAppointmentTokenException('expired', 'Bu randevu bağlantısının süresi dolmuş.');
        }

        if ($subscriber->appointment()->exists()) {
            throw new InvalidAppointmentTokenException('used', 'Bu bağlantı ile daha önce bir randevu oluşturulmuş.');
        }

        return $subscriber;
    }
}
