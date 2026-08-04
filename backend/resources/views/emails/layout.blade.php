<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ config('app.name') }}</title>
</head>
<body style="margin:0; padding:0; background-color:#09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#09090b; padding:40px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px; background-color:#111113; border:1px solid #27272a;">
                    <tr>
                        <td style="padding:28px 28px 0;">
                            <img
                                src="{{ rtrim(config('app.frontend_url'), '/') }}/logo.png"
                                alt="{{ config('app.name') }}"
                                width="140"
                                height="21"
                                style="display:block; width:140px; height:auto; border:0;"
                            >
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:24px 28px 32px; color:#a1a1aa; font-size:15px; line-height:1.6;">
                            @yield('content')
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:16px 28px 24px; border-top:1px solid #27272a; color:#52525b; font-size:12px; line-height:1.5;">
                            Bu e-posta otomatik gönderilmiştir.<br>
                            &copy; {{ date('Y') }} {{ config('app.name') }}
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
