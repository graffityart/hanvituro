import {NextResponse} from 'next/server';
import {isAdmin} from '../../../../../lib/admin-auth';
import {getDb} from '../../../../../lib/db';
import {sendOrderEventSms} from '../../../../../lib/icode';
const allowed=['received','reviewing','completed','impossible'];
export async function PATCH(req,{params}){
  if(!(await isAdmin()))return NextResponse.json({message:'Unauthorized'},{status:401});
  try{
    const {id}=await params;const {status,reason=''}=await req.json();
    if(!allowed.includes(status))return NextResponse.json({message:'처리상태를 확인해 주세요.'},{status:400});
    const sql=getDb();const rows=await sql`SELECT id,status FROM orders WHERE id=${Number(id)} AND deleted_at IS NULL LIMIT 1`;
    if(!rows.length)return NextResponse.json({message:'주문을 찾을 수 없습니다.'},{status:404});
    const old=rows[0].status;
    await sql`UPDATE orders SET status=${status},updated_at=NOW() WHERE id=${Number(id)}`;
    await sql`INSERT INTO order_history(order_id,old_status,new_status,changed_by,reason) VALUES(${Number(id)},${old},${status},'admin',${String(reason).slice(0,500)})`;
    const event=status==='reviewing'?'reviewing':status==='completed'?'paid':status==='impossible'?'rejected':'';
    if(event)await sendOrderEventSms(Number(id),event);
    return NextResponse.json({ok:true});
  }catch(e){console.error(e);return NextResponse.json({message:'상태 변경 중 오류가 발생했습니다.'},{status:500})}
}
