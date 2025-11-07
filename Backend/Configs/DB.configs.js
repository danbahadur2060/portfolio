import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const MONGODB_URL = process.env.MONGODB_URL;
        if (!MONGODB_URL) {
            throw new Error("MONGODB_URL is not defined in environment variables.");
        }

        await mongoose.connect(MONGODB_URL);

        console.log("✅ Database connected");
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
        process.exit(1);
    }
};
