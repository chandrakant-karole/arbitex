import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,

  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAIL,

  SET_PASSWORD_REQUEST,
  SET_PASSWORD_SUCCESS,
  SET_PASSWORD_FAIL,

  SET_CURRENT_USER,

  USER_LOADED,
  AUTH_ERROR,
  LOGOUT,
} from '../constants'

import apiServer from '../api'
import { 
  displayMsg,
} from '../utils/toast'
import setAuthToken from '../utils/setAuthToken';

export function setPassword(payload) {
  return (dispatch) => {
    dispatch({
      type: SET_PASSWORD_REQUEST
    });

    apiServer
      .put('/users/'+payload.id,
        payload
      )
      .then(res => {
        displayMsg('Password updated');
        dispatch({
          type: SET_PASSWORD_SUCCESS,
          payload: res.data,
        })
      })
      .catch(err => {        
        if(!err.details)
          displayMsg(err.message, 'error');
        dispatch({
          type: SET_PASSWORD_FAIL,
          payload: err.details || null,
        })
      })
  };
}

export function setCurrentUser(payload) {
  return (dispatch) => {
    localStorage.setItem('token', JSON.stringify(payload))
    dispatch({
      type: SET_CURRENT_USER,
      payload,
    });
  };
}


// Load User
export const loadUser = () => async (dispatch) => {
  try {
    const res = await apiServer.get('/users/2fa');
    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });

    setAuthToken()
  }
};

// Logout
export const logout = () => async (dispatch) => {
  dispatch({
    type: LOGOUT
  });

  setAuthToken();
}

export function userLoginRequest(payload) {
  return (dispatch) => {
    dispatch({
      type: USER_LOGIN_REQUEST
    });

    apiServer
      .post('/users/auth/signin',
        payload
      )
      .then(res => {
        localStorage.setItem('token', JSON.stringify(res.data))
        setAuthToken(res.data.accessToken)
        dispatch({
          type: USER_LOGIN_SUCCESS,
          payload: res.data,
        })
      })
      .catch(err => {
        if(!err.details)
          displayMsg(err.message, 'error');

        dispatch({
          type: USER_LOGIN_FAIL,
          payload: err.details || null,
        })
      })
  };
}

export function userRegisterRequest(payload) {
  return (dispatch) => {
    dispatch({
      type: CREATE_USER_REQUEST
    });

    apiServer
      .post('/users/auth/signup',
        payload
      )
      .then(res => {
        dispatch({
          type: CREATE_USER_SUCCESS,
        })
        displayMsg('New user registered');
        // window.location.href = '/login';
      })
      .catch(err => {
        if(!err.details)
          displayMsg(err.message, 'error');

        dispatch({
          type: CREATE_USER_FAIL,
          payload: err.details || null,
        })
      })
  };
}