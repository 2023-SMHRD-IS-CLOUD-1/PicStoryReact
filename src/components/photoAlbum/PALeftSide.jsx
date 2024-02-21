import React, { useState, useEffect, useRef } from 'react'
import '../../css/PALeftSide.css'
import { CiMenuKebab } from "react-icons/ci";
import TotalphotoModal from '../TotalphotoModal';
import { useNavigate } from 'react-router-dom';
// 채린
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import CreateFolderModal from '../CreateFolderModal';
/* eslint-disable no-unused-vars */

const config = {
  bucketName: 'codewi',
  region: 'ap-northeast-2',
  accessKeyId: 'AKIAZQ3DRESJCEVISYPZ',
  secretAccessKey: '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',
};

const s3 = new AWS.S3(config);


const PALeftSide = ({ setUploadSuccess, setFileNames }) => {

  const allPhoto = useRef(null);
  const [selectedFolder, setSelectedFolder] = useState('전체사진');
  const [allPhotoClicked, setAllPhotoClicked] = useState('allPhotoBtnOff');
  const [favorPhotoClicked, setFavorPhotoClicked] = useState('favorPhotoBtnOff');
  const [showIcon, setShowIcon] = useState('▶');
  const [show, setShow] = useState('none');
  const [modalOpen, setModalOpen] = useState(false);
  const user_num = sessionStorage.getItem('user_num');
  const [folderName, setFolderName] = useState([]);
  const [folderNum, setFolderNum] = useState([]);

  const fileInfo = {
    user_num : user_num
  }

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:8099/picstory'
  })
  useEffect(()=>{
    axiosInstance.post('/folderListSelect', fileInfo)
      .then((res)=>{
        console.log('바로 실행 : ',res.data);
        setFolderName(res.data.map((item) => item.folder_name)); 
        setFolderNum(res.data.map((item)=> item.folder_num));
      })
      .catch(error =>{
        console.log(error);
      });
    // 페이지 최초렌더시 전체사진 선택
    setAllPhotoClicked('allPhotoBtnOn');
    allPhoto.current.focus();
  },[])

  // 전체사진 폴더 선택
  const allPhotoClick = () => {
    setAllPhotoClicked('allPhotoBtnOn');
    setFavorPhotoClicked('favorPhotoBtnOff');
    setSelectedFolder('전체사진');
  }

  // 즐겨찾기 폴더 선택
  const favorPhotoClick = () => {
    setAllPhotoClicked('allPhotoBtnOff');
    setFavorPhotoClicked('favorPhotoBtnOn');
    setSelectedFolder('즐겨찾기');
  }
  
  // 폴더버튼 눌렀을 때 하위폴더 드랍다운
  let folderListBtn = () => {
    if (showIcon == '▶') {
      setShowIcon('▼');
      setShow('block');
    } else {
      setShowIcon('▶');
      setShow('none');
    }
  }

  // 폴더 생성 버튼 클릭시 작동
  const createFolder = () => {
    if (modalOpen == false) {
      setModalOpen(true); // 모달 창 열기
    } else {
      setModalOpen(false);
    }
  }

  return (
    <div id='paSideConatiner'>
      <div id='sideBtnContainer'>
        <span id={allPhotoClicked} className='sideBtn' ref={allPhoto} onClick={allPhotoClick}>전체사진</span>
        <div id='folderParentContainer'>
          <div id='folderParent' onClick={folderListBtn}>
            {showIcon} 폴더
          </div>
          <div id='folderParentOption'>
            <div id='makeFolderBtn' onClick={createFolder}>+</div>
          </div>
        </div>
            <div>
            {modalOpen && <CreateFolderModal setModalOpen={setModalOpen}/>}
            </div>

        <ul id='folderList'>
          <li className='folders' style={{ display: show }}>
            <div className='folderContainer'>
              <div className='folderName'>개&고양이</div>
              <div className='folderOption'><CiMenuKebab /></div>
            </div>
          </li>
        </ul>

        <span id={favorPhotoClicked} className='sideBtn' onClick={favorPhotoClick}>즐겨찾기</span>
        <span className='sideBtn'>
        </span>
      </div>
    </div>
  )
}

export default PALeftSide