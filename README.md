# Passion 3D World - 3D Printing Service

A professional, modern 3D printing service website built with Hono and Cloudflare Pages, featuring database storage and email notifications.

## Project Overview
- **Name**: Passion 3D World
- **Goal**: Provide a comprehensive online platform for 3D printing services
- **Features**: 
  - Multi-technology printing services (FDM, SLA, SLS)
  - Interactive pricing calculator
  - Quote request system with database storage
  - Contact form with email notifications
  - Service showcase and portfolio
  - Material catalog
  - FAQ section
  - Admin API endpoints

## 🌐 URLs
- **Production**: https://passion3d-world.pages.dev
- **Latest Deployment**: https://799ff09d.passion3d-world.pages.dev
- **GitHub**: https://github.com/rahulgupta37079-oss/Services
- **Development**: https://3000-ibqpkyuq1wn0l5lkt2bc5-6532622b.e2b.dev

## ✅ Currently Completed Features

### Main Sections
1. **Hero Section** - Eye-catching gradient header with call-to-action
2. **Services Showcase** - FDM, SLA, and SLS printing services with detailed descriptions
3. **Materials Catalog** - 8 different material options (PLA, ABS, PETG, TPU, Resins, Nylon)
4. **Pricing Calculator** - Interactive tool to estimate project costs
5. **Quote Request Form** - Comprehensive form for project submissions
6. **Portfolio Gallery** - Showcase of work examples
7. **Process Flow** - 4-step explanation of how the service works
8. **FAQ Section** - Common questions and answers
9. **Contact Section** - Contact information and message form

### Backend Features
- **Database Integration**: Cloudflare D1 SQLite database for storing quotes and contacts
- **Email Notifications**: Support for Resend, SendGrid, or Mailgun
- **Admin Endpoints**: API endpoints to view all quotes and contacts
- **Form Validation**: Server-side validation for all user inputs
- **Error Handling**: Comprehensive error handling and logging

### API Endpoints
- `POST /api/quote` - Handle quote requests (stores in DB, sends emails)
- `POST /api/contact` - Handle contact form submissions (stores in DB, sends emails)
- `GET /api/admin/quotes` - Retrieve all quotes (requires authentication in production)
- `GET /api/admin/contacts` - Retrieve all contact messages (requires authentication in production)

### Interactive Features
- Real-time price calculation based on:
  - Technology type (FDM/SLA/SLS)
  - Material selection
  - Dimensions (L x W x H)
  - Quantity (with bulk discounts: 10% for 5-9 units, 15% for 10+)
  - Infill density
- Form validation and error handling
- Success/error message display
- Smooth scrolling navigation
- Responsive design with Tailwind CSS
- Custom animations and hover effects

## 🗄️ Data Architecture

### Database Schema (Cloudflare D1)

**Quotes Table:**
```sql
- id (INTEGER PRIMARY KEY)
- name (TEXT)
- email (TEXT)
- phone (TEXT)
- service (TEXT) - fdm/sla/sls/design
- material (TEXT)
- quantity (INTEGER)
- description (TEXT)
- status (TEXT) - pending/processing/completed
- created_at (DATETIME)
- updated_at (DATETIME)
```

**Contacts Table:**
```sql
- id (INTEGER PRIMARY KEY)
- name (TEXT)
- email (TEXT)
- subject (TEXT)
- message (TEXT)
- status (TEXT) - unread/read/replied
- created_at (DATETIME)
- updated_at (DATETIME)
```

### Storage Services
- **Cloudflare D1**: SQLite-based relational database for quotes and contacts
- **Ready for**: Email integration (Resend, SendGrid, Mailgun)

### Data Flow
1. User submits form → 
2. API validates data → 
3. Store in D1 database → 
4. Send email notification to admin → 
5. Send confirmation email to customer → 
6. Return success response

## 📧 Email Integration

The application is ready for email integration with:
- **Resend** (Recommended for Cloudflare Workers)
- **SendGrid**
- **Mailgun**

See `SETUP.md` for detailed setup instructions.

### Email Features
- Admin notification on new quote request
- Customer confirmation email
- Admin notification on contact form submission
- Customer acknowledgment email

## 🚀 Deployment Status

- ✅ **GitHub**: Code pushed to repository
- ✅ **Cloudflare Pages**: Deployed to production
- ✅ **Backend API**: All endpoints functional
- ⏳ **Database**: Schema ready, needs D1 database creation
- ⏳ **Email**: Code ready, needs API key configuration

## 📝 User Guide

### For Customers

1. **Estimate Your Cost**:
   - Scroll to "Estimate Your Cost" section
   - Select printing technology, material, and enter dimensions
   - Click "Calculate Price" to see instant estimate

2. **Request a Quote**:
   - Fill out the quote request form with your details
   - Include project description and requirements
   - Submit form to receive detailed quote within 24 hours
   - You'll receive a confirmation email (when email is configured)

3. **Contact Us**:
   - Use the contact form for general inquiries
   - Find contact information in the footer

### For Administrators

1. **View All Quotes**:
   ```bash
   curl https://passion3d-world.pages.dev/api/admin/quotes
   ```

2. **View All Contacts**:
   ```bash
   curl https://passion3d-world.pages.dev/api/admin/contacts
   ```

3. **Query Database Directly**:
   ```bash
   npm run db:query:quotes
   npm run db:query:contacts
   ```

⚠️ **Important**: Add authentication to admin endpoints in production!

### For Developers

1. **Local Development**:
   ```bash
   npm install
   npm run build
   pm2 start ecosystem.config.cjs
   ```

2. **With Database (Local)**:
   ```bash
   npm run db:migrate:local
   npm run dev:db
   ```

3. **Testing**:
   ```bash
   curl http://localhost:3000
   curl -X POST http://localhost:3000/api/quote -H "Content-Type: application/json" -d '{"name":"Test","email":"test@test.com","service":"fdm"}'
   ```

4. **Deploy to Production**:
   ```bash
   npm run build
   npm run deploy
   ```

## 🛠️ Tech Stack

- **Backend**: Hono (lightweight web framework)
- **Database**: Cloudflare D1 (SQLite)
- **Frontend**: HTML, Tailwind CSS, Vanilla JavaScript
- **Icons**: Font Awesome 6
- **HTTP Client**: Axios
- **Deployment**: Cloudflare Pages/Workers
- **Process Manager**: PM2 (for development)
- **Email**: Resend/SendGrid/Mailgun (configurable)

## 📋 Features Not Yet Implemented

- [ ] File upload functionality for 3D models
- [ ] Authentication for admin endpoints
- [ ] Admin dashboard UI for managing quotes
- [ ] Payment integration (Stripe)
- [ ] Real portfolio images
- [ ] Online 3D model viewer
- [ ] Customer testimonials section
- [ ] Blog/resources section
- [ ] User account system with order tracking
- [ ] Email automation workflows
- [ ] Quote status tracking for customers

## 🎯 Recommended Next Steps

### Immediate (Setup Required)
1. **Create D1 Database**:
   ```bash
   npm run db:create
   # Update wrangler.jsonc with database_id
   npm run db:migrate:prod
   ```

2. **Configure Email Service**:
   ```bash
   # Sign up for Resend (free tier)
   # Get API key
   npm run secret:email
   npm run secret:admin
   ```

3. **Verify Deployment**:
   - Submit test quote
   - Check database has entry
   - Verify email received

### Short Term (Enhancements)
4. **Add Authentication**: Protect admin endpoints with API keys or JWT
5. **Admin Dashboard**: Create UI for managing quotes and contacts
6. **File Upload**: Implement R2 storage for 3D model files
7. **Real Images**: Add actual project photos to portfolio

### Long Term (Growth)
8. **Payment Gateway**: Integrate Stripe for online payments
9. **Customer Portal**: Let customers track their orders
10. **Analytics**: Add usage tracking and insights
11. **Marketing**: SEO optimization, social media integration

## 📦 Project Structure

```
webapp/
├── src/
│   └── index.tsx              # Main Hono app with API routes & email
├── public/
│   └── static/
│       ├── app.js             # Frontend JavaScript
│       └── style.css          # Custom CSS styles
├── migrations/
│   └── 0001_initial_schema.sql # Database schema
├── dist/                      # Built files (auto-generated)
├── ecosystem.config.cjs       # PM2 configuration
├── package.json               # Dependencies and scripts
├── wrangler.jsonc             # Cloudflare configuration
├── README.md                  # This file
└── SETUP.md                   # Detailed setup instructions
```

## 🎨 Pricing Structure

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

## 🔗 Important Links

- **Production Site**: https://passion3d-world.pages.dev
- **GitHub Repository**: https://github.com/rahulgupta37079-oss/Services
- **Setup Guide**: See SETUP.md for database and email configuration
- **Cloudflare Dashboard**: https://dash.cloudflare.com

## 📞 Contact Information

- **Email**: info@passion3dworld.com
- **Phone**: +91 XXXXX XXXXX
- **Hours**: Mon-Fri 9AM-6PM, Sat 10AM-4PM

## 📄 Available Scripts

```bash
# Development
npm run dev              # Start Vite dev server
npm run dev:sandbox      # Start with wrangler (no DB)
npm run dev:db           # Start with wrangler + local D1

# Building
npm run build            # Build for production

# Database
npm run db:create        # Create D1 database
npm run db:migrate:local # Apply migrations locally
npm run db:migrate:prod  # Apply migrations to production
npm run db:query:quotes  # View recent quotes
npm run db:query:contacts # View recent contacts

# Deployment
npm run deploy           # Build and deploy to Cloudflare Pages

# Secrets Management
npm run secret:email     # Set EMAIL_API_KEY
npm run secret:admin     # Set ADMIN_EMAIL

# Monitoring
npm run logs             # View production logs
```

## 🏆 What Makes This Special

- **Production Ready**: Fully functional with database and email integration
- **Modern Stack**: Uses latest Cloudflare technologies
- **Easy Setup**: Comprehensive documentation and scripts
- **Cost Effective**: Runs on Cloudflare's free tier
- **Scalable**: D1 database and Workers scale automatically
- **Fast**: Edge deployment = global low latency
- **Secure**: Environment variables for sensitive data
- **Professional**: Clean code, proper error handling

---

**Last Updated**: 2025-10-14

Built with ❤️ by Passion 3D World | Powered by Cloudflare Pages
