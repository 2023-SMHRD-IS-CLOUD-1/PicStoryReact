import React from 'react'
import '../css/Header.css'


const Header = () => {

  let logo = {
    width : '100px',
    height : '100%'
  }

  return ( 
    <div id='header-container'>
      <a href="#" id='logo'><img src="/PicStoryLogo.png" alt="로고" style={logo}/></a>
      <div id='menu-container'>
        <button className='menuBtn'>홈</button>
        ㅣ
        <button className='menuBtn'>사진첩</button>
        ㅣ
        <button className='menuBtn'>SNS</button>
      </div>
      <div id='loginContainer'>
        <a href="#" className='loginBtn11'>로그인</a>
        <a href="#" className='loginBtn11'>회원가입</a>
      </div>
    </div>
  )
}

export default Header