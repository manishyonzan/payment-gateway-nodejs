import express from "express"
import 'dotenv/config'
import ejs from "ejs"
import connectTOMongoDB from "./database/config.js";
import cors from "cors"
import { v1Routes } from "./api/index.js";

const app = express()
const port = process.env.PORT || 3000;

connectTOMongoDB();


app.use(express.json());


app.use(
    cors({
        origin: '*',
    })
);



v1Routes(app);

app.set("view engine", 'ejs');

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message,
        stack: err.stack
    })
})

app.listen(port, () => {
    console.log(`server running at localhost:${port}`)
})