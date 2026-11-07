/* Mi Salud Diario 1.2 — recetas y compras. No contiene credenciales. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const DAYS=['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
const COOKED=/pollo|pescado|salmón|bistec|carne de res|arroz|frijol|lenteja|batata/i;
const RAW=/avena/i;
function ingredientNote(name){if(/leche|caldo/i.test(name))return 'Volumen medido en ml';if(RAW.test(name))return 'Pesar en seco';if(COOKED.test(name))return 'Peso después de cocinar';if(/huevo/i.test(name))return 'Sin cáscara';return 'Peso de la porción comestible';}
const instructions={
 huevos:['Lava y corta el tomate y la fruta.','Bate los huevos y cocínalos en sartén antiadherente a fuego medio, sin añadir sal; usa una pequeña cantidad de agua si hace falta.','Tuesta el pan. Sirve los huevos con el tomate, la fruta y la leche.'],
 avena:['Pesa la avena seca antes de cocinar.','Calienta la leche y añade la avena; cocina a fuego suave 5–7 minutos, removiendo.','Añade la fruta o canela al servir. Hierve los huevos aparte cuando estén incluidos.'],
 avena_fresas:['Lava y prepara la fruta indicada.','Mide la porción de frutos secos, yogur o avena según el menú.','Sirve en un recipiente para llevar. Si contiene yogur, consérvalo refrigerado.'],
 sandwich:['Cocina los huevos en sartén antiadherente o hiérvelos.','Tuesta el pan si lo deseas; corta el tomate y agrega el aguacate si corresponde.','Arma el sándwich y acompaña con la fruta, yogur o leche incluidos en el menú.'],
 pollo_arroz:['Sazona el pollo con ajo, limón, orégano y pimienta, sin cubitos de caldo ni sal añadida.','Cocina el pollo a la plancha hasta que alcance 74 °C (165 °F) en el centro.','Cuece arroz y frijoles por separado con condimentos sin sal.','Sirve las porciones ya cocinadas junto a la ensalada y el aceite indicados.'],
 res_arroz:['Sazona la carne magra con ajo, limón y pimienta, sin sal añadida.','Cocina la carne a la plancha hasta el punto seguro adecuado al corte.','Cuece arroz y frijoles; escurre los frijoles de lata y enjuágalos si corresponde.','Acompaña con vegetales y mide el aceite antes de agregarlo.'],
 salmon:['Precalienta el horno a 200 °C (400 °F).','Coloca el salmón con limón, ajo y hierbas; hornea hasta estar bien cocido (referencia de seguridad: 63 °C / 145 °F).','Asa la batata, cocina el arroz y prepara el brócoli al vapor.','Pesa las porciones cocinadas y sirve con el aceite indicado.'],
 pollo_asado:['Sazona el pollo con jugo de limón, ajo, comino y orégano, evitando sazones comerciales salados.','Asa u hornea el pollo hasta 74 °C (165 °F) en el centro.','Prepara el arroz y los frijoles; asa o corta los vegetales.','Mide las porciones ya cocinadas y añade el aceite a la ensalada.'],
 sopa:['Lava y corta las verduras; mide la cantidad cruda indicada.','Cocina las verduras en caldo casero sin sal añadida hasta que estén suaves.','Añade el pollo previamente cocinado y desmenuzado, y calienta completamente.','Sirve una porción pequeña; acompaña con pan solo cuando esté indicado.'],
 wrap:['Calienta ligeramente la tortilla integral en sartén.','Mezcla el pollo ya cocinado y desmenuzado con lechuga y pepino.','Agrega el yogur natural como aderezo y enrolla la tortilla.','No agregues embutidos ni salsas altas en sodio.'],
 tortilla:['Lava y corta los vegetales; saltéalos suavemente con el aceite indicado.','Bate los huevos y claras que figuran en la receta.','Añade la mezcla y cocina a fuego medio hasta cuajar completamente.','Sirve con la porción de pan o ensalada indicada.'],
 pescado:['Condimenta el pescado con limón, ajo y hierbas sin sal.','Cocina a la plancha u horno hasta 63 °C (145 °F) o hasta que esté opaco y se desmenuce con facilidad.','Lava los vegetales y prepara la ensalada.','Sirve con el pan y aceite en las cantidades indicadas.']
};
function recipeTitle(m){const main=m[3].slice(0,2).map(x=>x[0].toLowerCase());if(m[1].includes('Merienda'))return 'Merienda de '+main.join(' y ');return ({huevos:'Huevos con tostadas y frutas',avena:'Avena cremosa con acompañamientos',sandwich:'Sándwich integral saludable',pollo_arroz:'Pollo a la plancha con arroz',res_arroz:'Bistec magro con arroz',salmon:'Salmón al horno con batata',pollo_asado:'Pollo asado casero',sopa:'Sopa ligera de pollo y vegetales',wrap:'Wrap integral de pollo',tortilla:'Tortilla de vegetales',pescado:'Pescado a la plancha con ensalada'})[m[2]]||m[1];}
function openRecipe(day,index){const m=WEEK[day].meals[index],modal=$('recipeDialog');$('recipePic').src='assets/'+m[2]+'.webp';$('recipePic').alt='Imagen ilustrativa de '+recipeTitle(m);$('recipeTitle').textContent=recipeTitle(m);$('recipeSub').textContent=`${DAYS[day]} · ${m[1]} · ${m[0]} · Porción para una persona`;
$('recipeIngredients').innerHTML=m[3].map(a=>`<li><span>${escapeHTML(a[0])}<small>${escapeHTML(ingredientNote(a[0]))}</small></span><b>${escapeHTML(a[1])}</b></li>`).join('');$('recipeSteps').innerHTML=(instructions[m[2]]||['Prepara todos los ingredientes con los gramajes indicados.']).map(t=>`<li>${escapeHTML(t)}</li>`).join('');$('recipeTip').textContent=m[1]==='Cena ligera'?'Cena pequeña: prepara los ingredientes con poca grasa y, si puedes, deja tiempo antes de acostarte.':'Condimenta sin exceso de sal; los ingredientes y gramajes corresponden al plan semanal.';
if(modal.showModal)modal.showModal();else modal.setAttribute('open','');}
$('mealList').addEventListener('click',e=>{const b=e.target.closest('[data-recipe]');if(!b)return;openRecipe(Number($('daySelect').value),Number(b.dataset.recipe))});$('mealList').addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-recipe]')){e.preventDefault();openRecipe(Number($('daySelect').value),Number(e.target.dataset.recipe));}});
$('closeRecipe').addEventListener('click',()=>$('recipeDialog').close());
// Cantidades de compra: juntar equivalentes, y convertir desde porciones cocidas a
// cantidades aproximadas de producto crudo; los rendimientos varían según la preparación.
function mapIngredient(name,qty,unit){let n=name.toLowerCase(),category='Otros',key=name, factor=1, tip='';
if(/pechuga|pollo asado|pollo desmenuzado/.test(n)){key='Pollo fresco sin hueso';category='Proteínas';factor=1/0.75;tip='Estimación en crudo';}
else if(/pescado blanco/.test(n)){key='Pescado blanco';category='Proteínas';factor=1/0.8;tip='Estimación en crudo';}
else if(/salmón/.test(n)){key='Salmón';category='Proteínas';factor=1/0.8;tip='Estimación en crudo';}
else if(/bistec|carne de res/.test(n)){key='Carne de res magra';category='Proteínas';factor=1/0.75;tip='Estimación en crudo';}
else if(/huevo|claras/.test(n)){key=/claras/.test(n)?'Claras de huevo':'Huevos';category='Proteínas';factor=1;tip='Sin cáscara';}
else if(/yogur griego/.test(n)){key='Yogur griego natural';category='Lácteos';}
else if(/yogur/.test(n)){key='Yogur natural bajo en grasa';category='Lácteos';}
else if(/leche/.test(n)){key='Leche descremada';category='Lácteos';}
else if(/arroz integral/.test(n)){key='Arroz integral seco';category='Cereales y legumbres';factor=1/2.8;tip='Aprox. peso seco';}
else if(/arroz blanco/.test(n)){key='Arroz blanco seco';category='Cereales y legumbres';factor=1/2.8;tip='Aprox. peso seco';}
else if(/frijoles negros/.test(n)){key='Frijoles negros secos';category='Cereales y legumbres';factor=1/2.5;tip='O comprar cocidos sin sal';}
else if(/lentejas/.test(n)){key='Lentejas secas';category='Cereales y legumbres';factor=1/2.5;tip='Aprox. peso seco';}
else if(/avena/.test(n)){key='Avena seca';category='Cereales y legumbres';}
else if(/tortilla integral/.test(n)){key='Tortillas integrales bajas en sodio';category='Cereales y legumbres';}
else if(/pan integral/.test(n)){key='Pan integral bajo en sodio';category='Cereales y legumbres';}
else if(/almendras/.test(n)){key='Almendras sin sal';category='Frutos secos y grasas';}
else if(/nueces/.test(n)){key='Nueces sin sal';category='Frutos secos y grasas';}
else if(/mantequilla de maní/.test(n)){key='Mantequilla de maní sin sal';category='Frutos secos y grasas';}
else if(/aceite de oliva/.test(n)){key='Aceite de oliva';category='Frutos secos y grasas';}
else if(/manzana/.test(n)){key='Manzanas';category='Frutas';}
else if(/pera/.test(n)){key='Peras';category='Frutas';}
else if(/banana/.test(n)){key='Bananas';category='Frutas';}
else if(/naranja/.test(n)){key='Naranjas';category='Frutas';}
else if(/fresas/.test(n)){key='Fresas';category='Frutas';}
else if(/arándanos/.test(n)){key='Arándanos';category='Frutas';}
else if(/fruta/.test(n)){key='Frutas variadas';category='Frutas';}
else if(/aguacate/.test(n)){key='Aguacate';category='Frutas';}
else if(/caldo/.test(n)){key='Caldo casero sin sal';category='Otros';}
else if(/batata/.test(n)){key='Batatas';category='Vegetales y viandas';factor=1/0.85;tip='Aprox. crudo';}
else if(/brócoli/.test(n)){key='Brócoli';category='Vegetales y viandas';}
else if(/espinacas/.test(n)){key='Espinacas y champiñones';category='Vegetales y viandas';}
else if(/calabacín y cebolla/.test(n)){key='Calabacín y cebolla';category='Vegetales y viandas';}
else if(/calabacín|zanahoria/.test(n)){key=/calabacín y zanahoria|zanahoria y calabacín/.test(n)?'Calabacín y zanahoria (mezcla)':/calabacín/.test(n)?'Calabacín':'Zanahoria';category='Vegetales y viandas';}
else if(/tomate/.test(n)&&/pepino/.test(n)){key='Pepino y tomate (mezcla)';category='Vegetales y viandas';}
else if(/lechuga y pepino/.test(n)){key='Lechuga y pepino (mezcla)';category='Vegetales y viandas';}
else if(/tomate/.test(n)){key='Tomate';category='Vegetales y viandas';}
else if(/ensalada|vegetales/.test(n)){key='Vegetales variados para ensalada / asar';category='Vegetales y viandas';}
return {key,category,qty:qty*factor,unit,tip};}
function buildShopping(){let m=new Map();for(const day of WEEK)for(const meal of day.meals)for(const [name,q] of meal[3]){let match=String(q).match(/([\d.]+)\s*(g|ml)/i);if(!match)continue;let item=mapIngredient(name,Number(match[1]),match[2].toLowerCase()),id=item.category+'|'+item.key+'|'+item.unit;let prev=m.get(id);if(prev)prev.qty+=item.qty;else m.set(id,{...item,id});}return [...m.values()].map(x=>({...x,qty:Math.ceil(x.qty/5)*5})).sort((a,b)=>a.category.localeCompare(b.category,'es')||a.key.localeCompare(b.key,'es'));}
const groceries=buildShopping();const monday=()=>{let d=new Date(),offset=(d.getDay()+6)%7;d.setDate(d.getDate()-offset);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
function keyFor(x){return `shopping:${monday()}:${encodeURIComponent(x.id)}`;}
function checked(x){return !!window.MSD?.getRecords?.()[keyFor(x)]?.data?.checked && !window.MSD?.getRecords?.()[keyFor(x)]?.deleted;}
function renderShopping(){const n=groceries.filter(checked).length;$('shoppingCount').textContent=`${n} de ${groceries.length} comprados`;$('shoppingProgress').style.width=(groceries.length?100*n/groceries.length:0)+'%';const categories=[...new Set(groceries.map(x=>x.category))];$('shoppingList').innerHTML=categories.map(c=>`<section class="shop-group"><h3>${escapeHTML(c)}</h3>${groceries.filter(x=>x.category===c).map(x=>`<label class="shop-item"><input type="checkbox" data-shop="${escapeHTML(x.id)}" ${checked(x)?'checked':''}><span class="shop-name">${escapeHTML(x.key)}${x.tip?`<small>${escapeHTML(x.tip)}</small>`:''}</span><b>${escapeHTML(String(x.qty))} ${escapeHTML(x.unit)}</b></label>`).join('')}</section>`).join('');}
$('shoppingList').addEventListener('change',e=>{const cb=e.target.closest('[data-shop]');if(!cb)return;const item=groceries.find(x=>x.id===cb.dataset.shop);if(!item)return;window.MSD.saveRecord(keyFor(item),{checked:cb.checked,week:monday(),item:item.key});renderShopping()});
function shoppingText(){return 'MI SALUD DIARIO · LISTA DE COMPRAS SEMANAL\nSemana del '+monday()+'\nPara 1 persona · Cantidades aproximadas\n\n'+[...new Set(groceries.map(x=>x.category))].map(c=>c+'\n'+groceries.filter(x=>x.category===c).map(x=>`${checked(x)?'☑':'☐'} ${x.key}: ${x.qty} ${x.unit}${x.tip?' ('+x.tip+')':''}`).join('\n')).join('\n\n')+'\n\nLas cantidades compradas son estimaciones; el menú incluye pesos cocidos. Ajusta por mermas, tamaños de envases y productos que ya tienes.'}
$('copyShopping').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(shoppingText());$('shoppingMessage').textContent='Lista copiada. Puedes pegarla en Notas o enviarla.';}catch{$('shoppingMessage').textContent='No se pudo copiar automáticamente. Prueba desde Safari por HTTPS.';}});
$('printShopping').addEventListener('click',()=>window.print());
$('resetShopping').addEventListener('click',()=>{if(!confirm('¿Desmarcar toda la lista de esta semana?'))return;groceries.forEach(x=>window.MSD.saveRecord(keyFor(x),{checked:false,week:monday(),item:x.key}));renderShopping()});
window.addEventListener('msd-records-changed',renderShopping);document.querySelector('[data-tab="compras"]')?.addEventListener('click',renderShopping);renderShopping();
})();
