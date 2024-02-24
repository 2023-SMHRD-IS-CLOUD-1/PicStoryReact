import React, { useState, useEffect } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import axios from 'axios';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import '../../css/PAMain.css';


const PAMain1 = ({ uploadSuccess, fileNames }) => {
  const [imageUrls, setImageUrls] = useState([]); // 사진list url 배열
  const [selectedImages, setSelectedImages] = useState([]); // 내가 선택한 이미지 배열
  const [favorites, setFavorites] = useState([]); // 좋아요 클릭한 이미지 배열
  const [selectAll, setSelectAll] = useState(false); // 전체선택 여부
  const userNum = sessionStorage.getItem("user_num");

  const region = process.env.REACT_APP_AWS_REGION
  const identityPoolId = process.env.REACT_APP_AWS_IdentityPoolId;


  const axiosInstance = axios.create({
    baseURL: "http://localhost:8099/picstory",
  });

  // 화면에 띄울 사진 정보 S3에 접근해서 가져오기
  const fetchImages = async () => {
    // DB에 저장된 사진정보 가져오기
    try {
      const response = await axiosInstance.post('/imageDownload', {
        user_num: userNum
      });
      const s3UploadFileNameMap = response.data.map(item => item.s3_photo_name); // S3에서 쓸 원파일명을 변수에 담기
      const photoFavor = response.data.map(item => item.photo_favor); // 디비에서 뽑아온 사진 정보중 좋아요 여부 변수에 담기.

      // 가져온 사진이 존재하면
      if (s3UploadFileNameMap.length > 0) {
        const cleanedFileNames = s3UploadFileNameMap.map(name => name.replace(/"/g, '')); // DB파일명 잘라서 저장 (수정 해야함)
        const updatedImageUrls = await getImageUrls(cleanedFileNames); // 
        setImageUrls(updatedImageUrls);
        setFavorites(photoFavor);
      }
    } catch (error) {
      console.error('Failed to fetch images:', error);
    }
  };


  // DB에서 뽑아낸 데이터로 S3 접근해서 사진 불러오기
  const getImageUrls = async (fileNames) => {
    const s3BucketName = 'codewi';
    const updatedImageUrls = [];

    for (const fileName of fileNames) {
      const s3ObjectKey = `user_num${userNum}/${fileName}`;

      const s3Client = new S3Client({
        region: region,
        credentials: fromCognitoIdentityPool({
          client: new CognitoIdentityClient({ region: region }),
          identityPoolId: identityPoolId,
        }),
      });

      const getObjectCommand = new GetObjectCommand({
        Bucket: s3BucketName,
        Key: s3ObjectKey,
      });

      try {
        console.log('2222222222222');
        const response = await s3Client.send();
        console.log('33333333333');
        const imageData = await response.Body.getReader().read();
        console.log('44444444444');
        const s3url = URL.createObjectURL(new Blob([imageData.value], { type: response.ContentType }));

        console.log('555555555555');
        updatedImageUrls.push({ url: s3url, fileName });
        console.log('5666666666666666');
      } catch (error) {
        console.log('응 안돼');
        console.error('Error fetching S3 image:', error);
      }
    }

    return updatedImageUrls;
  };




  // 
  useEffect(() => {
    fetchImages();
  }, [uploadSuccess, fileNames]);




  const toggleImageSelection = (fileName) => {
    setSelectedImages((prevSelected) => {
      if (prevSelected.includes(fileName)) {
        return prevSelected.filter((selected) => selected !== fileName);
      } else {
        return [...prevSelected, fileName];
      }
    });
  };



  const toggleSelectAll = () => {
    setSelectAll((prevSelectAll) => !prevSelectAll);
    setSelectedImages((prevSelected) => {
      const selectedFileNames = selectAll ? [] : imageUrls.map((image) => image.fileName);
      return selectedFileNames;
    });
  };




  const addToFavorites = (fileName) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(fileName)) {
        console.log(`좋아요 버튼이 해제된 이미지의 파일 이름: ${fileName}`);
        console.log("하트 해제");

        const favorTrueData = JSON.stringify(fileName)

        axiosInstance.post("/favorFalse", {
          s3_photo_name: favorTrueData
        }
        )
          .then(() => {

          })
          .catch(error => {
            console.error(error);
          });



        return prevFavorites.filter((favorite) => favorite !== fileName);
      } else {
        console.log(`좋아요 버튼이 클릭된 이미지의 파일 이름: ${fileName}`);
        console.log("하트 눌림");

        const favorTrueData = JSON.stringify(fileName)
        axiosInstance.post("/favorTrue", {

          s3_photo_name: favorTrueData

        })
          .then(() => {

          })
          .catch(error => {
            console.error(error);
          });

        return [...prevFavorites, fileName];
      }
    });
  };

  // 다운로드 버튼 눌렀을 때 선택된 이미지들 다운로드
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

  return (
    <div id='paMainContainer'>
      <div style={{ position: 'absolute', right: '42px', top: '119px' }}>
        전체선택<Checkbox
          checked={selectAll}
          onChange={toggleSelectAll}
        />
        <button onClick={downloadSelectedImages}>선택된 이미지 다운로드</button>
      </div>
      <ImageList sx={{ width: 1500, height: 800 }} cols={7}>
        {imageUrls.map((image, index) => (
          <ImageListItem key={index} style={{ margin: '3px' }}>
            <div style={{ position: 'absolute', top: 0, left: 0 }}>
              <Checkbox
                checked={selectedImages.includes(image.fileName)}
                onChange={() => toggleImageSelection(image.fileName)}
              />
            </div>
            <div style={{ position: 'absolute', top: 0, right: 0 }}>
              <IconButton
                onClick={() => addToFavorites(image.fileName)}
                sx={{ color: 'white' }}
              >
                {favorites.includes(image.fileName) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </div>
            <img
              src={image.url}
              alt={`S3-${index}`}
              loading="lazy"
              style={{ width: '100%', height: 'auto', maxHeight: '200px', objectFit: 'cover' }}
            />
            <p>{image.fileName}</p>
          </ImageListItem>
        ))}
      </ImageList>

    </div>
  );
};

export default PAMain1;
