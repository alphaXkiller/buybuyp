import R           from 'ramda'
import React       from 'react'
import { connect } from 'react-redux'
import Moment      from 'moment'

import { List, ListItem } from 'material-ui/List'
import Avatar             from 'material-ui/Avatar'
import Textarea           from '../shared-components/input/textarea.js'

import { DOM }     from '../../lib/helpers/index.js'
import { Contact } from '../../actions/index.js'

const MESSAGE_HEIGHT = 60 

const isChatting = element => R.compose(
  R.equals(element.clientHeight + MESSAGE_HEIGHT),
  R.apply(R.subtract),
  R.props(['scrollHeight', 'scrollTop'])
)(element)



const getConversation = target_uid => R.compose(
  R.ifElse(
    R.complement(R.isNil),
    R.prop('conversation'),
    R.always([])
  ),
  R.find(R.propEq('uid', target_uid))
)


const renderConversation = (sender, recipient) => message => (
  <ListItem
    className='chat-message'
    key={message.id}
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


class ChatRoom extends React.Component {
  constructor() {
    super()
    this.state = {
      text: '',
      conversation_window: {},
      scroll_height: 0,
      loading_more_msg: false
    }
  }


  componentDidMount() {
    DOM.scrollToBotBySelector('#chat-conversation') 
    this.props.listenOnNewMsg()

    this.setState({ 
      conversation_window: document.querySelector('#chat-conversation') 
    }, () => this.state.conversation_window.addEventListener(
      'scroll', this.infiniteScroll)
    )
  }


  componentDidUpdate(prevProps, prevState) {
    if (isChatting(this.state.conversation_window))
      DOM.scrollToBotBySelector('#chat-conversation') 

    if (this.state.loading_more_msg)
      this.state.conversation_window.scrollTop = R.subtract(
        this.state.conversation_window.scrollHeight, this.state.scroll_height
      )
  }


  componentWillUnmount() {
    //TODO: STOP LISTENING ON NEW MSG
  }


  infiniteScroll = e => {
    if (this.state.conversation_window.scrollTop === 0) 
      this.setState({ 
        loading_more_msg: true,
        scroll_height: this.state.conversation_window.scrollHeight
      }, () => this.props.loadMoreMsg() )
  }


  onInputMsg = e => {
    this.setState({text: e.target.value})
  }


  sendMsg = e => {
    e.preventDefault()
    this.props.sendMsg({
      text        : this.state.text,
      speaker_uid : this.props.user.uid,
      timestamp   : Moment.utc().valueOf()
    })
  }


  render() {
    return (
      <div className='chat-room'>
        <div id='chat-conversation' className='chat-conversation'>
          <List>
            {
              R.map(
                renderConversation(this.props.user, this.props.target_user)
              )(this.props.conversation)
            }
          </List>
        </div>
        <form className='chat-input'>
          <Textarea 
            placeholder='Type a message'
            onChange={this.onInputMsg}
            submitFn={this.sendMsg}
          />
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  user: state.User,
  target_user: props.target_user,
  conversation: getConversation(props.target_user.uid)(state.Contact.rows)
})


const mapDispatchToProps = (dispatch, props) => ({
  listenOnNewMsg: () => dispatch(
    Contact.listenOnNewMsg(props.target_user.uid)
  ),
  sendMsg: context => dispatch(
    Contact.sendMsg(props.target_user.uid, context)
  ),
  loadMoreMsg: () => dispatch(
    Contact.loadMoreMsg(props.target_user.uid)
  )
})


export default connect(mapStateToProps, mapDispatchToProps)(ChatRoom)
