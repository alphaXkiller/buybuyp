import R           from 'ramda'
import React       from 'react'
import { connect } from 'react-redux'

import ProductList from '../../components/product-list.js'
import SearchBar   from '../../components/search-bar.js'

import { Product } from '../../actions/index.js'
import { notEquals } from '../../lib/helpers.js'

const START_INDEX = 1

class ProductSearch extends React.Component {
  constructor() {
    super()
    this.state = {
      loading: true
    }
  }


  componentDidMount() {
    this.props.searchProduct(this.props.query)
  }


  componentDidUpdate(prev_props){
    if (notEquals(prev_props.query, this.props.query))
      this.setState({loading: true}, () => this.props.searchProduct(
        this.props.query)
      )
      

    if (prev_props.products !== this.props.products)
      this.setState({loading: false})
  }


  render() {
    return(
      <div className='container'>
        <SearchBar {...this.props}/>
        { 
          this.state.loading ? 
            <div className='loading-primary'/> 
          : ProductList(this.props.products)
        }
      </div>
    )
  }
}


const mapStateToProps = (state, props) => ({
  products: state.ProductSearch.rows
})


const mapDispatchToProps = dispatch => ({
  searchProduct: query => dispatch(Product.search(query))
})


export default connect(mapStateToProps, mapDispatchToProps)(ProductSearch)
