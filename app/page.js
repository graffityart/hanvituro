import ExchangeForm from './components/ExchangeForm';
import LookupForm from './components/LookupForm';
import {getActiveBanks,getActiveProducts,getServiceSettings} from '../lib/db';

const steps=[
  ['01','상품권 선택','보유한 상품권의 현재 매입률을 확인합니다.'],
  ['02','정보 입력','PIN 번호와 입금 받을 계좌를 입력합니다.'],
  ['03','검수 진행','접수된 상품권의 사용 가능 여부를 확인합니다.'],
  ['04','입금 완료','검수가 끝나면 처리 결과와 입금 상태를 확인합니다.'],
];

export const dynamic='force-dynamic';

export default async function Home(){
  const [products,banks,settings]=await Promise.all([getActiveProducts(),getActiveBanks(),getServiceSettings()]);
  return <main>
    <header className="siteHeader"><div className="shell headerInner"><a className="brand" href="#top" aria-label="한빛 상품권 홈"><span className="brandMark">H</span><span><b>한빛 상품권</b><small>HANBIT GIFT CARD</small></span></a><nav><a href="#rates">매입시세</a><a href="#apply">상품권 교환</a><a href="#guide">이용방법</a><a href="#status">거래조회</a><a href="#faq">고객안내</a></nav><a className="headerCta" href="#apply">빠른 교환신청</a></div></header>

    <section id="top" className="hero"><div className="shell heroGrid"><div className="heroCopy"><span className="heroEyebrow">365 DAYS · EASY GIFT CARD EXCHANGE</span><h1>상품권 교환을<br/><em>더 쉽고 명확하게.</em></h1><p>한빛 상품권은 현재 매입률을 한눈에 확인하고, 복잡한 회원가입 없이 필요한 정보만으로 간편하게 상품권 교환을 신청할 수 있습니다.</p><div className="heroActions"><a className="primaryBtn" href="#apply">상품권 교환 신청</a><a className="secondaryBtn" href="#rates">오늘 매입률 보기</a></div><div className="heroTrust"><span><b>24H</b> 운영 안내</span><span><b>{products.length}종</b> 주요 상품권</span><span><b>NO</b> 회원가입</span></div></div><div className="heroPanel"><div className="panelTop"><span>HANBIT EXCHANGE</span><i>● LIVE</i></div><div className="rateHighlight"><small>현재 대표 매입률</small><strong>{Number(products[0]?.default_rate||0).toFixed(0)}%</strong><p>{products[0]?.name||'상품권'} 기준 · 실제 매입률은 상품권별 상이</p></div><div className="miniRows"><span><b>상품권 선택</b><i>01</i></span><span><b>PIN 입력</b><i>02</i></span><span><b>계좌 입력</b><i>03</i></span><span><b>검수·입금</b><i>04</i></span></div></div></div></section>

    <section id="rates" className="section ratesSection"><div className="shell"><div className="sectionHead"><div><span>오늘의 매입 정보</span><h2>상품권별 매입률</h2></div><p>현재 접수 가능한 상품권과 매입률을 확인한 뒤 바로 신청할 수 있습니다.</p></div><div className="rateGrid">{products.map(p=><article className="rateCard" key={p.id}><small>GIFT CARD</small><h3>{p.name}</h3><div><strong>{Number(p.default_rate).toFixed(0)}%</strong><span>매입</span></div><a href="#apply">이 상품권 신청</a></article>)}</div></div></section>

    <section id="apply" className="section applyPreview"><div className="shell applyGrid"><div><span className="sectionLabel">빠른 교환신청</span><h2>필요한 정보만 입력하는<br/>간단한 신청 구조</h2><p>상품권 선택부터 PIN 등록, 입금 계좌 입력까지 한 화면에서 진행합니다. 접수 건당 이체수수료는 1회만 반영되도록 구성했습니다.</p></div><ExchangeForm products={products} banks={banks} settings={settings}/></div></section>

    <section id="guide" className="section guideSection"><div className="shell"><div className="sectionHead"><div><span>이용방법</span><h2>4단계로 끝나는 상품권 교환</h2></div></div><div className="stepGrid">{steps.map(([n,t,d])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></div></section>

    <section id="status" className="section lookupSection"><div className="shell lookupGrid"><div className="lookupCopy"><span>거래조회</span><h2>접수 후 진행상태도<br/>바로 확인하세요.</h2><p>접수번호를 기억하지 않아도 됩니다. 신청할 때 입력한 휴대전화번호와 조회 비밀번호만 있으면 최근 접수내역을 확인할 수 있습니다.</p><ul><li>접수번호 확인</li><li>처리상태 확인</li><li>접수금액·예상입금액 확인</li></ul></div><LookupForm/></div></section>

    <section id="faq" className="section faqSection"><div className="shell"><div className="sectionHead"><div><span>고객안내</span><h2>자주 확인하는 내용</h2></div></div><div className="faqGrid"><article><h3>회원가입이 필요한가요?</h3><p>회원가입 없이 상품권 교환 신청이 가능합니다.</p></article><article><h3>매입률은 어디에서 확인하나요?</h3><p>메인 매입률 영역에서 현재 접수 기준 매입률을 확인할 수 있습니다.</p></article><article><h3>이체수수료는 상품권마다 붙나요?</h3><p>아니요. 여러 장을 한 번에 접수해도 접수 건당 이체수수료 1회만 반영됩니다.</p></article></div></div></section>

    <footer><div className="shell footerInner"><div className="brand footerBrand"><span className="brandMark">H</span><span><b>한빛 상품권</b><small>HANBIT GIFT CARD</small></span></div><p>hanvituro.kr · 현재 개발 중이며 검색엔진 비공개 상태입니다.</p></div></footer>
  </main>;
}
