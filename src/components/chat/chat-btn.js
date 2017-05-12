import R from 'ramda'
import React from 'react'

import ChatIcon             from 'material-ui/svg-icons/communication/chat'
import FloatingActionButton from 'material-ui/FloatingActionButton'

import Chat from './chat.js'

class ChatBtn extends React.Component {
  constructor() {
    super()
    this.state = {
      is_open: false
    }
  }

  toggleChatbox = e => {
    this.setState({ is_open: !this.state.is_open })
  }


  render() {
    return (
      <div >
        {
          this.state.is_open ?
            <Chat onClickClose={this.toggleChatbox}/>
          : null
        }
        <FloatingActionButton
          className='chat-icon' 
          onTouchTap={this.toggleChatbox}
        >
          <ChatIcon />
        </FloatingActionButton>
      </div>
    )
  }
}

export default ChatBtn
