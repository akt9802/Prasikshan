# Deployment Guide for akt9802.in

This guide will help you deploy the Prasikshan Next.js application using Docker and Nginx.

## Prerequisites

- Docker and Docker Compose installed on your server
- Nginx installed on your server
- SSL certificate for akt9802.in (recommended: Let's Encrypt)
- Domain DNS configured to point to your server IP

## Step 1: Prepare Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` with your actual values:
```bash
nano .env
```

Fill in:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string for JWT tokens
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: Your email service credentials
- `SMTP_FROM_EMAIL`, `SMTP_FROM_NAME`: Email sender details

## Step 2: Build and Run Docker Container

1. Build the Docker image:
```bash
docker build -t prasikshan .
```

2. Run the container:
```bash
docker run -d \
  --name prasikshan-app \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env \
  prasikshan
```

3. Verify the container is running:
```bash
docker ps
docker logs -f prasikshan-app
```

The application should now be running on `localhost:3000`.

## Step 3: Configure Nginx

1. Copy the nginx configuration with your app name:
```bash
sudo cp prasikshan.nginx.conf /etc/nginx/sites-available/prasikshan
```

2. Create a symbolic link to enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/prasikshan /etc/nginx/sites-enabled/
```

3. Test nginx configuration:
```bash
sudo nginx -t
```

4. Reload nginx:
```bash
sudo systemctl reload nginx
```

5. Obtain SSL certificate using Certbot (this will automatically configure SSL in nginx):
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d akt9802.in -d www.akt9802.in
```

Certbot will automatically:
- Add SSL certificate configuration
- Set up HTTPS redirect from HTTP
- Configure SSL protocols and ciphers
- Set up auto-renewal

## Step 4: Verify Deployment

Visit https://akt9802.in in your browser. The application should be accessible.

## Useful Commands

### Docker Commands

- View logs: `docker logs -f prasikshan-app`
- Restart container: `docker restart prasikshan-app`
- Stop container: `docker stop prasikshan-app`
- Remove container: `docker rm prasikshan-app`
- Remove image: `docker rmi prasikshan`

### Nginx Commands

- Test configuration: `sudo nginx -t`
- Reload: `sudo systemctl reload nginx`
- Restart: `sudo systemctl restart nginx`
- View logs: `sudo tail -f /var/log/nginx/error.log`

### Update Application

1. Pull latest code:
```bash
git pull origin main
```

2. Stop and remove old container:
```bash
docker stop prasikshan-app
docker rm prasikshan-app
```

3. Rebuild image:
```bash
docker build -t prasikshan .
```

4. Run new container:
```bash
docker run -d \
  --name prasikshan-app \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env \
  prasikshan
```

## Troubleshooting

### Container won't start
- Check logs: `docker logs prasikshan-app`
- Verify environment variables in `.env`
- Ensure port 3000 is not already in use: `sudo lsof -i :3000`

### Nginx 502 Bad Gateway
- Verify Docker container is running: `docker ps`
- Check if app is listening on port 3000: `curl localhost:3000`
- Review nginx error logs: `sudo tail -f /var/log/nginx/error.log`

### SSL Certificate Issues
- Renew certificate: `sudo certbot renew`
- Check certificate expiry: `sudo certbot certificates`

## Security Recommendations

1. Keep your `.env` file secure and never commit it to version control
2. Regularly update Docker images and dependencies
3. Enable firewall and only allow necessary ports (80, 443, 22)
4. Set up automatic SSL certificate renewal
5. Regularly backup your MongoDB database
6. Monitor application logs for suspicious activity

## Monitoring

Consider setting up:
- Log aggregation (e.g., ELK stack)
- Application monitoring (e.g., PM2, New Relic)
- Uptime monitoring (e.g., UptimeRobot)
- Database backups (automated MongoDB backups)
