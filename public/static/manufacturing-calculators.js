// ====================================
// CNC MACHINING CALCULATOR
// ====================================

function calculateCNCPrice() {
    // Get form values
    const material = document.getElementById('cncMaterial').value;
    const length = parseFloat(document.getElementById('cncLength').value) || 0;
    const width = parseFloat(document.getElementById('cncWidth').value) || 0;
    const height = parseFloat(document.getElementById('cncHeight').value) || 0;
    const complexity = document.getElementById('cncComplexity').value;
    const quantity = parseInt(document.getElementById('cncQuantity').value) || 1;
    const finish = document.getElementById('cncFinish').value;

    // Calculate surface area (in cm²)
    const surfaceArea = 2 * ((length * width) + (width * height) + (height * length));

    // Material base prices per cm² of surface area
    const materialPrices = {
        aluminum: 3.5,
        steel: 5.0,
        stainless: 7.5,
        brass: 6.0,
        copper: 6.5,
        plastic_abs: 2.0,
        plastic_pom: 2.5,
        titanium: 15.0
    };

    // Complexity multipliers (affects machine time)
    const complexityMultipliers = {
        simple: 1.0,      // Basic shapes, minimal features
        medium: 1.5,      // Multiple features, some intricate work
        complex: 2.2,     // Complex geometries, tight tolerances
        very_complex: 3.0 // 5-axis work, very tight tolerances
    };

    // Surface finish costs (additional per part)
    const finishCosts = {
        as_machined: 0,
        deburred: 50,
        bead_blasted: 100,
        anodized: 200,
        powder_coated: 250,
        polished: 300
    };

    // Calculate base machining cost
    const materialCost = surfaceArea * materialPrices[material];
    const complexityFactor = complexityMultipliers[complexity];
    
    // Machine time estimation (in hours) based on volume and complexity
    const volume = (length * width * height) / 1000; // in cubic cm
    const machineTime = (volume * 0.5 + surfaceArea * 0.1) * complexityFactor;
    
    // Machine hour rate (₹/hour)
    const machineHourRate = 500;
    const machiningCost = machineTime * machineHourRate;
    
    // Setup cost (fixed per part type)
    const setupCost = 200;
    
    // Total base price per part
    let pricePerPart = materialCost + machiningCost + setupCost + finishCosts[finish];
    
    // Minimum price threshold
    pricePerPart = Math.max(pricePerPart, 300);

    // Calculate quantity total
    let quantityTotal = pricePerPart * quantity;

    // Apply quantity discounts
    let discount = 0;
    let discountPercent = 0;
    if (quantity >= 50) {
        discountPercent = 20;
        discount = quantityTotal * 0.20;
        quantityTotal *= 0.80;
    } else if (quantity >= 20) {
        discountPercent = 15;
        discount = quantityTotal * 0.15;
        quantityTotal *= 0.85;
    } else if (quantity >= 10) {
        discountPercent = 10;
        discount = quantityTotal * 0.10;
        quantityTotal *= 0.90;
    }

    // Update UI elements
    document.getElementById('cncSurfaceArea').textContent = surfaceArea.toFixed(2) + ' cm²';
    document.getElementById('cncMachineTime').textContent = machineTime.toFixed(2) + ' hrs';
    document.getElementById('cncMaterialCost').textContent = `₹${Math.round(materialCost)}`;
    document.getElementById('cncMachiningCost').textContent = `₹${Math.round(machiningCost)}`;
    document.getElementById('cncSetupCost').textContent = `₹${setupCost}`;
    document.getElementById('cncFinishCost').textContent = `₹${finishCosts[finish]}`;
    document.getElementById('cncPricePerPart').textContent = `₹${Math.round(pricePerPart)}`;
    document.getElementById('cncQtyDisplay').textContent = quantity;
    document.getElementById('cncQuantityCost').textContent = `₹${Math.round(pricePerPart * quantity)}`;
    
    if (discount > 0) {
        document.getElementById('cncDiscountSection').classList.remove('hidden');
        document.getElementById('cncDiscountPercent').textContent = discountPercent + '%';
        document.getElementById('cncDiscount').textContent = `-₹${Math.round(discount)}`;
    } else {
        document.getElementById('cncDiscountSection').classList.add('hidden');
    }
    
    document.getElementById('cncTotalPrice').textContent = `₹${Math.round(quantityTotal)}`;
}

// ====================================
// SHEET METAL CALCULATOR
// ====================================

function calculateSheetMetalPrice() {
    // Get form values
    const material = document.getElementById('sheetMaterial').value;
    const thickness = parseFloat(document.getElementById('sheetThickness').value);
    const length = parseFloat(document.getElementById('sheetLength').value) || 0;
    const width = parseFloat(document.getElementById('sheetWidth').value) || 0;
    const bendCount = parseInt(document.getElementById('bendCount').value) || 0;
    const bendComplexity = document.getElementById('bendComplexity').value;
    const welding = document.getElementById('welding').value;
    const quantity = parseInt(document.getElementById('sheetQuantity').value) || 1;
    const finish = document.getElementById('sheetFinish').value;

    // Calculate sheet area (in cm²)
    const sheetArea = length * width;

    // Material base prices per cm² by thickness
    const materialPrices = {
        mild_steel: 0.8,
        stainless: 1.5,
        aluminum: 1.2,
        galvanized: 1.0,
        copper: 2.0
    };

    // Thickness multipliers
    const thicknessMultiplier = 1 + (thickness / 10);

    // Cutting cost (laser/plasma)
    const cuttingPerimeter = 2 * (length + width);
    const cuttingCost = cuttingPerimeter * 0.5;

    // Bending costs
    const bendComplexityPrices = {
        simple: 30,    // Simple 90° bends
        medium: 50,    // Multiple angles
        complex: 80    // Complex forms, tight tolerances
    };
    const bendingCost = bendCount * bendComplexityPrices[bendComplexity];

    // Welding costs
    const weldingCosts = {
        none: 0,
        spot: 100,          // Spot welding
        seam_short: 200,    // <50cm seam
        seam_long: 400,     // >50cm seam
        full_assembly: 600  // Full welded assembly
    };

    // Surface finish costs
    const finishCosts = {
        as_cut: 0,
        deburred: 50,
        powder_coated: 150,
        painted: 200,
        polished: 250,
        zinc_plated: 180
    };

    // Calculate total costs
    const materialCost = sheetArea * materialPrices[material] * thicknessMultiplier;
    const weldingCost = weldingCosts[welding];
    const finishCost = finishCosts[finish];

    // Total base price per part
    let pricePerPart = materialCost + cuttingCost + bendingCost + weldingCost + finishCost;
    
    // Minimum price threshold
    pricePerPart = Math.max(pricePerPart, 250);

    // Calculate quantity total
    let quantityTotal = pricePerPart * quantity;

    // Apply quantity discounts
    let discount = 0;
    let discountPercent = 0;
    if (quantity >= 100) {
        discountPercent = 25;
        discount = quantityTotal * 0.25;
        quantityTotal *= 0.75;
    } else if (quantity >= 50) {
        discountPercent = 20;
        discount = quantityTotal * 0.20;
        quantityTotal *= 0.80;
    } else if (quantity >= 20) {
        discountPercent = 15;
        discount = quantityTotal * 0.15;
        quantityTotal *= 0.85;
    } else if (quantity >= 10) {
        discountPercent = 10;
        discount = quantityTotal * 0.10;
        quantityTotal *= 0.90;
    }

    // Update UI elements
    document.getElementById('sheetArea').textContent = sheetArea.toFixed(2) + ' cm²';
    document.getElementById('sheetPerimeter').textContent = cuttingPerimeter.toFixed(2) + ' cm';
    document.getElementById('sheetMaterialCost').textContent = `₹${Math.round(materialCost)}`;
    document.getElementById('sheetCuttingCost').textContent = `₹${Math.round(cuttingCost)}`;
    document.getElementById('sheetBendingCost').textContent = `₹${Math.round(bendingCost)}`;
    document.getElementById('sheetWeldingCost').textContent = `₹${weldingCost}`;
    document.getElementById('sheetFinishCost').textContent = `₹${finishCost}`;
    document.getElementById('sheetPricePerPart').textContent = `₹${Math.round(pricePerPart)}`;
    document.getElementById('sheetQtyDisplay').textContent = quantity;
    document.getElementById('sheetQuantityCost').textContent = `₹${Math.round(pricePerPart * quantity)}`;
    
    if (discount > 0) {
        document.getElementById('sheetDiscountSection').classList.remove('hidden');
        document.getElementById('sheetDiscountPercent').textContent = discountPercent + '%';
        document.getElementById('sheetDiscount').textContent = `-₹${Math.round(discount)}`;
    } else {
        document.getElementById('sheetDiscountSection').classList.add('hidden');
    }
    
    document.getElementById('sheetTotalPrice').textContent = `₹${Math.round(quantityTotal)}`;
}

// ====================================
// PCB MANUFACTURING CALCULATOR
// ====================================

function calculatePCBPrice() {
    // Get form values
    const layers = parseInt(document.getElementById('pcbLayers').value);
    const length = parseFloat(document.getElementById('pcbLength').value) || 0;
    const width = parseFloat(document.getElementById('pcbWidth').value) || 0;
    const quantity = parseInt(document.getElementById('pcbQuantity').value) || 1;
    const thickness = parseFloat(document.getElementById('pcbThickness').value);
    const copperWeight = document.getElementById('copperWeight').value;
    const surfaceFinish = document.getElementById('surfaceFinish').value;
    const silkscreen = document.getElementById('silkscreen').value;
    const assembly = document.getElementById('assembly').checked;
    const componentCount = parseInt(document.getElementById('componentCount').value) || 0;

    // Calculate board area (in cm²)
    const boardArea = (length / 10) * (width / 10); // Convert mm to cm

    // Base price per layer per cm²
    const layerPrices = {
        1: 2.0,
        2: 3.0,
        4: 5.0,
        6: 8.0,
        8: 12.0,
        10: 16.0,
        12: 20.0
    };

    // Copper weight multipliers
    const copperMultipliers = {
        '1oz': 1.0,
        '2oz': 1.3,
        '3oz': 1.6
    };

    // Surface finish costs (additional per board)
    const finishCosts = {
        hasl: 0,
        lead_free_hasl: 20,
        enig: 50,
        immersion_silver: 40,
        immersion_tin: 35,
        osp: 15
    };

    // Silkscreen costs
    const silkscreenCosts = {
        none: 0,
        one_side: 10,
        both_sides: 20
    };

    // Calculate fabrication cost
    const fabricationCost = boardArea * layerPrices[layers] * copperMultipliers[copperWeight];
    
    // PCB setup cost (engineering, stencil, etc.)
    const setupCost = 100 + (layers * 20);
    
    // Per board costs
    let pricePerBoard = fabricationCost + finishCosts[surfaceFinish] + silkscreenCosts[silkscreen];
    
    // Add setup cost distributed across quantity
    pricePerBoard += setupCost / quantity;
    
    // Minimum price per board
    pricePerBoard = Math.max(pricePerBoard, 50);

    // Assembly costs (if selected)
    let assemblyCost = 0;
    let assemblyPerBoard = 0;
    if (assembly && componentCount > 0) {
        // Base assembly setup
        const assemblySetup = 500;
        // Cost per component placement
        const componentPlacementCost = componentCount * 2;
        assemblyCost = assemblySetup + (componentPlacementCost * quantity);
        assemblyPerBoard = assemblyCost / quantity;
    }

    // Calculate quantity total
    let fabricationTotal = pricePerBoard * quantity;
    
    // Apply quantity-based pricing tiers
    let discount = 0;
    let discountPercent = 0;
    let tierMessage = '';
    
    if (quantity >= 1000) {
        discountPercent = 40;
        tierMessage = 'Mass Production Tier';
    } else if (quantity >= 500) {
        discountPercent = 35;
        tierMessage = 'High Volume Tier';
    } else if (quantity >= 100) {
        discountPercent = 30;
        tierMessage = 'Production Tier';
    } else if (quantity >= 50) {
        discountPercent = 25;
        tierMessage = 'Medium Volume Tier';
    } else if (quantity >= 20) {
        discountPercent = 20;
        tierMessage = 'Small Batch Tier';
    } else if (quantity >= 10) {
        discountPercent = 15;
        tierMessage = 'Prototype Plus Tier';
    } else if (quantity >= 5) {
        discountPercent = 10;
        tierMessage = 'Prototype Tier';
    }
    
    if (discountPercent > 0) {
        discount = fabricationTotal * (discountPercent / 100);
        fabricationTotal *= (1 - discountPercent / 100);
    }

    // Total with assembly
    const grandTotal = fabricationTotal + assemblyCost;

    // Update UI elements
    document.getElementById('pcbArea').textContent = boardArea.toFixed(2) + ' cm²';
    document.getElementById('pcbBoardSize').textContent = `${length}mm × ${width}mm`;
    document.getElementById('pcbFabCost').textContent = `₹${Math.round(pricePerBoard)}`;
    document.getElementById('pcbSetupCost').textContent = `₹${Math.round(setupCost)}`;
    document.getElementById('pcbFinishCost').textContent = `₹${finishCosts[surfaceFinish]}`;
    document.getElementById('pcbQtyDisplay').textContent = quantity;
    document.getElementById('pcbFabTotal').textContent = `₹${Math.round(pricePerBoard * quantity)}`;
    
    // Tier pricing display
    if (tierMessage) {
        document.getElementById('pcbTierSection').classList.remove('hidden');
        document.getElementById('pcbTierMessage').textContent = tierMessage;
        document.getElementById('pcbTierDiscount').textContent = discountPercent + '%';
        document.getElementById('pcbDiscount').textContent = `-₹${Math.round(discount)}`;
    } else {
        document.getElementById('pcbTierSection').classList.add('hidden');
    }
    
    document.getElementById('pcbFabFinal').textContent = `₹${Math.round(fabricationTotal)}`;
    
    // Assembly section
    if (assembly && componentCount > 0) {
        document.getElementById('pcbAssemblySection').classList.remove('hidden');
        document.getElementById('pcbComponentCount').textContent = componentCount;
        document.getElementById('pcbAssemblyCost').textContent = `₹${Math.round(assemblyCost)}`;
    } else {
        document.getElementById('pcbAssemblySection').classList.add('hidden');
    }
    
    document.getElementById('pcbTotalPrice').textContent = `₹${Math.round(grandTotal)}`;
}

// Initialize calculators on page load
document.addEventListener('DOMContentLoaded', () => {
    // CNC Calculator
    if (typeof calculateCNCPrice === 'function' && document.getElementById('cncMaterial')) {
        calculateCNCPrice();
    }
    
    // Sheet Metal Calculator
    if (typeof calculateSheetMetalPrice === 'function' && document.getElementById('sheetMaterial')) {
        calculateSheetMetalPrice();
    }
    
    // PCB Calculator
    if (typeof calculatePCBPrice === 'function' && document.getElementById('pcbLayers')) {
        calculatePCBPrice();
    }
});

console.log('Manufacturing calculators loaded successfully');
