import React from 'react'
import '../../css/PAMenu.css'

const PAMenu = () => {
  return (
    <div id='paMenuContainer'>
      <div>
        <input type="text" placeholder='태그 검색'/>
        <select name="searchCon" id="searchCon">
          <option value="new">최신 순</option>
          <option value="old">오래된 순</option>
        </select>
        <button>검색</button>
      </div>
    </div>
  )
}

export default PAMenu