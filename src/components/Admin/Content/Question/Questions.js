import { useEffect, useState } from "react";
import Select from "react-select";
import "./Questions.scss";
import { v4 as uuidv4 } from "uuid";
import { FiFilePlus } from "react-icons/fi";
import { FiFileMinus } from "react-icons/fi";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { RiImageAddFill } from "react-icons/ri";
import _ from "lodash";
import Lightbox from "react-awesome-lightbox";
import NProgress from "nprogress";
import { toast } from "react-toastify";
import { useRef } from "react";
const quizApi = "http://localhost:4000/quiz";
const questionApi = "http://localhost:4000/question";
const answerApi = "http://localhost:4000/answer";
const resultApi = "http://localhost:4000/result-answers";
// const questionApi = "http://localhost:4000/question-by-quiz";
let listQuestion = [];
const Questions = (props) => {
  const [selectedQuiz, setSelectedQuiz] = useState({});
  const [isValid, setIsValid] = useState();
  const [image, setImage] = useState("");

  let indexImage = useRef(0);
  const initialQuestion = [
    {
      id: uuidv4(),
      description: "",
      imageFile: "",
      imageName: "",
      image: "",
      isInValid: false,
      answers: [
        {
          id: uuidv4(),
          description: "",
          isCorrect: false,
          isInValid: false,
        },
      ],
    },
  ];
  const [questions, setQuestions] = useState(initialQuestion);

  const [isPreviewImage, setIsPreviewImage] = useState(false);
  const [dataImagePreview, setDataImagePreview] = useState({
    title: "",
    url: "",
  });

  const [listQuiz, setListQuiz] = useState();
  useEffect(() => {
    fetchQuiz();
  }, []);
  const fetchQuiz = async () => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    NProgress.start();
    const res = await fetch(quizApi, options);
    const data = await res.json();
    NProgress.done();
    if (res && res.status === 200) {
      let newQuiz = data.map((item) => {
        return {
          value: item.id,
          label: `${item.name} - ${item.description}`,
        };
      });
      setListQuiz(newQuiz);
    }
  };
  // console.log("image: ", image);
  useEffect(() => {
    let questionsClone = _.cloneDeep(questions);
    questionsClone[indexImage.current].image = image;
    setQuestions(questionsClone);
  }, [image]);

  const postCreateNewQuestionForQuiz = async (questionData) => {
    const options = {
      method: "POST",
      body: JSON.stringify(questionData),
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    NProgress.start();
    const res = await fetch(questionApi, options);
    const data = await res.json();
    NProgress.done();
    return data;
  };

  const postCreateNewAnswerForQuestion = async (answerData) => {
    const options = {
      method: "POST",
      body: JSON.stringify(answerData),
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    NProgress.start();
    const res = await fetch(answerApi, options);
    const data = await res.json();
    NProgress.done();
    return data;
    // if (res.status === 201) {
    //   toast.success("Create new account succeed!");
    // } else {
    //   toast.error("Fail to create account!");
    // }
  };

  const postResultQuiz = async (quizId, answers) => {
    let dataResult = {
      quizId,
      answers: answers,
    };

    console.log("check dataResult: ", dataResult);
    const options = {
      method: "POST",
      body: JSON.stringify(dataResult),
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    NProgress.start();
    const res = await fetch(resultApi, options);
    const data = await res.json();
    NProgress.done();
    return data;
  };

  const handleAddRemoveQuestion = (type, id) => {
    if (type === "ADD") {
      const newQuestion = {
        id: uuidv4(),
        description: "",
        imageFile: "",
        imageName: "",
        image: "",
        answers: [
          {
            id: uuidv4(),
            description: "",
            isCorrect: false,
          },
        ],
      };
      setQuestions([...questions, newQuestion]);
    }

    if (type === "REMOVE") {
      let questionsClone = _.cloneDeep(questions);
      questionsClone = questionsClone.filter((item) => item.id !== id);
      setQuestions(questionsClone);
    }
  };

  const handleAddRemoveAnswer = (type, questionId, answerId) => {
    let questionsClone = _.cloneDeep(questions);
    if (type === "ADD") {
      const newAnswer = {
        id: uuidv4(),
        description: "",
        isCorrect: false,
      };
      let index = questionsClone.findIndex((item) => item.id === questionId);
      if (index > -1) {
        questionsClone[index].answers.push(newAnswer);
        setQuestions(questionsClone);
      }
    }

    if (type === "REMOVE") {
      let index = questionsClone.findIndex((item) => item.id === questionId);
      if (index > -1) {
        questionsClone[index].answers = questionsClone[index].answers.filter(
          (item) => item.id !== answerId
        );
        setQuestions(questionsClone);
      }
    }
  };

  const handleOnChange = (type, questionId, value) => {
    if (type === "QUESTION") {
      let questionsClone = _.cloneDeep(questions);
      let index = questionsClone.findIndex((item) => item.id === questionId);
      if (index > -1) {
        questionsClone[index].description = value;
        setQuestions(questionsClone);
      }
    }
  };

  function encodeImageFileAsURL(element) {
    var file = element.files[0];
    var reader = new FileReader();

    reader.onloadend = function () {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  }

  const handleOnChangeFileQuestion = (questionId, event) => {
    let questionsClone = _.cloneDeep(questions);
    indexImage.current = questionsClone.findIndex(
      (item) => item.id === questionId
    );
    console.log(indexImage.current);
    if (
      indexImage.current > -1 &&
      event.target &&
      event.target.files &&
      event.target.files[0]
    ) {
      questionsClone[indexImage.current].image = image;

      questionsClone[indexImage.current].imageFile = event.target.files[0];
      questionsClone[indexImage.current].imageName = event.target.files[0].name;
      setImage(encodeImageFileAsURL(event.target));
      setQuestions(questionsClone);
    }
  };

  const handleAnswerQuestion = (type, answerId, questionId, value) => {
    let questionsClone = _.cloneDeep(questions);
    let index = questionsClone.findIndex((item) => item.id === questionId);
    if (index > -1) {
      questionsClone[index].answers = questionsClone[index].answers.map(
        (answer) => {
          if (answer.id === answerId) {
            if (type === "CHECKBOX") {
              answer.isCorrect = value;
            }
            if (type === "INPUT") {
              answer.description = value;
            }
          }
          return answer;
        }
      );

      setQuestions(questionsClone);
    }
  };
  // console.log("questions: ", questions);
  const handleSubmitQuestionForQuiz = async () => {
    //validate data
    if (_.isEmpty(selectedQuiz)) {
      toast.error("Please choose a Quiz!");
      return;
    }

    //validate question
    let isValidQuestion = true;
    let indexQ1 = 0;
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].description) {
        isValidQuestion = false;
        indexQ1 = i;
        questions[i].isInValid = true;
        break;
      }
    }

    if (isValidQuestion === false) {
      toast.error(`Not empty description for Question ${indexQ1 + 1}`);
      setQuestions(initialQuestion);
      return;
    }

    // validate answer
    let isValidAnswer = true;
    let indexQ = 0,
      indexA = 0;
    for (let i = 0; i < questions.length; i++) {
      for (let j = 0; j < questions[i].answers.length; j++) {
        if (!questions[i].answers[j].description) {
          isValidAnswer = false;
          indexA = j;
          questions[i].answers[j].isInValid = true;
          break;
        }
      }
      indexQ = i;
      if (isValidAnswer === false) break;
    }
    if (isValidAnswer === false) {
      toast.error(`Not empty Answer ${indexA + 1} at Question ${indexQ + 1}`);
      setQuestions(initialQuestion);
      return;
    }

    //submit question
    let answers = [];
    for (let i = 0; i < questions.length; i++) {
      let resultIdAnswer = [];
      let newQuestion = {
        quiz_id: +selectedQuiz.value,
        description: questions[i].description,
        questionImage: questions[i].image,
        questionImageName: questions[i].imageName,
        question_id: i + 1,
      };
      let q = await postCreateNewQuestionForQuiz(newQuestion);
      for (let j = 0; j < questions[i].answers.length; j++) {
        let newAnswer = {
          description: questions[i].answers[j].description,
          correct_answer: questions[i].answers[j].isCorrect,
          question_id: q.question_id,
          quiz_id: +selectedQuiz.value,
          answer_id: +(j + 1),
          isSelected: false,
        };
        let a = await postCreateNewAnswerForQuestion(newAnswer);
        if (questions[i].answers[j].isCorrect) {
          resultIdAnswer.push(j + 1);
        }
      }
      answers.push({
        questionId: q.question_id,
        correctAnswer: resultIdAnswer,
      });
    }
    let b = await postResultQuiz(+selectedQuiz.value, answers);

    toast.success("Create questions and answers succed!");
    setQuestions(initialQuestion);

    // post result
    // await postResultQuiz()
  };
  const handlePreviewImage = (questionId) => {
    let questionsClone = _.cloneDeep(questions);
    let index = questionsClone.findIndex((item) => item.id === questionId);
    if (index > -1) {
      setDataImagePreview({
        url: URL.createObjectURL(questionsClone[index].imageFile),
        title: questionsClone[index].imageName,
      });
      setIsPreviewImage(true);
    }
  };

  return (
    <>
      <div className="questions-container">
        <div className="title">Manage Questions</div>
        <hr />
        <div className="add-new-questions">
          <div className="col-6 form-group">
            <label className="mb-2">Select Quiz:</label>
            <Select
              value={selectedQuiz}
              onChange={setSelectedQuiz}
              options={listQuiz}
            />
          </div>

          <div className="mt-3 mb-2">Add questions:</div>
          {questions &&
            questions.length > 0 &&
            questions.map((question, index) => {
              return (
                <div key={question.id} className="q-main mb-4">
                  <div className="questions-content">
                    <div className="form-floating description ">
                      <input
                        type="type"
                        className={`form-control ${
                          question.isInValid ? "is-invalid" : ""
                        }`}
                        id="floatingInput"
                        placeholder="Description"
                        value={question.description}
                        onChange={(e) =>
                          handleOnChange(
                            "QUESTION",
                            question.id,
                            e.target.value
                          )
                        }
                      />
                      <label htmlFor="floatingInput">
                        Question {index + 1} 's description
                      </label>
                    </div>
                    <div className="group-upload">
                      <label htmlFor={`${question.id}`}>
                        <RiImageAddFill className="label-upload" />
                      </label>
                      <input
                        type="file"
                        id={`${question.id}`}
                        hidden
                        onChange={(e) => {
                          handleOnChangeFileQuestion(question.id, e);
                        }}
                      />

                      <span>
                        {question.imageName ? (
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() => handlePreviewImage(question.id)}
                          >
                            {question.imageName}
                          </span>
                        ) : (
                          "0 file is uploaded"
                        )}
                      </span>
                    </div>
                    <div className="btn-add">
                      <span onClick={() => handleAddRemoveQuestion("ADD", "")}>
                        <FiFilePlus className="icon-add" />
                      </span>
                      {questions.length > 1 && (
                        <span
                          onClick={() =>
                            handleAddRemoveQuestion("REMOVE", question.id)
                          }
                        >
                          <FiFileMinus className="icon-remove" />
                        </span>
                      )}
                    </div>
                  </div>

                  {question.answers &&
                    question.answers.length > 0 &&
                    question.answers.map((answer, index) => {
                      return (
                        <div className="answers-content" key={answer.id}>
                          <input
                            className="form-check-input isCorrrect"
                            type="checkbox"
                            name="flexRadioDefault"
                            checked={answer.isCorrect}
                            onChange={(e) =>
                              handleAnswerQuestion(
                                "CHECKBOX",
                                answer.id,
                                question.id,
                                e.target.checked
                              )
                            }
                            // id={`flexRadioDefault${index}`}
                          />
                          <div className="form-floating answer-name ">
                            <input
                              value={answer.description}
                              type="text"
                              className={`form-control ${
                                answer.isInValid ? "is-invalid" : ""
                              }`}
                              id="floatingInput"
                              placeholder="Description"
                              onChange={(e) =>
                                handleAnswerQuestion(
                                  "INPUT",
                                  answer.id,
                                  question.id,
                                  e.target.value
                                )
                              }
                            />
                            <label htmlFor="floatingInput">
                              Answer {index + 1}
                            </label>
                          </div>
                          <div className="btn-group">
                            <span
                              onClick={() =>
                                handleAddRemoveAnswer("ADD", question.id, "")
                              }
                            >
                              <AiOutlinePlusCircle className="icon-add" />
                            </span>
                            {question.answers.length > 1 && (
                              <span
                                onClick={() =>
                                  handleAddRemoveAnswer(
                                    "REMOVE",
                                    question.id,
                                    answer.id
                                  )
                                }
                              >
                                <AiOutlineMinusCircle className="icon-remove" />
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              );
            })}
          {questions && questions.length > 0 && (
            <div>
              <button
                className="btn btn-warning"
                onClick={() => handleSubmitQuestionForQuiz()}
              >
                Save Questions
              </button>
            </div>
          )}

          {isPreviewImage === true && (
            <Lightbox
              image={dataImagePreview.url}
              title={dataImagePreview.title}
              onClose={() => setIsPreviewImage(false)}
            ></Lightbox>
          )}
        </div>
      </div>
    </>
  );
};

export default Questions;
