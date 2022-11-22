import { FETCH_USER_LOGIN_SUCCESS } from "../action/userAction";
const INITIAL_STATE = {
  account: {
    username: "",
    userImage: "",
    role: "",
  },
  isAuthenticated: false,
};
const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_USER_LOGIN_SUCCESS:
      console.log(action);
      return {
        ...state,
        account: {
          id: action?.payload?.id,
          username: action?.payload?.username,
          userImage: action?.payload?.userImage,
          role: action?.payload?.role,
        },
        isAuthenticated: true,
      };
    default:
      return state;
  }
};

export default userReducer;
