import React, { useContext, useEffect, useState } from 'react'
import PALeftSide from './photoAlbum/PALeftSide'
import Header from './Header'
import PAMenu from './photoAlbum/PAMenu'
import PAMain1 from './photoAlbum/PAMain1'
import PAMain from './photoAlbum/PAMain'
import '../css/PhotoAlbum.css';
import { UserLoginContext } from '../contexts/UserLogin'
import { useNavigate } from 'react-router-dom'
import { LoadPhotoContext } from '../contexts/LoadPhoto'


const PhotoAlbum = () => {
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [fileNames, setFileNames] = useState([]);

  const [login, setLogin] = useState("");

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
    <>
      {/* <LoadPhotoContext.Provider value={{selectedFolder}}> */}
        <UserLoginContext.Provider value={{login, setLogin, handlerLogout}}>
          <div id='photoAlbum'>
            <Header />
            <PALeftSide setUploadSuccess={setUploadSuccess} setFileNames={setFileNames} />
            <PAMenu />
            <PAMain1 fileNames={fileNames} uploadSuccess={uploadSuccess} />
            {/* <PAMain/> */}
          </div>
        </UserLoginContext.Provider>
      {/* </LoadPhotoContext.Provider> */}
    </>
  );
};

export default PhotoAlbum;