'use client';
import{useState}from'react';
export default function Login(){const[reg,setReg]=useState(false),[err,setErr]=useState(''),[busy,setBusy]=useState(false);
async function go(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setErr('');
const f=Object.fromEntries(new FormData(e.currentTarget));
const r=await fetch(`/api/auth/${reg?'register':'login'}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(f)}).catch(()=>null);
const j=await r?.json().catch(()=>({error:'Network error'}));setBusy(false);if(r?.ok)location.href='/';else setErr(j?.error||'Something went wrong')}
const c="w-full rounded bg-white/10 px-3 py-2";
return<main className="mx-auto max-w-sm px-4 py-10"><h1 className="mb-6 text-3xl font-black">{reg?'Create account':'Log in'}</h1>
<form onSubmit={go} className="space-y-3">{reg&&<label className="block">Name<input name="name" required className={c}/></label>}
<label className="block">Email<input name="email" type="email" required className={c}/></label>
<label className="block">Password<input name="password" type="password" minLength={8} required className={c}/></label>
{err&&<p role="alert" className="text-red-400">{err}</p>}
<button disabled={busy} className="w-full rounded bg-red-600 py-2 font-semibold disabled:opacity-50">{reg?'Create account':'Log in'}</button></form>
<button onClick={()=>setReg(!reg)} className="mt-4 text-sm text-white/70 underline">{reg?'Have an account? Log in':'New here? Create an account'}</button></main>}
