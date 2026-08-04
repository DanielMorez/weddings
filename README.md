# Wedding site — Rasim & Anna

Production-ready деплой: **Caddy** (HTTPS) + **Docker Compose** + API анкеты гостя → **Telegram**.

Домен: **расим-и-анна.рф**

## Стек

| Сервис | Роль |
|--------|------|
| `caddy` | TLS (Let's Encrypt), статика `dist/`, reverse proxy `/api/*` |
| `api` | Hono: валидация RSVP, отправка в Telegram-канал, httpOnly cookie |

## Быстрый старт

### 1. Telegram-бот

1. Создайте бота у [@BotFather](https://t.me/BotFather) → получите `TELEGRAM_BOT_TOKEN`.
2. Создайте канал (или используйте существующий).
3. Добавьте бота в канал **администратором** с правом публиковать сообщения.
4. Узнайте `TELEGRAM_CHANNEL_ID` (обычно вида `-100…`):
   - перешлите любое сообщение из канала боту [@userinfobot](https://t.me/userinfobot) / [@getidsbot](https://t.me/getidsbot),  
   - или откройте `https://api.telegram.org/bot<TOKEN>/getUpdates` после поста в канале.

### 2. Переменные окружения

```bash
cp .env.example .env
```

Заполните в `.env`:

```env
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHANNEL_ID=-100...
DOMAIN=расим-и-анна.рф
COOKIE_SECURE=true
```

### 3. DNS

Укажите A (и при необходимости AAAA) запись домена `расим-и-анна.рф` на IP сервера, где запущен Docker. Порты **80** и **443** должны быть открыты — Caddy сам получит сертификат Let's Encrypt.

### 4. Запуск

```bash
docker compose up -d --build
```

Сайт: https://расим-и-анна.рф  

Логи:

```bash
docker compose logs -f caddy api
```

Остановка:

```bash
docker compose down
```

## Анкета гостя

После успешной отправки API ставит cookie `rsvp_sent` (HttpOnly, Secure, SameSite=Lax, 1 год). Повторная отправка с того же браузера отклоняется (`409`); на сайте сразу показывается «Спасибо!».

Поля: имя, присутствие, напитки, аллергия, +1.

## Локальная разработка

Терминал 1 — API:

```bash
cd api
cp ../.env.example ../.env   # или свой .env в корне / экспортируйте переменные
export $(grep -v '^#' ../.env | xargs)
npm run dev                  # http://127.0.0.1:3000
```

Для локали без HTTPS можно `COOKIE_SECURE=false`.

Терминал 2 — фронт (проксирует `/api` на API):

```bash
pnpm install
pnpm dev                     # http://0.0.0.0:8443
```

## Структура

```
├── Dockerfile           # multi-stage: Vite build → Caddy
├── Caddyfile
├── docker-compose.yml
├── .env.example
├── api/                 # RSVP → Telegram
│   ├── Dockerfile
│   └── src/index.ts
└── src/
    ├── App.tsx
    └── api/rsvp.ts
```
