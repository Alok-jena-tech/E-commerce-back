const express=require("express");
const cors=require("cors");
const dotenv=require("dotenv");
const connectDB=require("./config/db");
const userRoutes=require("./routes/userRoutes");
const productRoutes=require("./routes/productRoutes");
const cartRoutes=require("./routes/cartRoutes");
const checkoutRoutes=require("./routes/checkoutRoutes")
const orderRoutes=require("./routes/orderRoutes")
const uploadRoutes=require("./routes/uploadRoutes")
const subscribeRoutes=require("./routes/subscriberRoute")
const adminRotues=require("./routes/adminRoutes")
const productAdminRoutes=require("./routes/productAdminRoutes")
const orderAdminRoutes=require("./routes/adminOrderRoutes")

const app=express();
app.use(express.json());

// ✅ Configure CORS to allow all origins & methods
const allowedOrigins = [
  "http://localhost:5173",                 // local dev
  // "https://e-commerce-frontend-pffk.vercel.app" // deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));



dotenv.config();
const PORT=process.env.PORT || 3000;
// Connect to MongoDB 
connectDB();

app.get("/",(req,res)=>{
    res.send("well come to rabit")
})

// API Routes
app.use("/api/users",userRoutes);
app.use("/api/products",productRoutes);
app.use("/api/cart",cartRoutes)
app.use("/api/checkout",checkoutRoutes)
app.use("/api/orders",orderRoutes)
app.use("/api/upload",uploadRoutes)
app.use("/api/subscribe",subscribeRoutes)

// Admin
app.use("/api/admin/users",adminRotues);
app.use("/api/admin/products",productAdminRoutes);
app.use("/api/admin/orders/",orderAdminRoutes)
app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`)
})
// module.exports=app;