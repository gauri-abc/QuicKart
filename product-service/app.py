from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

PRODUCTS = [
    {
        "id": 1,
        "name": "Laptop",
        "price": 79999,
        "description": "High-performance laptop with 16GB RAM, 512GB SSD, and Intel Core i7 processor. Perfect for work and creativity.",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
    },
    {
        "id": 2,
        "name": "Smartphone",
        "price": 49999,
        "description": "Latest flagship smartphone with 128GB storage, triple camera system, and all-day battery life.",
        "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
    },
    {
        "id": 3,
        "name": "Headphones",
        "price": 8999,
        "description": "Premium wireless headphones with active noise cancellation and 30-hour battery life.",
        "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    },
    {
        "id": 4,
        "name": "Smart Watch",
        "price": 24999,
        "description": "Feature-rich smartwatch with health tracking, GPS, and water resistance up to 50 meters.",
        "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
    },
    {
        "id": 5,
        "name": "Keyboard",
        "price": 5999,
        "description": "Mechanical gaming keyboard with RGB backlighting, tactile switches, and programmable keys.",
        "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop",
    },
    {
        "id": 6,
        "name": "Gaming Mouse",
        "price": 3999,
        "description": "Precision gaming mouse with 25,600 DPI sensor, customizable RGB, and ergonomic design.",
        "image": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
    },
]


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy", "service": "product-service"})


@app.route("/products", methods=["GET"])
def get_products():
    return jsonify(PRODUCTS)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=False)
