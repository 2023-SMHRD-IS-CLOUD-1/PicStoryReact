import React, { useContext } from 'react'
import { useState, useEffect } from 'react';
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
const UserFolder = () => {
    const [imageUrls, setImageUrls] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const userNum = sessionStorage.getItem("user_num");

    let region = process.env.REACT_APP_AWS_REGION
    let identityPoolId = process.env.REACT_APP_AWS_IdentityPoolId;



    const { selecteMydFolder, setSelectedMyFolder } = useContext(UserContext);
    const [userFolderList, setUserFolderList] = useState([]);

    const axiosInstance = axios.create({
        baseURL: "http://localhost:8099/picstory",
    });

    useEffect(() => {
        setSelectedMyFolder([]);
      }, [])

    useEffect(() => {
        console.log(selecteMydFolder,'@@@@@@@@@@@');

        if (selecteMydFolder.length != 0) {
            const data = {
                user_num: sessionStorage.getItem('user_num'),
                folder_name: selecteMydFolder
            }
            axiosInstance.post('/findFolderNum', data)
                .then((res) => {
                    // 폴더에 데이터 없을때(폴더 없음 alert창 뜨고 메인 화면 로고 클릭해서 홈으로 돌아갔다가 다시 사진첩 페이지 
                    //                    오면 페이지 로딩 전에 alert창 또 뜸 >> 새로고침 해야 안뜸)
                    if (res.data.length == 0) {
                        alert('해당 폴더에 사진이 존재하지 않습니다.')
                        // 클릭한 폴더에 사진 데이터 담겨 있으면
                    } else {
                        // res.data = ([{…}, {…}, {…}, {…}]) 객체들의 배열 형태로 나옴.
                        console.log(res.data);
                        const UserFolder = res.data.map(item => item.s3_photo_name)
                        const cleanedUserFolder = UserFolder.map(name => name.replace(/"/g, ''));
                        console.log("cleanedUserFolder 선택된 폴더 리스트", cleanedUserFolder);
                        setUserFolderList(cleanedUserFolder)


                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }, [])



    const fetchImages = async () => {



        if (userFolderList.length > 0) {
            const updatedImageUrls = await getImageUrls(userFolderList);
            setImageUrls(updatedImageUrls);
        }
    }
    const getImageUrls = async (fileNames) => {
        region = region;
        identityPoolId = identityPoolId;
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


    }, [userFolderList]);

    const toggleImageSelection = (fileName) => {

        console.log('선택된 파일 이름 ; ', fileName);

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
            console.log('전체 선택된 파일 이름들:', selectedFileNames); // 콘솔에 배열 출력
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
                    </ImageListItem>
                ))}
            </ImageList>
        </div>
    );
};

export default UserFolder;
