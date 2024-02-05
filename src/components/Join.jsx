import React from 'react'
import '../css/Join.css'
const Join = () => {


  return (
    <div id='joinMain'>
      <div id='joinBox'>
        <div style={{fontSize : '100px', textAlign:'center'}}>회원가입</div>
        <hr />
        <form action="#">
          <table>
            <tr>
              <td>이름</td>
              <td><input type="text" name='user_id' placeholder='이름'/></td>
              <td></td>
            </tr>
            <tr>
              <td>아이디</td>
              <td><input type="text" name='user_id' placeholder='아이디'/></td>
              <td><button>중복 확인</button></td>
            </tr>
            <tr>
              <td>비밀번호</td>
              <td><input type="password" name='user_id' placeholder='비밀번호'/></td>
              <td></td>
            </tr>
            <tr>
              <td>비밀번호 확인</td>
              <td><input type="password" name='user_id' placeholder='비밀번호 확인'/></td>
              <td></td>
            </tr>
            <tr>
              <td>닉네임</td>
              <td><input type="text" name='user_id' placeholder='닉네임'/></td>
              <td><button>중복 확인</button></td>
            </tr>
            <tr>
              <td>이메일</td>
              <td><input type="text" name='user_id' placeholder='이메일'/></td>
              <td><button>중복 확인</button></td>
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
          <input type="submit" value={'회원가입'} />
        </form>
      </div>
    </div>
  )
}

export default Join