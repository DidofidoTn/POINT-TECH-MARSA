// ==================== Gestion du panier ====================
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];

// Charger les produits
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        products = await response.json();
        updateCartCount();
        
        if (window.location.pathname.includes('shop.html')) {
            displayProducts(products);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
    }
}

// Afficher les produits
function displayProducts(productsToDisplay) {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-price">${product.price.toFixed(2)} DT</div>
                <div class="product-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}">
                    ${product.stock > 0 ? `✓ En stock (${product.stock})` : '✗ Rupture de stock'}
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="addToCart(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
                        Ajouter au panier
                    </button>
                </div>
            </div>
        `;
        container.appendChild(productCard);
    });
}

// Ajouter au panier
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock === 0) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        } else {
            alert('Quantité maximale atteinte pour ce produit');
            return;
        }
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification('Produit ajouté au panier');
}

// Sauvegarder le panier
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Mettre à jour le compteur du panier
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const badges = document.querySelectorAll('#cart-count');
    badges.forEach(badge => badge.textContent = count);
}

// Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// ==================== Page Panier ====================
function displayCart() {
    const emptyCart = document.getElementById('empty-cart');
    const cartContent = document.getElementById('cart-content');
    const cartItemsBody = document.getElementById('cart-items-body');
    
    if (!emptyCart) return;
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartContent.style.display = 'none';
    } else {
        emptyCart.style.display = 'none';
        cartContent.style.display = 'grid';
        
        cartItemsBody.innerHTML = '';
        let subtotal = 0;
        
        cart.forEach(item => {
            const total = item.price * item.quantity;
            subtotal += total;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.price.toFixed(2)} DT</td>
                <td>
                    <input type="number" class="quantity-input" value="${item.quantity}" 
                        min="1" onchange="updateQuantity(${item.id}, this.value)">
                </td>
                <td>${total.toFixed(2)} DT</td>
                <td>
                    <button class="btn-remove" onclick="removeFromCart(${item.id})">Supprimer</button>
                </td>
            `;
            cartItemsBody.appendChild(row);
        });
        
        document.getElementById('subtotal').textContent = subtotal.toFixed(2) + ' DT';
        document.getElementById('total').textContent = subtotal.toFixed(2) + ' DT';
    }
}

// Mettre à jour la quantité
function updateQuantity(productId, newQuantity) {
    const quantity = parseInt(newQuantity);
    if (quantity < 1) return;
    
    const item = cart.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);
    
    if (item && product && quantity <= product.stock) {
        item.quantity = quantity;
        saveCart();
        updateCartCount();
        displayCart();
    } else if (quantity > product.stock) {
        alert(`Quantité maximale disponible: ${product.stock}`);
    }
}

// Supprimer du panier
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    displayCart();
    showNotification('Produit supprimé du panier');
}

// ==================== Page Boutique (Filtres) ====================
function setupShopFilters() {
    const searchBox = document.getElementById('search');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (!searchBox) return;
    
    searchBox.addEventListener('input', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    sortFilter.addEventListener('change', applyFilters);
}

function applyFilters() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const sort = document.getElementById('sortFilter').value;
    
    let filtered = products.filter(product => {
        const matchSearch = product.name.toLowerCase().includes(searchTerm) || 
                          product.description.toLowerCase().includes(searchTerm);
        const matchCategory = !category || product.category === category;
        return matchSearch && matchCategory;
    });
    
    // Trier
    if (sort === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
    }
    
    displayProducts(filtered);
}

// ==================== Page Paiement ====================
function displayCheckoutItems() {
    const orderItems = document.getElementById('order-items');
    if (!orderItems) return;
    
    orderItems.innerHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const total = item.price * item.quantity;
        subtotal += total;
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'order-item';
        itemDiv.innerHTML = `
            <span>${item.name} x${item.quantity}</span>
            <span>${total.toFixed(2)} DT</span>
        `;
        orderItems.appendChild(itemDiv);
    });
    
    document.getElementById('summary-subtotal').textContent = subtotal.toFixed(2) + ' DT';
    document.getElementById('summary-total').textContent = subtotal.toFixed(2) + ' DT';
}

function setupCheckoutForm() {
    const form = document.getElementById('checkout-form');
    if (!form) return;
    
    form.addEventListener('submit', handleCheckoutSubmit);
    displayCheckoutItems();
}

function handleCheckoutSubmit(e) {
    e.preventDefault();
    
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        postalCode: document.getElementById('postalCode').value,
        paymentMethod: 'cod',
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        date: new Date().toLocaleString('fr-TN')
    };
    
    // Sauvegarder la commande
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(formData);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Vider le panier
    cart = [];
    saveCart();
    updateCartCount();
    
    // Afficher la confirmation
    showOrderConfirmation(formData);
}

function showOrderConfirmation(orderData) {
    const confirmation = document.createElement('div');
    confirmation.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    `;
    
    const total = orderData.total.toFixed(2);
    
    confirmation.innerHTML = `
        <div style="
            background: white;
            padding: 2rem;
            border-radius: 0.5rem;
            max-width: 500px;
            text-align: center;
        ">
            <h2 style="color: #10b981; margin-bottom: 1rem;">✓ Commande Confirmée!</h2>
            <p style="margin: 1rem 0;">Numéro de commande: #${Date.now()}</p>
            <p style="margin: 1rem 0;">Montant total: <strong>${total} DT</strong></p>
            <p style="margin: 1rem 0; color: #6b7280;">
                Nous vous livrerons à l'adresse:<br>
                ${orderData.address}<br>
                ${orderData.city}, ${orderData.postalCode}
            </p>
            <p style="margin: 1rem 0; color: #6b7280; font-size: 0.9rem;">
                Paiement à la livraison (Contre Remboursement)
            </p>
            <button onclick="window.location.href='index.html'" 
                style="
                    background: #2563eb;
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border: none;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-size: 1rem;
                ">
                Retour à l'accueil
            </button>
        </div>
    `;
    
    document.body.appendChild(confirmation);
}

// ==================== Animation CSS ====================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
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

// ==================== Initialisation ====================
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    
    if (window.location.pathname.includes('shop.html')) {
        setupShopFilters();
    }
    
    if (window.location.pathname.includes('cart.html')) {
        displayCart();
    }
    
    if (window.location.pathname.includes('checkout.html')) {
        setupCheckoutForm();
    }
});