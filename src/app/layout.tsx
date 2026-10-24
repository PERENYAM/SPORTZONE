import'./globals.css';import Link from'next/link';import type{Metadata}from'next';import{getUser}from'@/lib/auth';import{LogoutButton}from'./client';
export const metadata:Metadata={title:'StreamZone',description:'Sports fixtures, movies and TV shows in one place.'};
const L=[['/live','Live Sports'],['/football','Football'],['/basketball','Basketball'],['/movies','Movies'],['/tv','TV Shows'],['/my-list','My List'],['/search','Search']];
export default async function Root({children}:{children:React.ReactNode}){const u=await getUser();return<html lang="en"><body className="min-h-screen bg-[#0a0a0f] text-white">
<header className="sticky top-0 z-20 border-b border-white/10 bg-black/80 backdrop-blur"><nav aria-label="Main" className="mx-auto flex max-w-7xl items-center gap-5 overflow-x-auto px-4 py-3 text-sm">
<Link href="/" className="whitespace-nowrap text-xl font-black text-red-500">▶ STREAM<span className="text-white">ZONE</span></Link>
{L.map(([h,t])=><Link key={h} href={h} className="whitespace-nowrap text-white/80 hover:text-white">{t}</Link>)}{u?<><span className="whitespace-nowrap text-white/60">Hi, {u.name}</span><LogoutButton/></>:<Link href="/login" className="whitespace-nowrap rounded bg-red-600 px-3 py-1 font-semibold">Log in</Link>}</nav></header>
{children}
<footer className="mt-16 border-t border-white/10 p-6 text-center text-xs text-white/50">StreamZone. This product uses the TMDB API but is not endorsed or certified by TMDB.</footer></body></html>}
