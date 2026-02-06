require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
if(!STRIPE_SECRET){
  console.warn('STRIPE_SECRET_KEY not set. Server will still run but creating sessions will fail.');
}
const stripe = require('stripe')(STRIPE_SECRET);

const productsPath = path.join(__dirname,'products.json');
function loadProducts(){
  return JSON.parse(fs.readFileSync(productsPath));
}

app.post('/create-checkout-session', async (req,res)=>{
  try{
    const {cart, customer} = req.body;
    if(!cart || !Array.isArray(cart) || cart.length===0) return res.status(400).send('Empty cart');
    const products = loadProducts();
    const line_items = cart.map(item=>{
      const p = products.find(x=>String(x.id)===String(item.id));
      if(!p) throw new Error('Product not found: '+item.id);
      return {
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(p.price*100),
          product_data: {name: p.name}
        },
        quantity: item.qty || 1
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types:['card'],
      mode:'payment',
      line_items,
      success_url: (req.headers.origin || 'http://localhost:3000') + '/?success=1',
      cancel_url: (req.headers.origin || 'http://localhost:3000') + '/cart.html?canceled=1',
      customer_email: (customer && customer.email) || undefined
    });

    res.json({id: session.id, url: session.url});
  }catch(err){
    console.error(err);
    res.status(500).send(err.message || 'Server error');
  }
});

// Serve static files (the demo site)
app.use(express.static(path.join(__dirname)));

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>console.log(`Server listening on http://localhost:${PORT}`));
