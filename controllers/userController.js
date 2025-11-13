const {check, validationResult } = require('express-validator');
const ContactForm  = require('../models/contactFormModel');


exports.getHome =(req,res,next)=>{
    res.render('../views/user/home.ejs', {pageTitle : "Home | ITBIZONE"});
}

exports.getContactUs = (req,res,next)=>{
    const showSuccessModal = req.query.success === 'true';
    res.render('../views/user/contact.ejs', {
        pageTitle : "Contact Us | ITBIZONE", 
        oldInput :{
            fullName: '', 
            email: '', 
            mobileNumber: '', 
            company: '', 
            service: '', 
            description: '', 
            timeline: '',
            newsletter: ''
        }, 
        errors: [],
        showSuccessModal: showSuccessModal
    });
}


exports.getWebDevelopment = (req,res,next)=>{
    res.render('../views/user/web-development.ejs', {pageTitle : "Website Development Services | ITBIZONE"});
}

exports.getDigitalMarketing = (req,res,next)=>{
    res.render('../views/user/digital-marketing.ejs', {pageTitle : "Digital Marketing Services | ITBIZONE"});
}

exports.getGraphicDesign = (req,res,next)=>{
    res.render('../views/user/graphic-design.ejs', {pageTitle : "Graphic Design Services | ITBIZONE"});
}



exports.getPortfolio = (req,res,next)=>{
    res.render('../views/user/portfolio.ejs', {pageTitle : "Portfolio | ITBIZONE"});
}



exports.postContact = [

    check('fullName')
    .notEmpty().withMessage('Full Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Full Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Full Name must contain only letters and spaces')
    .custom((value) => {
        if (value.trim().split(' ').length < 2) {
            throw new Error('Please enter your full name (first and last name)');
        }
        return true;
    }),

    check('email')
    .notEmpty().withMessage('Email address is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail()
    .custom((value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            throw new Error('Please enter a valid email format');
        }
        return true;
    }),

    check('mobileNumber')
    .optional({ checkFalsy: true })
    .isMobilePhone('en-IN').withMessage('Please enter a valid Indian mobile number')
    .isLength({min:10, max:10}).withMessage('Mobile number must be exactly 10 digits')
    .matches(/^[6-9][0-9]{9}$/).withMessage('Please enter a valid Indian mobile number starting with 6, 7, 8, or 9'),

    check('company')
    .optional({ checkFalsy: true })
    .isLength({ min: 2, max: 100 }).withMessage('Company name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9\s&.-]+$/).withMessage('Company name contains invalid characters'),

    check('service')
    .optional({ checkFalsy: true })
    .isIn(['Website-Development', 'Graphic-Design', 'Digital-Marketing', 'Other', 'IT-Consulting']).withMessage('Please select a valid service'),

    check('description')
    .notEmpty().withMessage('Project description is required')
    .isLength({ min: 20, max: 1000 }).withMessage('Project description must be between 20 and 1000 characters')
    .custom((value) => {
        // Remove extra whitespace and check meaningful content
        const cleaned = value.trim().replace(/\s+/g, ' ');
        if (cleaned.length < 20) {
            throw new Error('Please provide a more detailed project description');
        }
        return true;
    }),

    check('timeline')
    .optional({ checkFalsy: true })
    .isIn(['asap', '1-month', '2-3-months', '3-6-months', '6-plus-months', 'just-exploring']).withMessage('Please select a valid timeline'),

    async(req,res,next)=>{
        const {fullName, email, mobileNumber, company, service, description, timeline, newsletter} = req.body;
        const errors = validationResult(req);
        
        if(!errors.isEmpty()){
            return res.status(422).render('../views/user/contact.ejs', {
                pageTitle: "Contact Us | ITBIZONE",
                errors: errors.array().map(err => err.msg),
                oldInput: {
                    fullName: fullName || '',
                    email: email || '',
                    mobileNumber: mobileNumber || '',
                    company: company || '',
                    service: service || '',
                    description: description || '',
                    timeline: timeline || '',
                    newsletter: newsletter || ''
                }
            });
        }

        try {
            const contactForm = new ContactForm({
                fullName: fullName.trim(),
                email: email.toLowerCase().trim(),
                mobileNumber: mobileNumber || '',
                company: company || '',
                service: service || '',
                description: description.trim(),
                timeline: timeline || '',
                newsletter: newsletter === 'yes'
            });

            await contactForm.save();
            
            // Redirect to contact page with success parameter
            res.redirect('/contact?success=true');
            
        } catch(err) {
            console.error('Contact form submission error:', err);
            return res.status(500).render('../views/user/contact.ejs', {
                pageTitle: "Contact Us | ITBIZONE",
                errors: ['An error occurred while submitting the form. Please try again later.'],
                oldInput: {
                    fullName: fullName || '',
                    email: email || '',
                    mobileNumber: mobileNumber || '',
                    company: company || '',
                    service: service || '',
                    description: description || '',
                    timeline: timeline || '',
                    newsletter: newsletter || ''
                }
            });
        }
    }
]


exports.getAboutUs = (req, res, next) => {
    res.render('../views/user/about.ejs', { pageTitle: "About Us | ITBIZONE" });
}

exports.getUIUX = (req, res, next) => {
    res.render('../views/user/ui-ux.ejs', { pageTitle: "UI/UX Design | ITBIZONE" });
}

exports.getPricing = (req, res, next) => {
    // Define all services with their details (prices in INR) - Realistic Indian Market Rates
    const services = {
        websiteDevelopment: {
            category: 'Website Development',
            description: 'Build, design, and optimize high-performing websites.',
            subServices: [
                { name: 'Custom Website Design & Development', price: 20000 },
                { name: 'Responsive Design & Mobile Optimization', price: 15000 },
                { name: 'CMS Development', price: 18000 },
                { name: 'Website Maintenance & Support', price: 6000 },
                { name: 'API Integration', price: 12000 },
                { name: 'E-commerce Development', price: 30000 },
                { name: 'Website Redesign & Modernization', price: 22000 },
                { name: 'UI/UX Design', price: 16000 },
                { name: 'Payment Gateway Integration', price: 10000 },
                { name: 'Web Application Development', price: 40000 },
                { name: 'Landing Page Design & Development', price: 8000 },
                { name: 'Performance Optimization', price: 12000 },
                { name: 'Website Security Implementation', price: 10000 },
                { name: 'SEO-Friendly Web Structure Development', price: 10000 },
                { name: 'Domain & Hosting Setup', price: 4000 }
            ]
        },
        graphicDesign: {
            category: 'Graphic Design',
            description: 'Create impactful visuals that define your brand.',
            subServices: [
                { name: 'Logo & Brand Identity Design', price: 25000 },
                { name: 'Brochure, Flyer & Poster Design', price: 12000 },
                { name: 'Business Card & Stationery Design', price: 8000 },
                { name: 'Social Media Post Design', price: 10000 },
                { name: 'Banner & Ad Creative Design', price: 12000 },
                { name: 'Infographics & Presentation Design', price: 15000 },
                { name: 'Packaging Design', price: 20000 },
                { name: 'UI/UX Design Mockups', price: 22000 },
                { name: 'Email Newsletter Design', price: 12000 },
                { name: 'Illustrations & Vector Art', price: 18000 },
                { name: 'Product Catalogue Design', price: 20000 },
                { name: 'Rebranding & Visual Refresh', price: 28000 },
                { name: 'Website & App Graphic Assets', price: 25000 },
                { name: 'Print Media Design', price: 15000 },
                { name: '3D & Motion Graphic Elements', price: 35000 }
            ]
        },
        digitalMarketing: {
            category: 'Digital Marketing',
            description: 'Grow your business with data-driven marketing strategies.',
            subServices: [
                { name: 'Search Engine Optimization (SEO)', price: 30000 },
                { name: 'Search Engine Marketing (SEM / Google Ads)', price: 35000 },
                { name: 'Social Media Marketing (SMM)', price: 28000 },
                { name: 'Email Marketing', price: 18000 },
                { name: 'Content Marketing & Copywriting', price: 22000 },
                { name: 'Influencer Marketing', price: 32000 },
                { name: 'Online Reputation Management (ORM)', price: 25000 },
                { name: 'Pay-Per-Click (PPC) Campaigns', price: 28000 },
                { name: 'Video Marketing', price: 30000 },
                { name: 'Conversion Rate Optimization (CRO)', price: 25000 },
                { name: 'Affiliate Marketing', price: 22000 },
                { name: 'Marketing Automation', price: 32000 },
                { name: 'Lead Generation Campaigns', price: 28000 },
                { name: 'Analytics & Performance Tracking', price: 18000 },
                { name: 'Retargeting & Remarketing Campaigns', price: 22000 }
            ]
        },
        socialMediaManagement: {
            category: 'Social Media Management',
            description: 'Build, engage, and grow your online community.',
            subServices: [
                { name: 'Social Media Strategy Development', price: 15000 },
                { name: 'Account Setup & Optimization', price: 10000 },
                { name: 'Content Creation & Scheduling', price: 18000 },
                { name: 'Creative Design for Posts & Stories', price: 15000 },
                { name: 'Hashtag Research & Trend Analysis', price: 10000 },
                { name: 'Community Management', price: 15000 },
                { name: 'Ad Campaign Management', price: 18000 },
                { name: 'Analytics & Monthly Reporting', price: 12000 },
                { name: 'Social Media Branding', price: 15000 },
                { name: 'Influencer Collaboration Management', price: 22000 },
                { name: 'Reel & Short Video Content Strategy', price: 18000 },
                { name: 'Social Media Contest & Campaign Execution', price: 16000 },
                { name: 'Social Listening & Competitor Analysis', price: 12000 },
                { name: 'Profile Growth & Engagement Boost', price: 15000 },
                { name: 'Crisis & Reputation Handling', price: 18000 }
            ]
        }
    };

    res.render('../views/user/pricing.ejs', {
        pageTitle: "Custom Pricing | ITBIZONE",
        services: services
    });
}

exports.getCaseStudies = (req, res, next) => {
    res.render('../views/user/case-studies.ejs', {pageTitle: "Case Studies | ITBIZONE"});
}

exports.getCaseStudyAirbnb = (req, res, next) => {
    res.render('../views/user/case-study/airbnb.ejs', {pageTitle: "Airbnb Case Study | ITBIZONE"});
}

exports.getCaseStudySpotify = (req, res, next) => {
    res.render('../views/user/case-study/spotify.ejs', {pageTitle: "Spotify Case Study | ITBIZONE"});
}

exports.getCaseStudyZomato = (req, res, next) => {
    res.render('../views/user/case-study/zomato.ejs', {pageTitle: "Zomato Case Study | ITBIZONE"});
}

exports.getCaseStudyAmazon = (req, res, next) => {
    res.render('../views/user/case-study/amazon.ejs', {pageTitle: "Amazon Case Study | ITBIZONE"});
}
