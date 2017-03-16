import R from 'ramda'
import Bluebird from 'bluebird'
import Firebase from 'firebase/app'
import 'firebase/auth'

import Firebase_config from '../../config/firebase.js'
import { notNil } from '../lib/helpers.js'

Firebase.initializeApp(Firebase_config)

const provider = {
  google: new Firebase.auth.GoogleAuthProvider(),
  facebook: new Firebase.auth.FacebookAuthProvider()
}

const googleLogin = () => 
  Firebase.auth().signInWithRedirect(provider.google)


const facebookLogin = () => 
  Firebase.auth().signInWithRedirect(provider.facebook)


const emailLogin = ({email, password}) =>
  Firebase.auth().signInWithEmailAndPassword(email, password)


const getRedirectResult = () => 
  Firebase.auth().getRedirectResult()


const onAuthStateChanged = () =>
  new Bluebird( (resolve, reject) =>
    Firebase.auth().onAuthStateChanged(resolve) 
  )


const getToken = () =>
  onAuthStateChanged().then(R.when(notNil, user => user.getToken()))


const getCurrentUser = () =>
  onAuthStateChanged()
    
  .then(R.when(
    notNil,
    R.applySpec({
      uid: R.prop('uid'),
      name: R.prop('displayName'),
      email: R.prop('email'),
      email_verified: R.prop('emailVerified'),
      profile_image: R.prop('photoURL')
    }) 
  ))


const logout = () => Firebase.auth().signOut()


export {
  googleLogin,
  facebookLogin,
  emailLogin,
  getToken,
  getRedirectResult,
  onAuthStateChanged,
  getCurrentUser,
  logout
}
