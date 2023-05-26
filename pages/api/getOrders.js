import dbConnect from "../../utils/dbconnect";
import Orders from "../../schema/orderSchema";

const handler = async (req, res) => {
  if (req.method === "GET") {
    let product;
    try {
      product = await Orders.find();

      return res.send({ success: true, payload: product });
    } catch (error) {
      console.log("error", error);
      return res.send({ success: false, error: error });
    }
  } else {
    res.send({ success: false });
  }
};

export default dbConnect(handler);
