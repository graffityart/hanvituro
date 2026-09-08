'use client';
import {useState} from 'react';

const STATUS_LABEL={received:'접수완료',reviewing:'검토중',checking:'확인중',completed:'처리완료',paid:'입금완료',rejected:'처리불가',cancelled:'취소'};

export default function LookupForm(){
  const [phone,setPhone]=useState('');
  const [password,setPassword]=useState('');
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState(null);
  const [error,setError]=useState('');

  async function submit(e){
    e.preventDefault();setError('');setResult(null);
    const phoneDigits=phone.replace(/\D/g,'');
    if(phoneDigits.length<10||phoneDigits.length>11)return setError('휴대전화번호를 확인해 주세요.');
    if(!password)return setError('조회 비밀번호를 입력해 주세요.');
    setLoading(true);
    try{
      const res=await fetch('/api/orders/lookup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:phoneDigits,password})});
      const data=await res.json();
      if(!res.ok)throw new Error(data.message||'조회 중 오류가 발생했습니다.');
      setResult(data.order);
    }catch(err){setError(err.message)}finally{setLoading(false)}
  }

  return <div className="lookupCard">
    <div className="lookupHead"><span>ORDER LOOKUP</span><h3>내 거래내역 조회</h3><p>접수 시 입력한 휴대전화번호와 조회 비밀번호를 입력하세요.</p></div>
    <form onSubmit={submit} className="lookupForm">
      <label>휴대전화<input value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,'').slice(0,11))} inputMode="numeric" placeholder="01012345678"/></label>
      <label>조회 비밀번호<input type="password" value={password} onChange={e=>setPassword(e.target.value.slice(0,10))} placeholder="접수 시 설정한 비밀번호"/></label>
      <button type="submit" disabled={loading}>{loading?'조회 중...':'거래내역 조회'}</button>
    </form>
    {error&&<p className="lookupError">{error}</p>}
    {result&&<div className="lookupResult">
      <div className="lookupResultTop"><div><small>처리상태</small><strong>{STATUS_LABEL[result.status]||result.status}</strong></div><div><small>접수번호</small><b>{result.orderNo}</b></div></div>
      <div className="lookupRows"><span><i>접수금액</i><b>{Number(result.requestedAmount||0).toLocaleString()}원</b></span><span><i>예상 입금액</i><b>{Number(result.expectedAmount||0).toLocaleString()}원</b></span><span><i>상품권</i><b>{result.productNames||'상품권'}</b></span><span><i>접수일시</i><b>{result.createdAt}</b></span></div>
    </div>}
  </div>;
}
