import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import path from "path";
import { fileURLToPath } from "url";

import tourRoute from './routes/tours.js';
import userRoute from './routes/users.js';
import authRoute from './routes/auth.js';
import reviewRoute from './routes/reviews.js';
import bookingRoute from './routes/booking.js';
import dashboardRoute from './routes/dashboard.js';

dotenv.config()
// const app = express()
// const port = process.env.PORT || 8000;
// const corsOption = {
//     origin:true,
//     Credentials:true
// }

const app = express();
const port = process.env.PORT || 8000;

// Required to use `__dirname` in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOption = {
  origin: 'http://localhost:3000',
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
};

// database connection

const connect = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('MongoDB database connected');
    } catch (err) {
        console.log('MongoDB database connection failed ');
    }
}

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//middleware
app.use(express.json())
app.use(cors(corsOption))
app.use(cookieParser())
app.use('/api/v1/auth',authRoute);
app.use('/api/v1/tours',tourRoute);
app.use('/api/v1/users',userRoute);
app.use('/api/v1/review',reviewRoute);
app.use('/api/v1/booking',bookingRoute);
app.use('/api/v1/dashboard', dashboardRoute);



app.listen(port, ()=>{
    connect()
    console.log('server listening on port', port)
})
