import R                    from 'ramda'
import React, { Component } from 'react'
import { connect }          from 'react-redux'

import { user } from '../../actions/index.js'


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
    this.props.loginEmail({
      email: e.target.email.value,
      password: e.target.password.value
    })
  }

  render() {
    return (
      <div className='modal-body d-flex flex-column'>
        <button
         className='btn btn-secondary form-group'
         onClick={this.loginByProvider(this.props.loginFacebook)}
        >
         continue with facebook
        </button>
        <button
         className='btn btn-primary form-group'
         onClick={this.loginByProvider(this.props.loginGoogle)}
        >
         log in with google
        </button>
        <p className='text-center'>Or</p>
        <form className='d-flex flex-column' onSubmit={this.submit}>
          <div className='form-group'>
            <input
              className='form-control' 
              placeholder='Email'
              name='email'
            />
          </div>
          <div className='form-group'>
            <input 
              className='form-control' 
              placeholder='Password'
              name='password'
            />
          </div>
          <button 
            type='submit' 
            className='btn btn-primary text-center'
          >
            Submit
          </button>
        </form>
        <p className='text-center'>Need an account?
          <span onClick={this.props.switchFn('signup')}>Sign up</span>
        </p>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  user: state.User
})


const mapDispatchToProps = dispatch => ({
  loginGoogle: () => dispatch(user.loginGoogle),
  loginFacebook: () => dispatch(user.loginFacebook),
  loginEmail: (request_body) => dispatch(user.loginEmail(request_body))
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
