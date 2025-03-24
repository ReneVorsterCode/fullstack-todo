// Import jsonwebtoken
require("dotenv").config({ path: "/etc/todo-app.env" });
const jwt = require("jsonwebtoken");

// Setup basic middleware for token split and check to
// populate todoItems after login
function jwtMiddleware(req, res, next) {
  // Putt authorization header and split it into our token
  const jwtToken = req.headers["authorization"];
  const tokenExtract = jwtToken.split(" ")[1];

  // Try catch our token extract attempt using our secretkey
  try {
    const payload = jwt.verify(tokenExtract, process.env.SECRET_KEY);
    if (payload.name.endsWith("@gmail.com")) {
      req.payload = {
        tokenInfo: payload,
      };
      next();
    } else {
      res
        .status(403)
        .json({ message: "Username does not end with @gmail.com" });
    }
  } catch (error) {
    res.status(403).json({ message: "Invalid Token" });
  }
}

// Set up middleware for token authorization when trying to edit todo items
function jwtModifyMiddleware(req, res, next) {
  // Pull authorization header for token and req.body for
  // the additional payload info that we set before send()
  // to our next step, whether delete, add, or edit todo items
  const jwtToken = req.headers["authorization"];
  const bodyInfo = req.body;
  const tokenExtract = jwtToken.split(" ")[1];

  console.log(req.headers["content-type"]);

  try {
    if (req.headers["content-type"] !== "application/json") {
      res
        .status(403)
        .json({ message: "Todo Items only allow JSON content type" });
    }

    if (bodyInfo.itemText.length > 140) {
      res.status(403).json({
        message: "Todo text character count cannot exceed 140 characters.",
      });
    }

    const payload = jwt.verify(tokenExtract, process.env.SECRET_KEY);
    if (payload.name.endsWith("@gmail.com")) {
      req.payload = {
        tokenInfo: payload,
        bodyInfo: bodyInfo,
      };
      next();
    } else {
      res
        .status(403)
        .json({ message: "Username does not end with @gmail.com" });
    }
  } catch (error) {
    res.status(403).json({ message: "Invalid Token" });
  }
}

module.exports = { jwtMiddleware, jwtModifyMiddleware };
