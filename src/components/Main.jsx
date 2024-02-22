import React from 'react'
import '../css/Main.css'
import { Link, useNavigate  } from 'react-router-dom'
const Main = () => {

  const userNum = sessionStorage.getItem("user_num");
  const nav = useNavigate();

  const goPhotoAlbum = (event) => {
    // 세션에 값이 없는 경우에 로그인 페이지로 이동
    if (!userNum) {
      event.preventDefault();
      nav('/login');
    }
  };


  
  return (
    <div id='mainContainer'>
      <div id='mainContent1'>
        <div id='mainTextContainer'>
          <strong id='mainText'>
            PicStory와 함께
            <br />
            소중한 사진을 한 곳에서
          </strong>
          <p id='mainSubText'>
            자동 태깅을 활용해 사진을 정리하세요.
            <br />
            태그기반 이미지 서치가 가능합니다.
            <br />
            태그를 기반으로 나만의 폴더를 만들 수 있습니다.
          </p>
          <Link id='goPhotoAlbumBtn' onClick={goPhotoAlbum}><span>PicStory▶</span></Link>
        </div>
        <div id='mainImgContainer'>
          <img src="/images/mainimg.png" alt="홈메인이미지" id='mainImg'/>
        </div>
      </div>
      <div id='mainImg2Container'>
        <h1>손쉬운 분류</h1>
        <img src="/images/mainpg-removebg.png" alt="홈메인이미지" id='mainImg2' />

        <p>사진을 자동으로 인식해 분류해줘요.
          <br />
          원하는 태그를 직접 선택해 분류할 수 있어요.
        </p>

      </div>

      <div id='mainImg3Container'>
        <h1 className='title3'>간편한 검색</h1>
        <ul className='mainList'>
          <li className='mainListItem item1'>
            <img src='/images/item01.png'/>
            <h3>텍스트</h3>
            <p>
              키워드를 검색하세요!
              <br/>
              검색어로 사진 검색이 가능합니다
            </p>
          </li>
          <li className='mainListItem item2'>
            <img src='/images/item02.png'/>
            <h3>이미지</h3>
            <p>
              이미지로 검색이 가능합니다!
              <br/>
              유사한 이미지를 쉽게 찾아보세요
            </p>
          </li>
        </ul>

      </div>

    </div>
  )
}

export default Main