import express from 'express';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';
import connectMongoDb from './db/connectMongo.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import {v2 as cloudinary} from "cloudinary";
import postRoutes from './routes/postRoutes.js';

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const app = express();
const port = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes) 
app.use('/api/posts', postRoutes) 

app.listen(port, () => {
    console.log(`Server running on port ${port}` )
    connectMongoDb()
})