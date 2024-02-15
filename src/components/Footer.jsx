import React from 'react'
import '../css/Footer.css'

const Footer = () => {
  return (
    <div id='footerContainer'>
      <div id='footerContent' style={{ display: 'inline-flex' }}>
        <ul className='footerUl' style={{ listStyle: 'none', padding: '10px', margin: 0, display: 'flex', color: 'white', fontFamily:'NotoSansKRLight' }}>
          <li className='footerLi'>고객센터</li>
          <li className='footerLi'>결제문의</li>
          <li className='footerLi' id='end'>신고하기</li>
        </ul>
      </div>
    </div>
  )
}

export default Footer