import React from 'react'
import '../css/MyInfo.css'

const MyInfo = () => {
  return (
      <div className='myinfo-bg'>
          <div className='info-top'>
              <h2>마이페이지</h2>
          </div>
          <div className='blueContainer'>
              <div className='profile-img'>
                  <img src='/logo192.png' />
              </div>
              <p className='p-name'>이름</p>
              <p className='p-id'>아이디</p>
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
                  <div className='info-list-content'>뇽뇽이</div>
              </div>
              <div className='l-item'>
                  <div className='info-list'>아이디</div>
                  <div className='info-list-content'>sefsd</div>
              </div>
              <div className='l-item'>
                  <div className='info-list'>닉네임</div>
                  <div className='info-list-content'>1234</div>
              </div>
              <div className='l-item'>
                  <div className='info-list'>이메일</div>
                  <div className='info-list-content'>sefsd@dkfd.dfd</div>
              </div>
              <button>수정하기</button>
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