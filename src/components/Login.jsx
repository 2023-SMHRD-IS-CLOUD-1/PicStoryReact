import React, { useState, createContext } from 'react'
import '../css/Login.css'
import axios from 'axios';

export const UserContext = createContext();

const Login = () => {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8099/picstory",
  })

  function login() {

    axiosInstance.post("/login", {
      user_id: id,
      user_pw: pw
    })
      .then(res => {
        console.log(res)
        console.log(res.data)
        console.log(id, pw)
        if (res.data === '') {
          console.log("없는 계정")
        } else if (res.data.user_id === id && res.data.user_pw === pw) {
          console.log("아이디와 비밀번호 일치")
          UserContext.setUser(id);
        }
      }).catch(error => {
        console.error("에러:", error.message);
      });

  }

  return (
    <UserContext.Provider value={{ user: id, setUser: setId }}>
      <div id='loginMain'>
        <div id='loginBox'>
          <h1>Login</h1>
          <hr />
          <div className='l-box'>
            <button id='l-loginBtn' onClick={login}>Login</button>
            <input
              type="text"
              className='loginInput'
              placeholder='아이디'
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
            <input
              type="password"
              className='loginInput'
              placeholder='비밀번호'
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
          </div>
          <hr />
          <div className='a-container'>
            <a href="#">회원가입</a>
            <span>  /  </span>
            <a href="#">계정 찾기</a>
          </div>
        </div>
      </div>
    </UserContext.Provider>
  )
}

export default Login