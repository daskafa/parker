<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Queue uzerinden mail gonderimini ortaklastirir; hata kaydi kaybetmez.
 */
class QueuedMailDispatcher
{
    /**
     * @param  array<string, mixed>  $context
     */
    public function queue(string $to, Mailable $mailable, string $errorMessage, array $context = []): void
    {
        try {
            Mail::to($to)->queue($mailable);
        } catch (\Throwable $e) {
            Log::error($errorMessage, [
                ...$context,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
