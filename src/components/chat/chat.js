import R     from 'ramda'
import React from 'react'

import Avatar        from 'material-ui/Avatar'
import AppBar        from 'material-ui/AppBar'
import CloseIcon     from 'material-ui/svg-icons/navigation/close'
import IconButton    from 'material-ui/IconButton'
import BackArrowIcon from 'material-ui/svg-icons/navigation/chevron-left'

import ChatRoom from './_chat-room.js'
import ChatList from './_chat-list.js'


const renderTargetUser = target_user => (
  <div className='container h-100'>
    <div className='row h-100'>
      <Avatar className='align-self-center' src={target_user.profile_image}/>
      <p>{target_user.name}</p>
    </div>
  </div>
)


class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      chat_room: R.defaultTo(false, props.chat_room),
      target_user: R.defaultTo({}, props.target_user)
    }
  }

  goChatRoom = target_user => e => this.setState({chat_room: true, target_user})


  goChatList = () => this.setState({chat_room: false, target_user: {}})


  render() {
    return (
      <div className='chatbox'>
        <AppBar
          title={
            this.state.chat_room ?
              renderTargetUser(this.state.target_user)
            : 'CONVERSATIONS'
          }
          onRightIconButtonTouchTap={this.props.onClickClose}
          onLeftIconButtonTouchTap={this.goChatList}
          iconElementLeft={<IconButton><BackArrowIcon/></IconButton>}
          iconElementRight={<IconButton><CloseIcon/></IconButton>}
          showMenuIconButton={this.state.chat_room ? true : false}
        />
        {
          this.state.chat_room ?
            <ChatRoom target_user={this.state.target_user} />
            : <ChatList goChatRoom={this.goChatRoom}/>
        }
      </div>
    )
  }
}

export default Chat
