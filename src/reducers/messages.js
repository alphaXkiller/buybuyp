import R           from 'ramda'
import { Message } from '../actions/index.js'

const LOAD_MORE_REF_INDEX = 1

/**
 *  @param [string] datasnapshotKey 
 *  @param [object] message
 *
 *  @return {object}
 **/
const setKeyToMsgId = R.zipWith( (id, message) => R.merge(message, { id }) )


const handleGetMsg = R.compose(
  // outcome: [ { id: key, ...value } ]
  R.apply(setKeyToMsgId),
  // outcome: [ [key], [value] ]
  R.values,
  // Transform from { key1: value1, key2: value2 } 
  // to { keys: [key], values: [value] }
  R.applySpec({keys: R.keys, values: R.values})
)


const handleNewIncomingMsg = messages => (payload, prevKey) => {
  const id = payload.key
  const new_message = payload.val()
  const last_message = R.last(messages)
  let updated_messages = messages

  if (last_message.id === prevKey)
    updated_messages = R.append(R.merge(new_message, { id }))(messages)

  return updated_messages
}


const handleLoadMoreMsg = messages => R.compose(
  R.uniq,
  R.concat(R.__, messages),
  R.drop(LOAD_MORE_REF_INDEX),
  handleGetMsg
)


const reducer = (state = [], action) => R.cond([
  [ 
    R.equals(Message.TYPE.get_msg_success), 
    () => handleGetMsg(action.payload.val())
  ],

  [
    R.equals(Message.TYPE.new_incoming_msg),
    () => handleNewIncomingMsg(state)(action.payload, action.prevKey)
  ],

  [
    R.equals(Message.TYPE.load_more_msg_success),
    () => handleLoadMoreMsg(state)(action.payload.val())
  ],

  [ R.T, R.always(state) ]
])(action.type)


export default reducer
