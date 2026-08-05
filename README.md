# NEWU Parker

Newsletter kaydı, e-posta ile randevu oluşturma ve admin paneli içeren full-stack uygulama.

**Canlı:** [https://assignment1.newu.digital](https://assignment1.newu.digital)

## Stack

| Katman | Teknoloji |
|--------|-----------|
| Frontend | Next.js, TypeScript, Tailwind CSS |
| Backend | Laravel, Sanctum |
| Veri / kuyruk | MySQL, Redis |
| Altyapı | Docker Compose, Nginx, MailHog (geliştirme) |

## Demo giriş

| Alan | Değer |
|------|--------|
| Admin URL | `/admin` |
| E-posta | `admin@newu.digital` |
| Şifre | `password` |

Seed ile varsayılan bildirim müşterisi: `destek@newu.digital`

## Gereksinimler

- Docker ve Docker Compose
- (İsteğe bağlı) Node 20+, PHP 8.3+, Composer — Compose dışında lokal çalıştırma için

## Kurulum

```bash
git clone <repo-url> newu-parker
cd newu-parker

cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# backend/.env içinde DB_PASSWORD=secret (Compose MySQL ile uyumlu)
# APP_KEY yoksa: docker compose up -d sonrası aşağıdaki key:generate

docker compose up -d --build

docker compose exec backend php artisan key:generate
docker compose exec backend php artisan migrate --seed
```

Uygulama adresleri:

| Servis | URL |
|--------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:8000/api |
| MailHog UI | http://localhost:8025 |

## Ortam değişkenleri

Kritik değerler:

**`backend/.env`**

- `APP_URL` — API kök adresi
- `FRONTEND_URL` — randevu linkleri ve mail logosu için
- `CORS_ALLOWED_ORIGINS` — frontend origin
- `SANCTUM_STATEFUL_DOMAINS` — admin cookie/domain (production)
- `MAIL_*` — geliştirmede MailHog; production’da gerçek SMTP

**`frontend/.env.local`**

- `NEXT_PUBLIC_API_URL` — örn. `http://localhost:8000/api`

Production örneği:

```env
# backend
APP_URL=https://assignment1.newu.digital
FRONTEND_URL=https://assignment1.newu.digital
CORS_ALLOWED_ORIGINS=https://assignment1.newu.digital
SANCTUM_STATEFUL_DOMAINS=assignment1.newu.digital

# frontend
NEXT_PUBLIC_API_URL=https://assignment1.newu.digital/api
```

Env değişince frontend container’ı recreate edilmeli (`docker compose up -d --force-recreate frontend`). Backend için `php artisan config:clear` ve queue restart.

## Akış özeti

1. Landing’den newsletter kaydı → aboneye randevu linki maili
2. `/randevu/{token}` ile tarih seçimi → müşterilere bildirim maili
3. Admin: aboneler, randevular, müşteriler (bildirim alıcıları)

## Production notları

Host Nginx örneği: `docker/host-nginx/assignment1.newu.digital.conf`  
(`/` → frontend `:3000`, `/api` → API `:8000`)

SSL için Certbot (`certbot --nginx`) kullanılabilir. Mail için `MAIL_HOST` / SMTP bilgilerini production sağlayıcınıza göre güncelleyin.
