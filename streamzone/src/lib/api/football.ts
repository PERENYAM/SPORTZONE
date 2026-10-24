/* eslint-disable @typescript-eslint/no-explicit-any */
import{apiGet}from'./http';import type{Match}from'../data';
const LEAGUES=[39,2,140,78,135,61,1,4,5];
const LIVE=['1H','HT','2H','ET','BT','P','LIVE'],DONE=['FT','AET','PEN'];
export async function footballMatches(key:string,rev:number):Promise<Match[]>{
const d=new Date().toISOString().slice(0,10);
const r=await apiGet('https://v3.football.api-sports.io',`/fixtures?date=${d}`,key,rev);
return r.filter((x:any)=>LEAGUES.includes(x.league.id)).map((x:any)=>{const s=x.fixture.status.short;return{id:'f'+x.fixture.id,sport:'football',league:x.league.name,home:x.teams.home.name,away:x.teams.away.name,homeLogo:x.teams.home.logo,awayLogo:x.teams.away.logo,homeScore:x.goals.home,awayScore:x.goals.away,
status:LIVE.includes(s)?'live':DONE.includes(s)?'finished':s==='NS'||s==='TBD'?'upcoming':'other',label:s==='HT'?'Half-time':x.fixture.status.elapsed?`${x.fixture.status.elapsed}'`:x.fixture.status.long,kickoff:x.fixture.date} as Match})}
