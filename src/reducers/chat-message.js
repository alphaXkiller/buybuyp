import R from 'ramda'
import { Message } from '../actions/index.js'

const reducer = (state = {}, action) => R.cond([
  [ R.T, R.always(state) ]
])(action.type)


export default reducer
