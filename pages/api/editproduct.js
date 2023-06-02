import dbConnect from "../../utils/dbconnect";
import Product from "../../schema/productSchema";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const {
      productcode,
      title,
      quantity,
      Price,
      discount,
      brand,
      stuff,
      category,
      status,
      size,
      productBranch,
      // variant,
    } = req.body.data;
    const id = req.body.id;

    let product;
    try {
      product = await Product.findByIdAndUpdate(
        { _id: id },
        {
          productCode: productcode,
          productTitle: title,

          quantity: quantity,
          rate: Price,
          discount: discount,
          brand: brand,
          stuff: stuff,
          category: category,
          status: status,
          size: size,
          productBranch: productBranch,
          // variantStatus: variantStatus,
          // variant: variantStatus === "no" ? null : variant,
        }
      );

      return res.send({ success: true });
    } catch (error) {
      console.log("error", error);
      return res.send({ success: false, error: error });
    }
  } else {
    res.send({ success: false });
  }
};

export default dbConnect(handler);
