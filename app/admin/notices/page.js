'use client';
import {useEffect,useState} from 'react';

const empty={id:null,title:'',content:'',isPublished:true,isPinned:false};

export default function AdminNotices(){
  const [items,setItems]=useState([]);
  const [form,setForm]=useState(empty);
  const [msg,setMsg]=useState('');

  async function load(){
    const r=await fetch('/api/admin/notices',{cache:'no-store'});
    if(r.status===401){location.href='/admin/login';return}
    const d=await r.json();
    setItems(d.items||[]);
  }

  useEffect(()=>{load()},[]);

  async function save(e){
    e.preventDefault();
    setMsg('');
    const method=form.id?'PUT':'POST';
    const r=await fetch('/api/admin/notices',{
      method,
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(form)
    });
    const d=await r.json();
    if(!r.ok){setMsg(d.message||'저장 실패');return}
    setForm(empty);
    setMsg('저장되었습니다.');
    load();
  }

  async function remove(id){
    if(!confirm('이 공지사항을 삭제할까요?'))return;
    await fetch('/api/admin/notices',{
      method:'DELETE',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id})
    });
    setForm(empty);
    load();
  }

  return <>
    <div className="adminTitle">
      <small>BOARD MANAGEMENT</small>
      <h1>공지사항 관리</h1>
      <p>메인 화면과 공지사항 페이지에 노출할 안내문을 등록하고 관리합니다.</p>
    </div>

    <div className="noticeAdminGrid">
      <form className="noticeAdminCard" onSubmit={save}>
        <h2>{form.id?'공지 수정':'공지 등록'}</h2>
        <label className="noticeField">
          <span>제목</span>
          <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="공지 제목을 입력하세요" required/>
        </label>
        <label className="noticeField">
          <span>내용</span>
          <textarea value={form.content} onChange={e=>setForm({...form,content:e.target.value})} placeholder="공지 내용을 입력하세요" rows={10} required/>
        </label>
        <div className="noticeChecks">
          <label><input type="checkbox" checked={form.isPublished} onChange={e=>setForm({...form,isPublished:e.target.checked})}/> 공개</label>
          <label><input type="checkbox" checked={form.isPinned} onChange={e=>setForm({...form,isPinned:e.target.checked})}/> 상단 고정</label>
        </div>
        {msg&&<p className="noticeMessage">{msg}</p>}
        <div className="noticeActions">
          <button className="noticePrimary">{form.id?'수정 저장':'저장'}</button>
          {form.id&&<button type="button" className="noticeSecondary" onClick={()=>setForm(empty)}>취소</button>}
        </div>
      </form>

      <section className="noticeAdminCard noticeListCard">
        <div className="noticeListHead">
          <div>
            <h2>등록된 공지사항</h2>
            <p>최근 등록된 공지의 공개 여부와 고정 상태를 확인할 수 있습니다.</p>
          </div>
          <span>{items.length}건</span>
        </div>
        {items.length?items.map(n=><article className="noticeAdminRow" key={n.id}>
          <div>
            <strong>{n.is_pinned?'[고정] ':''}{n.title}</strong>
            <p>{n.is_published?'공개':'비공개'} · {new Date(n.created_at).toLocaleDateString('ko-KR')}</p>
          </div>
          <div className="noticeRowActions">
            <button onClick={()=>setForm({id:Number(n.id),title:n.title,content:n.content,isPublished:Boolean(n.is_published),isPinned:Boolean(n.is_pinned)})}>수정</button>
            <button className="danger" onClick={()=>remove(n.id)}>삭제</button>
          </div>
        </article>):<div className="adminEmpty noticeEmpty">등록된 공지사항이 없습니다.</div>}
      </section>
    </div>
  </>;
}
