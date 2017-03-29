import R from 'ramda'
import React, { Component } from 'react'
import { connect }          from 'react-redux'
import { Link } from 'react-router-dom'

import AutoComplete         from 'material-ui/Autocomplete'
import Divider              from 'material-ui/Divider'
import Avatar               from 'material-ui/Avatar'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'

import { Product } from '../../actions/index.js'
import { mapIndexed } from '../../lib/helpers.js'
import './home.scss'


const _renderProduct = product => (
  <div
    key={product.id}
    className='col-sm-6 col-md-4 mt-4'
  >
    <div className='hoverable'>
      <Link to={`/product/${product.id}`}>
        <div 
          style={{
            background: `url(${product.images[0].path}) no-repeat center center`,
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
  <div key={index} className='row'>{R.map(_renderProduct)(list)}</div>
)


const _renderProductList = R.compose(
  mapIndexed(_renderProductGroup),
  R.splitEvery(3)
)


class Home extends Component {
  componentDidMount() {
    this.props.getProductList({ page: 1, keyword: '' })
  }


  render() {
    return (
      <div>
        <div className='landing-background' />
        <div className='container'>
          <form onSubmit={ e => e.preventDefault() }>
            {
              /* 
               * This Autocomplete will cause some padding issue 
               * when refresing page
               * */
            }
            <AutoComplete
              fullWidth
              floatingLabelText='Search'
              dataSource={[]}
              autoComplete='off'
            />
          </form>
          { _renderProductList(this.props.product_list) }
          <div className='d-flex col-sm-12 justify-content-center p-4'>
            <FloatingActionButton><ContentAdd/></FloatingActionButton>
          </div>
        </div>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  product_list: state.Product.rows,
  product_count: state.Product.count
})


const mapDispatchToProps = dispatch => ({
  getProductList: ({page, keyword}) => dispatch(
    Product.search({page, keyword})
  )
})


Home.defaultProps = {
  product_list: [],
  product_count: 0
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
