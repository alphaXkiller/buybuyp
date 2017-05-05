import R          from 'ramda'
import React      from 'react'
import { Link }   from 'react-router-dom'
import Menu       from 'material-ui/Menu'
import MenuItem   from 'material-ui/MenuItem'
import Dialog     from 'material-ui/Dialog'
import Avatar     from 'material-ui/Avatar'
import ChatBubble from 'material-ui/svg-icons/communication/chat-bubble'
import Popover, { PopoverAnimationVertical }  from 'material-ui/Popover'

import LoginForm from './shared-components/form/login.js'

const _renderLoginUser = props => (
  <button className='btn frameless'>
    <Avatar 
      id='user-avatar' 
      src={props.user.profile_image}
      onTouchTap={props.onClickShowUserMenu}
    />
    <Popover
      open={props.show_user_menu}
      anchorEl={document.getElementById('user-avatar')}
      onRequestClose={props.onClickHideUserMenu}
      animated={false}
      animation={PopoverAnimationVertical}
    >
      <Menu>
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
      className='btn frameless' 
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
          'navbar',
          'fixed-top justify-content-between flex-row',
        ])
      }
    >
      <button
        className='btn frameless'
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
