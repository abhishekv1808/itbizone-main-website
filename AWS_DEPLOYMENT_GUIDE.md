# AWS Deployment Guide for ITBIZONE Website

This guide covers multiple deployment options for AWS.

## Prerequisites

- AWS Account
- AWS CLI installed and configured
- MongoDB Atlas account (or AWS DocumentDB)
- Domain name (optional but recommended)

---

## Option 1: AWS Elastic Beanstalk (Recommended for Beginners)

### Step 1: Install EB CLI
```bash
pip install awsebcli
```

### Step 2: Initialize Elastic Beanstalk
```bash
eb init
```
- Select region (e.g., `us-east-1`)
- Choose application name: `itbizone-website`
- Platform: Node.js
- Select latest Node.js version (18.x)
- Setup SSH: Yes (optional)

### Step 3: Create Environment Variables
Create `.env` file with your MongoDB connection string:
```bash
PORT=3000
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your-secret-key
```

### Step 4: Create and Deploy Environment
```bash
eb create itbizone-prod
```

### Step 5: Set Environment Variables
```bash
eb setenv MONGODB_URI=your_mongodb_uri NODE_ENV=production PORT=3000
```

### Step 6: Deploy Updates
```bash
eb deploy
```

### Step 7: Open Application
```bash
eb open
```

### Managing Your App
- View logs: `eb logs`
- Check status: `eb status`
- SSH into instance: `eb ssh`
- Terminate environment: `eb terminate`

---

## Option 2: AWS EC2 with PM2

### Step 1: Launch EC2 Instance
1. Go to AWS Console → EC2
2. Launch Instance:
   - AMI: Ubuntu Server 22.04 LTS
   - Instance Type: t3.micro or t3.small
   - Security Group: Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS)
   - Create/select key pair

### Step 2: Connect to Instance
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

### Step 3: Install Node.js and Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

### Step 4: Clone Your Repository
```bash
cd /home/ubuntu
git clone https://github.com/abhishekv1808/itbizone-main-website.git
cd itbizone-main-website
```

### Step 5: Install Project Dependencies
```bash
npm install --production
```

### Step 6: Create Environment Variables
```bash
nano .env
```
Add your environment variables and save.

### Step 7: Start Application with PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 8: Configure Nginx as Reverse Proxy
```bash
sudo nano /etc/nginx/sites-available/itbizone
```

Add this configuration:
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

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/itbizone /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 9: Setup SSL with Let's Encrypt (Optional)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### PM2 Commands
- View logs: `pm2 logs`
- Monitor: `pm2 monit`
- Restart: `pm2 restart itbizone-website`
- Stop: `pm2 stop itbizone-website`
- List apps: `pm2 list`

---

## Option 3: AWS ECS with Docker

### Step 1: Build Docker Image
```bash
docker build -t itbizone-website .
```

### Step 2: Create ECR Repository
```bash
aws ecr create-repository --repository-name itbizone-website --region us-east-1
```

### Step 3: Authenticate Docker to ECR
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
```

### Step 4: Tag and Push Image
```bash
docker tag itbizone-website:latest YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/itbizone-website:latest
docker push YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/itbizone-website:latest
```

### Step 5: Create ECS Cluster
1. Go to AWS Console → ECS
2. Create Cluster (Fargate)
3. Create Task Definition
4. Create Service
5. Configure Load Balancer

---

## Option 4: AWS Lambda with Serverless Framework

### Step 1: Install Serverless
```bash
npm install -g serverless
```

### Step 2: Create serverless.yml
```yaml
service: itbizone-website

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  environment:
    MONGODB_URI: ${env:MONGODB_URI}
    NODE_ENV: production

functions:
  app:
    handler: lambda.handler
    events:
      - http:
          path: /{proxy+}
          method: ANY
          cors: true
```

### Step 3: Create Lambda Handler
Create `lambda.js`:
```javascript
const serverless = require('serverless-http');
const app = require('./app');

module.exports.handler = serverless(app);
```

### Step 4: Deploy
```bash
serverless deploy
```

---

## Database Setup

### MongoDB Atlas (Recommended)
1. Go to MongoDB Atlas
2. Create cluster
3. Add database user
4. Whitelist IP: `0.0.0.0/0` (for AWS - all IPs)
5. Get connection string
6. Update MONGODB_URI in environment variables

### AWS DocumentDB (Alternative)
1. Create DocumentDB cluster
2. Configure VPC and Security Groups
3. Create database and user
4. Get connection string

---

## Domain Configuration

### Route 53 Setup
1. Register domain or transfer existing
2. Create Hosted Zone
3. Add A Record pointing to:
   - EC2: Instance IP
   - Elastic Beanstalk: Environment URL (CNAME)
   - Load Balancer: ALB DNS name (Alias)

---

## Monitoring and Logs

### CloudWatch
- Automatic logging for Elastic Beanstalk and ECS
- Set up alarms for CPU, memory, errors

### PM2 on EC2
```bash
pm2 logs
pm2 monit
```

---

## Cost Optimization

1. **Start Small**: t3.micro for EC2, single instance for EB
2. **Auto Scaling**: Enable for production
3. **Reserved Instances**: For long-term savings
4. **CloudWatch Alarms**: Monitor costs

---

## Security Checklist

- ✅ Use HTTPS (SSL certificate)
- ✅ Environment variables for secrets
- ✅ Security Groups: Restrict access
- ✅ Regular updates: `apt update && apt upgrade`
- ✅ MongoDB authentication enabled
- ✅ Firewall configured (UFW on Ubuntu)
- ✅ Regular backups

---

## Recommended Approach

**For Production**: EC2 with PM2 + Nginx (Most control, cost-effective)
**For Quick Deploy**: Elastic Beanstalk (Easiest, managed)
**For Scalability**: ECS with Docker (Best for scaling)

---

## Support

For issues, check:
- AWS Documentation
- CloudWatch Logs
- PM2 logs: `pm2 logs`
- Application logs in `/logs` directory
