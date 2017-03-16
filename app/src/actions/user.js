import R from 'ramda'
import Bluebird from 'bluebird'
import Cookie from 'js-cookie'

import Api from '../lib/restful.js'
import { notNil } from '../lib/helpers.js'

import {
  googleLogin,
  facebookLogin,
  emailLogin,
  getToken,
  getRedirectResult,
  onAuthStateChanged,
  getCurrentUser,
  logout
} from '../lib/auth.js'

const TYPE = {
  // login_pending    : 'login_pending',
  // login_success    : 'login_successfully',
  logout_pending   : 'logout_pending',
  logout_success   : 'logout_successfully',
  signup_pending   : 'signup_pending',
  signup_success   : 'signup_successfully',
  signup_failed    : 'signup_failed',
  get_user_pending : 'get_user_pending',
  get_user_success : 'get_user_successfully'
}

// ========== Export function ==========
// =====================================
const loginStart = () => ({ type: TYPE.login_pending })


const loginSuccessfully = payload => ({ type: TYPE.login_success, payload })


const signupStart = () => ({ type: TYPE.signup_pending })


const signupSuccessfully = () => ({ type: TYPE.signup_success})


const signupFailed = payload => ({ type: TYPE.signup_failed, payload })


const getUserStart = () => ({ type: TYPE.get_user_pending })


const getUserSuccessfully = payload => ({ type: TYPE.get_user_success, payload })


const logoutStart = () => ({ type: TYPE.logout_pending })


const logoutSuccessfully = () => ({ type: TYPE.logout_success })


const loginGoogle = (dispatch, getState) => Bluebird.resolve(googleLogin())


const loginFacebook = (dispatch, getState) => Bluebird.resolve(facebookLogin())


const loginEmail = ({email, password}) => (dispatch, getState) => 
  emailLogin({email, password})



const signup = ({name, email, password}) => (dispatch, getState) =>
  Bluebird.resolve(dispatch(signupStart()))

  .then(() => Api({
    method: 'post',
    path: 'signup', 
    body: { name, email, password }
  }))

  .then(() => dispatch(signupSuccessfully()))

  .catch( err => dispatch(signupFailed(err.data)) )


const getUser = (dispatch, getState) => Bluebird
  .resolve(dispatch(getUserStart()))

  .then( () => getCurrentUser() )

  .tap( user => dispatch(getUserSuccessfully(user)) )

  .then(R.when(notNil, user => Api({
    method: 'post',
    path: 'user_validation',
    keys: { uid: user.uid },
    body: user
  })))


const logoutUser = (dispatch, getState) =>
  Bluebird.resolve(dispatch(logoutStart()))

  .then( () => logout() )

  .then( () => dispatch(logoutSuccessfully()))


export default {
  TYPE,
  loginGoogle,
  loginFacebook,
  loginEmail,
  signup,
  logoutUser,
  getUser
}
