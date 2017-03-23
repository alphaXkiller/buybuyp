import R        from 'ramda'
import React    from 'react'
import { Link } from 'react-router-dom'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import Popover from 'material-ui/Popover'

import './header.scss'

const Header = props => {
  return (
    <header>
      <div
        className={
          R.join(' ', [
            'navbar navbar-trans',
            'fixed-top justify-content-between flex-row',
            props.show_header_color ? ' bg-color' : ''
          ])
        }
        >
        <button
          className='buybuy-btn'
          onTouchTap={props.onClickShowNav}
        >
          <i className='fa fa-bars fa-lg'></i>
        </button>
        <Link to='/' style={{fontSize: '20px'}}>Buy Buy</Link>
        <button 
          id='header-user'
          className='buybuy-btn' 
          onTouchTap={props.onClickOpenUserMenu}
        >
          <i className='fa fa-user-o fa-lg' />
          <Popover
            open={props.open_user_menu}
            onRequestClose={props.onClickCloseUserMenu}
            anchorEl={document.getElementById('header-user')}
            animated={false}
          >
            <Menu>
              <Link 
                to='/login' 
                onClick={ e => props.onClickCloseUserMenu('clickAway') }
              >
                <MenuItem primaryText='Log in' />
              </Link>
              <Link 
                to='/signup' 
                onClick={ e => props.onClickCloseUserMenu('clickAway') }
              >
                <MenuItem primaryText='Sign up' />
              </Link>
            </Menu>
          </Popover>
        </button>
      </div>
    </header>
  )
}


export default Header
