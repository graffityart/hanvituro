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

  function addItem(){const value=Number(faceValue);const cleanPin=String(pin).replace(/[\s-]/g,'').trim();if(!product)return alert('상품권을 선택해 주세요.');if(cleanPin.length<8)return alert('상품권 PIN 번호를 확인해 주세요.');if(!Number.isInteger(value)||value<=0)return alert('상품권 금액을 입력해 주세요.');if(items.some(x=>x.pin===cleanPin))return alert('이미 추가된 PIN 번호입니다.');setItems(v=>[...v,{productId:Number(product.id),name:product.name,pin:cleanPin,faceValue:value,rate:Number(product.default_rate)}]);setPin('');setFaceValue('')}
  async function submit(){if(!items.length)return alert('상품권을 먼저 추가해 주세요.');if(total<Number(settings?.minimumOrderAmount||10000))return alert(`최소 접수금액은 ${Number(settings?.minimumOrderAmount||10000).toLocaleString()}원입니다.`);if(!bankId||!accountNumber||!customerName||!phone||!password)return alert('입금정보와 조회정보를 모두 입력해 주세요.');setSubmitting(true);try{const res=await fetch('/api/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({customerName,phone,bankId:Number(bankId),accountNumber,password,items})});const data=await res.json();if(!res.ok)throw new Error(data.message||'접수 중 오류가 발생했습니다.');alert(`한빛 상품권 접수가 완료되었습니다.\n접수번호: ${data.orderNo}`);setItems([]);setBankId('');setAccountNumber('');setCustomerName('');setPhone('');setPassword('')}catch(e){alert(e.message)}finally{setSubmitting(false)}}

  return <div className="applyCard">
    <h3>상품권 현금교환</h3>
    <div className="productSelectHead"><div className="productSelectIcon">▱</div><div><strong>상품권 <em>선택</em></strong><span>현금교환할 상품권을 선택해주세요.</span></div></div>
    <div className="productStrip">{products.map(p=><button type="button" key={p.id} aria-pressed={String(p.id)===productId} onClick={()=>setProductId(String(p.id))}>{p.imageUrl?<img className="productLogo" src={p.imageUrl} alt={p.name}/>:<span className="productDummy">{p.name.slice(0,1)}</span>}<span>{p.name}</span>{String(p.id)===productId&&<b className="selectedRateBadge">{Number(p.default_rate).toFixed(0)}%</b>}</button>)}</div>
    {product&&<div className="productHelp"><div className="productHelpIcon">%</div><div><strong>{product.name}</strong><span>현재 매입률 <b>{Number(product.default_rate).toFixed(0)}%</b></span></div></div>}
    <label>핀번호</label>
    <div className="pinAmountRow"><input value={pin} onChange={e=>setPin(e.target.value.toUpperCase())} placeholder="상품권 PIN 번호 입력" autoComplete="off"/><button type="button" onClick={addItem}>상품권 추가</button></div>
    <div className="quickAmounts"><span>빠른 금액</span>{[10000,30000,50000,100000].map(v=><button type="button" key={v} onClick={()=>setFaceValue(String(v))}>{v.toLocaleString()}</button>)}</div>
    <input className="amountInput" value={faceValue} onChange={e=>setFaceValue(e.target.value.replace(/\D/g,''))} inputMode="numeric" placeholder="상품권 금액 입력"/>
    {items.length>0&&<div className="addedItems">{items.map((x,i)=><div key={`${x.pin}-${i}`}><span><b>{x.name}</b><small>PIN 끝 {x.pin.slice(-4)}</small></span><strong>{x.faceValue.toLocaleString()}원</strong><button type="button" onClick={()=>setItems(v=>v.filter((_,n)=>n!==i))}>×</button></div>)}</div>}
    <div className="sumGrid"><div><span>접수금액</span><strong>{total.toLocaleString()}원</strong></div><div><span>예상 입금액</span><strong>{expected.toLocaleString()}원</strong></div></div>
    <div className="feeNote">[건당 이체수수료 {fee.toLocaleString()}원 포함]</div>
    <div className="accountGrid"><select value={bankId} onChange={e=>setBankId(e.target.value)}><option value="">은행 선택</option>{banks.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select><input value={accountNumber} onChange={e=>setAccountNumber(e.target.value.replace(/\D/g,''))} placeholder="계좌번호" inputMode="numeric"/><input value={customerName} onChange={e=>setCustomerName(e.target.value)} placeholder="예금주"/></div>
    <div className="passwordGrid"><input value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,''))} placeholder="휴대전화번호" inputMode="numeric"/><input value={password} onChange={e=>setPassword(e.target.value.slice(0,10))} type="password" placeholder="조회 비밀번호"/></div>
    <div className="noticeBox"><b>안내사항</b><span>상품권 번호와 입금계좌를 정확하게 확인해 주세요.</span><span>최소 접수금액은 {Number(settings?.minimumOrderAmount||10000).toLocaleString()}원입니다.</span></div>
    <button className="submitBtn" type="button" onClick={submit} disabled={submitting||!banks.length}>{submitting?'접수 중...':'상품권 교환 신청하기'}</button>
  </div>
}
