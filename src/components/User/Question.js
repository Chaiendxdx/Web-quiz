import _ from "lodash";
import { useEffect, useState } from "react";
import Lightbox from "react-awesome-lightbox";
import { useTranslation, Trans } from "react-i18next";
import { IoIosClose, IoIosCheckmark } from "react-icons/io";
const Question = (props) => {
  const {
    index,
    dataQuestion,
    dataAnswer,
    handleCheckBox,
    dataResult,
    isFinish,
    showAnswer,
    setShow,
  } = props;

  const [image, setImage] = useState("");
  const [isPreviewImage, setIsPreviewImage] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    setShow(showAnswer);
  }, []);
  let dataAnswerClone = _.cloneDeep(dataAnswer);
  // let result = dataResult[0].answers;
  console.log("check dataAnswer: ", dataAnswer);
  // console.log("check dataQuestion: ", dataQuestion);
  console.log("dataResult: ", dataResult);

  if (_.isEmpty(dataQuestion) && _.isEmpty(dataAnswer)) {
    return <></>;
  }

  return (
    <>
      {dataQuestion.questionImage ? (
        <div className="q-image">
          <img
            style={{ cursor: "pointer" }}
            src={dataQuestion.questionImage}
            alt="question"
            onClick={() => setIsPreviewImage(true)}
          />
          {isPreviewImage === true && (
            <Lightbox
              image={dataQuestion.questionImage}
              title={dataQuestion.questionImageName}
              onClose={() => setIsPreviewImage(false)}
            ></Lightbox>
          )}
        </div>
      ) : (
        <div className="q-image"></div>
      )}
      <div className="question">
        {t("detailQuiz.question")} {index + 1}: {dataQuestion.description}
      </div>
      <div className="answer">
        {dataAnswer &&
          dataAnswer.length &&
          dataAnswer.map((a, index) => {
            return (
              <div key={`answer-${index}`} className="answer-content">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    disabled={showAnswer}
                    name="flexRadioDefault"
                    checked={a.isSelected}
                    id={`flexRadioDefault${index}`}
                    onChange={(e) =>
                      handleCheckBox(
                        e.target.checked,
                        `${dataAnswer.question_id}`,
                        `${a.id}`
                      )
                    }
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`flexRadioDefault${index}`}
                  >
                    {a.description}
                  </label>
                  {showAnswer === true && (
                    <>
                      {a.isSelected === true && a.correct_answer === false && (
                        <IoIosClose className="incorrect" />
                      )}
                      {a.correct_answer === true && (
                        <IoIosCheckmark className="correct" />
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Question;
