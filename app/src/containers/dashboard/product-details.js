import R                    from 'ramda'
import React, { Component } from 'react'
import { connect }          from 'react-redux'

import { Product }    from '../../actions/index.js'
import { nilOrEmpty } from '../../lib/helpers.js'

const initMap = address => {
  const map = new google.maps.Map(
    document.getElementById('map'), 
    {
      zoom: 11, center: {lat: -34.397, lng: 150.644}
    }
  ) 
  const geocoder = new google.maps.Geocoder()

  geocoder.geocode({address}, (results, status) => {
    if (status === 'OK') {
      map.setCenter(results[0].geometry.location)
      const marker = new google.maps.Marker({
        position: results[0].geometry.location, map
      })
    }
  })
}

class DProductDetails extends Component {
  componentDidUpdate() {
    if (this.props.product) initMap(this.props.product.address)
  }


  componentDidMount() {
    if (this.props.product) initMap(this.props.product.address)
    if (nilOrEmpty(this.props.product)) {
      this.props.getProductDetails(this.props.product_id)
    }
  }


  render() {
    const product = R.pathOr({}, ['props', 'product'])(this)

    return (
      <div className='container'>
        <h4 className='col-12'>Dashboard Product Detail</h4>
        <artcle>
          <h5>{product.name} - {product.price}</h5>
          {
            R.map(
              image => <img key={image.path} src={image.path} style={{width:'100%'}}/>
            )(R.pathOr([], ['images'])(product))
          }
          <div id='map' style={{height: '300px'}} />
        </artcle>
        <p style={{overflowWrap: 'break-word'}}>{this.props.product_details}</p>
      </div>
    )
  }
}


const mapStateToProps = ( state, props ) => ({
  product_id: props.match.params.id,
  product: R.when(
    nilOrEmpty, R.always(state.Product.details)
  )(state.Product.posted)
})


const mapDispatchToProps = dispatch => ({
  getProductDetails: (id) => dispatch(Product.getProductDetails({id}))
})


export default connect(mapStateToProps, mapDispatchToProps)(DProductDetails)
