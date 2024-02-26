import React, { useEffect, useState } from 'react'
import { useNavigate,Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import axios from 'axios';
import '../css/MyInfo.css'
import DeleteUserModal from './DeleteUserModal';

const MyInfo = () => {

    const [userNum, setUserNum] = useState('');
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [pwConfirm, setPwConfirm] = useState("");
    const [name, setName] = useState('');
    const [nick, setNick] = useState('');
    const [mail, setMail] = useState('');
    const [premium , setPremium] = useState('');
    const [count, setCount] = useState('0');
    const [pwMessage, setPwMessage] = useState(false);
    const [nickMessage, setNickMessage] = useState();
    const [mailMessage, setMailMessage] = useState();
    const [tagList, setTagList] = useState([]);
    const [tag, setTag] = useState("");
    
    const [isEditMode, setIsEditMode] = useState(false);
    const [editPw, setEditPw] = useState('');

    const [nickChecked, setNickChecked] = useState(false);
    const [mailChecked, setMailChecked] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);

    const showModal = () => {
        setModalOpen(true);
    }

    const nav = useNavigate();

    const axiosInstance = axios.create({
        baseURL: "http://localhost:8099/picstory",
      })

    function createTag() {
        axiosInstance.post("/createTag", {
          user_num: sessionStorage.getItem("user_num"),
          user_tag_name: tag
      })
        .then(res => {
            prompt('태그가 생성되었습니다')
            window.location.reload();
        }).catch(error => {
          console.error("에러:", error.message);
        });
    }

    const handleInputChange = (event) => {
        // 입력된 값 가져오기
        const value = event.target.value;
        // 상태 변수 업데이트
        setTag(value);
        console.log(tag)
      };

    useEffect(() => {

        // 세션 값 꺼내서 쓰기
        const userNum = sessionStorage.getItem("user_num");
        console.log("마이페이지", userNum)
        if (!userNum) {
            nav('/login');
            return;
        }
        axiosInstance.post("/myinfo", {
            user_num: userNum,
        }).then(res => {
            console.log(res)
            if (res.data.myinfo) {
                setId(res.data.myinfo.user_id);
                setPw(res.data.myinfo.user_pw);
                setName(res.data.myinfo.user_name);
                setNick(res.data.myinfo.user_nick);
                setMail(res.data.myinfo.user_mail);
                setPremium(res.data.myinfo.user_premium);
                setCount(res.data.countPhoto);
                setTagList(res.data.tagList);
            }
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
                    setNickChecked(true);
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
                    setMailChecked(true);
                } else {
                    setMailMessage(false);
                }
            })
            .catch(error => {
                console.error(error);
            });

    }

    // 비밀번호 확인 input태그에서 커서가 사라질때 실행되는 이벤트
    // const handleBlur = () => {
    //     if (editPw === pwConfirm) {
    //         setPwMessage("비밀번호가 일치합니다.")
    //     } else {
    //         setPwMessage("비밀번호가 일치하지않습니다.")
    //     }
    // };


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
                  <div className='item-content'>{count}</div>
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
                      {name}
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
                              onChange={(e) => {
                                setPwConfirm(e.target.value);
                                if (editPw === e.target.value) {
                                    setPwMessage("비밀번호가 일치합니다.");
                                } else {
                                    setPwMessage("비밀번호가 일치하지 않습니다.");
                                }
                            }}
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
                              onChange={(e) => {
                                setNick(e.target.value);
                                setNickChecked(false); // 닉네임이 변경될 때마다 중복 확인 상태 초기화
                                }}
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
                              onChange={(e) => {
                                setMail(e.target.value);
                                setMailChecked(false); // 이메일이 변경될 때마다 중복 확인 상태 초기화
                                }}
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
                    <button onClick={handleSaveClick}
                            className='buttonBlue' 
                            disabled={!editPw || !pwConfirm || editPw !== pwConfirm || !nick || !nickChecked || !mail || !mailChecked}>
                        저장하기
                    </button>
                    
                ) : (
                    <button onClick={handleEditClick} className='buttonBlue'>수정하기</button>
                )}
                <button className='buttonWhite'onClick={showModal}>회원탈퇴</button>
                {modalOpen && <DeleteUserModal setModalOpen={setModalOpen} pw={pw}/>}
                {premium ? (
                    <button className='buttonWhite'><Link to="/Payment">프리미엄 구독</Link></button>
                ) : (
                    <button>구독취소</button>
                )}
                
          </div>

          <div className='info-box-l'>
            <div id='titleConatiner'>
                <h2>태그 목록</h2>
                <div id='addTagContainer'>
                    <input style={{ width: '150px', height:'30px',display: 'block' }} type="text" value={tag} onChange={handleInputChange} placeholder="커스텀 태그 입력" />
                    <button onClick={createTag}>태그생성</button>
                </div>
            </div>
            <div className='tag-box'>
                <div className='tag'>건물</div>
                <div className='tag'>의류</div>
                <div className='tag'>차량</div>
                <div className='tag'>스포츠</div>
                <div className='tag'>음식</div>
                <div className='tag'>식물</div>
                <div className='tag'>동물</div>
                <div className='tag'>사람</div>
                <div className='tag'>문서</div>
                <div className='tag'>가구</div>
                  {tagList.map(tag => (
                      <div className='tag'>{tag}</div>
                  ))}
            </div>
          </div>

      </div>
  )
}

export default MyInfo