import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, trim: true },
    image: { type: Array, required: true },
    description: { type: String, required: true },
    descriptionSize: { type: String, required: true },
    inStock: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    checked: { type: Boolean, default: false },
    category: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
