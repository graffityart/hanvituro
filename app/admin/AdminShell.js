'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items=[
  {href:'/admin/orders',label:'주문 관리'},
  {href:'/admin/rates',label:'매입률 관리'},
  {href:'/admin/notices',label:'공지사항 관리'},
  {href:'/admin/sms',label:'문자 설정'},
];

export default function AdminShell({children}){
  const pathname=usePathname();
  if(pathname==='/admin/login') return children;
  return (
    <div className="adminShell">
      <aside className="adminSidebar">
        <Link href="/admin/orders" className="adminBrand">한빛 상품권 <span>ADMIN</span></Link>
        <nav className="adminNav">
          {items.map(item=><Link key={item.href} href={item.href} className={pathname.startsWith(item.href)?'active':''}>{item.label}</Link>)}
        </nav>
        <a className="adminSiteLink" href="/" target="_blank" rel="noreferrer">사이트 보기 ↗</a>
      </aside>
      <div className="adminMain">{children}</div>
    </div>
  );
}
