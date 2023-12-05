import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useActions, useAppSelector } from "../helpers/hooks";
import ChangePassword from "./ChangePassword";

interface ISettingsProps {
  hideModal: () => void;
}

function Settings({ hideModal }: ISettingsProps) {
  const { changeUserData } = useActions();

  const { user } = useAppSelector((state) => state);

  const defaultData = {
    name: user?.name as string,
    surname: user?.surname as string,
  };

  const [userData, setUserData] = useState(defaultData);
  let defaultErrors = { name: null, surname: null };
  const [errors, setError] = useState(defaultErrors);

  const [passwordModal, setPasswordModal] = useState(false);

  const changeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const cancel = () => {
    setUserData(defaultData);
    hideModal();
  };
  const handleSubmitData = async () => {
    let isError = false;

    let key: keyof typeof userData;
    for (key in userData) {
      if (!userData[key]) {
        defaultErrors = { ...defaultErrors, [key]: "field is required" };
        isError = true;
      } else {
        defaultErrors = { ...defaultErrors, [key]: null };
      }
    }
    setError(defaultErrors);
    if (isError) return;
    if (
      userData.name === defaultData.name &&
      userData.surname === defaultData.surname
    ) {
      hideModal();
      return;
    }

    changeUserData(userData, hideModal);
  };

  const openPasswordModal = () => {
    setPasswordModal(!passwordModal);
  };

  return (
    <>
      <Modal
        size="lg"
        centered
        show={!passwordModal}
        onHide={cancel}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>User settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>Name</Form.Label>
          <Form.Control
            required
            type="text"
            name="name"
            value={userData.name}
            onChange={changeValue}
          />
          <Form.Text className="text-danger mb-3">{errors.name}</Form.Text>
          <br />
          <Form.Label>Surname</Form.Label>
          <Form.Control
            required
            type="text"
            name="surname"
            defaultValue={userData.surname}
            onChange={changeValue}
          />
          <Form.Text className="text-danger mb-3">{errors.surname}</Form.Text>

          <hr />
          <Button variant="warning" onClick={openPasswordModal}>
            Change password
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => cancel()}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmitData}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      {passwordModal && <ChangePassword hide={setPasswordModal} />}
    </>
  );
}

export default Settings;
