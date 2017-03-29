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
import Footer from './components/footer/footer.js'

import { User }                        from './actions/index.js'
import { notEmpty, notNil, notEquals } from './lib/helpers.js'
import { getCurrentUser } from './lib/auth.js'

import './style/main.scss'

class App extends Component {
  constructor() {
    super()
    this.state = {
      show_menu         : false,
      show_login        : false,
      show_signup       : false,
      show_user_menu    : false,
      show_header_color : window.scrollY > 0,
      open_login_modal  : false
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
    if (prevProps.user !== this.props.user)
      this.setState({show_user_menu: false})
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.showHeaderBgColor)
  }


  showHeaderBgColor = e => R.ifElse(
    R.gt(R.__, 0),
    () => this.setState({show_header_color: true}),
    () => this.setState({show_header_color: false})
  )(window.scrollY)


  onClickCloseLoginModal = (reason) => {
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
        show_menu: false,
        show_login: false,
        show_signup: false
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
              show_menu           : this.state.show_menu,
              onClickHideMenu     : this.onClickHideMenu,
            })
          }
          <div 
            id='content' 
            onTouchTap={this.onClickHideMenu}
          >
            {
              Header({
                show_user_menu         : this.state.show_user_menu,
                show_header_color      : this.state.show_header_color,
                open_login_modal       : this.state.open_login_modal,
                onClickShowUserMenu    : this.onClickShowUserMenu,
                onClickHideUserMenu    : this.onClickHideUserMenu,
                onClickShowMenu        : this.onClickShowMenu,
                onClickOpenLoginModal  : this.onClickOpenLoginModal,
                onClickCloseLoginModal : this.onClickCloseLoginModal,
                onClickLogout          : this.onClickLogout,
                user                   : this.props.user
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
            { Footer() }
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
