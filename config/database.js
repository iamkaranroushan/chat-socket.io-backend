import { mongoose } from "mongoose";
import dotenv from 'dotenv'
dotenv.config();



const config = {
  isConnected: false,
};


const connectDb = async () => {

  const uri = process.env.MONGODB_URI;

  if (config.isConnected) {
    return;
  }
  try {
    mongoose.set('strictQuery', false);
    const connect = await mongoose.connect(uri);
    console.log(`database connected: ${connect.connection.host}`);
    config.isConnected = true;
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDb;
