# QuickCart

A microservices-based e-commerce demo application built for DevSecOps pipeline scanning and demonstration.

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Frontend  │────▶│ Product Service  │     │  Order Service  │
│   (nginx)   │     │    :5001         │     │     :5002       │
│    :80      │────▶│                  │────▶│                 │
└─────────────┘     └──────────────────┘     └─────────────────┘
       │                                              │
       │              ┌──────────────────┐     ┌─────────────────┐
       └─────────────▶│ Payment Service  │     │ Notification    │
                      │    :5003         │     │ Service :5004   │
                      └──────────────────┘     └─────────────────┘
```

## Services

| Service              | Port | Endpoints                    |
|----------------------|------|------------------------------|
| Frontend (nginx)     | 80   | Static pages + API proxy     |
| Product Service      | 5001 | `GET /products`              |
| Order Service        | 5002 | `GET /orders`, `POST /orders`|
| Payment Service      | 5003 | `POST /payment`              |
| Notification Service | 5004 | `POST /notify`               |

## Quick Start

```bash
docker compose up --build
```

Open [http://localhost](http://localhost) in your browser.

## Project Structure

```
quickcart/
├── frontend/
│   ├── index.html
│   ├── products.html
│   ├── cart.html
│   ├── checkout.html
│   ├── success.html
│   ├── css/style.css
│   ├── js/
│   │   ├── products.js
│   │   ├── cart.js
│   │   └── checkout.js
│   ├── nginx.conf
│   └── Dockerfile
├── product-service/
├── order-service/
├── payment-service/
├── notification-service/
└── docker-compose.yml
```

## Tech Stack

- **Frontend:** HTML, CSS, Vanilla JavaScript (nginx)
- **Backend:** Python Flask
- **Infrastructure:** Docker, Docker Compose

## Order Flow

1. User browses products and adds items to cart
2. User proceeds to checkout and submits order details
3. Order Service creates the order
4. Payment Service processes payment (simulated)
5. Notification Service sends confirmation email (simulated)
6. User is redirected to the success page

## Stop Services

```bash
docker compose down
```
