# github-qr-router

One QR code, many destinations. Point a QR at your GitHub Pages URL; change where it goes by editing `links.json`.

## How it works

```
QR scan → https://you.github.io/qr/go
       → page loads links.json
       → browser redirects to the URL for "go"
```

Edit `links.json`, push, done. Same QR, new destination.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Redirect script (root URL) |
| `404.html` | Same script — **required** so `/go`, `/menu`, etc. work on GitHub Pages |
| `links.json` | Slug → destination URL map |

`links.json` example:

```json
{
  "go": "https://fractals.finance",
  "xnet": "https://xnet.company",
  "menu": "https://myrestaurant.com/menu"
}
```

- `https://you.github.io/qr/go` → `links.go`
- `https://you.github.io/qr/xnet` → `links.xnet`
- Unknown slug → falls back to `links.go`

## Deploy to GitHub Pages

### 1. Create the repo

1. [github.com/new](https://github.com/new)
2. Name it `qr` (or anything — the repo name becomes the URL path)
3. Public repo
4. Do **not** add README, .gitignore, or license (you already have files)

### 2. Push this code

```bash
git remote add origin git@github.com:YOUR_USERNAME/qr.git
git add index.html 404.html links.json README.md
git commit -m "Add QR redirect router"
git push -u origin main
```

### 3. Enable Pages

1. Repo → **Settings** → **Pages**
2. **Build and deployment** → Source: **Deploy from a branch**
3. Branch: `main` → folder: `/ (root)` → **Save**
4. Wait 1–2 minutes

Your site: `https://YOUR_USERNAME.github.io/qr/`

### 4. Set your destinations

Edit `links.json` with real URLs, commit, push.

### 5. Make the QR code

Point the QR at:

```
https://YOUR_USERNAME.github.io/qr/go
```

Use any QR generator ([qr-code-generator.com](https://www.qr-code-generator.com/), macOS Shortcuts, etc.). You never reprint the QR — only change `links.json`.

## Change a destination later

```bash
# edit links.json
git add links.json
git commit -m "Update go destination"
git push
```

Changes usually show up in under a minute. `links.json` is fetched with a cache-buster (`?t=timestamp`), but GitHub's CDN can lag occasionally — wait a few minutes if it looks stale.

## Local test

```bash
python3 -m http.server 8080
```

Open:

- [http://localhost:8080/](http://localhost:8080/) → `go` fallback
- [http://localhost:8080/go](http://localhost:8080/go) → needs a local server that serves `index.html` for unknown paths; GitHub Pages handles this via `404.html`

For local `/go` testing without extra config, open `http://localhost:8080/?` and temporarily use hash routing, or just trust the GitHub deploy — root URL works locally.

## Why 404.html exists

GitHub Pages is static. A request to `/qr/go` does **not** automatically run `index.html` — it looks for a `go` file, fails, then serves `404.html` if present. Without `404.html`, `/qr/go` shows GitHub's 404 page and the redirect never runs.

`index.html` handles the root (`/qr/`). `404.html` handles every slug path (`/qr/go`, `/qr/menu`, …).

## Multiple QR codes, one repo

Add more keys to `links.json`:

```json
{
  "go": "https://main-site.com",
  "menu": "https://main-site.com/menu",
  "hire": "https://main-site.com/careers"
}
```

| QR points to | Redirects to |
|--------------|--------------|
| `…/qr/go` | `links.go` |
| `…/qr/menu` | `links.menu` |
| `…/qr/hire` | `links.hire` |

## Custom domain (optional)

1. Repo → **Settings** → **Pages** → **Custom domain** → enter domain
2. At your DNS provider, add the records GitHub shows (usually `CNAME` `www` → `YOUR_USERNAME.github.io`)
3. Enable **Enforce HTTPS**

Then QR codes use `https://yourdomain.com/go` instead of the `github.io` URL.

## Limits

- Public URLs only (it's client-side JS + a JSON file)
- No click analytics
- GitHub Pages free tier is fine for QR redirect traffic
- `links.json` is public — don't put secrets in it
