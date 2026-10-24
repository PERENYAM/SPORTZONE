import{Pool}from'pg';
const g=globalThis as unknown as{pool?:Pool;ready?:Promise<unknown>};
const SCHEMA=`create table if not exists users(id serial primary key,email text unique not null,name text not null,password_hash text not null,created_at timestamptz default now());
create table if not exists watchlist(user_id int references users(id) on delete cascade,type text,item_id text,title text not null,poster text,year text,primary key(user_id,type,item_id));
create table if not exists history(user_id int references users(id) on delete cascade,type text,item_id text,title text not null,poster text,position real not null,duration real,updated_at timestamptz default now(),primary key(user_id,type,item_id));`;
export async function q<T=Record<string,unknown>>(sql:string,p:unknown[]=[]):Promise<T[]>{
if(!process.env.DATABASE_URL)throw new Error('DATABASE_URL is not set');
const pool=(g.pool??=new Pool({connectionString:process.env.DATABASE_URL}));
g.ready??=pool.query(SCHEMA);await g.ready;return(await pool.query(sql,p)).rows as T[];}
