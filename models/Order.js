const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    //Add User Information to the Orders
    userId: { type: String, required: true },
    email: { type: String, required: true },
    products: [
      {
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        title: { type: String, required: true },
        desc: { type: String, required: true },
      },
    ],
    amount: { type: Number, required: true },
    status: { type: String, default: "pending" }, //stages are pending, processing, delivery

    //Delivery Information
    collector: { type: String, required: true },
    phone_number: { type: Number, required: true },
    address: { type: String, required: true },
    extraNote: { type: String },
    day: String, // 02
    month: String, // 10
    year: String, // 2002
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
