const webpush = require('web-push');
const {SUPABASE_URL,SUPABASE_SECRET_KEY,VAPID_PRIVATE_KEY,VAPID_PUBLIC_KEY,VAPID_CONTACT,SLOT,TEST_PUSH}=process.env;
if(!SUPABASE_URL||!SUPABASE_SECRET_KEY||!VAPID_PRIVATE_KEY||!VAPID_PUBLIC_KEY)throw Error('Faltan secretos de GitHub Actions');
webpush.setVapidDetails(VAPID_CONTACT||'mailto:admin@example.org',VAPID_PUBLIC_KEY,VAPID_PRIVATE_KEY);
// Mensajes deliberadamente discretos para evitar exposición de medicación/presión en la pantalla bloqueada.
const slots={
 '30 2 * * *':['Revisa tus medidas de bienestar'],
 '0 6 * * *':['Es hora de desayunar','Revisa tu rutina de la mañana'],
 '30 9 * * *':['Tu primera merienda'],
 '30 12 * * *':['Es hora de almorzar'],
 '30 15 * * *':['Tu segunda merienda'],
 '30 18 * * *':['Revisa tus medidas de bienestar'],
 '0 19 * * *':['Es hora de tu cena ligera']
};
const jobs=TEST_PUSH==='true'?['Notificación de prueba de Mi Salud Diario']:slots[SLOT];
if(!jobs)throw Error('Horario de workflow desconocido: '+JSON.stringify(SLOT));
async function main(){const root=SUPABASE_URL.replace(/\/$/,'');if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(root))throw Error('URL de Supabase inválida');
let offset=0,done=0,fail=0;
while(true){const response=await fetch(`${root}/rest/v1/reminder_subscriptions?select=id,endpoint,p256dh,auth_key&enabled=eq.true&limit=500&offset=${offset}`,{headers:{apikey:SUPABASE_SECRET_KEY}});
if(!response.ok)throw Error('No se pudieron leer suscripciones. HTTP '+response.status);
const subs=await response.json();for(const sub of subs){for(const [j,content] of jobs.entries()){try{await webpush.sendNotification({endpoint:sub.endpoint,keys:{p256dh:sub.p256dh,auth:sub.auth_key}},JSON.stringify({title:'Mi Salud Diario',body:content,tag:`msd-${SLOT||'test'}-${j}`}),{TTL:3600});done++}catch(e){fail++;if(e.statusCode===404||e.statusCode===410){await fetch(`${root}/rest/v1/reminder_subscriptions?id=eq.${sub.id}`,{method:'DELETE',headers:{apikey:SUPABASE_SECRET_KEY}})}else console.warn('Fallo enviando una notificación:',e.statusCode||'error')}}}
if(subs.length<500)break;offset+=subs.length;}
console.log(`Envíos aceptados: ${done}; fallidos: ${fail}. Los avisos pueden retrasarse según GitHub/Apple.`)}
main().catch(e=>{console.error(e.message);process.exitCode=1});
