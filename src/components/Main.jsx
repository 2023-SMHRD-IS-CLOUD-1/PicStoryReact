import React from 'react'
import '../css/Main.css'
import { Link } from 'react-router-dom'
const Main = () => {
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
          <Link to='/photoAlbum' id='goPhotoAlbumBtn'><span>PicStory▶</span></Link>
        </div>
        <div id='mainImgContainer'>
          <img src="/images/mainimg.png" alt="홈메인이미지" id='mainImg'/>
        </div>
      </div>
    </div>
  )
}

export default Main