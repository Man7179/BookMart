const express = require("express");
const router = express.Router();
const User = require('../models/user.js');
const { authenticateToken } = require('./userAuth.js')

// add books to cart
router.put("/add-to-cart", authenticateToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        const userData = await User.findById(id);
        const isBookCart = userData.cart.includes(bookid);
        if (isBookCart) {
            return res.json({
                status: "success",
                message: "Book is already in cart",
            })
        }
        await User.findByIdAndUpdate(id, { $push: { cart: bookid } })
        return res.json({
            status: "success",
            message: "Added to cart"
        })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message })
    }
})

// remove books from cart
router.put("/remove-from-cart/:bookid", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { bookid } = req.params;
        await User.findByIdAndUpdate(id, { $pull: { cart: bookid } })
        return res.json({
            status: "success",
            message: "Book removed from cart"
        })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message })
    }
})

// get cart of particular user

router.get("/get-user-cart", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate("cart"); // focus on only ca
        const cart = userData.cart.reverse();


        return res.status(200).json({
            status: "Success",
            data: cart,
        })


    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
})
module.exports = router