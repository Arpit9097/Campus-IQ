
const axios = require('axios');

async function testBackend() {
    console.log("Testing Backend Connection...");
    try {
        const rootRes = await axios.get('http://localhost:5000/');
        console.log("Root endpoint status:", rootRes.status);
        console.log("Root endpoint data:", rootRes.data);
    } catch (error) {
        console.error("Root endpoint failed:", error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error("Backend is NOT running on port 5000.");
        }
    }

    console.log("\nTesting Signup Endpoint...");
    try {
        // Attempt a signup with specific data
        const testUser = {
            name: "Test User",
            email: "test_" + Date.now() + "@example.com",
            password: "password123"
        };
        const signupRes = await axios.post('http://localhost:5000/api/auth/signup', testUser);
        console.log("Signup status:", signupRes.status);
        console.log("Signup success:", signupRes.data);
    } catch (error) {
        if (error.response) {
            console.error("Signup failed with status:", error.response.status);
            console.error("Signup error data:", error.response.data);
        } else {
            console.error("Signup request failed:", error.message);
        }
    }
}

testBackend();
