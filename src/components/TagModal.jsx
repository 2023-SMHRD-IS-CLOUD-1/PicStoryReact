import React, { useEffect, useRef, useState } from 'react'
import '../css/TagModal.css'

const TagModal = ({setModalOpen}) => {

  const tagList = ['동물', '사람', '자동차', '건물', '음식', '하늘', 'AA', 'BB', 'CC', 'DD','EE','gg'];
  const tags = tagList.map(item => <div className="allTag">{item}</div>);
  // const [aaaa, setAaaa] = useState();
  // setAaaa(tags);
  const modalRef = useRef(null);

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

  const closeModal = () => {
    setModalOpen(false);
  };

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