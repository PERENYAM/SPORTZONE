import{MyList}from'../client';import{Page}from'../ui';import{getUser}from'@/lib/auth';
export default async function P(){return<Page title="My List"><MyList auth={!!await getUser()}/></Page>}
