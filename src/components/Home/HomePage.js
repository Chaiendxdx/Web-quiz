import videoHomepage from "../../assets/video-homepage.mp4";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
const HomePage = (props) => {
  const account = useSelector((state) => state.user.account);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="homepage-container">
      <video autoPlay muted playsInline loop>
        <source src={videoHomepage} type="video/mp4" />
      </video>

      <div className="homepage-content">
        <div className="heading">{t("homepage.title1")}</div>

        <div className="content">{t("homepage.title2")}</div>
        <div className="started">
          {isAuthenticated === true && localStorage.getItem("id") ? (
            <button
              className="btn btn-started"
              onClick={() => navigate("/users")}
            >
              {t("homepage.title3.signup")}
            </button>
          ) : (
            <button
              className="btn btn-started"
              onClick={() => navigate("/login")}
            >
              {t("homepage.title3.login")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
