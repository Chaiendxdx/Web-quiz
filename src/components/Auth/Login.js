import { useRef, useState } from "react";
import "./Login.scss";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLayoutEffect } from "react";
import { useEffect } from "react";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { useDispatch } from "react-redux";
import { doLogin } from "../../redux/action/userAction";
import { ImSpinner9 } from "react-icons/im";
import { useTranslation } from "react-i18next";
import NProgress from "nprogress";
import Language from "../Header/Language";
const loginApi = "http://localhost:4000/login";
const participantApi = "http://localhost:4000/participant";
let dataLogin = [];
const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dataUsers, setDataUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  let isSuccedLogin = useRef(false);
  let data = {
    email: email,
    password: password,
  };
  const [isVisible, setIsVisible] = useState(false);
  const toggle = () => {
    setIsVisible(!isVisible);
  };

  const fetchData = async () => {
    const res = await fetch(participantApi);
    const data = await res.json();

    setDataUsers(data, ...dataUsers);
  };

  useEffect(() => {
    fetchData();
    // console.log("listUser after fetch: ", dataUsers);
  }, []);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const postLoginData = async (loginData, callback) => {
    const options = {
      method: "POST",
      delay: 5000,
      body: JSON.stringify(loginData),
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
        // Accept: "application/json",
      },
    };
    NProgress.start();
    const res = await fetch(loginApi, options);
    const data = await res.json();
    NProgress.done();
    callback();
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
    setTimeout(() => {
      fetch(loginApi + "/1", options)
        .then((response) => {
          return response.json();
        })
        .then(callback);
    }, 3000);
  };
  const handleLogin = () => {
    // console.log("listUsers after login: ", dataUsers);
    // isSuccedLogin = dataUsers.some((user) => {
    //   return user.email === data.email && user.password === data.password;
    // });
    dataLogin = dataUsers.find((user) => {
      return user.email === data.email && user.password === data.password;
    });
    setIsLoading(true);
    if (dataLogin !== undefined && dataLogin.length !== 0) {
      isSuccedLogin.current = true;
    }
    if (isSuccedLogin.current) {
      postLoginData(data, () => {
        dispatch(doLogin(dataLogin));
        toast.success(t("login.success"));
        setIsLoading(false);
        navigate("/");
      });
      localStorage.setItem("account", JSON.stringify(dataLogin));
      localStorage.setItem("id", JSON.stringify(dataLogin.id));
      deleteLoginData(() => {});
    } else {
      toast.error(t("login.error"));
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e && e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="header">
        <span>{t("login.header")}</span>
        <button
          className="btn btn-signup"
          onClick={() => {
            navigate("../signup");
          }}
        >
          {t("login.signup")}
        </button>
        <Language />
      </div>

      <div className="title col-4 mx-auto">Quiz Web</div>

      <div className="welcome col-4 mx-auto">{t("login.title")}</div>
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
          <label>{t("login.password")}</label>
          <input
            type={!isVisible ? "password" : "text"}
            className={"form-control"}
            value={password}
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e)}
          />
          <span className="icon" onClick={toggle}>
            {isVisible ? <VscEyeClosed /> : <VscEye />}
          </span>
        </div>
        <a href="/" className="forget-password">
          {t("login.forgetPassword")}
        </a>
        <div>
          <button
            className="btn btn-submit"
            disabled={isLoading}
            onClick={() => handleLogin()}
          >
            {isLoading === true && <ImSpinner9 className="loader-icon" />}
            <span>{t("login.doLogin")}</span>
          </button>
        </div>

        <div className="back text-center">
          <span
            onClick={() => {
              navigate("/");
            }}
          >
            &#60;&#60; {t("login.homepage")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
