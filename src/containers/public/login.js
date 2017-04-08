import R                    from 'ramda'
import React, { Component } from 'react'

import LoginForm from '../../components/shared-components/form/login.js'

class Login extends Component {
  render() {
    return (
      <div>
        <div className='login-background' />
        <div 
          className={R.join(' ', [
            'login-content mask-white',
            'd-flex justify-content-center align-items-center'
          ])}
        >
          <div className='login-bg'>
            <LoginForm show_login />
          </div>
        </div>
      </div>
    )
  }
}


export default Login
