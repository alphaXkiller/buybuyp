import R                    from 'ramda'
import React, { Component } from 'react'
import { connect }          from 'react-redux'
import { Link }             from 'react-router-dom'
import AutoComplete         from 'material-ui/Autocomplete'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd           from 'material-ui/svg-icons/content/add'
import ProductList          from '../../components/product-list.js'
import SearchBar            from '../../components/search-bar.js'

import { Product }                  from '../../actions/index.js'
import { notEquals, notNilOrEmpty } from '../../lib/helpers.js'

const DEFAULT_LIMIT = 2;

class Home extends Component {
  constructor() {
    super()
    this.state = {
      keyword: '',
      loading: true
    }
  }


  componentDidMount() {
    this.props.searchProduct(R.merge(
      { page: 1, limit: DEFAULT_LIMIT }, this.props.query
    ))
  }


  componentDidUpdate(prev_props, prev_state) {
    if (this.props.product_list !== [] && this.state.loading)
      this.setState({loading: false})

    if (!R.equals(this.props.query, prev_props.query))
      this.setState({loading: true}, () => 
        this.props.searchProduct(R.merge(this.props.query, {limit: DEFAULT_LIMIT}))
      )
  }


  onClickLoadMoreProducts = e => {
    this.props.searchProductMore({
      page    : R.inc(this.props.page),
      limit   : DEFAULT_LIMIT,
      keyword : this.state.keyword
    }) 
  }


  render() {
    return (
      <div>
        { 
          this.props.is_categorized ?
            <h1>{this.props.query.cid}</h1>
          : <div className='landing-background' />
        }
        <div className='container'>
          <SearchBar {...this.props} />
          { 
            this.state.loading ?
              <div className='loading-primary' />
            : ProductList(this.props.product_list) 
          }
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


const mapStateToProps = (state, props) => ({
  is_categorized: notNilOrEmpty(props.query.cid),
  product_list  : state.ProductSearch.rows,
  product_count : state.ProductSearch.count,
  category      : state.ProductCategory,
  page          : R.path(['ProductSearch', 'params', 'page'])(state)
})


const mapDispatchToProps = dispatch => ({
  searchProduct     : query => dispatch(Product.search(query)),
  searchProductMore : query => dispatch(Product.searchMore(query))
})


Home.defaultProps = {
  product_list: [],
  product_count: 0
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
