# TCopilot

Assistant personnel intelligent sur **Telegram** + **site vitrine**, dans une seule application **Next.js** déployable sur **Vercel**.

Tu écris en français à un bot Telegram (« Rappelle-moi d'appeler le médecin mardi à 15h ») et il crée tâches, rappels et rendez-vous, t'envoie une notification 30 min avant, et garde le contexte de la conversation. Le parsing d'intention est fait par **Mistral AI**, les données sont stockées dans **MongoDB Atlas** via **Prisma**.

## Stack

- **Next.js** (App Router) — site vitrine + routes API
- **shadcn/ui + Tailwind CSS** (thème clair/sombre via `next-themes`)
- **grammy** — bot Telegram (mode webhook)
- **Mistral AI** — compréhension du langage naturel
- **Prisma + MongoDB Atlas**
- **cron-job.org** — déclenche les rappels chaque minute

## Architecture

| Élément | Emplacement |
| --- | --- |
| Site vitrine | `src/app/page.tsx`, `src/components/*` |
| Webhook Telegram | `src/app/api/telegram/webhook/route.ts` |
| Cron des rappels | `src/app/api/cron/reminders/route.ts` |
| Logique du bot | `src/bot/*` |
| Services / repositories | `src/services/*`, `src/repositories/*` |
| Schéma de données | `prisma/schema.prisma` |

La session grammy (historique de conversation + désambiguïsation) est **persistée en MongoDB** (`src/bot/session-storage.ts`) pour survivre au modèle serverless.

## Développement local

```bash
npm install                 # installe les deps + génère le client Prisma
cp .env.example .env        # puis remplis les valeurs
npm run db:push             # crée les collections dans MongoDB Atlas
npm run dev                 # http://localhost:3000
```

Variables d'environnement : voir [.env.example](.env.example).

### Tester le bot en local

Telegram a besoin d'une URL HTTPS publique. Expose `localhost:3000` (ngrok, cloudflared…), puis :

```bash
npm run set-webhook -- https://<ton-tunnel-public>
```

## Déploiement sur Vercel

1. Pousse le repo sur GitHub et importe-le dans Vercel.
2. Définis les variables d'environnement (Project Settings → Environment Variables) :
   - `TELEGRAM_BOT_TOKEN`
   - `MISTRAL_API_KEY`
   - `MISTRAL_MODEL` (ex. `mistral-small-latest`)
   - `DATABASE_URL` (chaîne MongoDB Atlas)
   - `WEBHOOK_SECRET`
   - `CRON_SECRET`
   - `NEXT_PUBLIC_TELEGRAM_BOT_URL` (optionnel, lien affiché sur le site)
3. Déploie. Le build lance automatiquement `prisma generate`.
4. Enregistre le webhook Telegram vers l'URL de prod :

```bash
npm run set-webhook -- https://ton-app.vercel.app
```

### Rappels via cron-job.org

Crée un cronjob sur [cron-job.org](https://cron-job.org) :

- **URL** : `https://ton-app.vercel.app/api/cron/reminders`
- **Méthode** : `GET`
- **Header** : `Authorization: Bearer <CRON_SECRET>`
- **Fréquence** : chaque minute

La route renvoie `{ "ok": true, "sent": <n> }`.

## Scripts

| Script | Rôle |
| --- | --- |
| `npm run dev` | Lance Next.js en dev |
| `npm run build` | `prisma generate` + build de prod |
| `npm run start` | Sert le build de prod |
| `npm run db:push` | Synchronise le schéma Prisma avec MongoDB |
| `npm run set-webhook -- <url>` | Enregistre le webhook Telegram |
