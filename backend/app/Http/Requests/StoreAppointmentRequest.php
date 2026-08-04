<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'token' => ['required', 'string'],
            'scheduledAt' => ['required', 'date'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'token.required' => 'Token bilgisi eksik.',
            'scheduledAt.required' => 'Lütfen bir randevu tarihi ve saati seçiniz.',
            'scheduledAt.date' => 'Lütfen geçerli bir tarih ve saat giriniz.',
        ];
    }
}
