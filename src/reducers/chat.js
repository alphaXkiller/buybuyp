import R from 'ramda'
import { Contact } from '../actions/index.js'


const reducer = (state={}, action) => R.cond([
  [ R.equals(Contact.TYPE.receive_chats), R.always(action.payload) ],
  [ R.T, R.always(state) ]
])(action.type)


export default reducer
