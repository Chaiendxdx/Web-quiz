import { useState, useEffect } from "react";

import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { toast } from "react-toastify";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import NProgress from "nprogress";
import Button from "react-bootstrap/Button";
const participantApi = "http://localhost:4000/participant";
const Password = (props) => {
  const { account } = props;
  const [currentPassword, setCurrentPassword] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const navigate = useNavigate();
  const fetchParticipant = async (id) => {
    NProgress.start();
    const res = await fetch(participantApi + "/" + id);
    const data = await res.json();
    NProgress.done();
    return data;
  };

  useEffect(() => {
    const getPassword = async () => {
      let dataParticipant = await fetchParticipant(account.id);
      setCurrentPassword(dataParticipant.password);
    };
    getPassword();
  }, []);

  const toggle = () => {
    setIsVisible(!isVisible);
  };
  const updatePassword = async (password, id) => {
    const options = {
      method: "PATCH",
      body: JSON.stringify(password),
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    NProgress.start();
    const res = await fetch(participantApi + "/" + id, options);
    const data = await res.json();
    console.log(data);
    NProgress.done();
    // setDataUsers(data);
    // dataUsers = { ...data };
    if (res.status === 200) {
      toast.success("Update password succeed! Please log in again");
    } else {
      toast.error("Fail to password account!");
    }
  };
  const handleUpdatePassword = async () => {
    if (passwordInput !== currentPassword) {
      toast.error("Password is incorrect. Please try again!");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Password is not match. Please try again!");
      return;
    }
    await updatePassword({ password: newPassword }, account.id);
    navigate("/login");
  };
  return (
    <>
      <form className="row g-3 my-3">
        <div className="col-md-6 password">
          <label className="form-label">Current Pasword</label>
          <input
            type={!isVisible ? "password" : "text"}
            className="form-control"
            name="password"
            onChange={(e) => {
              setPasswordInput(e.target.value);
            }}
          />
          <span className="icon" onClick={toggle}>
            {isVisible ? <VscEyeClosed /> : <VscEye />}
          </span>
        </div>

        <div className="col-md-6 password">
          <label className="form-label">New Pasword</label>
          <input
            type={!isVisible ? "password" : "text"}
            className="form-control"
            name="password"
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
          />
          <span className="icon" onClick={toggle}>
            {isVisible ? <VscEyeClosed /> : <VscEye />}
          </span>
        </div>
        <div className="col-md-6 password">
          <label className="form-label">Confirm Pasword</label>
          <input
            type={!isVisible ? "password" : "text"}
            className="form-control"
            name="password"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
          <span className="icon" onClick={toggle}>
            {isVisible ? <VscEyeClosed /> : <VscEye />}
          </span>
        </div>
      </form>
      <Button variant="warning" onClick={() => handleUpdatePassword()}>
        Update
      </Button>
    </>
  );
};

export default Password;
