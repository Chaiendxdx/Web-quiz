export const FETCH_USER_LOGIN_SUCCESS = "FETCH_USER_LOGIN_SUCCESS";
export const USER_LOGOUT_SUCCESS = "USER_LOGOUT_SUCCESS";
export const RELOAD = "RELOAD";
export const doLogin = (dataLogin) => {
  return {
    type: FETCH_USER_LOGIN_SUCCESS,
    payload: dataLogin,
  };
};

export const reload = (dataLogin) => {
  return {
    type: FETCH_USER_LOGIN_SUCCESS,
    payload: dataLogin,
  };
};

export const doLogout = () => {
  return {
    type: USER_LOGOUT_SUCCESS,
  };
};
