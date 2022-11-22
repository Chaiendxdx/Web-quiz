import { combineReducers } from "redux";
// import { connectRouter } from "connected-react-router";

// import appReducer from "./appReducer";
// import adminReducer from "./adminReducer";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
  user: userReducer,
});

export default rootReducer;
