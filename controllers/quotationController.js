const Quotation = require('../models/quotationModel');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

// Create a new quotation
exports.createQuotation = async (req, res) => {
    try {
        const { clientDetails, services } = req.body;

        console.log('📝 Creating quotation with data:', { clientDetails, services });

        // Validate input
        if (!clientDetails || !services || services.length === 0) {
            console.error('❌ Validation failed: Missing required fields');
            return res.status(400).json({
                success: false,
                message: 'Client details and services are required'
            });
        }

        // Validate client details
        if (!clientDetails.fullName || !clientDetails.email) {
            console.error('❌ Validation failed: Name or email missing');
            return res.status(400).json({
                success: false,
                message: 'Full name and email are required'
            });
        }

        // Calculate subtotal
        const subtotal = services.reduce((sum, service) => {
            const price = Number(service.price) || 0;
            return sum + price;
        }, 0);
        
        // Calculate discount (10% by default)
        const discount = Math.floor(subtotal * 0.1);
        
        // Calculate total
        const total = subtotal - discount;

        console.log('💰 Calculated pricing:', { subtotal, discount, total });

        // Create quotation object
        const quotation = new Quotation({
            clientDetails: {
                fullName: clientDetails.fullName.trim(),
                email: clientDetails.email.trim(),
                company: clientDetails.company ? clientDetails.company.trim() : '',
                phone: clientDetails.phone ? clientDetails.phone.trim() : '',
                address: clientDetails.address ? clientDetails.address.trim() : ''
            },
            services: services.map(s => ({
                id: s.id || '',
                name: s.name || '',
                price: Number(s.price) || 0,
                category: s.category || ''
            })),
            subtotal: subtotal,
            discount: discount,
            discountPercentage: 10,
            total: total,
            validityDays: clientDetails.validityDays || 30,
            status: 'draft'
        });

        console.log('📦 Quotation object created, attempting to save...');

        // Save to database
        const savedQuotation = await quotation.save();

        console.log('✅ Quotation saved successfully:', {
            id: savedQuotation._id,
            quotationNumber: savedQuotation.quotationNumber,
            series: savedQuotation.series
        });

        // Return response with quotation ID
        return res.json({
            success: true,
            message: 'Quotation created successfully',
            quotationId: savedQuotation._id,
            quotationNumber: savedQuotation.quotationNumber
        });

    } catch (error) {
        console.error('❌ Error creating quotation:', error.message);
        console.error('📋 Error code:', error.code);
        console.error('📋 Error name:', error.name);
        
        let errorMessage = 'Error creating quotation';
        
        if (error.code === 11000) {
            errorMessage = 'Duplicate quotation number. Please try again.';
        } else if (error.name === 'ValidationError') {
            errorMessage = 'Invalid quotation data: ' + error.message;
        }

        return res.status(500).json({
            success: false,
            message: errorMessage,
            error: error.message
        });
    }
};

// Get quotation by ID
exports.getQuotation = async (req, res) => {
    try {
        const { id } = req.params;

        const quotation = await Quotation.findById(id);

        if (!quotation) {
            return res.status(404).json({
                success: false,
                message: 'Quotation not found'
            });
        }

        res.json({
            success: true,
            quotation: quotation
        });

    } catch (error) {
        console.error('Error fetching quotation:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching quotation',
            error: error.message
        });
    }
};

// Get quotation page (view)
exports.getQuotationPage = async (req, res) => {
    try {
        const { id } = req.params;

        const quotation = await Quotation.findById(id);

        if (!quotation) {
            return res.status(404).render('user/quotation-not-found', {
                pageTitle: 'Quotation Not Found',
                message: 'Quotation not found'
            });
        }

        // Calculate company GST info (if needed)
        const companyDetails = {
            name: 'ITBIZONE',
            gst: '1234567890',
            address: 'Address Line 1',
            city: 'City',
            state: 'State',
            pin: '000000',
            email: 'info@itbizone.com',
            phone: '+91 XXXXXXXXXX'
        };

        res.render('user/quotation', {
            pageTitle: `Quotation ${quotation.quotationNumber}`,
            quotation: quotation,
            company: companyDetails,
            formattedDate: quotation.createdAt.toLocaleDateString('en-IN'),
            formattedExpiry: quotation.expiryDate.toLocaleDateString('en-IN')
        });

    } catch (error) {
        console.error('Error rendering quotation page:', error);
        res.status(500).render('user/error', {
            pageTitle: 'Error',
            message: 'Error loading quotation'
        });
    }
};

// Get all quotations (admin)
exports.getAllQuotations = async (req, res) => {
    try {
        const quotations = await Quotation.find()
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({
            success: true,
            count: quotations.length,
            quotations: quotations
        });

    } catch (error) {
        console.error('Error fetching quotations:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching quotations',
            error: error.message
        });
    }
};

// Update quotation status
exports.updateQuotationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['draft', 'sent', 'accepted', 'rejected', 'expired'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const quotation = await Quotation.findByIdAndUpdate(
            id,
            { status: status },
            { new: true }
        );

        if (!quotation) {
            return res.status(404).json({
                success: false,
                message: 'Quotation not found'
            });
        }

        res.json({
            success: true,
            message: 'Quotation status updated',
            quotation: quotation
        });

    } catch (error) {
        console.error('Error updating quotation:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating quotation',
            error: error.message
        });
    }
};

// Download quotation as PDF
exports.downloadQuotationPDF = async (req, res) => {
    try {
        const { id } = req.params;

        const quotation = await Quotation.findById(id).lean();

        if (!quotation) {
            return res.status(404).json({
                success: false,
                message: 'Quotation not found'
            });
        }

        // Set headers to force download
        const fileName = `${quotation.quotationNumber || 'quotation'}.pdf`;
        res.setHeader('Content-disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-type', 'application/pdf');

        // Create PDF doc - Foobar Labs style layout
        const doc = new PDFDocument({ size: 'A4', margins: { top: 50, bottom: 50, left: 50, right: 50 } });
        doc.pipe(res);

        // Colors matching Foobar Labs design
        const primaryPurple = '#8b5cf6';  // Purple for headers
        const darkText = '#1f2937';
        const lightGray = '#f9fafb';
        const borderGray = '#e5e7eb';
        const green = '#10b981';

        const pageWidth = doc.page.width;
        const contentWidth = pageWidth - 100; // 50px margins each side
        let currentY = 50;

        // ===== HEADER SECTION =====
        // "Quotation" title on left
        doc.font('Helvetica-Bold').fillColor(primaryPurple).fontSize(28).text('Quotation', 50, currentY);

        // Company logo/name on right
        try {
            const logoPath = path.join(__dirname, '..', 'public', 'images', 'itbizone-logo.png');
            if (fs.existsSync(logoPath)) {
                doc.image(logoPath, pageWidth - 180, currentY - 15, { width: 130 });
            } else {
                // Fallback to text
                doc.font('Helvetica-Bold').fontSize(16).fillColor(darkText).text('ITBIZONE', pageWidth - 120, currentY + 5);
            }
        } catch (e) {
            // Fallback to text
            doc.font('Helvetica-Bold').fontSize(16).fillColor(darkText).text('ITBIZONE', pageWidth - 120, currentY + 5);
        }

        currentY += 50;

        // Quotation metadata row
        doc.font('Helvetica').fontSize(10).fillColor('#6b7280');
        doc.text(`Quotation#`, 50, currentY);
        doc.font('Helvetica-Bold').fillColor(darkText).text(quotation.quotationNumber, 120, currentY);

        doc.font('Helvetica').fontSize(10).fillColor('#6b7280');
        doc.text('Quotation Date', 250, currentY);
        const dateStr = new Date(quotation.createdAt).toLocaleDateString('en-IN', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        }).toUpperCase();
        doc.font('Helvetica-Bold').fillColor(darkText).text(dateStr, 340, currentY);

        currentY += 30;

        // ===== INFO BOXES SECTION =====
        const boxWidth = (contentWidth - 30) / 2;
        const boxHeight = 120;

        // Left box - Quotation by
        doc.roundedRect(50, currentY, boxWidth, boxHeight, 5).fill(lightGray);
        doc.strokeColor(borderGray).lineWidth(1).roundedRect(50, currentY, boxWidth, boxHeight, 5).stroke();

        doc.font('Helvetica-Bold').fontSize(11).fillColor(darkText).text('Quotation by', 65, currentY + 15);
        doc.font('Helvetica-Bold').fontSize(10).fillColor(darkText).text('ITBIZONE', 65, currentY + 35);
        
        doc.font('Helvetica').fontSize(9).fillColor('#6b7280');
        doc.text('Address', 65, currentY + 55);
        doc.fontSize(8).text('No. 39 & 1479, DRLS Plaza Union Bank Building,', 65, currentY + 70);
        doc.text(' Tumkur Road,Vidya Nagar, T. Dasarahalli,Bengaluru 560057', 65, currentY + 82);

        doc.fontSize(9).fillColor('#6b7280').text('PAN', 65, currentY + 98);
        doc.font('Helvetica-Bold').fontSize(8).fillColor(darkText).text('ABCED1234F', 100, currentY + 98);

        // Right box - Quotation to  
        const rightBoxX = 50 + boxWidth + 15;
        doc.roundedRect(rightBoxX, currentY, boxWidth, boxHeight, 5).fill(lightGray);
        doc.strokeColor(borderGray).lineWidth(1).roundedRect(rightBoxX, currentY, boxWidth, boxHeight, 5).stroke();

        doc.font('Helvetica-Bold').fontSize(11).fillColor(darkText).text('Quotation to', rightBoxX + 15, currentY + 15);
        doc.font('Helvetica-Bold').fontSize(10).fillColor(darkText).text(quotation.clientDetails.fullName || 'Studio Den', rightBoxX + 15, currentY + 35);
        
        doc.font('Helvetica').fontSize(9).fillColor('#6b7280');
        doc.text('Address', rightBoxX + 15, currentY + 55);
        doc.fontSize(8).text(quotation.clientDetails.company || 'Company Name', rightBoxX + 15, currentY + 70);
        doc.text(quotation.clientDetails.email || 'email@company.com', rightBoxX + 15, currentY + 82);


        // Additional info on right - arranged horizontally exactly like quotation metadata
        const supplyInfoY = currentY + 140;
        
        // Place of Supply and Country of Supply on same line (using exact same positioning as Quotation# and Date)
        doc.font('Helvetica').fontSize(10).fillColor('#6b7280');
        doc.text('Place of Supply', 50, supplyInfoY);
        doc.font('Helvetica-Bold').fillColor(darkText).text('Karnataka', 150, supplyInfoY);

        doc.font('Helvetica').fontSize(10).fillColor('#6b7280');
        doc.text('Country of Supply', 300, supplyInfoY);
        doc.font('Helvetica-Bold').fillColor(darkText).text('India', 420, supplyInfoY);

        currentY += 180;

        // ===== SERVICES TABLE =====
        const tableX = 50;
        const tableWidth = contentWidth;
        const headerHeight = 30;

        // Table header
        doc.rect(tableX, currentY, tableWidth, headerHeight).fill(primaryPurple);

        doc.font('Helvetica-Bold').fontSize(11).fillColor('white');
        doc.text('Item# Item description', tableX + 15, currentY + 8, { width: 250 });
        doc.text('Qty.', tableX + 270, currentY + 8, { width: 40, align: 'center' });
        doc.text('Rate', tableX + 320, currentY + 8, { width: 80, align: 'center' });
        doc.text('Amount', tableX + 410, currentY + 8, { width: 90, align: 'center' });

        currentY += headerHeight;

        // Table rows
        const rowHeight = 28;
        quotation.services.forEach((service, idx) => {
            // Row background
            if (idx % 2 === 0) {
                doc.rect(tableX, currentY, tableWidth, rowHeight).fill('#ffffff');
            } else {
                doc.rect(tableX, currentY, tableWidth, rowHeight).fill('#f8fafc');
            }

            // Row content with better vertical centering
            doc.font('Helvetica').fontSize(9).fillColor(darkText);
            doc.text(`${idx + 1}.`, tableX + 15, currentY + 8);
            doc.text(service.name, tableX + 35, currentY + 8, { width: 230 });
            doc.text('1', tableX + 270, currentY + 8, { width: 40, align: 'center' });
            doc.text(`Rs.${service.price.toLocaleString('en-IN')}`, tableX + 320, currentY + 8, { width: 80, align: 'center' });
            doc.font('Helvetica-Bold').text(`Rs.${service.price.toLocaleString('en-IN')}`, tableX + 410, currentY + 8, { width: 90, align: 'center' });

            // Row border
            doc.strokeColor('#e5e7eb').lineWidth(0.5);
            doc.moveTo(tableX, currentY + rowHeight).lineTo(tableX + tableWidth, currentY + rowHeight).stroke();

            currentY += rowHeight;
        });

        // Table border
        doc.strokeColor('#d1d5db').lineWidth(1);
        doc.rect(tableX, currentY - (quotation.services.length * rowHeight) - headerHeight, tableWidth, (quotation.services.length * rowHeight) + headerHeight).stroke();

        currentY += 20;

        // ===== TOTALS SECTION =====
        const totalsBoxY = currentY;
        const leftColumnWidth = contentWidth * 0.55;

        // Terms and Conditions (left column)
        doc.font('Helvetica-Bold').fontSize(11).fillColor(primaryPurple).text('Terms and Conditions', 50, totalsBoxY);
        
        const terms = [
            `1. Please pay within 15 days from the date of invoice, overdue interest at 14% will be charged on delayed payments.`,
            `2. Please quote invoice number when remitting funds.`
        ];

        let termsY = totalsBoxY + 22;
        doc.font('Helvetica').fontSize(9).fillColor('#4b5563');
        terms.forEach(term => {
            doc.text(term, 50, termsY, { width: 240, lineGap: 4, height: 20 });
            termsY += 25;
        });

        // Additional Notes
        doc.font('Helvetica-Bold').fontSize(11).fillColor(primaryPurple).text('Additional Notes', 50, termsY + 15);
        doc.font('Helvetica').fontSize(9).fillColor('#4b5563');
        doc.text('It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here.\'', 50, termsY + 35, { width: 240, lineGap: 4 });

        // ===== COSTING TABLE (right column) =====
        const costTableX = 320;
        const costTableWidth = 230;
        const costTableY = totalsBoxY + 20;
        
        // Create main costing table container with border
        const costRowHeight = 22;
        let costY = costTableY;
        const totalTableHeight = (costRowHeight * 3) + 40; // 3 rows + space for words

        // Draw outer table border
        doc.rect(costTableX, costY, costTableWidth, totalTableHeight).stroke('#d1d5db');

        // Sub Total row
        doc.rect(costTableX, costY, costTableWidth, costRowHeight).stroke('#e5e7eb');
        doc.font('Helvetica').fontSize(10).fillColor(darkText);
        doc.text('Sub Total', costTableX + 10, costY + 6);
        doc.font('Helvetica-Bold').text(`Rs.${quotation.subtotal.toLocaleString('en-IN')}`, costTableX + costTableWidth - 85, costY + 6, { align: 'right', width: 75 });
        
        costY += costRowHeight;

        // Discount row
        doc.rect(costTableX, costY, costTableWidth, costRowHeight).stroke('#e5e7eb');
        doc.font('Helvetica').fontSize(10).fillColor(green);
        doc.text(`Discount(${quotation.discountPercentage}%)`, costTableX + 10, costY + 6);
        doc.font('Helvetica-Bold').fillColor(green);
        doc.text(`- Rs.${quotation.discount.toLocaleString('en-IN')}`, costTableX + costTableWidth - 85, costY + 6, { align: 'right', width: 75 });
        
        costY += costRowHeight;

        // Total row with background
        doc.rect(costTableX, costY, costTableWidth, costRowHeight).fill('#f3f4f6').stroke('#e5e7eb');
        doc.font('Helvetica-Bold').fontSize(12).fillColor(darkText);
        doc.text('Total', costTableX + 10, costY + 6);
        doc.fontSize(14).text(`Rs.${quotation.total.toLocaleString('en-IN')}`, costTableX + costTableWidth - 85, costY + 4, { align: 'right', width: 75 });
        
        costY += costRowHeight + 5;

        // Amount in words function
        function numberToWords(num) {
            const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 
                         'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 
                         'Eighteen', 'Nineteen'];
            const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
            
            if (num === 0) return 'Zero';
            if (num < 20) return ones[num];
            if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
            if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + numberToWords(num % 100) : '');
            if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '');
            if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + numberToWords(num % 100000) : '');
            
            return numberToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + numberToWords(num % 10000000) : '');
        }

        // Invoice total in words - contained within table
        doc.font('Helvetica').fontSize(9).fillColor('#6b7280');
        doc.text('Invoice Total (in words)', costTableX + 10, costY);
        
        const totalInWords = numberToWords(quotation.total);
        doc.font('Helvetica-Bold').fontSize(9).fillColor(darkText);
        doc.text(`${totalInWords} Rupees Only`, costTableX + 10, costY + 15, { width: costTableWidth - 20, lineGap: 2 });

        // ===== FOOTER SIGNATURE =====
        const footerY = doc.page.height - 120;
        
        doc.font('Helvetica').fontSize(9).fillColor('#6b7280');
        doc.text('For any enquiries, email us on info@itbizone.com or', 50, footerY);
        doc.text('call us on +91 98765-43210', 50, footerY + 12);

        // Signature area
        doc.font('Helvetica').fontSize(10).fillColor(darkText);
        doc.text('Authorized Signature', pageWidth - 150, footerY + 40);
        
        // Signature line
        doc.moveTo(pageWidth - 150, footerY + 25).lineTo(pageWidth - 50, footerY + 25).strokeColor('#000').lineWidth(1).stroke();

        doc.end();

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating PDF',
            error: error.message
        });
    }
};
