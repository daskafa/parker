# NEWU Parker

Landing page üzerinden e-posta toplayan, token’lı randevu akışı ve admin paneli sunan full-stack uygulama.

**Canlı:** [https://assignment1.newu.digital](https://assignment1.newu.digital)  
**Admin:** [https://assignment1.newu.digital/admin](https://assignment1.newu.digital/admin)

---

## Demo giriş

| | |
|---|---|
| E-posta | `admin@newu.digital` |
| Şifre | `password` |

Seed ile varsayılan bildirim müşterisi: `destek@newu.digital`

---

## Teknoloji tercihleri

| Katman | Seçim | Gerekçe |
|--------|--------|---------|
| Frontend | Next.js (App Router), TypeScript, Tailwind | API-driven ayrık arayüz, hızlı UI, tip güvenliği |
| Backend | Laravel + Sanctum | REST API, Form Request validasyon, token auth, merkezi hata yönetimi |
| Veritabanı | MySQL 8 | İlişkisel model (aboneler, randevular, müşteriler) |
| Kuyruk / cache | Redis | Mail’in API cevabını bloklamaması (async), rate limit desteği |
| Mail (dev) | MailHog | Yerel SMTP testi; production’da gerçek SMTP |
| Altyapı | Docker Compose + Nginx | Tek komutla ayağa kalkma, canlıda süreklilik |

---

## Gereksinimler

- Docker ve Docker Compose
- (İsteğe bağlı) Node 20+, PHP 8.3+, Composer — Compose dışında lokal geliştirme için

---

## Kurulum

```bash
git clone <repo-url> newu-parker
cd newu-parker

cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

`backend/.env` içinde Compose MySQL ile uyum için:

```env
DB_PASSWORD=secret
```

```bash
docker compose up -d --build

docker compose exec backend php artisan key:generate
docker compose exec backend php artisan migrate --seed
```

Şema: `backend/database/migrations`  
Seed: `backend/database/seeders` (admin + varsayılan müşteri)

### Lokal adresler

| Servis | URL |
|--------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:8000/api |
| MailHog | http://localhost:8025 |

---

## Ortam değişkenleri

Örnek dosyalar: `backend/.env.example`, `frontend/.env.example`  
Gerçek şifreler ve production `.env` dosyaları repoya eklenmemelidir.

### Backend (özet)

| Değişken | Açıklama |
|----------|----------|
| `APP_URL` | API kök adresi |
| `APP_KEY` | `php artisan key:generate` |
| `DB_*` | MySQL bağlantısı (`DB_HOST=mysql` Compose’ta) |
| `REDIS_HOST` | Compose’ta `redis` |
| `QUEUE_CONNECTION` | `redis` |
| `MAIL_*` | Dev: MailHog (`mailhog:1025`); prod: gerçek SMTP |
| `FRONTEND_URL` | Randevu linkleri ve mail logosu |
| `CORS_ALLOWED_ORIGINS` | Frontend origin |
| `SANCTUM_STATEFUL_DOMAINS` | Admin domain (production) |
| `APPOINTMENT_TOKEN_TTL_DAYS` | Randevu token süresi (varsayılan 7) |

### Frontend

| Değişken | Açıklama |
|----------|----------|
| `NEXT_PUBLIC_API_URL` | API base, örn. `http://localhost:8000/api` |

### Production örneği

```env
# backend/.env
APP_URL=https://assignment1.newu.digital
FRONTEND_URL=https://assignment1.newu.digital
CORS_ALLOWED_ORIGINS=https://assignment1.newu.digital
SANCTUM_STATEFUL_DOMAINS=assignment1.newu.digital

# frontend/.env.local
NEXT_PUBLIC_API_URL=https://assignment1.newu.digital/api
```

Env değişince:

```bash
docker compose up -d --force-recreate frontend
docker compose exec backend php artisan config:clear
docker compose restart queue backend
```

---

## Uygulama akışı

1. Landing newsletter → abone kaydı + randevu linki maili (kuyruk)
2. `/randevu/{token}` → tarih/saat seçimi → onay + müşteri bildirimi
3. Admin → aboneler, randevular, müşteriler (bildirim alıcıları)

---

## Production

Frontend production image (`standalone`) ile servis edilir. Build sırasında API URL gömülür:

```bash
export NEXT_PUBLIC_API_URL=https://assignment1.newu.digital/api
docker compose up -d --build frontend
```

- Host Nginx örneği: `docker/host-nginx/assignment1.newu.digital.conf`  
  (`/` → frontend `:3000`, `/api` → API `:8000`)
- SSL: Certbot (`certbot --nginx`)
- Mail: `MAIL_*` değerlerini production SMTP sağlayıcınıza göre ayarlayın
