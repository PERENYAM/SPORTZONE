'use client';
import{useEffect,useState}from'react';import Link from'next/link';import type{Item}from'@/lib/data';
const K='sz-list';
const read=():Item[]=>{try{return JSON.parse(localStorage.getItem(K)||'[]')}catch{return[]}};
const J={'Content-Type':'application/json'};
export function WatchButton({item,auth}:{item:Item;auth:boolean}){const[on,set]=useState(false);
useEffect(()=>{if(auth)fetch('/api/watchlist').then(r=>r.json()).then((l:Item[])=>set(Array.isArray(l)&&l.some(i=>i.id===item.id&&i.type===item.type))).catch(()=>{});else set(read().some(i=>i.id===item.id&&i.type===item.type))},[item.id,item.type,auth]);
const click=async()=>{if(auth){const r=await fetch('/api/watchlist',{method:on?'DELETE':'POST',headers:J,body:JSON.stringify(on?{type:item.type,id:item.id}:item)});if(!r.ok)return}
else{const l=read().filter(i=>!(i.id===item.id&&i.type===item.type));if(!on)l.push(item);localStorage.setItem(K,JSON.stringify(l))}set(!on)};
return<div><button onClick={click} aria-pressed={on} className="rounded bg-red-600 px-4 py-2 font-semibold hover:bg-red-500">{on?'Remove from My List':'Add to My List'}</button>{!auth&&<p className="mt-2 text-xs text-white/50">Saved on this device only. <Link href="/login" className="underline">Log in</Link> to keep it everywhere.</p>}</div>}
export function MyList({auth}:{auth:boolean}){const[l,set]=useState<Item[]|null>(null);
useEffect(()=>{if(auth)fetch('/api/watchlist').then(r=>r.json()).then(j=>set(Array.isArray(j)?j:[])).catch(()=>set([]));else set(read())},[auth]);
if(!l)return null;
if(!l.length)return<p className="text-white/70">Your list is empty. Open any movie or show and choose “Add to My List”.</p>;
return<div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">{l.map(i=><Link key={i.type+i.id} href={`/title/${i.type}/${i.id}`} className="rounded bg-white/5 p-3 hover:bg-white/10">{i.title}</Link>)}</div>}
export function LogoutButton(){return<button className="whitespace-nowrap text-white/60 hover:text-white" onClick={async()=>{await fetch('/api/auth/logout',{method:'POST'});location.href='/'}}>Log out</button>}
export function LocalTime({iso}:{iso:string}){const[s,set]=useState('');useEffect(()=>set(new Date(iso).toLocaleString([],{dateStyle:'medium',timeStyle:'short'})),[iso]);return<time dateTime={iso}>{s}</time>}
