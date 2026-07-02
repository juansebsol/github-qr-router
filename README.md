# github-qr-router

One QR code, many destinations. Same printed QR — change where it goes anytime from the admin UI.

```
QR scan → https://you.github.io/REPO/a7k2m9 → reads links.json → redirects
```

Each QR gets a permanent random ID (`a7k2m9`). You only ever change the destination URL.

## Setup (once)

1. Push this repo to GitHub
2. **Settings → Secrets and variables → Actions** → New secret:
   - Name: `ADMIN_PASSWORD`
   - Value: your admin login password
3. **Settings → Pages** → Source: **GitHub Actions**
4. Push to `main` (or re-run the **Deploy Pages** workflow)

Site: `https://YOUR_USERNAME.github.io/REPO/`

> **Important:** Pages must use **GitHub Actions**, not "Deploy from a branch". The workflow reads `ADMIN_PASSWORD` and locks the admin page. Change the password anytime in Secrets, then redeploy.

## Daily use (admin UI)

1. Open `https://YOUR_USERNAME.github.io/REPO/admin.html`
2. Sign in with your `ADMIN_PASSWORD`
3. **+ New QR** → set description + destination URL → copy the QR URL
4. **Download links.json** → replace the file in your repo → push

That's it. Edit destinations the same way — admin → download → push.

Changes go live in ~1 min.

## Admin password

| Where | What |
|-------|------|
| **Live site** | GitHub Secret `ADMIN_PASSWORD` — set in repo Settings |
| **Local dev** | Copy `.env.example` → `.env`, run `node scripts/setup-admin.mjs` |

The password is never stored in the repo. GitHub Actions hashes it at deploy time.

## Custom domain (optional)

**Settings → Pages → Custom domain** — then point your DNS at GitHub.

## Notes

- `404.html` is required so slug URLs like `/a7k2m9` work on GitHub Pages
- `links.json` is public — no secrets in it

## Files

| File | Purpose |
|------|---------|
| `index.html` | Redirect script for the site root |
| `404.html` | Same redirect script — GitHub serves this for slug URLs like `/a7k2m9` |
| `links.json` | Your QR map: ID → destination URL + description |
| `admin.html` | Password-protected UI to create and edit QRs |
| `admin-secrets.js` | Password hash for admin — generated at deploy, not in git |
| `.github/workflows/pages.yml` | Deploy workflow — builds the site and injects `admin-secrets.js` from your GitHub Secret |
| `scripts/setup-admin.mjs` | Local dev only — generates `admin-secrets.js` from `.env` |
