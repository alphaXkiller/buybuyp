import R                    from 'ramda'
import React, { Component } from 'react'
import { connect }          from 'react-redux'

import { User } from '../../../actions/index.js'

class Login extends Component {
  constructor() {
    super()
    this.loginByProvider = this.loginByProvider.bind(this)
    this.submit = this.submit.bind(this)
  }

  loginByProvider(provider) {
    return e => {
      e.preventDefault()
      provider()
    }
  }

  submit(e) {
    e.preventDefault()
    this.props.emailLogin({
      email: e.target.email.value,
      password: e.target.password.value
    })
  }

  render() {
    return (
      <div 
        className={
          R.join(' ', ['d-flex flex-column login', this.props.show_class])
        }
      >
        <button
          className='btn btn-secondary form-group'
          onClick={this.loginByProvider(this.props.facebookLogin)}
        >
          continue with facebook
        </button>
        <button 
          className='btn btn-primary form-group'
          onClick={this.loginByProvider(this.props.googleLogin)}
        >
          log in with google
        </button>
        <p className='text-center'>Or</p>
        <form 
          className='d-flex flex-column' 
          onSubmit={this.submit}
        >
          <div className='form-group'>
            <input className='form-control' placeholder='Email' name='email' />
          </div>
          <div className='form-group'>
            <input 
              className='form-control' 
              placeholder='Password' 
              name='password' 
            />
          </div>
          <button type='submit' className='btn btn-primary text-center'>
            Submit
          </button>
        </form>

        <div>
          <button onTouchTap={this.props.onClickToggleSignup}>
            Don't have a account? Sign Up
          </button>
        </div>
      </div>
    )
  }
}


const mapStateToProps = (state, props) => ({
  user: state.User,
  show_class: props.show_login ? ' show' : null
})


const mapDispatchToProps = dispatch => ({
  googleLogin: () => dispatch(User.loginGoogle),
  facebookLogin: () => dispatch(User.loginFacebook),
  emailLogin: request_body => dispatch(User.loginEmail(request_body))
})


export default connect(mapStateToProps, mapDispatchToProps)(Login)
