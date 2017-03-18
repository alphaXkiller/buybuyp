import R from 'ramda'

import { User } from '../actions/index.js'

const user_reducer = (state = null, action) => R.cond([
  [
    R.equals(User.TYPE.logout_success),
    R.always(null)
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
    signup_status => R.merge(state, {
      error: action.payload.error, 
      error_mesage: action.payload.message,
      validation: action.payload.validation,
      signup_status
    })
  ],
  [ R.T, R.always(state) ]
])(action.type)

export default user_reducer
