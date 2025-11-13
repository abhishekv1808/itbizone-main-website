# ITBIZONE Quotation System - Complete Implementation Guide

## 📋 Features Implemented

### 1. **Quotation Database Model** (`models/quotationModel.js`)
- Unique quotation numbers: `ITBIZ-QT-1001`, `ITBIZ-QT-1002`, etc.
- Auto-incrementing series number
- Client details storage (name, email, company, phone, address)
- Services list with prices and categories
- Automatic discount calculation (10%)
- Status tracking: draft, sent, accepted, rejected, expired
- Expiry date management (default 30 days)
- Timestamps for creation and expiry

### 2. **Quotation Controller** (`controllers/quotationController.js`)
**Available Functions:**

#### `createQuotation()`
- Creates new quotation from selected services
- Calculates subtotal, discount, and total
- Stores in MongoDB database
- Returns quotation ID and number

#### `getQuotation()`
- Retrieves quotation data via API
- Returns complete quotation object

#### `getQuotationPage()`
- Renders professional quotation HTML page
- Displays all quotation details with formatting

#### `getAllQuotations()`
- Admin function to view all quotations
- Returns last 50 quotations sorted by date

#### `updateQuotationStatus()`
- Update quotation status (draft → sent → accepted/rejected)
- Useful for tracking quotation lifecycle

#### `downloadQuotationPDF()`
- Provides quotation data for PDF generation
- Client-side PDF download using html2pdf.js

### 3. **Quotation Routes** (`routes/quotationRouter.js`)

```
POST   /api/quotations           - Create new quotation
GET    /api/quotations           - Get all quotations (admin)
GET    /api/quotations/:id       - Get quotation data (API)
GET    /quotation/:id            - View quotation page
GET    /quotation/:id/download   - Download quotation PDF
PUT    /api/quotations/:id/status - Update status
```

### 4. **Professional Quotation View** (`views/user/quotation.ejs`)

**Design Features:**
- Modern invoice-style layout (inspired by your reference)
- Company information section
- Quotation number and series display
- Client billing and shipping details
- Detailed services table with prices
- Pricing summary box (subtotal, discount, total)
- Terms & conditions section
- Print and PDF download buttons
- Status badge (draft, sent, accepted)
- Responsive design for all devices

**Styling:**
- Dark theme matching your branding
- Professional color scheme (blue gradient)
- Print-friendly CSS
- Mobile responsive layout

### 5. **Pricing Page Integration** (`views/user/pricing.ejs`)

**Enhanced Features:**
- Updated "Get Started" button with `generateQuotation()` function
- Client details collection (name, email, company, phone)
- Automatic service extraction from selected checkboxes
- Loading state during quotation generation
- Error handling with user-friendly messages

**Workflow:**
1. User selects services on pricing page
2. Clicks "Get Started" button
3. Prompted for name and email
4. Optional company and phone details
5. Quotation created in MongoDB
6. Redirected to professional quotation page
7. User can download PDF or print

### 6. **PDF Download Functionality**

**Library:** html2pdf.js v0.10.1 (CDN)
**Features:**
- Client-side PDF generation (no server overhead)
- Filename: `ITBIZ-QT-XXXX.pdf`
- High-quality PDF rendering
- A4 paper format
- Maintains professional styling

### 7. **Database Quotation Numbers**

**Format:** `ITBIZ-QT-XXXX`
**Series Tracking:**
- Auto-increments starting from 1001
- Unique constraint ensures no duplicates
- Stored in MongoDB as `quotationNumber` field
- Series number also stored separately for tracking

**Examples:**
- First quotation: `ITBIZ-QT-1001`
- Second quotation: `ITBIZ-QT-1002`
- 100th quotation: `ITBIZ-QT-1100`

## 🔄 Complete User Flow

### Step 1: Pricing Page
- User selects multiple services with checkboxes
- Real-time price calculation with 10% discount
- Services shown in "Your Quote" panel

### Step 2: Generate Quotation
- Click "Get Started" button
- Enter name and email (required)
- Optionally enter company and phone
- System creates quotation in database

### Step 3: View Quotation
- Professional invoice-style page displays
- All services listed in table format
- Total cost with discount shown
- Status badge indicates draft status
- Company and client details visible

### Step 4: Download/Print
- User can download as PDF
- User can print directly
- Both maintain professional formatting

### Step 5: Admin Follow-up
- Admin can view all quotations via API
- Can update quotation status (sent, accepted, etc.)
- Quotations stored permanently in MongoDB

## 📊 Database Schema

```javascript
{
  quotationNumber: "ITBIZ-QT-1001",
  series: 1001,
  clientDetails: {
    fullName: "Client Name",
    email: "client@email.com",
    company: "Company Name",
    phone: "+91XXXXXXXXXX",
    address: "Address"
  },
  services: [
    {
      id: "...",
      name: "Service Name",
      price: 25000,
      category: "Website Development"
    }
  ],
  subtotal: 75000,
  discount: 7500,
  discountPercentage: 10,
  total: 67500,
  status: "draft",
  validityDays: 30,
  expiryDate: "2025-12-07",
  createdAt: "2025-11-07",
  notes: "Optional notes"
}
```

## 🚀 How to Use

### For Users:
1. Navigate to `/pricing`
2. Select desired services
3. Click "Get Started"
4. Provide contact details
5. View generated quotation
6. Download PDF or print

### For Developers/Admins:
1. **View all quotations:** `GET /api/quotations`
2. **Get single quotation:** `GET /api/quotations/:id`
3. **Update status:** `PUT /api/quotations/:id/status` with body `{ status: "sent" }`
4. **Create quotation:** `POST /api/quotations` (automatic from pricing page)

## 🔐 Future Enhancements

1. **Email Integration** - Send quotations via email
2. **Quotation Templates** - Customize layout and terms
3. **Client Portal** - Clients can view/accept/reject quotes
4. **Analytics** - Track quotation acceptance rates
5. **Automatic Follow-up** - Reminders for expiring quotations
6. **Payment Integration** - Accept payments directly from quotation
7. **Version Control** - Track quotation revisions
8. **Multi-currency Support** - Support different currencies
9. **Tax Calculations** - Automatic GST/tax calculation
10. **Bulk Operations** - Send multiple quotations at once

## 📝 Notes

- Quotation numbers are unique and auto-generated
- All quotations stored in MongoDB for permanent record
- PDF download works client-side (fast, no server processing)
- Professional design follows your invoice reference image
- Mobile responsive for all device sizes
- Automatic 10% discount applied to all quotations
- Default quotation validity: 30 days from creation
