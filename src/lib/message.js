import R        from 'ramda'
import Bluebird from 'bluebird'
import { DB }   from './_firebase/'

const MessageDB = new DB('message')

// Create a reference: smallerUid_greaterUid
const _generateRefKey = R.compose(
  R.join('_'),
  // CAUTION: R.sort(R.gt) is not working in here
  list => {
    // shallow copy
    const _list = Object.assign([], list)
    return _list.sort()
  }
) 


const insert = (ids, data) => R.compose(
  key => MessageDB.insert(key, data),
  _generateRefKey
)(ids)


const get = (ids, option, cb) => R.compose(
  key => MessageDB.ref(key)
  .orderByKey()
  .limitToLast(15)
  .once('value', cb),

  _generateRefKey,
)(ids)



const listenOnAdd = (ids, option, cb) => R.compose(
  key => MessageDB.onAdd(key, option, cb),
  _generateRefKey
)(ids)



const loadMore = (ids, option, cb) => R.compose(
  key => MessageDB.ref(key)
  .orderByKey()
  .endAt(option.endAt)
  .limitToLast(15)
  .once('value', cb),

  _generateRefKey
)(ids)


export default {
  insert,
  get,
  listenOnAdd,
  loadMore 
}
