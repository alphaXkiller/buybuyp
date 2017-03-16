import R from 'ramda'
import React, { Component } from 'react'
import { connect }          from 'react-redux'

import { Card, CardHeader, CardMedia, CardTitle } from 'material-ui/Card'

import { Product } from '../actions/index.js'
import './home.scss'

const styles = {
    root: {
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
        },
    gridList: {
          width: 500,
          height: 450,
          overflowY: 'auto',
        },
};


class Home extends Component {
  componentDidMount() {
    this.props.getProductList({ page: 1, keyword: '' })
  }


  render() {
    return (
      <div className='d-flex flex-column'>
        {
          R.map( product => (
            <Card key={product.id}>
              <CardHeader
                title={product.user.name}
                avatar= {product.user.profile_image}
                style={{padding: '10px 5px'}}
                textStyle={{verticalAlign: 'middle'}}
              />
              <CardMedia><img src={product.images[0].path}/></CardMedia>
              <CardTitle 
                title={product.name} 
                subtitle={product.price}
                subtitleColor='red'
              />
            </Card>
          ))(this.props.product_list)
        }
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
