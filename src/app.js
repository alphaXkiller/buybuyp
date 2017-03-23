import R                    from 'ramda'
import React, { Component } from 'react'
import { connect }          from 'react-redux'
import { 
  BrowserRouter as Router } from 'react-router-dom'

import { 
  RouteFunctor, 
  RouteActor 
} from './routes.js'
import Nav    from './components/nav/nav.js'
import Header from './components/header/header.js'

import { User }                        from './actions/index.js'
import { notEmpty, notNil, notEquals } from './lib/helpers.js'
import { getCurrentUser } from './lib/auth.js'

import './style/main.scss'

class App extends Component {
  constructor() {
    super()
    this.showHeaderBgColor   = this.showHeaderBgColor.bind(this)
    this.onClickLogout       = this.onClickLogout.bind(this)
    this.onClickShowMenu     = this.onClickShowMenu.bind(this)
    this.onClickHideMenu     = this.onClickHideMenu.bind(this)
    this.onClickToggleLogin  = this.onClickToggleLogin.bind(this)
    this.onClickToggleSignup = this.onClickToggleSignup.bind(this)
    this.state               = {
      show_menu: false,
      show_login: false,
      show_signup: false,
      show_header_color: window.scrollY > 0,
      open_user_menu: false
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.showHeaderBgColor)
  }

  shouldComponentUpdate(nextProps, nextState) {
    const same_state = R.equals(this.state)(nextState)
    const same_props = R.equals(this.props)(nextProps)

    if (same_state && same_props) return false
    else return true
  }

  componentDidUpdate(prevProps, prevState) {
    let isNewLogin
    let isSignupSuccessfully

    if (this.props.user) {
      isNewLogin = R.both(
        notNil,
        notEquals(R.path(['user', 'uid'])(prevProps)),
      )(this.props.user.uid)

      isSignupSuccessfully = R.both(
        notNil,
        notEquals(R.path(['user', 'signup_status'])(prevProps))
      )(this.props.user.signup_status)
      
      if (isNewLogin || isSignupSuccessfully)
        this.setState({
          show_login: false,
          show_signup: false
        })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.showHeaderBgColor)
  }


  showHeaderBgColor = e => R.ifElse(
    R.gt(R.__, 0),
    () => this.setState({show_header_color: true}),
    () => this.setState({show_header_color: false})
  )(window.scrollY)


  onClickCloseUserMenu = () => {
    this.setState({open_user_menu: false})
  }


  onClickOpenUserMenu = e => {
    e.preventDefault()
    this.setState({
      open_user_menu: true,
      anchorEl: e.currentTarget
    })
  }


  onClickLogout = e => {
    this.props.logout()
    this.onClickHideMenu()
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
        show_menu: false,
        show_login: false,
        show_signup: false
      }, () => {
        document.getElementById('body').className = ''
      })
  }


  onClickToggleLogin = e =>{
    e.preventDefault()
    this.setState({
      show_signup: false,
      show_login: !this.state.show_login 
    })
  }


  onClickToggleSignup = e => {
    e.preventDefault
    this.setState({
      show_login: false,
      show_signup: !this.state.show_signup
    })
  }
 
  render() {
    return (
      <Router>
        <div>
          {
            Nav({
              user                : this.props.user,
              logout              : this.onClickLogout,
              show_menu           : this.state.show_menu,
              show_login          : this.state.show_login,
              show_signup         : this.state.show_signup,
              onClickHideMenu     : this.onClickHideMenu,
              onClickShowModal    : this.onClickShowModal,
              onClickToggleLogin  : this.onClickToggleLogin,
              onClickToggleSignup : this.onClickToggleSignup
            })
          }
          <div 
            id='content' 
            onTouchTap={this.onClickHideMenu}
          >
            {
              Header({
                show_header_color    : this.state.show_header_color,
                open_user_menu       : this.state.open_user_menu,
                onClickShowNav       : this.onClickShowMenu,
                onClickOpenUserMenu  : this.onClickOpenUserMenu,
                onClickCloseUserMenu : this.onClickCloseUserMenu,
                user                 : this.props.user,
                anchorEl             : this.state.anchorEl
              })
            }
            <main>
              {
                RouteFunctor.map( (route, i) => (
                  <RouteActor 
                    key={i} 
                    user={this.props.user} 
                    {...route} 
                  />
                ))
              }
            </main>
            <footer></footer>
          </div>
        </div>
      </Router>
    )
  }
}

const mapStateToProps = (state, props)=> ({
  user: state.User
})


const mapDispatchToProps = (dispatch, getState)=> ({
  logout: () => User.logoutUser(dispatch, getState)
})


export default connect(mapStateToProps, mapDispatchToProps)(App)
