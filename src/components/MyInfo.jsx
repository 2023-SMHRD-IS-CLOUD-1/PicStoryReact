import React, { useEffect, useState } from 'react'
import { useNavigate,Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import axios from 'axios';
import '../css/MyInfo.css'

const MyInfo = () => {

    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [pwConfirm, setPwConfirm] = useState("");
    const [name, setName] = useState('');
    const [nick, setNick] = useState('');
    const [mail, setMail] = useState('');
    const [premium , setPremium] = useState('');
    const [pwMessage, setPwMessage] = useState(false);
    const [nickMessage, setNickMessage] = useState();
    const [mailMessage, setMailMessage] = useState();
    
    const [isEditMode, setIsEditMode] = useState(false);
    const [editPw, setEditPw] = useState('');

    const nav = useNavigate();

    const axiosInstance = axios.create({
        baseURL: "http://localhost:8099/picstory",
      })

    useEffect(() => {

        // 세션 값 꺼내서 쓰기
        const userNum = sessionStorage.getItem("user_num");
        console.log("마이페이지", userNum)
        if (!userNum) {
            nav('/login');
            return;
        }
        setId(userNum);
        axiosInstance.post("/myinfo", {
            user_num: userNum,
        }).then(res => {
            console.log(res)
            setPw(res.data.user_pw);
            setName(res.data.user_name);
            setNick(res.data.user_nick);
            setMail(res.data.user_mail);
            setPremium(res.data.user_premium);
        }).catch(error => {
            console.error("에러:", error.message);
        });
    }, [id]);

    const handleEditClick = () => {
        setIsEditMode(true); // 수정 모드로 전환
    };

    const handleSaveClick = () => {
        setIsEditMode(false); // 수정 모드 종료
        
        const updateData = {
            user_id: id,
            user_pw: pw,
            user_name: name,
            user_nick: nick,
            user_mail: mail
        };

        console.log("보내는 값" ,updateData);

        // 비밀번호 변경 확인
        const isPasswordChanged = editPw !== '';

        //입력된 값 보내기
        if (isPasswordChanged) {
            if (editPw === pwConfirm) {
                updateData.user_pw = editPw;
                axiosInstance.post("/infoUpdate", updateData)
                    .then((res) => {
                        console.log("정보수정");
                        setPwMessage(false);
                        setNickMessage();
                        setMailMessage();
                    })
                    .catch(error => {
                        console.error(error);
                    });
            } else {
                setPwMessage("일치하지 않습니다.")
            }
        } else {
            axiosInstance.post("/infoUpdate", updateData)
                .then((res) => {
                    console.log("정보수정");
                    setPwMessage(false);
                    setNickMessage();
                    setMailMessage();
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    // 닉네임 중복확인
    const nickdDoubleCheck = () => {

        axiosInstance.get("/nickDoubleCheck", {
            params: {
                user_nick: nick
            }
        })
            .then((res) => {
                //console.log(res.data);
                if (res.data) {
                    setNickMessage(true);
                } else {
                    setNickMessage(false);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    // 메일 중복확인
    const mailDoubleCheck = () => {

        axiosInstance.get("/mailDoubleCheck", {
            params: {
                user_mail: mail
            }
        })
            .then((res) => {
                //console.log(res.data);
                if (res.data) {
                    setMailMessage(true);
                } else {
                    setMailMessage(false);
                }
            })
            .catch(error => {
                console.error(error);
            });

    }

    // 비밀번호 확인 input태그에서 커서가 사라질때 실행되는 이벤트
    const handleBlur = () => {
        if (editPw === pwConfirm) {
            setPwMessage("비밀번호가 일치합니다.")
        } else {
            setPwMessage("비밀번호가 일치하지않습니다.")
        }
    };


  return (
      <div className='myinfo-bg'>
          <div className='info-top'>
              <h2>마이페이지</h2>
          </div>
          
          <div className='info-box-s'>
              <div className='s-item'>
                  <div className='item-content'>
                    {premium === "10" ? "일반" : "프리미엄"}
                  </div>
                  <div className='item-title'>이용</div>
              </div>
              <div className='s-item'>
                  <div className='item-content'>5135</div>
                  <div className='item-title'>사진수</div>
              </div>
          </div>

          <div className='info-box-l'>
              <h2>회원 정보</h2>
              <Box
                  component="form" className='input-layer'
                  sx={{
                      '& > :not(style)': { m: 1.7, width: '80ch', height: '6ch' },
                  }}
                  noValidate
                  autoComplete="off"
              >
              <div className='l-item'>
                  <div className='info-list'>이름</div>
                  <div className='info-list-content'>
                      {isEditMode ? (
                          <TextField
                          type="text"
                          className="outlined-basic"
                          label="이름 입력"
                          variant="outlined"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      ) : (
                          name
                      )}
                  </div>
              </div>
              <div className='l-item'>
                  <div className='info-list'>아이디</div>
                  <div className='info-list-content'>{id}</div>
              </div>
              {isEditMode && (
                  <div className='l-item'>
                      <div className='info-list'>비밀번호</div>
                      <div className='info-list-content'>
                          <TextField
                              type="password"
                              className="outlined-basic"
                              label="비밀번호 입력"
                              variant="outlined"
                              value={editPw}
                              onChange={(e) => setEditPw(e.target.value)}
                          />
                        </div>
                  </div>
              )}
              {isEditMode && (
                  <div className='l-item'>
                      <div className='info-list'>비밀번호 확인</div>
                      <div className='info-list-content'>
                          <TextField
                              type="password"
                              className="outlined-basic"
                              helperText={pwMessage}
                              label="비밀번호 재입력"
                              variant="outlined"
                              value={pwConfirm}
                              onChange={(e) => setPwConfirm(e.target.value)}
                              onBlur={handleBlur}
                              FormHelperTextProps={{
                                  style: { fontSize: '0.8rem', margin: '2px 2px 5px 2px', color:'red' }
                              }}
                          />
                        </div>
                  </div>
              )}
              
              
              
              <div className='l-item'>
                  <div className='info-list'>닉네임</div>
                  <div className='info-list-content'>
                      {isEditMode ? (
                          <TextField
                              type="text"
                              className="outlined-basic"
                              helperText={nickMessage ? '사용가능합니다' : '사용불가능합니다'}
                              label="닉네임"
                              variant="outlined"
                              value={nick}
                              onChange={(e) => setNick(e.target.value)}
                              InputProps={{
                                  endAdornment: (
                                      <InputAdornment position="end">
                                          <Button onClick={nickdDoubleCheck} variant="contained" color="primary">
                                              중복확인
                                          </Button>
                                      </InputAdornment>
                                  )
                              }}
                              FormHelperTextProps={{
                                  style: { fontSize: '0.8rem', margin: '2px 2px 5px 2px' }
                              }}
                          />
                      ) : (
                          nick
                      )}
                  </div>
              </div>
              <div className='l-item'>
                  <div className='info-list'>이메일</div>
                  <div className='info-list-content'>
                      {isEditMode ? (
                          <TextField
                              type="email"
                              className="outlined-basic"
                              helperText={mailMessage ? '사용가능합니다' : '사용불가능합니다'}
                              label="이메일"
                              variant="outlined"
                              value={mail}
                              onChange={(e) => setMail(e.target.value)}
                              InputProps={{
                                  endAdornment: (
                                      <InputAdornment position="end">
                                          <Button onClick={mailDoubleCheck} variant="contained" color="primary">
                                              중복확인
                                          </Button>
                                      </InputAdornment>
                                  )
                              }}
                              FormHelperTextProps={{
                                  style: { fontSize: '0.8rem', margin: '2px' }
                              }}
                          />
                      ) : (
                          mail
                      )}
                  </div>
              </div>
              </Box>
              {isEditMode ? (
                    <button onClick={handleSaveClick} disabled={editPw !== pwConfirm}>저장하기</button>
                    
                ) : (
                    <button onClick={handleEditClick}>수정하기</button>
                )}
                {premium ? (
                    <Link to="/Payment">프리미엄 구독</Link>
                ) : (
                    <button>구독취소</button>
                )}
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