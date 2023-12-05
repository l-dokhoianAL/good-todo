import React, { useState } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import { useActions } from "../helpers/hooks";
import { passwordValid } from "../helpers/Regexp";

interface PropsChangePassword {
  hide: (a: boolean) => void;
}

function ChangePassword({ hide }: PropsChangePassword) {
  const defaultPasswords = {
    oldPwd: "",
    newPwd: "",
    confirmPwd: "",
  };
  const defaultErrors: typeof defaultPasswords = {
    newPwd: "",
    confirmPwd: "",
    oldPwd: "",
  };
  const [passwords, setPasswords] = useState(defaultPasswords);
  const [errors, setErrors] = useState(defaultErrors);
  const { changeUserPassword } = useActions();
  const cancel = () => {
    setPasswords(defaultPasswords);
    hide(false);
  };

  const changePasswords = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [name]: value });
    if (!value) {
      setErrors({ ...errors, [name]: "Field is required" });
      return;
    } else {
      setErrors({ ...errors, [name]: "" });
    }
    if (name === "newPwd") {
      if (!passwordValid.test(value)) {
        setErrors({ ...errors, newPwd: "Min 8 characters, at least a number" });
      } else {
        setErrors({ ...errors, newPwd: "" });
      }
    }
    if (name === "confirmPwd") {
      if (value !== passwords.newPwd) {
        setErrors({ ...errors, confirmPwd: "Passwords didn't match" });
      } else {
        setErrors({ ...errors, confirmPwd: "" });
      }
    }
  };

  const submitChanges = () => {
    if (!Object.values(errors).every((field) => !field)) {
      return;
    }

    const dataKey = Object.keys(passwords) as (keyof typeof passwords)[];
    let wrongFields: {
      oldPwd?: string;
      newPwd?: string;
      confirmPwd?: string;
    } = {};

    dataKey.forEach((key) => {
      if (!passwords[key].trim()) {
        wrongFields[key] = "Field is required";
      }
    });

    if (Object.keys(wrongFields).length > 0) {
      setErrors((prev) => ({ ...prev, ...wrongFields }));
      return;
    }

    const sendingPasswords = {
      oldPassword: passwords.oldPwd,
      newPassword: passwords.newPwd,
      confirmNewPassword: passwords.confirmPwd,
    };
    changeUserPassword(sendingPasswords, hide);
  };

  return (
    <Modal size="lg" centered show={true} onHide={cancel} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Change Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form autoComplete="off" method="post" action="">
          <input
            autoComplete="false"
            name="hidden"
            type="text"
            className="d-none"
          ></input>
          <Form.Label>Old Password</Form.Label>

          <Form.Control
            type="password"
            autoComplete="new-password"
            name="oldPwd"
            value={passwords.oldPwd}
            onChange={changePasswords}
          />
          <Form.Text className="text-danger mb-3">{errors.oldPwd}</Form.Text>
          <br />
          <Form.Label>New Password</Form.Label>

          <Form.Control
            type="password"
            name="newPwd"
            value={passwords.newPwd}
            onChange={changePasswords}
          />
          <Form.Text className="text-danger mb-3">{errors.newPwd}</Form.Text>
          <br />
          <Form.Label>Confirm Password</Form.Label>

          <Form.Control
            name="confirmPwd"
            type="password"
            value={passwords.confirmPwd}
            onChange={changePasswords}
          />
          <Form.Text className="text-danger">{errors.confirmPwd}</Form.Text>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => cancel()}>
          Close
        </Button>
        <Button variant="primary" onClick={submitChanges}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ChangePassword;
