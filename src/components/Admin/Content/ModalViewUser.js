import React, { useState } from "react";
import { useEffect, memo } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FcPlus } from "react-icons/fc";
import _ from "lodash";
import { useTranslation } from "react-i18next";
const participantApi = "http://localhost:4000/participant";

const ModalViewUser = (props) => {
  const { show, setShow, dataUser, idUser, fetchDataUser } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [username, setUsername] = useState("");
  const { t } = useTranslation();
  const [role, setRole] = useState("USER");
  const [image, setImage] = useState("");
  const [previewImg, setPreviewImg] = useState("");
  const [dataUsers, setDataUsers] = useState({});

  // let dataUser = {
  //   email: email,
  //   password: password,
  //   username: username,
  //   role: role,
  //   userImage: image,
  // };

  useEffect(() => {
    if (!_.isEmpty(dataUser) && idUser !== undefined) {
      viewParticipant(idUser);
      setEmail(dataUser.email);
      setUsername(dataUser.username);
      setRole(dataUser.role);
      setPreviewImg(dataUser.userImage);
    }
  }, [dataUser]);

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
      setPreviewImg(URL.createObjectURL(e.target.files[0]));
      encodeImageFileAsURL(e.target);
    }
  };

  function viewParticipant(id) {
    const options = {
      method: "GET",
      // headers: {
      //   "Content-Type": "application/json",
      //   // 'Content-Type': 'application/x-www-form-urlencoded',
      // },
    };
    fetch(participantApi + "/" + id, options)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setDataUsers(data);
      });
  }

  // // function viewParticipant() {
  // //   fetch(participantApi)
  // //     .then((response) => response.json())
  // //     .then((data) => {
  // //       dataUsers = [...data];
  // //       console.log(dataUsers);
  // //     });
  // }

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
          <Modal.Title>{t("manageUser.view")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="row g-3">
            <div className="col-md-6">
              <label className="form-label">{t("tableUser.email")}</label>
              <input
                type="email"
                className="form-control"
                disabled
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">{t("createUser.password")}</label>
              <input
                type="password"
                className="form-control"
                disabled
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
                disabled
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">{t("tableUser.role")}</label>
              <select
                className="form-select"
                onChange={(e) => setRole(e.target.value)}
                disabled
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
                disabled
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
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default memo(ModalViewUser);
