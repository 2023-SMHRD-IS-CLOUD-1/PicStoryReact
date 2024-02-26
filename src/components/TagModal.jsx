import React, { useContext, useEffect, useRef, useState } from 'react'
import '../css/TagModal.css'
import axios from 'axios';
import { UserContext } from '../contexts/User';

const TagModal = ({ setModalOpen }) => {

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8099/picstory",
  });

  const loginedUserNum = sessionStorage.getItem('user_num');
  const [tagList, setTagList] = useState([]);
  const [tags, setTags] = useState([]);
  const modalRef = useRef(null);
  const [userPremiumInfo, setUserPremiumInfo] = useState();
  const { selectedTagList, setSelectedTagList } = useContext(UserContext);
  const { tempList, setTempList } = useContext(UserContext);
  const { showSelectedTagList, setShowSelectedTagList } = useContext(UserContext);
  const [selectTagName, setSelectTagName] = useState();

  const userInfo = {
    user_num: loginedUserNum
  }


  // 유저 프리미엄 가입 여부 정보 가져오기
  useEffect(() => {
    axiosInstance.post('/selectUserPremium', userInfo)
      .then((res) => {
        setUserPremiumInfo(res.data.user_premium);
      })
      .catch(error => {
        console.log(error);
      })
  }, [])

  // 가입여부 가져왔으면 등급에 맞게 태그리스트 바꿔주기
  useEffect(() => {
    if (userPremiumInfo === '10') {
      setTagList(['건물', '의류', '차량', '스포츠', '음식', '식물', '동물', '사람', '가구', '문서'])
    } else {
      setTagList(['건물', '의류', '차량', '스포츠', '음식', '식물', '동물', '사람', '가구', '자연 및 풍경', '개', '고양이', '바다', '하늘', '야경', '디저트', '음료', '예술', ' 뷰티&미용', '도서'])
    }
  }, [userPremiumInfo])

  // 태그리스트 바꼈으면 div 태그 만들어주기
  useEffect(() => {
    setTags(tagList.map((item, index) => <div className="allTag" onClick={chooseTag} key={index}>{item}</div>))
  }, [tagList])

  // 모달창 닫기 함수
  const closeModal = () => {
    setModalOpen(false);
  };

  // 태그 선택시 선택한 태그 selectTagName에 담기
  const chooseTag = (e) => {
    setSelectTagName(e.target.textContent);
  }
  
  // tempList에 클릭한 태그가 없을 때만 추가
  useEffect(()=>{
    if (tempList.includes(selectTagName) == false) { 
      setTempList(prevList => [...prevList, selectTagName])
      tempList.filter(item => Array.isArray(item) ? item.length !== 0 : true);
    }
  },[selectTagName])

  // 
  useEffect(()=>{
    setSelectedTagList(tempList);
  },[tempList])


  // tempList를 사용할 SelectedTagList 만들기
  // useEffect(()=>{
  //   const uniqueArray = Array.from(new Set(tempList));
  //   setSelectedTagList(uniqueArray);
  // }, [tempList])


  // 모달창 제거 실행
  useEffect(() => {
    // 이벤트 핸들러 함수
    const handler = (event) => {
      // mousedown 이벤트가 발생한 영역이 모달창이 아닐 때, 모달창 제거 처리
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModalOpen(false);
      }
    };

    // 이벤트 핸들러 등록
    document.addEventListener('mousedown', handler);

    return () => {
      // 이벤트 핸들러 해제
      document.removeEventListener('mousedown', handler);
    };
  });



  return (
    <div className='container' ref={modalRef}>
      <button className='close' onClick={closeModal}>
        X
      </button>
      <h1 id='modalTitle'>태그 선택</h1>
      <div id='tagContainer'>
        {tags}
      </div>
    </div>
  )
}

export default TagModal