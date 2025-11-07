import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"],
        minlength:[3,"Name must be at least 3 characters"],
        maxlength:[20,"Name must be at most 20 characters"],
        trim:true,
        default:"Admin User"
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        lowercase:true,
        trim:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        default:"admin@site.com"
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minlength:[4,"Password must be at least 4 characters"],
        maxlength:[2000,"Password must be at most 2000 characters"],
        select:false,
        trim:true
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user",
    },
    profile_pic:{
        type:String,
        default:"https://cdn2.vectorstock.com/i/1000x1000/17/61/male-avatar-profile-picture-vector-10211761.jpg",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

},{timestamps:true})

UserSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
})

UserSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

UserSchema.methods.getResetPasswordToken = function(){
    const resetToken = jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:"10m"
    });
    this.resetPasswordToken = resetToken;
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

UserSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:"1d"
    });
}

export const User = mongoose.model("User",UserSchema);
