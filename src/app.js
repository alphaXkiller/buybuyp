import R                           from 'ramda'
import React, { Component }        from 'react'
import { connect }                 from 'react-redux'
import {
  BrowserRouter as Router,
  Switch
} from 'react-router-dom'


import Nav     from './components/nav.js'
import Header  from './components/header.js'
import Footer  from './components/footer/footer.js'
import ChatBtn from './components/chat/chat-btn.js'

import { DOM } from './lib/helpers/index.js'
import { notEmpty, notNil, notEquals } from './lib/helpers.js'
import { RouteFunctor, RouteActor }    from './routes.js'
import { 
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

    if (this.props.user.uid)
      this.props.getChats()
  }


  shouldComponentUpdate(nextProps, nextState) {
    const same_state = R.equals(this.state)(nextState)
    const same_props = R.equals(this.props)(nextProps)

    if (same_state && same_props) return false
    else return true
  }


  componentDidUpdate(prevProps, prevState) {
    if (!this.props.user.uid)
      this.setState({show_user_menu: false})

    if (this.props.user.uid && this.state.open_login_modal)
      this.setState({open_login_modal: false})
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
    this.setState({show_menu: true})
  }


  onClickHideMenu = e => {
    if (this.state.show_menu)
      this.setState({show_menu: false})
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


  onClickToggleSignup = e => {
    this.setState({show_signup: !this.state.show_signup})
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
                show_signup            : this.state.show_signup,
                onClickShowUserMenu    : this.onClickShowUserMenu,
                onClickHideUserMenu    : this.onClickHideUserMenu,
                onClickShowMenu        : this.onClickShowMenu,
                onClickOpenLoginModal  : this.onClickOpenLoginModal,
                onClickCloseLoginModal : this.onClickCloseLoginModal,
                onClickLogout          : this.onClickLogout,
                onClickToggleSignup    : this.onClickToggleSignup,
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
            </main>
            { this.props.user.uid ? <ChatBtn /> : null }
            { Footer() }
          </div>
        </div>
      </Router>
    )
  }
}

const mapStateToProps = (state, props)=> ({
  categories : state.ProductCategory,
  user       : state.User
})


const mapDispatchToProps = (dispatch, props)=> ({
  logout             : () => dispatch(User.logoutUser),
  getProductCategory : () => dispatch(ProductCategory.getAll),
  getChats           : () => dispatch(Contact.getChats)
})


export default connect(mapStateToProps, mapDispatchToProps)(App)
