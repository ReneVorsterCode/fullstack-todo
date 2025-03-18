// Import User schema and webtoken
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Async function to log in, we check our db to find said user
// if exists, we create a token and encrypt it with our key
// before sending it to the user's frontend
const userLoginController = async (req, res) => {
  // Get username and password from request query
  const { username, password } = req.query;

  try {
    const response = await User.findOne({
      username: `${username}`,
      password: `${password}`,
    });

    if (response.username) {
      payload = {
        name: username,
        admin: false,
      };

      const token = jwt.sign(JSON.stringify(payload), "secretkey", {
        algorithm: "HS256",
      });

      console.log(`Welcome back, ${username}!`);
      res.send({ token: token });
    }
  } catch (error) {
    return res.status(403).send({ err: "Trouble finding user" });
  }
};

// We take info from our frontend and check if the username ends
// with @gmail.com, if it does, we can create the account
// so we add a new user to our users collection on MongoDB
const registerNewUser = async (req, res) => {
  const { username, password } = req.body;

  if (username.endsWith("@gmail.com")) {
    try {
      const userModel = new User({
        username: username,
        password: password,
      });

      const savedModel = await userModel.save();

      console.log(savedModel);
      res.send("New user created.");
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error trying to add new user to db" });
    }
  } else {
    res
      .status(400)
      .send({ message: "Cannot use username not ending in @gmail.com" });
  }
};

// Pull info from payload and use mongoose functions to find our
// currently logged in user, and then respond with its document
const getTodos = async (req, res) => {
  const { name, admin } = req.payload.tokenInfo;

  try {
    const response = await User.findOne({ username: `${name}` });
    res.send(response);
  } catch (error) {
    res.status(404).send({ message: "User profile not found." });
  }
};

// We pull info from our payload and deconstruct it
// before using that info to update our User's document
// by using the $push function to add an item to it's
// document's todoItems array
const addTodo = async (req, res) => {
  const { name, admin } = req.payload.tokenInfo;
  const { itemText } = req.payload.bodyInfo;

  try {
    const response = await User.updateOne(
      { username: `${name}` },
      { $push: { todoItems: itemText } }
    );
    console.log(response);
    res.json(response);
  } catch (error) {
    res.status(403).send({ message: "Error adding array entry" });
  }
};

// We pull data from our payload and deconstruct it
// before we use a $set command to change a specific index
// in the user's document's array of todoItems
const editTodos = async (req, res) => {
  const { name, admin } = req.payload.tokenInfo;
  const { itemIndex, itemText } = req.payload.bodyInfo;

  try {
    const response = await User.updateOne(
      { username: `${name}` },
      { $set: { [`todoItems.${itemIndex}`]: `${itemText}` } }
    );
    console.log(response);
    res.json(itemText);
  } catch (error) {
    res.status(403).send({ message: "Error updating array entry" });
  }
};

// Similar to our addTodo, except instead of pushing, we pull
// an item based on its current text, since I am not sure how to pull
// based on the item's index
const deleteTodo = async (req, res) => {
  const { name, admin } = req.payload.tokenInfo;
  const { itemIndex, itemText } = req.payload.bodyInfo;
  console.log(`Index ${itemIndex} Removal Attempt received on server`);

  try {
    const response = await User.updateOne(
      { username: `${name}` },
      { $pull: { todoItems: itemText } }
    );
    console.log(response);
    res.json(response);
  } catch (error) {
    res.status(403).send({ message: "Error updating array entry" });
  }
};

// Export our modules
module.exports = {
  registerNewUser,
  userLoginController,
  getTodos,
  addTodo,
  editTodos,
  deleteTodo,
};
