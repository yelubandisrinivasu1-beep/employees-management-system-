import mongoose from "mongoose";

const getMongoUri = (): string => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("Missing MONGO_URI in environment. Check backend/.env and ensure dotenv is loading.");
  }
  return uri.replace(/^\"(.*)\"$/, "$1");
};

const maskUri = (uri: string): string => {
  return uri.replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)([^@]+)(@.*)/, "$1*****$3");
};

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(getMongoUri());
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    console.error("MongoDB URI:", maskUri(getMongoUri()));
    console.error("If this is an Atlas URI, verify DNS/SRV connectivity and that your IP is allowed in Atlas network access.");
    process.exit(1);
  }
};

export default connectDB;