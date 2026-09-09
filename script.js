// Load Products from localStorage (from admin panel)
let products = JSON.parse(localStorage.getItem('premiumhub_products')) || [
    {
        id: 1,
        name: 'Premium Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 19999,
        icon: '🎧'
    },
    {
        id: 2,
        name: 'Smart Watch',
        description: 'Advanced fitness tracking and health monitoring',
        price: 29999,
        icon: '⌚'
    },
    {
        id: 3,
        name: 'Laptop Stand',
        description: 'Ergonomic aluminum stand for better posture',
        price: 7999,
        icon: '🖥️'
    },
    {
        id: 4,
        name: 'Mechanical Keyboard',
        description: 'Professional mechanical keyboard for typing',
        price: 14999,
        icon: '⌨️'
    },
    {
        id: 5,
        name: '4K Webcam',
        description: 'Crystal clear 4K resolution for streaming',
        price: 12999,
        icon: '📹'
    },
    {
        id: 6,
        name: 'USB-C Hub',
        description: 'Multi-port connectivity hub for laptops',
        price: 5999,
        icon: '🔌'
    }
];

// Sample Services Data
const services = [
    {
        name: 'Consulting',
        description: 'Expert consulting services for business growth and optimization.',
        icon: '💼'
    },
    {
        name: 'Design',
        description: 'Professional design services for branding and marketing materials.',
        icon: '🎨'
    },
    {
        name: 'Development',
        description: 'Custom web and mobile application development solutions.',
        icon: '💻'
    },
    {
        name: 'Marketing',
        description: 'Comprehensive digital marketing and social media strategies.',
        icon: '📊'
    },
    {
        name: 'Support',
        description: '24/7 customer support and technical assistance services.',
        icon: '🎧'
    },
    {
        name: 'Training',
        description: 'Professional training programs for teams and individuals.',
        icon: '📚'
    }
];

// Shopping Cart
let cart = [];
let selectedPaymentMethod = '';

// IMPORTANT: Replace these with your actual Razorpay credentials from dashboard
// Get these from: https://dashboard.razorpay.com/
const RAZORPAY_KEY_ID = 'rzp_live_YOUR_KEY_ID'; // Replace with your Key ID
const MERCHANT_NAME = 'PremiumHub';
const MERCHANT_EMAIL = 'vedprakash05422@gmail.com';
const MERCHANT_PHONE = '8208072975';

// Payment method configurations
const PAYMENT_METHODS = {
    googlepay: {
        name: 'Google Pay',
        icon: 'fab fa-google',
        description: 'Pay with Google Pay'
    },
    phonepe: {
        name: 'PhonePe',
        icon: 'fas fa-mobile-alt',
        description: 'Pay with PhonePe'
    },
    paytm: {
        name: 'Paytm',
        icon: 'fas fa-wallet',
        description: 'Pay with Paytm'
    },
    upi: {
        name: 'UPI',
        icon: 'fas fa-qrcode',
        description: 'Pay via UPI'
    },
    card: {
        name: 'Credit Card',
        icon: 'fas fa-credit-card',
        description: 'Visa, Mastercard, Amex'
    },
    debit: {
        name: 'Debit Card',
        icon: 'fas fa-credit-card',
        description: 'All Banks'
    },
    netbanking: {
        name: 'Net Banking',
        icon: 'fas fa-university',
        description: 'All Banks'
    },
    wallet: {
        name: 'Wallet',
        icon: 'fas fa-wallet',
        description: 'Digital Wallets'
    }
};

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const servicesGrid = document.getElementById('servicesGrid');
const cartIcon = document.querySelector('.cart-icon');
const cartModal = document.getElementById('cartModal');
const closeCartBtn = document.getElementById('closeCart');
const paymentModal = document.getElementById('paymentModal');
const closePaymentBtn = document.getElementById('closePayment');
const contactForm = document.getElementById('contactForm');
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const payNowBtn = document.getElementById('payNowBtn');

// Initialize
function init() {
    renderProducts();
    renderServices();
    setupEventListeners();
}

// Render Products
function renderProducts() {
    if (products.length === 0) {
        productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #9ca3af;">No products available yet. <a href="admin.html" style="color: #6366f1; font-weight: bold;">Add products here</a></p>';
        return;
    }
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">${product.icon}</div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">₹${(product.price / 100).toFixed(2)}</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Render Services
function renderServices() {
    servicesGrid.innerHTML = services.map(service => `
        <div class="service-card">
            <div class="service-icon">${service.icon}</div>
            <h3 class="service-name">${service.name}</h3>
            <p class="service-description">${service.description}</p>
        </div>
    `).join('');
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCartCount();
        showNotification('Added to cart!');
    }
}

// Update Cart Count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

// Render Cart
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${(item.price / 100).toFixed(2)} x ${item.quantity}</div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})">Remove</button>
            </div>
        `).join('');
    }
    updateCartTotal();
}

// Remove from Cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    renderCart();
}

// Update Cart Total
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cartTotal').textContent = `₹${(total / 100).toFixed(2)}`;
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 300;
        animation: slideInRight 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Open Payment Modal
function openPaymentModal() {
    paymentModal.classList.add('active');
    renderOrderSummary();
    selectedPaymentMethod = '';
    document.getElementById('selectedPaymentMethod').value = '';
    // Remove active class from all payment method buttons
    document.querySelectorAll('.payment-method-btn').forEach(btn => {
        btn.classList.remove('active');
    });
}

// Close Payment Modal
function closePaymentModal() {
    paymentModal.classList.remove('active');
}

// Render Order Summary
function renderOrderSummary() {
    const summaryItems = document.getElementById('summaryItems');
    const summaryTotal = document.getElementById('summaryTotal');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    summaryItems.innerHTML = cart.map(item => `
        <div class="summary-item">
            <span>${item.name} x ${item.quantity}</span>
            <span>₹${(item.price * item.quantity / 100).toFixed(2)}</span>
        </div>
    `).join('');
    
    summaryTotal.textContent = `₹${(total / 100).toFixed(2)}`;
}

// Handle Payment Method Selection
function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    document.getElementById('selectedPaymentMethod').value = method;
    
    // Update active button
    document.querySelectorAll('.payment-method-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.payment-method-btn').classList.add('active');
}

// Process Payment
function processPayment() {
    const fullName = document.getElementById('fullName').value;
    const billingEmail = document.getElementById('billingEmail').value;
    const billingPhone = document.getElementById('billingPhone').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const zipCode = document.getElementById('zipCode').value;

    // Validate form
    if (!fullName || !billingEmail || !billingPhone || !address || !city || !zipCode) {
        showNotification('Please fill in all billing details');
        return;
    }

    // Validate phone
    if (!/^\d{10}$/.test(billingPhone.replace(/\D/g, ''))) {
        showNotification('Please enter a valid 10-digit phone number');
        return;
    }

    // Validate payment method selection
    if (!selectedPaymentMethod) {
        showNotification('Please select a payment method');
        return;
    }

    // Calculate total amount in paise
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Prepare customer data
    const customerData = {
        name: fullName,
        email: billingEmail,
        phone: billingPhone,
        address: address,
        city: city,
        zipCode: zipCode,
        amount: totalAmount,
        paymentMethod: selectedPaymentMethod
    };

    // Process based on payment method
    switch(selectedPaymentMethod) {
        case 'googlepay':
        case 'phonepe':
        case 'paytm':
        case 'upi':
        case 'card':
        case 'debit':
        case 'netbanking':
        case 'wallet':
            processRazorpayPayment(customerData);
            break;
        default:
            showNotification('Invalid payment method selected');
    }
}

// Process Razorpay Payment
function processRazorpayPayment(customerData) {
    const paymentMethodName = PAYMENT_METHODS[selectedPaymentMethod].name;
    
    // Create Razorpay order
    const options = {
        key: RAZORPAY_KEY_ID,
        amount: customerData.amount, // Amount in paise
        currency: 'INR',
        name: MERCHANT_NAME,
        description: `Order from ${customerData.name} via ${paymentMethodName}`,
        image: 'https://via.placeholder.com/200',
        
        prefill: {
            name: customerData.name,
            email: customerData.email,
            contact: customerData.phone
        },
        
        notes: {
            address: customerData.address,
            city: customerData.city,
            zipCode: customerData.zipCode,
            paymentMethod: paymentMethodName
        },
        
        method: {
            emandate: 'netbanking,card,upi,wallet'
        },
        
        theme: {
            color: '#6366f1'
        },
        
        handler: function(response) {
            handlePaymentSuccess(response, customerData);
        },
        
        modal: {
            ondismiss: function() {
                showNotification('Payment cancelled. Please try again.');
            }
        }
    };

    // Open Razorpay checkout
    const rzp1 = new Razorpay(options);
    
    rzp1.on('payment.failed', function(response) {
        handlePaymentError(response);
    });
    
    rzp1.open();
}

// Handle Payment Success
function handlePaymentSuccess(razorpayResponse, customerData) {
    console.log('Payment successful!', razorpayResponse);
    
    const paymentMethodName = PAYMENT_METHODS[selectedPaymentMethod].name;
    
    showNotification('Payment successful! Order confirmed.');
    
    // Reset cart and close modal
    setTimeout(() => {
        cart = [];
        updateCartCount();
        closePaymentModal();
        
        // Clear form
        document.getElementById('fullName').value = '';
        document.getElementById('billingEmail').value = '';
        document.getElementById('billingPhone').value = '';
        document.getElementById('address').value = '';
        document.getElementById('city').value = '';
        document.getElementById('zipCode').value = '';
        
        // Show detailed success message
        showSuccessMessage(razorpayResponse, customerData, paymentMethodName);
    }, 2000);
}

// Handle Payment Error
function handlePaymentError(response) {
    showNotification(`Payment failed: ${response.error.description}`);
    console.error('Payment error:', response);
}

// Show Success Message
function showSuccessMessage(response, data, paymentMethod) {
    const message = `Order Confirmed!

Payment ID: ${response.razorpay_payment_id}
Payment Method: ${paymentMethod}
Amount: ₹${(data.amount / 100).toFixed(2)}

Order Details:
Name: ${data.name}
Email: ${data.email}
Address: ${data.address}, ${data.city} - ${data.zipCode}

Confirmation email has been sent to ${data.email}

Thank you for shopping with PremiumHub!
    `;
    
    alert(message);
}

// Setup Event Listeners
function setupEventListeners() {
    // Cart Icon
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        cartModal.classList.add('active');
        renderCart();
    });

    // Close Cart
    closeCartBtn.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });

    // Click outside cart
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });

    // Close Payment Modal
    closePaymentBtn.addEventListener('click', () => {
        closePaymentModal();
    });

    // Click outside payment modal
    paymentModal.addEventListener('click', (e) => {
        if (e.target === paymentModal) {
            closePaymentModal();
        }
    });

    // Payment Method Buttons
    const paymentMethodBtns = document.querySelectorAll('.payment-method-btn');
    paymentMethodBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const method = btn.getAttribute('data-method');
            selectPaymentMethod(method);
        });
    });

    // Pay Now Button
    if (payNowBtn) {
        payNowBtn.addEventListener('click', (e) => {
            e.preventDefault();
            processPayment();
        });
    }

    // Contact Form
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Thank you for your message! We\'ll get back to you soon.');
        contactForm.reset();
    });

    // Hamburger Menu
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Checkout Button
    document.getElementById('checkoutBtn').addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
        } else {
            cartModal.classList.remove('active');
            openPaymentModal();
        }
    });

    // Active nav link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add keyframe animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Start the app
init();
