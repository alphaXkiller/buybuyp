import R           from 'ramda'
import React       from 'react'
import { connect } from 'react-redux'

import AppBar             from 'material-ui/AppBar'
import Avatar             from 'material-ui/Avatar'
import CloseIcon          from 'material-ui/svg-icons/navigation/close'
import BackArrowIcon      from 'material-ui/svg-icons/navigation/chevron-left'
import IconButton         from 'material-ui/IconButton'
import { List, ListItem } from 'material-ui/List'

import { ref } from '../../../lib/firebase.js'

const _renderTargetUser = target_user => (
  <div className='container h-100'>
    <div className='row h-100'>
      <Avatar className='align-self-center' src={target_user.profile_image}/>
      <p>{target_user.name}</p>
    </div>
  </div>
)


class ChatBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      to_chat_room : R.defaultTo(false, props.to_chat_room),
      target_user  : R.defaultTo({}, props.target_user),
      message      : ''
    }
  }


  componentDidMount() {
    // console.log(ref)
    // ref.database.ref('messages/name_name').push().set({
    //   message: 'first message'
    // })
  }


  toChat = target_user => e => this.setState({
    to_chat_room: true, target_user
  })


  backToChatList = () => this.setState({
    to_chat_room: false, 
    target_user: {}
  })


  sendMsg = e => {
    // e.preventDefault()
  }


  onUpdateMsg = e => {
  }


  renderChatRoom = () => {
    return (
      <div>
        <form className='chat-input' onSubmit={this.sendMsg}>
          <pre>{this.state.message}</pre>
          <textarea 
            placeholder='Type a message'
            onChange={this.onUpdateMsg}
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
        <List>
          {
            this.state.to_chat_room ?
              this.renderChatRoom()
            : R.map( target_user => <ListItem
                key={target_user.uid}
                primaryText={target_user.name}
                leftAvatar={<Avatar src={target_user.profile_image} />}
                secondaryText={<p>I wanna buy all your work</p>}
                onTouchTap={this.toChat(target_user)}
              /> )(this.props.chats)
          }
        </List>
      </div>
    )
  }
}


const mapStateToProps = (state, props) => ({
  chats: state.Chats.rows,
  chats_count: state.Chats.count
})


const mapDispatchToProps = (dispatch, getState) => ({

})


export default connect(mapStateToProps, mapDispatchToProps)(ChatBox)
