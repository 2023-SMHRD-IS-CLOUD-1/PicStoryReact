import React, { useContext } from 'react'
import '../css/Header.css'
import { Link } from 'react-router-dom'
import { UserLoginContext } from '../contexts/UserLogin'



const Header = () => {

  const {login, handlerLogout} = useContext(UserLoginContext) || {};

  


  let logo = {
    width : '100px',
    height : '100%'
  }

  return ( 
    <div id='header-container'>
      <Link to='/' id='logo'><img src="/PicStoryLogo.png" alt="로고" style={logo}/></Link>
      <div id='loginContainer'>
      {login === '로그아웃' ? (
      <span className='loginBtn11' onClick={handlerLogout} style={{ cursor: 'pointer'}}>{login}</span>
      ) : (<Link to='/login' className='loginBtn11'>로그인</Link>)}
        <Link to='/join' className='loginBtn11'>회원가입</Link>
      </div>
    </div>
  )
}

export default Header