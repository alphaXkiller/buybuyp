import Bluebird from 'bluebird'

import Api from '../lib/restful.js'


const TYPE = {
  get_all_pending: 'get_all_pending',
  get_all_success: 'get_all_success'
}


const getProductCategoryStart = () => ({ 
  type: TYPE.get_all_pending
})


const getProductCategorySuccessfully = payload => ({
  type: TYPE.get_all_success,
  payload
})


const getAll = (dispatch, getState) => Bluebird
  .resolve(dispatch(getProductCategoryStart))

  .then( () => Api({path: 'product_category', method: 'get'}) )

  .tap( category => dispatch(getProductCategorySuccessfully(category.data)) )


export default {
  TYPE,

  getAll
}
