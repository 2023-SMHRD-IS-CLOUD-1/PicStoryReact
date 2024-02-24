import React, { useState, useEffect, useRef } from 'react'
import '../../css/PALeftSide.css'
import { CiMenuKebab } from "react-icons/ci";
import TotalphotoModal from '../TotalphotoModal';
import { useNavigate } from 'react-router-dom';
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
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
  const [modalOpen, setModalOpen] = useState(false);
  const user_num = sessionStorage.getItem('user_num');
  const [folderName, setFolderName] = useState([]);
  const [folderNum, setFolderNum] = useState([]);
  const [folders, setFolders] = useState([]);
  const [makingFolder, setMakingFolder] = useState(true);
  const [folderInfoList, SetFolderInfoList] = useState([]);
  const [newFolderName, SetNewFolderName] = useState('');
  const [loadFolderState, SetLoadFolderState] = useState(0);
  const [changeA, SetChangeA] = useState(0);
  const [changeB, SetChangeB] = useState(0);
  const [changeC, SetChangeC] = useState(0);
  // 내 폴더 셀렉트에 쓰기 위한 객체
  const fileInfo = {
    user_num: user_num
  }
  // 기본 url 고정
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:8099/picstory'
  })
  // DB에 저장되어 있는 폴더 이름/식별자 가져와서 folderName, folderNum에 담는 함수
  const loadMyFolders = () => {
    axiosInstance.post('/folderListSelect', fileInfo)
      .then((res) => {
        setFolderName(res.data.map((item) => item.folder_name));
        setFolderNum(res.data.map((item) => item.folder_num));
      })
      .catch(error => {
        console.log(error);
      });
  }
  // folderName, folderNum 활용해서 li태그 뭉탱이 만드는 함수
  const makeLiTagList = () => {
    SetFolderInfoList(folderName.map((item, index) => [item, folderNum[index]]));
  }
  const makeLiTag = () => {
    setFolders(folderInfoList.map((item) => (
      <li key={item[1]} onClick={clickFolder} className='folders'>
        <div className='folderContainer'>
          <div className='folderName'>{item[0]}</div>
          <div className='folderOption' onClick={() => updateFolderName(item)}><MdOutlineDriveFileRenameOutline /></div>
          <div className='folderOption' onClick={() => deleteFolder(item)}>X</div>
        </div>
      </li>
    )));
  }
  // 폴더 이름 바꾸기 함수
  const updateFolderName = (folderNum) => {
    const temt = prompt('폴더 이름 바꾸기');
    const folderNameNum = {
      folder_num: folderNum[1],
      folder_name: temt
    }
    axiosInstance.post('/updateFolderName', folderNameNum)
      .then(() => {
        loadMyFolders();
        makeLiTagList();
        makeLiTag();
      })
      .catch(error => {
        console.log(error);
      })
  }
  // 폴더 삭제 함수
  const deleteFolder = (folderInfos) => {
    const folderInfo = {
      folder_num: folderInfos[1],
      folder_name: folderInfos[0]
    }
    console.log(folderInfo);
    console.log(folderInfo.folder_name);
    console.log(folderInfo.folder_num);
    axiosInstance.post('/deleteFolder', folderInfo)
      .then(() => {
        loadMyFolders();
        makeLiTag();
        alert('삭제 완료');
      })
      .catch(error => {
        console.log(error);
      })
  }





  // 개인 폴더 클릭
  const clickFolder = () => {
    setFavorPhotoClicked('favorPhotoBtnOff');
    setAllPhotoClicked('allPhotoBtnOff');
  }

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

  // // 폴더버튼 눌렀을 때 하위폴더 드랍다운
  // const folderListBtn = () => {
  //   if (showIcon == '▼') {
  //     setShowIcon('▶');
  //     setShow('none');
  //   } else {
  //     setShowIcon('▼');
  //     setShow('block');
  //   }
  // }
  // 폴더 생성 버튼 클릭시 작동
  const createFolder = () => {
    if (modalOpen == false) {
      setModalOpen(true); // 모달 창 열기
    } else {
      setModalOpen(false);
    }
  }
  //최초실행 
  useEffect(() => {
    setAllPhotoClicked('allPhotoBtnOn');// 페이지 최초렌더시 전체사진 선택
    allPhoto.current.focus();
    loadMyFolders();
  }, []);

  useEffect(() => {
    makeLiTagList();
  }, [folderName])

  useEffect(() => {
    makeLiTag();
  }, [folderInfoList])

  return (
    <div id='paSideConatiner'>
      <div id='sideBtnContainer'>
        <span id={allPhotoClicked} className='sideBtn' ref={allPhoto} onClick={allPhotoClick}>전체사진</span>
        <div id='folderParentContainer'>
          <div id='folderParent'>
            폴더
          </div>
          <div id='folderParentOption'>
            <div id='makeFolderBtn' onClick={createFolder}>+</div>
          </div>
        </div>
        <div>
          {modalOpen && <CreateFolderModal makeLiTag={makeLiTag} loadMyFolders={loadMyFolders} folders={folders} setModalOpen={setModalOpen} setMakingFolder={setMakingFolder} makingFolder={makingFolder} fileInfo={fileInfo} setFolderName={setFolderName} setFolderNum={setFolderNum} />}
        </div>

        <ul id='folderList'>
          {folders}
        </ul>

        <span id={favorPhotoClicked} className='sideBtn' onClick={favorPhotoClick}>즐겨찾기</span>
        <span className='sideBtn'>
        </span>
      </div>
    </div>
  )
}

export default PALeftSide