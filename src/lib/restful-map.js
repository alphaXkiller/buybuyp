export default {

  'signup'         : '/authenticate/signup',
  'product_search' : '/product',
  'product_details': '/product/:id',

  // Require user login
  'user'                 : '/api/user',
  'user_validation'      : '/api/user/:uid/validate',
  'user_get_by_uids'     : '/api/user/get-by-uids',
  'user_product'         : '/api/product',
  'user_product_details' : '/api/product/:id',
  'image'                : '/api/image',
  'chat_contact_details' : '/api/chat-contact/:uid',
  'chat_contact_all'     : '/api/chat-contact/:uid/all'
}
