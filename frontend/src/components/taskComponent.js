// Handle imports
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export default function TaskComponent(props) {
  // Setup our useStates and useRefs and useEffect
  const [taskInfo, setTaskInfo] = useState("");
  const [editing, setEditing] = useState(false);
  const [inputFieldValue, setInputFieldValue] = useState(
    props.tasksInfo[props.index]
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    setTaskInfo(props.tasksInfo[props.index]);
  }, [props.tasksInfo]);

  const handleChange = (event) => {
    setInputFieldValue(event.target.value);
  };

  // Async function to update this item through axios sending
  // path and this item's index and the new text we want to use
  // which is passed through our middleware and then to our controller
  // where we update our task info
  async function updateTodoItem() {
    const userData = {
      itemIndex: props.index,
      itemText: inputRef.current.value,
    };

    try {
      // We make sure tasks descriptions are not longer than
      // 140 characters
      if (inputRef.current.value.length < 141) {
        const response = await axios.put("/users/data/edit", userData, {
          headers: {
            Authorization: `Bearer ${props.token}`,
            "Content-Type": "application/json",
          },
        });
        setEditing(false);
        await props.updateParent();
        setTaskInfo(response.data);
      } else {
        console.error("Cannot add tasks of more than 140 characters");
        setErrorMessage("Task cannot exceed 140 characters.");
        setShowErrorMessage(true);
        setEditing(false);
      }
    } catch (error) {
      console.error("Error updating data", error);
    }
  }

  // We setup our task to look like a polony sandwhich
  // with the Edit and Save button rotating display depending on
  // whether we are currently editing this item. The same goes for our
  // inputfield, which activates with our current itemInfo text when
  // we start editing it.
  return (
    <div className="todoTask" style={{ backgroundColor: "orange" }}>
      <Row>
        <header>Task {props.index + 1}</header>
        {editing ? (
          <Button
            variant="success"
            onClick={() => (setEditing(false), updateTodoItem())}
          >
            Save
          </Button>
        ) : (
          <Button
            variant="success"
            onClick={() => (setEditing(true), setShowErrorMessage(false))}
          >
            Edit
          </Button>
        )}
      </Row>
      <Row>
        <div style={{ backgroundColor: "pink" }}>
          {editing ? (
            <input
              ref={inputRef}
              value={inputFieldValue}
              onChange={handleChange}
            ></input>
          ) : (
            <p>{taskInfo}</p>
          )}
        </div>
      </Row>
      <Row>
        <Button
          variant="danger"
          onClick={() => props.deleteTask(props.index, taskInfo)}
        >
          Remove
        </Button>
      </Row>
    </div>
  );
}
