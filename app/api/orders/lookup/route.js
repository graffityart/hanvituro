import {NextResponse} from 'next/server';
import {getDb} from '../../../../lib/db';
import {verifyPassword} from '../../../../lib/secure';

export const dynamic='force-dynamic';

function formatKoreanTime(value){
  try{return new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date(value));}catch{return ''}
}

export async function POST(request){
  try{
    const body=await request.json();
    const phoneDigits=String(body?.phone||'').replace(/\D/g,'');
    const password=String(body?.password||'');
    if(phoneDigits.length<10||phoneDigits.length>11||!password)return NextResponse.json({message:'휴대전화번호와 조회 비밀번호를 확인해 주세요.'},{status:400});

    const sql=getDb();
    const rows=await sql`
      SELECT o.id,o.order_no,o.requested_amount,o.expected_amount,o.status,o.lookup_password_hash,o.created_at,
      COALESCE(string_agg(DISTINCT p.name, ', ' ORDER BY p.name),'상품권') AS product_names
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id=o.id
      LEFT JOIN products p ON p.id=oi.product_id
      WHERE o.deleted_at IS NULL AND o.phone_last4=${phoneDigits.slice(-4)}
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT 20
    `;

    const matched=rows.find(r=>verifyPassword(password,r.lookup_password_hash));
    if(!matched)return NextResponse.json({message:'일치하는 접수내역을 찾지 못했습니다.'},{status:404});

    return NextResponse.json({ok:true,order:{orderNo:matched.order_no,requestedAmount:Number(matched.requested_amount||0),expectedAmount:Number(matched.expected_amount||0),status:matched.status,productNames:matched.product_names,createdAt:formatKoreanTime(matched.created_at)}});
  }catch(error){
    console.error('Order lookup failed',error);
    return NextResponse.json({message:'거래내역 조회 중 오류가 발생했습니다.'},{status:500});
  }
}
