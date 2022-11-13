import React, { useState, memo } from "react";
import { useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";

const participantApi = "http://localhost:3000/participant";

const ModalDeleteUser = (props) => {
  const { show, setShow, deleteUser, listUsers, setListUsers } = props;
  const handleClose = () => setShow(false);
  //   const handleShow = () => setShow(true);
  const handleDeleteUser = (id, callback) => {
    const options = {
      method: "Delete",
      // body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    fetch(participantApi + "/" + id, options)
      .then((response) => {
        if (response.status === 200) {
          toast.success("Delete account succeed!");
        } else {
          toast.error("Fail to delete account!");
        }
        response.json();
      })
      .then(callback);
  };

  const handleSubmitDeleteUser = () => {
    handleDeleteUser(deleteUser.id, () => {
      setShow(false);
      setListUsers(listUsers.splice(deleteUser.id, 1));
    });
  };
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Delete the user?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure to delete this user? Email:
          <b>{deleteUser && deleteUser.email ? deleteUser.email : ""}</b>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            No
          </Button>
          <Button variant="primary" onClick={handleSubmitDeleteUser}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default memo(ModalDeleteUser);
