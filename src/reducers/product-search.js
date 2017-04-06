import R from 'ramda'
import { Product } from '../actions/index.js'

const _init_state = {
  count  : 0,
  params : {},
  rows   : []
}


const appendProducts = ({count, params, rows}) => R.applySpec({
  count  : R.prop('count'),
  params : R.prop('params'),
  rows   : R.compose(R.concat(rows), R.prop('rows'))
})


const reducer = (state = _init_state, action) => R.cond([
  [
    R.equals(Product.TYPE.search_more_success),
    () => appendProducts(state)(action.payload)
  ]
  ,
  [
    R.equals(Product.TYPE.search_successfully),
    () => action.payload
  ]
  ,
  [ R.T, R.always(state) ]
])(action.type)


export default reducer
