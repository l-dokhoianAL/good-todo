import { Modal } from "react-bootstrap";

export default function SubmitModal() {
  return (
    <Modal show={true} centered>
      <Modal.Header className="bg-success d-flex justify-content-center border-success">
        <Modal.Title>Your message sent</Modal.Title>
      </Modal.Header>
    </Modal>
  );
}
