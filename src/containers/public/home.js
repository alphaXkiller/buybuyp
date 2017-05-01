import R                    from 'ramda'
import React, { Component } from 'react'
import { connect }          from 'react-redux'
import { Link }             from 'react-router-dom'
import AutoComplete         from 'material-ui/Autocomplete'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd           from 'material-ui/svg-icons/content/add'
import ProductList          from '../../components/product-list.js'
import SearchBar            from '../../components/search-bar.js'
import CatImg               from '../../../img/cat-img.jpg'

import { Product }                  from '../../actions/index.js'
import { notEquals, notNilOrEmpty } from '../../lib/helpers.js'


class Home extends Component {
  constructor() {
    super()
    this.state = {
      keyword: '',
      loading: true
    }
  }


  componentDidMount() {
    this.props.searchProduct(this.props.query)
  }


  componentDidUpdate(prev_props, prev_state) {
    if (this.props.products !== [] && this.state.loading)
      this.setState({loading: false})

    if (!R.equals(this.props.query, prev_props.query))
      this.setState({loading: true}, () => 
        this.props.searchProduct(this.props.query)
      )
  }


  onClickLoadMoreProducts = e => {
    const query = R.compose(
      R.merge(this.props.query),
      R.objOf('page'),
      R.inc
    )(this.props.page)

    this.props.searchProductMore(query) 
  }


  render() {
    return (
      <div>
        { 
          this.props.query.cid ?
            <div>
              <img src={'/assets/' + CatImg} style={{width: '100%'}}/>
              <h1>{this.props.category_name}</h1>
            </div>
          : <div className='landing-background' />
        }
        <div className='container'>
          <SearchBar {...this.props} search={this.props.searchProduct}/>
          { 
            this.state.loading ?
              <div className='loading-primary' />
            : <ProductList products={this.props.products}/>
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
  products  : state.ProductSearch.rows,
  product_count : state.ProductSearch.count,
  category      : state.ProductCategory,
  category_name : R.compose(
    R.path(['name']),
    R.find(
      R.propEq('id', parseInt(props.query.cid, 10))
    )
  )(state.ProductCategory),
  page          : R.path(['ProductSearch', 'params', 'page'])(state)
})


const mapDispatchToProps = dispatch => ({
  searchProduct     : query => dispatch(Product.search(query)),
  searchProductMore : query => dispatch(Product.searchMore(query))
})


Home.defaultProps = {
  products: [],
  product_count: 0
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
