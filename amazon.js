// ======================
// LANGUAGE SYSTEM
// ======================
let currentLang = localStorage.getItem('malabisLang') || 'en';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('malabisLang', lang);
    
    // Update all text elements with data-en/data-hi
    document.querySelectorAll('[data-en]').forEach(el => {
        if (lang === 'hi' && el.hasAttribute('data-hi')) {
            el.textContent = el.getAttribute('data-hi');
        } else {
            el.textContent = el.getAttribute('data-en');
        }
    });

    // Update placeholders
    document.querySelectorAll('[data-hi-placeholder]').forEach(el => {
        if (lang === 'hi') {
            el.placeholder = el.getAttribute('data-hi-placeholder');
        } else {
            el.placeholder = el.getAttribute('placeholder');
        }
    });

    // Update buttons inside products & cart (dynamically)
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.textContent = lang === 'hi' ? 'कार्ट में जोड़ें' : 'Add to Cart';
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.textContent = lang === 'hi' ? 'हटाएं' : 'Remove';
    });

    // Update language toggle UI
    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.classList.remove('active');
        if (opt.getAttribute('data-lang') === lang) {
            opt.classList.add('active');
        }
    });

    // Optional: Set document direction for Hindi
    if (lang === 'hi') {
        document.documentElement.dir = 'rtl';
    } else {
        document.documentElement.dir = 'ltr';
    }
}

// ======================
// PRODUCT DATA (IN ₹)
// ======================
const products = [
    {
        id: 1,
        title: {
            en: "Echo Dot (5th Gen) | Smart speaker with Alexa",
            hi: "एको डॉट (5वीं जनरेशन) | एलेक्सा के साथ स्मार्ट स्पीकर"
        },
        price: 3999,
        image: "https://m.media-amazon.com/images/I/61EXU8BuGZL._AC_UY218_.jpg"
    },
    {
        id: 2,
        title: {
            en: "Fire TV Stick 4K | Alexa Voice Remote",
            hi: "फायर टीवी स्टिक 4K | एलेक्सा वॉइस रिमोट"
        },
        price: 3999,
        image: "https://m.media-amazon.com/images/I/51U8s+Lq7RL._AC_UY218_.jpg"
    },
    {
        id: 3,
        title: {
            en: "Apple AirPods Pro (2nd Gen) | Wireless Earbuds",
            hi: "ऐप्पल एयरपॉड्स प्रो (2nd जनरेशन) | वायरलेस इयरबड्स"
        },
        price: 19999,
        image: "https://m.media-amazon.com/images/I/61bK6PMOC3L._AC_UY218_.jpg"
    },
    {
        id: 4,
        title: {
            en: "Instant Pot Duo 7-in-1 | Electric Pressure Cooker",
            hi: "इंस्टेंट पॉट डुओ 7-इन-1 | इलेक्ट्रिक प्रेशर कुकर"
        },
        price: 11999,
        image: "https://m.media-amazon.com/images/I/71hGoJxpA9L._AC_UY218_.jpg"
    },
    {
        id: 5,
        title: {
            en: "Samsung 50-inch 4K Crystal UHD Smart TV",
            hi: "सैमसंग 50-इंच 4K क्रिस्टल UHD स्मार्ट टीवी"
        },
        price: 34999,
        image: "https://m.media-amazon.com/images/I/8194kStnoJL._AC_UY218_.jpg"
    },
    {
        id: 6,
        title: {
            en: "Sony WH-1000XM4 | Noise Cancelling Headphones",
            hi: "सोनी WH-1000XM4 | नॉइज कैंसलिंग हेडफोन"
        },
        price: 24999,
        image: "https://m.media-amazon.com/images/I/61bK6PMOC3L._AC_UY218_.jpg"
    },
    {
        id: 7,
        title: {
            en: "Ninja Air Fryer Max XL | 5.5L",
            hi: "निंजा एयर फ्रायर मैक्स XL | 5.5 लीटर"
        },
        price: 14999,
        image: "https://m.media-amazon.com/images/I/71SSh3fWQQL._AC_UY218_.jpg"
    },
    {
        id: 8,
        title: {
            en: "Morphy Richards 1.5L Electric Kettle",
            hi: "मॉर्फी रिचर्ड्स 1.5L इलेक्ट्रिक केटल"
        },
        price: 1299,
        image: "https://m.media-amazon.com/images/I/710Vt6+PnKL._AC_UY218_.jpg"
    }
];

// ======================
// CART SYSTEM
// ======================
let cart = [];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');
const darkModeToggle = document.getElementById('darkModeToggle');
const loginModal = document.getElementById('loginModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const showSignup = document.getElementById('showSignup');
const languageToggle = document.getElementById('languageToggle');
const searchButton = document.querySelector('.search-button');
const searchInput = document.querySelector('.search-input');

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', function() {
    // Set saved language
    setLanguage(currentLang);
    
    // Render products
    renderProducts();
    
    // Load cart from localStorage
    loadCart();
    
    // ===== Event Listeners =====
    
    // Cart Toggle
    cartIcon.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    cartSidebar.addEventListener('click', function(e) {
        if (e.target === cartSidebar) toggleCart();
    });
    
    // Dark Mode Toggle
    darkModeToggle.addEventListener('click', toggleDarkMode);
    
    // Check if dark mode was saved
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Login Modal
    document.querySelector('.signin').addEventListener('click', () => {
        loginModal.style.display = 'flex';
    });
    
    closeLoginModal.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });
    
    // Login Form (dummy)
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const msg = currentLang === 'hi' ? '✅ आप सफलतापूर्वक लॉगिन हो गए हैं!' : '✅ You have successfully logged in!';
        alert(msg);
        loginModal.style.display = 'none';
    });
    
    // Signup Button
    showSignup.addEventListener('click', function() {
        const msg = currentLang === 'hi' ? '🚀 साइनअप पेज जल्द आ रहा है!' : '🚀 Signup page coming soon!';
        alert(msg);
    });
    
    // Close modal on outside click
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) loginModal.style.display = 'none';
    });
    
    // Language Toggle
    languageToggle.addEventListener('click', function(e) {
        if (e.target.classList.contains('lang-option')) {
            const lang = e.target.getAttribute('data-lang');
            setLanguage(lang);
            renderProducts(); // Re-render to update product titles
        }
    });
    
    // Search Functionality (dummy)
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performSearch();
    });
});

// ======================
// RENDER PRODUCTS
// ======================
function renderProducts() {
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        const title = currentLang === 'hi' ? product.title.hi : product.title.en;
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${title}" class="product-image">
            <h3 class="product-title">${title}</h3>
            <div class="product-price">₹${product.price.toLocaleString('en-IN')}</div>
            <button class="add-to-cart" data-id="${product.id}">
                ${currentLang === 'hi' ? 'कार्ट में जोड़ें' : 'Add to Cart'}
            </button>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    // Add event listeners to Add to Cart buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', addToCart);
    });
}

// ======================
// CART FUNCTIONS
// ======================

function addToCart(e) {
    const button = e.target;
    const id = parseInt(button.getAttribute('data-id'));
    const product = products.find(p => p.id === id);
    
    if (!product) return;
    
    const existing = cart.find(item => item.id === id);
    
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            id: product.id,
            title: currentLang === 'hi' ? product.title.hi : product.title.en,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCart();
    
    // Visual Feedback
    const originalText = button.textContent;
    button.textContent = currentLang === 'hi' ? 'जोड़ा गया!' : 'Added!';
    button.style.backgroundColor = '#4caf50';
    button.style.transform = 'scale(1.05)';
    
    setTimeout(() => {
        button.textContent = currentLang === 'hi' ? 'कार्ट में जोड़ें' : 'Add to Cart';
        button.style.backgroundColor = '#f0c14b';
        button.style.transform = 'scale(1)';
    }, 1000);
}

function toggleCart() {
    cartSidebar.classList.toggle('open');
}

function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Clear and re-render cart items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        const emptyMsg = currentLang === 'hi' ? 'आपकी कार्ट खाली है' : 'Your cart is empty';
        cartItems.innerHTML = `<p style="text-align:center; padding:40px; color:#888;">${emptyMsg}</p>`;
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            const removeText = currentLang === 'hi' ? 'हटाएं' : 'Remove';
            
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    </div>
                    <div class="remove-item" data-id="${item.id}">${removeText}</div>
                </div>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
        // Add event listeners
        document.querySelectorAll('.decrease').forEach(btn => {
            btn.addEventListener('click', decreaseQuantity);
        });
        
        document.querySelectorAll('.increase').forEach(btn => {
            btn.addEventListener('click', increaseQuantity);
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', removeItem);
        });
    }
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `₹${total.toLocaleString('en-IN')}`;
    
    // Save to localStorage
    saveCart();
}

function decreaseQuantity(e) {
    const id = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity--;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
        updateCart();
    }
}

function increaseQuantity(e) {
    const id = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity++;
        updateCart();
    }
}

function removeItem(e) {
    const id = parseInt(e.target.getAttribute('data-id'));
    cart = cart.filter(i => i.id !== id);
    updateCart();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCart();
    }
}

// ======================
// DARK MODE
// ======================
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('darkMode', 'enabled');
    } else {
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('darkMode', 'disabled');
    }
}

// ======================
// SEARCH FUNCTION (DUMMY)
// ======================
function performSearch() {
    const query = searchInput.value.trim();
    if (!query) {
        alert(currentLang === 'hi' ? '❌ कृपया कोई कीवर्ड दर्ज करें!' : '❌ Please enter a search keyword!');
        return;
    }
    
    const msg = currentLang === 'hi' 
        ? `🔍 "${query}" के लिए खोज परिणाम जल्द आ रहे हैं...` 
        : `🔍 Searching for "${query}"... Results coming soon!`;
    
    alert(msg);
    searchInput.value = '';
}

// ======================
// OPTIONAL: KEYBOARD SHORTCUTS
// ======================
document.addEventListener('keydown', function(e) {
    // ESC to close cart or modal
    if (e.key === 'Escape') {
        if (cartSidebar.classList.contains('open')) {
            toggleCart();
        }
        if (loginModal.style.display === 'flex') {
            loginModal.style.display = 'none';
        }
    }
    
    // Ctrl+K or Cmd+K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
});