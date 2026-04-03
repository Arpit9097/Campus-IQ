const mongoose = require('mongoose');
require('dotenv').config();

console.log("Testing Mongo Connection...");

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connection SUCCESS!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("MongoDB Connection FAILED:", err);
        process.exit(1);
    });
