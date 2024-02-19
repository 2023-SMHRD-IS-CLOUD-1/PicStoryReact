import React from 'react'
import Header from './Header'
import Login from './Login'
import Footer from './Footer'

const LoginPage = () => {
  console.log(sessionStorage.getItem("user_num"));
  return (



    <>
      <Header/>
      <Login/>
      <Footer/>
    </>

    )
}

export default LoginPage