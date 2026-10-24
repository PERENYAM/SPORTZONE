import{SignJWT,jwtVerify}from'jose';import{cookies}from'next/headers';
const secret=()=>{const s=process.env.AUTH_SECRET;if(!s||s.length<16)throw new Error('AUTH_SECRET must be set (16+ characters)');return new TextEncoder().encode(s)};
export type User={id:number;email:string;name:string};
export async function setSession(u:User){const t=await new SignJWT({...u}).setProtectedHeader({alg:'HS256'}).setExpirationTime('30d').sign(secret());
cookies().set('sz-session',t,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:2592000})}
export async function getUser():Promise<User|null>{const t=cookies().get('sz-session')?.value;if(!t||!process.env.AUTH_SECRET)return null;
try{const{payload}=await jwtVerify(t,secret());return{id:Number(payload.id),email:String(payload.email),name:String(payload.name)}}catch{return null}}
export const clearSession=()=>cookies().delete('sz-session');
