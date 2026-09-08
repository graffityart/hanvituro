'use client';
import {useRef,useState} from 'react';

export default function EasyVoucherTools({product,rule,onFill,onAddMany,onClose}){
  const [mode,setMode]=useState('text');
  const [raw,setRaw]=useState('');
  const [file,setFile]=useState(null);
  const [preview,setPreview]=useState('');
  const [busy,setBusy]=useState(false);
  const [progress,setProgress]=useState('');
  const [pins,setPins]=useState([]);
  const inputRef=useRef(null);

  const clean=v=>rule.alpha?String(v).toUpperCase().replace(/[^A-Z0-9]/g,''):String(v).replace(/\D/g,'');
  const extract=text=>{
    const source=String(text||'').toUpperCase().replace(/HTTPS?:\/\/\S+/g,' ');
    const out=[]; const seen=new Set();
    const add=v=>{const n=clean(String(v).replace(/[\s-]/g,''));if(rule.pattern.test(n)&&!seen.has(n)){seen.add(n);out.push(n)}};
    (source.match(/[A-Z0-9](?:[A-Z0-9]|[\s-]){7,34}[A-Z0-9]/g)||[]).forEach(add);
    if(!rule.alpha)(source.match(/(?:\d[\s-]*){12,20}/g)||[]).forEach(add);
    return out.slice(0,20);
  };
  const runText=()=>{const found=extract(raw);if(!found.length)return alert('PIN 번호를 찾지 못했습니다.');if(found.length===1){onFill(found[0]);onClose();return;}setPins(found.map(pin=>({pin,amount:''})))};
  const choose=pin=>{onFill(pin);onClose()};
  const chooseFile=f=>{if(!f)return;if(!['image/jpeg','image/png','image/webp'].includes(f.type))return alert('JPG, PNG, WebP 이미지만 등록할 수 있습니다.');if(f.size>10*1024*1024)return alert('이미지는 최대 10MB까지 가능합니다.');if(preview)URL.revokeObjectURL(preview);setFile(f);setPreview(URL.createObjectURL(f));setPins([])};
  const runImage=async()=>{if(!file)return alert('상품권 이미지를 선택해 주세요.');setBusy(true);setProgress('이미지 분석 준비 중...');try{const {createWorker}=await import('tesseract.js');const worker=await createWorker('eng',1,{logger:m=>{if(m.status==='recognizing text')setProgress(`이미지 분석 중 ${Math.round((m.progress||0)*100)}%`)}});const result=await worker.recognize(file);await worker.terminate();setRaw(result.data.text||'');const found=extract(result.data.text||'');if(!found.length)return alert('PIN 번호를 찾지 못했습니다. 더 선명한 이미지로 다시 시도해 주세요.');if(found.length===1){onFill(found[0]);onClose();return;}setPins(found.map(pin=>({pin,amount:''})))}catch(e){console.error(e);alert('이미지 분석 중 오류가 발생했습니다.')}finally{setBusy(false);setProgress('')}};
  const addMany=()=>{const valid=pins.filter(x=>Number(x.amount)>0);if(!valid.length)return alert('각 PIN의 상품권 금액을 입력해 주세요.');onAddMany(valid);onClose()};
  return <div className="easyModalBackdrop greenModal" onClick={()=>!busy&&onClose()}><div className="easyModal" onClick={e=>e.stopPropagation()}><button className="easyClose" type="button" onClick={()=>!busy&&onClose()}>×</button><div className="easyProductHead">{product?.imageUrl&&<span><img src={product.imageUrl} alt=""/></span>}<div><strong>{product?.name}</strong><p>간편하게 등록하세요 👇</p></div></div><div className="easyModeTabs"><button className={mode==='text'?'active':''} onClick={()=>setMode('text')}>간편 문자 추출</button><button className={mode==='image'?'active':''} onClick={()=>setMode('image')}>이미지 간편등록</button></div>{mode==='text'?<><textarea className="easyTextArea" value={raw} onChange={e=>setRaw(e.target.value)} placeholder={`상품권 문자를 붙여넣어 주세요.\n예) ${rule.example||''}`}/><p className="easyHelper">선택한 상품권의 PIN 형식과 일치하는 번호만 추출합니다.</p><button className="easyPrimary" type="button" onClick={runText}>추출하기</button></>:<><div className="imageDropZone" onClick={()=>!busy&&inputRef.current?.click()}><input ref={inputRef} type="file" hidden accept="image/jpeg,image/png,image/webp" onChange={e=>chooseFile(e.target.files?.[0])}/>{preview?<><img className="imagePreview" src={preview} alt="상품권 이미지 미리보기"/><strong>{file?.name}</strong></>:<><span className="imageDropIcon">▣</span><strong>이미지를 클릭하여 선택하세요.</strong><small>JPG, PNG, WebP · 최대 10MB</small></>}</div><button className="easyPrimary imageExtractBtn" type="button" disabled={!file||busy} onClick={runImage}>{busy?(progress||'분석 중...'):'이미지에서 추출하기'}</button></>}{pins.length>0&&<div className="foundPinList"><b>PIN 번호 {pins.length}개를 찾았습니다.</b>{pins.map((x,i)=><div className="foundPinChoice" key={x.pin}><code>{x.pin}</code><button type="button" onClick={()=>choose(x.pin)}>입력</button>{mode==='image'&&<input inputMode="numeric" value={x.amount} onChange={e=>setPins(v=>v.map((p,n)=>n===i?{...p,amount:e.target.value.replace(/\D/g,'')}:p))} placeholder="금액"/>}</div>)}{mode==='image'&&pins.length>1&&<button className="easyPrimary" type="button" onClick={addMany}>추출 PIN 일괄 등록</button>}</div>}</div></div>;
}
