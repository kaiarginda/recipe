const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use(cors());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // Enable credentials (cookies)
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.use(
//   session({
//     name: "token",
//     secret: "some-secret",
//     rolling: true,
//     saveUninitialized: true,
//     resave: false,
//     cookie: { secure: false, httpOnly: false, maxAge: 4 * 60 * 60 * 1000 },
//   })
// );

app.use(express.json());
app.use("/images", express.static("./images"));
// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://toko:toko@cluster0.prge3mj.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to the database");
});

// Define your API routes here
const userRoutes = require("../api/routes/userRoutes");
app.use("/api", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
