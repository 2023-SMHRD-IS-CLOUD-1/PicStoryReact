import React, { useState } from 'react';
import PALeftSide from './photoAlbum/PALeftSide';
import UserFolder from './photoAlbum/UserFolder';
import { Menu } from '@mui/material';
import Header from './Header';
import PAMenu from './photoAlbum/PAMenu';

const UserFolderPage = () => {

    



  return (
    <div>
        <Header/>
        <PALeftSide/>
        <PAMenu/>
        <UserFolder/>
        
    </div>
  )
}

export default UserFolderPage
