import R                                     from 'ramda'
import React                                 from 'react'
import { List, ListItem }                    from 'material-ui/List'
import Subheader                             from 'material-ui/Subheader'
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover'
import ChatBubble                            from 'material-ui/svg-icons/communication/chat-bubble'


const Chat = props => {

  return (
    <div>

    {
      R.map(message =>
        <div> {`${message.user}: ${message.text}`} </div>
      )(props.messages)
    }

    </div>
  )
}


export default Chat