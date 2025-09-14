import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const uri = `${process.env.MONGODB_URI}/${DB_NAME}?retryWrites=true&w=majority`;
    const connectionInstance = await mongoose.connect(uri, {});
    console.log("MONGODB connected successfully!! DB HOST:", connectionInstance.connection.host);
  } catch (error) {
    console.error("DB not connected", error);
    process.exit(1);
  }
};

export default connectDB;
