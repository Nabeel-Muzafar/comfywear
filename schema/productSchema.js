const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productCode: {
    type: String,
    required: true,
  },
  productTitle: {
    type: String,
    required: true,
  },
  productImage: {
    type: String,
    default: "https://via.placeholder.com/150",
  },
  quantity: {
    type: Number,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  actualRate: {
    type: Number,
    required: false,
  },
  discount: {
    type: Number,

    default: 0,
  },
  brand: {
    type: String,
  },
  size: {
    type: String,
  },
  stuff: {
    type: String,
  },
  category: {
    type: String,
  },
  productBranch: {
    type: String,
    default: "warehouse",
  },
  status: {
    type: String,
    required: true,
    default: "none",
  },
  // variantStatus: {
  //   type: String,
  //   required: true,
  // },
  // variant: [],
});
mongoose.models = {};
module.exports = mongoose.model("product", productSchema);
