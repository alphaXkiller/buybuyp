import R from 'ramda'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, CardHeader, CardMedia } from 'material-ui/Card'

import { Product } from '../../actions/index.js'

class ProductDetails extends Component {
  componentDidMount = () => {
    this.props.getProductDetails(this.props.product_id)
  }

  render = () => (
    <div>
      <Card>
        <CardHeader 
          title={this.props.product.name}
          avatar={this.props.owner.profile_image}
        />
        <CardMedia style={{padding: '10px'}}>
          {
            R.map( image => 
              <img key={image.id} src={image.path} /> 
            )(this.props.product.images)
          }
        </CardMedia>
      </Card>
    </div>
  )
}


const mapStateToProps = ( state, props ) => ({
  owner: R.path(['Product', 'details', 'user'])(state),
  product_id: props.match.params.id,
  product: state.Product.details
})


const mapDispatchToProps = dispatch => ({
  getProductDetails: id => dispatch(Product.public_getProductDetails({id}))
})


ProductDetails.defaultProps = {
  owner: {},
  product: {
    images: []
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails)
