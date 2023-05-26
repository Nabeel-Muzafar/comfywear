const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({

    totalEarning: {
        type: Number,
        required: true,
        default:0
    },
    date:{
        type:String,
        required:true
    },

    branch:{
        type:String,
        required:true
    },

    orders: []


});
mongoose.models = {};
module.exports = mongoose.model("order", OrderSchema);


// orders: [{
//     name:String,
//     contact:String,
//     totalItems:Number,
//     paid:Number,
//     total:Number,
//     type:String,
//     date:String,
//     subTotal:Number,
//     discount:Number,
//     products:[{
//         title:String,
//         code:String,
//         rate:Number,
//         salePrice:Number,
//         qty:Number,
//         _id:String
//     }]

// }]