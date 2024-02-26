import React from 'react'
import '../css/Footer.css'

const Footer = () => {
  return (
    <div id='footerContainer'>
      <div id='footerContent'>
      <p>PicStory © 2024 All Right Reserved</p>
      <p>
        Class3, 2nd Floor, 602, Songam-ro, Nam-gu, Gwangju
        <br/>
        CoC | 팀장 : 최성욱 | 부팀장 : 양재원 | 팀원 : 강채린, 이하연, 함수연
      </p>
        <ul className='footerUl'>
          <li className='footerLi'>고객센터</li>
          <li className='footerLi'>결제문의</li>
          <li className='footerLi' id='end'>신고하기</li>
        </ul>
      <img src='/images/003.png' style={{width : '100px', height:'45px'}}/>
      </div>
    </div>
  )
}

export default Footer