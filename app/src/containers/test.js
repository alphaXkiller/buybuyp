import R from 'ramda'
import React, { Component } from 'react'

import AutoComplete from 'material-ui/Autocomplete'

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

const initMap = events => {
  const map = new google.maps.Map(
    document.getElementById('map'), 
    {
      zoom: 15, center: {lat: 36.164765, lng: -115.137513}
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
    {lat: 36.168056, lng: -115.131204},
    {lat: 36.17159, lng: -115.139101},
    {lat: 36.166982, lng: -115.14219},
    {lat: 36.168403, lng: -115.145581},
    {lat: 36.166012, lng: -115.146911},
    {lat: 36.164661, lng: -115.143564},
    {lat: 36.163448, lng: -115.144465},
    {lat: 36.160088, lng: -115.136526}
  ]

  const polygon = new google.maps.Polygon({
    paths: polyCoords,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: 'white',
    fillOpacity: 0.35
  })

  polygon.setMap(map)
 
  const marker = new google.maps.Marker({
    position: { lat: 36.16622, lng: -115.140216 },
    map: map,
    title: 'Zedd',
    icon: image
  })

  R.map(event => {
    const marker = new google.maps.Marker(
      R.merge(event, {map})
    )
  })(events)
}

const image = 'http://maps.google.com/mapfiles/kml/pal3/icon39.png'

class Test extends Component {
  state = {
    events: [
      {
        position: {lat: 36.163275, lng: -115.1388},
        icon: image,
        title: 'zedd'
      },
      {
        position: {lat: 36.169269, lng: -115.135839},
        icon: image,
        title: 'zed dead'
      },
      {
        position: {lat: 36.164488, lng: -115.13571},
        icon: image,
        title: 'chainsmoker'
      },
      {
        position: { lat: 36.16622, lng: -115.140216 },
        icon: image,
        title: 'hardwell'
      }
    ]
    ,
    selected_event: {}
  }

  constructor() {
    super()
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('here', this.state.selected_event)
    if (R.complement(R.either(R.isEmpty, R.isNil))(this.state.selected_event))
      initMap([this.state.selected_event])
    // else if (prevState.selected_event === this.state.selected_event)
    //   initMap(this.state.events)
  }

  componentDidMount() {
    initMap(this.state.events)
    navigator.geolocation.getCurrentPosition(console.log)
  }

  submit = e => {
    e.preventDefault()
  }

  onUpdateInput = event => {
    console.log(event)
    this.setState({
      selected_event: R.find(R.propEq('title', event))(this.state.events)
    })
  }

  render() {
    return (
      <div>
        <form onSubmit={this.submit}>
          <AutoComplete
            floatingLabelText='Event'
            autoComplete='off'
            name='event'
            fullWidth
            hintText='zedd'
            onUpdateInput={this.onUpdateInput}
            dataSource={R.pluck('title')(this.state.events)}
          />
        </form>
        <div id='map' style={{height: '500px'}} />
      </div>
    )
  }
}

export default Test
