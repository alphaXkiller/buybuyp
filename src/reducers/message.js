import R from 'ramda'
import { Message } from '../actions/index.js'


const reducer = (state = {}, action) => R.cond([
  [
    R.equals(Message.TYPE.get_chat_contacts_for_user_id_success),
      // hydrate chat_contracts using users object
      () => R.merge(state, { chat_contacts: action.payload })
  ],
  [ R.T, R.always(state) ]
])(action.type)


export default reducer
