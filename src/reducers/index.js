import { combineReducers } from 'redux'

import User            from './user.js'
import Product         from './product.js'
import ProductSearch  from './product-search.js'
import ProductCategory from './product-category.js'
import Message         from './message.js'

export default combineReducers({
  Message,
  Product,
  ProductSearch,
  ProductCategory,
  User
})
