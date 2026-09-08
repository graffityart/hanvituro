import { neon } from '@neondatabase/serverless';

const fallbackProducts = [
  {id:1,name:'컬쳐랜드',slug:'cultureland',default_rate:90},
  {id:2,name:'온라인문화상품권',slug:'online-culture',default_rate:89},
  {id:3,name:'틴캐시',slug:'teencash',default_rate:88},
  {id:4,name:'북앤라이프',slug:'booknlife-book',default_rate:88},
  {id:5,name:'롯데 모바일상품권',slug:'lotte-mobile',default_rate:87},
  {id:6,name:'구글 기프트카드',slug:'google-gift',default_rate:85},
];

export function hasDatabase(){return Boolean(process.env.DATABASE_URL)}
export function getDb(){if(!process.env.DATABASE_URL)throw new Error('DATABASE_URL is not configured');return neon(process.env.DATABASE_URL)}

export async function getActiveProducts(){
  if(!hasDatabase()) return fallbackProducts;
  const sql=getDb();
  return sql`SELECT id,name,slug,default_rate FROM products WHERE is_active=true ORDER BY sort_order ASC,id ASC`;
}

export async function getActiveBanks(){
  if(!hasDatabase()) return [];
  const sql=getDb();
  return sql`SELECT id,name,code FROM banks WHERE is_active=true ORDER BY sort_order ASC,id ASC`;
}

export async function getServiceSettings(){
  if(!hasDatabase()) return {minimumOrderAmount:10000,transferFee:500,businessName:'한빛 상품권',customerPhone:'',customerHours:''};
  const sql=getDb();
  const rows=await sql`SELECT setting_key,setting_value FROM service_settings`;
  const map=Object.fromEntries(rows.map(r=>[r.setting_key,r.setting_value]));
  return {
    minimumOrderAmount:Number(map.minimum_order_amount||10000),
    transferFee:Number(map.transfer_fee||500),
    businessName:map.business_name||'한빛 상품권',
    customerPhone:map.customer_phone||'',
    customerHours:map.customer_hours||''
  };
}
