import React from 'react'
import '../css/Header.css'
import { FaRegUserCircle } from "react-icons/fa";


const Header = () => {

  let logo = {
    width : '100px',
    height : '100%'
  }

  return (
    <div id='header-container'>
      <a href="#" id='logo'><img src="/PicSTory.png" alt="로고" style={logo}/></a>
      <div id='menu-container'>
        <button className='menuBtn'>홈</button>
        ㅣ
        <button className='menuBtn'>사진첩</button>
        ㅣ
        <button className='menuBtn'>SNS</button>
      </div>
      <div id='loginContainer'>
        <a href="" id='loginBtn'><FaRegUserCircle id='aaaa'/></a>
      </div>
    </div>
  )
}

export default Header