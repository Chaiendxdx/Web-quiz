import Countdown from "./Countdown";
import { useRef } from "react";

const RightContent = (props) => {
  const {
    dataQuestion,
    dataAnswer,
    listAnswer,
    handleFinish,
    index,
    setIndex,
    isFinish,
  } = props;
  const refDiv = useRef([]);

  const onTimeUp = () => {
    handleFinish();
  };
  const getClassQuestion = (question) => {
    if (
      listAnswer &&
      listAnswer.length &&
      listAnswer.some((item) => {
        return (
          question.quiz_id === item.quiz_id &&
          question.question_id === item.question_id &&
          item.isSelected === true
        );
      })
    ) {
      return "question selected";
    }
    return "question";
  };

  const handleClickQuestion = (question, index) => {
    setIndex(index);
    if (refDiv.current) {
      refDiv.current.forEach((item) => {
        if (item && item.className === "question clicked") {
          item.className = getClassQuestion(question);
        }
      });
    }

    refDiv.current[index].className = "question clicked";
  };
  return (
    <>
      <div className="main-timer">
        {isFinish ? <></> : <Countdown onTimeUp={onTimeUp} />}
      </div>

      <div className="main-question">
        {dataQuestion &&
          dataQuestion.length > 0 &&
          dataQuestion.map((item, index) => {
            return (
              <div
                className={getClassQuestion(item)}
                key={`question-${index + 1}`}
                onClick={() => handleClickQuestion(item, index)}
                ref={(element) => (refDiv.current[index] = element)}
              >
                {index + 1}
              </div>
            );
          })}
      </div>
    </>
  );
};

export default RightContent;
