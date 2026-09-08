import crypto from 'crypto';
import {NextResponse} from 'next/server';
import {adminCookieName,adminSessionMaxAge,makeAdminSession} from '../../../../lib/admin-auth';

function safeEqual(a,b){const aa=Buffer.from(String(a||'')),bb=Buffer.from(String(b||''));return aa.length===bb.length&&crypto.timingSafeEqual(aa,bb)}
export async function POST(request){
  try{
    const {password}=await request.json();
    const configured=process.env.ADMIN_PASSWORD;
    if(!configured)return NextResponse.json({message:'ADMIN_PASSWORD 환경변수가 필요합니다.'},{status:503});
    if(!safeEqual(password,configured))return NextResponse.json({message:'관리자 비밀번호가 올바르지 않습니다.'},{status:401});
    const res=NextResponse.json({ok:true});
    res.cookies.set(adminCookieName(),makeAdminSession(),{httpOnly:true,secure:true,sameSite:'lax',path:'/',maxAge:adminSessionMaxAge()});
    return res;
  }catch{return NextResponse.json({message:'로그인 처리 중 오류가 발생했습니다.'},{status:500})}
}
