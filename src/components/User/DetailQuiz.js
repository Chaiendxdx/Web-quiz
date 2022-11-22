import { useState } from "react";
import { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./DetailQuiz.scss";
import Question from "./Question";
import NProgress from "nprogress";
import _ from "lodash";
import ModalResult from "./ModalResult";
const quizApi = "http://localhost:4000/question-by-quiz";
const submitAnswerApi = "http://localhost:4000/submit-answers";
const DetailQuiz = (props) => {
  const params = useParams();
  const quizId = params.id;
  const location = useLocation();
  const [dataQuiz, setDataQuiz] = useState([]);
  const [showModalResult, setShowModalResult] = useState(false);
  const [index, setIndex] = useState(0);
  const [dataModalResult, setDataModalResult] = useState({});
  useEffect(() => {
    fetchQuestion();
  }, [quizId]);

  const fetchQuestion = async () => {
    NProgress.start();
    const res = await fetch(`${quizApi}/${quizId}`);
    const data = await res.json();
    NProgress.done();
    setDataQuiz(data.questionList);
  };

  const postSubmitQuiz = async (dataSubmit) => {
    const options = {
      method: "POST",
      body: JSON.stringify(dataSubmit),
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    NProgress.start();
    const res = await fetch(submitAnswerApi, options);
    const data = await res.json();
    NProgress.done();
    if (res.status === 201) {
      setDataModalResult({
        //countCorrect:
        //countTotal:
        //quizData:
      });
      setShowModalResult(true);
    }
  };

  const handlePrev = () => {
    if (index - 1 < 0) return;
    setIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (dataQuiz && dataQuiz.length > index + 1) {
      setIndex((prev) => prev + 1);
    }
  };

  const handleFinish = () => {
    // console.log("check data before submit: ", dataQuiz);
    let payload = {
      quizId: +quizId,
      answers: [],
    };
    let answers = [];
    if (dataQuiz && dataQuiz.length > 0) {
      dataQuiz.forEach((question) => {
        let questionId = question.id;
        let userAnswerId = [];

        question.answers.forEach((answer) => {
          if (answer.isSelected === true) {
            userAnswerId.push(answer.id);
          }
        });
        answers.push({
          questionId: +questionId,
          userAnswerId: userAnswerId,
        });
      });
      payload.answers = answers;
      console.log("final payload: ", payload);
      postSubmitQuiz({ ...payload });
    }
  };

  const handleCheckBox = (e, questionId, answerId) => {
    let dataQuizClone = _.cloneDeep(dataQuiz);
    let question = dataQuizClone.find((item) => +item.id === +questionId);

    if (question && question.answers) {
      let questionAfterCheck = question.answers.map((item, index) => {
        if (+item.id === +answerId) {
          item.isSelected = !item.isSelected;
        }
        return item;
      });

      question.answers = questionAfterCheck;
    }
    let index = dataQuizClone.findIndex((item) => +item.id === +questionId);
    if (index > -1) {
      dataQuizClone[index] = question;
      setDataQuiz(dataQuizClone);
    }
  };

  return (
    <div className="detail-quiz-container">
      <div className="left-content">
        <div className="title">
          Quiz {quizId} : {location?.state?.quizTitle}
        </div>
        <hr />
        <div className="q-body">{/* <img /> */}</div>
        <div className="q-content">
          <Question
            index={index}
            data={dataQuiz && dataQuiz.length > 0 ? dataQuiz[index] : []}
            handleCheckBox={handleCheckBox}
          />
        </div>
        <div className="footer ">
          <button className="btn btn-secondary" onClick={() => handlePrev()}>
            Prev
          </button>
          <button className="btn btn-primary" onClick={() => handleNext()}>
            Next
          </button>
          <button className="btn btn-warning" onClick={() => handleFinish()}>
            Finish
          </button>
        </div>
      </div>
      <div className="right-content">count down</div>
      <ModalResult
        show={showModalResult}
        setShow={setShowModalResult}
        dataModalResult={dataModalResult}
      />
    </div>
  );
};

export default DetailQuiz;
