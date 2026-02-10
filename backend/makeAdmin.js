const axios = require('axios');

// CHANGE THIS TO YOUR EMAIL
const EMAIL_TO_PROMOTE = "ours.system26@gmail.com";

async function main() {
    if (EMAIL_TO_PROMOTE === "YOUR_EMAIL_HERE") {
        console.error("Please edit this file and set EMAIL_TO_PROMOTE to your signup email.");
        return;
    }

    try {
        console.log(`Promoting ${EMAIL_TO_PROMOTE} to Admin...`);
        const response = await axios.post('http://localhost:5000/api/set-admin', {
            email: EMAIL_TO_PROMOTE
        });
        console.log("Success!", response.data);
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
}

main();
