'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';

export default function AdminLogin(){
 const [password,setPassword]=useState('');const [msg,setMsg]=useState('');const [loading,setLoading]=useState(false);const router=useRouter();
 async function submit(e){e.preventDefault();setLoading(true);setMsg('');try{const r=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password})});const d=await r.json();if(!r.ok)throw new Error(d.message||'로그인 실패');router.replace('/admin/notices');router.refresh()}catch(e){setMsg(e.message)}finally{setLoading(false)}}
 return <main style={{minHeight:'100vh',display:'grid',placeItems:'center',background:'#f4f7f9',padding:20}}><form onSubmit={submit} style={{width:'min(420px,100%)',background:'#fff',padding:32,borderRadius:18,boxShadow:'0 18px 50px rgba(31,65,92,.12)'}}><small style={{color:'#168fe5',fontWeight:800}}>HANBIT ADMIN</small><h1 style={{margin:'8px 0 6px'}}>한빛 상품권 관리자</h1><p style={{color:'#7d8b96',fontSize:13}}>관리자 비밀번호를 입력하세요.</p><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="관리자 비밀번호" style={{width:'100%',height:48,padding:'0 14px',border:'1px solid #dce4e9',borderRadius:10,marginTop:12}}/>{msg&&<p style={{color:'#d33',fontSize:12}}>{msg}</p>}<button disabled={loading} style={{width:'100%',height:50,border:0,borderRadius:10,background:'#168fe5',color:'#fff',fontWeight:800,marginTop:14}}>{loading?'로그인 중...':'관리자 로그인'}</button></form></main>
}
