import { useRef, useState } from "react";
import "./Signup.scss";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";

const participantApi = "http://localhost:3000/participant";
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
    role,
    userImage: image,
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
          toast.success("Sign in is success!");
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
            type={"password"}
            className={"form-control"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group ">
          <label>Username</label>
          <input
            type={"text"}
            className={"form-control"}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group ">
          <label>Role</label>
          <select
            className="form-select"
            onChange={(e) => setRole(e.target.value)}
          >
            <option default value="USER">
              USER
            </option>
            <option value="ADMIN">ADMIN</option>
          </select>
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
