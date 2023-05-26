import dbConnect from "../../utils/dbconnect";
import { getUser } from "../../utils/getUser";
import jwt from "jsonwebtoken";
import Product from "../../schema/productSchema";

const JWT_SECRET = "hunfaisagoodboy";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const user = await getUser(req, res);

    if (!user)
      return res.send({
        success: false,
        payload: { message: "user not found" },
      });

    const token = jwt.sign({ user }, JWT_SECRET);

    try {
      let products = await Product.find();
      res.send({ success: true, payload: { token, user, products } });
    } catch (error) {
      res.send({ success: false });
    }
  } else {
    res.send({ success: false });
  }
};

export default dbConnect(handler);
