// Set up express and router and secure User-based paths
// that will also use middleware to verify tokens
// before taking actions
const express = require("express");
const router = express.Router();

const {
  getTodos,
  addTodo,
  editTodos,
  deleteTodo,
} = require("../../controllers/userController");
const {
  jwtMiddleware,
  jwtModifyMiddleware,
} = require("../../middleware/jwtMiddleware");

router.get("/", jwtMiddleware, getTodos);

router.put("/add", jwtModifyMiddleware, addTodo);

router.put("/edit", jwtModifyMiddleware, editTodos);

router.post("/delete", jwtModifyMiddleware, deleteTodo);

module.exports = router;
