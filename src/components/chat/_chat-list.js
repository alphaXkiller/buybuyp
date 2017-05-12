import R     from 'ramda'
import React from 'react'
import { connect } from 'react-redux'

import { List, ListItem } from 'material-ui/List'
import Avatar             from 'material-ui/Avatar'


const getLastMsg = R.compose(
  R.path(['text']),
  R.last
)

class ChatList extends React.Component {
  render() {
    return (
      <List>
        {
          R.map( 
            contact => <ListItem
              key={contact.uid}
              primaryText={contact.name}
              leftAvatar={<Avatar src={contact.profile_image} />}
              secondaryText={
                //TODO: REFACTOR!!
                <p>{getLastMsg(contact.conversation)}</p>
              }
              onTouchTap={this.props.goChatRoom(contact)}
            /> 
          )(this.props.contacts)
        }
      </List>
    )
  }
}


const mapStateToProps = (state, props) => ({
  contacts: state.Contact.rows
})


const mapDispatchToProps = dispatch => ({

})


export default connect(mapStateToProps, mapDispatchToProps)(ChatList)
