import R                    from 'ramda'
import React, { Component } from 'react'
import { connect }          from 'react-redux'

import { Product }    from '../../actions/index.js'
import { nilOrEmpty } from '../../lib/helpers.js'

const style =
  [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#263c3f"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6b9a76"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#38414e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#212a37"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9ca5b3"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#1f2835"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#f3d19c"
      }
    ]
  },
  {
    "featureType": "road.local",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2f3948"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#515c6d"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  }
]

const initMap = address => {
  const map = new google.maps.Map(
    document.getElementById('map'), 
    {
      zoom: 13, center: {lat: 36.107, lng: -115.14}
    }
  ) 

  const style_map_type = new google.maps.StyledMapType(style)
  map.mapTypes.set('styled_map', style_map_type)
  map.setMapTypeId('styled_map')
  // const geocoder = new google.maps.Geocoder()
  
  // geocoder.geocode({address}, (results, status) => {
  //   if (status === 'OK') {
  //     map.setCenter(results[0].geometry.location)
  //     const marker = new google.maps.Marker({
  //       position: results[0].geometry.location, map
  //     })
  //   }
  // })
  //
  const polyCoords = [
    {lat: 36.11465, lng: -115.137706},
    {lat: 36.11465, lng: -115.146203},
    {lat: 36.112605, lng: -115.149572},
    {lat: 36.107855, lng: -115.150151},
    {lat: 36.103694, lng: -115.1491},
    {lat: 36.100712, lng: -115.146332},
    {lat: 36.10092, lng: -115.136869}
  ]

  const polygon = new google.maps.Polygon({
    paths: polyCoords,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35
  })

  polygon.setMap(map)
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
              image => <img key={image.path} src={image.path} style={{width:'100%', height: '350px'}}/>
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
  getProductDetails: id => dispatch(Product.getProductDetails({id}))
})


export default connect(mapStateToProps, mapDispatchToProps)(DProductDetails)
