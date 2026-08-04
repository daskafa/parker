<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;

class InvalidAppointmentTokenException extends Exception
{
    public function __construct(public readonly string $reason, string $message)
    {
        parent::__construct($message);
    }

    public function status(): int
    {
        return match ($this->reason) {
            'not_found' => 404,
            'expired' => 410,
            'used' => 409,
            default => 422,
        };
    }
}
