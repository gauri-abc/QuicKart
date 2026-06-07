const API_BASE = "";

async function fetchProducts() {
    const response = await fetch(`${API_BASE}/products`);
    if (!response.ok) {
        throw new Error("Failed to load products");
    }
    return response.json();
}

function createProductCard(product) {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
                <span class="product-price">${formatPrice(product.price)}</span>
                <button class="btn btn-primary add-to-cart" data-id="${product.id}">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
    return card;
}

function bindAddToCartButtons(products, container) {
    container.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", () => {
            const product = products.find((item) => item.id === parseInt(button.dataset.id, 10));
            if (product) {
                addToCart(product);
                showToast(`${product.name} added to cart`);
            }
        });
    });
}

function showToast(message) {
    const existing = document.querySelector(".toast");
    if (existing) {
        existing.remove();
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("show"));

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

async function loadProducts(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '<div class="loading">Loading products...</div>';

    try {
        const products = await fetchProducts();
        container.innerHTML = "";

        products.forEach((product) => {
            container.appendChild(createProductCard(product));
        });

        bindAddToCartButtons(products, container);
    } catch (error) {
        container.innerHTML = `
            <div class="error-message">
                <p>Unable to load products. Please try again later.</p>
                <button class="btn btn-primary" onclick="location.reload()">Retry</button>
            </div>
        `;
    }
}

function renderFeaturedProducts(containerId, limit) {
    fetchProducts()
        .then((products) => {
            const container = document.getElementById(containerId);
            if (!container) return;

            container.innerHTML = "";
            products.slice(0, limit).forEach((product) => {
                container.appendChild(createProductCard(product));
            });

            bindAddToCartButtons(products, container);
        })
        .catch(() => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = '<p class="error-text">Products unavailable.</p>';
            }
        });
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("products-grid")) {
        loadProducts("products-grid");
    }

    if (document.getElementById("featured-products")) {
        renderFeaturedProducts("featured-products", 3);
    }
});
