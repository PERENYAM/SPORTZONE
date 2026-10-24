import{NextResponse as R}from'next/server';import{z}from'zod';import{q}from'@/lib/db';import{getUser}from'@/lib/auth';
const Item=z.object({id:z.string().max(40),type:z.enum(['movie','tv']),title:z.string().max(300),poster:z.string().url().nullable().optional(),year:z.string().max(8).optional()});
const Key=z.object({id:z.string().max(40),type:z.enum(['movie','tv'])});
export async function GET(){const u=await getUser();if(!u)return R.json({error:'Log in first'},{status:401});
try{const rows=await q<{item_id:string;type:string;title:string;poster:string|null;year:string|null}>('select item_id,type,title,poster,year from watchlist where user_id=$1 order by title',[u.id]);
return R.json(rows.map(r=>({id:r.item_id,type:r.type,title:r.title,poster:r.poster,year:r.year??'',overview:'',rating:null})))}catch{return R.json({error:'Database unavailable'},{status:500})}}
export async function POST(req:Request){const u=await getUser();if(!u)return R.json({error:'Log in first'},{status:401});
const p=Item.safeParse(await req.json().catch(()=>null));if(!p.success)return R.json({error:'Invalid item'},{status:400});const d=p.data;
try{await q('insert into watchlist(user_id,type,item_id,title,poster,year) values($1,$2,$3,$4,$5,$6) on conflict do nothing',[u.id,d.type,d.id,d.title,d.poster??null,d.year??null]);return R.json({ok:true})}catch{return R.json({error:'Database unavailable'},{status:500})}}
export async function DELETE(req:Request){const u=await getUser();if(!u)return R.json({error:'Log in first'},{status:401});
const p=Key.safeParse(await req.json().catch(()=>null));if(!p.success)return R.json({error:'Invalid item'},{status:400});
try{await q('delete from watchlist where user_id=$1 and type=$2 and item_id=$3',[u.id,p.data.type,p.data.id]);return R.json({ok:true})}catch{return R.json({error:'Database unavailable'},{status:500})}}
