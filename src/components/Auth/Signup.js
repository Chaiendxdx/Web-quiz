import { useRef, useState } from "react";
import "./Signup.scss";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import Language from "../Header/Language";

const participantApi = "http://localhost:4000/participant";
const Signup = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("USER");
  const [previewImg, setPreviewImg] = useState("");
  const [image, setImage] = useState("");
  const [dataUsers, setDataUsers] = useState([]);
  let isSuccessSignup = useRef(false);
  let isExistEmail = false;
  let isExistUsername = false;
  const navigate = useNavigate();
  let dataUser = {
    email,
    password,
    username,
    role: "USER",
    userImage: image,
  };

  const [isVisible, setIsVisible] = useState(false);
  const toggle = () => {
    setIsVisible(!isVisible);
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
          toast.success("A new user create is success!");
        } else {
          toast.error("Fail to sign in!");
        }
        response.json();
      })
      .then(callback);
  }

  useEffect(() => {
    if (isSuccessSignup.current) {
      console.log("success");
      navigate("../login");
    }
  }, [dataUsers, isSuccessSignup.current]);

  const handleSignup = () => {
    //valid email
    const isValidateEmail = validateEmail(email);
    if (!isValidateEmail) {
      toast.error("Invalid email");

      return;
    }
    // valid Password
    if (!password) {
      toast.error("Invalid password");
      return;
    }

    // check email
    fetch(participantApi)
      .then((response) => response.json())
      .then((data) => {
        checkEmail(data, email);
        checkUsername(data, username);
        if (isExistEmail) {
          toast.error(`Email ${email} is already exist!`);
          return;
        }

        if (isExistUsername) {
          toast.error(`Username ${username} is already exist!`);
          return;
        }
        createParticipant(dataUser, () => {
          setDataUsers((prev) => [...prev, dataUser]);
          isSuccessSignup.current = true;
        });
      });
  };

  const handleKeyDown = (e) => {
    if (e && e.key === "Enter") {
      handleSignup();
    }
  };
  return (
    <div className="login-container">
      <div className="header">
        <span>Already have an account?</span>
        <button
          className="btn btn-signup"
          onClick={() => {
            navigate("../login");
          }}
        >
          Log in
        </button>
        <Language />
      </div>

      <div className="title col-4 mx-auto">Quiz Web</div>

      <div className="welcome col-4 mx-auto">
        <span>Welcome to quiz web</span>
        <br /> Please create new account to login!
      </div>
      <div className="content-form col-4 mx-auto">
        <div className="form-group ">
          <label>Email</label>
          <input
            type={"email"}
            className={"form-control"}
            value={email}
            required
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>

        <div className="form-group ">
          <label>Password</label>
          <input
            type={!isVisible ? "password" : "text"}
            className={"form-control"}
            value={password}
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="icon" onClick={toggle}>
            {isVisible ? <VscEyeClosed /> : <VscEye />}
          </span>
        </div>

        <div className="form-group ">
          <label>Username</label>
          <input
            type={"text"}
            className={"form-control"}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            onKeyDown={(e) => handleKeyDown(e)}
          />
        </div>

        <div>
          <button className="btn btn-submit" onClick={handleSignup}>
            Sign up
          </button>
        </div>

        <div className="back text-center">
          <span
            onClick={() => {
              navigate("/");
            }}
          >
            &#60;&#60; Go to HomePage
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
