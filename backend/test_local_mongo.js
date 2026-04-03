const mongoose = require('mongoose');

const localUri = "mongodb://127.0.0.1:27017/campusiq_test";
console.log("Testing Local Mongo Connection...", localUri);

mongoose.connect(localUri, { serverSelectionTimeoutMS: 2000 })
    .then(() => {
        console.log("Local MongoDB Connection SUCCESS!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("Local MongoDB Connection FAILED:", err.message);
        process.exit(1);
    });
