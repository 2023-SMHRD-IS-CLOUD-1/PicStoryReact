import React, { useState } from 'react'
import '../../css/PALeftSide.css'
import { CiMenuKebab } from "react-icons/ci";
import TotalphotoModal from '../TotalphotoModal';
const PALeftSide = () => {

  const [showIcon, setShowIcon]= useState('▶');
  const [show, setShow] = useState('none');

  let folderListBtn = () => {
    if(showIcon == '▶'){
      setShowIcon('▼');
      setShow('block');
    } else {
      setShowIcon('▶');
      setShow('none');
    }
  }
  
  return (
    <div id='paSideConatiner'>
      <div id='sideBtnContainer'>
        <span className='sideBtn'>전체사진</span>
        <div id='folderParentContainer'>
          <div id='folderParent' onClick={folderListBtn}>
            {showIcon} 폴더
          </div>
          <div id='folderParentOption'>
            <CiMenuKebab />
          </div>
        </div>
        <ul id='folderList'>
          <li className='folders' style={{display:show}}>
            <div className='folderContainer'>
              <div className='folderName'>개&고양이</div>
              <div className='folderOption'><CiMenuKebab /></div>
            </div>
          </li>
          <li className='folders' style={{display:show}}>
            <div className='folderContainer'>
              <div className='folderName'>여행사진</div>
              <div className='folderOption'><CiMenuKebab /></div>
            </div>
          </li>
          <li className='folders' style={{display:show}}>
            <div className='folderContainer'>
              <div className='folderName'>음식 사진</div>
              <div className='folderOption'><CiMenuKebab /></div>
            </div>
          </li>
          <li className='folders' style={{display:show}}>
            <div className='folderContainer'>
              <div className='folderName'>셀카</div>
              <div className='folderOption'><CiMenuKebab /></div>
            </div>
          </li>
        </ul>
        <span className='sideBtn'>업로드</span>
      </div>
    </div>
  )
}

export default PALeftSide