# ITBIZONE - Digital Solutions & IT Services

A modern, responsive website for ITBIZONE Technologies offering comprehensive digital solutions including web development, digital marketing, graphic design, and UI/UX services.

## 🚀 Features

- **Modern UI/UX** - Clean, professional design with smooth animations
- **Responsive Design** - Fully responsive across all devices
- **Service Pages** - Dedicated pages for each service offering
- **Case Studies** - Showcase of successful projects (Airbnb, Spotify, Zomato, Amazon)
- **Portfolio** - Display of completed projects
- **Contact System** - Functional contact form with validation
- **Quotation System** - Dynamic pricing and quotation generation
- **Newsletter Subscription** - Email collection and management
- **Dark Theme** - Modern slate-900 based dark theme throughout

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Template Engine:** EJS
- **Styling:** Tailwind CSS
- **Icons & Animations:** Custom SVG, CSS animations

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🔧 Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/itbizone-website.git
cd itbizone-website
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory and add your MongoDB connection string
```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

4. Start the development server
```bash
npm start
```

5. Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
ITBIZONE_WEBSITE/
├── controllers/          # Request handlers
│   ├── userController.js
│   ├── quotationController.js
│   └── newsletterController.js
├── models/              # MongoDB models
│   ├── contactFormModel.js
│   ├── quotationModel.js
│   └── newsletterModel.js
├── routes/              # Route definitions
│   ├── userRouter.js
│   ├── quotationRouter.js
│   └── newsletterRouter.js
├── views/               # EJS templates
│   ├── partials/        # Reusable components
│   │   ├── head.ejs
│   │   ├── navbar.ejs
│   │   └── footer.ejs
│   └── user/            # User-facing pages
│       ├── home.ejs
│       ├── about.ejs
│       ├── contact.ejs
│       ├── portfolio.ejs
│       ├── pricing.ejs
│       ├── case-studies.ejs
│       ├── case-study/  # Individual case studies
│       └── services/
├── public/              # Static assets
│   ├── images/
│   └── output.css       # Compiled Tailwind CSS
├── utils/               # Utility functions
├── app.js              # Express app configuration
└── package.json        # Project dependencies
```

## 🌟 Services Offered

1. **Website Development**
   - Custom Website Design
   - E-commerce Solutions
   - CMS Development
   - Progressive Web Apps
   - And more...

2. **Digital Marketing**
   - SEO & SEM
   - Social Media Marketing
   - Email Marketing
   - Content Marketing
   - PPC Campaigns

3. **Graphic Design**
   - Logo Design
   - Brand Identity
   - Marketing Collateral
   - UI/UX Design
   - Print Design

4. **UI/UX Design**
   - User Research
   - Wireframing & Prototyping
   - Interface Design
   - Usability Testing

## 📞 Contact

- **Email:** info@itbizone.com
- **Phone:** +91 9535111129
- **Address:** No. 39 & 1479, DRLS Plaza Union Bank Building, Tumkur Road, Vidya Nagar, T. Dasarahalli, Bengaluru, Karnataka 560057

## 📱 Social Media

- [Facebook](https://www.facebook.com/itbizone.tech/)
- [Instagram](https://www.instagram.com/itbizone/)
- [LinkedIn](https://www.linkedin.com/company/itbizone-technologies/)
- [Twitter/X](https://x.com/itbizOne)

## 📝 License

This project is proprietary and confidential. All rights reserved by ITBIZONE Technologies.

## 👥 Team

Developed with ❤️ by the ITBIZONE team

---

© 2025 ITBIZONE Technologies. All rights reserved.
