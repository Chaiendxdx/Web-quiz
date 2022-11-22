import videoHomepage from "../../assets/video-homepage.mp4";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
const HomePage = (props) => {
  const account = useSelector((state) => state.user.account);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const navigate = useNavigate();
  return (
    <div className="homepage-container">
      <video autoPlay muted playsInline loop>
        <source src={videoHomepage} type="video/mp4" />
      </video>

      <div className="homepage-content">
        <div className="heading">There's a better way to ask</div>

        <div className="content">
          You don't want to make a boring form. And your audience won't answer
          one. Create a typeform instead — and make everyone happy.
        </div>
        <div className="started">
          {isAuthenticated === true && localStorage.getItem("id") ? (
            <button
              className="btn btn-started"
              onClick={() => navigate("/users")}
            >
              Doing Quiz Now
            </button>
          ) : (
            <button
              className="btn btn-started"
              onClick={() => navigate("/login")}
            >
              Get started - it's free
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
