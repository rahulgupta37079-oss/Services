# Passion 3D World - 3D Printing Service

A professional, modern 3D printing service website built with Hono and Cloudflare Pages.

## Project Overview
- **Name**: Passion 3D World
- **Goal**: Provide a comprehensive online platform for 3D printing services
- **Features**: 
  - Multi-technology printing services (FDM, SLA, SLS)
  - Interactive pricing calculator
  - Quote request system
  - Contact form
  - Service showcase and portfolio
  - Material catalog
  - FAQ section

## URLs
- **Development**: https://3000-ibqpkyuq1wn0l5lkt2bc5-6532622b.e2b.dev
- **Production**: (To be deployed to Cloudflare Pages)
- **GitHub**: (Repository to be created)

## Currently Completed Features

### ✅ Main Sections
1. **Hero Section** - Eye-catching gradient header with call-to-action
2. **Services Showcase** - FDM, SLA, and SLS printing services with detailed descriptions
3. **Materials Catalog** - 8 different material options (PLA, ABS, PETG, TPU, Resins, Nylon)
4. **Pricing Calculator** - Interactive tool to estimate project costs
5. **Quote Request Form** - Comprehensive form for project submissions
6. **Portfolio Gallery** - Showcase of work examples
7. **Process Flow** - 4-step explanation of how the service works
8. **FAQ Section** - Common questions and answers
9. **Contact Section** - Contact information and message form

### ✅ API Endpoints
- `POST /api/quote` - Handle quote requests
- `POST /api/contact` - Handle contact form submissions

### ✅ Interactive Features
- Real-time price calculation based on:
  - Technology type (FDM/SLA/SLS)
  - Material selection
  - Dimensions (L x W x H)
  - Quantity (with bulk discounts)
  - Infill density
- Form validation and error handling
- Success/error message display
- Smooth scrolling navigation
- Responsive design with Tailwind CSS

## Data Architecture
- **Data Models**: Quote requests and contact messages (currently logged to console)
- **Storage Services**: Ready for integration with:
  - Cloudflare D1 for database storage
  - Email service for notifications (SendGrid, Resend, etc.)
- **Data Flow**: Form submission → API validation → Response to user

## Features Not Yet Implemented
- [ ] File upload functionality for 3D models
- [ ] User account system and order tracking
- [ ] Payment integration
- [ ] Email notifications for quotes and contacts
- [ ] Database storage for persistent data
- [ ] Admin dashboard for managing quotes
- [ ] Real portfolio images (currently using placeholder icons)
- [ ] Online 3D model viewer
- [ ] Customer testimonials section
- [ ] Blog/resources section

## Recommended Next Steps
1. **Add Email Integration**: Integrate with SendGrid or Resend to send email notifications
2. **Database Integration**: Set up Cloudflare D1 to store quote requests and contact messages
3. **File Upload**: Implement file upload for 3D model files (STL, OBJ, etc.)
4. **Portfolio Gallery**: Add real project images and case studies
5. **Payment Gateway**: Integrate Stripe or similar for online payments
6. **Admin Dashboard**: Create backend for managing quotes and customers
7. **Deploy to Production**: Deploy to Cloudflare Pages with custom domain

## User Guide

### For Customers
1. **Estimate Your Cost**:
   - Scroll to "Estimate Your Cost" section
   - Select printing technology, material, and enter dimensions
   - Click "Calculate Price" to see instant estimate

2. **Request a Quote**:
   - Fill out the quote request form with your details
   - Include project description and requirements
   - Submit form to receive detailed quote within 24 hours

3. **Contact Us**:
   - Use the contact form for general inquiries
   - Find contact information in the footer

### For Developers
1. **Local Development**:
   ```bash
   npm install
   npm run build
   pm2 start ecosystem.config.cjs
   ```

2. **Testing**:
   ```bash
   curl http://localhost:3000
   ```

3. **Deploy to Production**:
   ```bash
   npm run deploy:prod
   ```

## Tech Stack
- **Backend**: Hono (lightweight web framework)
- **Frontend**: HTML, Tailwind CSS, Vanilla JavaScript
- **Icons**: Font Awesome 6
- **HTTP Client**: Axios
- **Deployment**: Cloudflare Pages/Workers
- **Process Manager**: PM2 (for development)

## Deployment
- **Platform**: Cloudflare Pages
- **Status**: ✅ Running in development
- **Last Updated**: 2025-10-13

## Project Structure
```
webapp/
├── src/
│   └── index.tsx         # Main Hono application with API routes
├── public/
│   └── static/
│       ├── app.js        # Frontend JavaScript (forms, calculator)
│       └── style.css     # Custom CSS styles
├── dist/                 # Built files (auto-generated)
├── ecosystem.config.cjs  # PM2 configuration
├── package.json          # Dependencies and scripts
└── wrangler.jsonc        # Cloudflare configuration
```

## API Documentation

### POST /api/quote
Request a quote for 3D printing service.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 1234567890",
  "service": "fdm",
  "material": "pla",
  "quantity": 1,
  "description": "Need to print a prototype..."
}
```

**Response**:
```json
{
  "success": true,
  "message": "Thank you! We will contact you within 24 hours...",
  "quoteId": "QT1234567890"
}
```

### POST /api/contact
Send a general inquiry message.

**Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "Question about materials",
  "message": "I would like to know more about..."
}
```

**Response**:
```json
{
  "success": true,
  "message": "Thank you for contacting us! We will get back to you soon."
}
```

## Pricing Structure

### FDM Printing
- **Base**: From ₹50/part
- **Materials**: PLA, ABS, PETG, TPU
- **Build Volume**: Up to 300x300x400mm

### SLA/Resin Printing (Most Popular)
- **Base**: From ₹100/part
- **Materials**: Standard, Tough, Clear resins
- **Resolution**: 0.025mm layer height

### SLS Printing
- **Base**: From ₹200/part
- **Materials**: Nylon PA12
- **Features**: No support structures needed

### Bulk Discounts
- 5-9 units: 10% off
- 10+ units: 15% off

## Contact Information
- **Email**: info@passion3dworld.com
- **Phone**: +91 XXXXX XXXXX
- **Hours**: Mon-Fri 9AM-6PM, Sat 10AM-4PM

---

Built with ❤️ by Passion 3D World
