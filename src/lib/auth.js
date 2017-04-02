import R from 'ramda'
import Bluebird from 'bluebird'

import { notNil } from '../lib/helpers.js'

import * as Firebase from '../lib/firebase.js'

const provider = {
  google   : new Firebase.auth.GoogleAuthProvider(),
  facebook : new Firebase.auth.FacebookAuthProvider()
}

const googleLogin = () => 
  Firebase.ref.auth.signInWithRedirect(provider.google)


const facebookLogin = () => 
  Firebase.ref.auth.signInWithRedirect(provider.facebook)


const emailLogin = ({email, password}) =>
  Firebase.ref.auth.signInWithEmailAndPassword(email, password)


const getRedirectResult = () => 
  Firebase.ref.auth.getRedirectResult()


const onAuthStateChanged = () =>
  new Bluebird( (resolve, reject) =>
    Firebase.ref.auth.onAuthStateChanged(resolve) 
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


const logout = () => Firebase.ref.auth.signOut()


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
