import{DEMO_MATCHES,type Match}from'../data';import{footballMatches}from'./football';import{basketballMatches}from'./basketball';
export type SportsResult={matches:Match[];source:'api'|'demo';error?:string;updatedAt:string;every:number};
export async function getMatches(sport:'football'|'basketball'):Promise<SportsResult>{
const key=process.env.SPORTS_API_KEY,every=Number(process.env.SPORTS_REVALIDATE_SECONDS)||1800,updatedAt=new Date().toISOString();
if(!key)return{matches:DEMO_MATCHES.filter(m=>m.sport===sport),source:'demo',updatedAt,every};
try{return{matches:await(sport==='football'?footballMatches:basketballMatches)(key,every),source:'api',updatedAt,every}}
catch(e){return{matches:[],source:'api',error:(e as Error).message,updatedAt,every}}}
