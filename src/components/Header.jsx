import React, { useContext } from 'react'
import '../css/Header.css'
import { Link } from 'react-router-dom'
import { UserLoginContext } from '../contexts/UserLogin'
import { useEffect } from 'react'
import { useState } from 'react'



const Header = () => {
  
  let logo = {
    width: '100px',
    height: '100%'
  }
  
  const { login, handlerLogout } = useContext(UserLoginContext) || {};

  const [loginState, setLoginState] = useState(false);

  const sessionUserInfo = sessionStorage.getItem('user_num');
  useEffect(()=>{
    if(sessionUserInfo != null) {
      setLoginState(true);
    }
  },[sessionUserInfo])


  const deleteSession = (user_id) =>{
    sessionStorage.removeItem('user_num');
    sessionStorage.removeItem('user_id');
    setLoginState(false);
  }

  return (
    <div id='header-container'>
      <div id='header-inner'>
        <Link to='/' id='logo'><img src="/images/003.png" alt="로고"/></Link>
        <div id='loginContainer'>
          {loginState
            ? (<><Link to='/' className='loginBtn11' onClick={deleteSession}>로그아웃</Link> <Link to='/myinfo' className='loginBtn11'>마이 페이지</Link></>)
            : (<> <Link to='/login' className='loginBtn11'>로그인</Link> <Link to='/join' className='loginBtn11'>회원가입</Link> </>)}

        </div>
      </div>
    </div>
  )
}

export default Header