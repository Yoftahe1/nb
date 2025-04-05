import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import express, { Application } from "express";

import routes from "./routes/index";
import Bootstrap from "./bootstrap";
import { errorHandler } from "./utils/errotHandler";
import accessLogStream from "./utils/access-log-stream";

dotenv.config();

const app: Application = express();
app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174","https://nf-z7nw.onrender.com","https://na-bcg1.onrender.com"], // Allow only your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    credentials: true, // Allow credentials (cookies, etc.)
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(errorHandler);
// app.use(express.json());
app.use(fileUpload());
app.use(
  morgan("dev", {
    stream: accessLogStream,
  })
);

Bootstrap(app);
app.use("/api", routes);
