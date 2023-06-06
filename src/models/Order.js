const { default: mongoose } = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    fullname: String,
    handphone: String,
    address: String,
    city: String,
    country: String,
    poscode: String,
    cart: Array,
    itemsPrice: Number,
    shippingPrice: Number,
    totalPrice: Number,
    methodPay: String,
    isDelivered: { type: Boolean, default: false },
    isPaid: { type: Boolean, default: false },
    dateOfPayment: Date,
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
