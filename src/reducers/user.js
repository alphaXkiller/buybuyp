import R from 'ramda'

import { User } from '../actions/index.js'

const user_reducer = (state = {}, action) => R.cond([
  [
    R.equals(User.TYPE.logout_success),
    R.always({})
  ],
  [
    R.equals(User.TYPE.get_user_success),
    () => R.defaultTo(state)(action.payload)
  ],
  [ 
    R.equals(User.TYPE.signup_success), 
    signup_status => ({signup_status})
  ],
  [
    R.equals(User.TYPE.signup_failed),
    signup_status => ({
      error: action.payload,
      error_message: action.payload.message,
      error_code: action.payload.code,
      signup_status
    })
  ],
  [
    R.equals(User.TYPE.login_failed),
    ()  => ({
      error: action.payload,
      error_message: action.payload.message,
      error_code: action.payload.code,
    })
  ],
  [ R.T, R.always(state) ]
])(action.type)

export default user_reducer
