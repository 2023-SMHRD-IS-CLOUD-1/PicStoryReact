import React, { useEffect } from 'react';
import { Paper, MobileStepper, Button } from '@mui/material';
import '../css/ImgSlider.css';

const images = [
  '/images/imageslider1.jpg',
  'https://t1.daumcdn.net/cfile/tistory/99F8A43D5A82811613',
  'https://img3.daumcdn.net/thumb/R658x0.q70/?fname=https://t1.daumcdn.net/news/202106/13/hani21/20210613111821227vtsy.jpg',
  // Add more image URLs as needed
];

const ImageSlider = () => {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevStep) => (prevStep + 1) % images.length);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => (prevStep - 1 + images.length) % images.length);
  };

  // 자동으로 슬라이드 전환
  useEffect(() => {
    const intervalId = setInterval(() => {
      handleNext();
    }, 3000); // 3초마다 전환

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <div className='imgSliderContainer'>
        <span>
          <Paper style={{ overflow: 'hidden' }}>
            <img src={images[activeStep]} alt={`Slide ${activeStep + 1}`} style={{ width: '100%' }} className='imgSlider' />
          </Paper>
        </span>

        <span>
          <MobileStepper
            steps={images.length}
            position="static"
            activeStep={activeStep}
            nextButton={
              <Button size="small" onClick={handleNext} disabled={activeStep === images.length - 1}>
                Next
              </Button>
            }
            backButton={
              <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                Back
              </Button>
            }
          />
        </span>
      </div>
    </div>
  );
};

export default ImageSlider;
