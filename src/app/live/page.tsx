import{getMatches}from'@/lib/api/sports';import{Board,Page,SportsNotice}from'../ui';
export default async function P(){const[f,b]=await Promise.all([getMatches('football'),getMatches('basketball')]);
const r={...f,matches:[...f.matches,...b.matches].filter(m=>m.status==='live'||m.demo),error:f.error||b.error};
return<Page title="Live Sports"><SportsNotice r={r}/>{!r.error&&r.source==='api'&&!r.matches.length?<p className="text-white/70">Nothing is live right now. Check Football and Basketball for fixtures.</p>:<Board r={r}/>}</Page>}
