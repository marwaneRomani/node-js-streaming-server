import cors from "cors"
import express, { json, request } from "express";
import mongoose from "mongoose";

import AuthRoute from "./routes/Auth.routes.js"
import VideoRoute from "./routes/Video.routes.js"

import { config } from "dotenv"
import bodyParser from "body-parser";
config()


const app = express();
app.use(express.json());


app.use(AuthRoute);
app.use(VideoRoute);

//database connection 
const uri = process.env.databaseUri;

mongoose.connect(uri)
        .then(() => console.log("connecting to the db."))
        .catch((error) => console.log(error.message))



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server running on port ${PORT}`))