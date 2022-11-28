import { useState } from "react";
import { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./DetailQuiz.scss";
import Question from "./Question";
import NProgress from "nprogress";
import _ from "lodash";
import ModalResult from "./ModalResult";
const questionApi = "http://localhost:4000/question";
const answerApi = "http://localhost:4000/answer";
const submitAnswerApi = "http://localhost:4000/submit-answers";
let listQuestion = [];
let listAnswer = [];
const DetailQuiz = (props) => {
  const params = useParams();
  const quizId = params.id;
  const location = useLocation();
  const [dataQuiz, setDataQuiz] = useState([]);
  const [dataAnswer, setDataAnswer] = useState([]);
  // const [answer, setAnswer] = useState(listAnswer);
  const [showModalResult, setShowModalResult] = useState(false);
  const [index, setIndex] = useState(0);
  const [dataModalResult, setDataModalResult] = useState({});
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
    fetchQuestion();
    fetchAnswer();
  }, [quizId]);

  let dataQuizClone = _.cloneDeep(dataQuiz);
  let dataAnswerClone = _.cloneDeep(dataAnswer);
  console.log("dataQuiz: ", dataQuizClone);
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

  console.log("data Answer: ", dataAnswer);
  console.log("index", index);
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
    if (listQuestion && listQuestion.length > index + 1) {
      setIndex((prev) => prev + 1);
    }
  };

  const handleFinish = () => {
    let payload = {
      quizId: +quizId,
      answers: [],
    };
    let answers = [];
    if (
      dataQuiz &&
      dataQuiz.length > 0 &&
      dataAnswer &&
      dataAnswer.length > 0
    ) {
      dataQuiz.forEach((question) => {
        let questionId = question.id;
        let userAnswerId = [];

        dataAnswer.forEach((answer) => {
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
    // let dataQuizClone = _.cloneDeep(dataQuiz);
    // let question = dataQuizClone.find((item) => +item.id === +questionId);
    // console.log("answerId:", answerId);
    let dataAnswer = _.cloneDeep(listAnswer);
    // console.log("dataAnswer: ", dataAnswer);
    if (listAnswer) {
      let questionAfterCheck = dataAnswer.map((item, index) => {
        if (+item.id === +answerId) {
          item.isSelected = !item.isSelected;
          console.log("selected: ", item.isSelected);
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
  console.log("list Questions: ", listQuestion);
  console.log("quizId: ", quizId);
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
            dataQuestion={
              listQuestion && listQuestion.length > 0 ? listQuestion[index] : []
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
