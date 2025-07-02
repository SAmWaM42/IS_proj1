
const express = require('express');
const router = express.Router();
const http = require('http');
const ngrok = require('@ngrok/ngrok');
const { requite } = require('synonyms/dictionary');






async function getDarajaAccessToken() {
    const CONSUMER_KEY = process.env.DARAJA_KEY; // Get from .env
    const CONSUMER_SECRET = process.env.DARAJA_SECRET; // Get from .env

    if (!CONSUMER_KEY || !CONSUMER_SECRET) {
        console.error("Error: CONSUMER_KEY or CONSUMER_SECRET not set in environment variables.");
        throw new Error("Missing Daraja API credentials.");
    }

    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    const tokenUrl = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

    try {
        const response = await fetch(tokenUrl, {
            headers: {
                'Authorization': `Basic ${auth}`
            }
        });
        const accessToken = response.data.access_token;
        console.log("Daraja Access Token:", accessToken);
        return accessToken;
    } catch (error) {
        console.error("Error getting Daraja Access Token:", error.response ? error.response.data : error.message);
        throw new Error("Failed to get Daraja Access Token.");
    }
}
router.get('/get-token',async (req,res)=>{
      try {
        const token = await getDarajaAccessToken();
        res.json({ message: 'Access token retrieved successfully', accessToken: token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

});

router.get('/',async (req,res)=>{

    res.status(200).json({message:"hitting this route"})
});








module.exports = router;