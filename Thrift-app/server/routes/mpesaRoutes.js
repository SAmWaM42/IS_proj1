
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
        const response = await fetch(tokenUrl, { // Use fetch here
            headers: {
                'Authorization': `Basic ${auth}`
            }
        });

      
        const data = await response.json(); 
  
        if (!response.ok) {
       
            console.error("Daraja API Error Response:", data);
            throw new Error(`Daraja API responded with status ${response.status}: ${data.errorMessage || JSON.stringify(data)}`);
        }

        const accessToken = data.access_token; // Now access access_token from 'data'
        console.log("Daraja Access Token:", accessToken);
        return accessToken;

    } catch (error) {
        console.error("\n--- DEBUGGING: Error getting Daraja Access Token ---");
        console.error("Full Error Object:", error); // This will show you everything
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
async function initiateB2CPayment()
{

}
async function initiateC2BPayment()
{
    
}







module.exports = router;