import { Container, Row, Col } from "react-bootstrap";

export default function About() {
  return (
    <Container className="container-fix">
      <Row className="d-flex align-items-center">
        <Col>
          <h1 className="text-center mb-3">About project</h1>
          <div className="border border-secondary p-3">
            <p className="mb-0">
              This is a task managment tool in React, with the abilities of
              searching, sorting and filtering options.You can filter tasks by
              status(done, active), date and sort tasks according to the
              following points: A-Z, Z-A, Creation date oldest, Creation date
              newest, Completion date oldest, Completion date newest There are
              options for deleting tasks one by one, as well as deleting several
              at a time.There is an opportunity to edit the task, which is
              organized through the modal window. You can change the task done
              or active. If you enter non-existent pages on the site, you will
              be redirected to 404 page, which contain a message that the
              desired page does not exist.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
