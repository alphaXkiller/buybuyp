import R from 'ramda'
import React from 'react'

import Login from './login.js'
import Signup from './signup.js'

const Type = {
  login: props => <Login switchFn={props.switchModalType}/>,
  signup: props => <Signup switchFn={props.switchModalType}/>
}

const renderContentByType = (type, props) => Type[type](props)

const Modal = ({type, show_modal, onClickHideModal}) => props => {
  const default_class = 'modal fade'
  const class_name = R.when(
    () => show_modal === true,
    R.concat('show d-block ')
  )(default_class)

  return (
    <div 
      className={class_name} 
      onClick={onClickHideModal} 
      style={{width: '320px'}}
    >
      <div className='modal-dialog'>
        <div className='modal-content'>
          {renderContentByType(type, props)}
        </div>
      </div>
    </div>
  )
}

export default Modal
