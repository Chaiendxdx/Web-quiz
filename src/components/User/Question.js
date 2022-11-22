import _ from "lodash";
const Question = (props) => {
  const { index, data, handleCheckBox } = props;
  if (_.isEmpty(data)) {
    return <></>;
  }

  return (
    <>
      {data.image ? (
        <div className="q-image">
          <img src={data.image} alt="question" />
        </div>
      ) : (
        <div className="q-image"></div>
      )}

      <div className="question">
        Question {index + 1}: {data.title} ?
      </div>
      <div className="answer">
        {data.answers &&
          data.answers.length &&
          data.answers.map((a, index) => {
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
                      handleCheckBox(e.target.checked, `${data.id}`, `${a.id}`)
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
