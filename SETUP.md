# Passion 3D World - Setup Guide

This guide will help you set up the complete production environment with database and email notifications.

## 🗄️ Database Setup (Cloudflare D1)

### Step 1: Create D1 Database

Run the following command to create a production database:

```bash
npx wrangler d1 create passion3d-production
```

You'll receive output like this:
```
✅ Successfully created DB 'passion3d-production'

[[d1_databases]]
binding = "DB"
database_name = "passion3d-production"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### Step 2: Update wrangler.jsonc

Copy the `database_id` from the output above and update `wrangler.jsonc`:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "passion3d-world",
  "compatibility_date": "2025-10-13",
  "pages_build_output_dir": "./dist",
  "compatibility_flags": ["nodejs_compat"],
  
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "passion3d-production",
      "database_id": "YOUR_DATABASE_ID_HERE"  // Replace with actual ID
    }
  ]
}
```

### Step 3: Run Migrations

Apply the database schema:

```bash
# For local development
npx wrangler d1 migrations apply passion3d-production --local

# For production
npx wrangler d1 migrations apply passion3d-production
```

### Step 4: Verify Database

Check that tables were created:

```bash
# Local
npx wrangler d1 execute passion3d-production --local --command="SELECT name FROM sqlite_master WHERE type='table'"

# Production
npx wrangler d1 execute passion3d-production --command="SELECT name FROM sqlite_master WHERE type='table'"
```

You should see: `quotes` and `contacts` tables.

## 📧 Email Setup (Resend - Recommended)

### Why Resend?

Resend is the recommended email service for Cloudflare Workers because:
- Simple API
- Excellent deliverability
- Generous free tier (3,000 emails/month)
- Works perfectly with Cloudflare Workers
- No credit card required for free tier

### Step 1: Sign Up for Resend

1. Go to https://resend.com
2. Sign up for a free account
3. Verify your email address

### Step 2: Get API Key

1. Go to API Keys section
2. Create a new API key
3. Copy the API key (starts with `re_`)

### Step 3: Set Environment Variables

Set the secrets in Cloudflare Pages:

```bash
# Set email API key
echo "YOUR_RESEND_API_KEY" | npx wrangler pages secret put EMAIL_API_KEY --project-name passion3d-world

# Set admin email (where you want to receive notifications)
echo "your-email@example.com" | npx wrangler pages secret put ADMIN_EMAIL --project-name passion3d-world
```

Alternatively, use the Cloudflare Dashboard:
1. Go to Cloudflare Dashboard
2. Navigate to Workers & Pages > passion3d-world
3. Go to Settings > Environment Variables
4. Add `EMAIL_API_KEY` and `ADMIN_EMAIL`

### Step 4: Update Email Code

The code already has email integration placeholder. To activate Resend, uncomment and update the `sendEmail` function in `src/index.tsx`:

```typescript
async function sendEmail(to: string, subject: string, body: string, apiKey?: string) {
  if (!apiKey) {
    console.log('Email API key not configured')
    return { success: false }
  }
  
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Passion 3D World <noreply@passion3dworld.com>',
        to: [to],
        subject: subject,
        html: body
      })
    })
    
    const data = await response.json()
    return { success: response.ok, data }
  } catch (error) {
    console.error('Email error:', error)
    return { success: false, error }
  }
}
```

### Step 5: Verify Domain (Optional but Recommended)

For production use, verify your domain:

1. In Resend dashboard, go to Domains
2. Add your domain (e.g., passion3dworld.com)
3. Add the DNS records shown
4. Wait for verification
5. Update `from` email to use your domain

## 🚀 Deploy with Database & Email

### Complete Deployment

```bash
# Build the project
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name passion3d-world

# Apply database migrations to production
npx wrangler d1 migrations apply passion3d-production
```

### Verify Everything Works

1. **Test the website**: https://passion3d-world.pages.dev
2. **Submit a quote request** through the form
3. **Check Cloudflare logs** for any errors
4. **Verify database** has the entry:
   ```bash
   npx wrangler d1 execute passion3d-production --command="SELECT * FROM quotes LIMIT 5"
   ```
5. **Check email** was sent (check your admin email inbox)

## 📊 Admin Endpoints

Access your data through these API endpoints:

```bash
# Get all quotes
curl https://passion3d-world.pages.dev/api/admin/quotes

# Get all contact messages
curl https://passion3d-world.pages.dev/api/admin/contacts
```

⚠️ **IMPORTANT**: In production, these endpoints should be protected with authentication. Add middleware to check for API keys or JWT tokens.

## 🔧 Alternative Email Services

If you prefer other email services, here are the integration patterns:

### SendGrid

```typescript
const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    personalizations: [{ to: [{ email: to }] }],
    from: { email: 'noreply@passion3dworld.com' },
    subject: subject,
    content: [{ type: 'text/html', value: body }]
  })
})
```

### Mailgun

```typescript
const formData = new FormData()
formData.append('from', 'Passion 3D World <noreply@passion3dworld.com>')
formData.append('to', to)
formData.append('subject', subject)
formData.append('html', body)

const response = await fetch('https://api.mailgun.net/v3/YOUR_DOMAIN/messages', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${btoa(`api:${apiKey}`)}`
  },
  body: formData
})
```

## 🧪 Local Development with Database

For local development with D1:

```bash
# Apply migrations locally
npm run db:migrate:local

# Start development server with local D1
npm run dev:sandbox

# Or use the ecosystem config
pm2 start ecosystem.config.cjs
```

Update `ecosystem.config.cjs` if you want to use D1 locally:

```javascript
module.exports = {
  apps: [{
    name: 'passion3d',
    script: 'npx',
    args: 'wrangler pages dev dist --d1=passion3d-production --local --ip 0.0.0.0 --port 3000',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    }
  }]
}
```

## 📝 Environment Variables Summary

| Variable | Purpose | Required | Example |
|----------|---------|----------|---------|
| `EMAIL_API_KEY` | Resend/SendGrid API key | For emails | `re_xxxxx` |
| `ADMIN_EMAIL` | Where to send notifications | For emails | `admin@passion3dworld.com` |

## 🛠️ Troubleshooting

### Database Not Working

```bash
# Check if database exists
npx wrangler d1 list

# Check migrations status
npx wrangler d1 migrations list passion3d-production

# Re-apply migrations
npx wrangler d1 migrations apply passion3d-production --force
```

### Email Not Sending

1. Check API key is set correctly
2. Verify API key has send permissions
3. Check Cloudflare logs: `npx wrangler pages deployment tail`
4. For Resend, check dashboard for failed sends
5. Ensure `from` email is verified in Resend

### Forms Not Submitting

1. Check browser console for errors
2. Verify API endpoints are responding: `curl -X POST https://passion3d-world.pages.dev/api/quote -d '{}'`
3. Check CORS is enabled for API routes
4. Test with simple curl request

## 📚 Next Steps

1. ✅ Set up D1 database
2. ✅ Configure email service
3. ✅ Deploy to production
4. 🔲 Add authentication for admin endpoints
5. 🔲 Create admin dashboard
6. 🔲 Add file upload for 3D models
7. 🔲 Integrate payment gateway
8. 🔲 Set up custom domain

---

Need help? Check the main README.md or contact support.
