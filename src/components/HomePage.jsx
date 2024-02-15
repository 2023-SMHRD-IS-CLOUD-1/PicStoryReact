import React from 'react'
import Header from './Header'
import Main from './Main'
import Footer from './Footer'
import ImageSlider from './ImageSlider'

const HomePage = () => {
  return (
    <div className='all'>
      <Header/>
      <Main/>
      <ImageSlider/>
      <Footer/>
    </div>
  )
}

export default HomePage