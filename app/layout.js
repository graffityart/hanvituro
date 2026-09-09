import './globals.css';
import './exchange-form.css';
import './easy-extract.css';
import './lookup.css';
import './brand-guide.css';
import './footer-business.css';

const base='https://www.hanvituro.kr';
const siteTitle='한빛 상품권 | 문화상품권 현금화 · 컬쳐랜드 상품권 매입·현금교환';
const siteDescription='한빛 상품권은 문화상품권 현금화와 컬쳐랜드 상품권 매입·현금교환을 간편하게 신청할 수 있는 상품권 매입 서비스입니다. 365일 24시간 상품권 시세 확인과 신청내역 조회가 가능합니다.';

export const metadata = {
  metadataBase: new URL(base),
  title: siteTitle,
  description: siteDescription,
  keywords: ['한빛 상품권','문화상품권 현금화','컬쳐랜드 상품권 매입','컬쳐랜드 현금화','상품권 매입','상품권 현금교환','문화상품권 매입'],
  icons: {
    icon: [{ url: '/images/favicon.ico', type: 'image/x-icon' }],
    shortcut: '/images/favicon.ico',
  },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: `${base}/`,
    siteName: '한빛 상품권',
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
  },
  robots: { index: true, follow: true },
};

const websiteLd={
  '@context':'https://schema.org',
  '@type':'WebSite',
  '@id':`${base}/#website`,
  url:`${base}/`,
  name:'한빛 상품권',
  inLanguage:'ko-KR'
};
const organizationLd={
  '@context':'https://schema.org',
  '@type':'Organization',
  '@id':`${base}/#organization`,
  name:'한빛 상품권(핀토스)',
  url:`${base}/`,
  logo:`${base}/images/hero/logo.png`,
  email:'admin@pin-toss.com',
  address:{
    '@type':'PostalAddress',
    postalCode:'47190',
    addressRegion:'부산광역시',
    addressLocality:'부산진구',
    streetAddress:'당감로17, 7동 906호(당감동)',
    addressCountry:'KR'
  }
};

export default function RootLayout({ children }) {
  return <html lang="ko"><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(websiteLd)}}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(organizationLd)}}/>{children}</body></html>;
}
