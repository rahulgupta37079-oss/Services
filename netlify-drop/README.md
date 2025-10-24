# Netlify Drop Deployment Guide

## 🚀 Quick Deploy to Netlify (Drag & Drop)

This is a **standalone version** of your 3D printing service website that can be deployed to Netlify with simple drag-and-drop!

---

## 📦 What's Included

**Single File**: `index.html` - Complete website in one file!

### Features:
✅ All sections (Services, Pricing, Materials, Quote, Contact)  
✅ Interactive pricing calculator  
✅ File upload support  
✅ Responsive design (mobile-friendly)  
✅ Contact forms ready  
✅ No build process needed  
✅ Works immediately after upload  

---

## 🎯 How to Deploy

### Method 1: Netlify Drop (Simplest)

1. **Go to Netlify Drop**: https://app.netlify.com/drop

2. **Drag the `index.html` file** into the drop zone

3. **Done!** Your site is live instantly at: `https://random-name-123.netlify.app`

### Method 2: Netlify Dashboard

1. **Go to**: https://app.netlify.com
2. **Click**: "Add new site" → "Deploy manually"
3. **Drag**: The `index.html` file into the drop zone
4. **Wait**: A few seconds for deployment
5. **Get**: Your live URL!

---

## 📧 Setting Up Contact Forms

The forms use **Formspree** for email submissions. To activate:

### Step 1: Sign up for Formspree

1. Go to: https://formspree.io
2. Sign up for free account
3. Create a new form
4. Copy your form endpoint (looks like: `https://formspree.io/f/abc123xyz`)

### Step 2: Update Form Actions

Edit `index.html` and replace `YOUR_FORM_ID` in two places:

**Quote Form** (around line 520):
```html
<form id="quoteForm" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

**Contact Form** (around line 620):
```html
<form id="contactForm" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

### Step 3: Redeploy

Drag the updated `index.html` back to Netlify Drop!

---

## 🎨 Customization

### Update Contact Information

Search and replace in `index.html`:

| What to Update | Search For | Replace With |
|---------------|-----------|--------------|
| **Phone** | `+91 9137361474` | Your number |
| **Email** | `info@passion3dworld.com` | Your email |
| **Business Hours** | `9:00 AM - 12:00 PM` | Your hours |
| **Address** | `Your City, Your State` | Your address |

### Change Colors

Find the `tailwind.config` section (around line 15) and modify:

```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#4F46E5',  // Change this color
                secondary: '#7C3AED', // Change this color
            }
        }
    }
}
```

### Change Business Name

Search and replace: `Passion 3D World` with your business name

---

## 📱 Features

### ✅ Included Features:
- Responsive header with navigation
- Hero section with call-to-action
- Service cards (FDM, SLA, SLS)
- Material catalog
- Interactive pricing calculator
- Quote request form with file upload
- Contact information section
- Contact form
- Footer with social links

### 📤 File Upload:
- Supports: STL, OBJ, STEP, STP, 3MF, PLY
- Max size: 10MB
- Client-side validation
- Visual feedback

### 💰 Pricing Calculator:
- Technology selection (FDM/SLA/SLS)
- Material options
- Dimension inputs
- Quantity with bulk discounts
- Infill density selection
- Real-time price calculation

---

## 🌐 Custom Domain

### Connect Your Domain to Netlify:

1. Go to your Netlify site settings
2. Click "Domain management"
3. Click "Add custom domain"
4. Enter your domain (e.g., `passion3dworld.com`)
5. Follow Netlify's DNS instructions
6. Wait for SSL certificate (automatic)

---

## 🔧 Technical Details

### Technologies Used:
- **HTML5** - Structure
- **Tailwind CSS (CDN)** - Styling
- **Font Awesome (CDN)** - Icons
- **Axios (CDN)** - HTTP requests
- **Vanilla JavaScript** - Interactivity
- **Formspree** - Form handling

### Why This Works:
- **No build process** - Pure HTML/CSS/JS
- **CDN resources** - Fast loading
- **Static hosting** - Perfect for Netlify
- **Zero dependencies** - No npm/node needed

---

## 📊 File Structure

```
netlify-drop/
├── index.html          # Complete standalone website
└── README.md           # This file
```

That's it! Just **ONE file** to deploy! 🎉

---

## 🎯 Deployment Checklist

Before deploying:
- [ ] Update phone number to yours
- [ ] Update email address
- [ ] Update business hours
- [ ] Update address
- [ ] Set up Formspree and add form IDs
- [ ] Customize colors (optional)
- [ ] Test locally by opening `index.html` in browser

After deploying:
- [ ] Test all forms
- [ ] Test pricing calculator
- [ ] Test file upload
- [ ] Check on mobile devices
- [ ] Set up custom domain (optional)

---

## 🆘 Troubleshooting

### Forms Not Working?
- Check Formspree form ID is correct
- Make sure form `action` attribute is updated
- Check Formspree dashboard for submissions

### File Upload Not Working?
- Check file size < 10MB
- Verify file extension is supported
- Try in different browser

### Calculator Not Working?
- Open browser console (F12)
- Check for JavaScript errors
- Ensure all CDN resources loaded

### Page Looks Broken?
- Check internet connection
- CDN resources need internet to load
- Try clearing browser cache

---

## 📞 Support

**Your Contact Info:**
- Phone: +91 9137361474
- Email: info@passion3dworld.com
- Hours: Mon-Fri 9AM-12PM, Sat 9AM-12PM

---

## 🎉 You're Done!

Your website is now:
✅ Live on Netlify  
✅ Fully functional  
✅ Mobile responsive  
✅ Ready for customers  

**Netlify URL Format**: `https://your-site-name.netlify.app`

You can customize the URL in Netlify settings or add your own domain!

---

## 🚀 Next Steps

1. **Share your link** - Send to customers
2. **Add to social media** - Put in bio/profile
3. **Print on business cards** - Include your URL
4. **Google My Business** - Add website URL
5. **Monitor forms** - Check Formspree for submissions

---

Built with ❤️ for Passion 3D World
