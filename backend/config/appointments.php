<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Randevu Token Gecerlilik Suresi
    |--------------------------------------------------------------------------
    |
    | Bir subscriber'a gonderilen randevu olusturma linkinin kac gun
    | gecerli olacagini belirler.
    |
    */

    'token_ttl_days' => (int) env('APPOINTMENT_TOKEN_TTL_DAYS', 7),

    /*
    |--------------------------------------------------------------------------
    | Randevu Slot Suresi (dakika)
    |--------------------------------------------------------------------------
    */

    'slot_minutes' => (int) env('APPOINTMENT_SLOT_MINUTES', 30),

    /*
    |--------------------------------------------------------------------------
    | Mesai Saatleri
    |--------------------------------------------------------------------------
    */

    'business_hours' => [
        'start' => env('APPOINTMENT_BUSINESS_START', '09:00'),
        'end' => env('APPOINTMENT_BUSINESS_END', '18:00'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Mesai Gunleri
    |--------------------------------------------------------------------------
    |
    | Carbon::dayOfWeek degerleri: 0 = Pazar ... 6 = Cumartesi.
    | Varsayilan: Pazartesi - Cuma.
    |
    */

    'business_days' => [1, 2, 3, 4, 5],

];
