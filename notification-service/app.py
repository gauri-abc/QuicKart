from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy", "service": "notification-service"})


@app.route("/notify", methods=["POST"])
def send_notification():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body is required"}), 400

    email = data.get("email")
    order_id = data.get("order_id")

    if not email or not order_id:
        return jsonify({"error": "email and order_id are required"}), 400

    return jsonify({
        "status": "sent",
        "email": email,
        "order_id": order_id,
        "message": f"Order confirmation email sent to {email}",
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5004, debug=False)
