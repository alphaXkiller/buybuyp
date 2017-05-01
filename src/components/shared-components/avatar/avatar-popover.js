import R       from 'ramda'
import React   from 'react'

import Avatar   from 'material-ui/Avatar'
import Popover  from 'material-ui/Popover'
import Menu     from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'

class AvatarPopover extends React.Component {
  constructor() {
    super()
    this.state = {
      is_open: false
    }
  }


  openPopover = e => {
    e.preventDefault()
    this.setState({
      is_open: true,
      anchorEl: e.currentTarget,
    })
  }


  closePopover = reason => {
    console.log('here')
    if (reason === 'clickAway')
      this.setState({is_open: false})
  }


  onClickChatBtn = e => {
    this.setState({is_open: false}, () => {
      this.props.startChatting(this.props.user)
    })
  }


  render() {
    return (
      <div>
        <Avatar
          src={this.props.user.profile_image}
          onTouchTap={this.openPopover}
        />
        <Popover
          open={this.state.is_open}
          anchorEl={this.state.anchorEl}
          onRequestClose={this.closePopover}
        >
          <Menu>
            <MenuItem primaryText='Details' />
            <MenuItem 
              primaryText='Chat' 
              onTouchTap={this.onClickChatBtn}
            />
          </Menu>
        </Popover>
      </div>
    )
  }
}


export default AvatarPopover
