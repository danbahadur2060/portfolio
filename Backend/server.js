import { app } from "./app.js";
import { connectDB } from "./Configs/DB.configs.js";

const port = process.env.PORT || 4000;

// Connect to database before starting server
connectDB().then(() => {
  app.listen(port, () => {
    console.log("==============================")
    console.log(`🔥Server is running on http://localhost:${port}`);
    console.log("==============================")
  });
}).catch((error) => {
  console.error("Failed to connect to database:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection at: ${promise}, reason: ${err}`);
  // Close server & exit process
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});
