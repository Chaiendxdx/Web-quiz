import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FcPlus } from "react-icons/fc";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
const participantApi = "http://localhost:4000/participant";

const ModalCreateUser = (props) => {
  const { show, setShow } = props;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [username, setUsername] = useState("");
  const { t } = useTranslation();
  const [role, setRole] = useState("USER");
  const [image, setImage] = useState("");
  const [previewImg, setPreviewImg] = useState("");
  const [dataUsers, setDataUsers] = useState([]);
  let dataUser = {
    email: email,
    password: password,
    username: username,
    role: role,
    userImage: image,
  };

  let isExistEmail = false;
  let isExistUsername = false;

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setUsername("");
    setRole("USER");
    setImage("");
    setPreviewImg("");
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
      setPreviewImg(URL.createObjectURL(e.target.files[0]));
      setImage(encodeImageFileAsURL(e.target));
    }
  };

  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };
  //check email

  const checkEmail = (data, email) => {
    const user = data.find((user) => user.email === email);
    if (user) {
      isExistEmail = true;
    }
  };

  //check username
  const checkUsername = (data, username) => {
    const user = data.find((user) => user.username === username);
    if (user) {
      isExistUsername = true;
    }
  };

  function createParticipant(data, callback) {
    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    fetch(participantApi, options)
      .then((response) => {
        if (response.status === 201) {
          toast.success(t("createUser.successCreate"));
        } else {
          toast.error(t("createUser.errorCreate"));
        }
        response.json();
      })
      .then(callback);
  }

  const handleSubmitCreateUser = () => {
    //valid email
    const isValidateEmail = validateEmail(email);
    if (!isValidateEmail) {
      toast.error(t("creatUser.errorEmail"));

      return;
    }
    // valid Password
    if (!password) {
      toast.error(t("creatUser.errorPassword"));
      return;
    }

    // check email
    fetch(participantApi)
      .then((response) => response.json())
      .then((data) => {
        checkEmail(data, email);
        checkUsername(data, username);
        if (isExistEmail) {
          toast.error(`Email ${email} t("createUser.exists")`);
          return;
        }

        if (isExistUsername) {
          toast.error(
            `t("createUser.username") ${username} t("createUser.exists")`
          );
          return;
        }
        createParticipant(dataUser, () => {
          setDataUsers((prev) => [...prev, dataUser]);
          handleClose();
          props.fetchDataUser();
        });
      });
    console.log(dataUser);
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
          <Modal.Title>{t("manageUser.add")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="row g-3">
            <div className="col-md-6">
              <label className="form-label">{t("tableUser.email")}</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">{t("createUser.password")}</label>
              <input
                type="password"
                className="form-control"
                value={password}
                autoComplete="on"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">{t("tableUser.username")}</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">{t("tableUser.role")}</label>
              <select
                className="form-select"
                onChange={(e) => setRole(e.target.value)}
              >
                <option default value="USER">
                  {t("createUser.user")}
                </option>
                <option value="ADMIN">{t("createUser.admin")}</option>
              </select>
            </div>

            <div className="col-md-12">
              <label className="form-label label-upload" htmlFor="labelUpload">
                <FcPlus />
                {t("createUser.uploadFile")}
              </label>
              <input
                type="file"
                hidden
                id="labelUpload"
                onChange={(e) => handleUpload(e)}
              />
            </div>

            <div className="col-md-12 img-preview">
              {previewImg ? (
                <img src={previewImg} alt="" />
              ) : (
                <span>{t("createUser.previewImage")}</span>
              )}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("button.close")}
          </Button>
          <Button variant="primary" onClick={() => handleSubmitCreateUser()}>
            {t("button.save")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalCreateUser;
