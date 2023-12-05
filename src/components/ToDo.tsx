import { Component } from "react";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import EditTaskModal from "./EditTaskModal";
import Task from "./task/Task";
import ModalRemove from "./ModalRemove";
import TaskModal from "./TaskModal";
import Search from "./Search";
import Sort from "./Sort/Sort";
import Date from "./DatePick";
import { connect } from "react-redux";
import { getTasks, selectToggle, setFilters } from "../store/actions";
import history from "../helpers/history";
import { ITask, SearchKey, SearchValue } from "../interfaces";
import { IDefaultSearchingParams } from "../store";

interface IStatusOption {
  label: "Active" | "Done",
  value: "active" | "done"
}

const statusOptions: IStatusOption[] = [
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Done",
    value: "done",
  },
];
let isMounted = false;

interface ToDoStateProps {
  tasks: ITask[],
  selectedTasks: Set<string>,
  searchingParams: IDefaultSearchingParams
};

interface ToDoDispatchProps extends ToDoStateProps {
  setFilters: (key: SearchKey, value: SearchValue) => void;
  getTasks: (params?: IDefaultSearchingParams) => void;
  selectToggle: (tasks: ITask[], selectedTasks: Set<string>) => void;
}

class ToDo extends Component <ToDoDispatchProps> {
  state = {
    tasks: [],
    active: false,
    done: false,
    show: false,
    editedTask: null,
    showAddTaskModal: false,
  };

  componentDidMount() {
    if (history.location.search) {
      const options = history.location.search
        .slice(1)
        .split("&")
        .map((option) => option.split("=") as [SearchKey, SearchValue]);

      options.map(([optionName, optionValue]) =>
        this.props.setFilters(optionName, optionValue)
      );
    } else {
      this.props.getTasks();
    }
    isMounted = true;
  }

  handleToggle = () => {
    this.setState({
      show: !this.state.show,
    });
  };
  closeEditTaskModal = (editedTask: ITask | null) => {
    this.setState({
      editedTask,
    });
  };
  openModal = () => {
    this.setState({ showAddTaskModal: !this.state.showAddTaskModal });
  };

  changeStatus = (name: 'done' | 'active') => {
    if (name === "active") {
      this.setState({
        done: false,
        active: !this.state.active,
      });
    } else {
      this.setState({
        active: false,
        done: !this.state.done,
      });
    }
  };

  componentDidUpdate(prevProps: ToDoDispatchProps, prevState: typeof this.state) {
    const { active, done } = this.state;
    const thisStatus = this.props.searchingParams.status;
    const prevStatus = prevProps.searchingParams.status;
    const { searchingParams } = this.props;
    if (prevState.active !== active || prevState.done !== done) {
      let sendingValue = "";
      if (active) {
        sendingValue = "active";
      } else if (done) {
        sendingValue = "done";
      }
      if (thisStatus === sendingValue || (!thisStatus && !sendingValue)) {
        return;
      }
      this.props.setFilters("status", sendingValue);
    }
    if (thisStatus !== prevStatus) {
      if (thisStatus) {
        this.setState({ [thisStatus]: true });
      } else {
        this.setState({ active: false, done: false });
      }
    }
    if (prevProps.searchingParams !== searchingParams) {
      const SearchValues = Object.values(searchingParams);
      if (SearchValues.some((param) => param)) {
        this.props.getTasks(searchingParams);
        return;
      }
      if (isMounted) {
        this.props.getTasks();
      }
    }
  }
  render() {
    const { show, editedTask, showAddTaskModal } = this.state;
    const { tasks, selectedTasks } = this.props;
    const selectUn = tasks.length === selectedTasks.size;
    return (
      <Container>
        <Row className="mb-4">
          <Col>
            <Search />
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              className="w-100"
              onClick={this.openModal}
              variant="success"
              id="button-addon2"
            >
              Add task
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Date />
          </Col>
        </Row>
        <Row>
          <Col>
            <Sort />
          </Col>
          <Col>
            <div className="mb-3 d-flex align-items-center flex-column">
              <span>Status</span>
              <div>
                {statusOptions.map((option, i) => (
                  <Form.Check
                    onChange={() => this.changeStatus(option.value)}
                    key={i}
                    checked={this.state[option.value]}
                    inline
                    label={option.label}
                  />
                ))}
              </div>
            </div>
          </Col>
        </Row>
        {/* <Row>
          <Col></Col>
        </Row> */}
        <Row>
          <Col className="d-flex justify-content-end">
            {!!selectedTasks.size && tasks.length > 1 && (
              <Button
                className="w-25 mt-3"
                variant={selectUn ? "secondary" : "warning"}
                onClick={() => this.props.selectToggle(tasks, selectedTasks)}
              >
                {selectUn ? "Deselect All" : "Select All"}{" "}
              </Button>
            )}
          </Col>
        </Row>
        <Row className="mt-3">
          {tasks.map((task) => {
            return (
              <Col className="pb-3" key={task._id} xs={12} sm={6} md={4} lg={3}>
                <Task
                  task={task}
                  editedTask={this.closeEditTaskModal}
                  disabled={!!selectedTasks.size}
                  selected={selectedTasks.has(task._id)}
                />
              </Col>
            );
          })}
        </Row>
        <Row className="justify-content-center">
          <Col xs={6}>
            {!!selectedTasks.size && (
              <Button
                className="me-3 w-100"
                onClick={this.handleToggle}
                variant="danger"
              >
                Remove Selected ({selectedTasks.size})
              </Button>
            )}
          </Col>
        </Row>
        {!!selectedTasks.size && show && (
          <ModalRemove
            hideFunction={this.handleToggle}
          />
        )}
        {showAddTaskModal ? <TaskModal toggleModal={this.openModal} /> : null}
        {editedTask ? (
          <EditTaskModal
            task={editedTask}
            onClose={() => this.closeEditTaskModal(null)}
          />
        ) : null}
      </Container>
    );
  }
}

const mapStateToProps = ({
  tasks,
  selectedTasks,
  searchingParams,
}: ToDoStateProps) => ({
  tasks,
  selectedTasks,
  searchingParams,
});

const mapDispatchToProps = {
  getTasks,
  selectToggle,
  setFilters,
};

export default connect(mapStateToProps, mapDispatchToProps)(ToDo);
