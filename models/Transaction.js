const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    paymentId: { type: String, required: true },
    payment_status: { type: String, default: "pending" },
    paid_at: { type: Date },
    currency: { type: String, default: "NGN" },
    userId: { type: String, required: true },
    products: [
      {
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        title: { type: String },
        desc: { type: String },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: String, required: true },
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String },
    phone: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
