'use client';
import {useMemo,useState} from 'react';

export default function ExchangeForm({products,banks,settings}){
  const [productId,setProductId]=useState(String(products[0]?.id||''));
  const [pin,setPin]=useState('');
  const [faceValue,setFaceValue]=useState('');
  const [items,setItems]=useState([]);
  const [bankId,setBankId]=useState('');
  const [accountNumber,setAccountNumber]=useState('');
  const [customerName,setCustomerName]=useState('');
  const [phone,setPhone]=useState('');
  const [password,setPassword]=useState('');
  const [submitting,setSubmitting]=useState(false);
  const product=products.find(p=>String(p.id)===productId);
  const fee=Number(settings?.transferFee||500);
  const total=useMemo(()=>items.reduce((s,x)=>s+x.faceValue,0),[items]);
  const expected=useMemo(()=>Math.max(0,items.reduce((s,x)=>s+Math.floor(x.faceValue*x.rate/100),0)-(items.length?fee:0)),[items,fee]);

  function addItem(){
    const value=Number(faceValue);
    const cleanPin=String(pin).replace(/[\s-]/g,'').trim();
    if(!product)return alert('상품권을 선택해 주세요.');
    if(cleanPin.length<8)return alert('상품권 PIN 번호를 확인해 주세요.');
    if(!Number.isInteger(value)||value<=0)return alert('상품권 금액을 입력해 주세요.');
    if(items.some(x=>x.pin===cleanPin))return alert('이미 추가된 PIN 번호입니다.');
    setItems(v=>[...v,{productId:Number(product.id),name:product.name,pin:cleanPin,faceValue:value,rate:Number(product.default_rate)}]);
    setPin('');setFaceValue('');
  }

  async function submit(){
    if(!items.length)return alert('상품권을 먼저 추가해 주세요.');
    if(total<Number(settings?.minimumOrderAmount||10000))return alert(`최소 접수금액은 ${Number(settings?.minimumOrderAmount||10000).toLocaleString()}원입니다.`);
    if(!bankId||!accountNumber||!customerName||!phone||!password)return alert('입금정보와 조회정보를 모두 입력해 주세요.');
    setSubmitting(true);
    try{
      const res=await fetch('/api/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({customerName,phone,bankId:Number(bankId),accountNumber,password,items})});
      const data=await res.json();
      if(!res.ok)throw new Error(data.message||'접수 중 오류가 발생했습니다.');
      alert(`한빛 상품권 접수가 완료되었습니다.\n접수번호: ${data.orderNo}`);
      setItems([]);setBankId('');setAccountNumber('');setCustomerName('');setPhone('');setPassword('');
    }catch(e){alert(e.message)}finally{setSubmitting(false)}
  }

  return <div className="exchangeForm">
    <div className="formTitle"><span>HANBIT QUICK EXCHANGE</span><h3>상품권 교환 신청</h3><p>상품권 정보와 입금 계좌만 입력하면 간편하게 접수됩니다.</p></div>
    <div className="formGrid">
      <label>상품권 종류<select value={productId} onChange={e=>setProductId(e.target.value)}>{products.map(p=><option key={p.id} value={p.id}>{p.name} · {Number(p.default_rate).toFixed(0)}% 매입</option>)}</select></label>
      <label>상품권 PIN<input value={pin} onChange={e=>setPin(e.target.value.toUpperCase())} placeholder="PIN 번호 입력" autoComplete="off"/></label>
      <label>상품권 금액<input value={faceValue} onChange={e=>setFaceValue(e.target.value.replace(/\D/g,''))} inputMode="numeric" placeholder="예: 50000"/></label>
      <button className="addGiftBtn" type="button" onClick={addItem}>+ 상품권 추가</button>
    </div>
    {items.length>0&&<div className="addedItems">{items.map((x,i)=><div key={`${x.pin}-${i}`}><span><b>{x.name}</b><small>PIN 끝 {x.pin.slice(-4)}</small></span><strong>{x.faceValue.toLocaleString()}원</strong><button type="button" onClick={()=>setItems(v=>v.filter((_,n)=>n!==i))}>×</button></div>)}</div>}
    <div className="settlementBox"><span>접수금액 <b>{total.toLocaleString()}원</b></span><span>예상 입금액 <strong>{expected.toLocaleString()}원</strong></span><small>이체수수료 {fee.toLocaleString()}원은 접수 건당 1회 반영됩니다.</small></div>
    <div className="accountGrid">
      <label>입금 은행<select value={bankId} onChange={e=>setBankId(e.target.value)}><option value="">은행 선택</option>{banks.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select></label>
      <label>계좌번호<input value={accountNumber} onChange={e=>setAccountNumber(e.target.value.replace(/\D/g,''))} placeholder="숫자만 입력" inputMode="numeric"/></label>
      <label>예금주<input value={customerName} onChange={e=>setCustomerName(e.target.value)} placeholder="예금주명"/></label>
      <label>휴대전화<input value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,''))} placeholder="01012345678" inputMode="numeric"/></label>
      <label className="wideField">조회 비밀번호<input value={password} onChange={e=>setPassword(e.target.value.slice(0,10))} type="password" placeholder="거래조회용 비밀번호 (최대 10자리)"/></label>
    </div>
    {!banks.length&&<p className="setupNotice">현재 개발 DB 연결 전입니다. 은행·접수 기능은 Neon 연결 후 활성화됩니다.</p>}
    <button className="submitExchange" type="button" onClick={submit} disabled={submitting||!banks.length}>{submitting?'접수 중...':'한빛 상품권 교환 신청'}</button>
  </div>
}
