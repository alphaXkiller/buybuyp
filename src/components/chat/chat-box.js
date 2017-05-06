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
  notNil,
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
      message_text : '',
      at_bottom    : true
    }
  }

  componentDidMount() {
    // Enter chatroom from other entry other than chat list
    if (this.state.to_chat_room) {
      this.props.searchMsg([this.props.user.uid, this.state.target_user.uid], {
        init: true
      })
    }

    document.querySelector('body').classList.add('overflow-hidden')
  }

  componentWillUnmount() {
    if (this.state.to_chat_room)
      document.querySelector('body').classList.remove('overflow-hidden')
  }


  componentDidUpdate(prevProps, prevState) {
    const updated_msgs  = this.props.messages
    const prev_msgs     = prevProps.messages
    const last_msg      = R.last(updated_msgs)
    const prev_last_msg = R.last(prev_msgs)
    const has_new_msg   = notEquals(last_msg, prev_last_msg)
    const ids           = [this.props.user.uid, this.state.target_user.uid]
    const iAmSender     = last_msg ? 
      last_msg.speaker_uid === this.props.user.uid : false

    const atChatBottom  = R.when(
      notNil,
      el => el.scrollHeight - el.scrollTop === el.clientHeight
    )(document.querySelector('#chat-conversation'))

    // Enter chatroom from chat list
    if (this.state.to_chat_room && !prevState.to_chat_room) {
      this.props.searchMsg(ids, { init: true})
      document.querySelector('body').classList.add('overflow-hidden')
    }

    if (this.state.to_chat_room && updated_msgs.length > 0) {
      const conv_block = document.querySelector('#chat-conversation')
      
      // TODO: DEBOUNCE THIS SHIT!!!
      conv_block.addEventListener('scroll', () => {
        if (conv_block.scrollTop == 0) {
          this.props.loadMoreMsg(ids, {
            endAt: R.prop('id', R.head(updated_msgs))
          })
        }

        // if (conv_block.scrollHeight - conv_block.scrollTop === conv_block.clientHeight)
        //   this.setState({at_bottom: true})
        // else 
        //   this.setState({at_bottom: false})
      })
    }


    // First time entry to a signle chat conversation
    if (updated_msgs.length > 0 && prev_msgs.length === 0) 
      scrollToBotBySelector('#chat-conversation')

    // Login User is the sender
    if (has_new_msg && (iAmSender || this.state.at_bottom))
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
  ),
  loadMoreMsg: (ids, option) => dispatch(Message.loadMore(ids, option))
})


export default connect(mapStateToProps, mapDispatchToProps)(ChatBox)
