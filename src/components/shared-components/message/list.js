import R                                     from 'ramda'
import React                                 from 'react'
import Chat                                  from './chat'
import { List, ListItem }                    from 'material-ui/List'
import Subheader                             from 'material-ui/Subheader'
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover'
import ChatBubble                            from 'material-ui/svg-icons/communication/chat-bubble'


const mock_data = [
  { text: 'Can you make a leather wallet?', user: 'jon' },
  { text: 'Yes, but it will take me a couple weeks', user: 'frankie' }
]



const MessageListItem = props => {
  return <ListItem
    key                      = { `chat_${props.other_user.name}` }
    primaryText              = { props.other_user.name }
    rightIcon                = { <ChatBubble/> }
    initiallyOpen            = { false }
    primaryTogglesNestedList = { true }
    nestedItems = {[

      <ListItem key={`message_${props.other_user.name}`}>
      {
        Chat({
          other_user_id : props.other_user.name,
          messages      : mock_data
        })
      }
      </ListItem>

    ]}

  />
}
  

const _renderMessageListItem = chat_contact =>
  MessageListItem(chat_contact)

const _hasContacts = R.compose(
  R.not,
  R.isNil,
  R.path(['message', 'chat_contacts'])
)



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

            {
              _hasContacts(this.props)
                ? R.map(MessageListItem, this.props.message.chat_contacts) 
                : null
            }


          </List>

        </Popover>

      </button>
    )
  }
}


export default MessageList