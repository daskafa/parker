@extends('emails.layout')

@section('content')
    <p style="margin:0 0 16px; color:#e4e4e7;">Merhaba,</p>

    <p style="margin:0 0 16px;">E-posta adresiniz kaydedildi. Randevu oluşturmak için aşağıdaki bağlantıyı kullanabilirsiniz.</p>

    <p style="margin:28px 0;">
        <a href="{{ $appointmentUrl }}"
           style="display:inline-block; background-color:#fafafa; color:#09090b; text-decoration:none; padding:11px 20px; font-size:14px; font-weight:500;">
            Randevu Oluştur
        </a>
    </p>

    <p style="margin:0 0 24px; font-size:13px; color:#71717a; word-break:break-all;">
        Link çalışmazsa:<br>
        <a href="{{ $appointmentUrl }}" style="color:#a1a1aa;">{{ $appointmentUrl }}</a>
    </p>

    <p style="margin:0; color:#e4e4e7;">Saygılarımızla,<br>{{ config('app.name') }}</p>
@endsection
