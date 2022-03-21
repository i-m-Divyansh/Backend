require("dotenv").config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");

//? App Initialization
const app = express();

//? Database Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB CONNECTED!"))
  .catch((err) => console.log(err));

//? middlewares
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
  methods: "GET, PUT, POST, DELETE",
};

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST,GET,LINK");
  next();
});

app.use(cors(corsOptions));
app.use(express.json());

//? API's
app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend is working..." });
});
app.use("/api", authRoutes);

//? PORT
const PORT = process.env.PORT || 3001;

//? Server
app.listen(PORT, () => console.log(`Server Is running at ${PORT}...`));
