import R        from 'ramda'
import React    from 'react'
import { Link } from 'react-router-dom'
import Divider  from 'material-ui/Divider'
import Avatar   from 'material-ui/Avatar'

import { mapIndexed } from '../lib/helpers.js'

const COLUMNS = 3

const _getFeatureImage = id => R.compose(
  R.path(['path']),
  R.find(R.propEq('id', id))
)

const _renderProduct = product => (
  <div
    key={product.id}
    className='col-sm-6 col-md-4 mt-4'
  >
    <div className='hoverable'>
      <Link to={`/product/details/${product.id}`}>
        <div 
          style={{
            background: `url(${_getFeatureImage(product.feature_image_id)(
              product.images)}) no-repeat center center`,
            backgroundSize: 'cover',
            height: '200px'
          }}
        />
        <div className='text-center mt-3'>
          <div className='p-3'>
            <h4>{product.name}</h4>
            <p>{product.description}</p>
          </div>
          <Divider />
          <div className='container'>
            <div className='row align-items-center justify-content-between p-2'>
              <p>${product.price}</p>
              <div>
                <Avatar src={product.user.profile_image}/>
              </div>
            </div>
          </div>
        </div>
      </Link>
      </div>
  </div>
)


const _renderProductGroup = (list, index) => (
  <div key={index} className="row">{R.map(_renderProduct)(list)}</div>
)

const ProductList = R.compose(
  mapIndexed(_renderProductGroup),
  R.splitEvery(COLUMNS)
)


export default ProductList
