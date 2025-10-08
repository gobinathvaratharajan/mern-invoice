import mongoose from "mongoose";
import { systemLogs } from "../utils/logger";

const connectDB = async () => {
    try {
        const dbName = process.env.MONGO_DB_NAME || "invoice_app";
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            throw new Error("MONGO_URI environment variable is not defined");
        }
        const connect = await mongoose.connect(
            mongoURI,
            {
                dbName
            }
        );
        console.log(`MongoDB connected: ${connect.connection.host}`);
        systemLogs.info(`MongoDB connected: ${connect.connection.host}`);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error(`MongoDB connection error: ${errorMessage}`);
        systemLogs.error(`MongoDB connection failed: ${errorMessage}`);
        // Exit the process if database connection fails
        process.exit(1);
    }
}

export default connectDB;
