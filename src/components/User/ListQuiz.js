import { useState, useLayoutEffect } from "react";
import "./ListQuiz.scss";
import { useNavigate } from "react-router-dom";
import NProgress from "nprogress";
import { useTranslation, Trans } from "react-i18next";
const quizApi = "http://localhost:4000/quiz";
const quizAssignApi = "http://localhost:4000/quiz-assign-to-user";
const ListQuiz = (props) => {
  const navigate = useNavigate();
  const [arrQuiz, setArrayQuiz] = useState([]);
  const { t } = useTranslation();
  let idUser = localStorage.getItem("id");
  const getListQuiz = async () => {
    NProgress.start();
    const res = await fetch(quizApi);
    const data = await res.json();
    setArrayQuiz(data);

    NProgress.done();
    return data;
  };
  const fetchQuizAssign = async () => {
    NProgress.start();
    const res = await fetch(quizAssignApi);
    const data = await res.json();
    NProgress.done();
    return data;
  };
  useLayoutEffect(() => {
    const fetchData = async () => {
      let listQuiz = await getListQuiz();
      let quizAssign = await fetchQuizAssign();
      let listIdQuiz = [];
      let listQuizAssign = [];
      // console.log("list quiz", listQuiz);
      // console.log("quiz assign", quizAssign);
      quizAssign.forEach((item, index) => {
        if (+item.userId === +idUser) {
          listIdQuiz = [...listIdQuiz, item.quizId];
        }
      });
      // console.log("listIdQuiz: ", listIdQuiz);
      listQuiz.forEach((item, index) => {
        for (let i = 0; i < listIdQuiz.length; i++) {
          if (+item.id === +listIdQuiz[i]) {
            listQuizAssign = [...listQuizAssign, item];
          }
        }
      });
      // console.log("listQuizAssign: ", listQuizAssign);
      setArrayQuiz(listQuizAssign);
    };
    fetchData();
  }, []);
  return (
    <div className="list-quiz-container container">
      {arrQuiz &&
        arrQuiz.length > 0 &&
        arrQuiz.map((quiz, index) => {
          return (
            <div
              key={`${index}-quiz`}
              className="card"
              style={{ width: "18rem" }}
            >
              <img
                className="card-img-top img-thumbnail"
                src={quiz.quizImage}
                alt="Card cap"
              />
              <div className="card-body">
                <h5 className="card-title">{quiz.name}</h5>
                <p className="card-text">{quiz.description}</p>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    navigate(`/quiz/${quiz.id}`, {
                      state: { quizTitle: quiz.description },
                    })
                  }
                >
                  {t("detailQuiz.start")}
                </button>
              </div>
            </div>
          );
        })}
      {arrQuiz && arrQuiz.length === 0 && (
        <div> {t("detailQuiz.description")} </div>
      )}
    </div>
  );
};

export default ListQuiz;
