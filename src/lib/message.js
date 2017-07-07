import R        from 'ramda'
import Bluebird from 'bluebird'
import { DB }   from './_firebase/'

const MessageDB = new DB('message')


/**
 *  @param {string[]} datasnapshotKey 
 *  @param {Object[]} message
 *
 *  @return {Object} message with key as id
 **/
const setKeyToMsgId = R.zipWith( (id, message) => R.merge(message, { id }) )


const handleGetMsg = R.compose(
  // outcome: [ { id: key, ...value } ]
  R.apply(setKeyToMsgId),
  // outcome: [ [key], [value] ]
  R.values,
  // Transform from { key1: value1, key2: value2 } 
  // to { keys: [key], values: [value] }
  R.applySpec({keys: R.keys, values: R.values}),
)


// Create a reference: smallerUid_greaterUid
const generateRefKey = R.compose(
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
  generateRefKey
)(ids)


const get = (ids, option) => R.compose(
  key => new Bluebird( 
    (resolve, reject) => { MessageDB
      .ref(key)
      .orderByKey()
      .limitToLast(15)
      .once('value', payload => resolve(payload.val()))
    }
  ).then(handleGetMsg)
  ,
  generateRefKey,
)(ids)


const loadMore = (ids, option) => R.compose(
  key => new Bluebird( (resolve, reject) => { MessageDB
    .ref(key)
    .orderByKey()
    .endAt(option.endAt)
    .limitToLast(15)
    .once('value', payload => resolve(payload.val()))
  }).then(handleGetMsg)
  ,
  generateRefKey
)(ids)


const listenOnAdd = (ids, option, cb) => R.compose(
  key => MessageDB.onAdd(key, option, (data, prevKey) => cb(
    R.merge(data.val(), { id: data.key }, prevKey)
  )),
  generateRefKey
)(ids)


export default {
  // crud action
  get,
  insert,
  loadMore,

  listenOnAdd,
  generateRefKey,
  handleGetMsg 
}
