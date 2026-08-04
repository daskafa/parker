<?php

declare(strict_types=1);

namespace App\Mail;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

class AppointmentCustomerNotificationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public int $tries = 3;

    public function __construct(public Appointment $appointment) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Yeni Randevu Bildirimi',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.appointment-customer-notification',
            with: [
                'subscriberEmail' => $this->appointment->subscriber->email,
                'scheduledAt' => $this->appointment->scheduled_at,
            ],
        );
    }

    public function failed(Throwable $exception): void
    {
        Log::error('Appointment customer notification mail failed after retries.', [
            'appointment_id' => $this->appointment->id,
            'error' => $exception->getMessage(),
        ]);
    }
}
