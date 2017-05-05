import _firebase from 'firebase'
import Config from '../../config/firebase'

const Firebase = _firebase.initializeApp(Config)

export default {
  app      : Firebase,
  auth     : Firebase.auth(),
  database : Firebase.database()
}
