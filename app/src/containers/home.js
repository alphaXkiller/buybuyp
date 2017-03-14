import React, { Component } from 'react'
import { connect }          from 'react-redux'

import { Card, CardHeader, CardMedia, CardTitle } from 'material-ui/Card'
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

const tilesData = [
    {
          img: 'http://www.material-ui.com/images/grid-list/00-52-29-429_640.jpg',
          title: 'Breakfast',
          author: 'jill111',
          featured: true,
        },
    {
          img: 'http://www.material-ui.com/images/grid-list/burger-827309_640.jpg',
          title: 'Tasty burger',
          author: 'pashminu',
        },
    {
          img: 'http://www.material-ui.com/images/grid-list/camera-813814_640.jpg',
          title: 'Camera',
          author: 'Danson67',
        },
    {
          img: 'http://www.material-ui.com/images/grid-list/morning-819362_640.jpg',
          title: 'Morning',
          author: 'fancycrave1',
          featured: true,
        },
    {
          img: 'http://www.material-ui.com/images/grid-list/hats-829509_640.jpg',
          title: 'Hats',
          author: 'Hans',
        },
    {
          img: 'http://www.material-ui.com/images/grid-list/honey-823614_640.jpg',
          title: 'Honey',
          author: 'fancycravel',
        },
    {
          img: 'http://www.material-ui.com/images/grid-list/vegetables-790022_640.jpg',
          title: 'Vegetables',
          author: 'jill111',
        },
    {
          img: 'http://www.material-ui.com/images/grid-list/water-plant-821293_640.jpg',
          title: 'Water plant',
          author: 'BkrmadtyaKarki',
        },
  ];


class Home extends Component {
  render() {
    return (
      <div className='d-flex flex-column'>
        {
          tilesData.map(
            tile => (
              <Card key={tile.img}>
                <CardHeader
                  title='Poster name'
                  avatar='http://www.material-ui.com/images/jsa-128.jpg'
                  style={{padding: '10px 5px'}}
                  textStyle={{verticalAlign: 'middle'}}
                />
                <CardMedia>
                  <img src={tile.img}/>
                </CardMedia>
                <CardTitle 
                  title={tile.title} 
                  subtitle='$100' 
                  subtitleColor='red'
                />
              </Card>
            )
          )
        }
      </div>
    )
  }
}


const mapStateToProps = state => ({
  user: state.User
})


export default connect(mapStateToProps)(Home)
