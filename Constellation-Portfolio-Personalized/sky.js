/*
 * INTERACTIVE NIGHT SKY — written in vanilla JavaScript.
 *  • Subtle, slowly drifting stars with parallax and individual twinkles
 *  • Interactive constellations following a mouse/trackpad cursor
 *  • Click empty space for tiny starbursts and stardust trails
 *  • Occasional natural shooting stars plus a user-triggered meteor button
 *  • Easy to pause (existing motion toggle / OS reduced motion) or hide entirely
 *  • Canvas is decorative and never captures focus, touch, or clicks
 */
(() => {
  'use strict';
  const canvas = document.getElementById('sky-canvas');
  const context = canvas?.getContext('2d', { alpha: true });
  if (!canvas || !context) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(n, hi));
  const TAU = Math.PI * 2;
  const dock = document.createElement('div');
  dock.className = 'sky-dock';
  dock.setAttribute('role', 'group');
  dock.setAttribute('aria-label', 'Interactive background stars');
  dock.innerHTML = `
    <button type="button" class="sky-launch" id="sky-launch" aria-label="Send a shooting star across the sky" title="Send a shooting star">✦</button>
    <span class="sky-info"><span class="sky-title">SEND A STAR <span class="sky-count" id="sky-count">00</span></span>
    <span class="sky-subtitle">Move to connect · click to sparkle</span></span>
    <span class="sky-divider" aria-hidden="true"></span>
    <button type="button" class="sky-visibility" id="sky-visibility" aria-label="Hide background stars" aria-pressed="true" title="Hide background stars">✧</button>`;
  const toast = document.createElement('div');
  toast.className = 'sky-toast';
  toast.setAttribute('aria-hidden', 'true');
  toast.textContent = 'A little more light in the universe ✦';
  // Controls are mounted inside the homepage hero so they never obscure case studies.
  // Both are re-mounted whenever the original single-page router renders Home.
  const launchButton = dock.querySelector('#sky-launch');
  const visibilityButton = dock.querySelector('#sky-visibility');
  const counter = dock.querySelector('#sky-count');

  let enabled = true;
  try { enabled = localStorage.getItem('mh-sky-visible') !== 'false'; } catch (error) {}
  let width = 0, height = 0, dpr = 1, stars = [], meteors = [], particles = [], rings = [];
  let pointer = { x: -200, y: -200, active: false, softX: -200, softY: -200 };
  let previous = 0, frame = 0, nextMeteor = 0, count = 0, toastTimeout = 0;
  let lastTrail = 0, lastClick = 0;
  const isMoving = () => enabled && !document.hidden && !reduceMotion.matches && !document.body.classList.contains('motion-off');
  const lightMode = () => document.body.classList.contains('light');
  const rgba = (r, g, b, a) => `rgba(${r},${g},${b},${clamp(a, 0, 1)})`;

  function updateVisibility() {
    dock.dataset.skyVisible = String(enabled);
    visibilityButton.setAttribute('aria-pressed', String(enabled));
    visibilityButton.setAttribute('aria-label', enabled ? 'Hide background stars' : 'Show background stars');
    visibilityButton.title = enabled ? 'Hide stars' : 'Show stars';
    visibilityButton.textContent = enabled ? '✧' : '⊘';
    canvas.style.visibility = enabled ? 'visible' : 'hidden';
    if (enabled) startOrDraw();
    else stop();
  }
  visibilityButton.addEventListener('click', () => {
    enabled = !enabled;
    try { localStorage.setItem('mh-sky-visible', String(enabled)); } catch (error) {}
    updateVisibility();
  });

  function sizeCanvas() {
    width = Math.max(320, window.innerWidth);
    height = Math.max(320, window.innerHeight);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(230, Math.max(56, Math.floor(width * height / 6700)));
    // Spatially independent distribution (rather than a regular grid).
    stars = Array.from({ length: n }, (_, i) => ({
      x: Math.random(), y: Math.random(),
      radius: rand(.55, i % 8 === 0 ? 2.1 : 1.35),
      brightness: rand(.26, .74), phase: rand(0, TAU),
      drift: rand(.6, 1.8), travel: rand(3, 19), depth: rand(.35, 1),
      fourPoint: i % 11 === 0, tone: Math.random()
    }));
    particles = []; meteors = []; rings = [];
    startOrDraw();
  }

  function pos(star, t) {
    const drift = isMoving() ? t : 0;
    return {
      x: star.x * width + Math.cos(drift * .0001 * star.drift + star.phase) * star.travel + (pointer.softX - width / 2) * -.008 * star.depth,
      y: star.y * height + Math.sin(drift * .000075 * star.drift + star.phase) * star.travel + (pointer.softY - height / 2) * -.006 * star.depth
    };
  }
  function twinkle(x, y, radius, alpha, light, cross) {
    const col = light ? [69, 91, 71] : [216, 235, 198];
    context.fillStyle = rgba(...col, alpha);
    context.beginPath();
    context.arc(x, y, radius, 0, TAU);
    context.fill();
    if (cross) {
      context.strokeStyle = light ? rgba(91, 125, 93, alpha * .38) : rgba(212, 251, 146, alpha * .52);
      context.lineWidth = .8;
      context.beginPath();
      context.moveTo(x - radius * 3.1, y); context.lineTo(x + radius * 3.1, y);
      context.moveTo(x, y - radius * 3.1); context.lineTo(x, y + radius * 3.1);
      context.stroke();
    }
  }
  function drawStars(t) {
    const light = lightMode();
    const points = [];
    for (const star of stars) {
      const p = pos(star, t);
      const glow = isMoving() ? .8 + .2 * Math.sin(t * .0013 * star.drift + star.phase) : 1;
      const opacity = star.brightness * glow * (light ? .48 : .89);
      twinkle(p.x, p.y, star.radius, opacity, light, star.fourPoint);
      points.push(p);
    }
    if (!pointer.active || !finePointer.matches || !isMoving()) return;
    const near = points.map((p, i) => ({ ...p, i, d: Math.hypot(p.x - pointer.softX, p.y - pointer.softY) }))
      .filter(p => p.d < 157).sort((a, b) => a.d - b.d).slice(0, 7);
    for (const p of near) {
      const a = Math.pow(1 - p.d / 157, 1.4) * (light ? .21 : .37);
      context.strokeStyle = light ? rgba(77, 116, 78, a) : rgba(194, 239, 122, a);
      context.lineWidth = .85;
      context.beginPath();context.moveTo(pointer.softX, pointer.softY);context.lineTo(p.x, p.y);context.stroke();
      twinkle(p.x, p.y, 2.1 + a, clamp(a * 1.8, 0, .76), light, true);
    }
    for (let i = 0; i < near.length - 1; i++) {
      const a = near[i], b = near[i+1];
      if (Math.hypot(a.x-b.x, a.y-b.y) > 110) continue;
      context.strokeStyle = light ? rgba(96, 134, 72, .07) : rgba(194, 239, 122, .13);
      context.beginPath();context.moveTo(a.x, a.y);context.lineTo(b.x, b.y);context.stroke();
    }
    const glow = context.createRadialGradient(pointer.softX,pointer.softY,0,pointer.softX,pointer.softY,125);
    glow.addColorStop(0, light ? 'rgba(126,157,91,.047)' : 'rgba(206,245,143,.072)');
    glow.addColorStop(1, 'rgba(206,245,143,0)');
    context.fillStyle=glow;context.beginPath();context.arc(pointer.softX,pointer.softY,125,0,TAU);context.fill();
  }

  function newParticle(x, y, velocity = 1, life = 1.1) {
    if (particles.length > 120) particles.splice(0, 15);
    particles.push({x,y,vx:rand(-88,88)*velocity,vy:rand(-88,88)*velocity,r:rand(.8,2.5),life,maxLife:life,phase:rand(0,TAU)});
  }
  function burst(x, y, countParticles = 14) {
    if (!isMoving()) return;
    rings.push({x,y,r:2,life:.7,maxLife:.7});
    for(let i=0;i<countParticles;i++) newParticle(x,y,rand(.65,1.4),rand(.55,1.1));
    startOrDraw();
  }
  function shootingStar(manual = false) {
    if(!isMoving()) return;
    const y = rand(height*.06,height*.38), x = rand(width*.08,width*.44);
    meteors.push({x,y,vx:rand(430,680),vy:rand(125,260),life:0,duration:rand(.85,1.3),length:rand(115,190)});
    if(manual){
      count++;
      counter.textContent = String(count).padStart(2,'0');
      const notes = ['Curiosity looks good in the sky ✦', 'Another idea is on its way ↗', 'Good things start with a spark ✳', 'A little creative energy, sent. ✨'];
      toast.textContent = notes[(count-1) % notes.length];
      toast.classList.add('is-visible');
      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => toast.classList.remove('is-visible'), 2500);
      launchButton.animate?.([{transform:'scale(1)'},{transform:'scale(1.23) rotate(25deg)'},{transform:'scale(1)'}], {duration:520,easing:'cubic-bezier(.22,1,.36,1)'});
    }
  }
  launchButton.addEventListener('click', () => {
    if (!enabled) {enabled = true;updateVisibility();}
    shootingStar(true);
    launchButton.blur();
  });

  function drawMeteors(dt) {
    const light = lightMode();
    for(let i=meteors.length-1;i>=0;i--){
      const m=meteors[i]; m.life += dt;
      if(m.life > m.duration || m.x > width+220){meteors.splice(i,1);continue;}
      m.x += m.vx*dt;m.y+=m.vy*dt;
      const heading=Math.atan2(m.vy,m.vx);
      const tailX=m.x-Math.cos(heading)*m.length,tailY=m.y-Math.sin(heading)*m.length;
      const fade=clamp(Math.min(m.life*4,(m.duration-m.life)*3),0,1);
      const g=context.createLinearGradient(tailX,tailY,m.x,m.y);
      g.addColorStop(0,rgba(215,251,104,0));
      g.addColorStop(.5,light?rgba(111,140,77,fade*.28):rgba(215,251,104,fade*.44));
      g.addColorStop(1,light?rgba(84,128,68,fade*.88):rgba(237,255,209,fade*.96));
      context.strokeStyle=g;context.lineWidth=2.25;context.lineCap='round';
      context.beginPath();context.moveTo(tailX,tailY);context.lineTo(m.x,m.y);context.stroke();
      twinkle(m.x,m.y,2.5,fade,light,true);
      if (Math.random() < .65) particles.push({x:m.x-rand(0,35),y:m.y-rand(0,10),vx:rand(-20,12),vy:rand(5,24),r:rand(.5,1.15),life:rand(.2,.45),maxLife:.45});
    }
  }
  function drawParticles(dt){
    const light=lightMode();
    for(let i=particles.length-1;i>=0;i--){
      const p=particles[i];p.life-=dt;
      if(p.life<=0){particles.splice(i,1);continue;}
      p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.985;p.vy*=.985;
      context.fillStyle=light?rgba(78,122,62,(p.life/p.maxLife)*.45):rgba(217,252,139,(p.life/p.maxLife)*.76);
      context.beginPath();context.arc(p.x,p.y,p.r,0,TAU);context.fill();
    }
    for(let i=rings.length-1;i>=0;i--){
      const r=rings[i];r.life-=dt;
      if(r.life<=0){rings.splice(i,1);continue;}
      r.r += dt*85;
      context.strokeStyle=light?rgba(95,135,63,r.life*.21):rgba(217,252,139,r.life*.45);
      context.lineWidth=1;context.beginPath();context.arc(r.x,r.y,r.r,0,TAU);context.stroke();
    }
  }
  function render(now) {
    frame = 0;
    if (!enabled) return;
    const moving = isMoving();
    const dt = moving ? clamp((now-(previous||now))/1000, 0, .05) : 0;
    previous = now;
    context.clearRect(0,0,width,height);
    if(moving){
      pointer.softX += (pointer.x-pointer.softX)*Math.min(1,dt*5);
      pointer.softY += (pointer.y-pointer.softY)*Math.min(1,dt*5);
      if(!nextMeteor)nextMeteor=now+6500;
      if(now>nextMeteor){shootingStar(false);nextMeteor=now+rand(7500,15000);}
    }
    drawStars(now);
    if(moving){drawMeteors(dt);drawParticles(dt);frame=requestAnimationFrame(render);}
  }
  function stop(){if(frame)cancelAnimationFrame(frame);frame=0;previous=0;}
  function startOrDraw(){
    stop();
    launchButton.disabled = !isMoving();
    launchButton.title = launchButton.disabled ? 'Turn on motion to send a star' : 'Send a shooting star';
    if(enabled)frame=requestAnimationFrame(render);
  }

  let pendingResize;
  window.addEventListener('resize', () => {
    clearTimeout(pendingResize);
    pendingResize = setTimeout(sizeCanvas, 110);
  }, {passive:true});
  document.addEventListener('pointermove', e => {
    if(!finePointer.matches || !enabled || !isMoving()) return;
    pointer.x=e.clientX;pointer.y=e.clientY;pointer.active=true;
    if (pointer.softX<0) {pointer.softX=e.clientX;pointer.softY=e.clientY;}
    if(e.timeStamp-lastTrail>53 && !e.target.closest('button,a,input,textarea,select,.project-card')){
      lastTrail=e.timeStamp;
      if(Math.random()<.57) newParticle(e.clientX+rand(-7,7),e.clientY+rand(-7,7),.12,.44);
    }
  }, {passive:true});
  document.addEventListener('pointerout', e => {if(!e.relatedTarget)pointer.active=false;}, {passive:true});
  document.addEventListener('click', e => {
    if (!enabled || !isMoving() || e.timeStamp-lastClick<200 || e.target.closest('a,button,input,textarea,select,summary,[role="button"],.project-card')) return;
    lastClick=e.timeStamp;burst(e.clientX,e.clientY,17);
  });
  document.addEventListener('visibilitychange',startOrDraw);
  reduceMotion.addEventListener?.('change', startOrDraw);
  // Sync with the existing "motion off" and theme controls (no duplicated settings).
  new MutationObserver(startOrDraw).observe(document.body,{attributes:true,attributeFilter:['class']});

  // Route-safe hero copy. Does not change the original routing script or its data.
  function decorateHero(){
    const hero=document.querySelector('.hero');
    if(!hero || hero.querySelector('.sky-orbit-mark'))return;
    const micro=hero.querySelector('.hero-personal');
    if(micro){const orbit=document.createElement('span');orbit.className='sky-orbit-mark';orbit.setAttribute('aria-hidden','true');micro.append(orbit);}
    const wrap=hero.querySelector('.wrap');
    if(wrap){
      wrap.append(dock, toast);
      const cue=document.createElement('div');cue.className='sky-scroll-cue';cue.setAttribute('aria-hidden','true');
      cue.innerHTML='<span>✧</span> AN INTERACTIVE LITTLE UNIVERSE <span>✧</span>';
      wrap.append(cue);
    }
  }
  window.addEventListener('hashchange', () => requestAnimationFrame(decorateHero));
  decorateHero();
  sizeCanvas();
  updateVisibility();
})();
