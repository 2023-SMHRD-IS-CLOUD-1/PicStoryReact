import React, { useContext, useState, useEffect } from 'react'
import '../../css/PAMenu.css'
import { HiXMark } from "react-icons/hi2";
import TagModal from '../TagModal';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { UserContext } from '../../contexts/User';
import { useRef } from 'react';

const id_key = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
const secret_key = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
const region = process.env.REACT_APP_AWS_REGION
const bucketName = 'codewi';

const config = {
  bucketName: bucketName,
  region: region,
  accessKeyId: id_key,
  secretAccessKey: secret_key
};

const s3 = new AWS.S3(config);

const PAMenu = ({ setUploadSuccess, setFileNames }) => {

  const [modalOpen, setModalOpen] = useState(false);
  const [similarModalOpen, setSimilarModalOpen] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadingPhotos, setUploadingPhotos] = useState([]); // 업로드 선택한 사진들 배열
  const [uploadingPhotosSizes, setUploadingPhotosSizes] = useState([]); // 업로드 선택한 사진들 사이즈 배열
  const [uploadingPhotoUrl, setUploadingPhotoUrl] = useState([]); // 업로드 선택한 사진들 url
  const [tempTag, setTempTah] = useState([]);
  const userNum = sessionStorage.getItem("user_num")
  const [deleteTagName, setDeleteTagname] = useState('');
  const { tempList, setTempList } = useContext(UserContext);
  const { selectedTagList, setSelectedTagList } = useContext(UserContext);
  const { showSelectedTagList, setShowSelectedTagList } = useContext(UserContext);
  const { selecteMydFolder, setSelectedMyFolder } = useContext(UserContext);
  const { allMyFolder, setAllMyFolder } = useContext(UserContext);
  const [allMyFolder1, setAllMyFolder1] = useState([]);
  const { checkPhotoNum, setCheckPhotoNum } = useContext(UserContext);
  const [moveFolderModal, setMoveFolderModal] = useState('none');
  const [modalImages, setModalImages] = useState([]);
  const modalRef = useRef();

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

  // S3에서 이미지 URL 가져오기(유사이미지기능)
  const getImageURL = async (fileName) => {
    const imageURL = await s3.getSignedUrlPromise('getObject', {
      Bucket: bucketName,
      Key: `user_num${userNum}/image/${fileName}`,
    });
    return imageURL;
  };

  // 유사이미지 찾기!!!!
  const [selectedImage, setSelectedImage] = useState(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };
  const handleUploadImage = async () => {
    if (!selectedImage) {
      console.error('이미지를 선택하세요.');
      return;
    }

    try {
      // 파일을 base64 문자열로 변환
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onloadend = async () => {
        const base64Data = reader.result;

        // Flask 서버에 이미지 데이터와 사용자 식별번호 전송
        const response = await axios.post('http://54.70.10.23:4007/predict', {
          user_num: userNum,
          image_data: base64Data
        });

        console.log('유사이미지 응답:', response.data);

        // 응답에서 파일 이름 목록 추출
        const fileNameList = response.data.file_name_list;

        // 각 파일 이름에 대해 S3에서 이미지 URL 가져오기
        const similarImageUrls = [];
        for (const fileName of fileNameList) {
          const imageUrls = await getImageURL(fileName);
          similarImageUrls.push(imageUrls);
        }
        console.log("imageURLs!!!! : ", similarImageUrls);

        openModalWithImages(similarImageUrls);

      };
    } catch (error) {
      console.error('유사이미지 오류:', error);
    }
  };

  // 유사이미지모달 창 열고 이미지 띄우기
  const openModalWithImages = (imageUrls) => {

    setModalImages(imageUrls); // 모달에 표시할 이미지 배열 설정
    setSimilarModalOpen(true);
  };

  // 유사이미지 모달 컴포넌트
  const SimilarModal = ({ similarModalOpen, setSimilarModalOpen, modalImages, }) => {
    const handleCloseModal = () => {
      setSimilarModalOpen(false);
      setModalImages([]); // 모달이 닫힐 때 modalImages 상태를 초기화
    };
    return (
      <div className={similarModalOpen ? 'modal display-block' : 'modal display-none'}>
        <div className="modal-overlay" onClick={() => setSimilarModalOpen(false)}></div>
        <div className="modal-content">
          <span className="close" onClick={() => setSimilarModalOpen(false)}>&times;</span>
          <div className="modal-body">
            {modalImages.map((image, index) => (
              <img key={index} src={image} alt={`Image ${index}`} />
            ))}
          </div>
        </div>
      </div>
    );
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
            Key: `user_num${userNum}/image/${fileName}`,
            Body: file,
          };

          const data = await s3.upload(params).promise();

          return { fileName, fileUrl: data.Location };
        }));

        //인덱스파일 생성함수
        const updateUserIndex = async (userNum) => {
          const apiUrl = 'http://54.70.10.23:4008/update'; // Flask 서버 URL
          console.log("url : ", apiUrl);
          try {
            // axios.put 요청에서 두 번째 인자는 요청 본문(body)이고, 세 번째 인자에 요청 헤더를 정의할 수 있습니다.
            const response = await axios.put(apiUrl, { user_num: userNum }, {
              headers: {
                'Content-Type': 'application/json'
              }
            });
            console.log("인덱스 결과 : ", response.data.message);
          } catch (error) {
            console.error('Error updating user index:', error);
          }
        };

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
          setUploadSuccess(true);
          setFileNames(fileNames); // PAMain1에서 이미지를 불러오도록 업데이트
          console.log("특징벡터 : ", response.data); // 특징벡터들 출력
          const featureDataArray = response.data.images;

          //특징벡터 s3에 저장
          featureDataArray.forEach(async (item) => {
            const featureData = item.features[0];
            const jsonData = JSON.stringify(featureData);
            const s3Key = `user_num${userNum}/vector/${item.filename.split('.')[0]}.json`;

            try {
              await s3.upload({
                Bucket: config.bucketName,
                Key: s3Key,
                Body: jsonData,
                ContentType: 'application/json',
              }).promise();

              console.log(`특징 벡터가 ${s3Key}로 업로드되었습니다.`);
              console.log("쫌!!!!");
              updateUserIndex(userNum);

            } catch (err) {
              console.error(`${item.filename}의 특징 벡터 업로드 중 오류 발생:`, err);
            }
          });

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
  }, [uploadingPhotos, setUploadSuccess, setFileNames]);


  useEffect(() => {
    setShowSelectedTagList(tempList.map((item, index) => {
      // index가 1 이상인 경우에만 매핑
      if (index >= 1) {
        return (
          <div key={index} className='tagContainer'>
            <div className='selectedTags'>
              {item}
            </div>
            <div className='tagDelete' onClick={() => deleteSelectTag(item)}>
              <HiXMark />
            </div>
          </div>
        );
      }
      return null; // index가 0인 경우는 건너뛰기
    }));
  }, [tempList]);


  const deleteSelectTag = (item) => {
    setDeleteTagname(item);
  };

  useEffect(() => {
    setTempList(tempList.filter(item => item !== deleteTagName));
  }, [deleteTagName])

  useEffect(() => {
    setSelectedTagList(tempList);
  }, [tempList])

  useEffect(() => {
    if (checkPhotoNum.length != []) {
      console.log('내가 체크한 사진의 포토넘 : ', checkPhotoNum);
    } else {
      console.log('체크한 사진 없음.');
    }

  }, [checkPhotoNum])

  const deleteCheckedPhoto = () => {
    console.log(checkPhotoNum, '체크트포토넘');
    if (checkPhotoNum.length == 0) {
      alert('삭제할 사진을 선택하세요.');
    } else {
      axiosInstance.post('/deleteChckedPhoto', checkPhotoNum)
        .then((res) => {
          alert('삭제 완료');
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        })
    }
  }

  const movePhotoToFolder = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setMoveFolderModal('none');
    } else if (allMyFolder.length == 0) {
      alert('폴더를 생성하세요.')
    } else if (moveFolderModal == 'none') {
      setMoveFolderModal('block');
    } else {
      setMoveFolderModal('none');
    }
  }


  useEffect(() => {
    if (moveFolderModal == 'none') {
      setAllMyFolder1([]);
    } else {
      setAllMyFolder1(allMyFolder.map((item, index) => (
        <div className='moveFolderModal' ref={modalRef} key={index} onClick={() => addToFolder(item)}>
          {item}
        </div>
      ))
      )
    }
  }, [moveFolderModal])

  const addToFolder = (item) => {
    if (checkPhotoNum.length == 0) {
      alert('담을 사진을 선택하세요.');
    } else {
      const data = {
        user_num: sessionStorage.getItem('user_num'),
        folder_name: item
      }
      axiosInstance.post('/addPhotoToFolder', data)
        .then((res) => {
          const data = {
            photo_nums: checkPhotoNum,
            folder_num: res.data.folder_num
          }
          axiosInstance.post('/savePhotoInFolder', data)
            .then((res) => {
              alert('이동 완료');
              window.location.reload();
            })
            .catch((error) => {
              console.log(error);
            })
        })
        .catch((error) => {
          console.log(error);
        })
      console.log(item);
      console.log(checkPhotoNum);
    }
    setMoveFolderModal('none')
  }


  return (
    <div id='paMenuContainer'>
      <div id='paMenuOption'>
        <div id='photoSelectAll'>
          {/* 전체선택<input type="checkbox" /> */}
          <label className="custom-file-upload">
            <input type="file" mul강아지tiple onChange={uploadMyPhoto} accept='image/*' />
            사진 업로드
          </label>

        </div>
        <div id='photoControl'>
          <div className='photoControlBtn'>내려받기</div>
          <div className='photoControlBtn' onClick={movePhotoToFolder}>내 폴더에 담기</div>
          <div className='moveFolderModalContainer' style={{ display: moveFolderModal }}>
            {allMyFolder1}
          </div>
          <div className='photoControlBtn' onClick={deleteCheckedPhoto}>삭제</div>
        </div>
      </div>
      <div id='tagChooseContainer'>
        <div id='tagChooseBtn' onClick={showModal}>태그 선택</div>
        {modalOpen && <TagModal setModalOpen={setModalOpen} />}
      </div>
      <div id='selectedTagContainer'>
        {showSelectedTagList}
        {/* <div className='tagContainer'>
          <div className='selectedTags'>
            #강아지
          </div>
          <div className='tagDelete'>
            <HiXMark />
          </div>
        </div> */}
      </div>
      <div id='searchContainer'>
        <input type="file" onChange={handleImageChange} />
        <button onClick={handleUploadImage}>닮은 이미지 찾기</button>
        {similarModalOpen && <SimilarModal similarModalOpen={similarModalOpen} setSimilarModalOpen={setSimilarModalOpen} modalImages={modalImages} />}
      </div>
    </div>
  )
}

export default PAMenu