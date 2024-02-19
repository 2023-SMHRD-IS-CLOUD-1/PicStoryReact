import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/AccountCheck.css';
import Button from '@mui/material/Button';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

const AccountCheck = () => {
  const [value, setValue] = useState('');
  const [name, setName] = useState('');
  const [info, setInfo] = useState('');

  useEffect(() => {
    let user_name = sessionStorage.getItem('user_name');
    let user_value = sessionStorage.getItem('user_value');
    let user_info = sessionStorage.getItem('info');
    if (user_value) {
      setValue(user_value);
      setName(user_name);
      setInfo(user_info);

    } else {
      console.log('조회실패!!!!!');
    }
  }, []);

  const sessionReset = () => {
    console.log('세션삭제!!!!!');
    sessionStorage.removeItem('user_name');
    sessionStorage.removeItem('user_value');
    sessionStorage.removeItem('info');
    console.log(sessionStorage.getItem('user_name'));
  }

  return (
    <div className='checkMain'>
      <div className='checkBox'>
        <CheckRoundedIcon color="primary" sx={{ fontSize: 50 }}></CheckRoundedIcon>
        <p>{name}님의 {info}는</p>
        <p>{value}입니다.</p>
      </div>
      <div className='btnBox'>
        <Button onClick={sessionReset} variant="contained" component={Link} to="/logIn">로그인</Button>
        <Button onClick={sessionReset} variant="outlined" component={Link} to="/account">다시 찾기</Button>
      </div>
    </div>
  );
};

export default AccountCheck;
