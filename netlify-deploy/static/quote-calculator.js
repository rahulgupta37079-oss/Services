// 3D Printing Price Calculator
function calculate3DPrice() {
    const technology = document.querySelector('input[name="technology"]:checked').value;
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
        resin: 1.5,
        tough: 1.7,
        nylon: 2.0
    };

    // Infill multiplier
    const infillMultiplier = 1 + (infill / 100) * 0.5;

    // Calculate base price
    let basePrice = volume * techPrices[technology] * materialMultipliers[material] * infillMultiplier;
    basePrice = Math.max(basePrice, 50);

    // Calculate material cost component
    const materialCost = basePrice * 0.3;

    // Calculate total with quantity
    let quantityTotal = basePrice * quantity;

    // Apply quantity discounts
    let discount = 0;
    if (quantity >= 10) {
        discount = quantityTotal * 0.15; // 15% discount
        quantityTotal *= 0.85;
    } else if (quantity >= 5) {
        discount = quantityTotal * 0.10; // 10% discount
        quantityTotal *= 0.90;
    }

    // Update UI
    document.getElementById('basePrice').textContent = `₹${Math.round(basePrice)}`;
    document.getElementById('materialCost').textContent = `₹${Math.round(materialCost)}`;
    document.getElementById('qtyDisplay').textContent = quantity;
    document.getElementById('quantityCost').textContent = `₹${Math.round(basePrice * quantity)}`;
    document.getElementById('discount').textContent = `-₹${Math.round(discount)}`;
    document.getElementById('totalPrice').textContent = `₹${Math.round(quantityTotal)}`;
}

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

// File upload handling for 3D printing page
document.addEventListener('DOMContentLoaded', () => {
    // Setup clickable dropdown
    setupServicesDropdown();
    
    const fileInput = document.getElementById('fileInput3d');
    const fileButton = document.getElementById('fileButton3d');
    const fileInfo = document.getElementById('fileInfo3d');
    const fileName = document.getElementById('fileName3d');
    const removeFile = document.getElementById('removeFile3d');

    if (fileButton) {
        fileButton.addEventListener('click', () => fileInput.click());
    }

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

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

            fileName.textContent = file.name + ' (' + (file.size / 1024 / 1024).toFixed(2) + ' MB)';
            fileInfo.classList.remove('hidden');
        });
    }

    if (removeFile) {
        removeFile.addEventListener('click', () => {
            fileInput.value = '';
            fileInfo.classList.add('hidden');
        });
    }

    // Auto-calculate on page load
    if (typeof calculate3DPrice === 'function') {
        calculate3DPrice();
    }
});

console.log('Quote calculator loaded');
