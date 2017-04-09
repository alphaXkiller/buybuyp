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

const DEFAULT_LIMIT = 2;

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
  constructor() {
    super()
    this.state = {
      keyword: ''
    }
  }


  componentDidMount() {
    this.props.searchProduct({ page: 1, limit: DEFAULT_LIMIT })
  }


  onClickLoadMoreProducts = e => {
    this.props.searchProductMore({
      page    : R.inc(this.props.page),
      limit   : DEFAULT_LIMIT,
      keyword : this.state.keyword
    }) 
  }


  updateKeyword = (keyword) => {
    this.setState({keyword}, () =>
      this.props.searchProduct({page: 1, limit: DEFAULT_LIMIT , keyword}) 
    )
  }


  render() {
    return (
      <div>
        <div className='landing-background' />
        <div className='container'>
          <AutoComplete
            fullWidth
            floatingLabelText='Search'
            dataSource={[]}
            autoComplete='off'
            onNewRequest={this.updateKeyword}
          />
          { _renderProductList(this.props.product_list) }
          <div className='d-flex col-sm-12 justify-content-center p-4'>
            <FloatingActionButton
              onTouchTap={this.onClickLoadMoreProducts}
            >
              <ContentAdd/>
            </FloatingActionButton>
          </div>
        </div>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  product_list: state.ProductSearch.rows,
  product_count: state.ProductSearch.count,
  page: R.path(['ProductSearch', 'params', 'page'])(state)
})


const mapDispatchToProps = dispatch => ({
  searchProduct: query => dispatch(Product.search(query)),
  searchProductMore: query => dispatch(Product.searchMore(query))
})


Home.defaultProps = {
  product_list: [],
  product_count: 0
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
