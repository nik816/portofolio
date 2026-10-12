(()=>{
window.__niko=true;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
/* satu pengelola animasi untuk semua canvas (jeda otomatis saat tab tersembunyi) */
const tasks=[];let raf=0;const tick=()=>{raf=0;if(document.hidden)return;for(const f of tasks)f();raf=requestAnimationFrame(tick)};
const addTask=f=>{tasks.push(f);if(!raf&&!document.hidden)raf=requestAnimationFrame(tick)};
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!raf&&tasks.length)raf=requestAnimationFrame(tick)});
/* boot */
const boot=$('#boot');
if(RM){boot.remove()}else{
 const lc=$('#lc'),lx=lc.getContext('2d'),fl=$('#fl'),bb=boot.querySelector('b');let LW,LH,p=0,over=false;
 const lsz=()=>{LW=lc.width=innerWidth;LH=lc.height=innerHeight};lsz();
 const build=(x,y,tx,ty,d,out)=>{const pts=[[x,y]],n=13;for(let i=1;i<=n;i++){const t=i/n,nx=x+(tx-x)*t+(Math.random()-.5)*(d?60:90),ny=y+(ty-y)*t;pts.push([nx,ny]);
  if(d<2&&Math.random()<.24)build(nx,ny,nx+(Math.random()-.5)*340,ny+80+Math.random()*240,d+1,out)}out.push({pts,d})};
 const strike=big=>{const n=big?7:1+Math.floor(Math.random()*3);
  for(let k=0;k<n;k++){const out=[],x=Math.random()*LW;build(x,-10,x+(Math.random()-.5)*400,LH*(.45+Math.random()*.55),0,out);
   for(const b of out){lx.beginPath();b.pts.forEach((q,i)=>i?lx.lineTo(q[0],q[1]):lx.moveTo(q[0],q[1]));
    lx.lineJoin='round';lx.shadowColor='#F5C518';lx.shadowBlur=big?45:28;lx.strokeStyle='#F5C518';lx.lineWidth=b.d?2.5:(big?7:5);lx.stroke();
    lx.shadowBlur=0;lx.strokeStyle='#fff';lx.lineWidth=b.d?1:2.2;lx.stroke()}}
  fl.animate([{opacity:big?1:.55},{opacity:0}],{duration:big?420:200});
  const a=big?26:12;boot.animate([{transform:`translate(${-a}px,${a/2}px)`},{transform:`translate(${a}px,${-a/2}px)`},{transform:`translate(${-a/2}px,${-a}px)`},{transform:'none'}],{duration:big?360:180});
  bb.animate([{transform:'scale(1.15)',textShadow:'0 0 60px #F5C518,0 0 20px #E10B2A'},{transform:'none',textShadow:'none'}],{duration:260})};
 const fade=()=>{if(!boot.isConnected)return;lx.shadowBlur=0;lx.fillStyle='rgba(0,0,0,.16)';lx.fillRect(0,0,LW,LH);requestAnimationFrame(fade)};fade();
 const sched=()=>{if(over||!boot.isConnected)return;strike(false);setTimeout(sched,70+Math.random()*(230-p*1.4))};sched();
 const T0=performance.now(),DUR=850;let fin=false;
 const finish=()=>{if(fin)return;fin=true;over=true;strike(true);setTimeout(()=>strike(true),120);setTimeout(()=>{boot.classList.add('done');setTimeout(()=>boot.remove(),600)},260)};
 const t=setInterval(()=>{const e=performance.now()-T0,k=Math.min(1,e/DUR);p=Math.round((1-Math.pow(1-k,2))*100);$('#be').style.width=p+'%';$('#bt').textContent='BOOTING PORTFOLIO... '+p+'%';
  if(p>=100&&(document.readyState==='complete'||e>=1400)){clearInterval(t);finish()}},40);
 setTimeout(()=>{clearInterval(t);finish()},1600)}
/* greeting */
const h=new Date().getHours();$('#greet').textContent=h>=5&&h<11?'Selamat pagi':h<15&&h>=11?'Selamat siang':h>=15&&h<18?'Selamat sore':'Selamat malam';
/* photo fallback */
const pi=$('#pi'),im=pi.querySelector('img'),miss=()=>pi.classList.add('nop');
im.addEventListener('error',miss);if(im && im.complete && !im.naturalWidth) miss();
/* VELLORA: screenshot (hanya file yang benar-benar ada). Dicek/dimuat saat section mendekati layar, bukan saat halaman dibuka. */
const vf=$('#vf');
const initVellora=()=>{const shots=JSON.parse(vf.dataset.shots),main=vf.querySelector('img'),lnk=vf.querySelector('.fpz'),th=$('#vth'),ok=[];let n=0;
 const show=s=>{main.src=s.src;lnk.href=s.src;lnk.setAttribute('aria-label','Buka screenshot '+s.label+' ukuran penuh di tab baru');main.alt='Tampilan '+s.label+' website VELLORA';th.querySelectorAll('button').forEach(b=>{const on=b.dataset.src===s.src;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)})};
 const fin=()=>{if(++n<shots.length)return;const L=ok.filter(Boolean);if(!L.length){vf.classList.add('nop');return}
  if(L.length>1){th.hidden=false;L.forEach(s=>{const b=document.createElement('button');b.type='button';b.dataset.src=s.src;b.setAttribute('aria-label','Lihat tampilan '+s.label);b.setAttribute('aria-pressed','false');
   const c=document.createElement('span');c.className='tc';const i=document.createElement('img');i.src=s.src;i.alt='';i.loading='lazy';i.decoding='async';c.append(i);
   const t=document.createElement('span');t.className='tcap mono';t.textContent=s.label;b.append(c,t);b.onclick=()=>show(s);th.append(b)})}
  show(L[0])};
 shots.forEach(([src,label],i)=>{const t=new Image();t.onload=()=>{ok[i]={src,label};fin()};t.onerror=fin;t.src=src})};
if(vf){if('IntersectionObserver'in window){const vo=new IntersectionObserver(es=>{if(es[0].isIntersecting){vo.disconnect();initVellora()}},{rootMargin:'800px 0px'});vo.observe(vf)}else initVellora()}
/* hemat CPU: jeda animasi CSS hero saat tidak terlihat */
const hero=$('.hero');if(hero&&'IntersectionObserver'in window)new IntersectionObserver(es=>hero.classList.toggle('off',!es[0].isIntersecting)).observe(hero);
/* marquee */
const words=['HTML','CSS','JAVASCRIPT','PHP','LARAVEL','MYSQL','GIT','FIGMA','UI/UX','TRADING'];
const row=words.map(w=>`<span>${w}</span>`).join('');$('#mt').innerHTML=row+row+row+row;
/* role typer */
const roles=['Siswa PPLG','Pemula web developer','Belajar UI/UX','Menjelajah Laravel'];let ri=0,del=true;const re=$('#role');let ci=roles[0].length+1;
const type=()=>{const w=roles[ri];re.firstChild?re.firstChild.nodeValue=w.slice(0,ci):re.append(w.slice(0,ci));
 if(!del&&ci++===w.length){del=true;return setTimeout(type,1400)}if(del&&--ci===1){del=false;ri=(ri+1)%roles.length}setTimeout(type,del?35:75)};
if(!RM)setTimeout(type,2600);
/* progress + menu */
const pr=$('#prog');addEventListener('scroll',()=>{pr.style.width=scrollY/(document.documentElement.scrollHeight-innerHeight)*100+'%'},{passive:true});
const bm=$('#bm'),mm=$('#mm');const setMenu=o=>{mm.classList.toggle('open',o);bm.setAttribute('aria-expanded',o);bm.setAttribute('aria-label',o?'Tutup menu':'Buka menu')};
bm.onclick=()=>setMenu(!mm.classList.contains('open'));
mm.querySelectorAll('a').forEach(a=>a.onclick=()=>setMenu(false));
addEventListener('keydown',e=>{if(e.key==='Escape'&&mm.classList.contains('open')){setMenu(false);bm.focus()}});
/* reveal, bars, count, terminal */
const lines=[['$ whoami','k'],['Niko Afriyanto, siswa PPLG','o'],['$ cat sekolah.txt','k'],['SMK Ma\'arif Walisongo Kajoran','o'],['$ cat fokus.txt','k'],['HTML, CSS, JavaScript, PHP, Laravel, MySQL, dasar UI/UX (Figma)','o'],['$ cat cara-belajar.txt','k'],['Praktik langsung: belajar, coba di proyek kecil, catat di GitHub.','o'],['$ cat hobi.txt','k'],['Bola voli, dan trading sebagai minat tambahan.','o']];
let tdone=false;const tb=$('#tb');
const runTerm=()=>{if(tdone)return;tdone=true;if(RM){tb.innerHTML=lines.map(l=>`<div class="${l[1]}">${l[0]}</div>`).join('');return}
 let i=0,j=0,d=document.createElement('div');tb.append(d);d.className=lines[0][1];
 const s=()=>{if(i>=lines.length)return;const L=lines[i][0];if(j<L.length){d.textContent=L.slice(0,++j);setTimeout(s,lines[i][1]==='k'?40:14)}else{i++;j=0;if(i<lines.length){d=document.createElement('div');d.className=lines[i][1];tb.append(d)}setTimeout(s,250)}};s()};
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const t=e.target;t.classList.add('in');
 t.querySelectorAll('[data-w]').forEach(b=>b.style.width=b.dataset.w+'%');
 t.querySelectorAll('[data-c]').forEach(n=>{if(n.tagName!=='B')return;const T=+n.dataset.c;if(RM){n.textContent=T;return}let c=0;const k=setInterval(()=>{c=Math.min(T,c+1);n.textContent=c;if(c>=T)clearInterval(k)},90)});
 if(t.id==='tb'||t.contains(tb))runTerm();io.unobserve(t)}),{threshold:.15});
$$('.rv').forEach((el,i)=>{el.style.transitionDelay=(i%3)*90+'ms';io.observe(el)});
/* navbar: tandai section yang sedang dilihat */
const navA=$$('.nl a,#mm a');const spy=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;navA.forEach(a=>{const on=a.getAttribute('href')==='#'+e.target.id;a.classList.toggle('act',on);on?a.setAttribute('aria-current','true'):a.removeAttribute('aria-current')})}),{rootMargin:'-45% 0px -50% 0px'});
['about','skills','exp','works','contact'].forEach(id=>{const el=document.getElementById(id);if(el)spy.observe(el)});
/* filter */
$$('.fb2').forEach(b=>b.onclick=()=>{$$('.fb2').forEach(x=>{x.classList.remove('on');x.setAttribute('aria-pressed','false')});b.classList.add('on');b.setAttribute('aria-pressed','true');$$('.pc').forEach(c=>c.classList.toggle('h',b.dataset.f!=='all'&&c.dataset.c!==b.dataset.f))});
/* copy */
$('#cp').onclick=async()=>{try{await navigator.clipboard.writeText($('#mail').textContent);$('#cp').textContent='Tersalin';setTimeout(()=>$('#cp').textContent='Salin',1600)}catch(e){}};
/* cursor, tilt, magnetic */
let mx=innerWidth/2,my=innerHeight/2;
if(fine&&!RM){const cv2=document.createElement('canvas');cv2.id='cfx';document.body.append(cv2);const c=cv2.getContext('2d');
 let W2,H2,hov=false;const rs=()=>{W2=cv2.width=innerWidth;H2=cv2.height=innerHeight};rs();addEventListener('resize',rs);
 const tr=[],sp=[],rays=[];
 const spark=(x,y,n,pw)=>{for(let i=0;i<n;i++){const a=Math.random()*6.283,v=.8+Math.random()*pw;sp.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:1,c:Math.random()<.35?'225,11,42':'245,197,24'})}};
 addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;tr.push({x:mx,y:my,t:performance.now()});if(tr.length>20)tr.shift();spark(mx,my,hov?3:1,hov?4.5:2.5)});
 document.addEventListener('mouseover',e=>hov=!!e.target.closest('a,button'));
 addEventListener('mousedown',e=>{spark(e.clientX,e.clientY,30,10);for(let i=0;i<9;i++)rays.push({x:e.clientX,y:e.clientY,a:Math.random()*6.283,r:30+Math.random()*70,l:1})});
 addTask(function draw(){c.clearRect(0,0,W2,H2);const now=performance.now();while(tr.length&&now-tr[0].t>240)tr.shift();
  c.lineCap='round';c.lineJoin='round';
  if(tr.length>1){for(const pass of [0,1]){c.beginPath();tr.forEach((q,i)=>{const j=i&&i<tr.length-1?(Math.random()-.5)*9:0;i?c.lineTo(q.x+j,q.y+j):c.moveTo(q.x,q.y)});
   if(!pass){c.shadowColor='#F5C518';c.shadowBlur=16;c.strokeStyle='rgba(245,197,24,.9)';c.lineWidth=3.2}else{c.shadowBlur=0;c.strokeStyle='#fff';c.lineWidth=1.1}c.stroke()}}
  const col=hov?'#E10B2A':'#F5C518',L=hov?17:12,G=hov?5:4,B=hov?22:17,K=hov?8:6;
  c.shadowColor=col;c.shadowBlur=hov?16:10;c.strokeStyle=col;c.lineWidth=2.2;c.beginPath();
  c.moveTo(mx-L,my);c.lineTo(mx-G,my);c.moveTo(mx+G,my);c.lineTo(mx+L,my);c.moveTo(mx,my-L);c.lineTo(mx,my-G);c.moveTo(mx,my+G);c.lineTo(mx,my+L);c.stroke();
  c.lineWidth=1.6;c.beginPath();for(const[sx,sy]of[[-1,-1],[1,-1],[1,1],[-1,1]]){c.moveTo(mx+sx*B,my+sy*(B-K));c.lineTo(mx+sx*B,my+sy*B);c.lineTo(mx+sx*(B-K),my+sy*B)}c.stroke();c.shadowBlur=0;
  for(let i=sp.length-1;i>=0;i--){const p=sp[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.09;p.l-=.032;if(p.l<=0){sp.splice(i,1);continue}
   c.strokeStyle=`rgba(${p.c},${p.l})`;c.lineWidth=1.6;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(p.x-p.vx*2.5,p.y-p.vy*2.5);c.stroke()}
  for(let i=rays.length-1;i>=0;i--){const r=rays[i];r.l-=.08;if(r.l<=0){rays.splice(i,1);continue}
   c.strokeStyle=`rgba(255,240,170,${r.l})`;c.lineWidth=2;c.beginPath();c.moveTo(r.x+Math.cos(r.a)*r.r*(1-r.l)*.6,r.y+Math.sin(r.a)*r.r*(1-r.l)*.6);c.lineTo(r.x+Math.cos(r.a)*r.r*(1.1-r.l),r.y+Math.sin(r.a)*r.r*(1.1-r.l));c.stroke()}})
 $$('[data-tilt]').forEach(el=>{const zn=el.closest('[data-zone]')||el;zn.addEventListener('mousemove',e=>{const r=zn.getBoundingClientRect(),x=Math.min(1,Math.max(0,(e.clientX-r.left)/r.width)),y=Math.min(1,Math.max(0,(e.clientY-r.top)/r.height));
  const M=+el.dataset.tm||18;el.style.transform=`perspective(800px) rotateY(${(x-.5)*M}deg) rotateX(${(.5-y)*M}deg) translateZ(0)`;el.style.setProperty('--mx',x*100+'%');el.style.setProperty('--my',y*100+'%')});
  zn.addEventListener('mouseleave',()=>el.style.transform='')});
 $$('[data-mag]').forEach(el=>{el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.25}px,${(e.clientY-r.top-r.height/2)*.35}px)`});el.addEventListener('mouseleave',()=>el.style.transform='')})}
/* network canvas */
const cv=$('#bg');if(!RM){const x=cv.getContext('2d');let W,H,P=[],run=true;
 const size=()=>{W=cv.width=innerWidth;H=cv.height=innerHeight;P=Array.from({length:innerWidth<700?20:42},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.5}))};
 size();addEventListener('resize',size);
 function loop(){x.clearRect(0,0,W,H);
  for(const p of P){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
   const dx=mx-p.x,dy=my-p.y,d=Math.hypot(dx,dy);if(d<160){p.x-=dx*.012;p.y-=dy*.012;x.strokeStyle=`rgba(225,11,42,${1-d/160})`;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(mx,my);x.stroke()}
   x.fillStyle='rgba(245,197,24,.55)';x.fillRect(p.x,p.y,2,2)}
  for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++){const d=Math.hypot(P[i].x-P[j].x,P[i].y-P[j].y);if(d<110){x.strokeStyle=`rgba(245,197,24,${.1*(1-d/110)})`;x.beginPath();x.moveTo(P[i].x,P[i].y);x.lineTo(P[j].x,P[j].y);x.stroke()}}}
 addTask(loop)}
})();
