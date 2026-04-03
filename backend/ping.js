
const axios = require('axios');
axios.get('http://localhost:5000/')
    .then(() => console.log("Backend is UP!"))
    .catch((err) => console.log("Backend check failed: " + err.message));
