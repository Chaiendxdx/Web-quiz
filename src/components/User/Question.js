import _ from "lodash";
import { useEffect, useState } from "react";
const Question = (props) => {
  const { index, dataQuestion, dataAnswer, handleCheckBox } = props;
  const [image, setImage] = useState("");
  console.log("check dataAnswer: ", dataAnswer);
  console.log("check dataQuestion: ", dataQuestion);
  // console.log("image: ", image);
  // useEffect(() => {
  //   handleSetImage();
  // }, [dataQuestion, dataAnswer]);

  // const handleSetImage = async () => {
  //   await dataQuestion;
  //   await dataAnswer;
  //   console.log(1);
  //   setImage(encodeImageFileAsURL(dataQuestion.questionImage));
  // };

  if (_.isEmpty(dataQuestion) && _.isEmpty(dataAnswer)) {
    return <></>;
  }
  // function encodeImageFileAsURL(element) {
  //   var file = element.files[0];
  //   var reader = new FileReader();
  //   reader.onloadend = function () {
  //     setImage(reader.result);
  //   };
  //   reader.readAsDataURL(file);
  // }
  // setImage("");

  return (
    <>
      {dataQuestion.questionImage ? (
        <div className="q-image">
          <img src={dataQuestion.questionImage} alt="question" />
        </div>
      ) : (
        <div className="q-image"></div>
      )}
      <div className="question">
        Question {index + 1}: {dataQuestion.description} ?
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
