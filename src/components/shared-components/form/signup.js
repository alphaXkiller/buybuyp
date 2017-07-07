import R                    from 'ramda'
import React, { Component } from 'react'
import { connect }          from 'react-redux'

import { User } from '../../../actions/index.js'

class Signup extends Component {
  submit = e => {
    e.preventDefault()
    this.props.signup({
      name     : e.target.name.value,
      email    : e.target.email.value,
      password : e.target.password.value
    })
  }

  render() {
    return(
      <div className={R.join(' ', ['signup', this.props.show_class])}>
        <form className='d-flex flex-column' onSubmit={this.submit}>
          {
            this.props.user.error_message ? 
              <p>{this.props.user.error_message}</p>
              : null
          }
          <div className='form-group'>
            <input
              className='form-control' 
              placeholder='*name' 
              name='name'
              type='text'
              required
            />
          </div>
          <div className='form-group'>
            <input 
              className='form-control' 
              placeholder='*email' 
              name='email'
              type='email'
              required
            />
          </div>
          <div className='form-group'>
            <input 
              className='form-control' 
              placeholder='*password' 
              name='password'
              type='password'
              required
            />
          </div>
          <button className='btn btn-primary' type='submit'>sign up</button>
          <div className='text-center mt-1'>
            <p>Already have an account?
              <span onTouchTap={this.props.onClickToggleSignup}> Login</span>
            </p>
          </div>
        </form>
      </div>
    )
  }
}


const mapStateToProps = (state, props) => ({
  show_class: props.show_signup ? ' show' : null,
  user: state.User,
})


const mapDispatchToProps = dispatch => ({
  signup: request_body => dispatch(User.signup(request_body))
})

export default connect(mapStateToProps, mapDispatchToProps)(Signup)
