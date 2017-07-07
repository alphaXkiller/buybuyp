import R           from 'ramda'
import React       from 'react'
import { connect } from 'react-redux'
import { Link }    from 'react-router-dom'

import Menu         from 'material-ui/Menu'
import Drawer       from 'material-ui/Drawer'
import Divider      from 'material-ui/Divider'
import MenuItem     from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton   from 'material-ui/FlatButton'
import CatIcon      from 'material-ui/svg-icons/image/color-lens'
import HomeIcon     from 'material-ui/svg-icons/action/home'
import ShopIcon     from 'material-ui/svg-icons/action/shopping-cart'

import {
  List, 
  ListItem
} from 'material-ui/List'
import { 
  Card, 
  CardHeader, 
  CardActions
} from 'material-ui/Card'

import { nilOrEmpty, notNil, mapIndexed } from '../lib/helpers.js'
import { ProductCategory } from '../actions/index.js'

const _renderUser = user => (
  <Card
    containerStyle={{display: 'flex', alignItems: 'center'}}
  >
    <CardHeader
      title={user.name}
      avatar={user.profile_image}
      textStyle={{verticalAlign: 'middle'}}
    />
  </Card>
)
  

const _renderCategory = onClickFn => (category, index) => (
  <ListItem
    key={index} 
    primaryText={category.name}
    onTouchTap={onClickFn}
    containerElement={
      <Link to={{
        pathname : '/',
        search   : `?cid=${category.id}`
      }} replace/>
    }
  />
)


const Nav = props => {
  const is_user_login = notNil(props.user.uid)

  return (
    <Drawer 
      width={280}
      open={props.show_menu}
      docked={false}
      onRequestChange={props.onClickHideMenu}
      containerStyle={{
        overflowX: 'hidden'
      }}
      containerClassName='drawer-container'
    >
      { is_user_login ? _renderUser(props.user) : null }
      <Menu style={{height: '100%', overflowY: 'auto'}}>
        <Link to='/' onTouchTap={props.onClickHideMenu} >
          <MenuItem primaryText='Home' leftIcon={<HomeIcon />} />
        </Link>
        <ListItem 
          primaryText='Category' 
          leftIcon={<CatIcon />}
          primaryTogglesNestedList={true}
          nestedItems={ mapIndexed(
            _renderCategory(props.onClickHideMenu)
          )(props.categories) }
        />
      </Menu>
      <Link to='/dashboard/sell' onTouchTap={props.onClickHideMenu}>
        <Divider />
        <MenuItem primaryText='Sell' leftIcon={<ShopIcon />}/>
      </Link>

    </Drawer>
  )
}


export default Nav
