import './globals.css';

export const metadata = {
  title: '한빛 상품권',
  description: '한빛 상품권 개발 페이지입니다.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
