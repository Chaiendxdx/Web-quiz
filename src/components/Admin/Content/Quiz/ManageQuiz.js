import "./ManageQuiz.scss";
import Select from "react-select";
import { useState, useCallback, useEffect } from "react";
import NProgress from "nprogress";
import { toast } from "react-toastify";
import TableQuiz from "./TableQuiz";
import Accordion from "react-bootstrap/Accordion";
import AccordionBody from "react-bootstrap/esm/AccordionBody";
import ModalDeleteQuiz from "./ModalDeleteQuiz";
import ModalEditQuiz from "./ModalEditQuiz";
const quizApi = "http://localhost:4000/quiz";
let dataQuiz = [];
const ManageQuiz = (props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [image, setImage] = useState("");
  const [showModalEditQuiz, setShowModalEditQuiz] = useState(false);

  const [dataUpdateQuiz, setDataUpdateQuiz] = useState({});
  const [showModalDeleteQuiz, setShowModalDeleteQuiz] = useState(false);
  const [listQuiz, setListQuiz] = useState(dataQuiz);
  const [idQuiz, setIdQuiz] = useState();
  const [deleteQuiz, setDeleteQuiz] = useState({});
  let numberQuiz = dataQuiz.length;
  const fetchDataQuiz = () => {
    fetch(quizApi)
      .then((response) => response.json())
      .then((data) => {
        dataQuiz = [...data];
        setListQuiz(dataQuiz);
        console.log("dataQuiz:", dataQuiz);
      });
  };

  useEffect(() => {
    fetchDataQuiz();
  }, [numberQuiz]);
  const options = [
    {
      value: "EASY",
      label: "EASY",
    },
    {
      value: "MEDIUM",
      label: "MEDIUM",
    },
    {
      value: "HARD",
      label: "HARD",
    },
  ];

  const handleClickBtnEdit = useCallback((quizUpdate) => {
    setShowModalEditQuiz(true);
    setDataUpdateQuiz(quizUpdate);
    setIdQuiz(quizUpdate.id);
    console.log("id: ", quizUpdate.id);
    console.log("quizUpdate: ", quizUpdate);
  }, []);

  const handleDeleteQuiz = useCallback((quiz) => {
    setShowModalDeleteQuiz(true);
    setDeleteQuiz(quiz);
  }, []);
  const postCreateNewQuiz = async (name, description, difficulty, image) => {
    const dataNewQuiz = {
      name,
      description,
      difficulty,
      quizImage: image,
    };
    if (!name || !description) {
      toast.error("Name/Description is required");
      return;
    }
    if (!difficulty) {
      toast.error("Please select the difficulty!");
      return;
    }

    const options = {
      method: "POST",
      body: JSON.stringify(dataNewQuiz),
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    NProgress.start();
    const res = await fetch(quizApi, options);
    const data = await res.json();
    if (data && res.status === 201) {
      toast.success("Create new quiz success!");
      setName("");
      setDescription("");
      setType("");
      setImage("");
    } else {
      toast.error("Fail to create new quiz");
    }
    NProgress.done();
    console.log("data: ", data);
    return data;
  };
  function encodeImageFileAsURL(element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  }
  const handleChangeFile = (e) => {
    if (e.target && e.target.files && e.target.files[0]) {
      setImage(encodeImageFileAsURL(e.target));
    }
  };

  const handleSubmitQuiz = async () => {
    let dataNewQuiz = await postCreateNewQuiz(
      name,
      description,
      type?.value,
      image
    );

    setListQuiz((prev) => [...prev, dataNewQuiz]);
  };

  return (
    <div className="quiz-container">
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <div className="title">Manage Quiz</div>
          </Accordion.Header>
          <AccordionBody>
            <div className="add-new">
              <fieldset className="border rounder-3 p-3">
                <legend className="float-none w-auto px-3">
                  Add new Quiz:
                </legend>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Your quiz name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <label htmlFor="floatingInput">Name</label>
                </div>
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <label htmlFor="floatingPassword">Description</label>
                </div>
                <div className="my-3">
                  <Select
                    value={type}
                    options={options}
                    placeholder="Quiz type..."
                    defaultValue={type}
                    onChange={setType}
                  />
                </div>
                <div className="more-actions form-group">
                  <label className="mb-1">Upload Image</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => handleChangeFile(e)}
                  />
                </div>

                <div className="mt-3">
                  <button
                    className="btn btn-warning"
                    onClick={() => handleSubmitQuiz()}
                  >
                    Save
                  </button>
                </div>
              </fieldset>
            </div>
          </AccordionBody>
        </Accordion.Item>
      </Accordion>

      <div className="list-detail">
        <TableQuiz
          listQuiz={listQuiz}
          quizPerPage={+5}
          handleClickBtnEdit={handleClickBtnEdit}
          handleDeleteQuiz={handleDeleteQuiz}
        />
      </div>
      <ModalEditQuiz
        show={showModalEditQuiz}
        setShow={setShowModalEditQuiz}
        dataUpdateQuiz={dataUpdateQuiz}
        idUpdateQuiz={idQuiz}
        fetchDataQuiz={fetchDataQuiz}
      />
      <ModalDeleteQuiz
        show={showModalDeleteQuiz}
        setShow={setShowModalDeleteQuiz}
        deleteQuiz={deleteQuiz}
        listQuiz={listQuiz}
        setListQuiz={setListQuiz}
      />
    </div>
  );
};
export default ManageQuiz;
