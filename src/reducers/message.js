import R           from 'ramda'
import { Message } from '../actions/index.js'


const reduceChatChannels = (state, payload) => R.compose(
  R.assoc('chat_channels', R.__, state),
  R.reverse,
  R.sortBy(R.prop('last_message_timestamp')),
  R.values(),
  R.map(R.head),
  R.reject(R.isEmpty),
  R.map(R.reject(R.pathEq(['user', 'uid'], payload.uid))),
  R.groupBy(R.prop('uid'))
)(payload.channels)



const reducer = (state = {}, action) => R.cond([

  // [ R.equals(Message.TYPE.get_chat_channels_for_user_uid_success),
  //     () => reduceChatChannels(state, action.payload) ],

  [ R.T, R.always(state) ]

])(action.type)


export default reducer
