import mongoose from "mongoose";

const AboutSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"],
        minlength:[3,"About name must be at least 3 characters"],
        maxlength:[20,"About name must be at most 20 characters"],
        trim:true,
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        lowercase:true,
        trim:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    title:{
        type:String,
        required:[true,"Profession title is required"],
        minlength:[3,"Profession title must be at least 3 characters"],
        maxlength:[50,"Profession title must be at most 50 characters"],
        trim:true,
    },
    bio:{
        type:String,
        required:[true,"Biography is required"],
        minlength:[10,"Biography must be at least 10 characters"],
        maxlength:[200,"Biography must be at most 200 characters"],
        trim:true,
    },
    location:{
        type:String,
        trim:true,
    },
    profileImage:{
        type:String,
        default:"https://cdn2.vectorstock.com/i/1000x1000/17/61/male-avatar-profile-picture-vector-10211761.jpg",
    },
}, {timestamps:true})


export const About = mongoose.models.About || mongoose.model("About",AboutSchema);

