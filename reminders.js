(()=>{'use strict';
const $=id=>document.getElementById(id), pub=window.MSD_VAPID_PUBLIC_KEY;
const reminders=[['02:30','Medir presión y pulsaciones'],['06:00','Desayuno'],['06:00','Losartán 25 mg'],['09:30','Primera merienda'],['12:30','Almuerzo'],['15:30','Segunda merienda'],['18:30','Medir presión y pulsaciones'],['19:00','Cena ligera']];
const base64ToBytes=x=>{const b=atob((x+'='.repeat((4-x.length%4)%4)).replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from(b,c=>c.charCodeAt(0))};
const isHomeScreen=()=>window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
const message=t=>{$('pushStatus').textContent=t};
const esc=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
$('reminderList').innerHTML=reminders.map(([time,name])=>`<div class="reminder-row"><span class="reminder-clock">${time}</span><span>${esc(name)}</span></div>`).join('');
function alertInApp(text){const n=document.getElementById('toast');n.textContent='🔔 '+text;n.classList.add('visible');setTimeout(()=>n.classList.remove('visible'),5500)}
$('testLocalAlert').addEventListener('click',()=>alertInApp('Aviso de prueba: solo con la aplicación abierta'));
function checkInApp(){if(document.hidden)return;const now=new Date(),hh=`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`,key=`msd_notice_${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}_${hh}`;
const matches=reminders.filter(x=>x[0]===hh);if(matches.length&&!sessionStorage.getItem(key)){sessionStorage.setItem(key,'1');alertInApp(matches.map(x=>x[1]).join(' y '))}}
setInterval(checkInApp,15000);checkInApp();
async function subscription(){const reg=await navigator.serviceWorker.ready;return reg.pushManager.getSubscription()}
async function updateStatus(){if(!('serviceWorker' in navigator)||!('PushManager' in window)||!('Notification' in window)){message('Este navegador no admite notificaciones push. Aún funcionan los avisos mientras la app está abierta.');return}
if(/iPad|iPhone|iPod/.test(navigator.userAgent)&&!isHomeScreen()){message('En iPhone abre Mi Salud Diario desde el ícono de la pantalla de inicio, no desde una pestaña de Safari.');return}
if(Notification.permission==='denied'){message('Permiso denegado. Revisa Ajustes > Notificaciones > Mi Salud Diario en tu iPhone.');return}
try{const s=await subscription();message(s?'✓ Este dispositivo tiene push activado. Los avisos externos requieren que GitHub Actions y Supabase estén configurados.':'Push disponible pero no activado en este dispositivo.');}catch(e){message('No se pudo comprobar push: '+e.message)}}
$('enablePush').addEventListener('click',async()=>{const client=window.MSD?.getClient(),user=window.MSD?.getUser();if(!client||!user){message('Primero inicia sesión en Ajustes > Sincronización privada.');return}
if(!('serviceWorker' in navigator)||!('PushManager' in window)||!('Notification' in window)){message('Push no está disponible en este navegador.');return}
if(/iPad|iPhone|iPod/.test(navigator.userAgent)&&!isHomeScreen()){message('Abre la app desde el ícono de inicio de tu iPhone.');return}
try{const permission=await Notification.requestPermission();if(permission!=='granted'){message('No se autorizó el permiso para notificaciones.');return}
message('Registrando dispositivo…');const reg=await navigator.serviceWorker.ready;let sub=await reg.pushManager.getSubscription();if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:base64ToBytes(pub)});
const value=sub.toJSON(),{error}=await client.from('reminder_subscriptions').upsert({user_id:user.id,endpoint:value.endpoint,p256dh:value.keys.p256dh,auth_key:value.keys.auth,enabled:true},{onConflict:'endpoint'});
if(error)throw error;message('✓ Dispositivo registrado. Falta verificar el envío programado desde GitHub Actions.');}catch(e){message('No se pudo activar: '+e.message)}});
$('disablePush').addEventListener('click',async()=>{const client=window.MSD?.getClient(),user=window.MSD?.getUser();if(!client||!user){message('Inicia sesión primero para desactivar la suscripción en la nube.');return}try{const sub=await subscription();if(sub){const {error}=await client.from('reminder_subscriptions').delete().eq('user_id',user.id).eq('endpoint',sub.endpoint);if(error)throw error;await sub.unsubscribe()};message('Notificaciones desactivadas en este dispositivo.')}catch(e){message('Error al desactivar: '+e.message)}});
window.addEventListener('msd-auth-changed',()=>setTimeout(updateStatus,100));updateStatus();
})();
