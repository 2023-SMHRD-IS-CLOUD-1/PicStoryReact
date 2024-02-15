import React, { useEffect, useState } from 'react'
import axios from 'axios';
import '../css/MyInfo.css'

const MyInfo = () => {

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [nick, setNick] = useState('');
    const [mail, setMail] = useState('');

    const axiosInstance = axios.create({
        baseURL: "http://localhost:8099/picstory",
      })

    useEffect(() => {
        setId(sessionStorage.getItem("user_id"));
        console.log("마이페이지", id)
        if (id) {
            axiosInstance.post("/myinfo", {
                user_id: id,
            }).then(res => {
                console.log(res)
                setName(res.data.user_name);
                setNick(res.data.user_nick);
                setMail(res.data.user_mail);
            }).catch(error => {
                console.error("에러:", error.message);
            });
        }
    });


  return (
      <div className='myinfo-bg'>
          <div className='info-top'>
              <h2>마이페이지</h2>
          </div>
          <div className='blueContainer'>
              <div className='profile-img'>
                  <img src='/logo192.png' />
              </div>
              <p className='p-name'>{name}</p>
              <p className='p-id'>{id}</p>
          </div>
          <div className='info-box-s'>
              <div className='s-item'>
                  <div className='item-content'>프리미엄</div>
                  <div className='item-title'>이용</div>
              </div>
              <div className='s-item'>
                  <div className='item-content'>5135</div>
                  <div className='item-title'>사진수</div>
              </div>
          </div>

          <div className='info-box-l'>
              <h2>회원 정보</h2>
              <div className='l-item'>
                  <div className='info-list'>이름</div>
                  <div className='info-list-content'>{name}</div>
              </div>
              <div className='l-item'>
                  <div className='info-list'>아이디</div>
                  <div className='info-list-content'>{id}</div>
              </div>
              <div className='l-item'>
                  <div className='info-list'>닉네임</div>
                  <div className='info-list-content'>{nick}</div>
              </div>
              <div className='l-item'>
                  <div className='info-list'>이메일</div>
                  <div className='info-list-content'>{mail}</div>
              </div>
              <button>정보 수정</button>
          </div>

          <div className='info-box-l'>
            <h2>태그들</h2>
            <div className='tag-box'>
                <div className='tag'>동물</div>
                <div className='tag'>음식</div>
                <div className='tag'>풍경</div>
                <div className='tag'>사람</div>
                <div className='tag'>사람</div>
                <div className='tag'>사람</div>
                <div className='tag'>사람</div>
            </div>
          </div>

      </div>
  )
}

export default MyInfo