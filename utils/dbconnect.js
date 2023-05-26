
const mongoose = require("mongoose");

const dbConnect = (handler) => async (req, res) => {
  if (mongoose.connections[0].readyState) {
    return handler(req, res,mongoose.connections[0].client);
  }
  try {
    await mongoose.connect(
      "mongodb+srv://nabeel:nabeel@cluster0.vnr62df.mongodb.net/comfywear"
    );
    console.log("database connected")
  } catch (error) {
    console.log(error)
  }

  return handler(req, res,mongoose.connections[0].client);
};

export default dbConnect;

