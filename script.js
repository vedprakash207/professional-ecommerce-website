// Sample Products Data
const products = [
    {
        id: 1,
        name: 'Premium Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 199.99,
        icon: '🎧'
    },
    {
        id: 2,
        name: 'Smart Watch',
        description: 'Advanced fitness tracking and health monitoring',
        price: 299.99,
        icon: '⌚'
    },
    {
        id: 3,
        name: 'Laptop Stand',
        description: 'Ergonomic aluminum stand for better posture',
        price: 79.99,
        icon: '🖥️'
    },
    {
        id: 4,
        name: 'Mechanical Keyboard',
        description: 'Professional mechanical keyboard for typing',
        price: 149.99,
        icon: '⌨️'
    },
    {
        id: 5,
        name: '4K Webcam',
        description: 'Crystal clear 4K resolution for streaming',
        price: 129.99,
        icon: '📹'
    },
    {
        id: 6,
        name: 'USB-C Hub',
        description: 'Multi-port connectivity hub for laptops',
        price: 59.99,
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

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const servicesGrid = document.getElementById('servicesGrid');
const cartIcon = document.querySelector('.cart-icon');
const cartModal = document.getElementById('cartModal');
const closeCartBtn = document.getElementById('closeCart');
const contactForm = document.getElementById('contactForm');
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Initialize
function init() {
    renderProducts();
    renderServices();
    setupEventListeners();
}

// Render Products
function renderProducts() {
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">${product.icon}</div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
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
                    <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
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
    document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
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
            showNotification('Proceeding to checkout...');
            cart = [];
            updateCartCount();
            cartModal.classList.remove('active');
            renderCart();
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