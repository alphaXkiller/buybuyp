import React    from 'react'
import { Link } from 'react-router-dom'

import './header.scss'

const Header = (onClickShowNav) => {
  return (
    <header>
      <div className='row navbar justify-content-between flex-row'>
        <button
          className='buybuy-btn'
          onTouchTap={onClickShowNav}
        >
          <i className='fa fa-bars fa-lg'></i>
        </button>
        <Link to='/' style={{fontSize: '20px'}}>Buy Buy</Link>
        <button
          className='buybuy-btn'
        >
          <i className='fa fa-search fa-lg'></i>
        </button>
      </div>
    </header>
  )
}

export default Header
