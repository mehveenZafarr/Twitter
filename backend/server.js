import express from 'express';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';
import connectMongoDb from './db/connectMongo.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import { v2 as cloudinary } from "cloudinary";
import postRoutes from './routes/postRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import path from "path";
import cors from 'cors';
// import bodyParser from 'body-parser';


dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const app = express();

// app.use(cors(
//     {
//         origin: 
//     }
// ));
const port = process.env.PORT || 5000
const __dirname = path.resolve()

// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
// Increase payload size limit, size should not be too large as attackers can access
app.use(express.json({ limit: '5mb' })); // Adjust the limit as needed
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/notifications', notificationRoutes)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    })
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
    connectMongoDb()
})