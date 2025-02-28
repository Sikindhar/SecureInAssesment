import mongoose from "mongoose";
import dotenv from "dotenv";
import { fetchAndStoreFullCVEData } from "../Services/storeCVE.js";  

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error(" MongoDB URI is missing. Check your .env file.");
  process.exit(1);
} 
else{
  console.log("The mongo Db connection string is ", MONGO_URI)
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log(" MongoDB NVD database successfully Connected");
    await fetchAndStoreFullCVEData();
    mongoose.disconnect();
  })
  .catch(err => console.error(" MongoDB Connection Error:", err));
