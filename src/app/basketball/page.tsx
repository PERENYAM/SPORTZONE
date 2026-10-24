import{getMatches}from'@/lib/api/sports';import{Board,Page,SportsNotice}from'../ui';
export default async function P(){const r=await getMatches('basketball');return<Page title="Basketball"><SportsNotice r={r}/><Board r={r}/></Page>}
