const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// POST/api/products
// desc Create a new Product
// access Private/Admin   this is because Admin only can create products

router.post("/", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;
    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
      user: req.user._id, //Reference to the admin user who created the product
    });
    const createdProduct = await product.save();
    // console.log("new",createdProduct)
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// route PUT /api/products/:id
// desc Update an existing product ID
// access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;
    // Find product by ID
    const product = await Product.findById(req.params.id);
    if (product) {
      // Update product fields
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.discountPrice = discountPrice || product.discountPrice;
      product.countInStock = countInStock || product.countInStock;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.sizes = sizes || product.sizes;
      product.colors = colors || product.colors;
      product.collections = collections || product.collections;
      product.material = material || product.material;
      product.gender = gender || product.gender;
      product.images = images || product.images;
      product.isFeatured =
        isFeatured != undefined ? isFeatured : product.isFeatured;
      product.isPublished =
        isPublished != undefined ? isPublished : product.isPublished;
      product.tags = tags || product.tags;
      product.dimensions = dimensions || product.dimensions;
      product.weight = weight || product.weight;
      product.sku = sku || product.sku;

      //   Save the product
      const updateProduct = await product.save();
      res.json(updateProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// route DELETE /api/products/:id
// desc Delete a product by id
// access private/admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    // find the product by is
    const product = await Product.findById(req.params.id);
    if (product) {
      // remove the product from DB
      await product.deleteOne();
      res.json({ message: "Product removed " });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// route GET /api/products
// desc GET all products with optional query filters
// access Public

router.get("/", async (req, res) => {
  try {
    const {
      collection,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit,
    } = req.query;
    let query = {}; //all param query lie here as key and value then go for find with filter
    // Filter logic
    if (collection && collection.toLocaleLowerCase() !== "all") {
      query.collections = collection;
    }
    if (category && category.toLocaleLowerCase() !== "all") {
      query.category = category;
    }
    if (material) {
      query.material = { $in: material.split(",") };
    }
    if (brand) {
      query.brand = { $in: brand.split(",") };
    }
    if (size) {
      query.sizes = { $in: size.split(",") };
    }
    if (color) {
      query.colors = { $in: [color] };
    }
    if (gender) {
      query.gender = gender;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice); //output will be{ price: { '$gte': 15, '$lte': 30 } }because value of price is an object as range has start and end value
    } //so when single field has multiple operator they we have to write this in such way

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }, 
      ];
    }

    // this is output
//     {
//   $or: [
//     { name: { $regex: "phone", $options: "i" } },
//     { description: { $regex: "phone", $options: "i" } }
//   ]
// }


//     3. { name: { $regex: search, $options: "i" } }
// This tells MongoDB:
// Look in the name field of the document.
// $regex: search means apply a regular expression to check if the search string is found inside the name.
// $options: "i" makes the regex case-insensitive (so "shirt" will match "Shirt", "SHIRT", etc.).
// 4. { description: { $regex: search, $options: "i" } }
// Same logic as above, but applied to the description field.

// This means the query will return items whose description contains the search term, ignoring case.

    // sort logic
    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
          sort = { price: 1 };
          break;
        case "priceDesc":
          sort = { price: -1 };
          break;
        case "popularity":
          sort = { rating: -1 };
          break;
        default:
          break;
      }
    }

    // Fetch products and apply sorting and limit

    let products = await Product.find(query)
      .sort(sort)
      .limit(Number(limit) || 0);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("server Error");
  }
});


// route GET /api/products/best-seller
// desc Retrieve the product with highest rating .which product best sell this would be highest rating
// access Public
router.get("/best-seller", async (req, res) => {
  try {
    const bestSeller = await Product.findOne().sort({ rating: -1 });
    // but here how put rating value .in frontend there is no rating option
    if (bestSeller) {
      res.json(bestSeller);
    } else {
      res.status(404).json({ message: "No best seller found" });
    }
  } catch (error) {
    console.error("server eror",error);
    res.status(500).send("Server Error");
  }
});


// route GET /api/products/new-arrivals
// desc retrieve latest and products-Creation date
// access public
router.get("/new-arrivals",async(req,res)=>{
  try{
    // Fetch latest and products
    const newArrivals=await Product.find().sort({createdAt:-1}).limit(8);
    res.json(newArrivals);
  }catch(error){
    console.error(error);
    res.status(500).send("Server Error");
  }
})
// route GET /api/products/:id
// desc Get a single product by ID
// access Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route GET /api/products/similar/:id
// desc Retrieve similar products based on the current product's gender and category
// @access Public
router.get("/similar/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const similarProducts = await Product.find({
      _id: { $ne: id },
      gender: product.gender,
      category: product.category,
    }).limit(4);
    res.json(similarProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
