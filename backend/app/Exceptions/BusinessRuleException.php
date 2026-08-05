<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;

/**
 * Is kurali ihlali — HTTP 422.
 */
class BusinessRuleException extends Exception
{
    public function __construct(string $message, private readonly int $status = 422)
    {
        parent::__construct($message);
    }

    public function status(): int
    {
        return $this->status;
    }
}
