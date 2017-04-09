import R                  from 'ramda'
import Bluebird           from 'bluebird'
import Cookie             from 'js-cookie'
import Api                from '../lib/restful.js'
import { notNil }         from '../lib/helpers.js'
import { getCurrentUser } from '../lib/auth.js'


const TYPE = {
  get_chat_contacts_for_user_id_start   : 'get_chat_contacts_for_user_id_start',
  get_chat_contacts_for_user_id_success : 'get_chat_contacts_for_user_id_success'
}

const getChatContactsForUserIdStart = () =>
  ({ type: TYPE.get_chat_contacts_for_user_id_start })

const getChatContactsForUserIdSuccess = payload =>
  ({ type: TYPE.get_chat_contacts_for_user_id_success, payload })


const _extractUids = uid => R.compose(
  R.reject(R.equals(uid)),
  R.uniq,
  R.chain(R.juxt([R.prop('uid_1'), R.prop('uid_2')]))
)


const _getUsersByUids = (uid, chat_contacts) => Api({
  method : 'post',
  path   : 'user_get_by_uids',
  body   : { uid_list : _extractUids(uid)(chat_contacts) }
})


const getChatContactsForUserId = uid => (dispatch, getState) => Bluebird

  .resolve(dispatch(getChatContactsForUserIdStart()))

  .then(() => Api({
    method : 'get',
    path   : 'chat_contact_all',
    keys   : { uid }
  }))

  .get('data')

  .then(chat_contacts => {

    if (R.isEmpty(chat_contacts)) return null

    Bluebird.resolve(_getUsersByUids(uid, chat_contacts))
      .then(res => dispatch(getChatContactsForUserIdSuccess({
        chat_contacts : chat_contacts,
        users         : res.data
      })))

  })


export default {
  TYPE,
  getChatContactsForUserId
}
