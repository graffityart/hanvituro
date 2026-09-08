'use client';

const statusLabel={received:'접수중',reviewing:'확인중',checking:'확인중',completed:'입금완료',paid:'입금완료',impossible:'처리불가',rejected:'처리불가'};

export default function HomeStatusBoard({orders=[]}){
  const notices=[
    '한빛 상품권은 365일 24시간 접수 가능합니다.',
    '상품권 PIN 번호와 입금계좌를 정확하게 입력해 주세요.',
    '상품권별 매입률은 접수 시점 기준으로 적용됩니다.',
    '접수 건당 이체수수료 500원이 1회 반영됩니다.'
  ];
  const rows=orders.map(o=>({key:o.order_no,name:o.product_names||'상품권',count:Number(o.item_count||1),customer:o.customer_name||'',status:statusLabel[o.status]||'처리중',statusClass:`status-${o.status||'received'}`}));
  const loopRows=rows.length>4?[...rows,...rows]:rows;
  return <section id="live" className="statusBoardSection"><div className="shell statusBoardGrid">
    <article className="statusBoardCard liveBoardCard">
      <div className="statusBoardHead"><div className="statusBoardTitle"><span className="statusBoardIcon">◷</span><div><h2>실시간 매입 진행현황</h2><p>최근 접수된 매입현황입니다.</p></div></div><span className="statusArrow">→</span></div>
      {rows.length?<div className="liveTicker"><div className={rows.length>4?'liveTickerTrack is-moving':'liveTickerTrack'}>{loopRows.map((row,index)=><div className="liveTickerRow" key={`${row.key}-${index}`}><span className="tickerLogo">🎫</span><div className="tickerMain"><strong>{row.name} {row.count}건</strong><span>{maskName(row.customer)}</span></div><span className={`tickerStatus ${row.statusClass}`}>{row.status}</span></div>)}</div></div>:<div className="statusEmpty">아직 접수된 매입 내역이 없습니다.</div>}
    </article>
    <article className="statusBoardCard noticeBoardCard">
      <div className="statusBoardHead"><div className="statusBoardTitle"><span className="statusBoardIcon">♧</span><div><h2>공지사항</h2><p>한빛 상품권 이용 안내입니다.</p></div></div><span className="statusArrow">→</span></div>
      <div className="homeNoticeList">{notices.map((text,i)=><div key={text}><strong>{text}</strong><time>{String(i+1).padStart(2,'0')}</time></div>)}</div>
    </article>
  </div></section>
}

function maskName(name=''){const c=Array.from(name);if(c.length<=1)return'*';if(c.length===2)return`${c[0]}*`;return`${c[0]}*${c[c.length-1]}`}
