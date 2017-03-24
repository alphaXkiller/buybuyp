import R        from 'ramda'
import React    from 'react'
import { Link } from 'react-router-dom'
import Menu     from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import Dialog   from 'material-ui/Dialog'
import Avatar   from 'material-ui/Avatar'
import Popover, { PopoverAnimationVertical }  from 'material-ui/Popover'

import LoginForm from '../shared-components/form/login.js'
import './header.scss'

const _renderLoginUser = props => (
  <button>
    <Avatar 
      id='user-avatar' 
      src={props.user.profile_image}
      onTouchTap={props.onClickShowUserMenu}
    />
    <Popover
      open={props.show_user_menu}
      anchorEl={document.getElementById('user-avatar')}
      onRequestClose={props.onClickHideUserMenu}
      animation={PopoverAnimationVertical}
    >
      <Menu>
        <MenuItem primaryText='Dashboard' />
        <MenuItem 
          primaryText='Logout' 
          onTouchTap={props.onClickLogout}
        />
      </Menu>
    </Popover>
  </button>
)



const _renderAnonymousIcon = props => (
  <div>
    <button 
      id='header-user'
      className='buybuy-btn' 
      onTouchTap={props.onClickOpenLoginModal}
    >
      <i className='fa fa-user-o fa-lg' />
    </button>
    <Dialog
      open={props.open_login_modal}
      modal={false}
      onRequestClose={props.onClickCloseLoginModal}
    >
      <LoginForm />
    </Dialog>
  </div>
)


const Header = props => {
  return (
    <header
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
        onTouchTap={props.onClickShowMenu}
      >
        <i className='fa fa-bars fa-lg'></i>
      </button>
      <Link to='/' style={{fontSize: '20px'}}>Buy Buy</Link>
      {
        props.user.uid ?
          _renderLoginUser({
            user                : props.user,
            show_user_menu      : props.show_user_menu,
            onClickLogout       : props.onClickLogout,
            onClickShowUserMenu : props.onClickShowUserMenu,
            onClickHideUserMenu : props.onClickHideUserMenu
          })
        : _renderAnonymousIcon({
          open_login_modal       : props.open_login_modal,
          onClickOpenLoginModal  : props.onClickOpenLoginModal,
          onClickCloseLoginModal : props.onClickCloseLoginModal
        })
      }
    </header>
  )
}


export default Header
