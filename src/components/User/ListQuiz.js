import { useState, useLayoutEffect } from "react";
import "./ListQuiz.scss";
import { useNavigate } from "react-router-dom";
import NProgress from "nprogress";
const quizApi = "http://localhost:4000/quiz-by-participant";
const ListQuiz = (props) => {
  const navigate = useNavigate();
  const [arrQuiz, setArrayQuiz] = useState([]);

  const getListQuiz = async () => {
    NProgress.start();
    const res = await fetch(quizApi);
    const data = await res.json();
    setArrayQuiz(data);

    NProgress.done();
  };
  useLayoutEffect(() => {
    getListQuiz();
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
                src={quiz.image}
                alt="Card cap"
              />
              <div className="card-body">
                <h5 className="card-title">Quiz {index + 1}</h5>
                <p className="card-text">{quiz.description}</p>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    navigate(`/quiz/${quiz.id}`, {
                      state: { quizTitle: quiz.description },
                    })
                  }
                >
                  Start Now!
                </button>
              </div>
            </div>
          );
        })}
      {arrQuiz && arrQuiz.length === 0 && (
        <div> You don't have any quiz now </div>
      )}
    </div>
  );
};

export default ListQuiz;
