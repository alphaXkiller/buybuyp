import { combineReducers } from 'redux'

import User            from './user.js'
import Product         from './product.js'
import ProductSearch   from './product-search.js'
import ProductCategory from './product-category.js'
import Messages         from './messages.js'
import Chat            from './chat.js'
import ChatMessage     from './chat-message.js'

export default combineReducers({
  Messages,
  Product,
  ProductSearch,
  ProductCategory,
  User,
  Chat,
  ChatMessage
})
