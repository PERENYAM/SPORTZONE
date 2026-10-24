'use client';
import{useEffect,useRef,useState}from'react';
type P={src:string;type:string;id:string;title:string;poster:string|null;auth:boolean};
export default function Player({src,type,id,title,poster,auth}:P){
const v=useRef<HTMLVideoElement>(null),last=useRef(0);const[err,setErr]=useState('');const key=`sz-pos-${type}-${id}`;
useEffect(()=>{const el=v.current;if(!el)return;let hls:{destroy():void}|undefined,dead=false;
(async()=>{let pos=Number(localStorage.getItem(key)||0);
if(auth){try{pos=(await(await fetch(`/api/history?type=${type}&id=${id}`)).json()).position||pos}catch{}}
el.addEventListener('loadedmetadata',()=>{if(pos>5)el.currentTime=pos},{once:true});
if(src.includes('.m3u8')&&!el.canPlayType('application/vnd.apple.mpegurl')){const H=(await import('hls.js')).default;if(dead)return;
if(!H.isSupported()){setErr('This browser cannot play this stream.');return}
const h=new H();hls=h;h.loadSource(src);h.attachMedia(el);h.on(H.Events.ERROR,(_e,d)=>{if(d.fatal)setErr('The stream failed to load. Try again later.')})}else el.src=src})();
return()=>{dead=true;hls?.destroy()}},[src,type,id,auth,key]);
const save=()=>{const el=v.current;if(!el||!el.currentTime)return;localStorage.setItem(key,String(el.currentTime));
if(auth)fetch('/api/history',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type,id,title,poster,position:el.currentTime,duration:Number.isFinite(el.duration)?el.duration:null})}).catch(()=>{})};
if(err)return<div role="alert" className="mb-4 max-w-2xl rounded bg-red-900/50 p-4">{err}</div>;
return<video ref={v} controls playsInline className="mb-4 aspect-video w-full max-w-2xl rounded bg-black" onPause={save} onEnded={save} onError={()=>setErr('This video could not be loaded.')} onTimeUpdate={()=>{const t=Date.now();if(t-last.current>15000){last.current=t;save()}}}/>}
