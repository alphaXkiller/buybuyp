import { combineReducers } from 'redux'

import User           from './user.js'
import Product        from './product.js'
import Product_search from './product-search.js'

export default combineReducers({
  User,
  Product,
  Product_search
})
