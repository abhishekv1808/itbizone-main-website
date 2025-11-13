# ITBIZONE AWS Quick Start Guide

## 🚀 Fastest Way to Deploy (Recommended)

### Method 1: AWS EC2 with PM2 (Most Popular)

#### 1. Launch EC2 Instance
- **AMI**: Ubuntu Server 22.04 LTS
- **Instance Type**: t3.micro (free tier) or t3.small
- **Security Group Rules**:
  - SSH (22) - Your IP
  - HTTP (80) - Anywhere
  - HTTPS (443) - Anywhere

#### 2. Connect and Setup
```bash
# SSH into your instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Clone your repository
git clone https://github.com/abhishekv1808/itbizone-main-website.git
cd itbizone-main-website
```

#### 3. Configure Environment
```bash
# Copy and edit environment file
cp .env.example .env
nano .env
```

Add your MongoDB URI:
```env
PORT=3000
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
SESSION_SECRET=your-random-secret-key
```

#### 4. Install and Start
```bash
# Install dependencies
npm install --production

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Copy and run the command it shows
```

#### 5. Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/itbizone
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/itbizone /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. Setup SSL (Optional but Recommended)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

#### 7. Done! 🎉
Your site is now live at `http://your-ec2-ip` or `http://your-domain.com`

---

### Method 2: AWS Elastic Beanstalk (Easiest)

#### 1. Install EB CLI
```bash
pip install awsebcli
```

#### 2. Initialize and Deploy
```bash
# Initialize EB in your project
eb init

# Create environment and deploy
eb create itbizone-prod

# Set environment variables
eb setenv MONGODB_URI=your_connection_string NODE_ENV=production

# Deploy future updates
eb deploy

# Open in browser
eb open
```

---

## 📋 Pre-Deployment Checklist

- ✅ MongoDB Atlas cluster created
- ✅ Database user created with password
- ✅ Network access set to 0.0.0.0/0 (for AWS)
- ✅ Connection string copied
- ✅ .env file configured
- ✅ Domain name (optional)
- ✅ SSL certificate (optional but recommended)

---

## 🔧 MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create account and cluster (free M0 tier available)
3. Database Access → Add User → Create username/password
4. Network Access → Add IP → Allow from Anywhere (0.0.0.0/0)
5. Connect → Drivers → Copy connection string
6. Replace `<password>` with your password
7. Add to `.env` file

---

## 📊 Useful Commands

### PM2 Commands
```bash
pm2 list                    # List all processes
pm2 logs itbizone-website   # View logs
pm2 monit                   # Monitor resources
pm2 restart itbizone-website # Restart app
pm2 stop itbizone-website   # Stop app
pm2 delete itbizone-website # Remove from PM2
```

### EB Commands
```bash
eb status                   # Check environment status
eb logs                     # View logs
eb ssh                      # SSH into instance
eb deploy                   # Deploy changes
eb terminate                # Delete environment
```

### Update Application
```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install --production

# Restart application
pm2 restart itbizone-website
```

---

## 🛡️ Security Best Practices

1. **Change MongoDB Password**: Use strong password
2. **Environment Variables**: Never commit .env file
3. **Firewall**: Restrict SSH to your IP
4. **SSL Certificate**: Use HTTPS in production
5. **Regular Updates**: Keep packages updated

---

## 💰 Cost Estimate

### Free Tier (First Year)
- **EC2 t3.micro**: 750 hours/month free
- **MongoDB Atlas M0**: Free forever
- **Total**: $0/month

### After Free Tier
- **EC2 t3.micro**: ~$8-10/month
- **EC2 t3.small**: ~$15-18/month
- **Domain**: ~$12/year
- **SSL**: Free (Let's Encrypt)

---

## 🆘 Troubleshooting

### Application won't start
```bash
# Check logs
pm2 logs itbizone-website

# Check if port 3000 is in use
sudo lsof -i :3000

# Restart application
pm2 restart itbizone-website
```

### Can't connect to MongoDB
- Check MongoDB Atlas network access (allow 0.0.0.0/0)
- Verify connection string in .env
- Check database user credentials

### Nginx issues
```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

---

## 📞 Support

For detailed deployment guide, see `AWS_DEPLOYMENT_GUIDE.md`

---

**Ready to deploy? Start with Method 1 (EC2 + PM2) for full control!** 🚀
