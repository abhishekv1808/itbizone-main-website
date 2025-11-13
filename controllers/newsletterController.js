const Newsletter = require('../models/newsletterModel');

// Subscribe to newsletter
exports.subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Check if email already exists
        const existingSubscriber = await Newsletter.findOne({ email });
        
        if (existingSubscriber) {
            if (existingSubscriber.isActive) {
                return res.status(400).json({
                    success: false,
                    message: 'This email is already subscribed to our newsletter'
                });
            } else {
                // Reactivate subscription
                existingSubscriber.isActive = true;
                existingSubscriber.subscribedAt = Date.now();
                await existingSubscriber.save();
                
                return res.status(200).json({
                    success: true,
                    message: 'Welcome back! Your subscription has been reactivated.'
                });
            }
        }

        // Create new subscriber
        const newSubscriber = new Newsletter({ email });
        await newSubscriber.save();

        res.status(201).json({
            success: true,
            message: 'Thank you for subscribing! You will receive our latest updates.'
        });

    } catch (error) {
        console.error('Newsletter subscription error:', error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'An error occurred. Please try again later.'
        });
    }
};

// Get all subscribers (for admin use)
exports.getAllSubscribers = async (req, res) => {
    try {
        const subscribers = await Newsletter.find({ isActive: true }).sort({ subscribedAt: -1 });
        
        res.status(200).json({
            success: true,
            count: subscribers.length,
            subscribers
        });
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching subscribers'
        });
    }
};

// Unsubscribe from newsletter
exports.unsubscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        const subscriber = await Newsletter.findOne({ email });
        
        if (!subscriber) {
            return res.status(404).json({
                success: false,
                message: 'Email not found in our subscriber list'
            });
        }

        subscriber.isActive = false;
        await subscriber.save();

        res.status(200).json({
            success: true,
            message: 'You have been unsubscribed from our newsletter'
        });

    } catch (error) {
        console.error('Unsubscribe error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred. Please try again later.'
        });
    }
};
