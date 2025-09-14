const express=require("express");
const Product=require("../models/Product");
const {protect,admin}=require("../middleware/authMiddleware");
const router =express.Router();

// route GET/api/admin/products
// desc Get all products  (Admin only)
// accesss Private/Admin
router.get("/",protect,admin,async(req,res)=>{
    try{
        const products=await Product.find({});
        res.json(products);
    }catch(error){
        console.error(error);
        res.status(500).json({message:"Server Error"});
    }
})

module.exports=router;


// and others like update ,create,delete are available in productRotues.js
// but here only fetch(get) only describe it as for admin need all products but in productRoute.js get all products with filter