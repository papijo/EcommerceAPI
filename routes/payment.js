const router = require("express").Router();
const Transaction = require("../models/Transaction");

router.post("/paystack/webhook/", async (req, res) => {
  const data = req?.body?.data;
  const metadata = req?.body?.data?.metadata;
  const customer = req?.body?.data?.customer;

  console.log("Test");
  console.log(req.body);
  // console.log({ data });
  const newTransaction = new Transaction({
    paymentId: data.id,
    payment_status: data.status,
    paid_at: data.paid_at,
    currency: data.currency,
    userId: metadata.userId,
    products: metadata.products,
    amount: metadata.amount / 100,
    address: metadata.address,
    first_name: metadata.first_name,
    last_name: metadata.last_name,
    email: customer.email,
    phone: customer.phone,
  });
  const savedTransaction = await newTransaction.save();
  // res.json({ message: "/paystack/webhook/   has been hit" });
  // console.log("/paystack/webhook/   has been hit");
});

module.exports = router;
