import { useRef, useState } from "react";
import "./Login.scss";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLayoutEffect } from "react";
import { useEffect } from "react";
const loginApi = "http://localhost:3000/login";
const participantApi = "http://localhost:3000/participant";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dataUsers, setDataUsers] = useState([]);
  let isSuccedLogin = useRef(false);
  let data = {
    email: email,
    password: password,
  };

  useEffect(() => {
    fetch(participantApi)
      .then((response) => response.json())
      .then((data) => setDataUsers(data, ...dataUsers));
    console.log("listUser after fetch: ", dataUsers);
  }, []);
  const navigate = useNavigate();
  const postLoginData = (loginData, callback) => {
    const options = {
      method: "POST",
      body: JSON.stringify(loginData),
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    fetch(loginApi, options)
      .then((response) => {
        response.json();
      })
      .then(callback);
  };

  const deleteLoginData = (callback) => {
    const options = {
      method: "Delete",
      // body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    fetch(loginApi + "/1", options)
      .then((response) => {
        response.json();
      })
      .then(callback);
  };
  const handleLogin = () => {
    console.log("listUsers after login: ", dataUsers);
    isSuccedLogin = dataUsers.some((user) => {
      return user.email === data.email && user.password === data.password;
    });
    console.log(isSuccedLogin);
    if (isSuccedLogin) {
      postLoginData(data, () => {
        navigate("/");
        toast.success("Login is success!");
        deleteLoginData(() => {});
      });
    } else {
      toast.error("Email or password is incorrect!");
    }
  };

  return (
    <div className="login-container">
      <div className="header">
        <span>Don't have an account yet?</span>
        <button
          className="btn btn-signup"
          onClick={() => {
            navigate("../signup");
          }}
        >
          Sign up
        </button>
      </div>

      <div className="title col-4 mx-auto">Quiz Web</div>

      <div className="welcome col-4 mx-auto">Hello, who's this?</div>
      <div className="content-form col-4 mx-auto">
        <div className="form-group ">
          <label>Email</label>
          <input
            type={"email"}
            className={"form-control"}
            value={email}
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
          />
        </div>
        <a href="/" className="forget-password">
          Forgot password?
        </a>
        <div>
          <button className="btn btn-submit" onClick={() => handleLogin()}>
            Login to quiz web
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

export default Login;
