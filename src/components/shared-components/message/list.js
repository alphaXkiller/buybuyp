import React                                 from 'react'
import Chat                                  from './chat'
import { List, ListItem }                    from 'material-ui/List'
import Subheader                             from 'material-ui/Subheader'
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover'
import ChatBubble                            from 'material-ui/svg-icons/communication/chat-bubble'


const mock_data = [
  { text: 'abc', user: 'jon' },
  { text: 'hello', user: 'frankie' }
]


class MessageList extends React.Component {

  constructor() {
    super()
    this.state = {
      show_message_list : false
    }
  }

  state = { show_message_list: false }

  onClickShowMessageList = () => { this.setState({ show_message_list: true }) }
  onClickHideMessageList = () => { this.setState({ show_message_list: false }) }

  render() {
    return (

      <button className='buybuy-btn' onTouchTap={this.onClickShowMessageList}>

        <i id='chat-bubble'>{<ChatBubble />}</i>

        <Popover
          open           = {this.state.show_message_list}
          anchorEl       = {document.getElementById('chat-bubble')}
          onRequestClose = {this.onClickHideMessageList}
          animated       = {false}
          animation      = {PopoverAnimationVertical}>

          <List>

            <Subheader>Recent Chats</Subheader>
            
            <ListItem
              primaryText = "Mariah Cabrera"
              rightIcon   = {<ChatBubble/>}
              initiallyOpen = {false}
              primaryTogglesNestedList = {true}
              nestedItems = {[]}
            />

            <ListItem
              primaryText = "Frankie Huang"
              rightIcon   = {<ChatBubble/>}
              initiallyOpen = {false}
              primaryTogglesNestedList = {true}
              nestedItems = {[

                <ListItem key={1}>
                {
                  Chat({
                    other_user_id : "frankie",
                    messages      : mock_data
                  })
                }
                </ListItem>

              ]}
            />

          </List>

        </Popover>

      </button>
    )
  }
}


export default MessageList