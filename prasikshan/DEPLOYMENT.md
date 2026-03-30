# Deployment Guide for akt9802.in

This guide covers deploying the Prasikshan Next.js application using Docker and Nginx.

## Prerequisites

- Docker installed on your server
- Nginx installed on your server
- Redis installed on your server (`sudo apt install redis-server -y`)
- SSL certificate for akt9802.in (Let's Encrypt)
- Domain DNS configured to point to your server IP

---

## Step 1: Prepare Environment Variables

```bash
cp .env.example .env
nano .env
```

Fill in all values including:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
SMTP_HOST=...
CLOUDINARY_CLOUD_NAME=...
```

> `REDIS_URL` must be `redis://localhost:6379` — the container uses `--network host` so localhost works directly.

---

## Step 2: Start Redis

```bash
sudo systemctl start redis-server
sudo systemctl enable redis-server   # auto-start on reboot

# Verify Redis is running
redis-cli ping   # Should return: PONG
```

---

## Step 3: Build Docker Image

```bash
docker build -t prasikshan .
```

> If you made code changes and the build is using old cache, force a fresh build:
> ```bash
> docker build --no-cache -t prasikshan .
> ```

---

## Step 4: Run Docker Container

```bash
docker run -d \
  --name prasikshan-app \
  --restart unless-stopped \
  --network host \
  --env-file .env \
  prasikshan
```

> **Important:** Use `--network host` so the container can reach Redis on localhost.
> Do NOT use `-p 3000:3000` with `--network host` — the port is shared automatically.
> App will be accessible on port 3000.

---

## Step 5: Verify Deployment

```bash
# Check container is running
docker ps

# Check logs — you should see both connected
docker logs prasikshan-app | grep -E "Redis|MongoDB"
# Expected:
# ✅ Redis connected
# MongoDB connected successfully

# Test Redis is storing tokens (login first, then run)
redis-cli keys "refreshToken:*"
```

Visit https://akt9802.in in your browser.

---

## Step 6: Configure Nginx

```bash
sudo cp prasikshan.nginx.conf /etc/nginx/sites-available/prasikshan
sudo ln -s /etc/nginx/sites-available/prasikshan /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

SSL certificate:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d akt9802.in -d www.akt9802.in
```

---

## Update Application (Standard Deploy Flow)

```bash
# 1. Pull latest code
git pull origin main

# 2. Stop and remove old container
docker stop prasikshan-app
docker rm prasikshan-app

# 3. Rebuild image (use --no-cache if code changes aren't picked up)
docker build -t prasikshan .

# 4. Run new container
docker run -d \
  --name prasikshan-app \
  --restart unless-stopped \
  --network host \
  --env-file .env \
  prasikshan

# 5. Verify
docker logs prasikshan-app
```

---

## Useful Commands

### Docker
```bash
docker logs -f prasikshan-app      # live logs
docker logs prasikshan-app         # all logs
docker restart prasikshan-app      # restart
docker stop prasikshan-app         # stop
docker rm prasikshan-app           # remove container
docker rmi prasikshan              # remove image
```

### Redis
```bash
redis-cli ping                          # check running → PONG
redis-cli keys "refreshToken:*"         # view active sessions
redis-cli flushall                      # clear all Redis data (use carefully)
sudo systemctl status redis-server      # service status
sudo systemctl restart redis-server     # restart Redis
```

### Nginx
```bash
sudo nginx -t                           # test config
sudo systemctl reload nginx             # reload
sudo tail -f /var/log/nginx/error.log   # error logs
```

---

## Troubleshooting

### Redis ECONNREFUSED in Docker logs
- Make sure container is started with `--network host`
- Make sure `REDIS_URL=redis://localhost:6379` in `.env`
- Verify Redis is running: `redis-cli ping`

### Sign-in not working
```bash
docker logs prasikshan-app | grep -E "Redis|Error"
```
- If Redis errors → fix Redis connection (see above)
- If no Redis errors → check MongoDB connection

### Build using old cached code
```bash
docker build --no-cache -t prasikshan .
```

### Container won't start
```bash
docker logs prasikshan-app
sudo lsof -i :3000   # check if port 3000 is already in use
```

### Nginx 502 Bad Gateway
```bash
docker ps                              # is container running?
curl localhost:3000                    # is app responding?
sudo tail -f /var/log/nginx/error.log  # nginx errors
```

### SSL Certificate
```bash
sudo certbot renew           # renew certificate
sudo certbot certificates    # check expiry
```

---

## Security Notes

- Never commit `.env` to version control
- Redis is currently bound to `127.0.0.1` only (safe — only accessible on the host)
- Firewall: only allow ports 80, 443, 22
- Regularly update Docker images and dependencies
