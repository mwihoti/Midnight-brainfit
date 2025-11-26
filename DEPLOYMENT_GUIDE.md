# GameFit - Next.js Deployment Guide

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - Created by Next.js team)

#### Prerequisites
- Vercel account (free tier available)
- GitHub repository (or Vercel can import)

#### Deployment Steps
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy from project directory
vercel

# 3. Follow prompts:
#    - Link to existing project or create new
#    - Framework: Next.js
#    - Root directory: ./gamefit
#    - Build command: npm run build
#    - Output directory: .next

# 4. Set environment variables in Vercel dashboard
NEXT_PUBLIC_MIDNIGHT_NODE_URL=https://...
NEXT_PUBLIC_LACE_WALLET_ID=...
```

#### Production URL
```
https://gamefit-[generated-name].vercel.app
```

### Option 2: Self-Hosted (Node.js Server)

#### Prerequisites
- Linux server (Ubuntu 20.04+)
- Node.js 18+
- PM2 or similar process manager

#### Setup Steps
```bash
# 1. SSH into server
ssh user@your-server.com

# 2. Clone repository
git clone https://github.com/yourusername/gamefit.git
cd gamefit

# 3. Install dependencies
npm ci  # Use npm ci for exact versions

# 4. Build application
npm run build

# 5. Install PM2 globally
npm install -g pm2

# 6. Start application with PM2
pm2 start npm --name "gamefit" -- start

# 7. Configure PM2 to restart on reboot
pm2 startup
pm2 save
```

#### Nginx Reverse Proxy Setup
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### SSL with Let's Encrypt (Recommended)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d yourdomain.com

# Configure auto-renewal
sudo systemctl enable certbot.timer
```

### Option 3: Docker (Cloud Platforms)

#### Dockerfile
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]
```

#### docker-compose.yml
```yaml
version: '3.8'
services:
  gamefit:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_MIDNIGHT_NODE_URL=${MIDNIGHT_NODE_URL}
      - NEXT_PUBLIC_LACE_WALLET_ID=${LACE_WALLET_ID}
    restart: unless-stopped
```

#### Deploy to Docker Hub
```bash
# Build image
docker build -t yourusername/gamefit:latest .

# Push to Docker Hub
docker push yourusername/gamefit:latest

# Pull and run anywhere
docker pull yourusername/gamefit:latest
docker run -p 3000:3000 -e MIDNIGHT_NODE_URL=... yourusername/gamefit:latest
```

#### Deploy to Popular Platforms

**AWS ECS:**
```bash
# Push to ECR
aws ecr get-login-password | docker login --username AWS --password-stdin [account].dkr.ecr.[region].amazonaws.com
docker tag gamefit:latest [account].dkr.ecr.[region].amazonaws.com/gamefit:latest
docker push [account].dkr.ecr.[region].amazonaws.com/gamefit:latest
```

**Google Cloud Run:**
```bash
# Build and deploy
gcloud run deploy gamefit \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

**AWS Lambda (with Serverless Framework):**
```bash
npm install -g serverless
npm install --save-dev serverless-next.js
serverless deploy
```

## 🔐 Environment Variables for Production

### Create `.env.production.local`
```env
# Midnight Blockchain
NEXT_PUBLIC_MIDNIGHT_NODE_URL=https://prod-midnight-node.example.com
NEXT_PUBLIC_LACE_WALLET_ID=your-production-wallet-id

# Optional: API endpoints
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
API_SECRET_KEY=your-secret-key

# Optional: Analytics
NEXT_PUBLIC_GA_ID=UA-xxx-xxx
```

### Do NOT commit to repo
```bash
echo ".env.production.local" >> .gitignore
```

## 📊 Pre-Deployment Checklist

- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors: `npm run type-check`
- [ ] ESLint passes: `npm run lint`
- [ ] Environment variables set
- [ ] Database/blockchain connections verified
- [ ] API endpoints tested
- [ ] SSL certificate configured (for HTTPS)
- [ ] Backup plan in place
- [ ] Monitor/logging configured
- [ ] Performance tested with real load

## 🎯 Production Optimization

### Enable Performance Monitoring
```typescript
// lib/analytics.ts
import { useEffect } from 'react'

export function useWebVitals() {
  useEffect(() => {
    if ('web-vital' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log)
        getFID(console.log)
        getFCP(console.log)
        getLCP(console.log)
        getTTFB(console.log)
      })
    }
  }, [])
}
```

### Configure Logging
```typescript
// lib/logger.ts
export const logger = {
  info: (msg: string, data?: any) => console.log(`[INFO] ${msg}`, data),
  error: (msg: string, error?: Error) => console.error(`[ERROR] ${msg}`, error),
  warn: (msg: string, data?: any) => console.warn(`[WARN] ${msg}`, data),
}
```

### Setup Error Tracking (Sentry)
```bash
npm install @sentry/nextjs
```

```typescript
// pages/_app.tsx
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
})
```

## 🔄 CI/CD Pipeline (GitHub Actions)

### `.github/workflows/deploy.yml`
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      
      - name: Deploy to Vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: npx vercel --prod --token $VERCEL_TOKEN
```

## 🚨 Monitoring & Logging

### Key Metrics to Track
- Page load time (target: < 2s)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- Time to Interactive (TTI)

### Set Alerts For
- Build failures
- Error rate > 1%
- Response time > 3s
- Memory usage > 80%
- CPU usage > 90%

## 🔄 Rollback Strategy

```bash
# Keep previous deployment
vercel --prod  # Creates new deployment

# Rollback to previous
vercel rollback

# Or with GitHub:
git revert [commit-hash]
git push
# Auto-redeploys previous version
```

## 📈 Scaling Considerations

### Horizontal Scaling
- Use load balancer (Nginx, HAProxy)
- Run multiple Next.js instances
- Implement session storage (Redis)

### Vertical Scaling
- Increase server CPU/RAM
- Optimize database queries
- Cache static assets (CDN)

### Database Scaling
- Add read replicas for Midnight node
- Implement query caching
- Archive old metrics data

## 🎓 Deployment Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Loading
```bash
# Verify they're public (NEXT_PUBLIC_*)
# Restart deployment after adding to platform
```

### Performance Issues
```bash
# Analyze bundle size
npm run analyze  # (add to package.json)

# Check Next.js performance metrics
npm run build -- --debug
```

### Memory Issues
```bash
# Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

## 📚 Deployment Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **PM2 Guide**: https://pm2.keymetrics.io
- **Docker Deployment**: https://docs.docker.com
- **Nginx Configuration**: https://nginx.org/en/docs

## ✅ Post-Deployment

1. **Test Functionality**
   - Complete game flow
   - Wallet connection
   - Caregiver access
   - Data encryption

2. **Monitor First 24 Hours**
   - Error logs
   - Performance metrics
   - User feedback

3. **Setup Automated Backups**
   - Database backups (Midnight)
   - Configuration backups
   - Log rotation

4. **Document Production**
   - Server IP addresses
   - Admin credentials (secure storage)
   - Runbooks for common issues

---

**Ready to deploy? Choose your platform and follow the steps above! 🎉**
