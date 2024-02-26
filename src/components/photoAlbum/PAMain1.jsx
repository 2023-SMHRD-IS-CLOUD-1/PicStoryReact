import React, { useState, useEffect, useContext } from 'react';
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
import { UserContext } from '../../contexts/User';

const userNum = sessionStorage.getItem("user_num");


const PAMain1 = ({ uploadSuccess, fileNames }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const userNum = sessionStorage.getItem("user_num");
  const [dbSendTag, SetDbSendTag] = useState([]);
  const { showSelectedTagList, setShowSelectedTagList } = useContext(UserContext);
  const { selectedTagList, setSelectedTagList } = useContext(UserContext);
  const { tempList, setTempList } = useContext(UserContext);
  const [taggedPhotoNum, setTaggedPhotoNum] = useState([]);

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
            console.log(error);
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

  useEffect(() => {
    const filteredArray = dbSendTag.filter(item => item != undefined)

    if (filteredArray.length !== 0) {
      console.log('보내는 데이터', filteredArray);

      axiosInstance.post('/loadTaggingPhoto', filteredArray)
        .then((res) => {
          console.log(res.data);
          setTaggedPhotoNum(res.data);

          // setTaggedPhotoNum 이후에 실행되도록 보장
          const photoTagNum = {
            user_num : sessionStorage.getItem('user_num'),
            photo_num_list : res.data
          };

          console.log(photoTagNum, '##########');

          axiosInstance.post('/selectTaggedPhoto', photoTagNum)
            .then((res) => {
              console.log(res, '성공이다!!!!!!!!!');
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(error => {
          console.log(error);
        });
    }
}, [dbSendTag]);


  // useEffect(() => {
  //   const photoTagNum = {
  //     user_num : sessionStorage.getItem('user_num'),
  //     photo_num_list : taggedPhotoNum
  //   }
  //   console.log(photoTagNum, '##########');

  //   axiosInstance.post('/selectTaggedPhoto', photoTagNum)
  //     .then((res) => {
  //       console.log(res, '성공이다!!!!!!!!!');
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     })

  // }, [taggedPhotoNum])



  //   useEffect(() => {
  //     const filteredArray = dbSendTag.filter(item => item != undefined)

  //     if (filteredArray.length !== 0) {

  //         const requestData = {
  //             tags: filteredArray,
  //             user_num: sessionStorage.getItem("user_num") // 여기에 사용자 번호를 넣어주세요
  //         };

  //         axiosInstance.post('/loadTaggingPhoto', requestData)
  //             .then((res) => {
  //                 console.log(res);
  //             })
  //             .catch(error => {
  //                 console.log(error);
  //             });
  //     }
  // }, [dbSendTag]);

  useEffect(() => {
    SetDbSendTag(selectedTagList.map(item => {
      if (item == '건물') {
        return 'building'
      } else if (item == '의류') {
        return 'clothing'
      } else if (item == '차량') {
        return 'vehicle'
      } else if (item == '스포츠') {
        return 'sports'
      } else if (item == '음식') {
        return 'food'
      } else if (item == '식물') {
        return 'plant'
      } else if (item == '동물') {
        return 'animal'
      } else if (item == '사람') {
        return 'person'
      } else if (item == '가구') {
        return 'furniture'
      } else if (item == '문서') {
        return 'document'
      } else if (item == '개') {
        return 'dog'
      } else if (item == '고양이') {
        return 'cat'
      } else if (item == '바다') {
        return 'sea'
      } else if (item == '하늘') {
        return 'sky'
      } else if (item == '야경') {
        return 'night view'
      } else if (item == '디저트') {
        return 'dessert'
      } else if (item == '음료') {
        return 'drink'
      } else if (item == '예술') {
        return 'art'
      } else if (item == '뷰티&미용') {
        return 'beauty'
      } else if (item == '도서') {
        return 'books'
      } else {
        return undefined
      }
    }))
  }, [selectedTagList])

  useEffect(() => {
    setSelectedTagList([]);
    SetDbSendTag([]);
    setTempList([]);
  }, [])
  // const fetchImages2 = async () => {
  //   axiosInstance.post('/loadTaggingPhoto', {tag_name : 'selectedTagList'})
  //     .then(()=>{
  //       console.log('성공');
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     })

  // try {
  //   const response = await axiosInstance.post('/loadTaggingPhoto', {
  //     photo_tag : selectedTagList
  //   });

  //   const s3UploadFileNameMap = response.data.map(item => item.s3_photo_name);
  //   const photoFavor = response.data.map(item => item.photo_favor);

  //   if (s3UploadFileNameMap.length > 0) {
  //     const cleanedFileNames = s3UploadFileNameMap.map(name => name.replace(/"/g, ''));
  //     const updatedImageUrls = await getImageUrls(cleanedFileNames);
  //     setImageUrls(updatedImageUrls);
  //     setFavorites(photoFavor);
  //   }
  // } catch (error) {
  //   console.error('Failed to fetch images:', error);
  // }

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
              style={{ width: '200px', height: 'auto', maxHeight: '200px', objectFit: 'cover' }}
            />
            <p>{image.fileName.length > 15 ? image.fileName.slice(0, 15) + '...' : image.fileName}</p>
          </ImageListItem>
        ))}
      </ImageList>
      <button onClick={downloadSelectedImages}>선택된 이미지 다운로드</button>
    </div>
  )
}

export default PAMain1;
