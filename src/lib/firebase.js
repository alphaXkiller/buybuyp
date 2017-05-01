import Firebase          from 'firebase';
import * as FirebaseAuth from 'firebase/auth'
import FirebaseConfig    from '../config/firebase.js'

const firebase = Firebase.initializeApp(FirebaseConfig)

module.exports = {
  auth : FirebaseAuth,
  ref  : {
    app      : firebase, 
    auth     : firebase.auth(),
    database : firebase.database()
  }
}
