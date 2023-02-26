import { useState } from "react";
import { useEffect } from "react";
import { useParams, useLocation, NavLink } from "react-router-dom";
import "./DetailQuiz.scss";
import Question from "./Question";
import NProgress from "nprogress";
import _ from "lodash";
import ModalResult from "./ModalResult";
import RightContent from "./Content/RightContent";
import { useTranslation, Trans } from "react-i18next";
import Breadcrumb from "react-bootstrap/Breadcrumb";
const questionApi = "http://localhost:4000/question";
const answerApi = "http://localhost:4000/answer";
const resultApi = "http://localhost:4000/result-answers";
const submitAnswerApi = "http://localhost:4000/submit-answers";
const quizApi = "http://localhost:4000/quiz";
const markApi = "http://localhost:4000/total-mark";
let listQuestion = [];
let listAnswer = [];
let name = "";

const DetailQuiz = (props) => {
  const params = useParams();
  const quizId = params.id;
  const location = useLocation();
  const [dataQuiz, setDataQuiz] = useState([]);
  const [dataAnswer, setDataAnswer] = useState([]);
  const [result, setResult] = useState([]);
  const [quizName, setQuizName] = useState("");
  const [isFinish, setIsFinish] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  // const [answer, setAnswer] = useState(listAnswer);
  const { t } = useTranslation();
  const [showModalResult, setShowModalResult] = useState(false);
  const [index, setIndex] = useState(0);
  const [dataModalResult, setDataModalResult] = useState({});
  let countCorrect = 0;
  useEffect(() => {
    const fetchQuestion = async () => {
      NProgress.start();
      const res = await fetch(questionApi);
      const data = await res.json();
      NProgress.done();
      setDataQuiz(data);
    };
    const fetchAnswer = async () => {
      NProgress.start();
      const res = await fetch(answerApi);
      const data = await res.json();
      NProgress.done();
      setDataAnswer(data);
      // setAnswer(listAnswer);
    };
    const fetchResult = async () => {
      NProgress.start();
      const res = await fetch(resultApi);
      const data = await res.json();
      NProgress.done();

      setResult(data);
    };
    const fetchQuiz = async (id) => {
      NProgress.start();
      const res = await fetch(quizApi);
      const data = await res.json();
      NProgress.done();

      let quiz = data.find((item) => {
        return +item.id === +id;
      });

      name = quiz.name;
      setQuizName(quiz.name);
    };
    fetchQuestion();
    fetchAnswer();
    fetchResult();
    fetchQuiz(quizId);
  }, [quizId]);

  let dataQuizClone = _.cloneDeep(dataQuiz);
  let dataAnswerClone = _.cloneDeep(dataAnswer);
  // console.log("dataQuiz: ", dataQuizClone);
  if (dataQuizClone && dataQuizClone.length > 0) {
    listQuestion = dataQuizClone.filter((question) => {
      return question.quiz_id === +quizId;
    });
  }

  if (dataAnswerClone && dataAnswerClone.length > 0) {
    listAnswer = dataAnswerClone.filter((answer) => {
      return answer.quiz_id === +quizId;
    });
  }
  let countQuestion = listQuestion.length;
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
      data.answers.forEach((answer) => {
        result.forEach((item) => {
          if (item.quizId === data.quizId) {
            for (let i = 0; i < item.answers.length; i++) {
              if (
                _.isEqual(answer.userAnswerId, item.answers[i].correctAnswer) &&
                answer.questionId === item.answers[i].questionId
              ) {
                countCorrect++;
              }
            }
          }
        });
      });

      setDataModalResult({
        countCorrect,
        countQuestion,
        countTotal: (countCorrect / listQuestion.length).toFixed(2) * 10,
      });
      setShowModalResult(true);
    }
  };
  const handleShowAnswer = () => {
    setShowAnswer(true);
    setShowModalResult(false);
  };

  const handlePrev = () => {
    if (index - 1 < 0) return;
    setIndex((prev) => prev - 1);
  };
  const handleNext = () => {
    if (listQuestion && listQuestion.length > index + 1) {
      setIndex((prev) => prev + 1);
    }
  };

  const postMark = async (
    quizId,
    userId,
    mark,
    totalQuestion,
    totalCorrect,
    quizName
  ) => {
    let dataMark = {
      quizId: quizId,
      quizName: quizName,
      userId,
      totalQuestion,
      totalCorrect,
      mark,
    };
    const options = {
      method: "POST",
      body: JSON.stringify(dataMark),
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    NProgress.start();
    const res = await fetch(markApi, options);
    const data = await res.json();
    NProgress.done();
    return data;
  };

  const handleFinish = async () => {
    let payload = {
      quizId: +quizId,
      userId: +localStorage.getItem("id"),
      answers: [],
    };
    let answers = [];
    if (
      listQuestion &&
      listQuestion.length > 0 &&
      dataAnswer &&
      dataAnswer.length > 0
    ) {
      listQuestion.forEach((question, index) => {
        let questionId = index + 1;
        let userAnswerId = [];

        let dataAnswerClone = _.cloneDeep(dataAnswer);
        let dataAnswerPerQuestion = dataAnswerClone.filter(
          (item) => item.question_id === questionId
        );
        dataAnswerPerQuestion.forEach((answer) => {
          if (answer.isSelected === true) {
            userAnswerId.push(answer.answer_id);
          }
        });
        answers.push({
          questionId: +questionId,
          userAnswerId: userAnswerId,
        });
      });
      payload.answers = answers;
      // console.log("final payload: ", payload);
      await postSubmitQuiz({ ...payload });

      await postMark(
        +quizId,
        +localStorage.getItem("id"),
        (countCorrect / listQuestion.length).toFixed(2) * 10,
        countQuestion,
        countCorrect,
        quizName
      );
      setIsFinish(true);
    }
  };
  // console.log("dataAnswers: ", dataAnswer);
  const handleCheckBox = (e, questionId, answerId) => {
    // let dataQuizClone = _.cloneDeep(dataQuiz);
    // let question = dataQuizClone.find((item) => +item.id === +questionId);
    // console.log("answerId:", answerId);
    let dataAnswer = _.cloneDeep(listAnswer);
    // console.log("dataAnswer: ", dataAnswer);
    if (listAnswer) {
      let questionAfterCheck = dataAnswer.map((item, index) => {
        if (+item.id === +answerId) {
          item.isSelected = !item.isSelected;
          // console.log("selected: ", item.isSelected);
        }
        return item;
      });

      listAnswer = questionAfterCheck;
    }
    // let index = dataQuizClone.findIndex((item) => +item.id === +questionId);
    if (index > -1) {
      // dataQuizClone[index] = question;
      setDataAnswer(listAnswer);
    }
  };

  return (
    <>
      <Breadcrumb className="quiz-detail-new-header">
        <NavLink to="/" className="breadcrumb-item">
          Home
        </NavLink>
        <NavLink to="/users" className="breadcrumb-item">
          Users
        </NavLink>
        <Breadcrumb.Item active>{t("quiz.doQuiz")}</Breadcrumb.Item>
      </Breadcrumb>
      <div className="detail-quiz-container">
        <div className="left-content">
          <div className="title">
            {t("detailQuiz.quiz")} {quizId} : {location?.state?.quizTitle}
          </div>
          <hr />
          <div className="q-body">{/* <img /> */}</div>
          <div className="q-content">
            <Question
              index={index}
              dataQuestion={
                listQuestion && listQuestion.length > 0
                  ? listQuestion[index]
                  : []
              }
              dataAnswer={
                dataAnswer && dataAnswer.length > 0
                  ? dataAnswer.filter(
                      (answer) =>
                        +answer.question_id === index + 1 &&
                        +answer.quiz_id === +quizId
                    )
                  : []
              }
              handleCheckBox={handleCheckBox}
              dataResult={result && result.length > 0 ? result : []}
              isFinish={isFinish}
              showAnswer={showAnswer}
              setShow={setShowModalResult}
            />
          </div>
          <div className="footer ">
            <button className="btn btn-secondary" onClick={() => handlePrev()}>
              {t("detailQuiz.prev")}
            </button>
            <button className="btn btn-primary" onClick={() => handleNext()}>
              {t("detailQuiz.next")}
            </button>
            <button
              className="btn btn-warning"
              onClick={() => handleFinish()}
              disabled={isFinish}
            >
              {t("detailQuiz.finish")}
            </button>
          </div>
        </div>
        <div className="right-content">
          <RightContent
            dataQuestion={
              listQuestion && listQuestion.length > 0 ? listQuestion : []
            }
            dataAnswer={
              dataAnswer && dataAnswer.length > 0
                ? dataAnswer.filter(
                    (answer) =>
                      +answer.question_id === index + 1 &&
                      +answer.quiz_id === +quizId
                  )
                : []
            }
            listAnswer={dataAnswer}
            handleFinish={handleFinish}
            index={index}
            setIndex={setIndex}
            isFinish={isFinish}
          />
        </div>

        <ModalResult
          show={showModalResult}
          setShow={setShowModalResult}
          dataModalResult={dataModalResult}
          quizId={quizId}
          quizName={name}
          isFinish={isFinish}
          handleShowAnswer={handleShowAnswer}
          showAnswer={showAnswer}
        />
      </div>
    </>
  );
};

export default DetailQuiz;
