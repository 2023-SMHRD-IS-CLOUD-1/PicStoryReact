import React from 'react'
import PALeftSide from './photoAlbum/PALeftSide'
import PAMain from './photoAlbum/PAMain'
import Header from './Header'
import PAMenu from './photoAlbum/PAMenu'
import '../css/PhotoAlbum.css'
const PhotoAlbum = () => {
  return (
    <>
      <Header/>
      <div id='photoAlbum'>
        <PALeftSide/>
        <PAMenu/>
        <PAMain/>
      </div>
    </>
  )
}

export default PhotoAlbum