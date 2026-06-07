import uuid
from datetime import datetime, timezone

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

orders = []


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy", "service": "order-service"})


@app.route("/orders", methods=["GET"])
def get_orders():
    return jsonify(orders)


@app.route("/orders", methods=["POST"])
def create_order():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body is required"}), 400

    required_fields = ["customer_name", "email", "items", "total"]
    missing = [field for field in required_fields if field not in data]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    order = {
        "order_id": str(uuid.uuid4())[:8].upper(),
        "customer_name": data["customer_name"],
        "email": data["email"],
        "address": data.get("address", ""),
        "items": data["items"],
        "total": data["total"],
        "status": "confirmed",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    orders.append(order)
    return jsonify(order), 201


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=False)
