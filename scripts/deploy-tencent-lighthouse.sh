#!/usr/bin/env sh
set -eu

APP_NAME="my-portfolio"
REPO_URL="https://github.com/Jiahao517/my-portfolio.git"
APP_DIR="/opt/$APP_NAME"
APP_PORT="3000"
PUBLIC_HOST="${PUBLIC_HOST:-www.zhongjiahao.art}"
SITE_URL="${SITE_URL:-https://$PUBLIC_HOST}"
OPENAI_API_KEY="${OPENAI_API_KEY:-}"
OPENAI_BASE_URL="${OPENAI_BASE_URL:-}"
NEXT_PUBLIC_CLARITY_ID="${NEXT_PUBLIC_CLARITY_ID:-}"
ANALYTICS_ADMIN_PASSWORD="${ANALYTICS_ADMIN_PASSWORD:-}"
ANALYTICS_SALT="${ANALYTICS_SALT:-}"
IPINFO_TOKEN="${IPINFO_TOKEN:-}"

if [ "$(id -u)" -eq 0 ]; then
  SUDO=""
else
  SUDO="sudo"
fi

install_packages() {
  if command -v apt-get >/dev/null 2>&1; then
    $SUDO apt-get update
    $SUDO apt-get install -y git nginx
  elif command -v dnf >/dev/null 2>&1; then
    $SUDO dnf install -y git nginx
  elif command -v yum >/dev/null 2>&1; then
    $SUDO yum install -y git nginx
  else
    echo "Cannot find apt-get, dnf, or yum. Please install git and nginx manually."
    exit 1
  fi
}

ensure_docker() {
  if ! command -v docker >/dev/null 2>&1; then
    echo "Docker is not installed. Reinstall the server with Docker CE image or install Docker first."
    exit 1
  fi
  $SUDO systemctl enable --now docker >/dev/null 2>&1 || true
}

sync_repo() {
  if [ -d "$APP_DIR/.git" ]; then
    cd "$APP_DIR"
    $SUDO git fetch origin main
    $SUDO git reset --hard origin/main
  else
    $SUDO mkdir -p "$(dirname "$APP_DIR")"
    $SUDO git clone "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
  fi
}

build_and_run() {
  cd "$APP_DIR"
  $SUDO mkdir -p /opt/my-portfolio-data

  $SUDO docker build \
    --build-arg NEXT_PUBLIC_SITE_URL="$SITE_URL" \
    --build-arg NEXT_PUBLIC_CLARITY_ID="$NEXT_PUBLIC_CLARITY_ID" \
    -t "$APP_NAME" .

  $SUDO docker rm -f "$APP_NAME" >/dev/null 2>&1 || true

  $SUDO docker run -d \
    --name "$APP_NAME" \
    --restart unless-stopped \
    -p "$APP_PORT:$APP_PORT" \
    -v /opt/my-portfolio-data:/app/data \
    -e NEXT_PUBLIC_SITE_URL="$SITE_URL" \
    -e OPENAI_API_KEY="$OPENAI_API_KEY" \
    -e OPENAI_BASE_URL="$OPENAI_BASE_URL" \
    -e ANALYTICS_ADMIN_PASSWORD="$ANALYTICS_ADMIN_PASSWORD" \
    -e ANALYTICS_SALT="$ANALYTICS_SALT" \
    -e IPINFO_TOKEN="$IPINFO_TOKEN" \
    "$APP_NAME"
}

configure_nginx() {
  CERT_DIR="/etc/letsencrypt/live/zhongjiahao.art"

  if [ -d /etc/nginx/sites-available ]; then
    NGINX_CONF="/etc/nginx/sites-available/$APP_NAME"
    NGINX_LINK="/etc/nginx/sites-enabled/$APP_NAME"
    if [ -f "$CERT_DIR/fullchain.pem" ] && [ -f "$CERT_DIR/privkey.pem" ]; then
      $SUDO tee "$NGINX_CONF" >/dev/null <<EOF
server {
    listen 80;
    server_name $PUBLIC_HOST;

    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name $PUBLIC_HOST;

    ssl_certificate $CERT_DIR/fullchain.pem;
    ssl_certificate_key $CERT_DIR/privkey.pem;

    location /api/chat {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_buffering off;
        proxy_cache off;
        gzip off;
        add_header X-Accel-Buffering no;
    }

    location / {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
    else
      $SUDO tee "$NGINX_CONF" >/dev/null <<EOF
server {
    listen 80;
    server_name $PUBLIC_HOST;

    location /api/chat {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_buffering off;
        proxy_cache off;
        gzip off;
        add_header X-Accel-Buffering no;
    }

    location / {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
    fi
    $SUDO ln -sf "$NGINX_CONF" "$NGINX_LINK"
  else
    NGINX_CONF="/etc/nginx/conf.d/$APP_NAME.conf"
    if [ -f "$CERT_DIR/fullchain.pem" ] && [ -f "$CERT_DIR/privkey.pem" ]; then
      $SUDO tee "$NGINX_CONF" >/dev/null <<EOF
server {
    listen 80;
    server_name $PUBLIC_HOST;

    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name $PUBLIC_HOST;

    ssl_certificate $CERT_DIR/fullchain.pem;
    ssl_certificate_key $CERT_DIR/privkey.pem;

    location /api/chat {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_buffering off;
        proxy_cache off;
        gzip off;
        add_header X-Accel-Buffering no;
    }

    location / {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
    else
      $SUDO tee "$NGINX_CONF" >/dev/null <<EOF
server {
    listen 80;
    server_name $PUBLIC_HOST;

    location /api/chat {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_buffering off;
        proxy_cache off;
        gzip off;
        add_header X-Accel-Buffering no;
    }

    location / {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
    fi
  fi

  $SUDO nginx -t
  $SUDO systemctl enable --now nginx >/dev/null 2>&1 || true
  $SUDO systemctl reload nginx
}

install_packages
ensure_docker
sync_repo
build_and_run
configure_nginx

echo "Deployment finished."
echo "Open: $SITE_URL"
