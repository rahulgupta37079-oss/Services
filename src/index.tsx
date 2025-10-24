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

// API endpoint for file upload
app.post('/api/upload', async (c) => {
  try {
    const formData = await c.req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return c.json({ success: false, message: 'No file uploaded' }, 400)
    }
    
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return c.json({ success: false, message: 'File size exceeds 10MB limit' }, 400)
    }
    
    // Check file type (allow common 3D model formats)
    const allowedTypes = [
      'application/octet-stream', // STL
      'model/stl',
      'application/sla',
      'text/plain', // OBJ
      'application/obj',
      'model/obj',
      'application/step', // STEP
      'application/stp',
      'model/step'
    ]
    
    const fileName = file.name.toLowerCase()
    const validExtensions = ['.stl', '.obj', '.step', '.stp', '.3mf', '.ply']
    const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext))
    
    if (!hasValidExtension) {
      return c.json({ 
        success: false, 
        message: 'Invalid file type. Please upload STL, OBJ, STEP, or 3MF files' 
      }, 400)
    }
    
    // Convert file to base64 for email attachment
    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    
    // Store file info
    const fileInfo = {
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      base64: base64.substring(0, 100) + '...' // Just store a preview
    }
    
    console.log('File uploaded:', { name: file.name, size: file.size, type: file.type })
    
    return c.json({ 
      success: true, 
      message: 'File uploaded successfully',
      file: {
        name: file.name,
        size: file.size,
        type: file.type
      }
    })
  } catch (error) {
    console.error('File upload error:', error)
    return c.json({ success: false, message: 'File upload failed' }, 500)
  }
})

// API endpoint for quote requests (with file support)
app.post('/api/quote', async (c) => {
  try {
    const data = await c.req.json()
    
    // Validate required fields
    const { name, email, phone, service, material, quantity, description, fileName, fileSize } = data
    
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
          ${fileName ? `<p><strong>File Uploaded:</strong> ${fileName} (${(fileSize / 1024 / 1024).toFixed(2)} MB)</p>` : ''}
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
                    <div class="hidden md:flex space-x-8 items-center">
                        <div class="relative group">
                            <button class="text-gray-700 hover:text-primary transition flex items-center">
                                Services <i class="fas fa-chevron-down ml-1 text-xs"></i>
                            </button>
                            <div class="absolute hidden group-hover:block bg-white shadow-xl rounded-lg mt-2 py-2 w-56 z-50">
                                <a href="/3d-printing-quote" class="block px-4 py-2 hover:bg-indigo-50">
                                    <i class="fas fa-print mr-2 text-primary"></i>3D Printing Quote
                                </a>
                                <a href="/cnc-machining-quote" class="block px-4 py-2 hover:bg-indigo-50">
                                    <i class="fas fa-cogs mr-2 text-primary"></i>CNC Machining Quote
                                </a>
                                <a href="/sheet-metal-quote" class="block px-4 py-2 hover:bg-indigo-50">
                                    <i class="fas fa-industry mr-2 text-primary"></i>Sheet Metal Quote
                                </a>
                                <a href="/pcb-quote" class="block px-4 py-2 hover:bg-indigo-50">
                                    <i class="fas fa-microchip mr-2 text-primary"></i>PCB Quote
                                </a>
                                <div class="border-t my-2"></div>
                                <a href="#services" class="block px-4 py-2 hover:bg-indigo-50 text-gray-600 text-sm">
                                    View All Services
                                </a>
                            </div>
                        </div>
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
                    <h2 class="text-5xl font-bold mb-6">Professional Manufacturing Services</h2>
                    <p class="text-xl mb-8 text-indigo-100">3D Printing • CNC Machining • Sheet Metal • PCB Manufacturing</p>
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
                            <label class="block text-sm font-medium text-gray-700 mb-2">3D File Upload (Optional)</label>
                            <input type="file" id="fileInput" accept=".stl,.obj,.step,.stp,.3mf,.ply" class="hidden">
                            <div id="fileButton" class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition cursor-pointer">
                                <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                                <p class="text-gray-600 mb-2">Click to upload your 3D file</p>
                                <p class="text-sm text-gray-500">Supported: STL, OBJ, STEP, 3MF (Max 10MB)</p>
                                <p class="text-xs text-gray-400 mt-2">Or email files to: info@passion3dworld.com</p>
                            </div>
                            <div id="fileInfo" class="hidden mt-3 bg-green-50 border border-green-200 rounded-lg p-4">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center">
                                        <i class="fas fa-file-alt text-green-600 text-2xl mr-3"></i>
                                        <div>
                                            <p class="font-semibold text-gray-800" id="fileName">file.stl</p>
                                            <p class="text-sm text-gray-600" id="fileSize">0 MB</p>
                                        </div>
                                    </div>
                                    <button type="button" id="removeFile" class="text-red-500 hover:text-red-700">
                                        <i class="fas fa-times text-xl"></i>
                                    </button>
                                </div>
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
                                    <p class="text-gray-600">+91 9137361474</p>
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
                                    <p class="text-gray-600">Mon-Fri: 9:00 AM - 12:00 PM<br>Sat: 9:00 AM - 12:00 PM</p>
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

// 3D Printing Quote Page
app.get('/3d-printing-quote', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>3D Printing Quote | Passion 3D World</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
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
        <link href="/static/style.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <header class="bg-white shadow-sm sticky top-0 z-50">
            <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <i class="fas fa-cube text-primary text-3xl mr-3"></i>
                        <a href="/" class="text-2xl font-bold text-gray-900">Passion 3D World</a>
                    </div>
                    <div class="hidden md:flex space-x-6">
                        <a href="/" class="text-gray-700 hover:text-primary transition">Home</a>
                        <div class="relative group">
                            <button class="text-gray-700 hover:text-primary transition flex items-center">
                                Services <i class="fas fa-chevron-down ml-1 text-xs"></i>
                            </button>
                            <div class="absolute hidden group-hover:block bg-white shadow-xl rounded-lg mt-2 py-2 w-56 z-50">
                                <a href="/3d-printing-quote" class="block px-4 py-2 hover:bg-indigo-50 text-primary font-semibold">
                                    <i class="fas fa-print mr-2"></i>3D Printing
                                </a>
                                <a href="/cnc-machining-quote" class="block px-4 py-2 hover:bg-indigo-50">
                                    <i class="fas fa-cogs mr-2 text-primary"></i>CNC Machining
                                </a>
                                <a href="/sheet-metal-quote" class="block px-4 py-2 hover:bg-indigo-50">
                                    <i class="fas fa-industry mr-2 text-primary"></i>Sheet Metal
                                </a>
                                <a href="/pcb-quote" class="block px-4 py-2 hover:bg-indigo-50">
                                    <i class="fas fa-microchip mr-2 text-primary"></i>PCB Manufacturing
                                </a>
                            </div>
                        </div>
                        <a href="/#contact" class="text-gray-700 hover:text-primary transition">Contact</a>
                    </div>
                    <a href="tel:+919137361474" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                        <i class="fas fa-phone mr-2"></i>Call Now
                    </a>
                </div>
            </nav>
        </header>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="text-center mb-12">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">
                    <i class="fas fa-print text-primary mr-3"></i>
                    3D Printing Quote Calculator
                </h1>
                <p class="text-xl text-gray-600">Get instant pricing for your 3D printing project</p>
            </div>

            <div class="grid lg:grid-cols-3 gap-8">
                <!-- Quote Form -->
                <div class="lg:col-span-2">
                    <div class="bg-white rounded-xl shadow-lg p-8">
                        <h2 class="text-2xl font-bold mb-6">Project Details</h2>
                        
                        <form id="printingQuoteForm" class="space-y-6">
                            <!-- Technology Selection -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-3">
                                    <i class="fas fa-cog mr-2 text-primary"></i>Technology
                                </label>
                                <div class="grid md:grid-cols-3 gap-4">
                                    <label class="relative cursor-pointer">
                                        <input type="radio" name="technology" value="fdm" checked class="peer sr-only">
                                        <div class="border-2 border-gray-300 rounded-lg p-4 peer-checked:border-primary peer-checked:bg-indigo-50">
                                            <h4 class="font-semibold">FDM</h4>
                                            <p class="text-sm text-gray-600">From ₹50/part</p>
                                        </div>
                                    </label>
                                    <label class="relative cursor-pointer">
                                        <input type="radio" name="technology" value="sla" class="peer sr-only">
                                        <div class="border-2 border-gray-300 rounded-lg p-4 peer-checked:border-primary peer-checked:bg-indigo-50">
                                            <h4 class="font-semibold">SLA/Resin</h4>
                                            <p class="text-sm text-gray-600">From ₹100/part</p>
                                        </div>
                                    </label>
                                    <label class="relative cursor-pointer">
                                        <input type="radio" name="technology" value="sls" class="peer sr-only">
                                        <div class="border-2 border-gray-300 rounded-lg p-4 peer-checked:border-primary peer-checked:bg-indigo-50">
                                            <h4 class="font-semibold">SLS</h4>
                                            <p class="text-sm text-gray-600">From ₹200/part</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <!-- Material Selection -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-cube mr-2 text-primary"></i>Material
                                </label>
                                <select id="material" name="material" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                    <option value="pla">PLA - Standard</option>
                                    <option value="abs">ABS - Heat Resistant</option>
                                    <option value="petg">PETG - Durable</option>
                                    <option value="tpu">TPU - Flexible</option>
                                    <option value="resin">Standard Resin</option>
                                    <option value="tough">Tough Resin</option>
                                    <option value="nylon">Nylon PA12</option>
                                </select>
                            </div>

                            <!-- Dimensions -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-ruler-combined mr-2 text-primary"></i>Dimensions (mm)
                                </label>
                                <div class="grid grid-cols-3 gap-4">
                                    <input type="number" id="length" placeholder="Length" value="50" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                    <input type="number" id="width" placeholder="Width" value="50" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                    <input type="number" id="height" placeholder="Height" value="50" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                </div>
                            </div>

                            <!-- Infill & Surface Finish -->
                            <div class="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        <i class="fas fa-percentage mr-2 text-primary"></i>Infill Density
                                    </label>
                                    <select id="infill" name="infill" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                        <option value="10">10% - Prototype</option>
                                        <option value="20" selected>20% - Standard</option>
                                        <option value="50">50% - Strong</option>
                                        <option value="100">100% - Solid</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        <i class="fas fa-paint-brush mr-2 text-primary"></i>Surface Finish
                                    </label>
                                    <select name="finish" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                        <option value="standard">Standard</option>
                                        <option value="smooth">Smooth (Sanding)</option>
                                        <option value="painted">Painted</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Quantity & Color -->
                            <div class="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        <i class="fas fa-sort-numeric-up mr-2 text-primary"></i>Quantity
                                    </label>
                                    <input type="number" id="quantity" name="quantity" value="1" min="1" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        <i class="fas fa-palette mr-2 text-primary"></i>Color
                                    </label>
                                    <select name="color" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                        <option value="standard">Standard (White/Gray)</option>
                                        <option value="black">Black</option>
                                        <option value="custom">Custom Color (+10%)</option>
                                    </select>
                                </div>
                            </div>

                            <!-- File Upload -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-cloud-upload-alt mr-2 text-primary"></i>Upload 3D File
                                </label>
                                <input type="file" id="fileInput3d" accept=".stl,.obj,.step,.stp,.3mf" class="hidden">
                                <div id="fileButton3d" class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition">
                                    <i class="fas fa-file-upload text-3xl text-gray-400 mb-2"></i>
                                    <p class="text-gray-600">Click to upload STL, OBJ, STEP (Max 10MB)</p>
                                </div>
                                <div id="fileInfo3d" class="hidden mt-3 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                                    <div class="flex items-center">
                                        <i class="fas fa-file-alt text-green-600 mr-3"></i>
                                        <span id="fileName3d" class="font-semibold"></span>
                                    </div>
                                    <button type="button" id="removeFile3d" class="text-red-500 hover:text-red-700">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>

                            <button type="button" onclick="calculate3DPrice()" class="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                                <i class="fas fa-calculator mr-2"></i>Calculate Price
                            </button>
                        </form>
                    </div>
                </div>

                <!-- Price Summary -->
                <div class="lg:col-span-1">
                    <div class="bg-white rounded-xl shadow-lg p-8 sticky top-24">
                        <h3 class="text-xl font-bold mb-6">Price Summary</h3>
                        
                        <div id="priceBreakdown" class="space-y-4 mb-6">
                            <div class="flex justify-between text-gray-600">
                                <span>Base Price:</span>
                                <span id="basePrice">₹0</span>
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>Material:</span>
                                <span id="materialCost">₹0</span>
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>Quantity (×<span id="qtyDisplay">1</span>):</span>
                                <span id="quantityCost">₹0</span>
                            </div>
                            <div class="flex justify-between text-green-600">
                                <span>Bulk Discount:</span>
                                <span id="discount">-₹0</span>
                            </div>
                            <hr>
                            <div class="flex justify-between text-2xl font-bold text-primary">
                                <span>Total:</span>
                                <span id="totalPrice">₹0</span>
                            </div>
                        </div>

                        <div class="bg-indigo-50 rounded-lg p-4 mb-6">
                            <h4 class="font-semibold mb-2">
                                <i class="fas fa-info-circle text-primary mr-2"></i>Includes:
                            </h4>
                            <ul class="text-sm space-y-1 text-gray-700">
                                <li>✓ 3D Printing</li>
                                <li>✓ Support Removal</li>
                                <li>✓ Basic Finishing</li>
                                <li>✓ Quality Check</li>
                            </ul>
                        </div>

                        <a href="tel:+919137361474" class="block w-full bg-green-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-700 transition mb-3">
                            <i class="fas fa-phone mr-2"></i>Call to Order
                        </a>
                        <a href="mailto:info@passion3dworld.com" class="block w-full border-2 border-primary text-primary text-center py-3 rounded-lg font-semibold hover:bg-indigo-50 transition">
                            <i class="fas fa-envelope mr-2"></i>Email Quote
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <script src="/static/quote-calculator.js"></script>
    </body>
    </html>
  `)
})

// CNC Machining Quote Page  
app.get('/cnc-machining-quote', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CNC Machining Quote | Passion 3D World</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
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
        <link href="/static/style.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <header class="bg-white shadow-sm sticky top-0 z-50">
            <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <i class="fas fa-cube text-primary text-3xl mr-3"></i>
                        <a href="/" class="text-2xl font-bold text-gray-900">Passion 3D World</a>
                    </div>
                    <div class="hidden md:flex space-x-6">
                        <a href="/" class="text-gray-700 hover:text-primary transition">Home</a>
                        <div class="relative group">
                            <button class="text-gray-700 hover:text-primary transition flex items-center">
                                Services <i class="fas fa-chevron-down ml-1 text-xs"></i>
                            </button>
                            <div class="absolute hidden group-hover:block bg-white shadow-xl rounded-lg mt-2 py-2 w-56 z-50">
                                <a href="/3d-printing-quote" class="block px-4 py-2 hover:bg-indigo-50">
                                    <i class="fas fa-print mr-2 text-primary"></i>3D Printing
                                </a>
                                <a href="/cnc-machining-quote" class="block px-4 py-2 hover:bg-indigo-50 text-primary font-semibold">
                                    <i class="fas fa-cogs mr-2"></i>CNC Machining
                                </a>
                                <a href="/sheet-metal-quote" class="block px-4 py-2 hover:bg-indigo-50">
                                    <i class="fas fa-industry mr-2 text-primary"></i>Sheet Metal
                                </a>
                                <a href="/pcb-quote" class="block px-4 py-2 hover:bg-indigo-50">
                                    <i class="fas fa-microchip mr-2 text-primary"></i>PCB Manufacturing
                                </a>
                            </div>
                        </div>
                        <a href="/#contact" class="text-gray-700 hover:text-primary transition">Contact</a>
                    </div>
                    <a href="tel:+919137361474" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                        <i class="fas fa-phone mr-2"></i>Call Now
                    </a>
                </div>
            </nav>
        </header>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="text-center mb-12">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">
                    <i class="fas fa-cogs text-primary mr-3"></i>
                    CNC Machining Quote Calculator
                </h1>
                <p class="text-xl text-gray-600">Get instant pricing for precision CNC machining</p>
            </div>

            <div class="grid lg:grid-cols-3 gap-8">
                <!-- Quote Form -->
                <div class="lg:col-span-2">
                    <div class="bg-white rounded-xl shadow-lg p-8">
                        <h2 class="text-2xl font-bold mb-6">Part Specifications</h2>
                        
                        <form id="cncQuoteForm" class="space-y-6">
                            <!-- Material Selection -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-cube mr-2 text-primary"></i>Material
                                </label>
                                <select id="cncMaterial" onchange="calculateCNCPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                    <option value="aluminum">Aluminum 6061</option>
                                    <option value="steel">Mild Steel</option>
                                    <option value="stainless">Stainless Steel 304</option>
                                    <option value="brass">Brass</option>
                                    <option value="copper">Copper</option>
                                    <option value="plastic_abs">Plastic - ABS</option>
                                    <option value="plastic_pom">Plastic - POM (Delrin)</option>
                                    <option value="titanium">Titanium</option>
                                </select>
                            </div>

                            <!-- Dimensions -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-ruler-combined mr-2 text-primary"></i>Part Dimensions (mm)
                                </label>
                                <div class="grid grid-cols-3 gap-4">
                                    <input type="number" id="cncLength" placeholder="Length" value="100" onchange="calculateCNCPrice()" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                    <input type="number" id="cncWidth" placeholder="Width" value="100" onchange="calculateCNCPrice()" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                    <input type="number" id="cncHeight" placeholder="Height" value="50" onchange="calculateCNCPrice()" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                </div>
                                <p class="text-sm text-gray-500 mt-2">Surface Area: <span id="cncSurfaceArea" class="font-semibold">0 cm²</span></p>
                            </div>

                            <!-- Complexity Level -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-3">
                                    <i class="fas fa-sliders-h mr-2 text-primary"></i>Machining Complexity
                                </label>
                                <select id="cncComplexity" onchange="calculateCNCPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                    <option value="simple">Simple - Basic shapes, minimal features</option>
                                    <option value="medium" selected>Medium - Multiple features, some intricate work</option>
                                    <option value="complex">Complex - Complex geometries, tight tolerances</option>
                                    <option value="very_complex">Very Complex - 5-axis work, very tight tolerances</option>
                                </select>
                                <p class="text-sm text-gray-500 mt-2">Estimated Machine Time: <span id="cncMachineTime" class="font-semibold">0 hrs</span></p>
                            </div>

                            <!-- Surface Finish -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-paint-brush mr-2 text-primary"></i>Surface Finish
                                </label>
                                <select id="cncFinish" onchange="calculateCNCPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                    <option value="as_machined">As Machined</option>
                                    <option value="deburred">Deburred</option>
                                    <option value="bead_blasted">Bead Blasted</option>
                                    <option value="anodized">Anodized (Aluminum only)</option>
                                    <option value="powder_coated">Powder Coated</option>
                                    <option value="polished">Polished</option>
                                </select>
                            </div>

                            <!-- Quantity -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-sort-numeric-up mr-2 text-primary"></i>Quantity
                                </label>
                                <input type="number" id="cncQuantity" value="1" min="1" onchange="calculateCNCPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                <p class="text-sm text-gray-500 mt-2">💡 Bulk Discounts: 10+ (10% off), 20+ (15% off), 50+ (20% off)</p>
                            </div>

                            <button type="button" onclick="calculateCNCPrice()" class="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                                <i class="fas fa-calculator mr-2"></i>Calculate Price
                            </button>
                        </form>
                    </div>
                </div>

                <!-- Price Summary -->
                <div class="lg:col-span-1">
                    <div class="bg-white rounded-xl shadow-lg p-8 sticky top-24">
                        <h3 class="text-xl font-bold mb-6">Price Breakdown</h3>
                        
                        <div id="cncPriceBreakdown" class="space-y-4 mb-6">
                            <div class="flex justify-between text-gray-600">
                                <span>Material:</span>
                                <span id="cncMaterialCost">₹0</span>
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>Machining:</span>
                                <span id="cncMachiningCost">₹0</span>
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>Setup:</span>
                                <span id="cncSetupCost">₹0</span>
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>Finish:</span>
                                <span id="cncFinishCost">₹0</span>
                            </div>
                            <hr>
                            <div class="flex justify-between font-semibold">
                                <span>Per Part:</span>
                                <span id="cncPricePerPart">₹0</span>
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>Quantity (×<span id="cncQtyDisplay">1</span>):</span>
                                <span id="cncQuantityCost">₹0</span>
                            </div>
                            <div id="cncDiscountSection" class="hidden">
                                <div class="flex justify-between text-green-600">
                                    <span>Bulk Discount (<span id="cncDiscountPercent">0</span>):</span>
                                    <span id="cncDiscount">-₹0</span>
                                </div>
                            </div>
                            <hr>
                            <div class="flex justify-between text-2xl font-bold text-primary">
                                <span>Total:</span>
                                <span id="cncTotalPrice">₹0</span>
                            </div>
                        </div>

                        <div class="bg-indigo-50 rounded-lg p-4 mb-6">
                            <h4 class="font-semibold mb-2">
                                <i class="fas fa-info-circle text-primary mr-2"></i>Includes:
                            </h4>
                            <ul class="text-sm space-y-1 text-gray-700">
                                <li>✓ CNC Machining</li>
                                <li>✓ Precision ±0.01mm</li>
                                <li>✓ Quality Inspection</li>
                                <li>✓ Deburring</li>
                            </ul>
                        </div>

                        <a href="tel:+919137361474" class="block w-full bg-green-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-700 transition mb-3">
                            <i class="fas fa-phone mr-2"></i>Call to Order
                        </a>
                        <a href="mailto:info@passion3dworld.com" class="block w-full border-2 border-primary text-primary text-center py-3 rounded-lg font-semibold hover:bg-indigo-50 transition">
                            <i class="fas fa-envelope mr-2"></i>Email Quote
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <script src="/static/manufacturing-calculators.js"></script>
    </body>
    </html>
  `)
})

// Sheet Metal Quote Page
app.get('/sheet-metal-quote', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sheet Metal Quote | Passion 3D World</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
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
        <link href="/static/style.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <header class="bg-white shadow-sm sticky top-0 z-50">
            <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <i class="fas fa-cube text-primary text-3xl mr-3"></i>
                        <a href="/" class="text-2xl font-bold text-gray-900">Passion 3D World</a>
                    </div>
                    <div class="hidden md:flex space-x-6">
                        <a href="/" class="text-gray-700 hover:text-primary transition">Home</a>
                        <div class="relative group">
                            <button class="text-gray-700 hover:text-primary transition flex items-center">
                                Services <i class="fas fa-chevron-down ml-1 text-xs"></i>
                            </button>
                            <div class="absolute hidden group-hover:block bg-white shadow-xl rounded-lg mt-2 py-2 w-56 z-50">
                                <a href="/3d-printing-quote" class="block px-4 py-2 hover:bg-indigo-50">
                                    <i class="fas fa-print mr-2 text-primary"></i>3D Printing
                                </a>
                                <a href="/cnc-machining-quote" class="block px-4 py-2 hover:bg-indigo-50">
                                    <i class="fas fa-cogs mr-2 text-primary"></i>CNC Machining
                                </a>
                                <a href="/sheet-metal-quote" class="block px-4 py-2 hover:bg-indigo-50 text-primary font-semibold">
                                    <i class="fas fa-industry mr-2"></i>Sheet Metal
                                </a>
                                <a href="/pcb-quote" class="block px-4 py-2 hover:bg-indigo-50">
                                    <i class="fas fa-microchip mr-2 text-primary"></i>PCB Manufacturing
                                </a>
                            </div>
                        </div>
                        <a href="/#contact" class="text-gray-700 hover:text-primary transition">Contact</a>
                    </div>
                    <a href="tel:+919137361474" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                        <i class="fas fa-phone mr-2"></i>Call Now
                    </a>
                </div>
            </nav>
        </header>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="text-center mb-12">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">
                    <i class="fas fa-industry text-primary mr-3"></i>
                    Sheet Metal Fabrication Quote Calculator
                </h1>
                <p class="text-xl text-gray-600">Get instant pricing for custom sheet metal fabrication</p>
            </div>

            <div class="grid lg:grid-cols-3 gap-8">
                <!-- Quote Form -->
                <div class="lg:col-span-2">
                    <div class="bg-white rounded-xl shadow-lg p-8">
                        <h2 class="text-2xl font-bold mb-6">Fabrication Details</h2>
                        
                        <form id="sheetMetalQuoteForm" class="space-y-6">
                            <!-- Material Selection -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-cube mr-2 text-primary"></i>Material Type
                                </label>
                                <select id="sheetMaterial" onchange="calculateSheetMetalPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                    <option value="mild_steel">Mild Steel</option>
                                    <option value="stainless">Stainless Steel 304</option>
                                    <option value="aluminum">Aluminum 5052</option>
                                    <option value="galvanized">Galvanized Steel</option>
                                    <option value="copper">Copper</option>
                                </select>
                            </div>

                            <!-- Thickness Selector -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-compress mr-2 text-primary"></i>Material Thickness (mm)
                                </label>
                                <select id="sheetThickness" onchange="calculateSheetMetalPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                    <option value="0.5">0.5mm (26 gauge)</option>
                                    <option value="0.8">0.8mm (22 gauge)</option>
                                    <option value="1.0" selected>1.0mm (20 gauge)</option>
                                    <option value="1.2">1.2mm (18 gauge)</option>
                                    <option value="1.5">1.5mm (16 gauge)</option>
                                    <option value="2.0">2.0mm (14 gauge)</option>
                                    <option value="3.0">3.0mm (11 gauge)</option>
                                    <option value="4.0">4.0mm (8 gauge)</option>
                                    <option value="5.0">5.0mm</option>
                                    <option value="6.0">6.0mm (1/4 inch)</option>
                                    <option value="8.0">8.0mm</option>
                                    <option value="10.0">10.0mm</option>
                                    <option value="12.0">12.0mm</option>
                                    <option value="15.0">15.0mm</option>
                                    <option value="20.0">20.0mm</option>
                                </select>
                            </div>

                            <!-- Sheet Dimensions -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-ruler-combined mr-2 text-primary"></i>Sheet Dimensions (mm)
                                </label>
                                <div class="grid grid-cols-2 gap-4">
                                    <input type="number" id="sheetLength" placeholder="Length" value="200" onchange="calculateSheetMetalPrice()" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                    <input type="number" id="sheetWidth" placeholder="Width" value="150" onchange="calculateSheetMetalPrice()" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                </div>
                                <div class="mt-2 text-sm text-gray-500">
                                    <p>Sheet Area: <span id="sheetArea" class="font-semibold">0 cm²</span></p>
                                    <p>Cutting Perimeter: <span id="sheetPerimeter" class="font-semibold">0 cm</span></p>
                                </div>
                            </div>

                            <!-- Bending Details -->
                            <div class="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        <i class="fas fa-angle-double-right mr-2 text-primary"></i>Number of Bends
                                    </label>
                                    <input type="number" id="bendCount" value="0" min="0" onchange="calculateSheetMetalPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        <i class="fas fa-project-diagram mr-2 text-primary"></i>Bending Complexity
                                    </label>
                                    <select id="bendComplexity" onchange="calculateSheetMetalPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                        <option value="simple">Simple - 90° bends</option>
                                        <option value="medium" selected>Medium - Multiple angles</option>
                                        <option value="complex">Complex - Tight tolerances</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Welding Requirements -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-fire mr-2 text-primary"></i>Welding Requirements
                                </label>
                                <select id="welding" onchange="calculateSheetMetalPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                    <option value="none">No Welding</option>
                                    <option value="spot">Spot Welding</option>
                                    <option value="seam_short">Seam Welding (<50cm)</option>
                                    <option value="seam_long">Seam Welding (>50cm)</option>
                                    <option value="full_assembly">Full Welded Assembly</option>
                                </select>
                            </div>

                            <!-- Surface Finish -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-paint-brush mr-2 text-primary"></i>Surface Finish
                                </label>
                                <select id="sheetFinish" onchange="calculateSheetMetalPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                    <option value="as_cut">As Cut</option>
                                    <option value="deburred">Deburred</option>
                                    <option value="powder_coated">Powder Coated</option>
                                    <option value="painted">Painted</option>
                                    <option value="polished">Polished</option>
                                    <option value="zinc_plated">Zinc Plated</option>
                                </select>
                            </div>

                            <!-- Quantity -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-sort-numeric-up mr-2 text-primary"></i>Quantity
                                </label>
                                <input type="number" id="sheetQuantity" value="1" min="1" onchange="calculateSheetMetalPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                <p class="text-sm text-gray-500 mt-2">💡 Bulk Discounts: 10+ (10%), 20+ (15%), 50+ (20%), 100+ (25%)</p>
                            </div>

                            <button type="button" onclick="calculateSheetMetalPrice()" class="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                                <i class="fas fa-calculator mr-2"></i>Calculate Price
                            </button>
                        </form>
                    </div>
                </div>

                <!-- Price Summary -->
                <div class="lg:col-span-1">
                    <div class="bg-white rounded-xl shadow-lg p-8 sticky top-24">
                        <h3 class="text-xl font-bold mb-6">Price Breakdown</h3>
                        
                        <div id="sheetPriceBreakdown" class="space-y-4 mb-6">
                            <div class="flex justify-between text-gray-600">
                                <span>Material:</span>
                                <span id="sheetMaterialCost">₹0</span>
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>Cutting:</span>
                                <span id="sheetCuttingCost">₹0</span>
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>Bending:</span>
                                <span id="sheetBendingCost">₹0</span>
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>Welding:</span>
                                <span id="sheetWeldingCost">₹0</span>
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>Finish:</span>
                                <span id="sheetFinishCost">₹0</span>
                            </div>
                            <hr>
                            <div class="flex justify-between font-semibold">
                                <span>Per Part:</span>
                                <span id="sheetPricePerPart">₹0</span>
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>Quantity (×<span id="sheetQtyDisplay">1</span>):</span>
                                <span id="sheetQuantityCost">₹0</span>
                            </div>
                            <div id="sheetDiscountSection" class="hidden">
                                <div class="flex justify-between text-green-600">
                                    <span>Bulk Discount (<span id="sheetDiscountPercent">0</span>):</span>
                                    <span id="sheetDiscount">-₹0</span>
                                </div>
                            </div>
                            <hr>
                            <div class="flex justify-between text-2xl font-bold text-primary">
                                <span>Total:</span>
                                <span id="sheetTotalPrice">₹0</span>
                            </div>
                        </div>

                        <div class="bg-indigo-50 rounded-lg p-4 mb-6">
                            <h4 class="font-semibold mb-2">
                                <i class="fas fa-info-circle text-primary mr-2"></i>Includes:
                            </h4>
                            <ul class="text-sm space-y-1 text-gray-700">
                                <li>✓ Laser/Plasma Cutting</li>
                                <li>✓ CNC Press Brake</li>
                                <li>✓ Quality Check</li>
                                <li>✓ Basic Deburring</li>
                            </ul>
                        </div>

                        <a href="tel:+919137361474" class="block w-full bg-green-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-700 transition mb-3">
                            <i class="fas fa-phone mr-2"></i>Call to Order
                        </a>
                        <a href="mailto:info@passion3dworld.com" class="block w-full border-2 border-primary text-primary text-center py-3 rounded-lg font-semibold hover:bg-indigo-50 transition">
                            <i class="fas fa-envelope mr-2"></i>Email Quote
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <script src="/static/manufacturing-calculators.js"></script>
    </body>
    </html>
  `)
})

// PCB Manufacturing Quote Page
app.get('/pcb-quote', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PCB Manufacturing Quote | Passion 3D World</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
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
        <link href="/static/style.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <header class="bg-white shadow-sm sticky top-0 z-50">
            <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <i class="fas fa-cube text-primary text-3xl mr-3"></i>
                        <a href="/" class="text-2xl font-bold text-gray-900">Passion 3D World</a>
                    </div>
                    <div class="hidden md:flex space-x-6">
                        <a href="/" class="text-gray-700 hover:text-primary transition">Home</a>
                        <div class="relative group">
                            <button class="text-gray-700 hover:text-primary transition flex items-center">
                                Services <i class="fas fa-chevron-down ml-1 text-xs"></i>
                            </button>
                            <div class="absolute hidden group-hover:block bg-white shadow-xl rounded-lg mt-2 py-2 w-56 z-50">
                                <a href="/3d-printing-quote" class="block px-4 py-2 hover:bg-indigo-50">
                                    <i class="fas fa-print mr-2 text-primary"></i>3D Printing
                                </a>
                                <a href="/cnc-machining-quote" class="block px-4 py-2 hover:bg-indigo-50">
                                    <i class="fas fa-cogs mr-2 text-primary"></i>CNC Machining
                                </a>
                                <a href="/sheet-metal-quote" class="block px-4 py-2 hover:bg-indigo-50">
                                    <i class="fas fa-industry mr-2 text-primary"></i>Sheet Metal
                                </a>
                                <a href="/pcb-quote" class="block px-4 py-2 hover:bg-indigo-50 text-primary font-semibold">
                                    <i class="fas fa-microchip mr-2"></i>PCB Manufacturing
                                </a>
                            </div>
                        </div>
                        <a href="/#contact" class="text-gray-700 hover:text-primary transition">Contact</a>
                    </div>
                    <a href="tel:+919137361474" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                        <i class="fas fa-phone mr-2"></i>Call Now
                    </a>
                </div>
            </nav>
        </header>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="text-center mb-12">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">
                    <i class="fas fa-microchip text-primary mr-3"></i>
                    PCB Manufacturing Quote Calculator
                </h1>
                <p class="text-xl text-gray-600">Get instant pricing for custom PCB fabrication & assembly</p>
            </div>

            <div class="grid lg:grid-cols-3 gap-8">
                <!-- Quote Form -->
                <div class="lg:col-span-2">
                    <div class="bg-white rounded-xl shadow-lg p-8">
                        <h2 class="text-2xl font-bold mb-6">PCB Specifications</h2>
                        
                        <form id="pcbQuoteForm" class="space-y-6">
                            <!-- Layer Count Selector -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-3">
                                    <i class="fas fa-layer-group mr-2 text-primary"></i>PCB Layers
                                </label>
                                <div class="grid grid-cols-4 md:grid-cols-7 gap-2">
                                    <label class="relative cursor-pointer">
                                        <input type="radio" name="pcbLayers" id="pcbLayers" value="1" class="peer sr-only">
                                        <div class="border-2 border-gray-300 rounded-lg p-3 text-center peer-checked:border-primary peer-checked:bg-indigo-50">
                                            <h4 class="font-semibold">1</h4>
                                        </div>
                                    </label>
                                    <label class="relative cursor-pointer">
                                        <input type="radio" name="pcbLayers" value="2" checked class="peer sr-only" onchange="calculatePCBPrice()">
                                        <div class="border-2 border-gray-300 rounded-lg p-3 text-center peer-checked:border-primary peer-checked:bg-indigo-50">
                                            <h4 class="font-semibold">2</h4>
                                        </div>
                                    </label>
                                    <label class="relative cursor-pointer">
                                        <input type="radio" name="pcbLayers" value="4" class="peer sr-only" onchange="calculatePCBPrice()">
                                        <div class="border-2 border-gray-300 rounded-lg p-3 text-center peer-checked:border-primary peer-checked:bg-indigo-50">
                                            <h4 class="font-semibold">4</h4>
                                        </div>
                                    </label>
                                    <label class="relative cursor-pointer">
                                        <input type="radio" name="pcbLayers" value="6" class="peer sr-only" onchange="calculatePCBPrice()">
                                        <div class="border-2 border-gray-300 rounded-lg p-3 text-center peer-checked:border-primary peer-checked:bg-indigo-50">
                                            <h4 class="font-semibold">6</h4>
                                        </div>
                                    </label>
                                    <label class="relative cursor-pointer">
                                        <input type="radio" name="pcbLayers" value="8" class="peer sr-only" onchange="calculatePCBPrice()">
                                        <div class="border-2 border-gray-300 rounded-lg p-3 text-center peer-checked:border-primary peer-checked:bg-indigo-50">
                                            <h4 class="font-semibold">8</h4>
                                        </div>
                                    </label>
                                    <label class="relative cursor-pointer">
                                        <input type="radio" name="pcbLayers" value="10" class="peer sr-only" onchange="calculatePCBPrice()">
                                        <div class="border-2 border-gray-300 rounded-lg p-3 text-center peer-checked:border-primary peer-checked:bg-indigo-50">
                                            <h4 class="font-semibold">10</h4>
                                        </div>
                                    </label>
                                    <label class="relative cursor-pointer">
                                        <input type="radio" name="pcbLayers" value="12" class="peer sr-only" onchange="calculatePCBPrice()">
                                        <div class="border-2 border-gray-300 rounded-lg p-3 text-center peer-checked:border-primary peer-checked:bg-indigo-50">
                                            <h4 class="font-semibold">12</h4>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <!-- Board Dimensions -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-ruler-combined mr-2 text-primary"></i>Board Dimensions (mm)
                                </label>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <input type="number" id="pcbLength" placeholder="Length" value="100" onchange="calculatePCBPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                        <p class="text-xs text-gray-500 mt-1">Length (mm)</p>
                                    </div>
                                    <div>
                                        <input type="number" id="pcbWidth" placeholder="Width" value="80" onchange="calculatePCBPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                        <p class="text-xs text-gray-500 mt-1">Width (mm)</p>
                                    </div>
                                </div>
                                <div class="mt-2 text-sm text-gray-500">
                                    <p>Board Size: <span id="pcbBoardSize" class="font-semibold">100mm × 80mm</span></p>
                                    <p>Board Area: <span id="pcbArea" class="font-semibold">0 cm²</span></p>
                                </div>
                            </div>

                            <!-- PCB Specifications -->
                            <div class="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        <i class="fas fa-compress mr-2 text-primary"></i>Board Thickness
                                    </label>
                                    <select id="pcbThickness" onchange="calculatePCBPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                        <option value="0.8">0.8mm</option>
                                        <option value="1.0">1.0mm</option>
                                        <option value="1.6" selected>1.6mm (Standard)</option>
                                        <option value="2.0">2.0mm</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        <i class="fas fa-ethernet mr-2 text-primary"></i>Copper Weight
                                    </label>
                                    <select id="copperWeight" onchange="calculatePCBPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                        <option value="1oz" selected>1 oz (35µm)</option>
                                        <option value="2oz">2 oz (70µm)</option>
                                        <option value="3oz">3 oz (105µm)</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Surface Finish & Silkscreen -->
                            <div class="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        <i class="fas fa-layer-group mr-2 text-primary"></i>Surface Finish
                                    </label>
                                    <select id="surfaceFinish" onchange="calculatePCBPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                        <option value="hasl">HASL (Hot Air Solder Leveling)</option>
                                        <option value="lead_free_hasl" selected>Lead-Free HASL</option>
                                        <option value="enig">ENIG (Gold)</option>
                                        <option value="immersion_silver">Immersion Silver</option>
                                        <option value="immersion_tin">Immersion Tin</option>
                                        <option value="osp">OSP</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        <i class="fas fa-font mr-2 text-primary"></i>Silkscreen
                                    </label>
                                    <select id="silkscreen" onchange="calculatePCBPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                        <option value="none">No Silkscreen</option>
                                        <option value="one_side" selected>One Side</option>
                                        <option value="both_sides">Both Sides</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Quantity -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-sort-numeric-up mr-2 text-primary"></i>Quantity (boards)
                                </label>
                                <input type="number" id="pcbQuantity" value="10" min="1" onchange="calculatePCBPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                <div class="mt-2 text-sm text-gray-500">
                                    <p class="font-semibold">💡 Quantity Pricing Tiers:</p>
                                    <div class="grid grid-cols-2 gap-2 mt-1">
                                        <div>5-9: 10% off</div>
                                        <div>10-19: 15% off</div>
                                        <div>20-49: 20% off</div>
                                        <div>50-99: 25% off</div>
                                        <div>100-499: 30% off</div>
                                        <div>500-999: 35% off</div>
                                        <div>1000+: 40% off</div>
                                    </div>
                                </div>
                            </div>

                            <!-- PCB Assembly Option -->
                            <div class="border-2 border-gray-200 rounded-lg p-4">
                                <label class="flex items-center cursor-pointer">
                                    <input type="checkbox" id="assembly" onchange="calculatePCBPrice()" class="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary">
                                    <span class="ml-3 font-medium text-gray-900">
                                        <i class="fas fa-wrench text-primary mr-2"></i>Add PCB Assembly (SMT)
                                    </span>
                                </label>
                                <div id="componentCountDiv" class="mt-3">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Number of Components (per board)</label>
                                    <input type="number" id="componentCount" value="0" min="0" onchange="calculatePCBPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                    <p class="text-xs text-gray-500 mt-1">Assembly includes component placement, soldering, and testing</p>
                                </div>
                            </div>

                            <button type="button" onclick="calculatePCBPrice()" class="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                                <i class="fas fa-calculator mr-2"></i>Calculate Price
                            </button>
                        </form>
                    </div>
                </div>

                <!-- Price Summary -->
                <div class="lg:col-span-1">
                    <div class="bg-white rounded-xl shadow-lg p-8 sticky top-24">
                        <h3 class="text-xl font-bold mb-6">Price Breakdown</h3>
                        
                        <div id="pcbPriceBreakdown" class="space-y-4 mb-6">
                            <div class="flex justify-between text-gray-600">
                                <span>Per Board:</span>
                                <span id="pcbFabCost">₹0</span>
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>Setup Cost:</span>
                                <span id="pcbSetupCost">₹0</span>
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>Surface Finish:</span>
                                <span id="pcbFinishCost">₹0</span>
                            </div>
                            <hr>
                            <div class="flex justify-between text-gray-600">
                                <span>Quantity (×<span id="pcbQtyDisplay">1</span>):</span>
                                <span id="pcbFabTotal">₹0</span>
                            </div>
                            <div id="pcbTierSection" class="hidden bg-blue-50 rounded-lg p-3">
                                <div class="flex justify-between text-blue-700 font-semibold mb-1">
                                    <span id="pcbTierMessage">Prototype Tier</span>
                                    <span id="pcbTierDiscount">10%</span>
                                </div>
                                <div class="flex justify-between text-green-600">
                                    <span>Discount:</span>
                                    <span id="pcbDiscount">-₹0</span>
                                </div>
                            </div>
                            <hr>
                            <div class="flex justify-between font-semibold text-lg">
                                <span>Fabrication Total:</span>
                                <span id="pcbFabFinal">₹0</span>
                            </div>
                            <div id="pcbAssemblySection" class="hidden border-t-2 border-gray-200 pt-4">
                                <h4 class="font-semibold mb-2 text-purple-700">
                                    <i class="fas fa-wrench mr-2"></i>Assembly
                                </h4>
                                <div class="flex justify-between text-gray-600 mb-2">
                                    <span>Components (<span id="pcbComponentCount">0</span>):</span>
                                    <span id="pcbAssemblyCost">₹0</span>
                                </div>
                            </div>
                            <hr>
                            <div class="flex justify-between text-2xl font-bold text-primary">
                                <span>Total:</span>
                                <span id="pcbTotalPrice">₹0</span>
                            </div>
                        </div>

                        <div class="bg-indigo-50 rounded-lg p-4 mb-6">
                            <h4 class="font-semibold mb-2">
                                <i class="fas fa-info-circle text-primary mr-2"></i>Includes:
                            </h4>
                            <ul class="text-sm space-y-1 text-gray-700">
                                <li>✓ PCB Fabrication</li>
                                <li>✓ Electrical Testing</li>
                                <li>✓ Quality Inspection</li>
                                <li>✓ Standard Packaging</li>
                            </ul>
                        </div>

                        <a href="tel:+919137361474" class="block w-full bg-green-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-700 transition mb-3">
                            <i class="fas fa-phone mr-2"></i>Call to Order
                        </a>
                        <a href="mailto:info@passion3dworld.com" class="block w-full border-2 border-primary text-primary text-center py-3 rounded-lg font-semibold hover:bg-indigo-50 transition">
                            <i class="fas fa-envelope mr-2"></i>Email Quote
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <script src="/static/manufacturing-calculators.js"></script>
    </body>
    </html>
  `)
})

export default app
