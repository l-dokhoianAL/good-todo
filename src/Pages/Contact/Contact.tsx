import React, { useEffect, useState } from "react";
import {
  Container,
  FloatingLabel,
  Form,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import SubmitModal from "./SubmitModal";
import styles from "./contact.module.css";
import { emailValid } from "../../helpers/Regexp";
import { useActions, useAppSelector } from "../../helpers/hooks";

export default function Contact() {
  const { contact } = useActions();

  const [data, setData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setError] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [showPopUp, setPopUp] = useState(false);
  const isSuccessContact = useAppSelector((state) => state.isSuccessContact);

  const changeInputValue = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    if (!value) {
      setError({ ...errors, [name]: "Field is required" });
    } else {
      setError({ ...errors, [name]: "" });
    }

    if (name === "email" && value) {
      if (!emailValid.test(value)) {
        setError({ ...errors, email: "Incorrect email" });
      } else {
        setError({ ...errors, email: "" });
      }
    }
    setData({ ...data, [name]: value });
  };
  const sendData = () => {
    if (!Object.values(errors).every((field) => !field)) {
      return;
    }

    const dataKey = Object.keys(data) as (keyof typeof data)[];

    let wrongFields: {
      name?: string;
      email?: string;
      message?: string;
    } = {};

    dataKey.forEach((key) => {
      if (!data[key].trim()) {
        wrongFields[key] = "Field is required";
      }
    });

    if (Object.keys(wrongFields).length > 0) {
      setError((prev) => ({ ...prev, ...wrongFields }));
      return;
    }

    contact(data);
  };
  useEffect(() => {
    if (isSuccessContact) {
      setData({
        name: "",
        email: "",
        message: "",
      });
      setPopUp(true);
      setTimeout(() => {
        setPopUp(false);
      }, 2000);
    }
  }, [isSuccessContact]);
  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={8}>
          <Form.Group className="mb-3 container-fix">
            <h1 className="text-center">Contact Us</h1>
            <FloatingLabel
              controlId="floatingName"
              label="Name"
              className="mb-3 mt-4"
            >
              <Form.Control
                className={errors.name && styles.invalid}
                value={data.name}
                onChange={changeInputValue}
                name="name"
                type="text"
                placeholder="Name"
              />
              <Form.Text className="text-danger">{errors.name}</Form.Text>
            </FloatingLabel>

            <FloatingLabel
              controlId="floatingInput"
              label="Email address"
              className="mb-3"
            >
              <Form.Control
                value={data.email}
                className={errors.email && styles.invalid}
                onChange={changeInputValue}
                name="email"
                type="email"
                placeholder="name@example.com"
              />
              <Form.Text className="text-danger">{errors.email}</Form.Text>
            </FloatingLabel>
            <FloatingLabel controlId="floatingTextarea2" label="Mesasage">
              <Form.Control
                value={data.message}
                className={errors.message && styles.invalid}
                onChange={changeInputValue}
                name="message"
                as="textarea"
                placeholder="Leave a mesasage here"
                style={{ height: "100px" }}
              />
              <Form.Text className="text-danger">{errors.message}</Form.Text>
            </FloatingLabel>
          </Form.Group>
          <div className="text-center">
            <Button className="w-25" onClick={sendData}>
              Send
            </Button>
          </div>

          {showPopUp && <SubmitModal />}
        </Col>
      </Row>
    </Container>
  );
}
