import mongoose from "mongoose";

const connectMongoDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`================MongoDb connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error connection to MongoDB: ${error.message}`)
        process.exit(1)
    }
}
export default connectMongoDb