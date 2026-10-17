const express= require("express");
const dotenv= require("dotenv");
const morgan= require("morgan");
const connectDB= require("./config/database");

const categoryRoute= require("./routes/categoryRoute");

dotenv.config({path: "./config.env"})

// Database Connection
connectDB();

const app = express();
const PORT = process.env.PORT || 8000

if(process.env.NODE_ENV == "development")
{
    app.use(morgan("dev"));
    console.log("Development mode")
}
app.use(express.json());

// Routes
app.use("/api/categories", categoryRoute);

app.get("/", (req, res) => {
    res.send("Bazarna API is running");
})

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`)
})