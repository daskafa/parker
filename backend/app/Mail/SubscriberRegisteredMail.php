<?php

declare(strict_types=1);

namespace App\Mail;

use App\Models\Subscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

class SubscriberRegisteredMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public int $tries = 3;

    public function __construct(public Subscriber $subscriber) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'E-posta Adresiniz Kaydedildi',
        );
    }

    public function content(): Content
    {
        $appointmentUrl = rtrim((string) config('app.frontend_url'), '/').'/randevu/'.$this->subscriber->token;

        return new Content(
            view: 'emails.subscriber-registered',
            with: [
                'appointmentUrl' => $appointmentUrl,
            ],
        );
    }

    public function failed(Throwable $exception): void
    {
        Log::error('Subscriber registration mail failed after retries.', [
            'subscriber_id' => $this->subscriber->id,
            'email' => $this->subscriber->email,
            'error' => $exception->getMessage(),
        ]);
    }
}
