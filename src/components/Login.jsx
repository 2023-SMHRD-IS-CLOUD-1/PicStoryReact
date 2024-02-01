import React from 'react'
import '../css/Login.css'

const Login = () => {
  
  return (
    <div id='loginMain'>
      <div id='loginBox'>
        <div style={{fontSize : '100px', textAlign:'center'}}>로그인</div>
        <hr />
        <input type="text" className='loginInput' placeholder='아이디'/>
        <input type="password" className='loginInput' placeholder='비밀번호'/>
        <button id='loginBtn'>로그인</button>
        <br />
        <a href="#">회원가입</a>
        <span>  /  </span>
        <a href="#">계정 찾기</a>
      </div>
    </div>
  )
}

export default Login