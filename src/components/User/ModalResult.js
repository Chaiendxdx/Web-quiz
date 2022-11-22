import React, { useState, memo } from "react";
import { useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const ModalResult = (props) => {
  const { show, setShow } = props;
  const handleClose = () => setShow(false);
  //   const handleShow = () => setShow(true);

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Your Result...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>Total Questions: </div>
          <div>Total Correct Answers: </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary">Show answers</Button>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default memo(ModalResult);
