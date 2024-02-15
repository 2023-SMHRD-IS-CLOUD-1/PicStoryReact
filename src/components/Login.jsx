import React, { useState, createContext, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Login.css';
import axios from 'axios';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { UserContext } from '../contexts/User'


const Login = () => {
  const nav = useNavigate();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");


  const axiosInstance = axios.create({
    baseURL: "http://localhost:8099/picstory",
  })

  function login() {

    if (id != '' && pw != '') {
      axiosInstance.post("/login", {
        user_id: id,
        user_pw: pw
      })
        .then(res => {
          console.log(res.data)
          console.log(id, pw)
          if (res.data === '') {
            console.log("없는 계정")
          } else if (res.data.user_id === id && res.data.user_pw === pw) {
            console.log("아이디와 비밀번호 일치")
            sessionStorage.setItem("user_id", id);
            nav('/');
          }
        }).catch(error => {
          console.error("에러:", error.message);
        });
    } else {
      console.log('입력해라');
    }
  }

  return (
    <UserContext.Provider value={{ id, setId, pw, setPw }}>
      <div className='loginMain'>
        <div className='loginBox'>
          <p>로그인하세요</p>
          <Box
            component="form" className='input-layer'
            sx={{
              '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              type="text"
              className="outlined-basic"
              label="아이디"
              variant="outlined"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />

            <TextField
              type="password"
              className="outlined-basic"
              label="비밀번호"
              variant="outlined"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
          </Box>
          <div className='l-box'>
            <Link to="/join">계정을 잊으셨나요?</Link>
            <button id='l-loginBtn' onClick={login} component={Link} to="/">로그인</button>
          </div>
        </div>
        <div className='a-container'>
          <p>PicStory가 처음이세요?</p>
          <Link to="/join">회원가입</Link>
        </div>
      </div>
    </UserContext.Provider>
  )
}

export default Login