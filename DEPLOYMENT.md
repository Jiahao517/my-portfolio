# Deployment Notes

This project is deployed as a Dockerized Next.js standalone app on Tencent Cloud Lighthouse.

## Production

- Primary domain: `http://zhongjiahao.art`
- WWW domain: `http://www.zhongjiahao.art`
- Server public IPv4: `43.156.238.85`
- Cloud provider: Tencent Cloud Lighthouse
- Region: Singapore
- Image: Docker CE
- App directory on server: `/opt/my-portfolio`
- Container name: `my-portfolio`
- App port inside server: `3000`
- Public traffic: `80` -> Nginx -> `127.0.0.1:3000`

## DNS

The active domains are:

```text
A    zhongjiahao.art        43.156.238.85
A    www.zhongjiahao.art    43.156.238.85
```

Both records are managed from the Tencent Cloud Lighthouse domain binding page and currently show normal resolution.

## Firewall

Keep these ports open:

```text
22     SSH / Tencent Cloud login
80     HTTP
443    HTTPS
```

Do not expose `3000` publicly. Nginx reaches the Next.js container through localhost.

The default Windows remote desktop rules for `3389` are not needed for this Linux server and can stay deleted.

## Nginx

The active site config should contain:

```nginx
server {
    listen 80;
    server_name zhongjiahao.art www.zhongjiahao.art;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Expected path on Ubuntu/Debian-style images:

```bash
/etc/nginx/sites-available/my-portfolio
/etc/nginx/sites-enabled/my-portfolio
```

Reload after changes:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

If the domain shows the default "Welcome to nginx!" page, the DNS is working but Nginx is not matching the domain. Check `server_name` and remove/disable the default site:

```bash
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## First Deploy / Redeploy

A deploy helper is included at:

```bash
scripts/deploy-tencent-lighthouse.sh
```

On the Tencent Cloud server, redeploy from GitHub with:

```bash
cd /opt/my-portfolio
git pull
SITE_URL="http://zhongjiahao.art" sh scripts/deploy-tencent-lighthouse.sh
```

Or from anywhere on the server:

```bash
curl -fsSL https://raw.githubusercontent.com/Jiahao517/my-portfolio/main/scripts/deploy-tencent-lighthouse.sh | SITE_URL="http://zhongjiahao.art" sh
```

If the GitHub repository is private, the raw `curl` command will return `404`. Make the repository public or use an authenticated deploy method.

## Local Change Workflow

After editing locally:

```bash
npm run build
git add .
git commit -m "Update portfolio"
git push
```

Then SSH/login to the Tencent Cloud server and run the redeploy commands above.

## Environment Variables

The chat API uses:

```text
OPENAI_API_KEY
OPENAI_BASE_URL
NEXT_PUBLIC_SITE_URL
```

`OPENAI_API_KEY` is optional for basic site access. Without it, `/api/chat` returns the demo fallback response.

When HTTPS is enabled, use:

```bash
SITE_URL="https://zhongjiahao.art" sh scripts/deploy-tencent-lighthouse.sh
```

## HTTPS Todo

Current production access is HTTP. Next step is enabling HTTPS for:

```text
zhongjiahao.art
www.zhongjiahao.art
```

Recommended simple path:

```bash
sudo apt update
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d zhongjiahao.art -d www.zhongjiahao.art
```

After HTTPS is working, redeploy with `SITE_URL="https://zhongjiahao.art"` so metadata URLs use HTTPS.
