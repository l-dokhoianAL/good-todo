import { PureComponent } from "react";
import { Button, Card, Form } from "react-bootstrap";
import styles from "./task.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faCheck,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { textCut, timeZone } from "../../helpers/utils";
import { Link } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import { deleteTask, setSelectedTasks, editTask } from "../../store/actions";
import { ITask } from "../../interfaces";

const mapDispatchToProps = {
  deleteTask,
  setSelectedTasks,
  editTask,
};

const connector = connect(null, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface DefaultProps {
  task: ITask,
  disabled: boolean,
  selected: boolean,
  editedTask: (task: ITask) => void,
}

type PropsTask = PropsFromRedux & DefaultProps;

class Task extends PureComponent<PropsTask> {
  render() {
    const { task, disabled, selected, editedTask, deleteTask, editTask } =
      this.props;
    const { _id, title, description, date, status } = task;

    return (
      <Card className={`h-100 ${selected ? styles.selected : ""}`}>
        <Card.Body className={styles.card}>
          <div>
            <Form.Check
              onChange={() => this.props.setSelectedTasks(_id)}
              checked={selected}
            />
            <Link to={`/task/${_id}`}>
              <Card.Title>{textCut(title, 26)}</Card.Title>
            </Link>
            <div className="d-flex">
              <Card.Text className=" flex-wrap">
                {textCut(description)}
              </Card.Text>
            </div>
          </div>

          <div className="mt-2">
            <Card.Text>
              <em>Status:</em>{" "}
              {task.status[0].toUpperCase() + task.status.slice(1)}
            </Card.Text>
            <Card.Text>
              <em>Deadline:</em> {timeZone(new Date(date))}
            </Card.Text>
            {status === "active" ? (
              <Button
                onClick={() => editTask({ status: "done", _id: task._id })}
                variant="warning"
              >
                <FontAwesomeIcon icon={faClock} />
              </Button>
            ) : (
              <Button
                onClick={() => editTask({ status: "active", _id: task._id })}
                variant="success"
              >
                <FontAwesomeIcon icon={faCheck} />
              </Button>
            )}

            <Button
              className="ms-3"
              variant="secondary"
              onClick={() => editedTask(task)}
            >
              <FontAwesomeIcon icon={faEdit} />
            </Button>
            <Button
              disabled={disabled}
              variant="danger"
              onClick={() => deleteTask(_id)}
              className="ms-3"
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
            <p className={styles.created}>
              Created at {timeZone(new Date(task.created_at))}
            </p>
          </div>
        </Card.Body>
      </Card>
    );
  }
}

export default connector(Task);
