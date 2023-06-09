require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static("public"));

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

// static data
const storeItems = new Map([
  [1, { price: 10000, name: "Learn React Today!!" }],
  [2, { price: 5000, name: "Learn Css Today!!" }],
  [3, { price: 15000, name: "Learn JavaScript Today!!" }],
]);

// for promotion code (coupons)
const promotionCode = stripe.promotionCodes.create({
  coupon: 'SMUyvt7h',
  // code: 'VIPCODE2',
});

app.post("/create-checkout-session", async (req, res) => {
  try {
    
    // for creating a new checkout session using the Stripe API
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      allow_promotion_codes: true,
      line_items: req.body.items.map((item) => {
        const storeItem = storeItems.get(item.id);
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.price,
          },
          quantity: item.quantity,
        };
      }),
      custom_text: {
        submit: {
          message: "We'll email you instructions on how to get started.",
        },
      },
      // for redirecting customer to success page after successful completion of payment
      success_url: `${process.env.SERVER_URL}/success.html`,
      // for redirecting customer to cancel page after canceling payment
      cancel_url: `${process.env.SERVER_URL}/cancel.html`,
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3000);
