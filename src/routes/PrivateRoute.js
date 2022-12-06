import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
const PrivateRoute = (props) => {
  //   let isAuthenticated = false;
  //   if (localStorage.getItem("account")) {
  //     isAuthenticated = true;
  //   }
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login"></Navigate>;
  }
  return <>{props.children}</>;
};

export default PrivateRoute;
