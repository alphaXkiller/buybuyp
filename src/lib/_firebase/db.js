import R        from 'ramda'
import Firebase from './_init' 

const DEFAULT_LIMIT = 15
const EVENT_TYPE = {
  onGet    : 'value',
  onAdd    : 'child_added',
  onChange : 'child_changed',
  onDelete : 'child_removed',
  onUpdate : 'child_moved'
} 

class FirebaseDB {
  constructor(table) {
    this._DB    = Firebase.database
    this._table = table + '/'
  }

  // lowest level of Firebase's method
  // It can be used pretty much for everything
  ref(key) {
    return this._DB.ref(this._table + key)
  }

  // It can search the whole table without passing a key
  search(option) {
    const _option = option ? option : {}
    const limit   = _option.limit ? _option.limit : DEFAULT_LIMIT
    const path    = option.key ? this._table + _option.key : this._table

    return this._DB.ref(path)
      .orderByKey()
      .limitToLast(limit)
  }

  insert(key, obj) {
    return this.ref(key)
      .push()
      .set(obj)
      .then(R.always(obj))
  }  

  onAdd(key, option, cb) {
    this.ref(key)
      .orderByKey()
      .limitToLast(option.limit ? option.limit : DEFAULT_LIMIT)
      .on(EVENT_TYPE.onAdd, cb)
  }
}


export default FirebaseDB
