// Handle imports
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import LoginPage from "./components/loginPage";
import TaskComponent from "./components/taskComponent";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import "./App.css";

function App() {
  // useState for data and todos and loggedIn status and our userToken
  const [data, setData] = useState({});
  const [todos, setTodos] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userToken, setUserToken] = useState({});
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showModalError, setShowModalError] = useState(false);
  const [modalErrorText, setModalErrorText] = useState("");
  const [currentTextLength, setCurrentTextLength] = useState(0);
  const [formText, setFormText] = useState("");

  const handleOpenAddTodo = () => setShowNewTaskModal(true);
  const handleCloseAddTodo = () => setShowNewTaskModal(false);

  // useEffect to update our local data from our DB when our login status
  // changes to true
  useEffect(() => {
    if (loggedIn) {
      fetchData();
    }
  }, [loggedIn]);

  // Our async fetchData function using axios and passing our path
  // and authorization header which uses our useState stored token
  const fetchData = async () => {
    try {
      const response = await axios.get("/users/data", {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      });
      setData(response.data);
      setTodos(response.data.todoItems);
      console.log(response.data.todoItems);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  // We add a new todo with an axios async function passing
  // a path and userData that consists of the new item's text
  // this can be further customised to include a modus that allows
  // for custom text before submission, but I am already low on time
  async function attemptAddTodo() {
    const userData = {
      itemText: formText,
    };

    console.log(currentTextLength);
    console.log(userData.itemText);

    try {
      if (currentTextLength > 141) {
        setModalErrorText("Task cannot exceed 140 characters.");
        setShowModalError(true);
        throw new Error("Task cannot exceed 140 characters");
      } else if (currentTextLength === 0) {
        setModalErrorText("Task cannot be empty.");
        setShowModalError(true);
        throw new Error("Task cannot be empty.");
      } else {
        const response = await axios.put(`/users/data/add`, userData, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        });
        if (response) {
          fetchData();
          handleCloseAddTodo();
          setCurrentTextLength(0);
        }
      }
    } catch (error) {
      console.error("Error updating data", error);
    }
  }

  // Async function to delete a task based on its index and current text
  async function deleteTask(index, taskInfo) {
    const userData = {
      itemIndex: index - 1,
      itemText: taskInfo,
    };
    console.log(`Delete Attempt for index:${userData.itemIndex}`);

    try {
      const response = await axios.post(`/users/data/delete`, userData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      });
      if (response.data.modifiedCount > 0) {
        await fetchData();
      }
    } catch (error) {
      console.error("Error updating data", error);
    }
  }

  // If we are not logged in, display the login screen
  // else display our token-validated account todo items
  if (!loggedIn) {
    return (
      <div className="App">
        <header className="App-header">
          Polony Sandwhich Todo App
          <LoginPage
            setLoggedIn={setLoggedIn}
            setUserToken={setUserToken}
          ></LoginPage>
        </header>
        <p>
          Please note this app is not designed for security. Passwords are not
          encrypted when stored on MongoDB, so please DO NOT use real gmail
          accounts and password combinations. For testing purposes you can use
          Test1@gmail.com as a username and pass1 as a password.
        </p>
      </div>
    );
  } else {
    return (
      <div className="App">
        <header className="App-header">
          Polony Sandwhich Todo App
          <h6>{data.username ? `Welcome, ${data.username}` : "Loading..."}</h6>
          <Row>
            <Col></Col>
            <Col>
              <Button
                onClick={() => {
                  handleOpenAddTodo();
                  setShowModalError(false);
                }}
              >
                Add Todo
              </Button>
            </Col>
            <Col>
              <Button
                onClick={() => {
                  setLoggedIn(false);
                }}
              >
                Logout
              </Button>
            </Col>
          </Row>
        </header>
        <div>
          {todos.length < 1 ||
            data.todoItems.map((item, index) => {
              return (
                <TaskComponent
                  key={index}
                  index={index}
                  tasksInfo={todos}
                  token={userToken}
                  updateParent={fetchData}
                  deleteTask={deleteTask}
                ></TaskComponent>
              );
            })}
        </div>

        <Modal show={showNewTaskModal} onHide={handleCloseAddTodo}>
          <Modal.Header closeButton>
            <Modal.Title>Adding New Todo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>New Todo Text</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  maxLength={140}
                  onChange={(event) => {
                    setFormText(event.target.value);
                    setCurrentTextLength(event.target.value.length);
                  }}
                />
                <Form.Label>Character Count: {currentTextLength}</Form.Label>
                <br></br>
                {!showModalError || (
                  <Form.Label style={{ color: "red" }}>
                    {modalErrorText}
                  </Form.Label>
                )}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                handleCloseAddTodo();
                setCurrentTextLength(0);
              }}
            >
              Close
            </Button>
            <Button variant="primary" onClick={() => attemptAddTodo()}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default App;
