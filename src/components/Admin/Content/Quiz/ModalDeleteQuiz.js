import React, { useState, memo } from "react";
import { useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
const quizApi = "http://localhost:4000/quiz";

const ModalDeleteQuiz = (props) => {
  const { show, setShow, deleteQuiz, listQuiz, setListQuiz } = props;
  const handleClose = () => setShow(false);
  //   const handleShow = () => setShow(true);
  const { t } = useTranslation();
  const handleDeleteQuiz = (id, callback) => {
    const options = {
      method: "Delete",
      // body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    fetch(quizApi + "/" + id, options)
      .then((response) => {
        if (response.status === 200) {
          toast.success(t("delQuiz.successDelete"));
        } else {
          toast.error(t("delQuiz.errorDelete"));
        }
        response.json();
      })
      .then(callback);
  };

  const handleSubmitDeleteUser = () => {
    handleDeleteQuiz(deleteQuiz.id, () => {
      setShow(false);
      setListQuiz(listQuiz.splice(deleteQuiz.id, 1));
    });
  };
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{t("delQuiz.title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {t("delQuiz.confirm")}
          <b>{deleteQuiz && deleteQuiz.id ? deleteQuiz.id : ""}</b>
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

export default memo(ModalDeleteQuiz);
