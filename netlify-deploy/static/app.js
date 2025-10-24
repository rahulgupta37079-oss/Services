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

// Global variable to store uploaded file info
let uploadedFile = null;

// File Upload Handler
function setupFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const fileButton = document.getElementById('fileButton');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const removeFile = document.getElementById('removeFile');
    
    if (!fileInput) return;
    
    // Trigger file input when button is clicked
    fileButton?.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Handle file selection
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validate file
        const validExtensions = ['.stl', '.obj', '.step', '.stp', '.3mf', '.ply'];
        const fileExt = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!validExtensions.includes(fileExt)) {
            alert('Invalid file type. Please upload STL, OBJ, STEP, or 3MF files');
            fileInput.value = '';
            return;
        }
        
        if (file.size > 10 * 1024 * 1024) {
            alert('File size exceeds 10MB limit');
            fileInput.value = '';
            return;
        }
        
        // Show file info
        fileName.textContent = file.name;
        fileSize.textContent = (file.size / 1024 / 1024).toFixed(2) + ' MB';
        fileInfo.classList.remove('hidden');
        
        // Store file info
        uploadedFile = {
            name: file.name,
            size: file.size,
            type: file.type
        };
        
        console.log('File selected:', uploadedFile);
    });
    
    // Handle file removal
    removeFile?.addEventListener('click', () => {
        fileInput.value = '';
        fileInfo.classList.add('hidden');
        uploadedFile = null;
    });
}

// Quote Form Handler with File Upload
document.getElementById('quoteForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Add file info if uploaded
    if (uploadedFile) {
        data.fileName = uploadedFile.name;
        data.fileSize = uploadedFile.size;
        data.fileType = uploadedFile.type;
    }
    
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
        
        // Reset form and file
        e.target.reset();
        const fileInput = document.getElementById('fileInput');
        const fileInfo = document.getElementById('fileInfo');
        if (fileInput) fileInput.value = '';
        if (fileInfo) fileInfo.classList.add('hidden');
        uploadedFile = null;
        
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

// Initialize file upload when page loads
document.addEventListener('DOMContentLoaded', () => {
    setupFileUpload();
});

// Services Dropdown Handler - Make it clickable for mobile/touch devices
function setupServicesDropdown() {
    const dropdownButton = document.querySelector('.relative.group button');
    const dropdownMenu = document.querySelector('.relative.group .absolute');
    
    if (!dropdownButton || !dropdownMenu) return;
    
    let isOpen = false;
    
    // Toggle dropdown on click
    dropdownButton.addEventListener('click', (e) => {
        e.stopPropagation();
        isOpen = !isOpen;
        
        if (isOpen) {
            dropdownMenu.classList.remove('hidden');
            dropdownMenu.classList.add('block');
        } else {
            dropdownMenu.classList.add('hidden');
            dropdownMenu.classList.remove('block');
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdownButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
            isOpen = false;
            dropdownMenu.classList.add('hidden');
            dropdownMenu.classList.remove('block');
        }
    });
    
    // Close dropdown when clicking a link inside
    const dropdownLinks = dropdownMenu.querySelectorAll('a');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', () => {
            isOpen = false;
            dropdownMenu.classList.add('hidden');
            dropdownMenu.classList.remove('block');
        });
    });
}

// Initialize dropdown on page load
document.addEventListener('DOMContentLoaded', () => {
    setupServicesDropdown();
});

// Mobile menu toggle (if needed)
console.log('Passion 3D World - 3D Printing Service Page Loaded');
