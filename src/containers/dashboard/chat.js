import R           from 'ramda'
import React       from 'react'
import { connect } from 'react-redux'
import { Message } from '../../actions/index.js'


const mock_data = [
  { text: 'abc', user: 'jon' },
  { text: 'hello', user: 'frankie' }
]


const mapStateToProps = (state, props) => ({
  messages: state.message_list
})


const mapDispatchToProps = dispatch => ({
  getMessages: (user_id, other_user_id) =>
    dispatch(Message.getMessagesForUsers(user_id, other_user_id))
})


class Chat extends React.Component {
  render() {
    return (
      <div className='mt-5'>
        <div>
          {
            R.map(message =>
              <div className='d-flex'>
                <div>{`${message.user}: ${message.text}`}</div>
              </div>
            )(mock_data)
          }
        </div>
      </div>
    )
  }
}


export default Chat