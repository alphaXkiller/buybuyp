import R        from 'ramda'
import Bluebird from 'bluebird'

import Api from '../lib/restful.js'

const TYPE = {
  request_chats: 'REQUEST_CHATS',
  receive_chats: 'RECEIVE_CHATS'
}


const requestChats = () => ({ type: TYPE.request_chats })
const receiveChats = payload => ({ type: TYPE.receive_chats, payload })


const getChats = (dispatch, getState) => Bluebird
  .resolve(dispatch(requestChats()))

  .then( () => Api({
    path: 'contact', 
    method: 'get', 
    query: {
      in_chat: '1'
    }
  }))

  .then( chats => dispatch(receiveChats(chats.data)) )

export default {
  TYPE,
  getChats
}
