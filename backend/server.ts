import express, {Request, Response} from "express";
import cors from "cors";
import morgan from "morgan"
import cookieParser from "cookie-parser"
import mongoSanitize from "express-mongo-sanitize"
import "dotenv/config"

// import
import { morganMiddleware  } from "./utils/logger";
import connectDB from "./config/connectDB";

// connect to database
connectDB();

const app = express();
const port = process.env.PORT || 5050;

// environment
if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'))
}


// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))
app.use(cookieParser());
app.use(mongoSanitize());
app.use(morganMiddleware);

// start the server
app.listen(port, () => {
    console.log(`Server is running in localhost: ${port}`)
})


// test the server
app.get("/api/v1/test", (req: Request, res: Response) => {
    res.json({message: "Server is running"})
})
