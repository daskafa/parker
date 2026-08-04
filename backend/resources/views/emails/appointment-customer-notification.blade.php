@extends('emails.layout')

@section('content')
    <p style="margin:0 0 16px; color:#e4e4e7;">Merhaba,</p>

    <p style="margin:0 0 16px;">Yeni bir randevu oluşturuldu.</p>

    <p style="margin:0 0 24px; padding:14px 16px; background-color:#18181b; border:1px solid #27272a; color:#e4e4e7; font-size:14px; line-height:1.7;">
        <strong style="color:#fafafa;">E-posta:</strong> {{ $subscriberEmail }}<br>
        <strong style="color:#fafafa;">Tarih / Saat:</strong> {{ $scheduledAt->translatedFormat('d.m.Y H:i') }}
    </p>

    <p style="margin:0; color:#e4e4e7;">Saygılarımızla,<br>{{ config('app.name') }}</p>
@endsection
