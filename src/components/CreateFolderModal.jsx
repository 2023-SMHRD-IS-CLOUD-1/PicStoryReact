import React, { useEffect, useRef } from 'react'
import '../css/CreateFolderModal.css'
import axios from 'axios';

const CreateFolderModal = ({setModalOpen}) => {
  const folderName = useRef(null);
  const user_num = sessionStorage.getItem('user_num');

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8099/picstory"
  })

  const newFolderInfo = {
    user_num : user_num,
    folder_name : ''
  }

  // 폴더 버튼 클릭시 폴더이름입력창 포커스
  useEffect(()=> {
    folderName.current.focus();
  })

  // X 클릭시 모달 창 닫기
  const closemodal = () => {
      setModalOpen(false);
  }

  const createFolder = () => {
    newFolderInfo.folder_name = folderName.current.value;
    if (newFolderInfo.folder_name == '') {
      alert('폴더 이름을 입력하세요.');
    } else {
      axiosInstance.post('/folderList', newFolderInfo)
        .then(()=>{
          setModalOpen(false);
        })
        .catch(error => {
          console.log(error);
        })
    }
  }

  return (

    <div id='createModalContainer'>
      <div id='closeModalContainer'>
        <button id='closeModal' onClick={closemodal}>X</button>
      </div>
      <div id='folderNameContainer'>
        <input type="text" id='folderName' placeholder='폴더 이름' ref={folderName}/>
        <button id='makeFolderBtn' onClick={createFolder}>생성</button>
      </div>
    </div>

  )
}

export default CreateFolderModal