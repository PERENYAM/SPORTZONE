import Link from'next/link';import{getTrending,type Item}from'@/lib/data';import{getMatches}from'@/lib/api/sports';import{getUser}from'@/lib/auth';import{q}from'@/lib/db';import{Card,MatchCard,Row,Notice,SportsNotice}from'./ui';
export default async function Home(){
const[m,t,f,b,u]=await Promise.all([getTrending('movie'),getTrending('tv'),getMatches('football'),getMatches('basketball'),getUser()]);
const feat=m.items[0];const all=[...f.matches,...b.matches];
let cont:Item[]=[];if(u){try{cont=(await q<{item_id:string;type:'movie'|'tv';title:string;poster:string|null}>('select item_id,type,title,poster from history where user_id=$1 and position>5 order by updated_at desc limit 10',[u.id])).map(r=>({id:r.item_id,type:r.type,title:r.title,poster:r.poster,year:'',overview:'',rating:null}))}catch{}}
return<main className="mx-auto max-w-7xl px-4 py-6"><Notice r={m}/><SportsNotice r={f}/>
{feat&&<Link href={`/title/movie/${feat.id}`} className="block rounded-lg bg-gradient-to-r from-red-900 to-zinc-900 p-8 sm:p-14"><p className="text-sm text-white/70">Featured movie</p><h1 className="mt-2 text-4xl font-black sm:text-6xl">{feat.title}</h1><p className="mt-3 line-clamp-3 max-w-xl text-white/80">{feat.overview}</p></Link>}
<Row title="Live Now">{all.filter(x=>x.status==='live').map(x=><MatchCard key={x.id} m={x}/>)}{!all.some(x=>x.status==='live')&&<p className="text-white/70">Nothing is live right now.</p>}</Row>
<Row title="Football">{f.matches.filter(x=>x.status!=='live').map(x=><MatchCard key={x.id} m={x}/>)}</Row>
<Row title="Basketball">{b.matches.filter(x=>x.status!=='live').map(x=><MatchCard key={x.id} m={x}/>)}</Row>
<Row title="Trending Movies">{m.items.map(i=><Card key={i.id} i={i}/>)}</Row>
<Row title="Popular TV Shows">{t.items.map(i=><Card key={i.id} i={i}/>)}</Row>
{cont.length>0&&<Row title="Continue Watching">{cont.map(i=><Card key={i.type+i.id} i={i}/>)}</Row>}</main>}
