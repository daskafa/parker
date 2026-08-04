<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;

class AppointmentSlotUnavailableException extends Exception
{
    public function __construct(string $message = 'Seçilen tarih ve saat için randevu dolu, lütfen başka bir saat seçiniz.')
    {
        parent::__construct($message);
    }
}
