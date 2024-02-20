import React, { useState } from 'react';
import PALeftSide from './photoAlbum/PALeftSide';
import Favor from './photoAlbum/Favor';
import { Menu } from '@mui/material';
import Header from './Header';
import PAMenu from './photoAlbum/PAMenu';

const FavorPage = () => {
  return (
    <div>
        <Header/>
        <PALeftSide/>
        <PAMenu/>
        <Favor/>
        
    </div>
  )
}

export default FavorPage
