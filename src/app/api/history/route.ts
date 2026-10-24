import{NextResponse as R}from'next/server';import{z}from'zod';import{q}from'@/lib/db';import{getUser}from'@/lib/auth';
const H=z.object({id:z.string().max(40),type:z.enum(['movie','tv']),title:z.string().max(300),poster:z.string().url().nullable().optional(),position:z.number().min(0).max(1e6),duration:z.number().nullable().optional()});
export async function GET(req:Request){const u=await getUser();if(!u)return R.json({position:0});
const s=new URL(req.url).searchParams;const t=s.get('type'),id=(s.get('id')??'').slice(0,40);
try{const r=await q<{position:number}>('select position from history where user_id=$1 and type=$2 and item_id=$3',[u.id,t,id]);return R.json({position:r[0]?.position??0})}catch{return R.json({position:0})}}
export async function POST(req:Request){const u=await getUser();if(!u)return R.json({error:'Log in first'},{status:401});
const p=H.safeParse(await req.json().catch(()=>null));if(!p.success)return R.json({error:'Invalid data'},{status:400});const d=p.data;
try{await q('insert into history(user_id,type,item_id,title,poster,position,duration) values($1,$2,$3,$4,$5,$6,$7) on conflict(user_id,type,item_id) do update set position=$6,duration=$7,updated_at=now()',[u.id,d.type,d.id,d.title,d.poster??null,d.position,d.duration??null]);return R.json({ok:true})}catch{return R.json({error:'Database unavailable'},{status:500})}}
