import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Payment.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

const Payment = (effect, deps) => {
    useEffect(() => {
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
            custom_data: { name: '부가정보', desc: '세부 부가정보' },
            buyer_name: 'goldy', // 구매자 이름
            buyer_tel: '0101234556', // 구매자 전화번호 (필수항목)
            buyer_email: 'goldy', // 구매자 이메일
            buyer_addr: 'gwangju',
            buyer_postalcode: '1234'
        };
        IMP.request_pay(data, callback);
    }

    const callback = (response) => {
        const { success, error_msg, imp_uid, merchant_uid, pay_method, paid_amount, status } = response;
        if (success) {
            alert('결제 성공');
        } else {
            alert(`결제 실패 : ${error_msg}`);
        }
    }

    return (
        <div className='payMain'>
            <div className='payBox'>
                <button id='l-loginBtn' className='payBtn' onClick={onClickPayment} style={{ cursor: 'pointer' }}>결제하기</button>


            </div>
        </div>
    );
}

export default Payment;