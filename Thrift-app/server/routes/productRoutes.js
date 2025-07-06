const express = require('express');
const router = express.Router();
const Product = require('../Schemas/ProductSchema'); // Import the Product model
const User = require('../Schemas/UserSchema'); // Import the User model
const Cart = require('../Schemas/CartSchema')
const Order=require('../Schemas/OrderSchema');
const multer = require('multer'); // For handling file uploads
const path = require('path');
//includes to mimic A.I. search integration
const natural = require("natural");
const { removeStopwords, eng } = require('stopword');
const synonyms = require('synonyms');
const { re } = require('synonyms/dictionary');
const wordTokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

async function getSearchTerms(prodDesc) {
  var lowProdDesc = prodDesc.toLowerCase();
  let tokens = wordTokenizer.tokenize(lowProdDesc);
  let filteredTokens = removeStopwords(tokens, eng);
  let stemmedTokens = filteredTokens.map(word => stemmer.stem(word));
  let finalTerms = new Set(stemmedTokens);
  for(const word of stemmedTokens)
  {
    const foundSynonyms=synonyms(word);
    if(foundSynonyms)
    {
      for(const pos in foundSynonyms)
      {
          foundSynonyms[pos].forEach(syn => {
                    // Make sure synonyms are also stemmed before adding
                    finalTerms.add(stemmer.stem(syn));
                });

      }
    }
  }
  

  return[...finalTerms];
};
async function getIntersect(arr1,arr2)
{ 
  if(!Array.isArray(arr1)||!Array.isArray(arr2))
  {
    return([]);
  }
  const set=new Set(arr1);
 
  return arr2.filter(item=>set.has(item));

}

// For handling file path

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', '/images')); // Directory to save uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Append original file extension
  }
});
const upload = multer({ storage: storage });

// POST a new product

// GET all products
router.post('/', upload.single('image'), async (req, res) => {

  console.log("Received request to post a product:", req.file, req.body);

  console.log("Request session user:", req.session.user);
  if (!req.session.user) return res.status(401).json({ message: 'Not logged in' });
  const imageUrl = req.file ? `images/${req.file.filename}` : null; // Assuming the image URL is sent in the request body



  const { name, description, price } = req.body;
  try {

    const searchTerms=await getSearchTerms(description);

    const product = new Product({
      name,
      description,
      price,
      imageUrl,
      UserID: req.session.user.id,
      search_terms:searchTerms
    });
    console.log("Product to be saved:", product);
    await product.save();

    res.json({ message: 'Product posted successfully', product });
  } catch (err) {
    res.status(500).json({ message: 'Failed to post product', error: err.message });
  }
});


router.post('/add-to-cart', async (req, res) => {
  const { ProductID, name, price, quantity } = req.body;
  try {
    const productInDb = await Product.findById(ProductID);
    if (!productInDb) {
      return res.status(404).json({ message: 'Product not found.' });

    }
    const userId = req.session.user.id;
    let myCart = await Cart.findOne({ UserId: userId });
    if (!myCart) {
      myCart = new Cart({
        UserId: userId,
        SessionId: req.session.id,
        items: []
      });

    }
    const cartItemToAdd =
    {
      ProductID: productInDb._id,
      name: productInDb.name,
      price: productInDb.price,
      quantity: quantity // Use the quantity provided by the user

    };
    //check if item already exists in cart
    const itemIndex = myCart.items.findIndex(
      item => item.productId.toString() === productId
    );


    if (itemIndex > -1) {
      myCart.items[itemIndex].quantity = quantity;

      myCart.items[itemIndex].price = productInDb.price;
      myCart.items[itemIndex].name = productInDb.name;

    }
    else {
      myCart.items.push(cartItemToAdd);
    }

    await myCart.save();
    res.status(200).json({
      message: 'Product added successfully',
      cart: myCart,

    });
  } catch (err) {
    console.error('cart item not succesfully added', err);
    res.status(500).json({ messge: "server error adding items to cart", error: err });

  }



});
router.get('/search/:search', async (req, res) => {

   const search=req.params.search;
   try{
   const prodData=await Product.find();
   const searchParameters=await getSearchTerms(search);
   let relevantProds=[];
   for(const product of prodData)
   {
    if(product.search_terms&&Array.isArray(product.search_terms))
    {
      const commonTerms=await   getIntersect(product.search_terms,searchParameters);
      const score=commonTerms.length;
      if(score>0)
      {
        relevantProds.push({
          _id:product._id,
       score:score,
      name:product.name,
      description:product.description,
      price:product.price,
      imageUrl:product.imageUrl,
      UserID: product.UserID
        })

      }
     

    }
     

   }
   relevantProds.sort((a,b)=>b.score-a.score);

   res.status(200).json(relevantProds);
   console.log(relevantProds.length,"similar products successfully found and sent" )
  }
  catch(err)
  {
  res.status(500).json({message:"error fetching similar products",error:err});
  }
   
  


});
router.get('/cart', async (req, res) => {

  const userId = req.session.user.id;
  try {
    let myCart = await Cart.findOne({ UserId: userId });
    if (!myCart) {
      myCart = new Cart({
        UserId: userId,
        SessionId: req.session.id,
        items: []
      });

    }
    await myCart.save();

    res.status(200).json({ message: "cart data sent", cart: myCart });
  }
  catch (err) {
    res.status(500).json({ message: "error fetching cart", error: err });
    console.error("Error fetching or creating cart:", err);

  }


});
router.get('/get-Products', async (req, res) => {
  const products = await Product.find({UserID:req.session.user.id});
  res.json(products);
});

router.get('/get-Orders', async (req, res) => {
  try
  {
  
    const allOrders = await Order.find({sellerId:req.session.user.id});   
   if(!allOrders)
   {
         req.status(200).json({message:"no Orders in history"})
   }
    const finalData=[];
 for(const orders of allOrders)
 {
   const buyer=await User.findById(orders.UserId);
   if(!buyer)
   {
      throw new Error("order is of Invalid format")
    }
   
 
    let data=
    {
      _id:orders._id,
      name:buyer.name,
      UserID:orders.UserId,
      transactionID:orders.transactionID,
      status:orders.status,
      items:orders.items,
      completionDate:orders.completionDate||''
    }
    console.log(data);
    finalData.push(data);
  }
    res.status(200).json(finalData)

  }
  catch(err)
  {
    console.log(err);
         res.status(500).json({message:"error fetching orders",error:err})
  }
});
router.get('/get-user-Orders', async (req, res) => {
  try
  {
  
    const allOrders = await Order.find({UserId:req.session.user.id});   
   if(!allOrders)
   {
         req.status(200).json({message:"no Orders in history"})
   }
    const finalData=[];
 for(const orders of allOrders)
 {
   const seller=await User.findById(orders.sellerId);
   if(!seller)
   {
      throw new Error("order is of Invalid format")
    }
   
 
    let data=
    {
      _id:orders._id,
      name:seller.name,
      UserID:orders.UserId,
      transactionID:orders.transactionID,
      status:orders.status,
      items:orders.items,
      completionDate:orders.completionDate||''
    }
    console.log(data);
    finalData.push(data);
  }
    res.status(200).json(finalData)

  }
  catch(err)
  {
    console.log(err);
         res.status(500).json({message:"error fetching orders",error:err})
  }
});


router.post('/claim-Orders/:id', async (req, res) => {
  const {id}=req.params;
  console.log(id);
  try{
  const order = await Order.findById(id);
  
  const response=await Order.findOneAndUpdate({_id:id},{$set:{status:'collected'}},  { new: true })
  if(response==null)
  {
    throw new Error("'The order you are trying to access is claimed or doesnt exist'")

  }

   res.status(200).json({message:"order claimed successfully"});
}catch(err)
{
   return res.status(500).json({message:err.message, error:err})
}
});
router.get('/remove-Product/:id', async (req, res) => {
  const {id}=req.params;
  try{
  const products = await Product.findById(id);
  if(!products)
  {
    return res.status(401).json({message:'This product is currently inavailable'})
  }
  const response=await Product.findOneAndDelete({_id:id})
  if(!response.ok)
  {
    throw new Error("Product removal not successful")

  }

   res.status(200).json({message:"Product removed successfully"});
}catch(err)
{
   return res.status(500).json({message:'Error removing product', error:err})
}
});

router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.get('/:id', async (req, res) => {

  const { id } = req.params;
  console.log(id);
  const products = await Product.findById(id);
  res.json(products);
});



module.exports = router;

