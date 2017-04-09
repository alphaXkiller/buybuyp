import R                  from 'ramda'
import Bluebird           from 'bluebird'
import Cookie             from 'js-cookie'
import Api                from '../lib/restful.js'
import { notNil }         from '../lib/helpers.js'
import { getCurrentUser } from '../lib/auth.js'


const TYPE = {
  get_chat_channels_for_user_uid_start   : 'get_chat_channels_for_user_uid_start',
  get_chat_channels_for_user_uid_success : 'get_chat_channels_for_user_uid_success'
}

const getChatChannelsForUserUidStart = () =>
  ({ type: TYPE.get_chat_channels_for_user_uid_start })

const getChatChannelsForUserUidSuccess = payload => 
  ({ type: TYPE.get_chat_channels_for_user_uid_success, payload })


const getChatChannelsForUserUid = user_uid => (dispatch, getState) => Bluebird
  .resolve(dispatch(getChatChannelsForUserUidStart()))
  .then(() => Api({
    method : 'get',
    path   : 'chat_channel_all',
    keys   : { uid : user_uid }
  }))
  .then((res) => dispatch(getChatChannelsForUserUidSuccess({
    uid      : user_uid,
    channels : res.data
  })))


export default {
  TYPE,
  getChatChannelsForUserUid
}
