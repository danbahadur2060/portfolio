import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        lowercase:true,
        trim:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    phone:{
        type:String,
        trim:true,
    },
    linkedin_profile:{
        type:String,
        trim:true,
    },
    twitter_profile:{
        type:String,
        trim:true,
    },
    github_profile:{
        type:String,
        trim:true,
    },
    personal_website:{
        type:String,
        trim:true,
    },
}, {timestamps: true})

export const Contact = mongoose.models.Contact || mongoose.model("Contact",ContactSchema);
