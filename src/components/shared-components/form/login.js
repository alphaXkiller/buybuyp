import R                    from 'ramda'
import React, { Component } from 'react'
import { connect }          from 'react-redux'
import IconButton           from 'material-ui/IconButton'

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
        <div className='d-flex justify-content-between'>
          <p className='text-uppercase font-weight-bold'>Login with</p>
          <i 
            className='fa fa-times fa-lg' 
            onTouchTap={this.props.closeModal}
          />
        </div>
        <div className='d-flex justify-content-around icon'>
          <IconButton
            iconClassName='fa fa-facebook fa-3x'
            onTouchTap={this.loginByProvider(this.props.facebookLogin)}
          />
          <IconButton
            iconClassName='fa fa-google-plus fa-3x'
            onTouchTap={this.loginByProvider(this.props.googleLogin)}
          />
        </div>

        <p className='text-center'>or</p>
        <form 
          className='d-flex flex-column' 
          onSubmit={this.submit}
        >
          <div className='form-group'>
            <input className='form-control'
              placeholder='*Email' 
              name='email' 
              required
            />
          </div>
          <div className='form-group'>
            <input 
              className='form-control' 
              placeholder='*Password' 
              name='password' 
              required
            />
          </div>
          <button type='submit' className='btn btn-primary text-center'>
            LOGIN
          </button>
        </form>

        <div className='text-center mt-1'>
          <p>Don't have a account? 
            <span onTouchTap={this.props.onClickToggleSignup}> Sign up</span>
          </p>
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
