export type Item={id:string;type:'movie'|'tv';title:string;year:string;overview:string;poster:string|null;rating:number|null};
export type Match={id:string;sport:'football'|'basketball';league:string;home:string;away:string;kickoff:string;status:'live'|'upcoming'|'finished'|'other';label?:string;detail?:string;homeLogo?:string;awayLogo?:string;homeScore?:number|null;awayScore?:number|null;matchUrl?:string;demo?:boolean};
export type Result={items:Item[];source:'tmdb'|'demo';error?:string};
const KEY=process.env.TMDB_API_KEY;
const T=(t:'movie'|'tv',n:string[]):Item[]=>n.map((title,i)=>({id:`demo-${t}-${i}`,type:t,title:title+' (demo)',year:String(2020+(i%5)),overview:'Sample description shown because no TMDB_API_KEY is configured.',poster:null,rating:null}));
const DEMO={movie:T('movie',['Midnight Harbor','The Last Lighthouse','Paper Cities','Redline','Quiet Orbit','Salt & Iron']),tv:T('tv',['Northern Shift','The Archive','Glass Houses','Deep Field','Ember Street','Tidewater'])};
const d=(h:number)=>new Date(Date.now()+h*36e5).toISOString();
export const DEMO_MATCHES:Match[]=[
{id:'f1',sport:'football',league:'Demo League',home:'Riverside FC',away:'Harbor United',kickoff:d(26)},
{id:'f2',sport:'football',league:'Demo League',home:'North City',away:'Valley Rovers',kickoff:d(50)},
{id:'f3',sport:'football',league:'Demo Cup',home:'Coastal Athletic',away:'Hillside Town',kickoff:d(74)},
{id:'b1',sport:'basketball',league:'Demo Basketball',home:'Metro Hawks',away:'Bay Comets',kickoff:d(30)},
{id:'b2',sport:'basketball',league:'Demo Basketball',home:'Summit Wolves',away:'Lake Kings',kickoff:d(54)}].map(m=>({...m,status:'upcoming',demo:true}) as Match);
type Raw={id:number;title?:string;name?:string;release_date?:string;first_air_date?:string;overview?:string;poster_path?:string|null;vote_average?:number;media_type?:string};
const map=(r:Raw,t:'movie'|'tv'):Item=>({id:String(r.id),type:t,title:r.title??r.name??'Untitled',year:(r.release_date??r.first_air_date??'').slice(0,4),overview:r.overview??'',poster:r.poster_path?`https://image.tmdb.org/t/p/w342${r.poster_path}`:null,rating:r.vote_average?Math.round(r.vote_average*10)/10:null});
async function tmdb(path:string){const r=await fetch(`https://api.themoviedb.org/3${path}${path.includes('?')?'&':'?'}api_key=${KEY}`,{next:{revalidate:3600}});if(!r.ok)throw new Error(`TMDB responded ${r.status}`);return r.json();}
export async function getTrending(t:'movie'|'tv'):Promise<Result>{
if(!KEY)return{items:DEMO[t],source:'demo'};
try{const j=await tmdb(`/trending/${t}/week`);return{items:(j.results as Raw[]).map(r=>map(r,t)),source:'tmdb'};}
catch(e){return{items:[],source:'tmdb',error:(e as Error).message};}}
export async function searchItems(q:string):Promise<Result>{
if(!KEY)return{items:[...DEMO.movie,...DEMO.tv].filter(i=>i.title.toLowerCase().includes(q.toLowerCase())),source:'demo'};
try{const j=await tmdb(`/search/multi?query=${encodeURIComponent(q)}`);return{items:(j.results as Raw[]).filter(r=>r.media_type==='movie'||r.media_type==='tv').map(r=>map(r,r.media_type as 'movie'|'tv')),source:'tmdb'};}
catch(e){return{items:[],source:'tmdb',error:(e as Error).message};}}
export async function getItem(t:'movie'|'tv',id:string):Promise<Item|null>{
if(id.startsWith('demo-'))return DEMO[t].find(i=>i.id===id)??null;
if(!KEY)return null;
try{return map(await tmdb(`/${t}/${id}`),t);}catch{return null;}}
