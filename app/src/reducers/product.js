import R from 'ramda'
import { Product } from '../actions/index.js'

const reducer = (state = {}, action) => R.cond([
  [
    R.equals(Product.TYPE.post_product_success),
    () => ({ posted: action.payload })
  ],
  [
    R.equals(Product.TYPE.get_product_details_success),
    () => ({ details: action.payload })
  ],
  [
    R.equals(Product.TYPE.empty_posted_product),
    () => ({ posted: null })
  ],
  [ R.T, R.always(state) ]
])(action.type)

export default reducer
