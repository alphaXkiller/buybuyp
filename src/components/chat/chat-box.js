// Module
import R           from 'ramda'
import React       from 'react'
import { connect } from 'react-redux'
import Moment      from 'moment'

// Component
import AppBar             from 'material-ui/AppBar'
import Avatar             from 'material-ui/Avatar'
import CloseIcon          from 'material-ui/svg-icons/navigation/close'
import BackArrowIcon      from 'material-ui/svg-icons/navigation/chevron-left'
import IconButton         from 'material-ui/IconButton'
import { List, ListItem } from 'material-ui/List'
import Textarea           from '../shared-components/input/textarea.js'

// Library
import { Message } from '../../actions/index.js'
import { 
  notEquals,
  scrollToBotBySelector 
} from '../../lib/helpers.js'


const _renderTargetUser = target_user => (
  <div className='container h-100'>
    <div className='row h-100'>
      <Avatar className='align-self-center' src={target_user.profile_image}/>
      <p>{target_user.name}</p>
    </div>
  </div>
)


const _renderMessage = (sender, recipient) => message => (
  <ListItem
    className='chat-message'
    key={message.timestamp}
    disabled
    primaryText={
      message.speaker_uid === recipient.uid ?
      <div dangerouslySetInnerHTML={{
        // TODO: REFACTOR THESE !!!
        __html: message.text.replace('\n', '<br />')
      }} />
      : <div className='message-right' dangerouslySetInnerHTML={{
        // TODO: REFACTOR THESE !!!
        __html: message.text.replace('\n', '<br />')
      }}/>
    }
    leftAvatar={
      message.speaker_uid === recipient.uid ?
      <Avatar src={recipient.profile_image} /> : null
    }
    rightAvatar={
      message.speaker_uid === sender.uid ?
      <Avatar src={sender.profile_image} /> : null
    }
  />
)


class ChatBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      to_chat_room : R.defaultTo(false, props.to_chat_room),
      target_user  : R.defaultTo({}, props.target_user),
      message_text : ''
    }
  }

  componentDidMount() {
    // Enter chatroom from other entry other than chat list
    if (this.state.to_chat_room) {
      this.props.searchMsg([this.props.user.uid, this.state.target_user.uid], {
        init: true
      })
      document.querySelector('body').classList.add('overflow-hidden')
    }
  }


  componentDidUpdate(prevProps, prevState) {
    const updated_msg = this.props.messages
    const prev_msg    = prevProps.messages
    const has_new_msg = notEquals(R.last(updated_msg), R.last(prev_msg))

    // Enter chatroom from chat list
    if (this.state.to_chat_room && !prevState.to_chat_room) {
      this.props.searchMsg([this.props.user.uid, this.state.target_user.uid], {
        init: true
      })
      document.querySelector('body').classList.add('overflow-hidden')
    }

    // First time entrance to a signle chat conversation
    if (updated_msg.length > 0 && prev_msg.length === 0) 
      scrollToBotBySelector('#chat-conversation')

    // Login User is the sender
    if (has_new_msg && R.last(updated_msg).speaker_uid === this.props.user.uid)
      scrollToBotBySelector('#chat-conversation')

  }


  toChat = target_user => e => this.setState({to_chat_room: true, target_user})


  backToChatList = () => this.setState({
    to_chat_room: false, 
    target_user: {}
  })


  sendMsg = target_user => e => {
    e.preventDefault()
    Message.sendMsg([this.props.user.uid, target_user.uid], {
      text        : this.state.message_text,
      speaker_uid : this.props.user.uid,
      timestamp   : Moment.utc().valueOf()
    })
  }


  onInputMsg = e => {
    this.setState({message_text: e.target.value})
  }


  renderChatRoom = target_user => {
    return (
      <div className='chat-room'>
        <div id='chat-conversation' className='chat-conversation'>
          <List>
            {
              R.map(
                _renderMessage(this.props.user, target_user)
              )(this.props.messages)
            }
          </List>
        </div>
        <form className='chat-input'>
          <Textarea 
            placeholder='Type a message'
            onChange={this.onInputMsg}
            submitFn={this.sendMsg(target_user)}
          />
        </form>
      </div>
    )
  }


  render() {
    return (
      <div className='chatbox'>
        <AppBar
          title={
            this.state.to_chat_room ?
              _renderTargetUser(this.state.target_user)
            : 'CONVERSATIONS'
          }
          onRightIconButtonTouchTap={this.props.onClickClose}
          onLeftIconButtonTouchTap={this.backToChatList}
          iconElementLeft={<IconButton><BackArrowIcon/></IconButton>}
          iconElementRight={<IconButton><CloseIcon/></IconButton>}
          showMenuIconButton={this.state.to_chat_room ? true : false}
        />
        {
          this.state.to_chat_room ?
            this.renderChatRoom(this.state.target_user)
          : <List>{R.map( target_user => <ListItem
              key={target_user.uid}
              primaryText={target_user.name}
              leftAvatar={<Avatar src={target_user.profile_image} />}
              secondaryText={<p>I wanna buy all your work</p>}
              onTouchTap={this.toChat(target_user)}
            /> )(this.props.chats)}</List>
        }
      </div>
    )
  }
}


const mapStateToProps = (state, props) => ({
  user: state.User,
  chats: state.Chat.rows,
  chats_count: state.Chat.count,
  messages: state.Messages
})


const mapDispatchToProps = (dispatch, getState) => ({
  searchMsg: (ids, option) => dispatch(
    Message.getMsg(ids, option)
  )
})


export default connect(mapStateToProps, mapDispatchToProps)(ChatBox)
