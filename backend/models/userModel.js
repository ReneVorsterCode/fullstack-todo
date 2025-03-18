//Set up mongoose schema for our MongoDB
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  todoItems: [
    {
      type: String,
      required: false,
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
