const CART_KEY = "quickcart_cart";

function getCart() {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(product) {
    const cart = getCart();
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
        });
    }

    saveCart(cart);
    updateCartBadge();
    if (document.getElementById("cart-sidebar")?.classList.contains("open")) {
        renderCartSidebar();
    }
    return cart;
}

function removeFromCart(productId) {
    const cart = getCart().filter((item) => item.id !== productId);
    saveCart(cart);
    updateCartBadge();
    return cart;
}

function updateQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find((entry) => entry.id === productId);

    if (item) {
        if (quantity <= 0) {
            return removeFromCart(productId);
        }
        item.quantity = quantity;
        saveCart(cart);
        updateCartBadge();
    }

    return cart;
}

function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateCartBadge();
}

function getCartTotal() {
    return getCart().reduce((total, item) => total + item.price * item.quantity, 0);
}

function getCartCount() {
    return getCart().reduce((count, item) => count + item.quantity, 0);
}

function updateCartBadge() {
    const badge = document.getElementById("cart-count");
    if (badge) {
        const count = getCartCount();
        badge.textContent = count;
        badge.style.display = count > 0 ? "flex" : "none";
    }
}

function formatPrice(amount) {
    return "₹" + amount.toLocaleString("en-IN");
}

function renderCartSidebar() {
    const itemsContainer = document.getElementById("sidebar-cart-items");
    const totalEl = document.getElementById("sidebar-total");
    const emptyEl = document.getElementById("sidebar-empty");
    const footerEl = document.getElementById("sidebar-footer");

    if (!itemsContainer) return;

    const cart = getCart();

    if (cart.length === 0) {
        itemsContainer.innerHTML = "";
        if (emptyEl) emptyEl.style.display = "block";
        if (footerEl) footerEl.style.display = "none";
        return;
    }

    if (emptyEl) emptyEl.style.display = "none";
    if (footerEl) footerEl.style.display = "block";

    itemsContainer.innerHTML = cart
        .map(
            (item) => `
        <div class="sidebar-cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="sidebar-cart-item-info">
                <h4>${item.name}</h4>
                <p>${formatPrice(item.price)} × ${item.quantity}</p>
            </div>
            <button class="sidebar-remove" data-id="${item.id}" title="Remove">✕</button>
        </div>
    `
        )
        .join("");

    if (totalEl) {
        totalEl.textContent = formatPrice(getCartTotal());
    }

    itemsContainer.querySelectorAll(".sidebar-remove").forEach((button) => {
        button.addEventListener("click", () => {
            removeFromCart(parseInt(button.dataset.id, 10));
            renderCartSidebar();
        });
    });
}

function openCartSidebar() {
    const overlay = document.getElementById("cart-sidebar-overlay");
    const sidebar = document.getElementById("cart-sidebar");
    if (overlay && sidebar) {
        renderCartSidebar();
        overlay.classList.add("open");
        sidebar.classList.add("open");
        document.body.style.overflow = "hidden";
    }
}

function closeCartSidebar() {
    const overlay = document.getElementById("cart-sidebar-overlay");
    const sidebar = document.getElementById("cart-sidebar");
    if (overlay && sidebar) {
        overlay.classList.remove("open");
        sidebar.classList.remove("open");
        document.body.style.overflow = "";
    }
}

function initCartSidebar() {
    const toggleButtons = document.querySelectorAll(".cart-toggle");
    toggleButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            openCartSidebar();
        });
    });

    const closeBtn = document.getElementById("sidebar-close");
    const overlay = document.getElementById("cart-sidebar-overlay");

    if (closeBtn) {
        closeBtn.addEventListener("click", closeCartSidebar);
    }

    if (overlay) {
        overlay.addEventListener("click", closeCartSidebar);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    updateCartBadge();
    initCartSidebar();
});
