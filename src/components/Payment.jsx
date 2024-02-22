import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Payment.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import { BrowserRouter as Router, Route, Switch, Link,useNavigate } from 'react-router-dom';

const Payment = (effect, deps) => {
    const nav = useNavigate();
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [mail, setMail] = useState('');
    const [premium , setPremium] = useState('');

    useEffect(() => {
        // setId(sessionStorage.getItem("user_id"));
        // setName(sessionStorage.getItem("user_name"));
        // setMail(sessionStorage.getItem("user_mail"));
        // setPremium(sessionStorage.getItem("user_premium"));

        console.log('결제페이지',id,name,mail,'!!!');
        const jquery = document.createElement("script");
        jquery.src = "https://code.jquery.com/jquery-1.12.4.min.js";
        const iamport = document.createElement("script");
        iamport.src = "https://cdn.iamport.kr/js/iamport.payment-1.1.7.js";
        document.head.appendChild(jquery);
        document.head.appendChild(iamport);
        return () => {
            document.head.removeChild(jquery); document.head.removeChild(iamport);
        }
    }, []);

    const onClickPayment = () => {
        const { IMP } = window;
        IMP.init('imp47123372');
        // 결제 데이터 정의
        const data = {
            pg: 'html5_inicis', // PG사 (필수항목)
            pay_method: 'card', // 결제수단 (필수항목)
            merchant_uid: `mid_${new Date().getTime()}`, // 결제금액 (필수항목)
            name: '결제 테스트', // 주문명 (필수항목)
            amount: '100', // 금액 (필수항목)
            //custom_data: { userId: {id}, desc: '세부 부가정보' },
            custom_data: { userId: '부가정보', desc: '세부 부가정보' },
            //buyer_name: {name}, // 구매자 이름
            buyer_name: 'goldy', // 구매자 이름
            buyer_tel: '0101234556', // 구매자 전화번호 (필수항목)
            //buyer_email: {mail}, // 구매자 이메일
            buyer_email: 'mail', // 구매자 이메일
            buyer_addr: 'gwangju',
            buyer_postalcode: '1234'
        };
        IMP.request_pay(data, callback);
    }

    const callback = (response) => {
        const { success, error_msg, imp_uid, merchant_uid, pay_method, paid_amount, status } = response;
        if (success) {
            alert('결제 성공');
            nav('/myinfo');
        } else {
            alert(`결제 실패 : ${error_msg}`);
        }
    }

    return (
        <div className='payMain'>
            <div className='payBox'>
                <div className='top'>
                    <div>
                        <p className='text1'>기본 사용자는</p>
                        <p className='text2'>Starter</p>
                    </div>
                    <div>
                        <LocalOfferIcon style={{ fontSize: 80, color: 'blue' }} />
                    </div>

                </div>
                <h2>free</h2>
                <hr align="center" color='#CCCCCC' width="100%" />
                <div className='contents'>
                    <div className='content'>
                        <DoneRoundedIcon style={{ color: 'gray' }} />
                        <p>사진 1000장까지 업로드 가능</p></div>
                    <div className='content'>
                        <DoneRoundedIcon style={{ color: 'gray' }} />
                        <p>기본 태그 10개 제공</p></div>
                    <div className='content'>
                        <DoneRoundedIcon style={{ color: 'gray' }} />
                        <p>유사이미지 검색 기능</p></div>
                </div>
                <div className='btn'>
                    <Button className='payBtn' variant="outlined" >FREE</Button>
                </div>
            </div>

            <div className='payBox'>
                <div className='top'>
                    <div>
                        <p className='text1'>프리미엄 사용자는</p>
                        <p className='text2'>Premium</p>
                    </div>
                    <div>
                        <LoyaltyIcon style={{ fontSize: 80, color: 'hotpink' }} />
                    </div>
                </div>

                <h2>10,000원</h2>
                <hr align="center" color='#CCCCCC' width="100%" />
                <div className='contents'>
                    <div className='content'>
                        <DoneRoundedIcon style={{ color: 'gray' }} />
                        <p>Free 버전의 모든 기능들</p> </div>
                    <div className='content'>
                        <DoneRoundedIcon style={{ color: 'gray' }} />
                        <p>사진 무제한으로 업로드 가능</p> </div>
                    <div className='content'>
                        <DoneRoundedIcon style={{ color: 'gray' }} />
                        <p>커스텀 태그 제공</p> </div>
                </div>
                <div className='btn'>
                    <Button className='payBtn' color="secondary" onClick={onClickPayment} variant="outlined">Premium</Button>
                </div>
            </div>
        </div >
    );
}

export default Payment;