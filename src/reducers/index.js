import { combineReducers } from 'redux'

import User           from './user.js'
import Product        from './product.js'
import Product_search from './product-search.js'
import Message        from './message.js'

export default combineReducers({
  Message,
  Product,
  Product_search,
  User
})
