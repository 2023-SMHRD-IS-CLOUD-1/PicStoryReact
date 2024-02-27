import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/DeleteUserModal.css';

const DeleteUserModal = ({ setModalOpen, pw }) => {

  const modalRef = useRef(null);
  const [inputPw, setInputPw] = useState('');

  const nav = useNavigate();

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8099/picstory",
  })

  //넘어온 pw값 확인용
  useEffect(() => {
    console.log("Received pw value:", pw);
  }, []);
  //
  useEffect(() => {
    const handler = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
    };
  });

  const closeModal = () => {
    setModalOpen(false);
  };


  const deleteUser = () => {

    const userNum = sessionStorage.getItem("user_num");
    axiosInstance.post("/deleteUser", {
      user_num: userNum,
      user_pw: inputPw
    }).then(res => {

      console.log(res.data);
      if (res.data == '') {
        alert("비밀번호가 일치하지않습니다")
      } else {

        console.log("탈퇴 완료")
        // 세션 값 삭제
        sessionStorage.removeItem("user_id");
        sessionStorage.removeItem("user_num");
        // 메인화면으로 이동
        nav('/');

      }


    }).catch(error => {
      console.error("에러:", error.message);
    });
  }


  return (
    <>
      <div className='modalBackdrop' onClick={closeModal}></div>
      <div className='d-modalContainer' ref={modalRef}>
        <button className='close' onClick={closeModal}>
          X
        </button>
        <div>
          <h3>탈퇴를 원하시면 비밀번호를 입력하세요.</h3>

          <div className='deleteUser'>
            <input
              type='password'
              className='inputPW'
              value={inputPw}
              onChange={(e) => {
                setInputPw(e.target.value);

              }}
              autoComplete='new-password'
            />
            <br />
            <button onClick={deleteUser} className='delBtn'> 탈퇴하기</button>
            </div>
        </div>
      </div>
    </>
  )
}

export default DeleteUserModal