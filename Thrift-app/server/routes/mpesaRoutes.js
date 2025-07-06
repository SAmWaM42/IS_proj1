
const express = require('express');
const router = express.Router();
const http = require('http');
const ngrok = require('@ngrok/ngrok');
const { v4: uuidv4 } = require('uuid');


const User = require('../Schemas/UserSchema'); 
const Product = require('../Schemas/ProductSchema');
const Order=require('../Schemas/OrderSchema');
const OrderItem=require('../Schemas/OrderItemSchema');
const Cart=require('../Schemas/CartSchema');
const OrderItemSchema = require('../Schemas/OrderItemSchema');

router.use((req, res, next) => {
    console.log(`[mpesaRoutes] Incoming request: ${req.method} ${req.originalUrl}`);
    next(); // IMPORTANT: Pass control to the next middleware/route
});



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


async function stkPush(phoneNumber,amount)
{

    const url= "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    const date=new Date();
       const timestamp = 
    date.getFullYear().toString() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2);
    try
    {
    const password = Buffer.from(process.env.DARAJA_SHORTCODE + process.env.DARAJA_PASSKEY + timestamp).toString('base64');
   const token=await getDarajaAccessToken();
    console.log(process.env.NGROK_CALLBACK)
     const response=await fetch (
       url,
        {  method:'POST',
            headers: {
              
                 'Authorization': `Bearer ${token}`,
             'Content-Type': 'application/json'
            },
            body:JSON.stringify(
            {        
            BusinessShortCode: process.env.DARAJA_SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: amount,
            PartyA: phoneNumber, // Use the tenant's phone number here
            PartyB: process.env.DARAJA_SHORTCODE,
            PhoneNumber: phoneNumber,
            CallBackURL:`${process.env.NGROK_CALLBACK}/mpesa/stk/result`,
            AccountReference: "new account payment",
            TransactionDesc: "Paid online",
            QueueTimeoutURL:`${process.env.NGROK_CALLBACK}/mpesa/stk/timeout`,
    
            })
        }
    )
    if(!response.ok)
    {
              console.error("M-Pesa API Response Status:", response.status, response.statusText);
            const errorBody = await response.json(); // Attempt to read the error body
            console.error("M-Pesa API Error Details:", errorBody);
            // Throw a more informative error
            throw new Error(`STK Push failed: ${errorBody.errorMessage || errorBody.MpesaError || JSON.stringify(errorBody) || "Unknown M-Pesa error"}`);
    }
    const result=await response.json()
   
      if(result.ResponseCode==='0')
      {
        return result;
      }
      else
      {
         console.error("M-Pesa STK Push returned non-zero ResponseCode:", result); // This should also give detailed result
        throw new Error(`M-Pesa STK Push failed: ${result.ResponseDescription || result.errorMessage || "Non-zero ResponseCode"}`);
      }
    }
    catch(err)
    {
       console.error("error initiating stk push",err);   
    }
};
async function B2Cfowarding(phoneNumber,amount)
{

    const url= "https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest";
    const date=new Date();
 
    try
    {
   
   const token=await getDarajaAccessToken();
     const response=await fetch (
       url,
        {   method:'POST',
            headers: {
             
             'Authorization': `Bearer ${token}`,
             'Content-Type': 'application/json'
               
            },
            body:JSON.stringify
            (
                 {
                        
                        InitiatorName: "testapi",
                        SecurityCredential: process.env.DARAJA_SECURITYCREDENTIAL,
                        CommandID: "BusinessPayment",
                        Amount: amount,
                        PartyA: process.env.DARAJA_SHORTCODE,
                        PartyB: phoneNumber,
                        Remarks: "fowarding payment from system to seller",
                        QueueTimeOutURL: `${process.env.NGROK_CALLBACK}/mpesa/queue`,
                        ResultURL: `${process.env.NGROK_CALLBACK}/mpesa/b2c/result`,
                        Occasion: "Thrift app payout"
                    }
            )
        }
    )
    if(!response.ok)
    {
            throw new Error("failed to get B2C response");
    }
    const result=await response.json()

      if(result.ResponseCode==='0')
      {
        return result;
      }
      else
      {
        throw new Error("external transaction error")
      }
    }
    catch(err)
    {
       console.error("error initiating B2C fowarding push",err);   
    }
};
router.post('/stk/timeout', async (req, res) => {
   console.log("M-Pesa STK Push Timeout Callback Received:", JSON.stringify(req.body, null, 2));

    
    const callbackData = req.body.Body.stkCallback; 
    const checkoutRequestID = callbackData.CheckoutRequestID;

    try {
        // Find ALL Cart documents associated with this CheckoutRequestID
        const linkedCarts = await Order.find({ 'transactionID': checkoutRequestID });

        if (linkedCarts.length === 0) {
            console.error(`No Cart documents found for CheckoutRequestID: ${checkoutRequestID} during timeout.`);
            return res.status(404).send('No associated carts found for this timeout transaction.'); // M-Pesa expects 200 OK
        }

        const commonCheckoutTransactionId = linkedCarts[0].transactionId;

        // Update all linked carts to indicate a payment timeout
        await Cart.updateMany(
            { transactionId: commonCheckoutTransactionId },
            {
                $set: {
                    status: 'customer_payment_timeout', // New status: user timed out
                    'stkPushDetails.resultDesc': 'STK Push timed out or user cancelled via timeout',
                    'stkPushDetails.paymentConfirmedAt': new Date(), // Timestamp of timeout
                }
            }
        );

        console.log(`Checkout transaction ${commonCheckoutTransactionId} marked as timed out.`);
        res.status(200).send('Timeout callback received successfully');

    } catch (error) {
        console.error("Error processing M-Pesa timeout callback:", error);
        res.status(500).send('Error processing timeout callback');
    }
});
//callback routes
router.post('/stk/result',async  (req, res) => {


    console.log('--- M-Pesa Callback Received ---');
    console.log('Callback Headers:', req.headers);
    console.log('Callback Body:', req.body); 

    const callbackData=req.body.Body.stkCallback;
    const CheckoutRequestID = callbackData.CheckoutRequestID; 

      const resultCode = callbackData.ResultCode

        let mpesaReceiptNumber = null; // To be stored in buyerReceiptID
        let transactionDateFromMpesa = null;
      if(resultCode!==0)
      {
        console.log(`transaction failed (ResultCode: ${resultCode})`);
        res.json(200).json({message:`transaction failed with an error code:${resultCode}`})
      }
     else
     {
    const metadataItems = callbackData.CallbackMetadata.Item;
    mpesaReceiptNumber = metadataItems.find(item => item.Name === 'MpesaReceiptNumber')?.Value || null;
            transactionDateFromMpesa = metadataItems.find(item => item.Name === 'TransactionDate')?.Value || null;
      const linkedOrder=await Order.find({transactionID:CheckoutRequestID});
      if(linkedOrder.length===0)
      {
        console.error(`No Orders pending with the above transactionId${CheckoutRequestID}`);
        return res.status(200).send('No associated carts found for this transaction.');
      }
      for(const updateOrder of linkedOrder )
      {
              const seller = await User.findById(updateOrder.sellerId);
               try
               {
                const response =await B2Cfowarding(seller.phoneNumber,updateOrder.totalPrice);
                if(!response.ok)
                {  
                    await Order.findOneAndUpdate({_id:updateOrder._id},{$set:{status:`payout failed`}})
                    throw new Error("mpesa transaction failed")
                   
                }
                else
                {
                const result=response.json();
                await Order.findOneAndUpdate({_id:updateOrder._id},{$set:
                    {status:`payout initiated`,
                buyerReceiptID: mpesaReceiptNumber,
                  b2cOriginatorConversationId:result.OriginatorConversationID,   }})
                   res.status(200).send('STK Push Callback received and processed successfully');
                };

               }
               catch(err)
               {
                  console.error("Error processing M-Pesa result callback:", error);
                   await Cart.updateOne(
                        { _id: updateOrder._id },
                        { $set: { status: 'payout_failed' } } // Simplified failure status due to exception
                    );
        res.status(200).send('Error processing callback'); // Still send 200 OK to M-Pesa

               }
      }
    }

});

router.post('/b2c/result', async (req, res) => {
    console.log("M-Pesa B2C Payout Final Status Callback Received:", JSON.stringify(req.body, null, 2));

    try {
        
        const b2cResult = req.body.Result;

        if (!b2cResult) {
            console.error("Invalid B2C callback format: Missing 'Result' object.");
            return res.status(200).send('Invalid B2C callback data.'); // Always 200 OK to M-Pesa
        }

        const resultCode = b2cResult.ResultCode; // 0 for success, others for failure
        const resultDesc = b2cResult.ResultDesc;
        // This is the key you stored: M-Pesa's ID for your payout initiation
        const originatorConversationID = b2cResult.OriginatorConversationID;

        // Extract the official B2C transaction ID from M-Pesa if successful
        let b2cTransactionId = null; // This will go into your sellerReceiptID
        if (resultCode === 0 && b2cResult.ResultParameters && b2cResult.ResultParameters.ResultParameter) {
            const resultParams = b2cResult.ResultParameters.ResultParameter;
            b2cTransactionId = resultParams.find(p => p.Key === 'TransactionID')?.Value || null;
            // You could extract 'TransactionCompletedDateTime' here too if you wanted more detail later
        }

        console.log(`B2C Final Status Callback: OriginatorConversationID: ${originatorConversationID}, ResultCode: ${resultCode}, Desc: ${resultDesc}`);

        // --- 2. Find the relevant Order (Cart) document ---
        // Use the 'b2cOriginatorConversationId' you stored on the Cart to find the correct one.
        const orderToUpdate = await Order.findOne({ b2cOriginatorConversationId: originatorConversationID });

        if (!orderToUpdate) {
            console.error(`No Order (Order) found for B2C OriginatorConversationID: ${originatorConversationID}. This payout might be unknown or already processed.`);
            return res.status(200).send('No associated order found for this B2C transaction.');
        }

        // --- 3. Update Order (Cart) status and sellerReceiptID based on B2C Result Code ---
        let newStatus;
        let updateFields = {};

        if (resultCode === 0) {
            newStatus = 'payout_successful';
            updateFields.sellerReceiptID = b2cTransactionId; // Store the M-Pesa transaction ID for seller payout
            updateFields.completionDate = new Date(); // Set completion date if this is the final success point
            console.log(`B2C payout for Cart ${orderToUpdate._id} successful. Seller Receipt ID: ${b2cTransactionId}`);
        } else {
            newStatus = 'payout_failed';
            // You might want to log the error code/description to your database here too if you ever scale
            console.error(`B2C payout for Cart ${orderToUpdate._id} failed. ResultCode: ${resultCode}, Desc: ${resultDesc}`);
        }

        updateFields.status = newStatus;

        await Order.findOneAndUpdate(
            { _id: orderToUpdate._id },
            { $set: updateFields }
        );

        // --- 4. Send 200 OK response to M-Pesa ---
        res.status(200).send('B2C callback received and processed successfully');

    } catch (error) {
        console.error("Error processing M-Pesa B2C final status callback:", error);
        res.status(200).send('Error processing callback internally'); // Always 200 OK to M-Pesa
    }
});
//checkout route
router.post('/checkout', async (req, res) => {



     
    const cartList=req.body; 
    const products=cartList.items;
  
    console.log("1. Cart items (products) received in req.body:", products);
    const me= await User.findById(req.session.user.id);

    if(!me)
    {
        res.status(404).json({message:"not a valid user"})
    }
    const phoneNumber= me.phoneNumber;
    let price=0;
    let orderItems=new Map();
    for(const prod of products)
    {
        let product=await Product.findById(prod.ProductID)
        if(!product)
        {
            throw new Error("product not found");
        }
       price+=(product.price*prod.quantity);
        let seller=await User.findOne({_id:product.UserID});
        if(!seller)
        {
        return res.status(404).json({message:"not a valid user or product"})

        }
        let sellerId=seller._id.toString();
        const newItem=new OrderItem({
            name:product.name,
            ProductID:product._id,
            price:product.price,
            quantity:prod.quantity,
          
        });
        if (orderItems.has(sellerId)) {
                // If seller already in map, add item to their existing array
                orderItems.get(sellerId).items.push(newItem);
            } else {
                // If new seller, create a new entry in the map
                orderItems.set(sellerId, {
                    sellerId: seller._id,
                    items: [newItem]
                });
            }
   console.log("3. orderItems map after processing products:", orderItems);

    }
        try
    {
      
        const response= await stkPush(phoneNumber,price);
        if(!(response && response.ResponseCode === '0') )
        {
            throw new Error("stk push error");
        }
        const result=await response;
     console.log("4. M-Pesa STK Push response (result):", result);
for (const [sellerIdString, sellerGroup] of orderItems)
{
    console.log("5. Entering order creation loop for seller:", sellerIdString); // <-- Add this
          const order=new Order({

            UserId:me._id,
            transactionID:result.CheckoutRequestID,
            sellerId: sellerGroup.sellerId,          
             items:sellerGroup.items, 
             totalPrice:price, 
             status:"payment completed -awaiting fowarding"          

        });
  await order.save();
  console.log(" order processed saving ",order)

    }
 console.log("7. All orders processed. Now clearing cart for UserId:", me._id);
console.log(me._id);
  const updatedCart = await Cart.findOneAndUpdate(
        { UserId: me._id},
        { $set: { items: []}}
      
    );

    if (updatedCart) {
        console.log(`Shopping cart for user ${me._id} cleared successfully.`);
    } else {
        console.log(`No active shopping cart found for user ${me._id} to clear.`); 
    }
      res.status(200).json({
                message: "M-Pesa STK Push initiated successfully. Please complete the payment on your phone.",
                checkoutTransactionId: result.CheckoutRequestID,
                checkoutRequestID: result.CheckoutRequestID,
                customerMessage: result.CustomerMessage || "Request accepted for processing.",
            });

    }
    catch(err)
    {

        res.status(500).json({
            message: "An unexpected error occurred during checkout.",
            error: err.message || "Unknown error" // FIX: Return error message
        });
    }

       
});








module.exports = router;