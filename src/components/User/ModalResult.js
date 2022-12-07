import React, { useState, memo } from "react";
import { useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useTranslation, Trans } from "react-i18next";
import { useNavigate } from "react-router-dom";
import NProgress from "nprogress";
const markApi = "http://localhost:4000/total-mark";
const ModalResult = (props) => {
  const {
    show,
    setShow,
    dataModalResult,
    quizId,
    quizName,
    isFinish,
    handleShowAnswer,
    showAnswer,
  } = props;
  const navigate = useNavigate();
  const { t } = useTranslation();
  // const postMark = async (
  //   quizId,
  //   userId,
  //   mark,
  //   totalQuestion,
  //   totalCorrect,
  //   quizName
  // ) => {
  //   let dataMark = {
  //     quizId: quizId,
  //     quizName: quizName,
  //     userId,
  //     totalQuestion,
  //     totalCorrect,
  //     mark,
  //   };
  //   const options = {
  //     method: "POST",
  //     body: JSON.stringify(dataMark),
  //     headers: {
  //       "Content-Type": "application/json",
  //       // 'Content-Type': 'application/x-www-form-urlencoded',
  //     },
  //   };
  //   NProgress.start();
  //   const res = await fetch(markApi, options);
  //   const data = await res.json();
  //   NProgress.done();
  //   return data;
  // };
  const handleClose = async () => {
    // await postMark(
    //   +quizId,
    //   +localStorage.getItem("id"),
    //   dataModalResult.countTotal,
    //   dataModalResult.countQuestion,
    //   dataModalResult.countCorrect,
    //   quizName
    // );
    setShow(false);

    navigate("/users");
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>
            {t("detailQuiz.yourResult")}
            {dataModalResult.countTotal}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {t("detailQuiz.totalQuestion")}
            {dataModalResult.countQuestion}{" "}
          </div>
          <div>
            {t("detailQuiz.totalCorrectAnswer")}
            {dataModalResult.countCorrect}{" "}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleShowAnswer()}>
            {t("detailQuiz.showAnswer")}
          </Button>
          <Button variant="primary" onClick={handleClose}>
            {t("detailQuiz.close")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default memo(ModalResult);
