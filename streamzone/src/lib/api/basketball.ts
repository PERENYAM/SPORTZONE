/* eslint-disable @typescript-eslint/no-explicit-any */
import{apiGet}from'./http';import type{Match}from'../data';
const LEAGUES=[12,13,120];
const LIVE=['Q1','Q2','Q3','Q4','OT','BT','HT'],DONE=['FT','AOT'];
export async function basketballMatches(key:string,rev:number):Promise<Match[]>{
const d=new Date().toISOString().slice(0,10);
const r=await apiGet('https://v1.basketball.api-sports.io',`/games?date=${d}`,key,rev);
return r.filter((x:any)=>LEAGUES.includes(x.league.id)).map((x:any)=>{const s=x.status.short,h=x.scores.home,a=x.scores.away;
const qs=[1,2,3,4].filter(n=>h[`quarter_${n}`]!=null).map(n=>`${h[`quarter_${n}`]}-${a[`quarter_${n}`]}`).join(', ');
return{id:'b'+x.id,sport:'basketball',league:x.league.name,home:x.teams.home.name,away:x.teams.away.name,homeLogo:x.teams.home.logo,awayLogo:x.teams.away.logo,homeScore:h.total,awayScore:a.total,
status:LIVE.includes(s)?'live':DONE.includes(s)?'finished':s==='NS'?'upcoming':'other',label:s==='HT'?'Half-time':s,detail:qs?`By quarter: ${qs}`:undefined,kickoff:x.date} as Match})}
