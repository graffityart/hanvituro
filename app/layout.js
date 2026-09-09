import './globals.css';
import './exchange-form.css';
import './easy-extract.css';
import './lookup.css';
import './brand-guide.css';
import './footer-business.css';

const siteTitle='한빛 상품권 | 문화상품권 현금화 · 컬쳐랜드 상품권 매입·현금교환';
const siteDescription='한빛 상품권은 문화상품권 현금화와 컬쳐랜드 상품권 매입·현금교환을 간편하게 신청할 수 있는 상품권 매입 서비스입니다. 365일 24시간 상품권 시세 확인과 신청내역 조회가 가능합니다.';

export const metadata = {
  metadataBase: new URL('https://hanvituro.kr'),
  title: siteTitle,
  description: siteDescription,
  keywords: ['한빛 상품권','문화상품권 현금화','컬쳐랜드 상품권 매입','컬쳐랜드 현금화','상품권 매입','상품권 현금교환','문화상품권 매입'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://hanvituro.kr/',
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

export default function RootLayout({ children }) {
  return <html lang="ko"><body>{children}</body></html>;
}
