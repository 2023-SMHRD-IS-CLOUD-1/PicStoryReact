import React, { useContext, useState, useEffect } from 'react'
import '../../css/PAMenu.css'
import { HiXMark } from "react-icons/hi2";
import TagModal from '../TagModal';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const config = {
  bucketName: 'opens3007',
  region: 'ap-northeast-2',
  accessKeyId: 'AKIAZQ3DRESJCEVISYPZ',
  secretAccessKey: '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',
};

const s3 = new AWS.S3(config);

const PAMenu = () => {

  const [modalOpen, setModalOpen] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadingPhotos, setUploadingPhotos] = useState([]); // 업로드 선택한 사진들 배열
  const [uploadingPhotosSizes, setUploadingPhotosSizes] = useState([]); // 업로드 선택한 사진들 사이즈 배열
  const [uploadingPhotoUrl, setUploadingPhotoUrl] = useState([]); // 업로드 선택한 사진들 url

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8099/picstory",
  });

  const showModal = () => {
    setModalOpen(true);
  }

  const downloadSelectedImages = () => {
    for (const fileName of selectedImages) {
      const selectedImage = imageUrls.find((image) => image.fileName === fileName);

      if (selectedImage) {
        const link = document.createElement('a');
        link.href = selectedImage.url;
        link.download = fileName;
        link.click();
      }
    }
  };

  // 업로드 선택한 사진들 사진정보, 크기, url 배열로 만드는 함수
  const uploadMyPhoto = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadingPhotos(Array.from(files));
      setUploadingPhotosSizes(Array.from(files).map((file) => (file.size / 1024).toFixed(2) + 'KB'));
      setUploadingPhotoUrl(Array.from(files).map((file) => URL.createObjectURL(file)));
    } else {
      console.log('안올렸음');
    }
  };

  useEffect(() => {

    const uploadFiles = async () => {
      try {

        // 선택한 폴더 없으면 예외
        if (uploadingPhotos.length === 0) {
          return;
        }
        
        
        // S3에 사진 넣는 함수
        const uploadedFileData = await Promise.all(uploadingPhotos.map(async (file) => {
          const fileName = `${uuidv4()}_${file.name}`;
          const params = {
            Bucket: config.bucketName,
            Key: `folder/${fileName}`,
            Body: file,
          };
          
          const data = await s3.upload(params).promise();
          
          return { fileName, fileUrl: data.Location };
        }));
        
        // S3에 있는 데이터 가져오기(원파일명, 사진경로, 사용자 파일명)
        const fileNames = uploadedFileData.map((fileData) => fileData.fileName);
        const fileURLs = uploadedFileData.map((fileData) => fileData.fileUrl);
        const userPhotoName = uploadingPhotos.map((file) => file.name);
        
        // 선택한 폴더 url예외
        if (fileURLs.length === 0) {
          return;
        }

        // S3에서 가져온 데이터 DB에 값 보내기 위해 stringfy
        const fileNamesString = JSON.stringify(fileNames); // 원파일명
        const fileURLsString = JSON.stringify(fileURLs); // url 경로
        const fileSizeString = JSON.stringify(uploadingPhotosSizes); // 파일 사이즈
        const userPhotoNameString = JSON.stringify(userPhotoName); // 사용자 파일명
        const storageUserNum = sessionStorage.getItem("user_num"); // 사용자 식별번호

        // 스프링에 보내기 위해 필요한 정보 객체화
        const data = {
          user_num: storageUserNum, // 사용자 식별번호
          s3_photo_name: fileNamesString, // 원 파일명
          user_photo_name: userPhotoNameString, // 사용자 파일명 
          photo_url: fileURLsString, // 사진 경로
          photo_size: fileSizeString, // 사진 크기
          length: fileNames.length // 선택된 사진 파일 개수
        };

        // 선택한 사진들 DB에 저장.
        try {
          const response = await axiosInstance.post('/imageUpload', data); // 스프링 이미지업로드 쿼리문 실행
          // setUploadSuccess(true);
          // setFileNames(fileNames); // PAMain1에서 이미지를 불러오도록 업데이트
        } catch (error) {
          alert('파일 이름이 너무 김, 업로드 실패');
          console.error('서버 통신 에러:', error);
        }


        setUploadingPhotoUrl(fileURLs);
        setUploadingPhotos([]); // 업로드 후에 selectedFiles 초기화

      } catch (error) {
        console.error('파일 업로드 에러:', error);
      }
    };

    uploadFiles();
  }, [uploadingPhotos]);

  return (
    <div id='paMenuContainer'>
      <div id='paMenuOption'>
        <div id='photoSelectAll'>
          전체선택<input type="checkbox" />
          <label className="custom-file-upload">
            <input type="file" multiple onChange={uploadMyPhoto} accept='image/*' />
            사진 업로드
          </label>

        </div>
        <div id='photoControl'>
          <div className='photoControlBtn'>내려받기</div>
          <div className='photoControlBtn'>폴더에 추가</div>
          <div className='photoControlBtn'>삭제</div>
        </div>
      </div>
      <div id='tagChooseContainer'>
        <div id='tagChooseBtn' onClick={showModal}>태그 선택</div>
        {modalOpen && <TagModal setModalOpen={setModalOpen} />}
      </div>
      <div id='selectedTagContainer'>
        <div className='tagContainer'>
          <div className='selectedTags'>
            #강아지
          </div>
          <div className='tagDelete'>
            <HiXMark />
          </div>
        </div>
      </div>
      <div id='searchContainer'>
        <input type="text" placeholder='사진 이름으로 검색해 보세요.' id='photoSearchText' />
        <div id='photoSearchBtn'>검색</div>
      </div>
    </div>
  )
}

export default PAMenu