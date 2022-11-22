import React, { useState } from "react";
import { useEffect, memo } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FcPlus } from "react-icons/fc";
import { toast } from "react-toastify";
import _ from "lodash";
import NProgress from "nprogress";

const quizApi = "http://localhost:4000/quiz";

const ModalEditQuiz = (props) => {
  const { show, setShow, dataUpdateQuiz, idUpdateQuiz } = props;
  // const [password, setPassword] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [type, setType] = useState("EASY");
  const [image, setImage] = useState("");

  const [dataQuiz, setDataQuiz] = useState([]);
  let dataUpdate = {
    name,
    description,
    difficulty: type,
    quizImage: image,
  };
  useEffect(() => {
    if (!_.isEmpty(dataUpdateQuiz)) {
      setName(dataUpdateQuiz.name);
      setDescription(dataUpdateQuiz.description);
      setType(dataUpdateQuiz.difficulty);
      setImage(dataUpdateQuiz.quizImage);
    }
  }, [dataUpdateQuiz]);

  const handleClose = () => {
    setShow(false);
  };

  function encodeImageFileAsURL(element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  }

  const handleUpload = (e) => {
    if (e.target && e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      encodeImageFileAsURL(e.target);
    }
  };

  const updateQuiz = async (dataQuiz, id, callback) => {
    const options = {
      method: "PATCH",
      body: JSON.stringify(dataQuiz),
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    NProgress.start();
    const res = await fetch(quizApi + "/" + id, options);

    if (res && res.status === 200) {
      toast.success("Update quiz succeed!");
    } else {
      toast.error("Fail to update quiz!");
    }
    const data = await res.json();
    console.log("data: ", data);
    NProgress.done();
    callback();
  };
  const handleSubmitUpdateQuiz = () => {
    updateQuiz(dataUpdate, idUpdateQuiz, () => {
      setDataQuiz((prev) => [...prev, dataUpdate]);
      handleClose();
      props.fetchDataQuiz();
    });
  };

  return (
    <>
      {/* <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button> */}

      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        backdrop="static"
        className="modal-add-user"
      >
        <Modal.Header closeButton>
          <Modal.Title>Update a quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Description</label>
              <input
                type="text"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Difficulty</label>
              <select
                className="form-select"
                onChange={(e) => setType(e.target.value)}
                value={type}
              >
                <option value="EASY">EASY</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HARD">HARD</option>
              </select>
            </div>

            <div className="col-md-12">
              <label className="form-label label-upload" htmlFor="labelUpload">
                <FcPlus />
                Upload File Image
              </label>
              <input
                type="file"
                hidden
                id="labelUpload"
                onChange={(e) => handleUpload(e)}
              />
            </div>

            <div className="col-md-12 img-preview">
              {image ? <img src={image} alt="" /> : <span>Preview Image</span>}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleSubmitUpdateQuiz()}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default memo(ModalEditQuiz);
