import Link from'next/link';import type{Item,Match,Result}from'@/lib/data';import{LocalTime}from'./client';import type{SportsResult}from'@/lib/api/sports';
export function Card({i}:{i:Item}){return<Link href={`/title/${i.type}/${i.id}`} className="group block w-40 shrink-0">
<div className="grid aspect-[2/3] place-items-center overflow-hidden rounded bg-gradient-to-br from-zinc-800 to-red-950 p-2 text-center text-sm">
{i.poster?<img src={i.poster} alt={i.title} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105"/>:i.title}</div>
<p className="mt-2 truncate text-sm">{i.title}</p><p className="text-xs text-white/50">{i.year}</p></Link>}
const Team=({n,l,s}:{n:string;l?:string;s?:number|null})=><div className="mt-1 flex items-center gap-2">{l&&<img src={l} alt="" className="h-6 w-6 object-contain"/>}<span className="flex-1 truncate font-semibold">{n}</span>{s!=null&&<span className="font-bold">{s}</span>}</div>;
export function MatchCard({m}:{m:Match}) {
  const live = m.status === 'live' && !m.demo;

  const card = (
    <div className="w-64 shrink-0 rounded border border-white/10 bg-white/5 p-4">
      {m.demo ? (
        <p className="text-xs text-amber-400">Demo data, not a real match</p>
      ) : (
        <p className={`text-xs ${live ? 'font-bold text-red-500' : 'text-white/60'}`}>
          {live ? `LIVE ${m.label ?? ''}` : m.status === 'finished' ? 'Full time' : m.status === 'upcoming' ? 'Upcoming' : m.label}
        </p>
      )}

      <Team n={m.home} l={m.homeLogo} s={m.homeScore} />
      <Team n={m.away} l={m.awayLogo} s={m.awayScore} />

      <p className="mt-2 text-xs text-white/60">
        {m.league}: <LocalTime iso={m.kickoff} />
      </p>

      {m.detail && (
        <p className="text-xs text-white/60">{m.detail}</p>
      )}

      {m.matchUrl && (
        <p className="mt-3 text-xs text-amber-400">View match ↗</p>
      )}
    </div>
  );

  return m.matchUrl ? (
    <a
      href={m.matchUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block transition hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-amber-400"
    >
      {card}
    </a>
  ) : card;
}
export function SportsNotice({r}:{r:SportsResult}) {
  return r.error ? (
    <p
      role="alert"
      className="mb-3 rounded bg-red-900/50 p-3 text-sm"
    >
      Could not load sports data: {r.error}
    </p>
  ) : (
    <p className="mb-3 text-xs text-white/50">
      Sports data powered by{' '}
      <a
        href="https://sportscore.com"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-white"
      >
        SportScore
      </a>
      . Refreshes approximately every {Math.round(r.every / 60)} minutes.
    </p>
  );
}
export function Board({r}:{r:SportsResult}){const S=[['live','Live now'],['upcoming','Upcoming'],['finished','Results'],['other','Postponed or other']] as const;
if(!r.error&&!r.matches.length)return<p className="text-white/70">No matches found for today in the supported competitions.</p>;
return<>{S.map(([k,t])=>{const l=r.matches.filter(m=>m.status===k);return l.length?<Row key={k} title={t}>{l.map(m=><MatchCard key={m.id} m={m}/>)}</Row>:null})}</>}
export function Row({title,children}:{title:string;children:React.ReactNode}){return<section className="mt-10"><h2 className="mb-3 text-xl font-bold">{title}</h2><div className="flex gap-4 overflow-x-auto pb-2">{children}</div></section>}
export function Notice({r}:{r:Result}){return r.error?<p role="alert" className="mb-3 rounded bg-red-900/50 p-3 text-sm">Could not load data: {r.error}. Check your TMDB_API_KEY.</p>:r.source==='demo'?<p className="mb-3 text-sm text-amber-400">Demo mode: add TMDB_API_KEY to see real titles.</p>:null}
export const Page=({title,children}:{title:string;children:React.ReactNode})=><main className="mx-auto max-w-7xl px-4 py-8"><h1 className="mb-6 text-3xl font-black">{title}</h1>{children}</main>;
