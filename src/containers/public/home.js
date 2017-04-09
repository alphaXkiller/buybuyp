import R                    from 'ramda'
import Qs                   from 'qs'
import React, { Component } from 'react'
import { connect }          from 'react-redux'
import { Link }             from 'react-router-dom'
import AutoComplete         from 'material-ui/Autocomplete'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd           from 'material-ui/svg-icons/content/add'
import ProductList          from '../../components/product-list.js'

import Debounce    from 'lodash/debounce'
import { Product } from '../../actions/index.js'
import { 
  mapIndexed, 
  notEquals,
} from '../../lib/helpers.js'

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
    this.props.searchProduct({ page: 1, limit: DEFAULT_LIMIT })
  }


  componentDidUpdate(prev_props, prev_state) {
    const list_updated = notEquals(
      prev_props.product_list, this.props.product_list
    )
    const keyword_updated = notEquals(
      prev_state.keyword, this.state.keyword
    )

    if (list_updated || keyword_updated)
      this.setState({loading: false})
  }


  onClickLoadMoreProducts = e => {
    this.props.searchProductMore({
      page    : R.inc(this.props.page),
      limit   : DEFAULT_LIMIT,
      keyword : this.state.keyword
    }) 
  }

  // For autocomplete to hit the api later on.
  // Debounce api hit for every keystroke
  // onUpdateInput = Debounce( (text, list, params) => {
  //   this.setState({keyword: text})
  // }, 500 )


  submit = e => {
    e.preventDefault()
    const query = {
      keyword: e.target.keyword.value 
    }

    if (query.keyword !== '') {
      let path = '/product/search?' + Qs.stringify(query)
      this.props.history.push(path)
    }
  }


  render() {
    return (
      <div>
        <div className='landing-background' />
        <div className='container'>
          <form onSubmit={this.submit}>
            <AutoComplete
              name='keyword'
              fullWidth
              floatingLabelText='Search'
              dataSource={[]}
              autoComplete='off'
            />
          </form>
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
