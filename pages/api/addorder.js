import dbConnect from "../../utils/dbconnect";
import { getUser } from "../../utils/getUser";
import Product from "../../schema/productSchema";
import Orders from "../../schema/orderSchema";

const JWT_SECRET = "hunfaisagoodboy";

const handler = async (req, res, client) => {
  if (req.method === "POST") {
    // const user = await getUser(req, res);

    // if (!user)
    //   return res.send({
    //     success: false,
    //     payload: { message: "user not found" },
    //   });
    const { totalItems, products, date } = req.body.newObj;
    const { branch, ...order } = req.body.newObj;

// if(!(order.paid >= order.total))
// return res.send({success:false,payload:"Order failed. Kindly pay full amount"})


    const session = client.startSession();
    try {
      // Start a session
      await session.withTransaction(async () => {

//         for (let i = 0; i < totalItems; i++) {

//           await Product.findByIdAndUpdate(
//             { _id: [products[i]._id] },
//             { $inc: { quantity: -products[i].qty } },
//             { session }
//           )
// console.log("i : ",i)
//         }
const updatePromises = [];

for (let i = 0; i < totalItems; i++) {
  updatePromises.push(
    Product.findByIdAndUpdate(
      { _id: products[i]._id },
      { $inc: { quantity: -products[i].qty } },
      { session }
    )
  );
  console.log(i)
}
await Promise.all(updatePromises);
console.log("after loop")
        const result = await Orders.findOneAndUpdate(
          { $and: [{ date: date }, { branch: branch }] },
          { $push: { orders: order } },
          {session}

        )


        if (result) return res.send({ success: true });

        // no document found. creating a new one
        const newOrder = new Orders(
          {orders:[order],
            branch:branch,
            date:date,
          }
        );
  
        // Save the order to the database
         await newOrder.save();
        res.send({ success: true })


      })


    } catch (error) {
      console.log(error)
      res.send({ success: false, payload: "Network Error" })
    }
    finally {
      if (session) await session.endSession();
    }












  } else {
    res.send({ success: false });
  }
};

export default dbConnect(handler);
