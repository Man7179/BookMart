const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS

// Import Routes
const User = require('./routes/userRoutes.js');
const Book = require('./routes/bookRoutes.js');
const Favourites = require('./routes/favourite.js'); // Fixed typo in variable name
const Cart = require('./routes/cart.js');
const Order = require('./routes/order.js');

// Database Connection
require('./connection/connection.js'); // Removed extra slash

// Routes
app.use('/api/v1', User);
app.use('/api/v1', Book);
app.use('/api/v1', Favourites);  
app.use('/api/v1', Cart);
app.use('/api/v1', Order);


 // Use a default port if not in .env
app.listen(process.env.PORT, () => {
    console.log(`Server started at Port ${process.env.PORT}`);
});
