const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");

const userSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            match:[/.+\@.+\..+/, "Please enter a valid email address"]
        },
        password:{
            type:String,
            required:true,
            minLength:6,
        },
        role:{
            type:String,
            enum:["customer","admin"],
            default:"customer",

        }
    },
    {timestamps:true}
)
// Password Hash middleware
userSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next();
    // New password (first time create) → isModified("password") === true → hash it.
// Password updated later → isModified("password") === true → hash it again.
// No password change → isModified("password") === false → skip hashing.
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
    next()
})

// Match user entered password to hashed password
userSchema.methods.matchPassword=async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password)
    
}
// matchPassword → your custom instance method.
// enteredPassword → comes from user input (login form).
// this.password → hashed password from DB.

module.exports=mongoose.model("User",userSchema)