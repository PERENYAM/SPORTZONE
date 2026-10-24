import{NextResponse as R}from'next/server';import{z}from'zod';import bcrypt from'bcryptjs';import{q}from'@/lib/db';import{setSession,clearSession}from'@/lib/auth';
const hits=new Map<string,{n:number;t:number}>();
const limited=(ip:string)=>{const now=Date.now(),h=hits.get(ip);if(!h||now-h.t>6e4){hits.set(ip,{n:1,t:now});return false}return++h.n>10};
const Reg=z.object({email:z.string().email().max(200),password:z.string().min(8).max(100),name:z.string().min(1).max(60)});
export async function POST(req:Request,{params}:{params:{action:string}}){
try{
if(params.action==='logout'){clearSession();return R.json({ok:true})}
if(limited(req.headers.get('x-forwarded-for')??'local'))return R.json({error:'Too many attempts. Wait a minute and try again.'},{status:429});
const body=await req.json();
if(params.action==='register'){const p=Reg.safeParse(body);if(!p.success)return R.json({error:'Enter a valid email, a name, and a password of at least 8 characters.'},{status:400});
const email=p.data.email.toLowerCase();
const rows=await q<{id:number}>('insert into users(email,name,password_hash) values($1,$2,$3) on conflict do nothing returning id',[email,p.data.name,await bcrypt.hash(p.data.password,12)]);
if(!rows.length)return R.json({error:'That email is already registered. Log in instead.'},{status:409});
await setSession({id:rows[0].id,email,name:p.data.name});return R.json({ok:true})}
if(params.action==='login'){const p=Reg.omit({name:true}).safeParse(body);if(!p.success)return R.json({error:'Enter your email and password.'},{status:400});
const u=(await q<{id:number;name:string;password_hash:string}>('select id,name,password_hash from users where email=$1',[p.data.email.toLowerCase()]))[0];
if(!u||!(await bcrypt.compare(p.data.password,u.password_hash)))return R.json({error:'Wrong email or password.'},{status:401});
await setSession({id:u.id,email:p.data.email.toLowerCase(),name:u.name});return R.json({ok:true})}
return R.json({error:'Not found'},{status:404})}
catch(e){console.error('auth error:',(e as Error).message);return R.json({error:'Server is not set up. Check DATABASE_URL and AUTH_SECRET.'},{status:500})}}
