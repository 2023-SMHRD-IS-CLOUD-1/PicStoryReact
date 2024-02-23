import React, { useContext, useState } from 'react'
import '../../css/PAMenu.css'
import { HiXMark } from "react-icons/hi2";
import TagModal from '../TagModal';

const PAMenu = () => {

  const [modalOpen, setModalOpen] = useState(false);
  // const {handleImgDownload} = useContext(PAMenuTodoContext);

  const [imageUrls, setImageUrls] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  const showModal = ()=>{
    setModalOpen(true);
  }

  const downloadSelectedImages = () => {
    for (const fileName of selectedImages) {
      const selectedImage = imageUrls.find((image) => image.fileName === fileName);

      if (selectedImage) {
        const link = document.createElement('a');
        link.href = selectedImage.url;
        link.download = fileName;
        link.click();
      }
    }
  };

  return (
    <div id='paMenuContainer'>
      <div id='paMenuOption'>
        <div id='photoSelectAll'>
          전체선택<input type="checkbox" />
          <input type="file" />
        </div>
        <div id='photoControl'>
          <div className='photoControlBtn'>내려받기</div>
          <div className='photoControlBtn'>폴더에 추가</div>
          <div className='photoControlBtn'>삭제</div>
        </div>
      </div>
      <div id='tagChooseContainer'>
        <div id='tagChooseBtn' onClick={showModal}>태그 선택</div>
        {modalOpen && <TagModal setModalOpen={setModalOpen}/>}
      </div> 
      <div id='selectedTagContainer'>
        <div className='tagContainer'>
          <div className='selectedTags'>
            #강아지
          </div>
          <div className='tagDelete'>
            <HiXMark />
          </div>
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