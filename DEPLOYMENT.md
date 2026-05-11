# Deployment Notes

This project is deployed as a Dockerized Next.js standalone app on Tencent Cloud Lighthouse.

## Production Overview

- Primary domain: `https://www.zhongjiahao.art`
- Apex domain: `https://zhongjiahao.art`
- Server public IPv4: `43.156.238.85`
- Cloud provider: Tencent Cloud Lighthouse
- Region: Singapore
- Image: Docker CE
- App directory on server: `/opt/my-portfolio`
- Persistent analytics data: `/opt/my-portfolio-data`
- Container name: `my-portfolio`
- Container working directory: `/app`
- App port on server: `3000`
- Public traffic: `80/443` -> Nginx -> `127.0.0.1:3000`

Do not expose port `3000` publicly. Nginx reaches the Next.js container through localhost.

## DNS

The active DNS records are:

```text
A    zhongjiahao.art        43.156.238.85
A    www.zhongjiahao.art    43.156.238.85
```

Both records are managed from Tencent Cloud Lighthouse domain/DNS settings.

## Firewall

Keep these ports open in Tencent Cloud Lighthouse firewall:

```text
22     SSH / Tencent Cloud login
80     HTTP
443    HTTPS
```

The Windows remote desktop port `3389` is not needed for this Linux server.

## Environment Variables

Required for normal production deploy:

```text
OPENAI_API_KEY               Server-side key for /api/chat
OPENAI_BASE_URL              Provider host, without /v1
PUBLIC_HOST                  Public host used by Nginx, usually www.zhongjiahao.art
SITE_URL                     Public site URL, usually https://www.zhongjiahao.art
ANALYTICS_ADMIN_PASSWORD     Password for /admin/analytics
ANALYTICS_SALT               Fixed random salt for hashing visitor IPs
```

Optional:

```text
IPINFO_TOKEN                 Enables city / ASN / organization lookup for visitor IPs
NEXT_PUBLIC_CLARITY_ID       Enables Microsoft Clarity heatmaps
```

`ANALYTICS_SALT` must stay stable across deploys. Generate it once, save it, and reuse the same value:

```bash
openssl rand -hex 32
```

`OPENAI_BASE_URL` must be the provider host before the `/v1` path:

```text
https://api.openai.com
https://api.chatanywhere.tech
```

Do not set `OPENAI_BASE_URL` to `https://api.chatanywhere.tech/v1`. The app appends `/v1/chat/completions` itself.

## Redeploy From Tencent Cloud

Login to the Tencent Cloud server, then run:

```bash
cd /opt/my-portfolio
git pull
OPENAI_API_KEY="YOUR_OPENAI_KEY" \
OPENAI_BASE_URL="https://api.chatanywhere.tech" \
PUBLIC_HOST="www.zhongjiahao.art" \
SITE_URL="https://www.zhongjiahao.art" \
ANALYTICS_ADMIN_PASSWORD="YOUR_ANALYTICS_PASSWORD" \
ANALYTICS_SALT="YOUR_FIXED_RANDOM_SALT" \
sh scripts/deploy-tencent-lighthouse.sh
```

With IPinfo and Clarity enabled:

```bash
cd /opt/my-portfolio
git pull
OPENAI_API_KEY="YOUR_OPENAI_KEY" \
OPENAI_BASE_URL="https://api.chatanywhere.tech" \
PUBLIC_HOST="www.zhongjiahao.art" \
SITE_URL="https://www.zhongjiahao.art" \
ANALYTICS_ADMIN_PASSWORD="YOUR_ANALYTICS_PASSWORD" \
ANALYTICS_SALT="YOUR_FIXED_RANDOM_SALT" \
IPINFO_TOKEN="YOUR_IPINFO_TOKEN" \
NEXT_PUBLIC_CLARITY_ID="YOUR_CLARITY_ID" \
sh scripts/deploy-tencent-lighthouse.sh
```

The deploy script will:

1. Install/update `git` and `nginx`.
2. Ensure Docker is running.
3. Fetch/reset `/opt/my-portfolio` to `origin/main`.
4. Build the Docker image.
5. Recreate the `my-portfolio` container.
6. Mount analytics data from `/opt/my-portfolio-data` to `/app/data`.
7. Generate/reload Nginx config.
8. Preserve HTTPS config if the Let's Encrypt certificate exists.

## First Deploy

If `/opt/my-portfolio` does not exist yet:

```bash
sudo mkdir -p /opt
cd /opt
sudo git clone https://github.com/Jiahao517/my-portfolio.git
cd /opt/my-portfolio
```

Then run the redeploy command above.

If the GitHub repository is private, configure authenticated Git access first.

## HTTPS

The server uses Let's Encrypt certificates at:

```text
/etc/letsencrypt/live/zhongjiahao.art/fullchain.pem
/etc/letsencrypt/live/zhongjiahao.art/privkey.pem
```

If HTTPS is missing or port `443` refuses connections, install Certbot and create/reinstall the certificate:

```bash
sudo apt update
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d www.zhongjiahao.art -d zhongjiahao.art
```

If Certbot cannot find a matching Nginx server block, make sure the active Nginx config has:

```nginx
server_name www.zhongjiahao.art;
```

The deploy script writes HTTPS config automatically when the certificate files exist.

Expected Nginx paths on Ubuntu/Debian-style images:

```text
/etc/nginx/sites-available/my-portfolio
/etc/nginx/sites-enabled/my-portfolio
```

Validate and reload manually if needed:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Streaming chat through Nginx

`/api/chat` streams tokens from the server. If production replies appear all at once while local preview streams normally, check that Nginx is not buffering the route:

```nginx
location /api/chat {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_buffering off;
    proxy_cache off;
    gzip off;
    add_header X-Accel-Buffering no;
}
```

After editing the live Nginx config:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Analytics

The site has a private analytics dashboard:

```text
https://www.zhongjiahao.art/admin/analytics
```

Basic Auth:

```text
username: any value, e.g. admin
password: ANALYTICS_ADMIN_PASSWORD
```

Analytics data is stored as JSONL on the server:

```text
/opt/my-portfolio-data/analytics/events.jsonl
/opt/my-portfolio-data/analytics/events.jsonl.1
```

The app stores:

- Anonymous visitor/session ids
- Page views
- Heartbeat duration
- Section dwell time
- Scroll depth
- Button/link clicks
- Device/browser summary
- IP hash
- Optional city / ASN / organization from IPinfo

The app does not store or display raw IP addresses in the dashboard.

If `IPINFO_TOKEN` is omitted, analytics still works, but city / ASN / organization detection is limited.

If `NEXT_PUBLIC_CLARITY_ID` is omitted, self-hosted analytics still works, but Microsoft Clarity heatmaps are disabled.

## Verification After Deploy

Run these on the server:

```bash
curl -I https://www.zhongjiahao.art/
curl -I https://www.zhongjiahao.art/admin/analytics
sudo nginx -T | grep -n "listen 443\|server_name\|ssl_certificate"
docker ps --filter "name=my-portfolio"
```

Expected:

```text
https://www.zhongjiahao.art/                 HTTP/1.1 200 OK
https://www.zhongjiahao.art/admin/analytics HTTP/1.1 401 Unauthorized
```

`401 Unauthorized` for `/admin/analytics` is correct. It means the dashboard is password protected.

To verify event ingestion:

1. Open `https://www.zhongjiahao.art/`.
2. Scroll and click a few buttons.
3. Open `https://www.zhongjiahao.art/admin/analytics`.
4. Confirm recent visitor/session data appears.

## Local Change Workflow

Before pushing:

```bash
npm run test
npm run lint
npm run typecheck
npm run build
```

Then:

```bash
git add .
git commit -m "Update portfolio"
git push
```

After pushing, login to Tencent Cloud and run the redeploy command.

## Useful Operations

Check container logs:

```bash
docker logs --tail 200 my-portfolio
```

Restart the app container:

```bash
docker restart my-portfolio
```

Check Nginx status:

```bash
sudo systemctl status nginx
sudo nginx -t
```

Check analytics data size:

```bash
du -sh /opt/my-portfolio-data
ls -lh /opt/my-portfolio-data/analytics
```

If the site shows the default Nginx welcome page, disable the default site and reload:

```bash
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## Notes And Limits

- IP-based organization detection is probabilistic. It can suggest Alibaba/Ant-related networks, but cannot identify a specific person or exact office building.
- HR/interviewer satisfaction should be inferred from behavior signals: dwell time, case depth, scroll completion, and contact clicks.
- Microsoft Clarity can provide heatmaps. Configure masking in Clarity if session replay is enabled.
