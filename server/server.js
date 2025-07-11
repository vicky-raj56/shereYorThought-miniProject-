import express from "express";
const app = express();
import userRourter from "./routes/user.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";

connectDB();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("", userRourter);

const port = 300;
app.listen(port, () => {
  console.log(`Server is running http://localhost:${port}`);
});
