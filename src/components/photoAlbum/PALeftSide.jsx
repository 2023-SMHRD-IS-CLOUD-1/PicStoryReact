import React, { useState, useEffect } from 'react'
import '../../css/PALeftSide.css'
import { CiMenuKebab } from "react-icons/ci";
import TotalphotoModal from '../TotalphotoModal';

// 채린
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
/* eslint-disable no-unused-vars */

const config = {
  bucketName: 'codewi',
  region: 'ap-northeast-2',
  accessKeyId: 'AKIAZQ3DRESJCEVISYPZ',
  secretAccessKey: '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',
};

const s3 = new AWS.S3(config);


const PALeftSide = ({ setUploadSuccess, setFileNames }) => {
  const [showIcon, setShowIcon] = useState('▶');
  const [show, setShow] = useState('none');
  

  // 채린
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFileUrls, setUploadedFileUrls] = useState([]);
  const [uploadedFileSizes, setUploadedFileSizes] = useState([]);

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:8099/picstory',
  });

  useEffect(() => {
    const uploadFiles = async () => {
      try {
        if (selectedFiles.length === 0) {
          console.log('파일을 선택하세요.');
          return;
        }

        const uploadedFileData = await Promise.all(selectedFiles.map(async (file) => {
          const fileName = `${uuidv4()}_${file.name}`;
          const params = {
            Bucket: config.bucketName,
            Key: `folder/${fileName}`,
            Body: file,
          };

          const data = await s3.upload(params).promise();
          console.log('파일 업로드 성공:', data.Location);

          return { fileName, fileUrl: data.Location };
        }));

        const fileNames = uploadedFileData.map((fileData) => fileData.fileName);
        const fileURLs = uploadedFileData.map((fileData) => fileData.fileUrl);
        console.log('업로드된 파일 이름:', fileNames);
        console.log('업로드된 파일 URL:', fileURLs);

        if (fileURLs.length === 0) {
          return;
        }

        const fileNamesString = JSON.stringify(fileNames);
        const fileURLsString = JSON.stringify(fileURLs);
        const fileSizeString = JSON.stringify(uploadedFileSizes);
        const storageUserNum = sessionStorage.getItem("user_num");

        console.log('uploadedFileSize', uploadedFileSizes);

        const data = {
          user_num: storageUserNum,
          photo_name: fileNamesString,
          photo_url: fileURLsString,
          photo_size: fileSizeString,
          length: fileNames.length
        };

        console.log("서버에 보내는 data: ", data);

        try {
          const response = await axiosInstance.post('/imageUpload', data);
          console.log('서버 응답:', response.data);
          setUploadSuccess(true);
          setFileNames(fileNames); // PAMain1에서 이미지를 불러오도록 업데이트
        } catch (error) {
          console.error('서버 통신 에러:', error);
        }

        setUploadedFileUrls(fileURLs);
        setSelectedFiles([]); // 업로드 후에 selectedFiles 초기화

        console.log('모든 파일 업로드 성공');
      } catch (error) {
        console.error('파일 업로드 에러:', error);
      }
    };

    uploadFiles();
  }, [selectedFiles, setUploadSuccess, setFileNames]);

  const handleFileInput = (e) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const selectedFilesArray = Array.from(files);
      setSelectedFiles(selectedFilesArray);
      const sizes = selectedFilesArray.map((file) => (file.size / 1024).toFixed(2) + ' KB');
      setUploadedFileSizes(sizes);

      const uploadedFileUrlsArray = selectedFilesArray.map((file) => URL.createObjectURL(file));
      setUploadedFileUrls(uploadedFileUrlsArray);
    }
  };
  // 여기까지 채린

  let folderListBtn = () => {
    if (showIcon == '▶') {
      setShowIcon('▼');
      setShow('block');
    } else {
      setShowIcon('▶');
      setShow('none');
    }
  }

  return (
    <div id='paSideConatiner'>
      <div id='sideBtnContainer'>
        <span className='sideBtn'>전체사진</span>
        <div id='folderParentContainer'>
          <div id='folderParent' onClick={folderListBtn}>
            {showIcon} 폴더
          </div>
          <div id='folderParentOption'>
            <CiMenuKebab />
          </div>
        </div>
        <ul id='folderList'>
          <li className='folders' style={{ display: show }}>
            <div className='folderContainer'>
              <div className='folderName'>개&고양이</div>
              <div className='folderOption'><CiMenuKebab /></div>
            </div>
          </li>
          <li className='folders' style={{ display: show }}>
            <div className='folderContainer'>
              <div className='folderName'>여행사진</div>
              <div className='folderOption'><CiMenuKebab /></div>
            </div>
          </li>
          <li className='folders' style={{ display: show }}>
            <div className='folderContainer'>
              <div className='folderName'>음식 사진</div>
              <div className='folderOption'><CiMenuKebab /></div>
            </div>
          </li>
          <li className='folders' style={{ display: show }}>
            <div className='folderContainer'>
              <div className='folderName'>셀카</div>
              <div className='folderOption'><CiMenuKebab /></div>
            </div>
          </li>
        </ul>
        <span className='sideBtn'>
          <input type="file" multiple onChange={handleFileInput} accept='.jpg,.png' />
        </span>
      </div>
    </div>
  )
}

export default PALeftSide