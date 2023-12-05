import { Button, Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { connect, ConnectedProps } from "react-redux";
import { deleteSelectedTasks } from "../store/actions";
import { RootState } from "../store/store";

const mapStateToProps = ({ selectedTasks }: RootState) => {
  return { selectedTasks };
};

const mapDispatchToProps = {
  deleteSelectedTasks,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface IDefaultProps {
  hideFunction: () => void;
}

type ModalRemoveProps = IDefaultProps & PropsFromRedux;

function ModalRemove({
  hideFunction,
  deleteSelectedTasks,
  selectedTasks,
}: ModalRemoveProps) {
  return (
    <Modal show={true} onHide={hideFunction} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Are you sure to remove {selectedTasks.size} task
          {selectedTasks.size > 1 ? "s" : ""}?
        </Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <Button variant="secondary" onClick={hideFunction}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={() => deleteSelectedTasks(selectedTasks, hideFunction)}
        >
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

ModalRemove.propTypes = {
  hideFunction: PropTypes.func.isRequired,
};

export default connector(ModalRemove);
