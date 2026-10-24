/* eslint-disable @typescript-eslint/no-explicit-any */
export async function apiGet(base:string,path:string,key:string,rev:number):Promise<any[]>{
const r=await fetch(base+path,{headers:{'x-apisports-key':key},next:{revalidate:rev}});
if(r.status===429)throw new Error('Sports API rate limit reached. Try again later or raise SPORTS_REVALIDATE_SECONDS.');
if(!r.ok)throw new Error(`Sports API responded ${r.status}`);
const j=await r.json();const e=j.errors;
if(e&&(Array.isArray(e)?e.length:Object.keys(e).length))throw new Error(Object.values(e).join('; '));
return j.response??[];}
