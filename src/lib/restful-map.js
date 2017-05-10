export default {

  'signup'           : '/authenticate/signup',
  'product_search'   : '/product',
  'product_details'  : '/product/:id',
  'product_category' : '/product-category',

  // Require user login
  'user'                 : '/private/user',
  'user_validation'      : '/private/user/:uid/validate',
  'user_get_by_uids'     : '/private/user/get-by-uids',
  'user_product'         : '/private/product',
  'user_product_details' : '/private/product/:id',
  'image'                : '/private/image',
  'contact'              : '/private/contact'
}
