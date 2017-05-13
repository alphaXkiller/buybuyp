import R        from 'ramda'
import Bluebird from 'bluebird'

import Api        from '../lib/restful.js'
import { notNil } from '../lib/helpers.js'

import {
  googleLogin,
  facebookLogin,
  emailLogin,
  getToken,
  getRedirectResult,
  getCurrentUser,
  logout,
  emailSignup
} from '../lib/auth.js'

const TYPE = {
  logout_pending   : 'logout_pending',
  logout_success   : 'logout_successfully',
  signup_pending   : 'signup_pending',
  signup_success   : 'signup_successfully',
  signup_failed    : 'signup_failed',
  login_failed     : 'login_failed',
  get_user_success : 'get_user_successfully'
}

// ========== Export function ==========
// =====================================
const signupStart = () => ({ type: TYPE.signup_pending })


const signupSuccessfully = () => ({ type: TYPE.signup_success})


const signupFailed = payload => ({ type: TYPE.signup_failed, payload })


const loginFailed = payload => ({ type: TYPE.login_failed, payload })


const getUserSuccessfully = payload => ({ type: TYPE.get_user_success, payload })


const logoutStart = () => ({ type: TYPE.logout_pending })


const logoutSuccessfully = () => ({ type: TYPE.logout_success })


const loginGoogle = (dispatch, getState) => Bluebird.resolve(googleLogin())


const loginFacebook = (dispatch, getState) => Bluebird.resolve(facebookLogin())


const getUser = (dispatch, getState) => Bluebird
  .resolve( getCurrentUser() )

  .tap( user => dispatch(getUserSuccessfully(user)) )

  .then(R.when(notNil, user => Api({
    method: 'post',
    path: 'user_validation',
    keys: { uid: user.uid },
    body: user
  })))


const signup = ({name, email, password}) => (dispatch, getState) => 
  emailSignup(name, email, password)

  .then(() => dispatch(signupSuccessfully()))

  .then(() => getUser(dispatch, getState))

  .catch( err => dispatch(signupFailed(err)) )


const loginEmail = ({email, password}) => (dispatch, getState) => 
  emailLogin({email, password})

  .then(() => getUser(dispatch, getState))

  .catch( err => dispatch(loginFailed(err)) )


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
