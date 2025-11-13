const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
    quotationNumber: {
        type: String,
        sparse: true,
        index: true
    },
    series: {
        type: Number,
        sparse: true,
        index: true
    },
    clientDetails: {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        company: { type: String, default: '' },
        phone: { type: String, default: '' },
        address: { type: String, default: '' }
    },
    services: [
        {
            id: String,
            name: String,
            price: Number,
            category: String
        }
    ],
    subtotal: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    discountPercentage: {
        type: Number,
        default: 10
    },
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'sent', 'accepted', 'rejected', 'expired'],
        default: 'draft'
    },
    validityDays: {
        type: Number,
        default: 30
    },
    expiryDate: {
        type: Date
    },
    notes: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save middleware to generate quotation number and set expiry date
quotationSchema.pre('save', async function(next) {
    if (!this.isNew) {
        return next();
    }

    try {
        console.log('Pre-save middleware: Starting quotation generation');
        
        // Get the next series number
        const lastQuotation = await this.constructor.findOne()
            .sort({ series: -1 })
            .lean()
            .exec();
        
        const newSeries = lastQuotation && lastQuotation.series ? lastQuotation.series + 1 : 1001;
        
        console.log('Last quotation series:', lastQuotation?.series, '-> New series:', newSeries);
        
        this.series = newSeries;
        this.quotationNumber = `ITBIZ-QT-${String(newSeries).padStart(4, '0')}`;
        
        console.log('Set quotationNumber:', this.quotationNumber);
        
        // Set expiry date
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + (this.validityDays || 30));
        this.expiryDate = expiryDate;
        
        console.log('Pre-save middleware: Completed successfully');
        next();
    } catch (error) {
        console.error('Error in pre-save middleware:', error.message);
        console.error('Stack:', error.stack);
        next(error);
    }
});

module.exports = mongoose.model('Quotation', quotationSchema);
