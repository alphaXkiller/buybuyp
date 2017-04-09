import R                    from 'ramda'
import React, { Component } from 'react'
import { connect }          from 'react-redux'
import { Link }             from 'react-router-dom'
import AutoComplete         from 'material-ui/Autocomplete'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd           from 'material-ui/svg-icons/content/add'
import ProductList          from '../../components/product-list.js'

import { Product }    from '../../actions/index.js'
import { mapIndexed } from '../../lib/helpers.js'

const DEFAULT_LIMIT = 2;

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
          { ProductList(this.props.product_list) }
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
