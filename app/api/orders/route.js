import crypto from 'crypto';
import {NextResponse} from 'next/server';
import {getDb,getServiceSettings,hasDatabase} from '../../../lib/db';
import {encryptText,hashPassword} from '../../../lib/secure';

export const dynamic='force-dynamic';

function orderNo(){
  const d=new Date();const p=n=>String(n).padStart(2,'0');
  return `HB${d.getUTCFullYear()}${p(d.getUTCMonth()+1)}${p(d.getUTCDate())}${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}${crypto.randomUUID().replace(/-/g,'').slice(0,6).toUpperCase()}`;
}
function pinHash(productId,pin){return crypto.createHash('sha256').update(`${productId}:${pin}`,'utf8').digest('hex')}

export async function POST(request){
  try{
    if(!hasDatabase())return NextResponse.json({message:'현재 개발 DB 연결 전입니다.'},{status:503});
    const body=await request.json();
    const {customerName,phone,bankId,accountNumber,password,items}=body||{};
    if(!customerName||!phone||!bankId||!accountNumber||!password||!Array.isArray(items)||!items.length)return NextResponse.json({message:'필수 신청정보를 확인해 주세요.'},{status:400});
    if(items.length>20)return NextResponse.json({message:'상품권은 한 번에 최대 20개까지 접수할 수 있습니다.'},{status:400});
    const sql=getDb();const settings=await getServiceSettings();
    const bankRows=await sql`SELECT id FROM banks WHERE id=${Number(bankId)} AND is_active=true LIMIT 1`;
    if(!bankRows.length)return NextResponse.json({message:'은행을 다시 선택해 주세요.'},{status:400});
    const ids=[...new Set(items.map(x=>Number(x.productId)).filter(Boolean))];
    const products=await sql`SELECT id,name,slug,default_rate FROM products WHERE is_active=true AND id = ANY(${ids})`;
    const map=new Map(products.map(p=>[Number(p.id),p]));
    let requested=0,gross=0;const normalized=[];const seen=new Set();
    for(const item of items){
      const p=map.get(Number(item.productId));const face=Number(item.faceValue);const pin=String(item.pin||'').replace(/[\s-]/g,'');
      if(!p||pin.length<8||pin.length>64||!Number.isInteger(face)||face<=0)return NextResponse.json({message:'상품권 정보를 다시 확인해 주세요.'},{status:400});
      const key=`${p.id}:${pin}`;if(seen.has(key))return NextResponse.json({message:'같은 PIN 번호가 중복 입력되어 있습니다.'},{status:400});seen.add(key);
      const rate=Number(p.default_rate),expected=Math.floor(face*rate/100),hash=pinHash(Number(p.id),pin);
      requested+=face;gross+=expected;normalized.push({productId:Number(p.id),pin,hash,face,rate,expected});
    }
    if(requested<settings.minimumOrderAmount)return NextResponse.json({message:`최소 접수금액은 ${settings.minimumOrderAmount.toLocaleString()}원입니다.`},{status:400});
    const duplicates=await sql`SELECT oi.pin_hash FROM order_items oi JOIN orders o ON o.id=oi.order_id WHERE oi.pin_hash=ANY(${normalized.map(x=>x.hash)}) AND o.deleted_at IS NULL AND o.status IN ('received','reviewing','checking','completed','paid') LIMIT 1`;
    if(duplicates.length)return NextResponse.json({message:'이미 정상 접수된 상품권 PIN입니다.'},{status:409});
    const phoneDigits=String(phone).replace(/\D/g,''),accountDigits=String(accountNumber).replace(/\D/g,'');
    if(phoneDigits.length<10||phoneDigits.length>11||accountDigits.length<8)return NextResponse.json({message:'연락처 또는 계좌번호를 확인해 주세요.'},{status:400});
    const no=orderNo(),expectedAmount=Math.max(0,gross-settings.transferFee),customer=String(customerName).trim();
    const inserted=await sql`INSERT INTO orders (order_no,customer_name,phone_encrypted,phone_last4,bank_id,account_number_encrypted,account_holder,requested_amount,expected_amount,status,lookup_password_hash) VALUES (${no},${customer},${encryptText(phoneDigits)},${phoneDigits.slice(-4)},${Number(bankId)},${encryptText(accountDigits)},${customer},${requested},${expectedAmount},'received',${hashPassword(password)}) RETURNING id`;
    for(const x of normalized){await sql`INSERT INTO order_items (order_id,product_id,pin_encrypted,pin_hash,pin_last4,face_value,rate_percent,expected_amount,item_status) VALUES (${inserted[0].id},${x.productId},${encryptText(x.pin)},${x.hash},${x.pin.slice(-4)},${x.face},${x.rate},${x.expected},'received')`}
    await sql`INSERT INTO order_history (order_id,new_status,changed_by,reason) VALUES (${inserted[0].id},'received','system','한빛 상품권 신규 접수')`;
    return NextResponse.json({ok:true,orderNo:no,expectedAmount});
  }catch(error){console.error('Hanbit order create failed',error);return NextResponse.json({message:'신청 처리 중 오류가 발생했습니다.'},{status:500})}
}
