import R                    from 'ramda'
import React, { Component } from 'react'
import { connect }          from 'react-redux'

import { User } from '../../../actions/index.js'

class Signup extends Component {
  constructor() {
    super()
    this.submit = this.submit.bind(this)
  }

  submit(e) {
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
            this.props.error_message ? 
              <p>{this.props.error_message}</p>
              : null
          }
          <div className='form-group'>
            <input
              className='form-control' 
              placeholder='name' 
              name='name'
              type='text'
            />
          </div>
          <div className='form-group'>
            <input 
              className='form-control' 
              placeholder='email' 
              name='email'
              type='email'
            />
          </div>
          <div className='form-group'>
            <input 
              className='form-control' 
              placeholder='password' 
              name='password'
              type='password'
            />
          </div>
          <button className='btn btn-primary' type='submit'>sign up</button>
        </form>
      </div>

    )
  }
}


const mapStateToProps = (state, props) => ({
  show_class: props.show_signup ? ' show' : null,
  error_message: state.User.error_message ? state.User.error_message : null
})


const mapDispatchToProps = dispatch => ({
  signup: request_body => dispatch(User.signup(request_body))
})

export default connect(mapStateToProps, mapDispatchToProps)(Signup)
