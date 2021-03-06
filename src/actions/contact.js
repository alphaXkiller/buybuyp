import R        from 'ramda'
import Bluebird from 'bluebird'

import Api       from '../lib/restful.js'
import MessageDB from '../lib/message.js'

const TYPE = {
  receive_chats    : 'contact_receive_chats',
  new_incoming_msg : 'contact_new_incoming_msg',
  load_more_msg    : 'contact_load_more_msg',
  add_contact      : 'contact_add',
  get_conversation : 'contact_get_conversation'
}


const receiveChats = payload => ({ type: TYPE.receive_chats, payload })
const receiveNewMsg = (target_uid, payload, prevKey) => ({
  type: TYPE.new_incoming_msg, payload, prevKey, target_uid
})

const getChats = (dispatch, getState) => Api({
    path: 'contact', 
    method: 'get', 
  })

  .then( chats => R.composeP(
    rows => R.merge(chats.data, { rows }),
    rows => Bluebird.map( rows, target_user => MessageDB
      .get([getState().User.uid, target_user.uid], {})
      .then(conversation => R.merge(target_user, { conversation }))
    ),
    R.prop('rows'),
    Bluebird.resolve
  )(chats.data))

  .then( chats => dispatch(receiveChats(chats)) )


const listenOnNewMsg = target_uid => (dispatch, getState) => MessageDB
  .listenOnAdd(
    [getState().User.uid, target_uid], 
    {}, 
    (payload, prevKey) => dispatch(
      receiveNewMsg(target_uid, payload, prevKey)
    )
  )


const sendMsg = (target_uid, context) => (dispatch, getState) => MessageDB
  .insert([getState().User.uid, target_uid], context)


// =======================================
// ========== LOAD MORE MESSAGE ==========
// =======================================
const getFirstMsgId = target_uid => R.compose(
  R.pathOr('', ['id']),
  R.head,
  R.prop('conversation'),
  R.find(R.propEq('uid', target_uid))
)


const loadMoreSuccessfully = (target_uid, payload) => ({
  type: TYPE.load_more_msg, payload, target_uid
})


const loadMoreMsg = target_uid => (dispatch, getState) => MessageDB
  .loadMore([getState().User.uid, target_uid], {
    endAt: getFirstMsgId(target_uid)(getState().Contact.rows)
  })

  .then( payload => dispatch(loadMoreSuccessfully(target_uid, payload)) )


// =================================
// ========== Add Contact ==========
// =================================
const addContactSuccessfully = payload => ({
  type: TYPE.add_contact, payload
})

const add = target_uid => (dispatch, getState) => Api({
  path: 'contact',
  method: 'post',
  body: { contact_uid: target_uid }
})

  .then( contact => dispatch(
    addContactSuccessfully(R.merge(contact.data, { conversation: [] }))
  ))

// =====================================
// ========= GET CONVERSATION ==========
// =====================================
const getConversationSuccessfully = (target_uid, payload) => ({
  type: TYPE.get_conversation, payload, target_uid
})

const getConversation = target_uid => (dispatch, getState) => MessageDB
  .get([getState().User.uid, target_uid], {})

  .then( payload => dispatch(getConversationSuccessfully(target_uid, payload)) )

  .then( () => dispatch(listenOnNewMsg(target_uid)) )

export default {
  TYPE,

  add,
  sendMsg,
  getChats,
  loadMoreMsg,
  listenOnNewMsg,
  getConversation
}
