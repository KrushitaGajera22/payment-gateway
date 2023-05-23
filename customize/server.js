require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static("public"));

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

//portal configuration
const configuration = stripe.billingPortal.configurations.create({
  business_profile: {
    headline: "Cactus Practice partners with Stripe for simplified billing.",
  },
  features: {
    invoice_history: {
      enabled: true,
    },
  },
});

app.post("/create-customer-portal-session", async (req, res) => {
  try {
    // Authenticate your user.
    // creating session on portal
    const session = await stripe.billingPortal.sessions.create({
      customer: "cus_Nwkz5JA7yY1wEu",
      return_url: `${process.env.SERVER_URL}`,
    });

    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3000);
