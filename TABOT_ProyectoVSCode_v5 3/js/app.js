// ═══ STATE ═══
const S={
  scenario:'rutina',name:null,isClient:null,auth:null,branch:null,
  waiting:false,caseId:null,navStack:[],curMenu:null,
  tab:'estado',history:[],started:false,pendingOTP:null,
  pendingCard:null,altVerifAttempts:0
};

// ═══ MENUS ═══
const MENUS={
  main:{
    title:'Menú principal',
    head:'¿En qué te puedo ayudar hoy?\nSelecciona una opción o escribe una palabra clave.',
    items:[
      ['🧾','Gestionar mi cuenta','Saldos, pagos, TDC, banca móvil y ubicaciones',()=>goMenu('A')],
      ['🛟','Necesito resolver algo','Bloqueos, fraude, reclamos y soporte técnico',()=>goMenu('B')],
      ['🔎','Conocer productos y servicios','Tarjetas, créditos, seguros, remesas y más',()=>goMenu('C')],
      ['💬','Hablar con un asesor','Te conecto con un agente en tiempo real',()=>advisor('general')],
      ['⚡','Ver palabras clave','Atajos directos para gestiones rápidas',()=>showKwTip(false)],
      ['🚪','Salir','Cerrar esta conversación',()=>goodbye()]
    ]
  },
  A:{
    title:'Gestionar mi cuenta',
    head:'¿Qué gestión necesitas?\nTambién puedes escribir la palabra clave directamente.',
    items:[
      ['💳','Saldo y puntos TDC','Consulta saldo disponible y puntos de tu tarjeta',()=>flowSaldo()],
      ['💸','Pagar tarjeta','Pago total, mínimo u otro monto',()=>flowPagar()],
      ['📄','Estado de cuenta TDC','Máximo los últimos 3 cortes disponibles',()=>flowEDC()],
      ['✅','Activación TDC','Activa la tarjeta que recibiste por distribuidor',()=>flowActivacion()],
      ['🔄','Reversa de membresía','Solicitud de reversa de membresía de TDC',()=>flowReversa()],
      ['✈️','Notificación de viaje','Registra destino y fechas para uso en el exterior',()=>flowViaje()],
      ['🏦','Horarios y ubicaciones','Agencias, cajeros, kioskos y corresponsales',()=>flowUbicaciones()],
      ['📱','Banca móvil y E-banca','Usuario, contraseña, clave dinámica y tutoriales',()=>flowBancaMovil()],
      ['🌐','Pagos y transferencias','Pagos en línea, moneda extranjera e internacionales',()=>flowPagos()],
      ['⬅️','Volver','Regresar al menú principal',()=>goMenu('main')]
    ]
  },
  B:{
    title:'Resolver algo',
    head:'Cuéntame qué pasó.\nSi es urgente, escribe "bloqueo TDC", "fraude" o "perdí mi tarjeta".',
    items:[
      ['🔒','Bloqueo TDC','Bloquear y reponer tu tarjeta de crédito de inmediato',()=>flowBloqueoTDC()],
      ['🧯','Bloqueo tarjeta débito','Bloquear y reponer tu tarjeta de débito',()=>flowBloqueoTDD()],
      ['❓','Cargo no reconocido','Revisar tus movimientos y reportar el cargo',()=>flowCargoRaro()],
      ['🕵️','Gestión LES','Atención especializada de fraude',()=>flowLES()],
      ['📣','Asistencia X','Seguimiento a casos, quejas o reclamos desde X',()=>flowAsistenciaX()],
      ['🔑','No puedo entrar a mi app','Recuperar acceso a banca móvil o E-banca',()=>flowBancaMovil(true)],
      ['💬','Otro problema','Conectar con asesor con todo el contexto',()=>advisor('servicio')],
      ['⬅️','Volver','Regresar al menú principal',()=>goMenu('main')]
    ]
  },
  C:{
    title:'Conocer productos',
    head:'Explora sin presión, sin necesidad de autenticarte.\nEscribe "cita" para agendar directamente.',
    items:[
      ['💳','Tarjetas','Catálogo, requisitos y solicitud con ejecutivo',()=>infoProd('Tarjetas de crédito','Conoce nuestro catálogo de tarjetas, los beneficios, tasas y requisitos de cada una. También puedes solicitar una tarjeta con un ejecutivo.')],
      ['🏦','Cuentas','Ahorro, corriente y sus beneficios',()=>infoProd('Cuentas de ahorro y corriente','Conoce las cuentas disponibles, los requisitos y los beneficios de cada tipo de cuenta.')],
      ['📈','Depósitos a plazo','Catálogo, simulador e información general',()=>infoProd('Depósitos a plazo','Opciones de inversión a plazo fijo, simulador de rendimiento y preguntas frecuentes.')],
      ['🏠','Créditos','Personal, vivienda y adelanto de salario',()=>flowCreditos()],
      ['🌎','Remesas','Cómo recibir, cobrar y canales disponibles',()=>infoProd('Remesas familiares','Formas de recibir tus remesas, cómo cobrarlas, canales disponibles, remesadoras aliadas y límites vigentes.')],
      ['🛡️','Seguros','Catálogo y solicitud con ejecutivo',()=>infoProd('Seguros','Catálogo de seguros disponibles: vida, salud, vehículo y más. Requisitos y condiciones según producto.')],
      ['🏪','Productos PYME','Tarjetas, créditos, cuentas y soluciones de pago',()=>infoProd('Productos PYME','Soluciones financieras para tu negocio: tarjetas, créditos, cuentas corrientes, leasing y soluciones de pago.')],
      ['🔁','Pagos y transferencias','Pagos digitales, moneda extranjera e internacionales',()=>flowPagos()],
      ['▣','Código QR','Solicitar QR, beneficios y soporte',()=>infoProd('Código QR Banco Agrícola','Solicitar tu código QR, ver beneficios y requisitos, aprender a pagar con QR o solicitar soporte técnico.')],
      ['📅','Agendar cita','Autogestioná tu cita en el sitio web',()=>flowCita()],
      ['💬','Hablar con ejecutivo','Derivación comercial personalizada',()=>advisor('comercial')],
      ['⬅️','Volver','Regresar al menú principal',()=>goMenu('main')]
    ]
  }
};

// ═══ KEYWORDS ═══
const KW={
  'bloqueo tdc':{label:'Bloqueo TDC',fn:()=>flowBloqueoTDC(true)},
  'bloqueo tarjeta debito':{label:'Bloqueo Débito',fn:()=>flowBloqueoTDD(true)},
  'edc tarjeta':{label:'EDC tarjeta',fn:()=>flowEDC(true)},
  'estado de cuenta':{label:'Estado de cuenta',fn:()=>flowEDC(true)},
  'reversa de membresia':{label:'Reversa de membresía',fn:()=>flowReversa(true)},
  'reversa membresia':{label:'Reversa membresía',fn:()=>flowReversa(true)},
  'viaje':{label:'Viaje',fn:()=>flowViaje(true)},
  'notificacion viaje':{label:'Notificación viaje',fn:()=>flowViaje(true)},
  'saldo tarjeta':{label:'Saldo tarjeta',fn:()=>flowSaldo(true)},
  'saldo':{label:'Saldo tarjeta',fn:()=>flowSaldo(true)},
  'activacion tdc':{label:'Activación TDC',fn:()=>flowActivacion(true)},
  'activar tarjeta':{label:'Activar TDC',fn:()=>flowActivacion(true)},
  'gestion les':{label:'Gestión LES',fn:()=>flowLES(true)},
  'asistencia x':{label:'Asistencia X',fn:()=>flowAsistenciaX(true)},
  'cita':{label:'Cita',fn:()=>flowCita(true)},
  'alerta':{label:'Alerta',fn:()=>flowAlerta(true)},
  'alerta de seguridad':{label:'Alerta',fn:()=>flowAlerta(true)}
};

const EMERGENCY=['perdi','perdí','robo','robaron','robada','fraude','urgente','auxilio','emergencia','bloquear ya','clonaron','suplantaron','extraviada','extraviado','actividad sospechosa','me hackearon','me robaron','cuenta hackeada'];
// "ALERTA" en mayúsculas → flujo de alerta inmediata (no bloqueo automático)
const ALERTA_TRIGGER=(n)=>n==='alerta'||n.startsWith('alerta ');

const GREETINGS=['hola','buenas','buen dia','buenos dias','buenas tardes','buenas noches','buen dia','que tal','hey','hi','hello','saludos','holi','holis','ola'];

const FALLBACK_MSGS=[
  'Perdona, no capté bien tu mensaje. Déjame mostrarte las opciones disponibles para orientarte mejor.',
  'Quiero ayudarte bien. ¿Alguna de estas opciones describe lo que necesitas?',
  'Mmm, quiero asegurarme de entenderte correctamente. ¿Podría ser alguna de estas opciones?',
  'No quiero adivinar y equivocarme contigo. Selecciona la que más se acerque a lo que buscas.',
  'Un momento, déjame orientarte. ¿Alguna de estas opciones refleja lo que necesitas?',
  'Puede que no interpreté bien. Estoy aquí para ayudarte, ¿es alguna de estas lo que buscas?',
  'Quiero darte la respuesta correcta. Selecciona una opción y con gusto te ayudo. 😊',
];
let _fbi=0;

const NAV={menu:()=>goMenu('main'),menú:()=>goMenu('main'),inicio:()=>goMenu('main'),principal:()=>goMenu('main'),volver:()=>goBack(),atras:()=>goBack(),atrás:()=>goBack(),regresar:()=>goBack(),anterior:()=>goBack(),asesor:()=>advisor('general'),humano:()=>advisor('general'),agente:()=>advisor('general'),ejecutivo:()=>advisor('comercial'),salir:()=>goodbye(),adios:()=>goodbye(),adiós:()=>goodbye(),gracias:()=>goodbye(),borrar:()=>startFlow(S.scenario)};

// ═══ UTILS ═══
const $=s=>document.querySelector(s);
const $$=s=>Array.from(document.querySelectorAll(s));
const chatEl=()=>$('#chat');
const inpEl=()=>$('#user-inp');

function now(){return new Date().toLocaleTimeString('es-SV',{hour:'2-digit',minute:'2-digit'})}
function esc(s){return(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function norm(s){return s.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim()}
function log(m){S.history.push('['+now()+'] '+m);if(S.history.length>120)S.history.shift();renderRight()}
function scroll(){const c=chatEl();c.scrollTop=c.scrollHeight}
function delay(ms=300){return new Promise(r=>setTimeout(r,ms))}

// ═══ DOM BUILDERS ═══
function addUser(text){
  chatEl().insertAdjacentHTML('beforeend',`<div class="row usr"><div class="bub"><div>${esc(text)}</div><div class="ts">${now()} <span class="chk">✓✓</span></div></div></div>`);
  scroll();log('USR: '+text);
}
function addBot(html){
  chatEl().insertAdjacentHTML('beforeend',`<div class="row bot"><div class="bub"><div class="sndr">Tabot</div><div>${html}</div><div class="ts">${now()}</div></div></div>`);
  scroll();log('BOT: '+html.replace(/<[^>]+>/g,' ').slice(0,80));
}
function addSys(text){
  chatEl().insertAdjacentHTML('beforeend',`<div class="sys"><span>${esc(text)}</span></div>`);
  scroll();
}
function addMini(html,type=''){
  chatEl().insertAdjacentHTML('beforeend',`<div class="row bot"><div class="mini ${type}">${html}</div></div>`);
  scroll();
}
function addQuick(btns){
  const html=btns.map(b=>`<button class="qbtn" data-action="${b.id}">${b.label}</button>`).join('');
  chatEl().insertAdjacentHTML('beforeend',`<div class="quick">${html}</div>`);
  scroll();
}
function addListCard(key){
  const m=MENUS[key];S.curMenu=key;
  chatEl().insertAdjacentHTML('beforeend',`<div class="row bot"><div class="lc"><div class="lc-head"><div class="sndr">Tabot</div><div class="lc-title">${m.title}</div><div class="lc-text">${m.head}</div><div class="ts">${now()}</div></div><div class="lc-btn" data-menu="${key}"><svg viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg> Selecciona aquí</div></div></div>`);
  scroll();log('MENÚ: '+m.title);
}
async function botMsg(html){
  chatEl().insertAdjacentHTML('beforeend',`<div class="twrap" id="ti"><div class="typing"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div></div>`);
  scroll();await delay();
  const t=$('#ti');if(t)t.remove();
  addBot(html);
}

// ═══ SHEET ═══
function openSheet(key){
  const m=MENUS[key];if(!m)return;
  $('#sh-title').textContent=m.title;
  $('#sh-list').innerHTML=m.items.map((it,i)=>`<div class="sh-item" data-menu="${key}" data-idx="${i}"><div class="si-ico">${it[0]}</div><div><div class="si-name">${it[1]}</div><div class="si-desc">${it[2]}</div></div><div class="radio"></div></div>`).join('');
  $('#sheet-bg').classList.add('open');
}
function closeSheet(){$('#sheet-bg').classList.remove('open')}

// ═══ NAVIGATION ═══
function pushNav(key){if(key&&S.navStack[S.navStack.length-1]!==key)S.navStack.push(key)}
function goMenu(key){
  pushNav(S.curMenu);
  S.branch=MENUS[key]?.title||key;
  addListCard(key);renderRight();
}
function goBack(){
  const prev=S.navStack.pop();
  if(prev&&MENUS[prev]){S.branch=MENUS[prev].title;addBot('Regresando al menú anterior...');addListCard(prev);}
  else goMenu('main');
  renderRight();
}

// ═══ AUTH HELPERS ═══
async function ensureL1(){
  if(!S.isClient||!S.auth||S.auth==='Invitado'){
    S.isClient=true;S.name='Andrea';S.auth='Nivel 1';
    addSys('Prototipo: cliente de prueba → Andrea · datos enmascarados');
    renderRight();
  }
}

// ═══ FLOWS ═══

async function startFlow(sc='rutina'){
  S.started=true;S.scenario=sc;S.name=null;S.isClient=null;S.auth=null;
  S.branch=null;S.waiting=false;S.caseId=null;S.navStack=[];S.curMenu=null;S.history=[];
  $('#emr-banner').classList.remove('show');
  $('#bot-status').textContent='Tabot · disponible 24/7';
  chatEl().innerHTML='<div class="day"><span>Hoy</span></div>';
  renderRight();
  if(sc==='web'){
    await botMsg('¡Hola! 😊 Bienvenido a Banco Agrícola. Llegaste desde nuestro sitio web, soy <b>Tabot</b>.\n\n¿En qué te puedo ayudar hoy?');
    addQuick([{id:'clientYes',label:'✅ Soy cliente'},{id:'clientNo',label:'🔎 Conocer productos'},{id:'cita',label:'📅 Agendar cita'},{id:'advisor',label:'💬 Ejecutivo comercial'}]);
  } else if(sc==='app'){
    await botMsg('¡Hola! 👋 Llegaste al soporte de Banco Agrícola desde la app. Soy <b>Tabot</b>.\n\n¿Con qué te puedo ayudar hoy?');
    addQuick([{id:'clientYes',label:'✅ Tengo cuenta'},{id:'bm4',label:'🔑 Problema con mi acceso'},{id:'bm3',label:'🔒 Recuperar contraseña'},{id:'advisor',label:'💬 Soporte técnico'}]);
  } else {
    await botMsg('¡Hola! 👋 Soy <b>Tabot</b>, el asistente virtual de Banco Agrícola.\n\nEstoy aquí para ayudarte de forma rápida, clara y segura. ¿Tienes cuenta con nosotros?');
    addQuick([{id:'clientYes',label:'✅ Sí, tengo cuenta'},{id:'clientNo',label:'🔎 Solo quiero explorar'},{id:'advisor',label:'💬 Hablar con asesor'}]);
  }
}

async function askDUI(){
  S.isClient=true;S.auth='awaitDUI';renderRight();
  await botMsg('Para reconocerte, escribe los <b>últimos 4 dígitos de tu DUI</b>.\n\n🔒 Nunca te pediré tu número completo por este medio.');
}

async function askAlias(){
  S.isClient=false;S.auth='awaitAlias';renderRight();
  await botMsg('¡Bienvenido! Puedes explorar nuestros productos y servicios sin necesidad de registrarte. 😊\n\n¿Cómo quieres que te llame?');
}

async function confirmIdentity(){
  S.auth='confirmName';renderRight();
  await botMsg('Gracias. Encontré una coincidencia segura.\n\n¿Eres <b>A****a M*****z</b>?');
  addQuick([{id:'confirmYes',label:'✅ Sí, soy yo'},{id:'confirmNo',label:'❌ No es mi cuenta'}]);
}

async function authenticated(){
  S.auth='Nivel 1';S.name=S.name||'Andrea';renderRight();
  await botMsg(`¡Listo, ${S.name}! ✅ Ya te tengo identificada de forma segura.\n\nPuedes gestionar tu cuenta o usar los atajos cuando quieras.`);
  showKwTip(true);
  goMenu('main');
}

async function guestWelcome(alias){
  S.name=alias||'Carlos';S.auth='Invitado';renderRight();
  await botMsg(`Perfecto, ${S.name}. 😊 Puedes explorar productos, agendar una cita o hablar con un ejecutivo sin necesidad de autenticarte.`);
  goMenu('C');
}

async function warmGreeting(){
  if(!S.name){
    await botMsg('¡Hola! 😊 Qué gusto saludarte. Soy <b>Tabot</b>, el asistente de Banco Agrícola.\n\n¿En qué te puedo ayudar hoy?');
    addQuick([{id:'clientYes',label:'✅ Tengo una cuenta'},{id:'clientNo',label:'🔎 Solo quiero explorar'},{id:'advisor',label:'💬 Hablar con asesor'}]);
  } else {
    await botMsg(`¡Hola de nuevo, ${S.name}! 😊 ¿En qué más te puedo ayudar?`);
    goMenu('main');
  }
}

function showKwTip(compact=false){
  addMini(`<b>⚡ Atajos disponibles en cualquier momento:</b><br>Saldo tarjeta · Bloqueo TDC · EDC tarjeta · Reversa de membresía · Viaje · Activación TDC · Gestión LES · Asistencia X · Cita<br><br><span style="color:var(--muted)">Escríbelos directamente para ir sin pasos al proceso.</span>`);
  if(!compact)addQuick([{id:'main',label:'🏠 Ir al menú principal'},{id:'advisor',label:'💬 Hablar con asesor'}]);
}

// ── RAMA A ──

async function flowSaldo(kw=false){
  S.branch='A · Saldo tarjeta';
  if(kw)await botMsg('⚡ Reconocí la palabra clave <b>Saldo tarjeta</b>. Consulta disponible al instante.');
  await ensureL1();
  await botMsg(`Aquí están tus saldos, ${S.name||'Andrea'} 👇\n\n💳 <b>Visa Clásica ••4528</b>\n• Saldo pendiente: <b>$215.80</b>\n• Crédito disponible: <b>$784.20</b>\n• Puntos acumulados: <b>2,840 pts</b>\n\n🏦 <b>Cuenta corriente ••1180</b>\n• Saldo disponible: <b>$842.30</b>`);
  addQuick([{id:'payVisa',label:'💸 Pagar Visa ••4528'},{id:'edc',label:'📄 Estado de cuenta'},{id:'movimientos',label:'📋 Ver movimientos'},{id:'main',label:'🏠 Inicio'}]);
  renderRight();
}

async function flowPagar(){
  S.branch='A · Pagar TDC';
  await ensureL1();
  await botMsg('¿Cómo quieres pagar tu <b>Visa ••4528</b>?');
  addQuick([{id:'payTotal',label:'💳 Pago total · $215.80'},{id:'payMin',label:'💰 Pago mínimo · $45.00'},{id:'payOther',label:'✏️ Otro monto'},{id:'Aram',label:'⬅️ Volver'}]);
  renderRight();
}

async function flowEDC(kw=false){
  S.branch='A · EDC tarjeta';
  if(kw)await botMsg('⚡ Reconocí la palabra clave <b>EDC tarjeta</b>. Puedes pedir hasta los últimos 3 cortes.');
  await ensureL1();
  await botMsg('¿Qué estado de cuenta de TDC necesitas?\n\nSe enviará al correo registrado: <b>a************n@gmail.com</b>');
  addQuick([{id:'edc1',label:'📄 Último corte'},{id:'edc2',label:'📄 Penúltimo corte'},{id:'edc3',label:'📄 Antepenúltimo corte'},{id:'Aram',label:'⬅️ Volver'}]);
  renderRight();
}

async function successEDC(corte){
  await botMsg(`📄 ¡Listo! Te enviamos el estado de cuenta del <b>${corte}</b> al correo registrado.\n\n¿Necesitas algo más?`);
  addQuick([{id:'main',label:'🏠 Inicio'},{id:'advisor',label:'💬 Asesor'},{id:'exit',label:'🚪 Salir'}]);
  renderRight();
}

async function flowActivacion(kw=false){
  S.branch='A · Activación TDC';
  if(kw)await botMsg('⚡ Reconocí la palabra clave <b>Activación TDC</b>. Vamos a activar tu tarjeta nueva.');
  await ensureL1();
  await botMsg('Ten tu tarjeta física en mano. Escribe los <b>últimos 4 dígitos</b> de la tarjeta que quieres activar.');
  S.auth='awaitActivationCard';renderRight();
}

async function successActivacion(){
  S.auth='Nivel 2 aprobado';
  await botMsg('✅ <b>¡Tu tarjeta Visa ••4528 ya está activa!</b>\n\nRecuerda firmarla al reverso y nunca compartir tu PIN con nadie.');
  addQuick([{id:'viaje',label:'✈️ Notificar viaje'},{id:'main',label:'🏠 Inicio'},{id:'exit',label:'🚪 Salir'}]);
  renderRight();
}

async function flowReversa(kw=false){
  S.branch='A · Reversa de membresía';
  if(kw)await botMsg('⚡ Reconocí la palabra clave <b>Reversa de membresía</b>. Esta gestión requiere validación adicional.');
  await ensureL1();
  await botMsg('Selecciona la tarjeta para la que quieres solicitar la reversa de membresía.');
  addQuick([{id:'revVisa',label:'💳 Visa ••4528'},{id:'revMC',label:'💳 Mastercard ••7702'},{id:'advisor',label:'💬 Asesor'}]);
  renderRight();
}

async function requestOTP(action,onSuccess){
  S.auth='awaitOTP';S.pendingOTP=onSuccess;renderRight();
  await botMsg(`Para confirmar <b>${action}</b>, te enviamos un código de verificación al número <b>••••4521</b>.\n\nEscribe el código de <b>6 dígitos</b> (expira en 5 minutos).`);
}

async function successReversa(){
  await requestOTP('la solicitud de reversa de membresía',async()=>{
    S.caseId='BA-'+Math.floor(10000+Math.random()*89999);
    await botMsg(`🔄 Solicitud recibida correctamente.\n\nEvaluaremos la reversa de membresía de Visa ••4528 según las políticas aplicables.\n\n📋 Caso creado: <b>${S.caseId}</b>`);
    addQuick([{id:'main',label:'🏠 Inicio'},{id:'advisor',label:'💬 Asesor'},{id:'exit',label:'🚪 Salir'}]);renderRight();
  });
}

async function successPayment(amount){
  S.auth='Nivel 2 aprobado';renderRight();
  await botMsg(`✅ <b>¡Pago confirmado!</b>\n\nDebitamos <b>${amount}</b> a tu Visa ••4528.\nTe enviamos el comprobante al correo registrado.`);
  addQuick([{id:'main',label:'🏠 Inicio'},{id:'edc',label:'📄 Pedir estado de cuenta'},{id:'exit',label:'🚪 Salir'}]);
  showKwTip(true);renderRight();
}

async function flowViaje(kw=false){
  S.branch='A · Viaje';
  if(kw)await botMsg('⚡ Reconocí la palabra clave <b>Viaje</b>. Vamos a registrar tu notificación de viajero.');
  await ensureL1();
  await botMsg('Para registrar tu viaje, escribe el <b>destino y las fechas</b> de tu viaje.\n\n📍 Ejemplo: <i>Guatemala, del 12 al 18 de junio</i>');
  S.auth='awaitTravel';renderRight();
}

async function successViaje(txt){
  await requestOTP('la notificación de viaje',async()=>{
    await botMsg(`✈️ <b>¡Listo! Tu viaje quedó registrado:</b>\n\n${esc(txt)}\n\nTu tarjeta está lista para usarse en el exterior durante esas fechas. ¡Buen viaje! 🌍`);
    addQuick([{id:'main',label:'🏠 Inicio'},{id:'exit',label:'🚪 Salir'}]);renderRight();
  });
}

async function flowUbicaciones(){
  S.branch='A · Ubicaciones';
  await botMsg('¿Qué tipo de ubicación necesitas consultar?');
  addQuick([{id:'locAg',label:'🏦 Agencias'},{id:'locCaj',label:'🏧 Cajeros'},{id:'locDep',label:'💵 Cajeros depositarios'},{id:'locKio',label:'📱 Kioskos'},{id:'locCor',label:'🏪 Corresponsales'}]);
  renderRight();
}

async function flowBancaMovil(fromB=false){
  S.branch=fromB?'B · Soporte app':'A · Banca móvil';
  await botMsg('Te ayudo con banca móvil y E-banca. ¿Qué necesitas?');
  addQuick([{id:'bm1',label:'👤 Crear usuario'},{id:'bm2',label:'🔍 Recuperar usuario'},{id:'bm3',label:'🔑 Recuperar contraseña'},{id:'bm4',label:'🔓 Desbloquear usuario'},{id:'bm5',label:'📱 Eliminar dispositivo'},{id:'bm6',label:'🔢 Clave Dinámica'}]);
  renderRight();
}

async function flowPagos(){
  S.branch='A/C · Pagos y transferencias';
  await botMsg('Selecciona el tipo de gestión de pagos que necesitas:');
  addQuick([{id:'pg1',label:'💳 Soluciones de pago'},{id:'pg2',label:'🌐 Productos en línea'},{id:'pg3',label:'💱 Cotizar moneda extranjera'},{id:'pg4',label:'🌎 Transferencias internacionales'}]);
  renderRight();
}

// ── RAMA B ──

async function flowBloqueoTDC(kw=false){
  S.branch='B · Bloqueo TDC';
  $('#emr-banner').classList.add('show');
  $('#bot-status').textContent='Modo emergencia · Prioridad máxima';
  if(kw)await botMsg('⚡ Reconocí la palabra clave <b>Bloqueo TDC</b>. Actúo de inmediato para protegerte.');
  await botMsg('Lamentamos lo que pasó. Vamos a actuar rápido para proteger tu cuenta. 🔒\n\n¿Qué tarjeta necesitas bloquear?');
  addQuick([{id:'blockVisa',label:'💳 Visa Clásica ••4528'},{id:'blockMC',label:'💳 Mastercard Gold ••7702'},{id:'blockOther',label:'💳 Otra tarjeta'}]);
  renderRight();
}

async function flowBloqueoTDD(kw=false){
  S.branch='B · Bloqueo Débito';
  $('#emr-banner').classList.add('show');
  if(kw)await botMsg('⚡ Reconocí <b>Bloqueo tarjeta débito</b>. Actuamos de inmediato.');
  await botMsg('Vamos a bloquear tu tarjeta de débito. Selecciona la tarjeta o escribe los últimos 4 dígitos.');
  addQuick([{id:'blockTDD',label:'💳 Débito ••1180'},{id:'blockOther',label:'💳 Otra tarjeta'},{id:'advisor',label:'💬 Asesor'}]);
  renderRight();
}

// ── ALERTA DE SEGURIDAD ──
async function flowAlerta(kw=false){
  S.branch='B · Alerta de seguridad';
  $('#emr-banner').classList.add('show');
  $('#bot-status').textContent='Alerta activa · Atención prioritaria';
  if(kw)await botMsg('🚨 Recibí tu <b>alerta</b>. Vamos a atenderte de inmediato.');
  else await botMsg('🚨 <b>Alerta recibida.</b> Estoy aquí para ayudarte de forma segura y rápida.');
  await botMsg('¿Qué tipo de alerta quieres reportar?');
  addQuick([{id:'alertFraud',label:'🕵️ Actividad sospechosa / fraude'},{id:'alertBlock',label:'🔒 Bloquear tarjeta urgente'},{id:'alertAccess',label:'🔑 Acceso no autorizado a mi cuenta'},{id:'alertOther',label:'⚠️ Otra situación urgente'}]);
  renderRight();
}

// ── "NO ES MI CUENTA" → Verificación alternativa en 2 pasos ──
async function notMyAccount(){
  S.altVerifAttempts=0;
  await botMsg('Entiendo. Vamos a verificarte por otro medio para que puedas hacer tu gestión de forma segura. 🔐\n\n¿Cómo prefieres confirmar que eres el titular?');
  addQuick([{id:'altCard',label:'💳 Con los últimos 4 dígitos de mi tarjeta'},{id:'altBirth',label:'📅 Con mi fecha de nacimiento'},{id:'advisor',label:'💬 Prefiero hablar con un asesor'}]);
  S.auth='altVerifMenu';renderRight();
}

// ── CONFIRMACIÓN DE BLOQUEO CON DOBLE AUTENTICACIÓN ──
async function confirmBlock(card){
  S.pendingCard=card;S.auth='awaitBlockVerif';renderRight();
  await botMsg(`Por seguridad, antes de bloquear <b>${card}</b>, necesito verificar que eres el titular.\n\nEscribe los <b>últimos 4 dígitos de tu DUI</b>.`);
}

async function showBlockFinalConfirm(){
  S.auth='pendingBlockConfirm';renderRight();
  await botMsg(`✅ Identidad confirmada. ¿Bloqueamos <b>${S.pendingCard}</b> de forma definitiva?\n\n⚠️ Esta acción protege tu cuenta pero <b>no se puede deshacer</b>.`);
  addQuick([{id:'confirmBlockFinal',label:'🔒 Sí, bloquear ahora'},{id:'cancelBlock',label:'❌ Cancelar'}]);
}

async function successBlock(){
  S.auth='Emergencia aprobada';
  S.caseId='BA-'+Math.floor(10000+Math.random()*89999);renderRight();
  await botMsg(`🔒 <b>¡Tu tarjeta está bloqueada!</b>\n\nTu cuenta está protegida. El bloqueo tomó menos de 30 segundos.\n📋 Caso: <b>${S.caseId}</b>`);
  addQuick([{id:'reposicion',label:'🔄 Solicitar reposición'},{id:'advisorFraud',label:'🛟 Hablar con asesor'},{id:'main',label:'🏠 Inicio'}]);
  renderRight();
}

async function flowCargoRaro(){
  S.branch='B · Cargo no reconocido';
  await ensureL1();
  await botMsg('Entendemos tu preocupación. Vamos a revisar juntos los movimientos recientes de tu <b>Mastercard ••7702</b>:');
  addQuick([{id:'movPP',label:'❓ PayPal $124.50 · 15 may'},{id:'movNF',label:'✅ Netflix $13.99 · 14 may'},{id:'movSM',label:'✅ Supermercado $45.00 · 13 may'},{id:'advisor',label:'💬 Hablar con asesor'}]);
  renderRight();
}

async function reportCharge(){
  await botMsg('Entendido. Vamos a reportar ese movimiento. ¿También quieres bloquear tu tarjeta como medida de protección?');
  addQuick([{id:'blockFromCharge',label:'🔒 Sí, bloquear MC ••7702'},{id:'reportOnly',label:'📋 Solo reportar el cargo'}]);
}

async function flowLES(kw=false){
  S.branch='B · Gestión LES';
  if(kw)await botMsg('⚡ Reconocí la palabra clave <b>Gestión LES</b>. Te conecto con atención especializada en fraude.');
  await ensureL1();
  await botMsg('Para agilizar tu caso, descríbeme en una línea:\n\n• Tipo de fraude\n• Monto aproximado\n• Fecha del incidente\n\n📝 Ejemplo: <i>compra no reconocida, $124.50, 15 de mayo</i>');
  S.auth='awaitLES';renderRight();
}

async function flowAsistenciaX(kw=false){
  S.branch='B · Asistencia X';
  if(kw)await botMsg('⚡ Reconocí la palabra clave <b>Asistencia X</b>. Esta ruta es para dar seguimiento a casos desde X.');
  await botMsg('Para darte seguimiento por WhatsApp, escribe tu <b>número de caso</b>.\n\nSi no tienes número, describe brevemente el motivo de tu contacto.');
  S.auth='awaitX';renderRight();
}

// ── RAMA C ──

async function infoProd(title,body){
  S.branch='C · '+title;
  await botMsg(`<b>${title}</b>\n\n${body}\n\n¿Quieres más información o hablar con un ejecutivo?`);
  addQuick([{id:'masInfo',label:'ℹ️ Más información'},{id:'advisorComercial',label:'💬 Ejecutivo'},{id:'cita',label:'📅 Agendar cita'},{id:'main',label:'🏠 Inicio'}]);
  renderRight();
}

async function flowCita(kw=false){
  S.branch='C · Cita';
  if(kw)await botMsg('⚡ Reconocí la palabra clave <b>Cita</b>. Aquí tienes el acceso directo.');
  await botMsg('📅 Puedes agendar tu cita directamente desde el sitio web:\n\n🔗 <b>www.bancoagricola.com/citas</b>\n\nTambién te puedo ayudar a encontrar la agencia más cercana.');
  addQuick([{id:'locAg',label:'🏦 Ver agencias'},{id:'main',label:'🏠 Inicio'},{id:'advisor',label:'💬 Asesor'}]);
  renderRight();
}

async function flowCreditos(){
  S.branch='C · Créditos';
  await botMsg('¿Qué tipo de crédito quieres conocer?');
  addQuick([{id:'credP',label:'👤 Crédito personal'},{id:'credV',label:'🏠 Crédito de vivienda'},{id:'credA',label:'💵 Adelanto de salario'},{id:'solCred',label:'💬 Solicitar con ejecutivo'}]);
  renderRight();
}

// ── ASESOR ──

async function advisor(type='general'){
  S.waiting=true;S.caseId='BA-'+Math.floor(10000+Math.random()*89999);
  const labels={general:'asesor humano',fraude:'asesor especializado en fraude',comercial:'ejecutivo comercial',servicio:'asesor de servicio',identidad:'asesor de verificación de identidad'};
  renderRight();
  await botMsg(`Te conecto con un <b>${labels[type]||'asesor'}</b>.\n\n⏱️ Tiempo estimado de espera: <b>~2 minutos</b>.\n\nMientras esperas, puedes seguir navegando sin perder tu turno.`);
  addMini(`<b>📋 Espera activa</b><br>Tu caso <b>${S.caseId}</b> ya tiene el contexto de esta conversación listo.<br><br>No tendrás que repetir nada. El asesor ya lo verá al conectarse.`);
  addQuick([{id:'mainWhileWait',label:'🧾 Otras gestiones'},{id:'faqWait',label:'❓ Dudas frecuentes'},{id:'wait',label:'⏳ Esperar al asesor'}]);
  addMini(`<b>💡 Mientras esperas puedes:</b><br>• Consultar tu saldo → escribe <b>saldo tarjeta</b><br>• Pedir estado de cuenta → escribe <b>EDC tarjeta</b><br>• Ver ubicaciones → selecciona <b>Gestionar mi cuenta</b><br>• Tu turno sigue activo aunque navegues 🕐`);
}

async function advisorCtx(ctx){
  S.waiting=true;S.caseId='BA-'+Math.floor(10000+Math.random()*89999);renderRight();
  await botMsg(`Te conecto con un asesor con toda la información lista.\n\n📋 Caso: <b>${S.caseId}</b>\n⏱️ Tiempo estimado: <b>~1 minuto</b>.`);
  addMini(`<b>Contexto enviado al asesor:</b><br>${ctx}<br><br>Historial de sesión · datos enmascarados · prioridad de cola asignada.`);
  addQuick([{id:'mainWhileWait',label:'🧾 Otras gestiones'},{id:'faqWait',label:'❓ Dudas frecuentes'},{id:'wait',label:'⏳ Esperar al asesor'}]);
  addMini(`<b>💡 Mientras esperas puedes:</b><br>• Consultar tu saldo → escribe <b>saldo tarjeta</b><br>• Pedir estado de cuenta → escribe <b>EDC tarjeta</b><br>• Tu turno sigue activo aunque navegues 🕐`);
}

function goodbye(){
  addBot('Gracias por escribirnos. Estoy aquí cuando lo necesites. ¡Hasta pronto! 👋');
  S.auth='Cerrado';renderRight();
}

function fallback(){
  const msg=FALLBACK_MSGS[_fbi%FALLBACK_MSGS.length];_fbi++;
  addBot(msg);
  if(S.curMenu&&MENUS[S.curMenu])addListCard(S.curMenu);
  else goMenu('main');
}

// ═══ ACTIONS ═══
const ACTIONS={
  // Welcome
  clientYes:()=>askDUI(),
  clientNo:()=>askAlias(),
  confirmYes:()=>authenticated(),
  confirmNo:()=>notMyAccount(),
  // Verificación alternativa (cuando no es su cuenta)
  altCard:async()=>{await botMsg('Escribe los <b>últimos 4 dígitos</b> de cualquier tarjeta Banco Agrícola a tu nombre. 💳');S.auth='awaitAltCard';renderRight();},
  altBirth:async()=>{await botMsg('Escribe tu <b>fecha de nacimiento</b> en formato DD/MM/AAAA.\n📅 Ejemplo: 15/06/1990');S.auth='awaitAltBirth';renderRight();},
  // Bloqueo con doble autenticación
  confirmBlockFinal:()=>requestOTP('el bloqueo definitivo de tu tarjeta',successBlock),
  // Alerta de seguridad
  alertFraud:()=>flowLES(true),
  alertBlock:()=>flowBloqueoTDC(true),
  alertAccess:async()=>{await botMsg('Entendido. Para proteger tu acceso, primero necesito verificar tu identidad.\n\nEscribe los <b>últimos 4 dígitos de tu DUI</b>.');S.auth='awaitDUI';renderRight();},
  alertOther:async()=>{await botMsg('Cuéntame brevemente qué está pasando para orientarte al área correcta.');S.auth='awaitX';renderRight();},
  // Navigation
  main:()=>goMenu('main'),
  mainWhileWait:()=>goMenu('main'),
  Aram:()=>goMenu('A'),
  Bram:()=>goMenu('B'),
  Cram:()=>goMenu('C'),
  back:()=>goBack(),
  exit:()=>goodbye(),
  advisor:()=>advisor('general'),
  advisorFraud:()=>advisor('fraude'),
  advisorComercial:()=>advisor('comercial'),
  saldo:()=>flowSaldo(),
  // Rama A
  payVisa:()=>flowPagar(),
  payTotal:()=>requestOTP('el pago total de $215.80 a Visa ••4528',()=>successPayment('$215.80')),
  payMin:()=>requestOTP('el pago mínimo de $45.00 a Visa ••4528',()=>successPayment('$45.00')),
  payOther:()=>botMsg('Escribe el monto que quieres pagar. Ejemplo: <b>75.00</b>'),
  edc:()=>flowEDC(),
  edc1:()=>successEDC('último corte'),
  edc2:()=>successEDC('penúltimo corte'),
  edc3:()=>successEDC('antepenúltimo corte'),
  movimientos:async()=>{await botMsg('📋 Últimos movimientos de <b>Visa ••4528</b>:\n\n• PayPal $124.50 · 15 may\n• Netflix $13.99 · 14 may\n• Supermercado $45.00 · 13 may\n• Gasolinera $35.00 · 12 may');addQuick([{id:'edc',label:'📄 EDC tarjeta'},{id:'payVisa',label:'💸 Pagar tarjeta'},{id:'main',label:'🏠 Inicio'}]);},
  viaje:()=>flowViaje(),
  revVisa:()=>successReversa(),
  revMC:()=>successReversa(),
  locAg:async()=>{await botMsg('🏦 <b>Agencias más cercanas:</b>\n\n• Multiplaza · L-V 9:00-17:00, Sáb 9:00-13:00\n• Galerías · L-V 10:00-18:00, Sáb 10:00-14:00\n• Centro Histórico · L-V 8:30-16:00\n• Santa Elena · L-V 9:00-17:00, Sáb 9:00-13:00\n\n¿Quieres más información o agendar una cita?');addQuick([{id:'cita',label:'📅 Agendar cita'},{id:'locCaj',label:'🏧 Ver cajeros'},{id:'main',label:'🏠 Inicio'}]);},
  locCaj:async()=>{await botMsg('🏧 Tenemos cajeros en más de 350 puntos en todo el país. Puedes localizarlos en la app o en bancoagricola.com/cajeros');addQuick([{id:'locDep',label:'💵 Cajeros depositarios'},{id:'locAg',label:'🏦 Ver agencias'},{id:'main',label:'🏠 Inicio'}]);},
  locDep:async()=>{await botMsg('💵 Los cajeros depositarios están disponibles en las principales agencias para depósito de efectivo y otros servicios.');addQuick([{id:'locAg',label:'🏦 Ver agencias'},{id:'main',label:'🏠 Inicio'}]);},
  locKio:async()=>{await botMsg('📱 Kioskos disponibles en puntos estratégicos. ¿Te puedo filtrar por zona o mostrarte el mapa en el sitio web?');addQuick([{id:'locAg',label:'🏦 Ver agencias'},{id:'main',label:'🏠 Inicio'}]);},
  locCor:async()=>{await botMsg('🏪 Corresponsales financieros disponibles:\n• Puntos Xpress\n• Puntos Akí\n• Corresponsales Financieros Agrícola');addQuick([{id:'locAg',label:'🏦 Ver agencias'},{id:'main',label:'🏠 Inicio'}]);},
  bm1:async()=>{await botMsg('Para crear tu usuario de banca móvil:\n1. Abre la app de Banco Agrícola\n2. Selecciona "Crear usuario"\n3. Sigue el proceso de verificación\n\n¿Quieres el enlace de descarga?');addQuick([{id:'advisor',label:'💬 Necesito ayuda'},{id:'main',label:'🏠 Inicio'}]);},
  bm2:async()=>{await botMsg('Para recuperar tu usuario necesitamos validar tu identidad. El proceso es rápido y seguro. ¿Continuamos?');addQuick([{id:'clientYes',label:'✅ Sí, continuemos'},{id:'advisor',label:'💬 Prefiero un asesor'},{id:'main',label:'🏠 Inicio'}]);},
  bm3:async()=>{await botMsg('Para recuperar tu contraseña, te enviaremos un código de verificación al número registrado. ¿Continuamos?');addQuick([{id:'clientYes',label:'✅ Sí, envíame el código'},{id:'advisor',label:'💬 Prefiero un asesor'},{id:'main',label:'🏠 Inicio'}]);},
  bm4:async()=>{await botMsg('Para desbloquear tu usuario, primero validamos tu identidad. El proceso toma menos de 3 minutos. ¿Continuamos?');addQuick([{id:'clientYes',label:'✅ Sí, continuemos'},{id:'advisor',label:'💬 Prefiero un asesor'}]);},
  bm5:async()=>{await botMsg('Puedes eliminar un dispositivo de confianza en <b>Ajustes → Seguridad</b> dentro de la app. ¿Quieres que te explique paso a paso?');addQuick([{id:'advisor',label:'💬 Necesito un asesor'},{id:'main',label:'🏠 Inicio'}]);},
  bm6:async()=>{await botMsg('💡 La <b>Clave Dinámica</b> es un código temporal que cambia periódicamente para proteger tus transacciones. Se genera desde la app o por SMS. ¿Necesitas activarla o tienes un problema con ella?');addQuick([{id:'advisor',label:'💬 Hablar con asesor'},{id:'main',label:'🏠 Inicio'}]);},
  pg1:async()=>{await botMsg('💳 Soluciones de pago disponibles:\n• Pago de servicios públicos\n• Colectores de pago\n• Pago de productos en línea\n• Pagos con código QR');addQuick([{id:'pg2',label:'🌐 Productos en línea'},{id:'main',label:'🏠 Inicio'},{id:'advisor',label:'💬 Asesor'}]);},
  pg2:async()=>{await botMsg('🌐 Desde E-banca puedes contratar y gestionar productos sin ir a una agencia. Ingresa a <b>bancoagricola.com/ebanca</b>');addQuick([{id:'cita',label:'📅 Agendar cita'},{id:'main',label:'🏠 Inicio'}]);},
  pg3:async()=>{await botMsg('💱 Para cotizar moneda extranjera puedes visitar la agencia más cercana o llamar al call center. Los tipos de cambio se actualizan diariamente.');addQuick([{id:'locAg',label:'🏦 Ver agencias'},{id:'advisor',label:'💬 Asesor'},{id:'main',label:'🏠 Inicio'}]);},
  pg4:async()=>{await botMsg('🌎 Para transferencias internacionales necesitas: cuenta destino, banco receptor, código SWIFT y monto. ¿Quieres iniciar el proceso con un asesor?');addQuick([{id:'advisor',label:'💬 Sí, con un asesor'},{id:'main',label:'🏠 Inicio'}]);},
  // Rama B
  blockVisa:()=>confirmBlock('Visa Clásica ••4528'),
  blockMC:()=>confirmBlock('Mastercard Gold ••7702'),
  blockTDD:()=>confirmBlock('Débito ••1180'),
  blockOther:()=>botMsg('Escribe los últimos 4 dígitos de la tarjeta que quieres bloquear. 💳'),
  confirmBlock:()=>showBlockFinalConfirm(),  // now only reached AFTER DUI verified
  cancelBlock:async()=>{$('#emr-banner').classList.remove('show');$('#bot-status').textContent='Tabot · disponible 24/7';await botMsg('Entendido. Tu tarjeta <b>no fue bloqueada</b>. ¿Hay algo más en lo que te pueda ayudar?');goMenu('main');},
  reposicion:async()=>{await botMsg('🔄 Iniciamos la solicitud de reposición. Un asesor confirmará la dirección de entrega o agencia de retiro en las próximas horas.');addQuick([{id:'advisorFraud',label:'💬 Hablar con asesor'},{id:'main',label:'🏠 Inicio'},{id:'exit',label:'🚪 Salir'}]);},
  movPP:()=>reportCharge(),
  movNF:async()=>{await botMsg('✅ Confirmamos que el cargo de Netflix $13.99 está reconocido. ¿Hay algo más en lo que te pueda ayudar?');addQuick([{id:'Bram',label:'⬅️ Ver movimientos'},{id:'main',label:'🏠 Inicio'},{id:'advisor',label:'💬 Asesor'}]);},
  movSM:async()=>{await botMsg('✅ Confirmamos que el cargo del supermercado $45.00 está reconocido. ¿Hay algo más?');addQuick([{id:'Bram',label:'⬅️ Ver movimientos'},{id:'main',label:'🏠 Inicio'},{id:'advisor',label:'💬 Asesor'}]);},
  blockFromCharge:()=>confirmBlock('Mastercard Gold ••7702'),
  reportOnly:()=>advisorCtx('Cargo no reconocido · PayPal $124.50 · 15 may · cliente eligió NO bloquear · prioridad media'),
  // Rama C
  masInfo:async()=>{await botMsg('Te puedo dar información general aquí. Para condiciones, tasas actualizadas y requisitos específicos según tu perfil, un ejecutivo puede orientarte mejor. 😊');addQuick([{id:'advisorComercial',label:'💬 Ejecutivo'},{id:'cita',label:'📅 Agendar cita'},{id:'main',label:'🏠 Inicio'}]);},
  cita:()=>flowCita(),
  credP:()=>infoProd('Crédito personal','Financiamiento para cualquier necesidad personal, sujeto a evaluación crediticia. Tasas competitivas y plazos flexibles desde 6 hasta 60 meses.'),
  credV:()=>infoProd('Crédito de vivienda','Opciones para compra, construcción o remodelación. Tasas fijas y variables disponibles. Conoce los requisitos con un ejecutivo.'),
  credA:()=>infoProd('Adelanto de salario','Disponible para clientes con nómina domiciliada en Banco Agrícola. Consulta condiciones y disponibilidad según tu perfil.'),
  solCred:()=>advisor('comercial'),
  // Waiting
  faqWait:async()=>{await botMsg('❓ <b>Mientras esperas:</b>\n\n• ¿Cómo bloqueo mi tarjeta? → escribe <b>Bloqueo TDC</b>\n• ¿Cómo consulto un cargo? → <b>Gestionar mi cuenta</b>\n• ¿Cómo doy seguimiento? → guarda tu número de caso\n\nTu turno sigue activo. 🕐');addQuick([{id:'mainWhileWait',label:'🧾 Ver mis opciones'},{id:'edc',label:'📄 Pedir estado de cuenta'},{id:'wait',label:'⏳ Seguir esperando'}]);},
  wait:async()=>{await botMsg('Perfecto. Mantengo tu turno activo. 🕐 Te avisaré en cuanto el asesor esté disponible.');addQuick([{id:'mainWhileWait',label:'🧾 Otras gestiones'},{id:'faqWait',label:'❓ Dudas frecuentes'}]);},
  resendOTP:async()=>{await botMsg('Te enviamos un nuevo código de verificación al número ••••4521. ⏱️ Expira en 5 minutos.');addQuick([{id:'advisor',label:'💬 Asesor'},{id:'main',label:'🏠 Inicio'}]);},
};

// ═══ INPUT HANDLER ═══
async function handleText(raw){
  addUser(raw);
  const n=norm(raw);

  // ALERTA — detección puntual antes de emergencias generales
  if(ALERTA_TRIGGER(n)){await flowAlerta(true);return;}

  // Emergency
  if(EMERGENCY.some(w=>n.includes(norm(w)))){await flowBloqueoTDC(true);return;}

  // Single-word nav
  const navFn=NAV[n];if(navFn){navFn();return;}

  // Keywords
  for(const[k,obj]of Object.entries(KW)){
    if(n.includes(norm(k))){obj.fn();return;}
  }

  // Greetings — siempre responde cálidamente
  if(GREETINGS.some(g=>{const ng=norm(g);return n===ng||n.startsWith(ng+' ')||n.endsWith(' '+ng);})){
    await warmGreeting();return;
  }

  // Auth states
  if(S.auth==='awaitDUI'){
    if(/\d{4}/.test(raw))confirmIdentity();
    else await botMsg('Solo necesito los últimos 4 dígitos de tu DUI. 🔢 Inténtalo de nuevo.');
    return;
  }
  if(S.auth==='awaitAlias'){
    await guestWelcome(raw.trim().split(' ')[0]||'Carlos');return;
  }
  if(S.auth==='awaitOTP'){
    if(/^\d{6}$/.test(raw.trim())){
      S.auth='Nivel 2 aprobado';renderRight();
      const fn=S.pendingOTP;S.pendingOTP=null;
      if(typeof fn==='function')await fn();
      else await botMsg('✅ Código verificado.');
    }else{
      await botMsg('Ese código no coincide. Te quedan 2 intentos. ¿Quieres que te enviemos uno nuevo?');
      addQuick([{id:'resendOTP',label:'🔄 Reenviar código'},{id:'advisor',label:'💬 Asesor'}]);
    }
    return;
  }
  if(S.auth==='awaitActivationCard'){
    if(/\d{4}/.test(raw))await requestOTP('la activación de tu tarjeta',successActivacion);
    else await botMsg('Escribe los últimos 4 dígitos de la tarjeta que quieres activar. 💳');
    return;
  }
  if(S.auth==='awaitTravel'){S.auth='Nivel 1';await successViaje(raw);return;}
  if(S.auth==='awaitLES'){S.auth='Nivel 1';await advisorCtx(`Gestión LES · ${esc(raw)} · prioridad fraude · autenticación Nivel 3 requerida`);return;}
  if(S.auth==='awaitX'){S.auth='Nivel 1';await advisorCtx(`Asistencia X · ${esc(raw)} · cola de servicio al cliente · seguimiento por WhatsApp`);return;}

  // ── VERIFICACIÓN ALTERNATIVA ("No es mi cuenta") ──
  if(S.auth==='awaitAltCard'){
    if(/\d{4}/.test(raw)){
      S.auth='Nivel 1';S.name='titular verificado';renderRight();
      await botMsg('✅ Verificación exitosa con tarjeta. Ya puedes gestionar tu cuenta de forma segura.');
      showKwTip(true);goMenu('main');
    }else{
      S.altVerifAttempts++;
      if(S.altVerifAttempts>=2){await botMsg('No pude verificarte por este medio. Por seguridad, te conecto con un asesor especializado.');advisor('identidad');}
      else await botMsg('Escribe solo los últimos 4 dígitos de cualquier tarjeta Banco Agrícola a tu nombre. 💳');
    }
    return;
  }
  if(S.auth==='awaitAltBirth'){
    if(/\d{1,2}[\/-]\d{1,2}[\/-]\d{4}/.test(raw.trim())){
      S.auth='Nivel 1';S.name='titular verificado';renderRight();
      await botMsg('✅ Verificación exitosa con fecha de nacimiento. Ya puedes gestionar tu cuenta de forma segura.');
      showKwTip(true);goMenu('main');
    }else{
      S.altVerifAttempts++;
      if(S.altVerifAttempts>=2){await botMsg('No pude verificarte por este medio. Por seguridad, te conecto con un asesor especializado para ayudarte.');advisor('identidad');}
      else await botMsg('El formato debe ser DD/MM/AAAA. Por ejemplo: 15/06/1990. Inténtalo de nuevo.');
    }
    return;
  }

  // ── VERIFICACIÓN ANTES DE BLOQUEO (doble auth) ──
  if(S.auth==='awaitBlockVerif'){
    if(/\d{4}/.test(raw)){await showBlockFinalConfirm();}
    else await botMsg('Necesito los últimos 4 dígitos de tu DUI para proceder con el bloqueo. 🔢');
    return;
  }

  fallback();
}

// ═══ EVENTS ═══
chatEl().addEventListener('click',e=>{
  const qb=e.target.closest('.qbtn');
  if(qb){addUser(qb.textContent.trim());const fn=ACTIONS[qb.dataset.action];if(fn)fn();else fallback();return;}
  const lb=e.target.closest('.lc-btn');
  if(lb){openSheet(lb.dataset.menu);return;}
});

$('#sh-list').addEventListener('click',e=>{
  const item=e.target.closest('.sh-item');if(!item)return;
  const m=MENUS[item.dataset.menu];const idx=parseInt(item.dataset.idx);
  const it=m?.items[idx];if(!it)return;
  closeSheet();addUser(it[1]);it[3]();
});

$('#sh-close').onclick=closeSheet;
$('#sheet-bg').addEventListener('click',e=>{if(e.target.id==='sheet-bg')closeSheet()});
$('#send-btn').onclick=()=>{const t=inpEl().value.trim();if(!t)return;inpEl().value='';handleText(t)};
inpEl().addEventListener('keydown',e=>{if(e.key==='Enter')$('#send-btn').click()});

$$('.sc').forEach(b=>{b.onclick=()=>{$$('.sc').forEach(x=>x.classList.remove('active'));b.classList.add('active');startFlow(b.dataset.sc)}});
$('#btn-reset').onclick=()=>startFlow(S.scenario);
$('#btn-clear').onclick=()=>{chatEl().innerHTML='<div class="day"><span>Hoy</span></div>';S.history=[];renderRight()};
$('#btn-mo').onclick=()=>document.body.classList.toggle('mo');
$('#btn-start').onclick=()=>startFlow(S.scenario);
$('#mb-btn').onclick=()=>openSheet('main');

$$('.tab').forEach(t=>{t.onclick=()=>{$$('.tab').forEach(x=>x.classList.remove('active'));t.classList.add('active');S.tab=t.dataset.tab;renderRight()}});

document.addEventListener('click',e=>{const c=e.target.closest('.chip');if(c){inpEl().value=c.dataset.kw;inpEl().focus()}});

// ═══ RENDER RIGHT ═══
function renderRight(){
  let h='';
  if(S.tab==='estado'){
    h=`<div class="sbox"><div class="stitle">Estado actual de sesión</div>
      <div class="sl on">Escenario: ${S.scenario}</div>
      <div class="sl ${S.name?'on':''}">Usuario: ${S.name||'Pendiente'}</div>
      <div class="sl ${S.auth?'on':''}">Autenticación: ${S.auth||'Pendiente'}</div>
      <div class="sl ${S.branch?'on':''}">Rama activa: ${S.branch||'Pendiente'}</div>
      <div class="sl ${S.waiting?'on':''}">Asesor: ${S.waiting?'En espera · '+S.caseId:'No solicitado'}</div>
      <div class="sl on">Menú actual: ${S.curMenu||'Ninguno'}</div>
    </div>
    <div class="sbox"><div class="stitle">Criterios UX activos</div>
      <div class="sl on">Menús de despliegue estilo Samsung / AFP</div>
      <div class="sl on">Palabras clave y atajos disponibles</div>
      <div class="sl on">Datos sensibles siempre enmascarados</div>
      <div class="sl on">Espera activa: no hay limbo</div>
      <div class="sl on">Salidas: Inicio · Asesor · Salir</div>
      <div class="sl on">Navegación: "volver" con pila de historial</div>
      <div class="sl on">Trato de tú · Tono amistoso y claro</div>
    </div>`;
  }else if(S.tab==='back'){
    h=`<div class="sbox"><div class="stitle">Frontstage (lo que ve el usuario)</div>
      <div class="sl on">Mensajes cortos, claros y accionables</div>
      <div class="sl on">Listas con ícono, nombre y descripción</div>
      <div class="sl on">Tiempo de espera visible al escalar</div>
      <div class="sl on">Atajos recordados antes de cada rama</div>
      <div class="sl on">Siempre hay un "¿qué sigue?"</div>
    </div>
    <div class="sbox"><div class="stitle">Backstage (invisible para el usuario)</div>
      <div class="sl on">Clasifica intención por Rama A / B / C</div>
      <div class="sl on">Aplica nivel de auth según riesgo</div>
      <div class="sl on">Envía contexto completo al asesor</div>
      <div class="sl on">Sesión activa mientras espera asesor</div>
      <div class="sl on">Detección de emergencias en tiempo real</div>
      <div class="sl on">Normalización de texto para keywords</div>
    </div>`;
  }else{
    h=`<div class="sbox"><div class="stitle">Log de sesión</div><div class="logbox">${S.history.slice(-40).join('\n')||'Sin actividad aún.'}</div></div>`;
  }
  $('#right-body').innerHTML=h;
}

// ═══ CHIPS ═══
function initChips(){
  const labels=[...new Set(Object.values(KW).map(k=>k.label))];
  $('#kw-chips').innerHTML=labels.map(l=>`<button class="chip" data-kw="${l}">${l}</button>`).join('');
}

// ═══ CLOCK ═══
setInterval(()=>{$('#clock').textContent=now().replace(' a. m.','').replace(' p. m.','')},1000);

// ═══ BOOT ═══
initChips();renderRight();startFlow('rutina');
