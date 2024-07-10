const express = require("express");
const router = express.Router();
const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { authenticateToken } = require('./userAuth.js')



// Register Router
router.post('/sign-up', async (req, res) => {
    try {
        const { username, email, password, address } = req.body;

        // Validate input
        if (!username || !email || !password || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // check should be greater than 4
        if (username.length < 4) {
            return res.status(400).json({ message: "Username should be greater than 4 characters" });
        }

        // check if email already exists in the DB
        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // check if Username already exists in the DB
        const existingUserName = await User.findOne({ username: username });
        if (existingUserName) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // check password length
        if (password.length <= 5) {
            return res.status(400).json({ message: "Password length should be greater than 5 characters" });
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
            address: address
        });

        await newUser.save();
        res.status(200).json(newUser);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Login Router
router.post('/sign-in', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            res.status(400).json({ message: "Invalid User Credentials" });
        }
        await bcrypt.compare(password, existingUser.password, (error, Data) => {
            if (Data) {
                const authClaims = [
                    { name: existingUser.name },
                    { role: existingUser.role },
                ]
                const token = jwt.sign({ authClaims }, "bookstore123", { expiresIn: "30d", }) //passing Manoj@123 as a secret key
                res.status(200).json({
                    id: existingUser._id,
                    role: existingUser.role,
                    token: token,
                });
            } else {
                res.status(400).json({ message: "Invalid Password Credentials" });
            }
        })

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
})

// get user info

router.get('/get-user-info', authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;

        // Validate the id
        if (!id) {
            return res.status(400).json({ message: "User ID is required in headers" });
        }

        // Fetch user data
        const user = await User.findById(id).select(`-password`);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// update User
router.put("/update-user", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { address } = req.body
        await User.findByIdAndUpdate(id, { address: address })
        res.status(200).json({ message: "Address updated Successfully" })

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
})

module.exports = router;
