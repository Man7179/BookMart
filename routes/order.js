const express = require("express");
const router = express.Router();
const User = require('../models/user.js');
const Book = require('../models/book.js');
const Order=require('../models/order.js')
const { authenticateToken } = require('./userAuth.js')

// place order
router.post("/place-order", async (req, res) => {
    try {
        const { id } = req.headers;
        const { order } = req.body;


        for (const orderData of order) { // for isliye Qki at a time mutliple products order kar sakte hai isliye 
            const newOrder = new Order({ user: id, book: orderData._id })
            const orderDataFromDB = await newOrder.save()

            // saving order in User model
            await User.findByIdAndUpdate(id, {
                $push: { orders: orderDataFromDB._id },
            })

            // clearing Cart
            await User.findByIdAndUpdate(id, {
                $pull: { cart: orderData._id },
            })
        }

        return res.json({
            status: "Success",
            message: "Order Placed Successfully"
        })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message })
    }


})

// get order history of a particular user
router.get("/get-order-history", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate({
            path: "orders",
            populate: { path: "book" }
        });
        const orderData = userData.orders.reverse();
        return res.json({
            status: "success",
            data: orderData
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// get all order --admin
router.get("/get-all-orders", authenticateToken, async (req, res) => {
    try {
        const userData = await Order.find().populate({
          path:"book",
        }).populate({path:"user"}).sort({createdAt:-1});
        return res.json({
          data:userData,
        });
      }
      
       catch (error) {
        return res.status(500).json({
          message:error.message,
        });
      }

})

// update status --admin
router.put("/update-status/:id",authenticateToken,async(req,res)=>{
    try {
        const {id} = req.params;
      await Order.findByIdAndUpdate(id,{status:req.body.status});
      return res.json({
        status:"success",
        message:"Status Updated Successfully",
      });
    
    }
    
     catch (error) {
      return res.status(500).json({
        message:error.message,
      });
    }
    });
    

module.exports = router