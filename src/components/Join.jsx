import React, { useState } from 'react';
import axios from 'axios';
import '../css/Join.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';


const Join = () => {

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [nick, setNick] = useState("");
  const [mail, setMail] = useState("");
  const [pwMessage, setPwMessage] = useState(false);
  const [idMessage, setIdMessage] = useState();
  const [nickMessage, setNickMessage] = useState();
  const [mailMessage, setMailMessage] = useState();


  // 고정주소 달아주기
  const axiosInstance = axios.create({
    baseURL: "http://localhost:8099/picstory",
  })
  const handleJoinIn = () => {

    const userJoinData = {
      user_id: id,
      user_pw: pw,
      user_name: name,
      user_nick: nick,
      user_mail: mail
    };

    // 회원가입 데이터 보내는 통신
    if (pw == pwConfirm) {
      axiosInstance.post("/joinIn", userJoinData)
        .then((res) => {
          console.log('회원가입 : ', res);
          setPwMessage(false);
          setIdMessage();
          setNickMessage();
          setMailMessage();
        })
        .catch(error => {
          console.error(error);
        });
    };
  }

  // id 중복확인 => true면 사용가능 false는 불가
  const IdDoubleCheck = () => {

    axiosInstance.get("/IdDoubleCheck", {
      params: {
        user_id: id
      }
    })
      .then((res) => {
        // 서버 응답에 대한 처리
        //console.log(res.data);
        if (res.data) {
          setIdMessage(true);
        } else {
          setIdMessage(false);
        }
      })
      .catch(error => {
        console.error(error);
      });

  }

  // 닉네임 중복확인
  const nickdDoubleCheck = () => {

    axiosInstance.get("/nickDoubleCheck", {
      params: {
        user_nick: nick
      }
    })
      .then((res) => {
        //console.log(res.data);
        if (res.data) {
          setNickMessage(true);
        } else {
          setNickMessage(false);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  // 메일 중복확인
  const mailDoubleCheck = () => {

    axiosInstance.get("/mailDoubleCheck", {
      params: {
        user_mail: mail
      }
    })
      .then((res) => {
        //console.log(res.data);
        if (res.data) {
          setMailMessage(true);
        } else {
          setMailMessage(false);
        }
      })
      .catch(error => {
        console.error(error);
      });

  }

  // 비밀번호 확인 input태그에서 커서가 사라질때 실행되는 이벤트
  const handleBlur = () => {
    if (pw === pwConfirm) {
      setPwMessage("비밀번호가 일치합니다.")
    } else {
      setPwMessage("비밀번호가 일치하지않습니다.")
    }
  };

  return (
    <div className='joinMain'>
      <div className='joinBox'>
        <p>회원가입</p>
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
            label="이름 입력"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            type="text"
            className="outlined-basic"
            helperText={idMessage ? '사용가능합니다' : '사용불가능합니다'}
            label="아이디 입력"
            variant="outlined"
            value={id}
            onChange={(e) => setId(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button onClick={IdDoubleCheck} variant="contained" color="primary">
                    중복확인
                  </Button>
                </InputAdornment>
              )
            }}
            FormHelperTextProps={{
              style: { fontSize: '0.8rem', margin: '2px' }
            }}
          />
          <TextField
            type="password"
            className="outlined-basic"
            label="비밀번호 입력"
            variant="outlined"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
          <TextField
            type="password"
            className="outlined-basic"
            helperText={pwMessage}
            label="비밀번호 재입력"
            variant="outlined"
            value={pwConfirm}
            onChange={(e) => setPwConfirm(e.target.value)}
            onBlur={handleBlur}
            FormHelperTextProps={{
              style: { fontSize: '0.8rem', margin: '2px 2px 5px 2px' }
            }}
          />
          <TextField
            type="text"
            className="outlined-basic"
            helperText={nickMessage ? '사용가능합니다' : '사용불가능합니다'}
            label="닉네임"
            variant="outlined"
            value={nick}
            onChange={(e) => setNick(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button onClick={nickdDoubleCheck} variant="contained" color="primary">
                    중복확인
                  </Button>
                </InputAdornment>
              )
            }}
            FormHelperTextProps={{
              style: { fontSize: '0.8rem', margin: '2px 2px 5px 2px' }
            }}
          />
          <TextField
            type="email"
            className="outlined-basic"
            helperText={mailMessage ? '사용가능합니다' : '사용불가능합니다'}
            label="이메일"
            variant="outlined"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button onClick={mailDoubleCheck} variant="contained" color="primary">
                    중복확인
                  </Button>
                </InputAdornment>
              )
            }}
            FormHelperTextProps={{
              style: { fontSize: '0.8rem', margin: '2px' }
            }}
          />
        </Box>
        <Button
          id='l-joinBtn'
          variant="contained"
          onClick={handleJoinIn}
          disabled={!(idMessage && nickMessage && mailMessage && pwMessage)} // 이 부분 수정
          component={Link} // Link 컴포넌트 사용
          to="/" // 이동할 경로 지정
        >가입하기</Button>
      </div>
    </div>
  );
};

export default Join;
