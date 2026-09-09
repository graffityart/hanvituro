import './globals.css';
import './exchange-form.css';
import './easy-extract.css';
import './lookup.css';
import './brand-guide.css';
import './footer-business.css';

export const metadata = {
  title: '한빛 상품권',
  description: '한빛 상품권 개발 페이지입니다.',
  robots: { index: false, follow: false },
};

// Deployment refresh: 2026-09-09
export default function RootLayout({ children }) {
  return <html lang="ko"><body>{children}</body></html>;
}
