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

const userNum = sessionStorage.getItem("user_num");


const PAMain1 = ({ uploadSuccess, fileNames }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const userNum = sessionStorage.getItem("user_num");

  const region = process.env.REACT_APP_AWS_REGION
  const identityPoolId = process.env.REACT_APP_AWS_IdentityPoolId;
 

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8099/picstory",
  });

  const fetchImages = async () => {
    try {
      const response = await axiosInstance.post('/imageDownload', {
        user_num: userNum
      });

      const s3UploadFileNameMap = response.data.map(item => item.s3_photo_name);
      const photoFavor = response.data.map(item => item.photo_favor);

      if (s3UploadFileNameMap.length > 0) {
        const cleanedFileNames = s3UploadFileNameMap.map(name => name.replace(/"/g, ''));
        const updatedImageUrls = await getImageUrls(cleanedFileNames);
        setImageUrls(updatedImageUrls);
        setFavorites(photoFavor);
      }
    } catch (error) {
      console.error('Failed to fetch images:', error);
    }
  };

  const getImageUrls = async (fileNames) => {
    const s3BucketName = 'codewi';
    const updatedImageUrls = [];

    for (const fileName of fileNames) {
      const s3ObjectKey = `user_num${userNum}/image/${fileName}`;

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
        const response = await s3Client.send(getObjectCommand);
        const imageData = await response.Body.getReader().read();
        const s3url = URL.createObjectURL(new Blob([imageData.value], { type: response.ContentType }));

        updatedImageUrls.push({ url: s3url, fileName });
      } catch (error) {
        console.error('Error fetching S3 image:', error);
      }
    }

    return updatedImageUrls;
  };

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
      <button onClick={downloadSelectedImages}>선택된 이미지 다운로드</button>
    </div>
  );
};

export default PAMain1;
