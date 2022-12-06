import { useEffect, useState, useRef } from "react";
import Select from "react-select";
import "./QuizQA.scss";
import { v4 as uuidv4 } from "uuid";
import { FiFilePlus } from "react-icons/fi";
import { FiFileMinus } from "react-icons/fi";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { RiImageAddFill } from "react-icons/ri";
import _ from "lodash";
import Lightbox from "react-awesome-lightbox";
import NProgress from "nprogress";
import { toast } from "react-toastify";
const quizApi = "http://localhost:4000/quiz";
const questionApi = "http://localhost:4000/question";
const answerApi = "http://localhost:4000/answer";
// const questionApi = "http://localhost:4000/question-by-quiz";
const resultApi = "http://localhost:4000/result-answers";
const quizWithQAApi = "http://localhost:4000/quiz-assign-to-user";
let questionData = [];
let answerData = [];
const QuizQA = (props) => {
  const [selectedQuiz, setSelectedQuiz] = useState({});
  const [isValid, setIsValid] = useState();
  const [image, setImage] = useState("");
  const [result, setResult] = useState([]);
  // const [dataWithQA, setDataWithQA] = useState({});
  const indexImage = useRef(0);
  const initialQuestion = [
    {
      id: uuidv4(),
      description: "",
      imageFile: "",
      imageName: "",
      image: image,
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
  // console.log("Check selected quiz: ", selectedQuiz);
  useEffect(() => {
    let questionsClone = _.cloneDeep(questions);
    questionsClone[indexImage.current].image = image;
    setQuestions(questionsClone);
    fetchQuiz();
  }, [image]);
  useEffect(() => {
    const fetchData = async () => {
      if (selectedQuiz && selectedQuiz.value) {
        await fetchQuizWithQA();
        let r = await fetchResult();
        setResult(r);
      }
    };
    fetchData();
  }, [selectedQuiz]);
  console.log("result: ", result);
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
  const fetchResult = async () => {
    const options = {
      method: "GET",
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

  const getQuestion = async (quizId) => {
    NProgress.start();
    const res = await fetch(questionApi);
    const data = await res.json();
    NProgress.done();
    return data.filter((question) => question.quiz_id === quizId);
  };

  const getAnswer = async (quizId) => {
    NProgress.start();
    const res = await fetch(answerApi);
    const data = await res.json();
    NProgress.done();
    return data.filter((answer) => answer.quiz_id === quizId);
  };

  const postUpsertQ = async (dataQ) => {
    const options = {
      method: "POST",
      body: JSON.stringify(dataQ),
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

  const postUpsertA = async (dataA) => {
    const options = {
      method: "POST",
      body: JSON.stringify(dataA),
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    NProgress.start();
    const res = await fetch(answerApi, options);
    const data = await res.json();
    NProgress.done();
  };

  const deleteQinQuiz = async (id) => {
    const options = {
      method: "Delete",
      // body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    const res = await fetch(questionApi + "/" + id, options);
  };
  const deleteAinQuiz = async (id) => {
    const options = {
      method: "Delete",
      // body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    const res = await fetch(answerApi + "/" + id, options);
  };

  const deleteResultExist = async (id) => {
    const options = {
      method: "Delete",
      // body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    const res = await fetch(resultApi + "/" + id, options);
  };
  // encode base64 to file
  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  const fetchQuizWithQA = async () => {
    questionData = await getQuestion(selectedQuiz.value);
    answerData = await getAnswer(selectedQuiz.value);

    let questionsClone = [
      {
        id: uuidv4(),
        question_id: "",
        description: "",
        imageFile: "",
        imageName: "",
        image: image,
        isInValid: false,
        answers: [],
      },
    ];

    questionData.forEach((question, idQuestion) => {
      let newQuestion = {
        id: uuidv4(),
        question_id: "",
        description: "",
        imageFile: "",
        imageName: "",
        image: question.questionImage ? image : "",
        isInValid: false,
        answers: [],
      };
      questionsClone[idQuestion].description = question.description;
      questionsClone[idQuestion].question_id = question.question_id;
      if (question.questionImage) {
        questionsClone[idQuestion].imageFile = dataURLtoFile(
          question.questionImage,
          question.questionImageName
        );
        questionsClone[idQuestion].imageName = question.questionImageName;
      }
      answerData.forEach((answer, idAnswer) => {
        let newAnswer = {
          id: uuidv4(),
          description: "",
          isCorrect: false,
          isInValid: false,
        };

        if (+questionsClone[idQuestion].question_id === +answer.question_id) {
          questionsClone[idQuestion].answers = [
            ...questionsClone[idQuestion].answers,
            newAnswer,
          ];

          newAnswer.description = answer.description;
          newAnswer.isCorrect = answer.correct_answer;
        }
      });
      if (idQuestion < questionData.length - 1) {
        questionsClone = [...questionsClone, newQuestion];
      }
    });

    setQuestions(questionsClone);
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
  console.log("questions: ", questions);
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
    let resultClone = _.cloneDeep(result);
    let answers = [];

    for (let i = 0; i < questionData.length; i++) {
      if (questionData[i].quiz_id === +selectedQuiz.value) {
        await deleteQinQuiz(questionData[i].id);
      }
    }
    for (let i = 0; i < answerData.length; i++) {
      if (answerData[i].quiz_id === +selectedQuiz.value) {
        await deleteAinQuiz(answerData[i].id);
      }
    }

    if (result && result.length > 0) {
      for (let i = 0; i < resultClone.length; i++) {
        if (resultClone[i].quizId === +selectedQuiz.value) {
          await deleteResultExist(resultClone[i].id);
        }
      }
    }

    for (let i = 0; i < questions.length; i++) {
      let resultIdAnswer = [];
      let newQuestion = {
        quiz_id: +selectedQuiz.value,
        description: questions[i].description,
        questionImage: questions[i].image,
        questionImageName: questions[i].imageName,
        question_id: i + 1,
      };

      let q = await postUpsertQ(newQuestion);
      for (let j = 0; j < questions[i].answers.length; j++) {
        let newAnswer = {
          description: questions[i].answers[j].description,
          correct_answer: questions[i].answers[j].isCorrect,
          question_id: q.question_id,
          quiz_id: +selectedQuiz.value,
          answer_id: +(j + 1),
          isSelected: false,
        };
        if (questions[i].answers[j].isCorrect) {
          resultIdAnswer.push(j + 1);
        }
        let a = await postUpsertA(newAnswer);
      }
      answers.push({
        questionId: q.question_id,
        correctAnswer: resultIdAnswer,
      });
    }
    let b = await postResultQuiz(+selectedQuiz.value, answers);
    toast.success("Update questions and answers succed!");
    setQuestions(initialQuestion);
    setSelectedQuiz({});
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
                        onChange={(e) =>
                          handleOnChangeFileQuestion(question.id, e)
                        }
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

export default QuizQA;
