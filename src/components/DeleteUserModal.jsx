import React, { useEffect, useRef, useState} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/DeleteUserModal.css';

const DeleteUserModal = ({setModalOpen, pw}) => {

    const modalRef = useRef(null);
    const [inputPw, setInputPw] = useState('');
    const [pwMessage, setPwMessage] = useState(false);

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
        if (inputPw === pw) {
            console.log('탈퇴하기 버튼 클릭');
            // 비밀번호가 맞을 때만 탈퇴 처리
            const userId = sessionStorage.getItem("user_id");
            axiosInstance.post("/deleteUser", {
                user_id: userId,
            }).then(res => {
                console.log("탈퇴 완료")
                // 세션 값 삭제
                sessionStorage.removeItem("user_id");
                sessionStorage.removeItem("user_num");
                // 메인화면으로 이동
                nav('/');

                
            }).catch(error => {
                console.error("에러:", error.message);
            });
        }
      };

  return (
    <>
    <div className='modalBackdrop' onClick={closeModal}></div>
    <div className='d-modalContainer' ref={modalRef}>
      <button className='close' onClick={closeModal}>
          X
      </button>
      <div>
      <h3>탈퇴를 원하시면 비밀번호를 입력하세요.</h3>

      <form onSubmit={deleteUser}>
        <input
          type='password'
          className='inputPW'
          value={inputPw}
          onChange={(e) => {
            setInputPw(e.target.value);
            if (pw === e.target.value) {
                setPwMessage("비밀번호가 일치합니다.");
            } else {
                setPwMessage("비밀번호가 일치하지 않습니다.");
            }
        }}
          autoComplete='new-password'
        />
        <span className={pwMessage === "비밀번호가 일치합니다." ? "pwMessage success" : "pwMessage error"}>
            {pwMessage}
        </span>
        <br/>
        <button type="submit" disabled={inputPw !== pw} className='delBtn'> 탈퇴하기</button>
      </form>
      </div>
    </div>
    </>
  )
}

export default DeleteUserModal