import React, { useState } from "react";
import {
  Col,
  Container,
  FloatingLabel,
  Row,
  Form,
  Button,
} from "react-bootstrap";
import { connect, ConnectedProps } from "react-redux";
import { Link } from "react-router-dom";
import { emailValid, passwordValid } from "../../helpers/Regexp";
import { register } from "../../store/actions";
import stylesContact from "../Contact/contact.module.css";
import styles from "../Login/login.module.css";

const mapDispatchToProps = {
  register,
};

const connector = connect(null, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

function Register({ register }: PropsFromRedux) {
  const newLogin = {
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const [errors, setError] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [data, setData] = useState(newLogin);
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

    if (name === "password" && value) {
      if (!passwordValid.test(value)) {
        setError({
          ...errors,
          password: "Min 8 characters, at least a number",
        });
      } else {
        setError({ ...errors, password: "" });
      }
    }

    if (name === "confirmPassword" && value) {
      if (value !== data.password) {
        setError({
          ...errors,
          confirmPassword: "Passwords didn't match",
        });
      } else {
        setError({ ...errors, confirmPassword: "" });
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
      surname?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
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

    register(data);
  };


  return (
    <div className={` ${styles.container}`}>
      <Container>
        <Row className="justify-content-center ">
          <Col xl={6} xs={12}>
            <div className="container-fix">
              <h3 className={styles.titles}>Sign Up</h3>

              <FloatingLabel
                controlId="floatingName"
                label="Name"
                className="mb-3 mt-3"
              >
                <Form.Control
                  value={data.name}
                  className={errors.name && stylesContact.invalid}
                  name="name"
                  type="text"
                  onChange={changeInputValue}
                  placeholder="name"
                />
                <Form.Text className="text-danger">{errors.name}</Form.Text>
              </FloatingLabel>

              <FloatingLabel
                controlId="floatingSurname"
                label="Last name"
                className="mb-3 mt-3"
              >
                <Form.Control
                  value={data.surname}
                  className={errors.surname && stylesContact.invalid}
                  name="surname"
                  type="text"
                  onChange={changeInputValue}
                  placeholder="surname"
                />
                <Form.Text className="text-danger">{errors.surname}</Form.Text>
              </FloatingLabel>

              <FloatingLabel
                controlId="floatingInput"
                label="Email address"
                className="mb-3 mt-3"
              >
                <Form.Control
                  value={data.email}
                  className={errors.email && stylesContact.invalid}
                  name="email"
                  type="email"
                  onChange={changeInputValue}
                  placeholder="name@example.com"
                />
                <Form.Text className="text-danger">{errors.email}</Form.Text>
              </FloatingLabel>

              <FloatingLabel
                controlId="floatingPassword"
                label="Password"
                className="mb-3"
              >
                <Form.Control
                  value={data.password}
                  className={errors.password && stylesContact.invalid}
                  name="password"
                  onChange={changeInputValue}
                  type="password"
                  placeholder="password"
                />
                <Form.Text className="text-danger">{errors.password}</Form.Text>
              </FloatingLabel>
              <FloatingLabel
                controlId="floatingConfirmPassword"
                label="Confirm password"
                className="mb-3"
              >
                <Form.Control
                  value={data.confirmPassword}
                  className={errors.confirmPassword && stylesContact.invalid}
                  name="confirmPassword"
                  onChange={changeInputValue}
                  type="password"
                  placeholder="confirmPassword"
                />
                <Form.Text className="text-danger">
                  {errors.confirmPassword}
                </Form.Text>
              </FloatingLabel>
              <p>
                Already registered <Link to="/sign-in">sign in?</Link>
              </p>
              <Button
                className="btn btn-primary btn-block d-flex m-auto w-25 justify-content-center mt-3"
                type="submit"
                onClick={sendData}
              >
                Sign Up
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default connect(null, mapDispatchToProps)(Register);
