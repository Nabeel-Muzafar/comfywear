import dbConnect from "../../utils/dbconnect";
import Product from "../../schema/productSchema";
import orderSchema from "../../schema/orderSchema";

const handler = async (req, res) => {
    await dbConnect();
  if (req.method === "POST") {
    // console.log(req.body)
    const {location , startDate , endDate} = req.body;

    try {
        // Connect to your MongoDB server

    
        const matchingCollections = await orderSchema.distinct('_id', {
          date: {
            $gte: startDate,
            $lte: endDate,
          },
          branch: branch,
        });
    
        const ordersByCollection = {};
    
        for (const collectionId of matchingCollections) {
          const collectionName = `orders_${collectionId}`;
          const OrderModel = mongoose.model(collectionName, orderSchema);
          const orders = await OrderModel.find({ branch }).lean().exec();
          ordersByCollection[collectionName] = orders;
        }
    
        res.status(200).json(ordersByCollection);
      } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } finally {
        // Close the Mongoose connection
        // await mongoose.connection.close();
        console.log('done')
      }

    
  } else {
    res.send({ success: false });
  }
};

export default dbConnect(handler);
