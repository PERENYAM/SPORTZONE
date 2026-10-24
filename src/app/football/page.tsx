import{getMatches}from'@/lib/api/sports';import{Board,Page,SportsNotice}from'../ui';
export default async function P(){const r=await getMatches('football');return<Page title="Football"><SportsNotice r={r}/><Board r={r}/></Page>}
