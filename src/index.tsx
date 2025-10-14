import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

// Type definitions for Cloudflare bindings
type Bindings = {
  DB?: D1Database;
  EMAIL_API_KEY?: string;
  ADMIN_EMAIL?: string;
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// Helper function to send email (placeholder - integrate with your email service)
async function sendEmail(to: string, subject: string, body: string, apiKey?: string) {
  // This is a placeholder for email integration
  // You can integrate with services like:
  // - Resend (recommended for Cloudflare Workers)
  // - SendGrid
  // - Mailgun
  // - AWS SES
  
  console.log('Email would be sent:', { to, subject, body })
  
  // Example for Resend API:
  // if (apiKey) {
  //   const response = await fetch('https://api.resend.com/emails', {
  //     method: 'POST',
  //     headers: {
  //       'Authorization': `Bearer ${apiKey}`,
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       from: 'Passion 3D World <noreply@passion3dworld.com>',
  //       to: [to],
  //       subject: subject,
  //       html: body
  //     })
  //   })
  //   return response.json()
  // }
  
  return { success: true, message: 'Email sent (simulation)' }
}

// API endpoint for quote requests
app.post('/api/quote', async (c) => {
  try {
    const data = await c.req.json()
    
    // Validate required fields
    const { name, email, phone, service, material, quantity, description } = data
    
    if (!name || !email || !service) {
      return c.json({ success: false, message: 'Missing required fields' }, 400)
    }
    
    const quoteId = `QT${Date.now()}`
    
    // Store in D1 database if available
    if (c.env.DB) {
      try {
        await c.env.DB.prepare(`
          INSERT INTO quotes (name, email, phone, service, material, quantity, description, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
        `).bind(name, email, phone || null, service, material || null, quantity || 1, description || null).run()
        
        console.log('Quote saved to database')
      } catch (dbError) {
        console.error('Database error:', dbError)
        // Continue even if DB fails
      }
    } else {
      console.log('Quote request received (no DB):', data)
    }
    
    // Send email notification to admin
    if (c.env.EMAIL_API_KEY && c.env.ADMIN_EMAIL) {
      await sendEmail(
        c.env.ADMIN_EMAIL,
        `New Quote Request - ${quoteId}`,
        `
          <h2>New 3D Printing Quote Request</h2>
          <p><strong>Quote ID:</strong> ${quoteId}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Material:</strong> ${material || 'Not specified'}</p>
          <p><strong>Quantity:</strong> ${quantity || 1}</p>
          <p><strong>Description:</strong></p>
          <p>${description || 'No description provided'}</p>
        `,
        c.env.EMAIL_API_KEY
      )
    }
    
    // Send confirmation email to customer
    if (c.env.EMAIL_API_KEY) {
      await sendEmail(
        email,
        'Quote Request Received - Passion 3D World',
        `
          <h2>Thank you for your quote request!</h2>
          <p>Hi ${name},</p>
          <p>We've received your quote request (ID: ${quoteId}) and will get back to you within 24 hours with a detailed quote.</p>
          <h3>Request Details:</h3>
          <ul>
            <li>Service: ${service}</li>
            <li>Material: ${material || 'Not specified'}</li>
            <li>Quantity: ${quantity || 1}</li>
          </ul>
          <p>If you have any questions, feel free to contact us at info@passion3dworld.com</p>
          <p>Best regards,<br>Passion 3D World Team</p>
        `,
        c.env.EMAIL_API_KEY
      )
    }
    
    return c.json({ 
      success: true, 
      message: 'Thank you! We will contact you within 24 hours with a detailed quote.',
      quoteId: quoteId
    })
  } catch (error) {
    console.error('Quote request error:', error)
    return c.json({ success: false, message: 'Server error occurred' }, 500)
  }
})

// API endpoint for contact form
app.post('/api/contact', async (c) => {
  try {
    const data = await c.req.json()
    
    const { name, email, subject, message } = data
    
    if (!name || !email || !message) {
      return c.json({ success: false, message: 'Missing required fields' }, 400)
    }
    
    // Store in D1 database if available
    if (c.env.DB) {
      try {
        await c.env.DB.prepare(`
          INSERT INTO contacts (name, email, subject, message, status)
          VALUES (?, ?, ?, ?, 'unread')
        `).bind(name, email, subject || null, message).run()
        
        console.log('Contact message saved to database')
      } catch (dbError) {
        console.error('Database error:', dbError)
        // Continue even if DB fails
      }
    } else {
      console.log('Contact form received (no DB):', data)
    }
    
    // Send email notification to admin
    if (c.env.EMAIL_API_KEY && c.env.ADMIN_EMAIL) {
      await sendEmail(
        c.env.ADMIN_EMAIL,
        `New Contact Message from ${name}`,
        `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <p><strong>Reply to:</strong> ${email}</p>
        `,
        c.env.EMAIL_API_KEY
      )
    }
    
    // Send confirmation email to customer
    if (c.env.EMAIL_API_KEY) {
      await sendEmail(
        email,
        'Message Received - Passion 3D World',
        `
          <h2>Thank you for contacting us!</h2>
          <p>Hi ${name},</p>
          <p>We've received your message and will get back to you as soon as possible.</p>
          <p>Best regards,<br>Passion 3D World Team</p>
        `,
        c.env.EMAIL_API_KEY
      )
    }
    
    return c.json({ 
      success: true, 
      message: 'Thank you for contacting us! We will get back to you soon.'
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return c.json({ success: false, message: 'Server error occurred' }, 500)
  }
})

// API endpoint to get all quotes (admin use - add authentication in production)
app.get('/api/admin/quotes', async (c) => {
  try {
    if (!c.env.DB) {
      return c.json({ success: false, message: 'Database not configured' }, 503)
    }
    
    const result = await c.env.DB.prepare(`
      SELECT * FROM quotes ORDER BY created_at DESC LIMIT 100
    `).all()
    
    return c.json({ success: true, quotes: result.results })
  } catch (error) {
    console.error('Error fetching quotes:', error)
    return c.json({ success: false, message: 'Server error occurred' }, 500)
  }
})

// API endpoint to get all contacts (admin use - add authentication in production)
app.get('/api/admin/contacts', async (c) => {
  try {
    if (!c.env.DB) {
      return c.json({ success: false, message: 'Database not configured' }, 503)
    }
    
    const result = await c.env.DB.prepare(`
      SELECT * FROM contacts ORDER BY created_at DESC LIMIT 100
    `).all()
    
    return c.json({ success: true, contacts: result.results })
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return c.json({ success: false, message: 'Server error occurred' }, 500)
  }
})

// Main page
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>3D Printing Service | Passion 3D World</title>
        <meta name="description" content="Professional 3D printing services - FDM, SLA, SLS printing. Fast turnaround, competitive pricing, high quality prints for prototypes, models, and custom parts.">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/style.css" rel="stylesheet">
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  primary: '#4F46E5',
                  secondary: '#7C3AED',
                }
              }
            }
          }
        </script>
    </head>
    <body class="bg-gray-50">
        <!-- Header -->
        <header class="bg-white shadow-sm sticky top-0 z-50">
            <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <i class="fas fa-cube text-primary text-3xl mr-3"></i>
                        <h1 class="text-2xl font-bold text-gray-900">Passion 3D World</h1>
                    </div>
                    <div class="hidden md:flex space-x-8">
                        <a href="#services" class="text-gray-700 hover:text-primary transition">Services</a>
                        <a href="#pricing" class="text-gray-700 hover:text-primary transition">Pricing</a>
                        <a href="#materials" class="text-gray-700 hover:text-primary transition">Materials</a>
                        <a href="#portfolio" class="text-gray-700 hover:text-primary transition">Portfolio</a>
                        <a href="#contact" class="text-gray-700 hover:text-primary transition">Contact</a>
                    </div>
                    <a href="#quote" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                        Get Quote
                    </a>
                </div>
            </nav>
        </header>

        <!-- Hero Section -->
        <section class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center">
                    <h2 class="text-5xl font-bold mb-6">Professional 3D Printing Services</h2>
                    <p class="text-xl mb-8 text-indigo-100">Transform your ideas into reality with high-quality 3D printing</p>
                    <div class="flex justify-center gap-4 flex-wrap">
                        <a href="#quote" class="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                            Request Quote
                        </a>
                        <a href="#services" class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition">
                            Our Services
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features -->
        <section class="py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid md:grid-cols-4 gap-8">
                    <div class="text-center">
                        <div class="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-bolt text-primary text-2xl"></i>
                        </div>
                        <h3 class="font-semibold text-lg mb-2">Fast Turnaround</h3>
                        <p class="text-gray-600">24-72 hours delivery</p>
                    </div>
                    <div class="text-center">
                        <div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-certificate text-secondary text-2xl"></i>
                        </div>
                        <h3 class="font-semibold text-lg mb-2">High Quality</h3>
                        <p class="text-gray-600">Professional grade prints</p>
                    </div>
                    <div class="text-center">
                        <div class="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-dollar-sign text-primary text-2xl"></i>
                        </div>
                        <h3 class="font-semibold text-lg mb-2">Competitive Pricing</h3>
                        <p class="text-gray-600">Best rates in the market</p>
                    </div>
                    <div class="text-center">
                        <div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-headset text-secondary text-2xl"></i>
                        </div>
                        <h3 class="font-semibold text-lg mb-2">Expert Support</h3>
                        <p class="text-gray-600">Free design consultation</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Services -->
        <section id="services" class="py-16 bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold text-gray-900 mb-4">Our 3D Printing Services</h2>
                    <p class="text-xl text-gray-600">Multiple technologies to meet your specific needs</p>
                </div>
                <div class="grid md:grid-cols-3 gap-8">
                    <!-- FDM Printing -->
                    <div class="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition">
                        <div class="bg-indigo-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                            <i class="fas fa-layer-group text-primary text-2xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold mb-3">FDM Printing</h3>
                        <p class="text-gray-600 mb-4">Fused Deposition Modeling for functional prototypes and parts</p>
                        <ul class="space-y-2 mb-6">
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mt-1 mr-2"></i>
                                <span class="text-gray-700">PLA, ABS, PETG, TPU materials</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mt-1 mr-2"></i>
                                <span class="text-gray-700">Large build volume up to 300x300x400mm</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mt-1 mr-2"></i>
                                <span class="text-gray-700">Multiple color options</span>
                            </li>
                        </ul>
                        <p class="text-primary font-semibold text-lg">From ₹50/part</p>
                    </div>

                    <!-- SLA Printing -->
                    <div class="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition border-2 border-primary">
                        <div class="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4">
                            MOST POPULAR
                        </div>
                        <div class="bg-purple-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                            <i class="fas fa-microscope text-secondary text-2xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold mb-3">SLA/Resin Printing</h3>
                        <p class="text-gray-600 mb-4">High-resolution prints for detailed models and miniatures</p>
                        <ul class="space-y-2 mb-6">
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mt-1 mr-2"></i>
                                <span class="text-gray-700">0.025mm layer resolution</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mt-1 mr-2"></i>
                                <span class="text-gray-700">Smooth surface finish</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mt-1 mr-2"></i>
                                <span class="text-gray-700">Clear, standard, tough resins</span>
                            </li>
                        </ul>
                        <p class="text-primary font-semibold text-lg">From ₹100/part</p>
                    </div>

                    <!-- SLS Printing -->
                    <div class="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition">
                        <div class="bg-indigo-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                            <i class="fas fa-industry text-primary text-2xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold mb-3">SLS Printing</h3>
                        <p class="text-gray-600 mb-4">Industrial-grade parts with excellent mechanical properties</p>
                        <ul class="space-y-2 mb-6">
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mt-1 mr-2"></i>
                                <span class="text-gray-700">No support structures needed</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mt-1 mr-2"></i>
                                <span class="text-gray-700">Nylon PA12 material</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mt-1 mr-2"></i>
                                <span class="text-gray-700">Functional end-use parts</span>
                            </li>
                        </ul>
                        <p class="text-primary font-semibold text-lg">From ₹200/part</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Materials -->
        <section id="materials" class="py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold text-gray-900 mb-4">Available Materials</h2>
                    <p class="text-xl text-gray-600">Choose the right material for your application</p>
                </div>
                <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="border-2 border-gray-200 rounded-lg p-6 hover:border-primary transition">
                        <h4 class="font-bold text-lg mb-2">PLA</h4>
                        <p class="text-gray-600 text-sm">Biodegradable, easy to print, good for prototypes</p>
                    </div>
                    <div class="border-2 border-gray-200 rounded-lg p-6 hover:border-primary transition">
                        <h4 class="font-bold text-lg mb-2">ABS</h4>
                        <p class="text-gray-600 text-sm">Strong, heat resistant, functional parts</p>
                    </div>
                    <div class="border-2 border-gray-200 rounded-lg p-6 hover:border-primary transition">
                        <h4 class="font-bold text-lg mb-2">PETG</h4>
                        <p class="text-gray-600 text-sm">Durable, weather resistant, food safe</p>
                    </div>
                    <div class="border-2 border-gray-200 rounded-lg p-6 hover:border-primary transition">
                        <h4 class="font-bold text-lg mb-2">TPU (Flexible)</h4>
                        <p class="text-gray-600 text-sm">Rubber-like, elastic, shock absorbing</p>
                    </div>
                    <div class="border-2 border-gray-200 rounded-lg p-6 hover:border-primary transition">
                        <h4 class="font-bold text-lg mb-2">Standard Resin</h4>
                        <p class="text-gray-600 text-sm">High detail, smooth finish, general purpose</p>
                    </div>
                    <div class="border-2 border-gray-200 rounded-lg p-6 hover:border-primary transition">
                        <h4 class="font-bold text-lg mb-2">Tough Resin</h4>
                        <p class="text-gray-600 text-sm">ABS-like properties, impact resistant</p>
                    </div>
                    <div class="border-2 border-gray-200 rounded-lg p-6 hover:border-primary transition">
                        <h4 class="font-bold text-lg mb-2">Clear Resin</h4>
                        <p class="text-gray-600 text-sm">Transparent, polishable to clarity</p>
                    </div>
                    <div class="border-2 border-gray-200 rounded-lg p-6 hover:border-primary transition">
                        <h4 class="font-bold text-lg mb-2">Nylon PA12</h4>
                        <p class="text-gray-600 text-sm">Strong, flexible, production-grade</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Pricing Calculator -->
        <section id="pricing" class="py-16 bg-gray-50">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold text-gray-900 mb-4">Estimate Your Cost</h2>
                    <p class="text-xl text-gray-600">Get an instant price estimate for your 3D printing project</p>
                </div>
                <div class="bg-white rounded-xl shadow-lg p-8">
                    <div id="calculator" class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Printing Technology</label>
                            <select id="tech" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                                <option value="fdm">FDM Printing</option>
                                <option value="sla">SLA/Resin Printing</option>
                                <option value="sls">SLS Printing</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Material</label>
                            <select id="material" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                                <option value="pla">PLA</option>
                                <option value="abs">ABS</option>
                                <option value="petg">PETG</option>
                                <option value="tpu">TPU</option>
                                <option value="resin">Standard Resin</option>
                            </select>
                        </div>
                        <div class="grid md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Length (mm)</label>
                                <input type="number" id="length" value="50" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Width (mm)</label>
                                <input type="number" id="width" value="50" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Height (mm)</label>
                                <input type="number" id="height" value="50" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                            <input type="number" id="quantity" value="1" min="1" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Infill Density</label>
                            <select id="infill" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                                <option value="10">10% (Prototype)</option>
                                <option value="20" selected>20% (Standard)</option>
                                <option value="50">50% (Strong)</option>
                                <option value="100">100% (Solid)</option>
                            </select>
                        </div>
                        <button onclick="calculatePrice()" class="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                            Calculate Price
                        </button>
                        <div id="priceResult" class="hidden bg-indigo-50 border-2 border-primary rounded-lg p-6 text-center">
                            <p class="text-gray-700 mb-2">Estimated Cost</p>
                            <p class="text-4xl font-bold text-primary" id="priceAmount">₹0</p>
                            <p class="text-sm text-gray-600 mt-2">* Final price may vary based on actual model complexity</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Quote Request Form -->
        <section id="quote" class="py-16 bg-white">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold text-gray-900 mb-4">Request a Quote</h2>
                    <p class="text-xl text-gray-600">Send us your 3D file and requirements for a detailed quote</p>
                </div>
                <div class="bg-gray-50 rounded-xl shadow-lg p-8">
                    <form id="quoteForm" class="space-y-6">
                        <div class="grid md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                <input type="text" name="name" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                                <input type="email" name="email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <input type="tel" name="phone" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                        </div>
                        <div class="grid md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Service Type *</label>
                                <select name="service" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                                    <option value="">Select service...</option>
                                    <option value="fdm">FDM Printing</option>
                                    <option value="sla">SLA/Resin Printing</option>
                                    <option value="sls">SLS Printing</option>
                                    <option value="design">3D Design Service</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Material Preference</label>
                                <select name="material" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                                    <option value="">Select material...</option>
                                    <option value="pla">PLA</option>
                                    <option value="abs">ABS</option>
                                    <option value="petg">PETG</option>
                                    <option value="tpu">TPU</option>
                                    <option value="resin">Standard Resin</option>
                                    <option value="tough">Tough Resin</option>
                                    <option value="nylon">Nylon PA12</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                            <input type="number" name="quantity" min="1" value="1" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
                            <textarea name="description" rows="4" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Describe your project requirements, dimensions, color preferences, finish requirements, delivery timeline, etc."></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">3D File Upload</label>
                            <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition">
                                <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                                <p class="text-gray-600 mb-2">Upload your 3D file (STL, OBJ, STEP)</p>
                                <p class="text-sm text-gray-500">You can also email files to: info@passion3dworld.com</p>
                            </div>
                        </div>
                        <button type="submit" class="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                            <i class="fas fa-paper-plane mr-2"></i>
                            Submit Quote Request
                        </button>
                        <div id="quoteMessage" class="hidden"></div>
                    </form>
                </div>
            </div>
        </section>

        <!-- Portfolio/Gallery -->
        <section id="portfolio" class="py-16 bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold text-gray-900 mb-4">Our Work</h2>
                    <p class="text-xl text-gray-600">See what we've created for our clients</p>
                </div>
                <div class="grid md:grid-cols-3 gap-8">
                    <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
                        <div class="h-64 bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center">
                            <i class="fas fa-robot text-white text-8xl"></i>
                        </div>
                        <div class="p-6">
                            <h3 class="font-bold text-lg mb-2">Prototype Models</h3>
                            <p class="text-gray-600">Functional prototypes for product development</p>
                        </div>
                    </div>
                    <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
                        <div class="h-64 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                            <i class="fas fa-chess text-white text-8xl"></i>
                        </div>
                        <div class="p-6">
                            <h3 class="font-bold text-lg mb-2">Miniatures & Models</h3>
                            <p class="text-gray-600">Highly detailed miniatures and display models</p>
                        </div>
                    </div>
                    <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
                        <div class="h-64 bg-gradient-to-br from-pink-400 to-red-400 flex items-center justify-center">
                            <i class="fas fa-cog text-white text-8xl"></i>
                        </div>
                        <div class="p-6">
                            <h3 class="font-bold text-lg mb-2">Custom Parts</h3>
                            <p class="text-gray-600">Replacement parts and custom components</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Process -->
        <section class="py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                    <p class="text-xl text-gray-600">Simple 4-step process from design to delivery</p>
                </div>
                <div class="grid md:grid-cols-4 gap-8">
                    <div class="text-center">
                        <div class="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
                        <h3 class="font-semibold text-lg mb-2">Upload Your Design</h3>
                        <p class="text-gray-600">Send us your 3D file or describe your requirements</p>
                    </div>
                    <div class="text-center">
                        <div class="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
                        <h3 class="font-semibold text-lg mb-2">Get a Quote</h3>
                        <p class="text-gray-600">Receive detailed pricing within 24 hours</p>
                    </div>
                    <div class="text-center">
                        <div class="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
                        <h3 class="font-semibold text-lg mb-2">We Print</h3>
                        <p class="text-gray-600">Your parts are printed with care and quality</p>
                    </div>
                    <div class="text-center">
                        <div class="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">4</div>
                        <h3 class="font-semibold text-lg mb-2">Fast Delivery</h3>
                        <p class="text-gray-600">Receive your prints within 2-5 business days</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- FAQ -->
        <section class="py-16 bg-gray-50">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                </div>
                <div class="space-y-4">
                    <div class="bg-white rounded-lg shadow-md p-6">
                        <h3 class="font-semibold text-lg mb-2 flex items-center">
                            <i class="fas fa-question-circle text-primary mr-2"></i>
                            What file formats do you accept?
                        </h3>
                        <p class="text-gray-600 pl-7">We accept STL, OBJ, STEP, and other common 3D file formats. If you don't have a 3D file, we also offer design services.</p>
                    </div>
                    <div class="bg-white rounded-lg shadow-md p-6">
                        <h3 class="font-semibold text-lg mb-2 flex items-center">
                            <i class="fas fa-question-circle text-primary mr-2"></i>
                            What is the typical turnaround time?
                        </h3>
                        <p class="text-gray-600 pl-7">Standard turnaround is 2-5 business days. Rush orders can be completed in 24-48 hours with additional fees.</p>
                    </div>
                    <div class="bg-white rounded-lg shadow-md p-6">
                        <h3 class="font-semibold text-lg mb-2 flex items-center">
                            <i class="fas fa-question-circle text-primary mr-2"></i>
                            Do you offer post-processing services?
                        </h3>
                        <p class="text-gray-600 pl-7">Yes, we offer sanding, painting, vapor smoothing, and other finishing services upon request.</p>
                    </div>
                    <div class="bg-white rounded-lg shadow-md p-6">
                        <h3 class="font-semibold text-lg mb-2 flex items-center">
                            <i class="fas fa-question-circle text-primary mr-2"></i>
                            What is your minimum order quantity?
                        </h3>
                        <p class="text-gray-600 pl-7">No minimum order! We print single prototypes as well as production runs of 1000+ units.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Contact -->
        <section id="contact" class="py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
                    <p class="text-xl text-gray-600">Have questions? We're here to help!</p>
                </div>
                <div class="grid md:grid-cols-2 gap-12">
                    <div>
                        <h3 class="text-2xl font-bold mb-6">Contact Information</h3>
                        <div class="space-y-4">
                            <div class="flex items-start">
                                <i class="fas fa-map-marker-alt text-primary text-xl mt-1 mr-4"></i>
                                <div>
                                    <h4 class="font-semibold">Address</h4>
                                    <p class="text-gray-600">Passion 3D World Studio<br>Your City, Your State</p>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <i class="fas fa-phone text-primary text-xl mt-1 mr-4"></i>
                                <div>
                                    <h4 class="font-semibold">Phone</h4>
                                    <p class="text-gray-600">+91 XXXXX XXXXX</p>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <i class="fas fa-envelope text-primary text-xl mt-1 mr-4"></i>
                                <div>
                                    <h4 class="font-semibold">Email</h4>
                                    <p class="text-gray-600">info@passion3dworld.com</p>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <i class="fas fa-clock text-primary text-xl mt-1 mr-4"></i>
                                <div>
                                    <h4 class="font-semibold">Business Hours</h4>
                                    <p class="text-gray-600">Mon-Fri: 9:00 AM - 6:00 PM<br>Sat: 10:00 AM - 4:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-2xl font-bold mb-6">Send us a Message</h3>
                        <form id="contactForm" class="space-y-4">
                            <div>
                                <input type="text" name="name" placeholder="Your Name" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                            </div>
                            <div>
                                <input type="email" name="email" placeholder="Your Email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                            </div>
                            <div>
                                <input type="text" name="subject" placeholder="Subject" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                            </div>
                            <div>
                                <textarea name="message" rows="4" placeholder="Your Message" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"></textarea>
                            </div>
                            <button type="submit" class="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                                Send Message
                            </button>
                            <div id="contactMessage" class="hidden"></div>
                        </form>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="bg-gray-900 text-white py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div class="flex items-center mb-4">
                            <i class="fas fa-cube text-primary text-2xl mr-2"></i>
                            <h3 class="text-xl font-bold">Passion 3D World</h3>
                        </div>
                        <p class="text-gray-400">Professional 3D printing services for makers, designers, and businesses.</p>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-4">Services</h4>
                        <ul class="space-y-2 text-gray-400">
                            <li><a href="#services" class="hover:text-white transition">FDM Printing</a></li>
                            <li><a href="#services" class="hover:text-white transition">SLA Printing</a></li>
                            <li><a href="#services" class="hover:text-white transition">SLS Printing</a></li>
                            <li><a href="#" class="hover:text-white transition">3D Design</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-4">Quick Links</h4>
                        <ul class="space-y-2 text-gray-400">
                            <li><a href="#pricing" class="hover:text-white transition">Pricing</a></li>
                            <li><a href="#portfolio" class="hover:text-white transition">Portfolio</a></li>
                            <li><a href="#quote" class="hover:text-white transition">Get Quote</a></li>
                            <li><a href="#contact" class="hover:text-white transition">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-4">Follow Us</h4>
                        <div class="flex space-x-4">
                            <a href="#" class="text-gray-400 hover:text-white transition"><i class="fab fa-facebook text-2xl"></i></a>
                            <a href="#" class="text-gray-400 hover:text-white transition"><i class="fab fa-instagram text-2xl"></i></a>
                            <a href="#" class="text-gray-400 hover:text-white transition"><i class="fab fa-twitter text-2xl"></i></a>
                            <a href="#" class="text-gray-400 hover:text-white transition"><i class="fab fa-linkedin text-2xl"></i></a>
                        </div>
                    </div>
                </div>
                <div class="border-t border-gray-800 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 Passion 3D World. All rights reserved.</p>
                </div>
            </div>
        </footer>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

export default app
