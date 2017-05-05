import R         from 'ramda'
import Bluebird  from 'bluebird'
import MessageDB from '../lib/message.js'

const TYPE = {
  get_msg_pending : 'get_msg_pending',
  get_msg_success : 'get_msg_success',

  new_incoming_msg : 'new_incoming_msg'
}


// ==================================
// ========== SEND MESSAGE ==========
// ==================================
const sendMsg = MessageDB.insert


// ====================================================
// ========== GET  MESSAGE AND KEEP LISTENING =========
// ====================================================
const getMsgStart = () => ({ type: TYPE.get_msg_pending })
const getMsgSuccessfully = payload => ({
  type: TYPE.get_msg_success, payload
})
const startListeningNewMsg = (payload, prevKey) => ({
  type: TYPE.new_incoming_msg, payload, prevKey
})

const getMsg = (ids, option) => (dispatch, getState) => Bluebird
  .resolve(dispatch(getMsgStart()))

  .then(() => MessageDB.get(ids, option, payload => 
    dispatch(getMsgSuccessfully(payload)))
  )

  .then(() => MessageDB.listenOnAdd(ids, option, (payload, prevKey) =>
    dispatch(startListeningNewMsg(payload, prevKey)) 
  ))



export default {
  TYPE,
  sendMsg,
  getMsg,
}
