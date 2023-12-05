import React, { PureComponent } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { timeZone } from "../helpers/utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { editTask } from "../store/actions";
import { connect, ConnectedProps } from "react-redux";
import { ITask } from "../interfaces";

const mapDispatchToProps = {
  editTask,
};

const connector = connect(null, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface IDefaultProps {
  onClose: () => void;
  task: ITask;
  from?: string;
}

type PropsEditTaskModal = PropsFromRedux & IDefaultProps;

class TaskModal extends PureComponent<PropsEditTaskModal, ITask> {
  state: ITask;

  constructor(props: PropsEditTaskModal) {
    super(props);

    this.state = {
      ...props.task,
      date: new Date(props.task.date),
    };
  }

  changeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement & {
      name: keyof ITask;
    };
    
    this.setState({
      ...this.state,
      [name]: value,
    });
  };

  handleSubmit = () => {
    let { title, description, _id, date, status } = this.state;
    title = title.trim();
    if (!title) {
      return;
    }
    const editedTask = {
      _id,
      title,
      description,
      status,
      date: timeZone(date),
    };
    this.props.editTask(editedTask, this.props.onClose, this.props.from);
  };

  handleChangeDate = (e: Date) => {
    this.setState({
      date: e || new Date(),
    });
  };

  render() {
    const { onClose } = this.props;
    const { title, description, date } = this.state;
    return (
      <Modal show={true} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Your task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              onChange={this.changeInput}
              value={title}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="description"
              onChange={this.changeInput}
              value={description}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Deadline</Form.Label>
            <DatePicker
              minDate={new Date()}
              selected={date}
              onChange={this.handleChangeDate}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="success" onClick={this.handleSubmit}>
            Edit Task
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connector(TaskModal);
