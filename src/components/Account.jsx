import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Account.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const Account = () => {
  const nav = useNavigate();
  const [nick, setNick] = useState('');
  const [mail, setMail] = useState('');
  const [mail2, setMail2] = useState('');
  const [id, setId] = useState('');
  const [nickMessage, setNickMessage] = useState(false);
  const [mailMessage, setMailMessage] = useState(false);
  const [idMessage, setIdMessage] = useState(false);
  const [mailMessage2, setMailMessage2] = useState(false);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8099/picstory",
  });

  const SelectId = () => {
    if (!nick) {
      setNickMessage(true);
      return;
    } else {
      setNickMessage(false);
    }
    if (!mail) {
      setMailMessage(true);
      return;
    } else {
      setMailMessage(false);
    }

    axiosInstance.post("/selectId", { user_nick: nick, user_mail: mail })
      .then((res) => {
        console.log('아이디 : ', res.data.user_id);
        console.log('이름 : ', res.data.user_name);
        if (!res.data.user_id) {
          alert('해당하는 아이디 없음');
          setNick('');
          setMail('');
        } else {
          console.log('세션에 저장');
          sessionStorage.setItem("user_value", res.data.user_id);
          sessionStorage.setItem("user_name", res.data.user_name);
          sessionStorage.setItem("info", "아이디");
          nav('/accountCheck');
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  const selectPw = () => {
    if (!id) {
      setIdMessage(true);
      return;
    } else {
      setIdMessage(false);
    }
    if (!mail2) {
      setMailMessage2(true);
      return;
    } else {
      setMailMessage2(false);
    }

    axiosInstance.post("/selectPw", { user_id: id, user_mail: mail2})
      .then((res) => {
        console.log('비번 : ', res.data.user_pw);
        console.log('이름 : ', res.data.user_name);
        if (!res.data.user_pw) {
          alert('해당하는 비번 없음');
          setId('');
          setMail2('');
        } else {
          console.log('세션에 저장');
          sessionStorage.setItem("user_value", res.data.user_pw);
          sessionStorage.setItem("user_name", res.data.user_name);
          sessionStorage.setItem("info", "비밀번호");
          nav('/accountCheck');
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <div className='joinMain'>
      <div className='joinBox'>
        <p>아이디 찾기</p>
        <Box
          component="form" className='input-layer'
          sx={{
            '& > :not(style)': { m: 1, width: '30ch', height: '6ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            type="text"
            className="outlined-basic"
            error={!!nickMessage}
            label="닉네임을 입력하세요"
            variant="outlined"
            value={nick}
            onChange={(e) => {
              setNick(e.target.value)
              if (e.target.value) {
                setNickMessage('');
              }
            }}
            FormHelperTextProps={{
              style: { fontSize: '0.8rem', margin: '2px' }
            }}
          />
          <TextField
            type="email"
            className="outlined-basic"
            error={!!mailMessage}
            label="이메일을 입력하세요"
            variant="outlined"
            value={mail}
            onChange={(e) => {
              setMail(e.target.value)
              if (e.target.value) {
                setMailMessage('');
              }
            }}
            FormHelperTextProps={{
              style: { fontSize: '0.8rem', margin: '2px' }
            }}
          />
        </Box>
        <Button
          id='l-joinBtn'
          variant="contained"
          onClick={SelectId}
        >조회하기</Button>
        <hr />
        <p>비밀번호 찾기</p>
        <Box
          component="form" className='input-layer'
          sx={{
            '& > :not(style)': { m: 1, width: '30ch', height: '6ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            type="text"
            className="outlined-basic"
            error={!!idMessage}
            label="아이디를 입력하세요"
            variant="outlined"
            value={id}
            onChange={(e) => {
              setId(e.target.value)
              if (e.target.value) {
                setIdMessage('');
              }
            }}
          />
          <TextField
            type="email"
            className="outlined-basic"
            error={!!mailMessage2}
            label="이메일을 입력하세요"
            variant="outlined"
            value={mail2}
            onChange={(e) => {
              setMail2(e.target.value)
              if (e.target.value) {
                setMailMessage2('');
              }
            }}
            FormHelperTextProps={{
              style: { fontSize: '0.8rem', margin: '2px 2px 5px 2px' }
            }}
          />
        </Box>
        <Button
          id='l-joinBtn'
          variant="contained"
          onClick={selectPw}
        >조회하기</Button>
      </div>
    </div>
  );
};

export default Account;
