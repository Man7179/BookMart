const express = require("express");
const router = express.Router();
const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const Book = require('../models/book.js')
const { authenticateToken } = require('./userAuth.js')

// add book -admin

router.post("/add-book", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const user = await User.findById(id);
        if (user.role !== "admin") {
            return res.status(400).json({ message: "You Don't have accces to admin " })
        }

        const book = new Book({
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language,
        });

        await book.save();
        res.status(200).json({message:"Book Added Successfully!"});
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
})

// update-book --admin
router.put("/update-book", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers;
        const user = await Book.findByIdAndUpdate(bookid, {
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language,
        });
        res.status(200).json({ message: "Updated" })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
})


// delete-book
router.delete("/delete-book", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers;
        const user = await Book.findByIdAndDelete(bookid
        );
        res.status(200).json({ message: "Book Deleted Successfully" })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
})

// get-all-book
router.get("/get-all-book", async (req, res) => {
    try {

        const books = await Book.find().sort({ createdAt: -1 })

        res.status(200).json({ status: "Success", data: books })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }

})
// get-recent-added-book
router.get("/get-recent-book", async (req, res) => {
    try {

        const books = await Book.find().sort({ createdAt: -1 }).limit(6)

        res.status(200).json({ status: "Success", data: books })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
})


// get-book by id
router.get("/get-book-by-id/:id", async (req, res) => {
    try {
        const {id}=req.params;

        const books = await Book.findById(id)

        res.status(200).json({ status: "Success", data: books })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
})

module.exports = router;