import R            from 'ramda'
import React        from 'react'
import Menu         from 'material-ui/Menu'
import Paper        from 'material-ui/Paper'
import Divider      from 'material-ui/Divider'
import MenuItem     from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton   from 'material-ui/FlatButton'
import { Link }     from 'react-router-dom'
import { 
  Card, 
  CardHeader, 
  CardActions
} from 'material-ui/Card'

import Signup from '../shared-components/form/signup.js'
import Login  from '../shared-components/form/login.js'

import { nilOrEmpty } from '../../lib/helpers.js'

import './nav.scss'


const _renderUser = (user, logout) => (
  <Card
    containerStyle={{display: 'flex', alignItems: 'center'}}
  >
    <CardHeader
      title={user.name}
      avatar={user.profile_image}
      textStyle={{verticalAlign: 'middle'}}
    />
    <CardActions onTouchTap={logout}>
      <i className='fa fa-sign-out' />
    </CardActions>
  </Card>
)
  
const _renderLoginBtn = ({toggleLogin, toggleSignup}) => (
  <div className='no-gutters'>
    <RaisedButton 
      label='Log In' 
      className='col-6' 
      style={{paddingRight: '1px'}}
      onTouchTap={toggleLogin}
    />
    <RaisedButton 
      label='Sign up' 
      className='col-6' 
      style={{paddingLeft: '1px'}}
      onTouchTap={toggleSignup}
    />
  </div>
)

const Nav = props => {
  return (
    <nav className='nav-main'>
      <Menu>
        <div className='d-flex flex-row-reverse' onTouchTap={props.onClickHideMenu}>
          <i className='fa fa-times' style={{width: '40px'}}></i>
        </div>
        <Divider />
        <MenuItem primaryText="Item" />
        <MenuItem primaryText="Item" />
        <MenuItem primaryText="Item" />
        <MenuItem primaryText="Item" />
      </Menu>
      <div className='mt-auto'>
        <Link to='/dashboard/sell' onClick={props.onClickHideMenu}>
          <RaisedButton 
            label='Sell Your Shitssss' 
            secondary={true} 
            fullWidth={true}
          />
        </Link>
        {
          R.path(['user', 'id'])(props) ?
            _renderUser(props.user, props.logout) 
            : _renderLoginBtn({
              toggleLogin: props.onClickToggleLogin,
              toggleSignup: props.onClickToggleSignup
            })
        }
      </div>
      <Login show_login={props.show_login}/>
      <Signup show_signup={props.show_signup}/>
   </nav>
  )
}


export default Nav
