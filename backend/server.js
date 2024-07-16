import express from 'express'
import authRoutes from './routes/authRoutes.js'
import dotenv from 'dotenv'
import connectMongoDb from './db/connectMongo.js'
import cookieParser from 'cookie-parser'

dotenv.config()
const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use('/api/auth', authRoutes)

app.listen(port, () => {
    console.log(`Server running on port ${port}` )
    connectMongoDb()
})