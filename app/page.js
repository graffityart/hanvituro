const rates = [
  ['컬쳐랜드','90%','문화상품권'],
  ['온라인문화상품권','89%','온라인 PIN'],
  ['틴캐시','88%','틴캐시 상품권'],
  ['북앤라이프','88%','도서문화상품권'],
  ['롯데 모바일상품권','87%','모바일 교환권'],
  ['구글 기프트카드','85%','기프트카드'],
];

const steps = [
  ['01','상품권 선택','보유한 상품권의 현재 매입률을 확인합니다.'],
  ['02','정보 입력','PIN 번호와 입금 받을 계좌를 입력합니다.'],
  ['03','검수 진행','접수된 상품권의 사용 가능 여부를 확인합니다.'],
  ['04','입금 완료','검수가 끝나면 처리 결과와 입금 상태를 확인합니다.'],
];

export default function Home() {
  return (
    <main>
      <header className="siteHeader">
        <div className="shell headerInner">
          <a className="brand" href="#top" aria-label="한빛 상품권 홈">
            <span className="brandMark">H</span>
            <span><b>한빛 상품권</b><small>HANBIT GIFT CARD</small></span>
          </a>
          <nav>
            <a href="#rates">매입시세</a>
            <a href="#apply">상품권 교환</a>
            <a href="#guide">이용방법</a>
            <a href="#status">거래조회</a>
            <a href="#faq">고객안내</a>
          </nav>
          <a className="headerCta" href="#apply">빠른 교환신청</a>
        </div>
      </header>

      <section id="top" className="hero">
        <div className="shell heroGrid">
          <div className="heroCopy">
            <span className="heroEyebrow">365 DAYS · EASY GIFT CARD EXCHANGE</span>
            <h1>상품권 교환을<br/><em>더 쉽고 명확하게.</em></h1>
            <p>한빛 상품권은 현재 매입률을 한눈에 확인하고, 복잡한 회원가입 없이 간편하게 상품권 교환을 신청할 수 있도록 구성합니다.</p>
            <div className="heroActions">
              <a className="primaryBtn" href="#apply">상품권 교환 신청</a>
              <a className="secondaryBtn" href="#rates">오늘 매입률 보기</a>
            </div>
            <div className="heroTrust">
              <span><b>24H</b> 운영 안내</span>
              <span><b>6종</b> 주요 상품권</span>
              <span><b>NO</b> 회원가입</span>
            </div>
          </div>
          <div className="heroPanel" aria-label="상품권 교환 요약">
            <div className="panelTop"><span>HANBIT EXCHANGE</span><i>● LIVE</i></div>
            <div className="rateHighlight"><small>대표 매입률</small><strong>90%</strong><p>컬쳐랜드 기준 · 실제 매입률은 상품권별 상이</p></div>
            <div className="miniRows">
              <span><b>상품권 선택</b><i>01</i></span>
              <span><b>PIN 입력</b><i>02</i></span>
              <span><b>계좌 입력</b><i>03</i></span>
              <span><b>검수·입금</b><i>04</i></span>
            </div>
          </div>
        </div>
      </section>

      <section id="rates" className="section ratesSection">
        <div className="shell">
          <div className="sectionHead"><div><span>오늘의 매입 정보</span><h2>상품권별 매입률</h2></div><p>상품권 종류별 현재 기준 매입률을 확인할 수 있도록 구성합니다.</p></div>
          <div className="rateGrid">
            {rates.map(([name,rate,type]) => <article className="rateCard" key={name}><small>{type}</small><h3>{name}</h3><div><strong>{rate}</strong><span>매입</span></div><button type="button">이 상품권 신청</button></article>)}
          </div>
        </div>
      </section>

      <section id="apply" className="section applyPreview">
        <div className="shell applyGrid">
          <div><span className="sectionLabel">빠른 교환신청</span><h2>필요한 정보만 입력하는<br/>간단한 신청 구조</h2><p>사요 상품권의 검증된 접수 로직은 재사용하되, 한빛 상품권에서는 입력 순서와 화면 구성을 새롭게 설계합니다.</p></div>
          <div className="formMock">
            <label>상품권 종류<select defaultValue="컬쳐랜드"><option>컬쳐랜드</option><option>온라인문화상품권</option><option>틴캐시</option></select></label>
            <label>상품권 PIN<input placeholder="상품권 번호 입력" readOnly/></label>
            <div className="twoCols"><label>은행<input placeholder="은행 선택" readOnly/></label><label>예금주<input placeholder="예금주" readOnly/></label></div>
            <button type="button">교환 신청하기</button>
            <small>현재는 디자인 1차 구성 단계입니다. 실제 접수 기능은 다음 단계에서 연결합니다.</small>
          </div>
        </div>
      </section>

      <section id="guide" className="section guideSection">
        <div className="shell"><div className="sectionHead"><div><span>이용방법</span><h2>4단계로 끝나는 상품권 교환</h2></div></div><div className="stepGrid">{steps.map(([n,t,d])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></div>
      </section>

      <section id="status" className="section statusSection"><div className="shell statusBox"><div><span>거래조회</span><h2>접수 후 진행상태도 간단하게</h2><p>전화번호와 조회 비밀번호를 기준으로 주문 상태를 확인하는 방식으로 연결할 예정입니다.</p></div><a href="#apply">교환 신청부터 시작하기</a></div></section>

      <section id="faq" className="section faqSection"><div className="shell"><div className="sectionHead"><div><span>고객안내</span><h2>자주 확인하는 내용</h2></div></div><div className="faqGrid"><article><h3>회원가입이 필요한가요?</h3><p>회원가입 없이 신청할 수 있는 구조로 제작합니다.</p></article><article><h3>매입률은 어디에서 확인하나요?</h3><p>메인 매입률 영역과 상품권별 상세 페이지에서 각각 확인하도록 구성합니다.</p></article><article><h3>신청 내역은 어떻게 조회하나요?</h3><p>접수 시 입력한 전화번호와 조회 비밀번호로 확인하도록 연결할 예정입니다.</p></article></div></div></section>

      <footer><div className="shell footerInner"><div className="brand footerBrand"><span className="brandMark">H</span><span><b>한빛 상품권</b><small>HANBIT GIFT CARD</small></span></div><p>개발 중인 한빛 상품권 1차 브랜드 페이지입니다.</p></div></footer>
    </main>
  );
}
