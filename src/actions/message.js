import R                  from 'ramda'
import Bluebird           from 'bluebird'
import Cookie             from 'js-cookie'

import FirebaseDB         from '../lib/firebase-db.js'
import { notNil }         from '../lib/helpers.js'

import { getCurrentUser } from '../lib/auth.js'


const TYPE = {
  get_messages_for_users_pending: 'get_messages_for_users_pending',
  get_messages_for_users_success: 'get_messages_for_users_success'
}


const getMessagesForUsersStart = () => ({ type: TYPE.get_messages_for_users_pending })
const getMessagesForUsersSuccess = payload => ({ type: TYPE.get_messages_for_users_success, payload })

const getMessagesForUsers = (dispatch, getState) =>
  Bluebird
    .resolve(dispatch(getMessagesForUsersStart()))
    .then(() => getCurrentUser())


// const getUser = (dispatch, getState) => Bluebird
//   .resolve(dispatch(getUserStart()))

//   .then(() => getCurrentUser())

//   .tap(user => dispatch(getUserSuccessfully(user)))

//   .then(R.when(notNil, user => Api({
//     method: 'post',
//     path: 'user_validation',
//     keys: { uid: user.uid },
//     body: user
//   })))


export default {
  TYPE
  // getUser
}
