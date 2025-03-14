const express = require("express");
const router = express.Router();
require("dotenv").config();
const stripe = require("stripe")("sk_test_");

router.post("/session", async (req, res) => {
  try {
    const { userId } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url:`http://localhost:5173/search?paymentSuccess=true`,
      cancel_url: "http://localhost:5173/search",
      
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "API Access" },
            unit_amount: 500, // $5.00
          },
          quantity: 1,
        },
      ],
    });https://example.com/checkout/return?session_id={CHECKOUT_SESSION_ID}

    res.json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;