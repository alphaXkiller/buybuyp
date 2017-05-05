import R                           from 'ramda'
import React, { Component }        from 'react'
import { connect }                 from 'react-redux'
import {
  BrowserRouter as Router,
  Switch
} from 'react-router-dom'


import Nav    from './components/nav.js'
import Header from './components/header.js'
import Footer from './components/footer/footer.js'
import Chat   from './components/chat/chat-btn.js'

import { notEmpty, notNil, notEquals } from './lib/helpers.js'
import { RouteFunctor, RouteActor }    from './routes.js'
import { 
  Messages, 
  Contact, 
  User, 
  Product, 
  ProductCategory 
} from './actions/index.js'

import './style/main.scss'

class App extends Component {
  constructor() {
    super()
    this.state = {
      show_menu         : false,
      show_user_menu    : false,
      open_login_modal  : false
    }
  }


  componentDidMount() {
    this.props.getProductCategory()
    this.props.getCurrentUser()
  }


  shouldComponentUpdate(nextProps, nextState) {
    const same_state = R.equals(this.state)(nextState)
    const same_props = R.equals(this.props)(nextProps)

    if (same_state && same_props) return false
    else return true
  }


  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user !== this.props.user)
      this.setState({show_user_menu: false})

    // Get Chat for login user
    if (this.props.user.uid)
      this.props.getChats()
  }


  onClickCloseLoginModal = reason => {
    this.setState({open_login_modal: false})
  }


  onClickOpenLoginModal = e => {
    e.preventDefault()
    this.setState({open_login_modal: true})
  }


  onClickShowMenu = e => {
    e.preventDefault()
    this.setState({show_menu: true}, () => {
      // Boostrap set the body style overflow to be auto !important
      // so the overlay cannot block the scrolling
      document.getElementById('body').className = 'overflow-hidden'
    })
  }


  onClickHideMenu = e => {
    if (this.state.show_menu)
      this.setState({
        show_menu: false
      }, () => {
        document.getElementById('body').className = ''
      })
  }


  onClickShowUserMenu = e => {
    e.preventDefault()
    this.setState({show_user_menu: true})
  }


  onClickHideUserMenu = reason => {
    if (reason === 'clickAway')
      this.setState({show_user_menu: false})
  }


  onClickLogout = e => {
    this.props.logout()
  }


  render() {

    return (
      <Router>
        <div>
          {
            Nav({
              user            : this.props.user,
              show_menu       : this.state.show_menu,
              categories      : this.props.categories,
              onClickHideMenu : this.onClickHideMenu
            })
          }
          <div 
            id='content' 
            onTouchTap={this.onClickHideMenu}
          >
            {
              Header({
                show_user_menu         : this.state.show_user_menu,
                open_login_modal       : this.state.open_login_modal,
                onClickShowUserMenu    : this.onClickShowUserMenu,
                onClickHideUserMenu    : this.onClickHideUserMenu,
                onClickShowMenu        : this.onClickShowMenu,
                onClickOpenLoginModal  : this.onClickOpenLoginModal,
                onClickCloseLoginModal : this.onClickCloseLoginModal,
                onClickLogout          : this.onClickLogout,
                user                   : this.props.user,
              })
            }
            <main>
              <Switch>
                {
                  RouteFunctor.map( (route, i) => (
                    <RouteActor 
                      key={i} 
                      user={this.props.user} 
                      {...route} 
                    />
                  ))
                }
              </Switch>
              { this.props.user.uid ? <Chat /> : null }
            </main>
            { Footer() }
          </div>
        </div>
      </Router>
    )
  }
}

const mapStateToProps = (state, props)=> ({
  categories : state.ProductCategory,
  user       : state.User,
  messages   : state.Messages
})


const mapDispatchToProps = (dispatch, getState)=> ({
  getCurrentUser     : () => User.getUser(dispatch, getState),
  logout             : () => User.logoutUser(dispatch, getState),
  getProductCategory : () => ProductCategory.getAll(dispatch, getState),
  getChats           : () => Contact.getChats(dispatch, getState),
  // getChatsMsgUnread  : uid => Message.searchUnreadMsg(uid)(dispatch, getState)
})


export default connect(mapStateToProps, mapDispatchToProps)(App)
