# Wedding site — Rasim & Anna

Production-ready деплой: **Caddy** (HTTPS) + **Docker Compose** + API анкеты гостя → **Telegram-группа**.

Домен: **расим-и-анна.рф**

## Стек

| Сервис | Роль |
|--------|------|
| `caddy` | TLS (Let's Encrypt), статика `dist/`, reverse proxy `/api/*` |
| `api` | Hono: валидация RSVP, отправка в Telegram-группу, httpOnly cookie |

## Быстрый старт

### 1. Telegram-бот и группа

1. Создайте бота у [@BotFather](https://t.me/BotFather) → получите `TELEGRAM_BOT_TOKEN`.
2. Создайте группу (или используйте существующую) и **добавьте бота** в неё.
3. Узнайте `TELEGRAM_CHAT_ID` (обычно вида `-100…`):
   - перешлите любое сообщение из группы боту [@userinfobot](https://t.me/userinfobot) / [@getidsbot](https://t.me/getidsbot),
   - или напишите в группе и откройте `https://api.telegram.org/bot<TOKEN>/getUpdates` — в ответе будет `"chat":{"id":-100...}`.
4. Проверка:
   ```bash
   curl -s "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
     -d chat_id="$TELEGRAM_CHAT_ID" \
     -d text="test"
   ```

### 2. Переменные окружения

```bash
cp .env.example .env
```

Заполните в `.env`:

```env
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=-100...
DOMAIN=расим-и-анна.рф
COOKIE_SECURE=true
```

`TELEGRAM_CHANNEL_ID` по-прежнему читается как fallback, если `TELEGRAM_CHAT_ID` не задан.

После смены `.env`:

```bash
docker compose up -d --force-recreate api
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

Поля: имя, присутствие, напитки (вино красное / белое, шампанское, водка, коньяк, самогон, безалкогольные), аллергия, +1.

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
