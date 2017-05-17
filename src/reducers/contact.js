import R from 'ramda'
import { Contact } from '../actions/index.js'


/**
 * @param {string} message key
 * @param {Object[]} conversation - a list of message
 *
 * @return {boolean}
 */
const isNewMsg = msg_id => R.compose(
  R.isNil, R.find(R.propEq('id', msg_id))
)


const updateConversation = (contact_index, contacts) => R.compose(
  R.update(contact_index, R.__, contacts)
  ,
  R.merge(contacts[contact_index])
  ,
  R.objOf('conversation')
)


const appendMsgIfNew = (contact_index, contact, payload) => R.compose(
  updateConversation(contact_index, contact.rows)
  ,
  R.when(
    // Message is not in current conversation
    isNewMsg(payload.id),

    // Merge msg key as id to message
    // then append to the current conversation
    R.append(payload)
  )
)(contact.rows[contact_index].conversation)


const prependMoreMsg = (contact_index, contact, payload) => R.compose(
  updateConversation(contact_index, contact.rows)
  ,
  // Remove the last message as it's a ref message
  // to load more message. It already exists in the conversation
  R.concat(R.slice(0, -1, payload))
)(contact.rows[contact_index].conversation)


const _appendNewContact = current_contact => R.compose(
  rows => R.merge(current_contact, { rows }),
  R.prepend(R.__, current_contact.rows)
)


// ============================
// ========== REDUCER =========
// ============================
const reducer = (contact={}, action) => R.cond([
  [
    R.equals(Contact.TYPE.receive_chats), 
    R.always(action.payload) 
  ]
  ,
  [ 
    R.equals(Contact.TYPE.new_incoming_msg), 
    () => R.compose(
      rows => R.merge(contact, { rows })
      ,
      index => appendMsgIfNew(index, contact, action.payload)
      ,
      // Find the msg sender index from contact list
      R.findIndex(R.propEq('uid', action.target_uid))
    )(contact.rows)
  ]
  ,
  [
    R.equals(Contact.TYPE.load_more_msg),
    () => R.compose(
      rows => R.merge(contact, { rows })
      ,
      index => prependMoreMsg(index, contact, action.payload)
      ,
      R.findIndex(R.propEq('uid', action.target_uid))
    )(contact.rows)
  ]
  ,
  [
    R.equals(Contact.TYPE.add_contact),
    () => _appendNewContact(contact)(action.payload)
  ]
  ,
  [
    R.equals(Contact.TYPE.get_conversation),
    () => R.compose(
      rows => R.merge(contact, { rows })
      ,
      index => updateConversation(index, contact.rows)(action.payload)
      ,
      R.findIndex(R.propEq('uid', action.target_uid))
    )(contact.rows)
  ]
  ,
  [ R.T, R.always(contact) ]
])(action.type)


export default reducer
