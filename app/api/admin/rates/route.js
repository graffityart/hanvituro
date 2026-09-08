import {NextResponse} from 'next/server';
import {isAdmin} from '../../../../lib/admin-auth';
import {getDb} from '../../../../lib/db';
export async function PATCH(req){
 if(!(await isAdmin()))return NextResponse.json({message:'Unauthorized'},{status:401});
 try{const {id,rate}=await req.json();const n=Number(rate);if(!id||!Number.isFinite(n)||n<0||n>100)return NextResponse.json({message:'매입률을 확인해 주세요.'},{status:400});const sql=getDb();await sql`UPDATE products SET default_rate=${n},updated_at=NOW() WHERE id=${Number(id)}`;return NextResponse.json({ok:true});}catch(e){console.error(e);return NextResponse.json({message:'저장 중 오류가 발생했습니다.'},{status:500})}
}