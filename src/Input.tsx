import { Component } from "react";
import { Button, InputGroup, FormControl, Container, Row, Col, Card, Form } from 'react-bootstrap';
import idGenerator from "./idGenerator"

interface Task {
    _id: string;
    title: string;
    onEdit: boolean;
    checked: boolean;
}

export default class Input extends Component {
    state = {
        inputText: "",
        tasks: [] as Task[],
        selectedTasks: new Set(),
        removeAllButton: false
    }
    changeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            inputText: e.target.value
        });
    }
    addText = () => {

        let { inputText, tasks } = this.state;
        inputText = inputText.trim();
        if (!inputText) return;
        const newTask = {
            _id: idGenerator(),
            title: inputText,
            onEdit: false,
            checked: false
        }
        this.setState({
            tasks: [...tasks, newTask],
            editValue: inputText,
            inputText: ""
        });

    }
    editItem = (id: string, bool: boolean) => {
        const { tasks } = this.state;
        const editTasks = tasks.map(obj => {
            if (obj._id === id) {
                obj.onEdit = bool;
            }
            return obj;
        });
        this.setState({
            tasks: editTasks
        });
    }
    deleteItem = (id: string) => {
        const { tasks } = this.state;
        const delArr = tasks.filter(i => i._id !== id);
        this.setState({ tasks: delArr });
    }
    changeEditInput = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const { tasks } = this.state;

        const editValue = tasks.map(obj => {
            if (obj._id === id) {
                obj.title = e.target.value;
            }
            return obj;
        });
        this.setState({
            tasks: editValue
        })
    }
    changeCheck = (id: string) => {
        const { selectedTasks } = this.state;
        this.setState({
            tasks: this.state.tasks.map(obj => {
                if (obj._id === id) {
                    obj.checked = !obj.checked;
                    if (obj.checked) {
                        selectedTasks.add(obj);

                    }
                    else {
                        selectedTasks.delete(obj);
                    }
                    this.setState({
                        selectedTasks: selectedTasks
                    })
                    if (selectedTasks.size === 1) {
                        this.setState({
                            removeAllButton: true
                        });
                    }
                    else if (selectedTasks.size < 1) {
                        this.setState({
                            removeAllButton: false
                        });
                    }
                }
                return obj;
            })
        });
    }
    removeSelected = () => {
        this.setState({
            tasks: this.state.tasks.filter(obj => !obj.checked),
            removeAllButton: false,
            selectedTasks: new Set()
        });
    }
    render() {

        const { inputText, tasks, removeAllButton } = this.state;

        return (
            <>
                <Container className="mt-3">
                    <Row>
                        <Col>
                            <InputGroup>
                                <FormControl
                                    placeholder="Task's name"
                                    aria-label="Task's name"
                                    aria-describedby="basic-addon2"
                                    onChange={this.changeInput}
                                    value={inputText}
                                    onKeyUp={(e) => e.key === "Enter" ? this.addText() : false}
                                />
                                <Button onClick={this.addText} variant="outline-secondary" id="button-addon2">
                                    Add task
                                </Button>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        {tasks.map((task) => {
                            return (
                                <Col
                                    key={task._id}
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    lg={3}
                                >

                                    <Card className="mb-3">

                                        <Card.Body>
                                            <Form.Check onChange={() => this.changeCheck(task._id)} />
                                            <Card.Title>{task.title.slice(0, 10)}</Card.Title>
                                            <Card.Text>
                                                {task.onEdit ? <FormControl
                                                    aria-label="Default"
                                                    aria-describedby="inputGroup-sizing-default"
                                                    value={task.title}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement> ) => this.changeEditInput(e, task._id)}
                                                    className="ps-1"
                                                    onKeyUp={(e) => e.key === "Enter" ? this.editItem(task._id, false) : false}
                                                /> : task.title}
                                            </Card.Text>
                                            <Button variant="danger" onClick={() => this.deleteItem(task._id)} className="me-3">Delete</Button>
                                            {task.onEdit ? <Button variant="success" onClick={() => this.editItem(task._id, false)}>Confirm</Button> :
                                                <Button variant="warning" onClick={() => this.editItem(task._id, true)}>Edit</Button>}

                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}


                    </Row>
                    <Row className="justify-content-center">
                        <Col xs={6}>
                            {removeAllButton && <Button className="me-3 w-100" onClick={this.removeSelected} variant="danger">Remove Selected</Button>}
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}


