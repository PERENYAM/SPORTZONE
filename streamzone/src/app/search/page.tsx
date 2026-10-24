import{searchItems,DEMO_MATCHES}from'@/lib/data';import{Card,MatchCard,Page,Notice}from'../ui';
export default async function P({searchParams}:{searchParams:{q?:string}}){const q=(searchParams.q??'').trim().slice(0,80);
const r=q?await searchItems(q):null;const ms=q?DEMO_MATCHES.filter(m=>(m.home+m.away+m.league).toLowerCase().includes(q.toLowerCase())):[];
return<Page title="Search"><form className="mb-6 flex gap-2"><input name="q" defaultValue={q} aria-label="Search" placeholder="Movies, shows, teams" className="w-full max-w-md rounded bg-white/10 px-3 py-2"/><button className="rounded bg-red-600 px-4 font-semibold">Search</button></form>
{r&&<Notice r={r}/>}{q&&!r?.items.length&&!ms.length&&<p className="text-white/70">No results for “{q}”. Try a different title or team name.</p>}
<div className="flex flex-wrap gap-4">{r?.items.map(i=><Card key={i.id} i={i}/>)}{ms.map(m=><MatchCard key={m.id} m={m}/>)}</div></Page>}
