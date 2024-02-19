import React, { useEffect, useState } from 'react'
import Header from './Header'
import Main from './Main'
import Footer from './Footer'
import ImageSlider from './ImageSlider'
import { UserLoginContext } from '../contexts/UserLogin'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {

  const [login, setLogin] = useState("");
  console.log('sessionStorage',sessionStorage.getItem("user_num"));

  useEffect(() => {
    const userNum = sessionStorage.getItem("user_num");
    setLogin(userNum ? '로그아웃' : '로그인');
  }, []); 


  const nav = useNavigate();

  


  const handlerLogout = () => {
    if (login === "로그아웃") {
      sessionStorage.removeItem('user_num');
      setLogin('로그인');
      nav("/login");
    } else {
      setLogin('')
      nav("/login");
    }
  }
  return (
    <UserLoginContext.Provider value={{
      login, setLogin, handlerLogout

    }}>
    <div className='all'>
      <Header/>
      <Main/>
      <ImageSlider/>
      <Footer/>
    </div>
    </UserLoginContext.Provider>
  )
}

export default HomePage