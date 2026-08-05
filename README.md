# NEWU Parker

E-posta toplama, token’lı randevu akışı ve admin paneli içeren full-stack uygulama.

**Canlı:** [https://assignment1.newu.digital](https://assignment1.newu.digital) · **Admin:** [/admin](https://assignment1.newu.digital/admin)

| Demo | |
|------|--|
| E-posta | `admin@newu.digital` |
| Şifre | `password` |

Varsayılan bildirim müşterisi: `destek@newu.digital`

## Stack

| | Seçim | Neden |
|--|--------|--------|
| Frontend | Next.js, TypeScript, Tailwind | Ayrık API-driven UI |
| Backend | Laravel, Sanctum | REST, validasyon, token auth |
| DB / kuyruk | MySQL, Redis | İlişkisel veri + async mail |
| Mail | SMTP (dev: MailHog) | Lokal test; UI `:8025` |
| Altyapı | Docker Compose, Nginx | Tek komut / canlı süreklilik |

## Kurulum

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
# backend/.env → DB_PASSWORD=secret

export NEXT_PUBLIC_API_URL=http://localhost:8000/api
docker compose up -d --build

docker compose exec backend php artisan key:generate
docker compose exec backend php artisan migrate --seed
```

Migrations: `backend/database/migrations` · Seed: `backend/database/seeders`

| Lokal | URL |
|-------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:8000/api |
| MailHog | http://localhost:8025 |

## Ortam değişkenleri

Örnekler: `backend/.env.example`, `frontend/.env.example` (gerçek şifreler repoda olmamalı).

Kritik backend: `APP_URL`, `FRONTEND_URL`, `CORS_ALLOWED_ORIGINS`, `SANCTUM_STATEFUL_DOMAINS`, `DB_*`, `REDIS_*`, `MAIL_*`, `QUEUE_CONNECTION=redis`

Frontend: `NEXT_PUBLIC_API_URL` — **build anında** gömülür.

Production örneği:

```env
APP_URL=https://assignment1.newu.digital
FRONTEND_URL=https://assignment1.newu.digital
CORS_ALLOWED_ORIGINS=https://assignment1.newu.digital
SANCTUM_STATEFUL_DOMAINS=assignment1.newu.digital
NEXT_PUBLIC_API_URL=https://assignment1.newu.digital/api
```

## Production

Host Nginx: `docker/host-nginx/assignment1.newu.digital.conf` (`/` → `:3000`, `/api` → `:8000`) · SSL: Certbot

```bash
# Frontend
export NEXT_PUBLIC_API_URL=https://assignment1.newu.digital/api
docker compose up -d --build frontend

# Backend (nginx restart: IP değişince 502 olmasın)
docker compose up -d --build backend queue
docker compose exec backend php artisan migrate --force
docker compose exec backend php artisan config:clear
docker compose restart nginx
```
