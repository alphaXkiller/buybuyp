import R from 'ramda'

import { ProductCategory } from '../actions/index.js'

const reducer = (state = [], action) => R.cond([
  [ 
    R.equals(ProductCategory.TYPE.get_all_success),
    R.always(action.payload)
  ],
  [ R.T, R.always(state)]

])(action.type)


export default reducer
