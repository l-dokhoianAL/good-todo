import React, {
  ChangeEventHandler,
  createRef,
  KeyboardEventHandler,
  PureComponent,
} from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { timeZone } from "../helpers/utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addTask } from "../store/actions";
import { connect, ConnectedProps } from "react-redux";

interface defaultPropsTaskModal {
  toggleModal: () => void;
}

const mapDispatchToProps = {
  addTask,
};
const connector = connect(null, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type PropsTaskModal = defaultPropsTaskModal & PropsFromRedux;

class TaskModal extends PureComponent<PropsTaskModal> {
  inputFocus: React.RefObject<HTMLInputElement>;
  descFocus: React.RefObject<HTMLTextAreaElement>;

  constructor(props: PropsTaskModal) {
    super(props);

    this.inputFocus = createRef();
    this.descFocus = createRef();
  }

  state = {
    title: "",
    description: "",
    date: new Date(),
  };
  componentDidMount() {
    this.inputFocus.current!.focus();
  }
  changeInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };
  handleSubmit = () => {
    let { title, description, date } = this.state;
    title = title.trim();
    if (!title) {
      return;
    }
    const newTask = {
      title,
      description,
      date: timeZone(date),
    };
    this.props.addTask(newTask, this.props.toggleModal);
  };

  handleChangeDate: (
    date: Date | null
  ) => void = (e) => {
    this.setState({
      date: e || new Date(),
    });
  };

  confirmEnter: KeyboardEventHandler<HTMLInputElement> = (e) =>
    e.key === "Enter" && this.descFocus.current!.focus();

  render() {
    return (
      <Modal show={true} centered onHide={this.props.toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Your task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              onChange={this.changeInput}
              onKeyPress={this.confirmEnter}
              ref={this.inputFocus}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="description"
              onChange={this.changeInput}
              ref={this.descFocus}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Deadline</Form.Label>
            <DatePicker
              minDate={new Date()}
              selected={this.state.date}
              onChange={this.handleChangeDate}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.toggleModal}>
            Cancel
          </Button>
          <Button variant="success" onClick={this.handleSubmit}>
            Add Task
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connector(TaskModal);
