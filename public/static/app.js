// Price Calculator
function calculatePrice() {
    const tech = document.getElementById('tech').value;
    const material = document.getElementById('material').value;
    const length = parseFloat(document.getElementById('length').value);
    const width = parseFloat(document.getElementById('width').value);
    const height = parseFloat(document.getElementById('height').value);
    const quantity = parseInt(document.getElementById('quantity').value);
    const infill = parseInt(document.getElementById('infill').value);

    // Calculate volume in cubic cm
    const volume = (length * width * height) / 1000;

    // Base pricing per technology (per cubic cm)
    const techPrices = {
        fdm: 2.5,
        sla: 5,
        sls: 8
    };

    // Material multipliers
    const materialMultipliers = {
        pla: 1.0,
        abs: 1.2,
        petg: 1.3,
        tpu: 1.8,
        resin: 1.5
    };

    // Infill multiplier
    const infillMultiplier = 1 + (infill / 100) * 0.5;

    // Calculate base price
    let basePrice = volume * techPrices[tech] * materialMultipliers[material] * infillMultiplier;

    // Add minimum charge
    basePrice = Math.max(basePrice, 50);

    // Calculate total with quantity
    let totalPrice = basePrice * quantity;

    // Apply quantity discounts
    if (quantity >= 10) {
        totalPrice *= 0.85; // 15% discount
    } else if (quantity >= 5) {
        totalPrice *= 0.90; // 10% discount
    }

    // Display result
    const priceResult = document.getElementById('priceResult');
    const priceAmount = document.getElementById('priceAmount');
    
    priceAmount.textContent = `₹${Math.round(totalPrice)}`;
    priceResult.classList.remove('hidden');

    // Smooth scroll to result
    priceResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Quote Form Handler
document.getElementById('quoteForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    const messageDiv = document.getElementById('quoteMessage');
    
    // Disable button during submission
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
    
    try {
        const response = await axios.post('/api/quote', data);
        
        messageDiv.className = 'bg-green-50 border-2 border-green-500 rounded-lg p-4 text-green-700';
        messageDiv.innerHTML = `
            <i class="fas fa-check-circle mr-2"></i>
            ${response.data.message}
            <br><small>Quote ID: ${response.data.quoteId}</small>
        `;
        messageDiv.classList.remove('hidden');
        
        // Reset form
        e.target.reset();
        
    } catch (error) {
        messageDiv.className = 'bg-red-50 border-2 border-red-500 rounded-lg p-4 text-red-700';
        messageDiv.innerHTML = `
            <i class="fas fa-exclamation-circle mr-2"></i>
            ${error.response?.data?.message || 'An error occurred. Please try again.'}
        `;
        messageDiv.classList.remove('hidden');
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Submit Quote Request';
    }
});

// Contact Form Handler
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    const messageDiv = document.getElementById('contactMessage');
    
    // Disable button during submission
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
    
    try {
        const response = await axios.post('/api/contact', data);
        
        messageDiv.className = 'bg-green-50 border-2 border-green-500 rounded-lg p-4 text-green-700';
        messageDiv.innerHTML = `
            <i class="fas fa-check-circle mr-2"></i>
            ${response.data.message}
        `;
        messageDiv.classList.remove('hidden');
        
        // Reset form
        e.target.reset();
        
    } catch (error) {
        messageDiv.className = 'bg-red-50 border-2 border-red-500 rounded-lg p-4 text-red-700';
        messageDiv.innerHTML = `
            <i class="fas fa-exclamation-circle mr-2"></i>
            ${error.response?.data?.message || 'An error occurred. Please try again.'}
        `;
        messageDiv.classList.remove('hidden');
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Send Message';
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Update material options based on technology
document.getElementById('tech').addEventListener('change', function() {
    const materialSelect = document.getElementById('material');
    const tech = this.value;
    
    if (tech === 'fdm') {
        materialSelect.innerHTML = `
            <option value="pla">PLA</option>
            <option value="abs">ABS</option>
            <option value="petg">PETG</option>
            <option value="tpu">TPU</option>
        `;
    } else if (tech === 'sla') {
        materialSelect.innerHTML = `
            <option value="resin">Standard Resin</option>
            <option value="resin">Tough Resin</option>
            <option value="resin">Clear Resin</option>
        `;
    } else if (tech === 'sls') {
        materialSelect.innerHTML = `
            <option value="resin">Nylon PA12</option>
        `;
    }
});

// Mobile menu toggle (if needed)
console.log('Passion 3D World - 3D Printing Service Page Loaded');
