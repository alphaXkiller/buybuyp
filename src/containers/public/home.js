import R from 'ramda'
import React, { Component } from 'react'
import { connect }          from 'react-redux'
import { Link } from 'react-router-dom'

import AutoComplete from 'material-ui/Autocomplete'
import { 
  CardHeader, 
  CardMedia, 
  CardTitle 
} from 'material-ui/Card'

import { Product } from '../../actions/index.js'
import './home.scss'


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
          <div className='row'>
            {
              R.map( product => (
                <div 
                  key={product.id}
                  className='col-sm-6 col-md-4 hoverable'
                >
                  <CardHeader
                    title={product.user.name}
                    avatar={product.user.profile_image}
                    style={{padding: '10px 5px'}}
                    textStyle={{verticalAlign: 'middle'}}
                  />
                  <Link to={`/product/${product.id}`}>
                    <CardMedia>
                      <img src={product.images[0].path} height='150px'/>
                    </CardMedia>
                    <div className='d-flex justify-content-start'>
                      <p className='p-2'>{product.name}</p>
                      <p className='ml-auto p-2'>${product.price}</p>
                    </div>
                  </Link>
                </div>
              ))(this.props.product_list)
            }
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
