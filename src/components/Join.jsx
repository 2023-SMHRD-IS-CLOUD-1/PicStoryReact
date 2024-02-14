import React, { useState } from 'react';
import axios from 'axios';
import '../css/Join.css';

const Join = () => {

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [nick, setNick] = useState("");
  const [mail, setMail] = useState("");
  const [pwMessage, setPwMessage] = useState("");


  // 고정주소 달아주기
  const axiosInstance = axios.create({
    baseURL: "http://localhost:8090/picstory",
  })
  const handleJoinIn = () => {

    const userJoinData = {
      user_id: id,
      user_pw: pw,
      user_name: name,
      user_nick: nick,
      user_mail: mail
    };

    // 회원가입 데이터 보내는 통신
    if (pw == pwConfirm) {
      axiosInstance.post("/joinIn", userJoinData)
        .then(() => {

        })
        .catch(error => {
          console.error(error);
        });
    };
  }

  // id 중복확인 => true면 사용가능 false는 불가
  const IdDoubleCheck = () => {

    axiosInstance.get("/IdDoubleCheck", {
      params: {
        user_id: id
      }
    })
      .then((res) => {
        // 서버 응답에 대한 처리
        console.log(res.data);
      })
      .catch(error => {
        console.error(error);
      });

  }

  // nick네임 중복확인
  const nickdDoubleCheck = () => {

    axiosInstance.get("/nickDoubleCheck", {
      params: {
        user_nick: nick
      }
    })
      .then((res) => {
        console.log(res.data);
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
        console.log(res.data);
      })
      .catch(error => {
        console.error(error);
      });

  }

  // 비밀번호 확인 input태그에서 커서가 사라질때 실행되는 이벤트
  const handleBlur = () => {
    if (pw === pwConfirm) {
      setPwMessage("비밀번호가 일치합니다.")
    } else {

      setPwMessage("비밀번호가 일치하지않습니다.")

    }
  };




  return (
    <div id='joinMain'>
      <div id='joinBox'>
        <div style={{ fontSize: '100px', textAlign: 'center' }}>회원가입</div>
        <hr />

        <table>
          <tr>
            <td>이름</td>
            <td><input type="text" name='name' placeholder='이름' onChange={(e) => { setName(e.target.value) }} /></td>
            <td></td>
          </tr>
          <tr>
            <td>아이디</td>
            <td><input type="text" name='id' placeholder='아이디' onChange={(e) => { setId(e.target.value) }} /></td>
            <td><button onClick={IdDoubleCheck}>중복 확인</button></td>
          </tr>
          <tr>
            <td>비밀번호</td>
            <td><input type="password" name='pw' placeholder='비밀번호' onChange={(e) => { setPw(e.target.value) }} /></td>
            <td></td>
          </tr>
          <tr>
            <td>비밀번호 확인</td>
            <td><input type="password" name='password_confirm' placeholder='비밀번호 확인' onChange={(e) => { setPwConfirm(e.target.value) }} onBlur={handleBlur}
            /></td>
            <td>{pwMessage}</td>
          </tr>
          <tr>
            <td>닉네임</td>
            <td><input type="text" name='nick' placeholder='닉네임' onChange={(e) => { setNick(e.target.value) }} /></td>
            <td><button onClick={nickdDoubleCheck}>중복 확인</button></td>
          </tr>
          <tr>
            <td>이메일</td>
            <td><input type="text" name='mail' placeholder='이메일' onChange={(e) => { setMail(e.target.value) }} /></td>
            <td><button onClick={mailDoubleCheck}>중복 확인</button></td>
          </tr>
          <tr>
            <td>관심태태그</td>
            <td></td>
            <td></td>
          </tr>
        </table>
        <div>
          [태그 버튼들이 들어오는 자리]
        </div>

        <input type="button" value={'회원가입'} onClick={handleJoinIn} />
      </div>
    </div>
  );
};

export default Join;
