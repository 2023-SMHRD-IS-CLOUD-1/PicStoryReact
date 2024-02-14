import React from 'react'
import '../../css/PAMenu.css'

const PAMenu = () => {
  return (
    <div id='paMenuContainer'>
      <div id='paMenuOption'>
        <div id='photoSelectAll'>
          전체선택<input type="checkbox" />
        </div>
        <div id='photoControl'>
          <div className='photoControlBtn'>내려받기</div>
          <div className='photoControlBtn'>폴더에 추가</div>
          <div className='photoControlBtn'>삭제</div>
        </div>
      </div>
      <div id='tagChooseContainer'>
        <div id='tagChooseBtn'>태그 선택</div>
      </div>
      <div id='selectedTagContainer'>
        <div className='selectedTags'>
          #강아지
        </div>
        <div className='selectedTags'>
          #고양이
        </div>
        <div className='selectedTags'>
          #자동차
        </div>
      </div>
      <div id='searchContainer'>
        <input type="text" placeholder='사진 이름으로 검색해 보세요.' id='photoSearchText'/>
        <div id='photoSearchBtn'>검색</div>
      </div>
    </div>
  )
}

export default PAMenu