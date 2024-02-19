import React, { useState } from 'react'
import PALeftSide from './photoAlbum/PALeftSide'
import Header from './Header'
import PAMenu from './photoAlbum/PAMenu'
import PAMain1 from './photoAlbum/PAMain1'
import '../css/PhotoAlbum.css';

const PhotoAlbum = () => {
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [fileNames, setFileNames] = useState([]);
  

  return (
    <>
      <Header />
      <div id='photoAlbum'>
        <PALeftSide setUploadSuccess={setUploadSuccess} setFileNames={setFileNames} />
        <PAMenu/>
        <PAMain1 fileNames={fileNames} uploadSuccess={uploadSuccess}/>
      </div>
    </>
  );
};

export default PhotoAlbum;