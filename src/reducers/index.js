import { combineReducers } from 'redux'

import User            from './user.js'
import Product         from './product.js'
import ProductSearch   from './product-search.js'
import ProductCategory from './product-category.js'
import Contact         from './contact.js'

export default combineReducers({
  Product,
  ProductSearch,
  ProductCategory,
  User,
  Contact,
})
