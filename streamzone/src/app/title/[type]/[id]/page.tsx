import{notFound}from'next/navigation';import{getItem}from'@/lib/data';import{getSource}from'@/lib/api/streaming';import{getUser}from'@/lib/auth';import{WatchButton}from'../../../client';import Player from'../../../Player';import{Page}from'../../../ui';
export default async function P({params}:{params:{type:string;id:string}}){
if(params.type!=='movie'&&params.type!=='tv')notFound();const i=await getItem(params.type,params.id);if(!i)notFound();
const src=getSource(i.type,i.id),auth=!!await getUser();
return<Page title={i.title}><p className="text-white/60">{i.year}{i.rating?`, rated ${i.rating}`:''}</p><p className="my-4 max-w-2xl">{i.overview||'No description available.'}</p>
{src?<Player src={src} type={i.type} id={i.id} title={i.title} poster={i.poster} auth={auth}/>:<div className="mb-4 flex aspect-video max-w-2xl items-center justify-center rounded bg-zinc-900 p-4 text-center text-white/70">No authorized video source is configured for this title.</div>}<WatchButton item={i} auth={auth}/></Page>}
