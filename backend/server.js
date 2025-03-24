// Setup express, cors, and mongoose
require("dotenv").config({ path: "/etc/todo-app.env" });
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Import Routes
const loginRoute = require("./routes/loginRoute");
const userDataRoute = require("./routes/secure/userDataRoute");
const registerRoute = require("./routes/registerRoute");

// Start app and set port
const app = express();
const PORT = process.env.PORT;

// MongoDB uri
const uri = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(uri, { useNewUrlParser: true }).then(
  () => {
    console.log("Successfully connected to the database!");
  },
  (err) => {
    console.log("Could not connect to the database..." + err);
  }
);

// Let app use cors, expressJson and expressUrlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Set routes for app to use with 'users' being name
// of collection in MongoDB
app.use("/users", registerRoute);
app.use("/users/login", loginRoute);
app.use("/users/data", userDataRoute);

app.listen(PORT, () => {
  console.log(`Now listening on PORT:${PORT}`);
});
