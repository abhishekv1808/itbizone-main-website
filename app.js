require('dotenv').config();
const express = require('express');
const path =require('path');
const rootDir = require('./utils/mainUtils');
const session = require('express-session');
const mongoose =require('mongoose');

// Use environment variable for MongoDB connection
const mongodbURL = process.env.MONGODB_URI || 'mongodb+srv://abhishekv1808:' + encodeURIComponent('Grow@$@2025') + '@aribnb.xvmlcnz.mongodb.net/itbizone?retryWrites=true&w=majority&appName=aribnb';

const userRouter = require('./routes/userRouter');
const quotationRouter = require('./routes/quotationRouter');
const newsletterRouter = require('./routes/newsletterRouter');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

// Browser Caching Strategy - Cache static assets
app.use(express.static(path.join(rootDir, 'public'), {
    maxAge: '1y', // Cache for 1 year
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
            // HTML files - no cache
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        } else if (filePath.match(/\.(css|js)$/)) {
            // CSS and JS - cache for 1 month
            res.setHeader('Cache-Control', 'public, max-age=2592000');
        } else if (filePath.match(/\.(jpg|jpeg|png|gif|ico|svg|webp)$/)) {
            // Images - cache for 1 year
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
    }
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Sitemap.xml route
app.get('/sitemap.xml', (req, res) => {
    const baseUrl = 'https://itbizone.com'; // Update with your actual domain
    const currentDate = new Date().toISOString().split('T')[0];
    
    const urls = [
        { loc: '/', priority: '1.0', changefreq: 'daily'},
        { loc: '/about', priority: '0.8', changefreq: 'weekly' },
        { loc: '/contact', priority: '0.8', changefreq: 'weekly' },
        { loc: '/portfolio', priority: '0.9', changefreq: 'weekly' },
        { loc: '/pricing', priority: '0.9', changefreq: 'weekly' },
        { loc: '/services/website-development', priority: '0.9', changefreq: 'weekly'},
        { loc: '/services/web-development', priority: '0.9', changefreq: 'weekly' },
        { loc: '/services/graphic-design', priority: '0.9', changefreq: 'weekly' },
        { loc: '/services/digital-marketing', priority: '0.9', changefreq: 'weekly' },
        { loc: '/services/ui-ux', priority: '0.9', changefreq: 'weekly'},
        { loc: '/quotation', priority: '0.7', changefreq: 'monthly' }
    ];

    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    urls.forEach(url => {
        sitemap += '  <url>\n';
        sitemap += `    <loc>${baseUrl}${url.loc}</loc>\n`;
        sitemap += `    <lastmod>${currentDate}</lastmod>\n`;
        sitemap += `    <changefreq>${url.changefreq}</changefreq>\n`;
        sitemap += `    <priority>${url.priority}</priority>\n`;
        sitemap += '  </url>\n';
    });
    
    sitemap += '</urlset>';
    
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
});

// Robots.txt route
app.get('/robots.txt', (req, res) => {
    const robots = `User-agent: *
Allow: /
Sitemap: https://itbizone.com/sitemap.xml

User-agent: *
Disallow: /admin/
Disallow: /api/`;
    
    res.type('text/plain');
    res.send(robots);
});

app.use(userRouter);
app.use(quotationRouter); 
app.use(newsletterRouter); 

// Use environment variable for port
const port = process.env.PORT || 3000;

// Health check endpoint for AWS
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('user/404', { pageTitle: 'Page Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

mongoose.connect(mongodbURL).then(()=>{
    console.log('Connected to MongoDB');
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}).catch((err)=>{
  console.log('MongoDB connection error:', err);
  process.exit(1);
})
