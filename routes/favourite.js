const express = require("express");
const router = express.Router();
const User = require('../models/user.js');
const { authenticateToken } = require('./userAuth.js')

// add book to favourites

router.put("/add-book-to-favourite", authenticateToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        const userData = await User.findById(id);
        // const isBookAlreadyFavourite = userData.favourites.includes(bookid);
        const isBookAlreadyFavourite=userData.favourites.includes(bookid)
        if (isBookAlreadyFavourite) {
            res.status(200).json({ message: "Book Already in favourites" });
        } else {
            await User.findByIdAndUpdate(id, { $push: { favourites: bookid } })
            res.status(200).json({ message: "Book Added to Favouites" })
        }


    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }

})


// delete book from favourites

router.put("/remove-book-from-favourite", authenticateToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        const userData = await User.findById(id);
        const isBookAlreadyFavourite = userData.favourites.includes(bookid);
        if (isBookAlreadyFavourite) {
            await User.findByIdAndUpdate(id, { $pull: { favourites: bookid } })  //yaha pull matlab favourites ke array me se ye bookid nikal dega

        } else {

            res.status(200).json({ message: "Book Removed from Favouites" })
        }


    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
})


// get favourite book of particular user 

router.get("/get-favourite-book", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate("favourites"); // focus on only favourites
        const favouriteBooks = userData.favourites;


        return res.status(200).json({
            status: "Success",
            data: favouriteBooks,
        })


    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
})
module.exports = router