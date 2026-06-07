import uuid

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy", "service": "payment-service"})


@app.route("/payment", methods=["POST"])
def process_payment():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body is required"}), 400

    amount = data.get("amount")
    if amount is None:
        return jsonify({"error": "Payment amount is required"}), 400

    transaction_id = f"TXN{uuid.uuid4().hex[:8].upper()}"

    return jsonify({
        "status": "success",
        "transaction_id": transaction_id,
        "amount": amount,
        "message": "Payment processed successfully",
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5003, debug=False)
