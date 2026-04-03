
const axios = require('axios');

async function testLogin() {
    console.log("Testing Login Endpoint...");
    try {
        // Use a test user known to exist or create one first
        // Ideally we sign up then login, but let's try assuming the previous test user might persist if not cleaned (but logic below creates new one)

        const uniqueId = Date.now();
        const testUser = {
            name: `Login Test ${uniqueId}`,
            email: `login_test_${uniqueId}@example.com`,
            password: "password123"
        };

        // 1. Signup first
        console.log("Creating user for login test...");
        await axios.post('http://localhost:5000/api/auth/signup', testUser);

        // 2. Login
        console.log("Attempting login...");
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: testUser.email,
            password: testUser.password
        });

        console.log("Login status:", loginRes.status);
        if (loginRes.data.token) {
            console.log("Login Successful! Token received.");
        } else {
            console.error("Login failed: No token received.");
        }

    } catch (error) {
        if (error.response) {
            console.error("Login test failed with status:", error.response.status);
            console.error("Error data:", error.response.data);
        } else {
            console.error("Login test failed:", error.message);
        }
    }
}

testLogin();
