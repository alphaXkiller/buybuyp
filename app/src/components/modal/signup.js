import R                    from 'ramda'
import React, { Component } from 'react'
import { connect }          from 'react-redux'

import { user } from '../../actions/index.js'

class Signup extends Component {
  constructor() {
    super()
    this.submit = this.submit.bind(this)
    this.state = {
      success: false
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const shouldSetSuccess = R.and(
      R.equals(this.props.user, user.TYPE.signup_success),
      this.state.success === false
    )

    if (shouldSetSuccess) this.setState({success: true})
  }

  submit(e) {
    e.preventDefault()
    this.props.signup({
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value
    })
  }

  renderForm() {
    return (
      <form className='d-flex flex-column' onSubmit={this.submit}>
        <div className='form-group'>
          <input
            className='form-control' 
            placeholder='name' 
            name='name'
            type='text'
          />
          <span>{this.props.validation.name}</span>
        </div>
        <div className='form-group'>
          <input 
            className='form-control' 
            placeholder='email' 
            name='email'
            type='email'
          />
          <span>{this.props.validation.email}</span>
        </div>
        <div className='form-group'>
          <input 
            className='form-control' 
            placeholder='password' 
            name='password'
            type='password'
          />
          <span>{this.props.validation.password}</span>
        </div>
        <button className='buybuy-btn' type='submit'>sign up</button>
      </form>
    )
  }

  render() {
    return(
      <div className='modal-body d-flex flex-column'>
        {
          this.state.success ?
            <p>Sign up Successfully. Please verify your email then log in</p>
          : this.renderForm()
        }
        <p
          className='text-center' 
          onClick={this.props.switchFn('login')}
        >
          login
        </p>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.User,
  validation: {
    name: R.path(['user', 'validation', 'name'])(state),
    email: R.path(['user', 'validation', 'email'])(state),
    password: R.path(['user', 'validation', 'password'])(state)
  }
})


const mapDispatchToProps = dispatch => ({
  signup: (request_body) => dispatch(user.signup(request_body))
})


export default connect(mapStateToProps, mapDispatchToProps)(Signup)
