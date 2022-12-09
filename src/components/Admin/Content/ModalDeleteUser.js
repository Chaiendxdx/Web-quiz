import React, { useState, memo } from "react";
import { useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
const participantApi = "http://localhost:4000/participant";

const ModalDeleteUser = (props) => {
  const { show, setShow, deleteUser, listUsers, setListUsers } = props;
  const handleClose = () => setShow(false);
  //   const handleShow = () => setShow(true);
  const { t } = useTranslation();
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
          toast.success(t("deleteUser.successDelete"));
        } else {
          toast.error(t("deleteUser.errorDelete"));
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
          <Modal.Title>{t("manageUser.delete")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {t("deleteUser.confirm")}
          <b>{deleteUser && deleteUser.email ? deleteUser.email : ""}</b>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("button.no")}
          </Button>
          <Button variant="primary" onClick={handleSubmitDeleteUser}>
            {t("button.yes")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default memo(ModalDeleteUser);
