
import R from 'ramda'
import * as Firebase from '../lib/firebase.js'
const FirebaseDB = Firebase.ref.database

const _getChatKey = R.compose(
  R.concat('messages/'),
  R.join('_'),
  R.sortBy(R.identity),
  R.map(R.toLower)
)


const addMessage = (message, recipient) => {

  let key = _getChatKey([message.user_id, recipient.user_id])

  FirebaseDB.ref(key).push().set(message);
}



// // testing
// // # # # # # # # # # # # # # # # # # # # # # # # # # # #
const user_ids = ['Jon', 'Frankie']
const message = { text: 'hello world', user_id: 'Jon' }
const recipient = { user_id : 'Frankie' }

const messageRef = FirebaseDB.ref(_getChatKey(user_ids));
messageRef.on('value', (snapshot) => {
  console.log('debugF2', snapshot.val())
})

// addMessage(message, recipient);

// // # # # # # # # # # # # # # # # # # # # # # # # # # # #



export {

}