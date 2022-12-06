import _ from "lodash";
import { useEffect, useState } from "react";
import Lightbox from "react-awesome-lightbox";
import { useTranslation, Trans } from "react-i18next";
const Question = (props) => {
  const { index, dataQuestion, dataAnswer, handleCheckBox } = props;
  const [image, setImage] = useState("");
  const [isPreviewImage, setIsPreviewImage] = useState(false);
  const { t } = useTranslation();

  // console.log("check dataAnswer: ", dataAnswer);
  // console.log("check dataQuestion: ", dataQuestion);

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
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Question;
