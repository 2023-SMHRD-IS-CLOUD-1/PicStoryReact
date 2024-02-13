import React from 'react'
import '../css/Header.css'
import { Link } from 'react-router-dom'


const Header = () => {

  let logo = {
    width : '100px',
    height : '100%'
  }

  return ( 
    <div id='header-container'>
      <Link to='/' id='logo'><img src="/PicStoryLogo.png" alt="로고" style={logo}/></Link>
      <div id='loginContainer'>
        <Link to='/login' className='loginBtn11'>로그인</Link>
        <Link to='/join' className='loginBtn11'>회원가입</Link>
      </div>
    </div>
  )
}

export default Header