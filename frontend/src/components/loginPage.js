// Handle imports
import { useState, useRef } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";

export default function LoginPage(props) {
  // Setup states and fields for current username and password inputs
  // we also set up a errorMessage state for its display and its message
  // to make it modular in case necessary
  let usernameInput = useRef("");
  let passwordInput = useRef("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // async login function using axios, passing our typed in username and
  // password as uri params
  async function attemptLogin(username, password) {
    try {
      const response = await axios.get(
        `users/login?username=${username}&password=${password}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // If we successfully login, we want to use the response.data.token
      // to set our App.js token useState and our App.js LoggedIn useState
      if (response.data.token !== "") {
        props.setUserToken(response.data.token);
        props.setLoggedIn(true);
        setShowErrorMessage(false);
        console.log(response.data.token);
      }
    } catch (error) {
      setShowErrorMessage(true);
      setErrorMessage("Invalid Login Credentials");
      console.error("Invalid Login Credentials", error);
    }
  }

  // We attempt to register with a typed in username and password
  // we must first check if it ends in @gmail.com
  // if not we throw an error
  async function attemptRegister(username, password) {
    if (username.endsWith("@gmail.com")) {
      try {
        const response = await axios.post(`/users/register`, {
          username: username,
          password: password,
        });
        if (response) {
          console.log(response);
        }
      } catch (error) {
        console.error("Invalid Login Credentials", error);
      }
    } else {
      setShowErrorMessage(true);
      setErrorMessage("Username must end with @gmail.com");
    }
  }

  // Simple display of our username and password fields,
  // and an optional <p> should our ErrorMessage display bool
  // currently be true
  return (
    <div>
      <input ref={usernameInput} placeholder="username"></input>
      <br></br>
      <input ref={passwordInput} placeholder="password" type="password"></input>
      <br></br>
      <Button
        onClick={() => {
          attemptLogin(
            usernameInput.current.value,
            passwordInput.current.value
          );
          console.log(
            `Login attempted with ${usernameInput.current.value} and ${passwordInput.current.value}`
          );
        }}
      >
        Login
      </Button>
      <Button
        onClick={() => {
          attemptRegister(
            usernameInput.current.value,
            passwordInput.current.value
          );
          console.log(
            `Registration attempted with ${usernameInput.current.value} and ${passwordInput.current.value}`
          );
        }}
      >
        Register
      </Button>
      {!showErrorMessage || <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
}
