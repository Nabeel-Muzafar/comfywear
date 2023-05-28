import dbConnect from "../../utils/dbconnect";
import Product from "../../schema/productSchema";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const id =
      // variant,
      req.body.key;

    let product;
    try {
      product = await Product.findOneAndDelete({ _id: id });

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
