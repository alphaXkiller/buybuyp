import R           from 'ramda'
import { Message } from '../actions/index.js'


const _hydrateContact = R.curry((users, contact) => R.compose(
  R.assoc('other_user', R.__, contact),
  R.find(R.either(
    R.propEq('uid', R.prop('uid_1', contact)),
    R.propEq('uid', R.prop('uid_2', contact))
  ))
)(users))


const _hydrateContacts = R.curry((users, contacts) =>
  R.map(_hydrateContact(users), contacts))


const reduceChatContacts = (state, payload) => {
  let chat_contacts = _hydrateContacts(payload.users, payload.chat_contacts)
  return R.merge(state, { chat_contacts })
  
}


const reducer = (state = {}, action) => R.cond([
  [
    R.equals(Message.TYPE.get_chat_contacts_for_user_id_success),
      () => reduceChatContacts(state, action.payload)
  ],
  [ R.T, R.always(state) ]
])(action.type)


export default reducer
