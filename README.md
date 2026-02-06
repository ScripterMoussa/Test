# ClubLocker Demo

This is a small static demo site inspired by clublocker.com. It includes a homepage, product detail page, and a cart that stores items in `localStorage`.

Quick start:

1. Open `index.html` in a browser (double-click or use a local static server).
2. Browse products, view details, and add items to the cart.

Files added:
- index.html — Homepage
- styles.css — Styling
- app.js — Client JS (loads `products.json`, cart behavior)
- products.json — Sample product data
- product.html — Product detail
- cart.html — Cart page

Next steps (optional):

- Add real images and product descriptions
- Integrate payments (Stripe/PayPal)
- Build a backend for inventory and orders

Stripe Checkout setup (accept Visa/cards)

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file in the project root with your Stripe secret key:

```
STRIPE_SECRET_KEY=sk_test_... (your Stripe secret key)
PORT=3000
```

3. Start the server:

```bash
npm start
```

4. Open `http://localhost:3000` in your browser, add items to the cart, go to Cart and click Checkout. You will be redirected to Stripe Checkout where cards (including Visa) are accepted.

Security notes: keep your secret key private (do not commit `.env`), and only use test keys while developing. For production follow Stripe docs and use HTTPS, webhooks to confirm payments, and proper order fulfillment.
