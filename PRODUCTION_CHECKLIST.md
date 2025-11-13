# Production Checklist for AWS Deployment

## ✅ Before Deployment

### 1. Environment Setup
- [ ] `.env` file created from `.env.example`
- [ ] MongoDB Atlas cluster created
- [ ] MongoDB connection string updated in `.env`
- [ ] `SESSION_SECRET` changed to random secure string
- [ ] `NODE_ENV` set to `production`

### 2. Database Configuration
- [ ] MongoDB Atlas network access: 0.0.0.0/0 allowed
- [ ] Database user created with strong password
- [ ] Database name matches connection string
- [ ] Collections indexed for performance

### 3. Code Review
- [ ] All console.logs removed or replaced with proper logging
- [ ] Error handlers in place
- [ ] CORS configured if needed
- [ ] Rate limiting added (optional)
- [ ] Input validation on all routes

### 4. Security
- [ ] Sensitive data in environment variables only
- [ ] `.env` file in `.gitignore`
- [ ] HTTPS/SSL certificate configured
- [ ] Security headers set in Nginx
- [ ] MongoDB credentials secured

### 5. Performance
- [ ] Static assets cached
- [ ] Gzip compression enabled
- [ ] Image optimization complete
- [ ] Database queries optimized
- [ ] CDN considered for static files (optional)

---

## 🚀 Deployment Steps

### AWS EC2 Deployment

#### Phase 1: Server Setup
```bash
# 1. Connect to EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# 2. Update system
sudo apt update && sudo apt upgrade -y

# 3. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 4. Install PM2 and Nginx
sudo npm install -g pm2
sudo apt install -y nginx
```

#### Phase 2: Application Setup
```bash
# 5. Clone repository
git clone https://github.com/abhishekv1808/itbizone-main-website.git
cd itbizone-main-website

# 6. Configure environment
cp .env.example .env
nano .env
# Add your MongoDB URI and secrets

# 7. Install dependencies
npm install --production

# 8. Start application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Phase 3: Nginx Configuration
```bash
# 9. Configure Nginx
sudo nano /etc/nginx/sites-available/itbizone

# Paste the configuration from AWS_DEPLOYMENT_GUIDE.md

# 10. Enable site
sudo ln -s /etc/nginx/sites-available/itbizone /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Phase 4: SSL Setup (Production Must-Have)
```bash
# 11. Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# 12. Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 13. Auto-renewal (already setup by certbot)
sudo certbot renew --dry-run
```

---

## 🔍 Post-Deployment Verification

### 1. Health Checks
- [ ] Visit `http://your-domain.com/health` - Should return `{"status":"OK"}`
- [ ] Test all major routes (/, /about, /contact, /services, etc.)
- [ ] Check MongoDB connection in logs
- [ ] Verify SSL certificate (green lock in browser)

### 2. Performance Testing
```bash
# Check PM2 status
pm2 status

# Monitor resource usage
pm2 monit

# View application logs
pm2 logs itbizone-website
```

### 3. Functionality Testing
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Contact form submits (test submission)
- [ ] Quotation system functional
- [ ] Portfolio images load
- [ ] Case studies accessible
- [ ] 404 page shows for invalid routes

### 4. Security Verification
```bash
# Check SSL certificate
curl -I https://yourdomain.com

# Verify headers
curl -I https://yourdomain.com | grep -i "X-Frame\|X-Content\|X-XSS"

# Check firewall
sudo ufw status
```

---

## 📊 Monitoring Setup

### PM2 Monitoring
```bash
# Real-time monitoring
pm2 monit

# Check logs
pm2 logs --lines 50

# Memory and CPU usage
pm2 status
```

### Nginx Logs
```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### Application Logs
```bash
# Create logs directory if not exists
mkdir -p logs

# View application logs
pm2 logs itbizone-website --lines 100
```

---

## 🔄 Update Deployment

### When you push code changes:

```bash
# On your EC2 instance
cd itbizone-main-website

# Pull latest changes
git pull origin main

# Install new dependencies (if any)
npm install --production

# Restart application
pm2 restart itbizone-website

# Verify
pm2 logs itbizone-website --lines 20
```

### Automated deployment script:
```bash
# Make deploy.sh executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

---

## 🛡️ Backup Strategy

### Database Backup (MongoDB Atlas)
- Automatic backups enabled by default on M10+ clusters
- For M0 (free tier), use `mongodump`:
```bash
mongodump --uri="your_connection_string" --out=/backup/$(date +%Y%m%d)
```

### Code Backup
- Code is in GitHub (already backed up)
- `.env` file should be backed up separately (secure location)

### Media Files Backup
```bash
# Backup public/images directory
tar -czf images-backup-$(date +%Y%m%d).tar.gz public/images/
```

---

## 🚨 Rollback Plan

### If deployment fails:

```bash
# View previous commits
git log --oneline -5

# Rollback to previous version
git checkout <previous-commit-hash>

# Restart application
pm2 restart itbizone-website
```

---

## 💡 Optimization Tips

### 1. Enable PM2 Cluster Mode
Already configured in `ecosystem.config.js` (uses all CPU cores)

### 2. Add Redis for Sessions (Optional)
```bash
sudo apt install redis-server
npm install connect-redis redis
```

### 3. Setup CDN (Optional)
- CloudFlare (free tier available)
- AWS CloudFront
- For static assets and images

### 4. Database Indexing
```javascript
// Add in your models
schema.index({ email: 1 });
schema.index({ createdAt: -1 });
```

---

## 📞 Emergency Contacts

### If site goes down:

1. **Check PM2**: `pm2 status`
2. **Check Logs**: `pm2 logs itbizone-website`
3. **Check Nginx**: `sudo systemctl status nginx`
4. **Check MongoDB**: Verify Atlas cluster status
5. **Restart Services**:
   ```bash
   pm2 restart itbizone-website
   sudo systemctl restart nginx
   ```

---

## ✅ Final Checklist

Before going live:
- [ ] Domain pointed to EC2 IP
- [ ] SSL certificate installed and working
- [ ] All environment variables set correctly
- [ ] PM2 startup script configured
- [ ] Nginx properly configured
- [ ] Firewall rules set (UFW)
- [ ] Database connection tested
- [ ] All features tested in production
- [ ] Monitoring setup complete
- [ ] Backup strategy in place
- [ ] Update deployment procedure documented
- [ ] Emergency rollback procedure tested

---

## 🎉 Success!

Your ITBIZONE website is now production-ready and deployed on AWS!

**Live URL**: https://yourdomain.com
**Admin**: Access via SSH to EC2 instance
**Monitoring**: Use `pm2 monit` for real-time stats

For detailed guides, see:
- `AWS_DEPLOYMENT_GUIDE.md` - Complete AWS deployment options
- `QUICK_START_AWS.md` - Quick start guide
- `README.md` - Project documentation

---

**Maintained by**: ITBIZONE Technologies Team
**Last Updated**: November 2025
