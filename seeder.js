const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/User");
const products = require("./data/products");
const Cart = require("./models/Cart");
dotenv.config();

// connect to mongoDB
mongoose.connect(process.env.MONGO_URI);
// You must connect to MongoDB in the seeder.js script (or wherever you’re inserting).
// Even if your app already connects in server.js, the seeder.js is a separate script → it runs independently, so it needs its own DB connection.

// function to seed data
const seedData = async () => {
  try {
    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();

    // Create a default admin User
    const createdUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "123456",
      role: "admin",
    });

    // Assign the default user ID to each product
    const userID = createdUser._id;
    const sampleProducts = products.map((product) => {
      return { ...product, user: userID };
    });
    // insert the products into the database
    await Product.insertMany(sampleProducts);
    console.log("Product data seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Error seeding the data:", error);
    process.exit(1);
  }
};

seedData();

// No, your seed.js file will not run automatically when you start the server.
// Here’s why:
// Your server.js is the entry point for running your API/backend.
// seed.js is just a helper script to insert initial/sample data into MongoDB.
// Since seed.js runs independently, you have to execute it manually when you want to populate/reset your DB.
