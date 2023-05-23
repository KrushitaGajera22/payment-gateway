const { closeDelimiter } = require("ejs");

const customer = await stripe.customers
  .create({
    name: "Customer 1",
    description: "My First Test Customer",
  })
  .then((customer) => {
    stripe.products
      .create({
        name: "Starter Subscription",
        description: "12/Month subscription",
      })
      .then((product) => {
        stripe.prices
          .create({
            unit_amount: 1200,
            currency: "inr",
            recurring: {
              interval: "month",
            },
            product: product.id,
          })
          .then((price) => {
            console.log(
              "Success! Here is your starter subscription product id: " +
                product.id
            );
            console.log(
              "Success! Here is your premium subscription price id: " + price.id
            );
          });
      });
  });

const promotionCode = await stripe.promotionCodes.create({
  coupon: "Z4OV52SU",
});

const configuration = await stripe.billingPortal.configurations.update(
  "bpc_1NAtqP2eZvKYlo2CiTTVDo0F",
  {
    business_profile: {
      privacy_policy_url: "https://example.com/privacy",
      terms_of_service_url: "https://example.com/terms",
    },
  }
);

const configuration1 = await stripe.billingPortal.configurations.retrieve(
  "bpc_1NAtqP2eZvKYlo2CiTTVDo0F"
);

const configurations = await stripe.billingPortal.configurations.list({
  limit: 3,
});

const configuration2 = await stripe.billingPortal.configurations.create({
  features: {
    customer_update: {
      allowed_updates: ["email", "tax_id"],
      enabled: true,
    },
    invoice_history: { enabled: true },
  },
  business_profile: {
    privacy_policy_url: "https://example.com/privacy",
    terms_of_service_url: "https://example.com/terms",
  },
});

const subscription = await stripe.subscriptions.create({
  customer: "cus_9s6XWPuHZWFcfK",
  items: [{ price: "price_1NAtRg2eZvKYlo2CKyCXoLMW" }],
});

// for allowing promotion code
allow_promotion_codes: true;
