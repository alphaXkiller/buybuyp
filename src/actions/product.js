import Bluebird from 'bluebird'
import R        from 'ramda'

import Api from '../lib/restful.js'

const TYPE = {
  image_upload_pending        : 'image_upload_pending',
  image_upload_success        : 'image_upload_successfully',
  post_product_pending        : 'post_product_pending',
  post_product_success        : 'post_product_successfully',
  get_product_details_pending : 'get_product_details_pending',
  get_product_details_success : 'get_product_details_successfully',
  search_pending              : 'search_pending',
  search_successfully         : 'search_successfully',
  search_more_pending         : 'search_more_pending',
  search_more_success         : 'search_more_successfully',

  // ==========
  //  empty product state
  // ==========
  empty_posted_product: 'empty_posted_product'
}

// ===========================
//  upload product image
// ===========================
const imageUploadStart = () => ({ type: TYPE.image_upload_pending })


const imageUploadSuccessfully = payload => ({ 
  type: TYPE.image_upload_success, payload 
})


const uploadImage = images => (dispatch, getState) =>
  Bluebird.resolve(dispatch(imageUploadStart()))

  .then(() => Api({path: 'image', method: 'post', body: images}))

  .then(R.prop('data'))

  .tap( result => dispatch(imageUploadSuccessfully(result.data)))

  .catch(console.log)


// ===========================
// post product
// ===========================
const postProductStart = () => ({ type: TYPE.post_product_pending })


const postProductSuccessfully = payload => ({
  type: TYPE.post_product_success, payload
})


const postProduct = ({form_value, image_files}) => (dispatch, getState) =>
  Bluebird.resolve(dispatch(postProductStart()))

  .then(() => uploadImage(image_files)(dispatch, getState))

  .then( R.compose(R.merge(form_value), R.objOf('image_ids'), R.pluck('id')) )

  .then( body => Api({method: 'post', path: 'user_product', body}) )

  .tap( result => dispatch(postProductSuccessfully(result.data)) )

  .catch(console.log)


// ===========================
// empty posted product
// ===========================
const emptyPostedProductStart = () => ({ type: TYPE.empty_posted_product })

const emptyPostedProduct = (dispatch, getState) =>
  dispatch(emptyPostedProductStart())


// ===========================
// get product detials
// ===========================
const getProductDetailsStart = () => ({
  type: TYPE.get_product_details_pending 
})


const getProductDetailsSuccessfully = payload => ({
  type: TYPE.get_product_details_success, payload
})


const getProductDetails = ({id}) => (dispatch, getState) =>
  Bluebird.resolve(dispatch(getProductDetailsStart()))

  .then( () => Api({
    method: 'get',
    path: 'user_product_details',
    keys: { id }
  }))

  .then( product =>  dispatch(getProductDetailsSuccessfully(product.data)))


const public_getProductDetails = ({id}) => (dispatch, getState) =>
  Bluebird.resolve(dispatch(getProductDetailsStart()))

  .then( () => Api({
    method: 'get',
    path: 'product_details',
    keys: { id }
  }))

  .then( product =>  dispatch(getProductDetailsSuccessfully(product.data)))


// =============================================================================
// =============================================================================
// LOGGIN NOT REQUIRED
// =============================================================================
// =============================================================================


// ===========================
// _search
// ===========================
const _search = query => Api({
  method: 'get',
  path:'product_search',
  query
})


// ===========================
// search product init action
// ===========================
const searchStart = () => ({ type: TYPE.search_pending })

const searchSuccessfully = payload => ({
  type: TYPE.search_successfully, 
  payload 
})

const search = query => (dispatch, getState) => Bluebird
  .resolve(dispatch(searchStart()))

  .then( () => _search(query) )

  .then( product => dispatch(searchSuccessfully(product.data)) )


// ===========================
// search product more action
// ===========================
const searchMoreStart = () => ({ type: TYPE.search_pending })

const searchMoreSuccessfully = payload => ({
  type: TYPE.search_more_success, 
  payload
})

const searchMore = query => (dispatch, getState) => Bluebird
  .resolve(dispatch(searchMoreStart()))

  .then( () => _search(query))

  .then( product => dispatch(searchMoreSuccessfully(product.data)) )


export default {
  TYPE,
  emptyPostedProduct,
  getProductDetails,
  search,
  searchMore,
  postProduct,
  uploadImage,
  public_getProductDetails
}

