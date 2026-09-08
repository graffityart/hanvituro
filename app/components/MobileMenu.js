'use client';
import {useEffect,useState} from 'react';

export default function MobileMenu(){
  const[open,setOpen]=useState(false);
  useEffect(()=>{if(!open)return;const prev=document.body.style.overflow;document.body.style.overflow='hidden';const onKey=e=>{if(e.key==='Escape')setOpen(false)};window.addEventListener('keydown',onKey);return()=>{document.body.style.overflow=prev;window.removeEventListener('keydown',onKey)}},[open]);
  const close=()=>setOpen(false);
  return <div className="mobileNavRoot">
    <button type="button" className="mobileMenuBtn" onClick={()=>setOpen(true)} aria-label="메뉴 열기" aria-expanded={open}><span></span><span></span><span></span></button>
    <div className={`mobileMenuOverlay ${open?'isOpen':''}`} onClick={close}/>
    <aside className={`mobileMenuDrawer ${open?'isOpen':''}`} aria-hidden={!open}>
      <div className="mobileMenuTop"><strong>전체 메뉴</strong><button type="button" onClick={close}>×</button></div>
      <nav className="mobileMenuLinks">
        <a href="#rates" onClick={close}>상품권매입시세 <span>›</span></a>
        <a href="#live" onClick={close}>실시간매입현황 <span>›</span></a>
        <a href="#apply" onClick={close}>상품권현금교환 <span>›</span></a>
        <a href="#lookup" onClick={close}>내주문조회 <span>›</span></a>
        <a href="#guide" onClick={close}>이용방법 <span>›</span></a>
        <a href="#faq" onClick={close}>자주묻는질문 <span>›</span></a>
        <a href="#customer" onClick={close}>고객센터 <span>›</span></a>
      </nav>
      <div className="mobileMenuBottom"><a href="#apply" onClick={close}>상품권 현금교환 신청</a></div>
    </aside>
  </div>
}
