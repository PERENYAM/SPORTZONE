import{getTrending}from'@/lib/data';import{Card,Page,Notice}from'../ui';
export default async function P(){const r=await getTrending('movie');return<Page title="Movies"><Notice r={r}/><div className="flex flex-wrap gap-4">{r.items.map(i=><Card key={i.id} i={i}/>)}</div></Page>}
