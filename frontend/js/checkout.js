const API_BASE = "";

function renderCartPage() {
    const cart = getCart();
    const emptyState = document.getElementById("cart-empty");
    const cartContent = document.getElementById("cart-content");
    const itemsContainer = document.getElementById("cart-items");
    const subtotalEl = document.getElementById("cart-subtotal");
    const totalEl = document.getElementById("cart-total");

    if (!itemsContainer) return;

    if (cart.length === 0) {
        if (emptyState) emptyState.style.display = "block";
        if (cartContent) cartContent.style.display = "none";
        return;
    }

    if (emptyState) emptyState.style.display = "none";
    if (cartContent) cartContent.style.display = "block";

    itemsContainer.innerHTML = cart
        .map(
            (item) => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="cart-item-price">${formatPrice(item.price)}</p>
                <div class="quantity-controls">
                    <button class="qty-btn decrease" data-id="${item.id}">−</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn increase" data-id="${item.id}">+</button>
                </div>
            </div>
            <div class="cart-item-actions">
                <p class="cart-item-total">${formatPrice(item.price * item.quantity)}</p>
                <button class="btn btn-outline remove-item" data-id="${item.id}">Remove</button>
            </div>
        </div>
    `
        )
        .join("");

    const subtotal = getCartTotal();
    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (totalEl) totalEl.textContent = formatPrice(subtotal);

    bindCartEvents();
}

function bindCartEvents() {
    document.querySelectorAll(".decrease").forEach((button) => {
        button.addEventListener("click", () => {
            const id = parseInt(button.dataset.id, 10);
            const item = getCart().find((entry) => entry.id === id);
            if (item) {
                updateQuantity(id, item.quantity - 1);
                renderCartPage();
            }
        });
    });

    document.querySelectorAll(".increase").forEach((button) => {
        button.addEventListener("click", () => {
            const id = parseInt(button.dataset.id, 10);
            const item = getCart().find((entry) => entry.id === id);
            if (item) {
                updateQuantity(id, item.quantity + 1);
                renderCartPage();
            }
        });
    });

    document.querySelectorAll(".remove-item").forEach((button) => {
        button.addEventListener("click", () => {
            removeFromCart(parseInt(button.dataset.id, 10));
            renderCartPage();
        });
    });
}

function renderCheckoutSummary() {
    const cart = getCart();
    const summaryContainer = document.getElementById("checkout-summary");
    const totalEl = document.getElementById("checkout-total");

    if (!summaryContainer) return;

    if (cart.length === 0) {
        window.location.href = "cart.html";
        return;
    }

    summaryContainer.innerHTML = cart
        .map(
            (item) => `
        <div class="summary-item">
            <span>${item.name} × ${item.quantity}</span>
            <span>${formatPrice(item.price * item.quantity)}</span>
        </div>
    `
        )
        .join("");

    if (totalEl) {
        totalEl.textContent = formatPrice(getCartTotal());
    }
}

async function placeOrder(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const cart = getCart();

    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    const formData = new FormData(form);
    const customerName = formData.get("name");
    const email = formData.get("email");
    const address = formData.get("address");

    const orderPayload = {
        customer_name: customerName,
        email: email,
        address: address,
        items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
        })),
        total: getCartTotal(),
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Processing...";

    try {
        const orderResponse = await fetch(`${API_BASE}/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderPayload),
        });

        if (!orderResponse.ok) {
            throw new Error("Order creation failed");
        }

        const order = await orderResponse.json();

        const paymentResponse = await fetch(`${API_BASE}/payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: order.total, order_id: order.order_id }),
        });

        if (!paymentResponse.ok) {
            throw new Error("Payment processing failed");
        }

        const payment = await paymentResponse.json();

        const notifyResponse = await fetch(`${API_BASE}/notify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: order.email, order_id: order.order_id }),
        });

        if (!notifyResponse.ok) {
            throw new Error("Notification failed");
        }

        sessionStorage.setItem(
            "lastOrder",
            JSON.stringify({
                order_id: order.order_id,
                transaction_id: payment.transaction_id,
                total: order.total,
                customer_name: order.customer_name,
                email: order.email,
            })
        );

        clearCart();
        window.location.href = "success.html";
    } catch (error) {
        alert("Something went wrong. Please try again.");
        submitBtn.disabled = false;
        submitBtn.textContent = "Place Order";
    }
}

function renderSuccessPage() {
    const orderData = sessionStorage.getItem("lastOrder");
    if (!orderData) {
        window.location.href = "index.html";
        return;
    }

    const order = JSON.parse(orderData);
    const orderIdEl = document.getElementById("order-id");
    const transactionIdEl = document.getElementById("transaction-id");
    const orderTotalEl = document.getElementById("order-total");
    const customerNameEl = document.getElementById("customer-name");
    const customerEmailEl = document.getElementById("customer-email");

    if (orderIdEl) orderIdEl.textContent = order.order_id;
    if (transactionIdEl) transactionIdEl.textContent = order.transaction_id;
    if (orderTotalEl) orderTotalEl.textContent = formatPrice(order.total);
    if (customerNameEl) customerNameEl.textContent = order.customer_name;
    if (customerEmailEl) customerEmailEl.textContent = order.email;
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("cart-items")) {
        renderCartPage();
    }

    if (document.getElementById("checkout-form")) {
        renderCheckoutSummary();
        document.getElementById("checkout-form").addEventListener("submit", placeOrder);
    }

    if (document.getElementById("order-id")) {
        renderSuccessPage();
    }
});
