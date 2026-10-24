// Only plays https URLs you list in AUTHORIZED_SOURCES (streams you have the rights to serve).
export function getSource(type:string,id:string):string|null{
try{const u=JSON.parse(process.env.AUTHORIZED_SOURCES||'{}')[`${type}:${id}`];return typeof u==='string'&&u.startsWith('https://')?u:null}catch{return null}}
