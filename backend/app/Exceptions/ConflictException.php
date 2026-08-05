<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;

/**
 * Is kurali catismasi (or. mukerrer kayit) — HTTP 409.
 */
class ConflictException extends Exception
{
    public function __construct(string $message, private readonly int $status = 409)
    {
        parent::__construct($message);
    }

    public function status(): int
    {
        return $this->status;
    }
}
