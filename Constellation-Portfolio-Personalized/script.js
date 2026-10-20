/*
 * UI / ROUTING — generally you will not need to edit this file.
 * All actual portfolio content is in site-data.js.
 * Cover mockups are CSS-drawn illustrations; they are not real screenshots.
 */
(() => {
  'use strict';
  const D = window.PORTFOLIO_DATA || {profile:{},projects:[],skills:[],experience:[]};
  const profile = D.profile || {};
  const projects = D.projects || [];
  const app = document.getElementById('main');
  const esc = (str='') => String(str??'').replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
  const safeUrl = (url='') => /^(https?:\/\/|mailto:|assets\/)/i.test(url) ? esc(url) : '';
  const graphic = (p, index=1, caseView=false) => {
    const art = {
      'virtual-classroom': `<div class="vc-shell"><div class="vc-sidebar"><div class="vc-logo">v</div><i></i><i></i><i></i><i></i></div><div class="vc-main"><div class="vc-head"><span>Human Biology · Live class</span><span class="vc-live">● LIVE</span></div><div class="vc-tiles"><div class="vc-person"><span class="vc-avatar">SM</span><small>Dr. Mitchell</small></div><div class="vc-person"><span class="vc-avatar">IV</span><small>Ivan</small></div><div class="vc-person"><span class="vc-avatar">KR</span><small>Kristian</small></div><div class="vc-person"><span class="vc-avatar">+8</span><small>Participants</small></div></div><div class="vc-controls"><i></i><i></i><i></i><i></i></div></div></div>`,
      'aquatrack': `<div class="aqua-bubble"></div><div class="aqua-bubble"></div><div class="aqua-splash">≈</div><div class="aqua-phone"><div class="aqua-top"><span>aquatrack.</span><span class="aqua-drop">◉</span></div><div class="aqua-greet">Stay hydrated 💧</div><div class="aqua-sub">Your daily progress</div><div class="aqua-ring"></div><div class="aqua-amount">1,520 / 2,000 ml</div><div class="aqua-buttons"><span>+ 150 ml</span><span>+ 250 ml</span></div></div>`,
      'plantatree': `<div class="tree-orb"></div><div class="tree-app"><div class="tree-top"><span>planta<span style="color:#85a05b">tree.</span></span><span>☰</span></div><div class="tree-title">Explore trees</div><div class="tree-chips"><span>All trees</span><span>Fruit</span><span>Big trees</span></div><div class="tree-cards"><div class="tree-mini"><span class="plant">🌳</span><small>Oak</small></div><div class="tree-mini"><span class="plant">🌲</span><small>Pine</small></div><div class="tree-mini"><span class="plant">🌴</span><small>Palm</small></div></div></div>`,
      'public-transport': `<div class="route-deco">↗</div><div class="route-board"><div class="route-head"><span>on the move.</span><span class="route-bus">BUS 4</span></div><div class="route-title">Your next stops</div><div class="route-line"><div class="route-stop">Eindhoven Centraal <span>NOW</span></div><div class="route-stop">Piazza <span>4 min</span></div><div class="route-stop">Strijp-S <span>9 min</span></div><div class="route-stop">Woensel <span>14 min</span></div></div></div>`,
      'pokemon-explorer': `<div class="poke-back"></div><div class="poke-card"><div class="poke-head">Bulbasaur <span>HP 45</span></div><div class="poke-figure">🌱</div><div class="poke-stats"><span>Grass · Poison</span><span>#001</span></div><div class="poke-bars"><i></i><i></i><i></i></div></div>`,
      'virtual-library': `<div class="book-frame"><div class="book-head"><span>your bookshelf.</span><span>+</span></div><div class="book-search">⌕ &nbsp; Search your books...</div><div class="book-shelf"><div class="book">THE DESIGN OF EVERYDAY THINGS</div><div class="book">CREATIVE CONFIDENCE</div><div class="book">ATOMIC HABITS</div><div class="book">STEAL LIKE AN ARTIST</div></div><div class="book-footer">04 BOOKS &nbsp; · &nbsp; MY COLLECTION</div></div>`
    };
    const cover = safeUrl(p.cover);
    const visual = cover ? `<img src="${cover}" alt="${esc(p.title)} project screenshot" loading="lazy">` : `<div class="art-inner">${art[p.slug]||`<div style="font:700 clamp(65px,10vw,160px) var(--display)">${esc(p.title.slice(0,2).toUpperCase())}✳</div>`}</div>`;
    const artClass = art[p.slug] ? 'art-'+p.slug : 'art-virtual-library';
    return `<div class="${caseView?'case-cover':'card-visual'} ${artClass}" aria-label="${cover?'Screenshot from':'Illustrative preview of'} ${esc(p.title)}">${visual}<span class="card-number">${String(index).padStart(2,'0')} / ${String(projects.length).padStart(2,'0')}</span><span class="art-label">${esc(p.type || p.category || 'Project')}</span>${caseView?'':'<span class="card-go" aria-hidden="true">↗</span>'}</div>`;
  };
  const card = (p,index) => `<a class="project-card" href="#/project/${encodeURIComponent(p.slug)}" data-kind="${/Development/i.test(p.category) ? 'development' : 'design'}" aria-label="Read case study: ${esc(p.title)}">${graphic(p,index)}<div class="card-meta"><div><h3>${esc(p.title)} <span aria-hidden="true" style="color:var(--lime);font-size:.65em">↗</span></h3><p>${esc(p.summary)}</p></div><div class="card-tags"><span>${esc(p.category)}</span><span>${esc(p.year)}</span></div></div></a>`;
  const small = (label,number) => `<div class="section-kicker"><span></span>${number} / ${label}</div>`;
  const contactSection = () => {
    const email = String(profile.email || '').trim();
    const linkedin = safeUrl(profile.linkedin);
    const github = safeUrl(profile.github);
    const cv = safeUrl(profile.resume);
    const sendTarget = `https://formsubmit.co/${encodeURIComponent(email)}`;
    return `<section id="contact" class="contact-section"><div class="wrap">
      ${small('NEXT CHAPTER','04')}
      <div class="contact-layout">
        <div class="contact-left">
          <h2 class="contact-heading">Have a project<br>in <em>mind?</em> <span aria-hidden="true">↗</span></h2>
          <p class="contact-description">I'm looking for a graduation internship where I can combine research, design and development. If you have an opportunity, an idea, or just want to say hello, I'd love to hear from you.</p>
          <div class="contact-actions">
            <a class="dark-pill" href="mailto:${esc(email)}">Email me directly <span>↗</span></a>
            ${linkedin?`<a class="outline-pill" href="${linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>`:''}
            ${github?`<a class="outline-pill" href="${github}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>`:''}
            ${cv?`<a class="outline-pill" href="${cv}" download="Martin-Hristov-CV.pdf">Download CV ↓</a>`:''}
          </div>
          <p class="direct-email">Or write to <a href="mailto:${esc(email)}">${esc(email)}</a></p>
        </div>
        <div class="contact-form-card">
          <div class="form-topline"><span>✳ SEND A MESSAGE</span><span>DELIVERS TO MY EMAIL ↗</span></div>
          <h3>Let's make something <em>great.</em></h3>
          <form class="inquiry-form" id="inquiry-form" action="${sendTarget}" method="POST" target="_blank">
            <label for="inquiry-name">YOUR NAME</label>
            <input id="inquiry-name" name="name" type="text" autocomplete="name" minlength="2" maxlength="100" placeholder="Your name" required>
            <label for="inquiry-email">EMAIL ADDRESS</label>
            <input id="inquiry-email" name="email" type="email" autocomplete="email" maxlength="180" placeholder="you@company.com" required>
            <label for="inquiry-message">YOUR MESSAGE</label>
            <textarea id="inquiry-message" name="message" minlength="10" maxlength="3000" placeholder="Tell me about your opportunity or project..." rows="6" required></textarea>
            <div class="form-under-message"><small>Whether it’s an internship, collaboration or a quick hello.</small><span id="message-count" aria-live="off">0 / 3000</span></div>
            <div class="form-honey" aria-hidden="true"><label for="company-website">Leave this empty</label><input id="company-website" name="_honey" type="text" tabindex="-1" autocomplete="off"></div>
            <input name="_subject" type="hidden" value="New portfolio message for Martin Hristov">
            <input name="_template" type="hidden" value="table">
            <input name="_captcha" type="hidden" value="false">
            <button class="inquiry-submit" type="submit"><span>Send message</span><span class="send-arrow" aria-hidden="true">↗</span></button>
            <p id="form-status" class="form-status" role="status" aria-live="polite">After you click send, the form opens securely and forwards the message to my email.</p>
          </form>
          <p class="form-privacy">Messages are sent through <a href="https://formsubmit.co/" target="_blank" rel="noopener noreferrer">FormSubmit</a> and forwarded to <a href="mailto:${esc(email)}">${esc(email)}</a>.</p>
        </div>
      </div>
    </div></section>`;
  };
  const home = () => {
    const featured = projects.filter(p=>p.featured !== false);
    const skillCards = (D.skills||[]).map((s,i)=>`<div class="skill-card"><span class="skill-no">${String(i+1).padStart(2,'0')} ✳</span><h3>${esc(s.title)}</h3><p>${(s.items||[]).map(esc).join(' · ')}</p></div>`).join('');
    const experiences = (D.experience||[]).map((e)=>`<div class="experience-row"><div><strong>${esc(e.organisation)}</strong></div><div><h3>${esc(e.role)}</h3><span class="period">${esc(e.period)}</span></div><p>${esc(e.description)}</p></div>`).join('');
    const aboutPars = (profile.about||[]).map(p=>`<p>${esc(p)}</p>`).join('');
    const portrait = safeUrl(profile.photo) ? `<img src="${safeUrl(profile.photo)}" alt="Portrait of ${esc(profile.name)}">` : '<div class="about-initials">MH.</div>';
    return `<section class="hero" id="top"><div class="hero-noise" aria-hidden="true"></div><div class="wrap"><div class="hero-topline"><div class="availability eyebrow"><span class="live-dot"></span>${esc(profile.availability||'Open for graduation internships')}</div><div class="hero-index">INDEPENDENT DESIGNER / 2026</div></div><div class="hero-content"><div class="hero-copy"><div class="eyebrow" style="color:var(--muted)">HEY, I'M ${esc((profile.name||'MARTIN').split(' ')[0]).toUpperCase()} ✳</div><h1><span class="line">Designing</span><span class="line"><span class="humane">digital</span> things</span><span class="line">that feel <span class="dot">human.</span></span></h1><p class="hero-desc">${esc(profile.intro||'UI/UX designer and creative developer creating thoughtful digital experiences.')}</p><div class="hero-personal"><span class="personal-mark">↳</span><span>${esc(profile.microNote||"From Bulgaria / Designing in Eindhoven / Always curious.")}</span></div></div><div class="hero-art" aria-hidden="true"><div class="orbital"></div><div class="orbital two"></div><div class="orbital three"></div><div class="orbit-glow"></div><div class="orbit-center">✳</div><div class="orbit-spark">✦</div><div class="orbit-spark s2">✦</div><div class="floating-ui"><div class="fu-top"><span>DESIGN SYSTEM</span><span>●●●</span></div><div class="fu-graph"><span style="height:38%"></span><span style="height:64%"></span><span style="height:45%"></span><span style="height:90%"></span><span style="height:66%"></span><span style="height:100%"></span><span style="height:76%"></span></div></div><div class="floating-palette"><span style="font:700 8px var(--display)">COLOUR STUDIES</span><div class="palette-dots"><i></i><i></i><i></i><i></i></div></div></div></div><div class="hero-bottom"><div class="mini-intro">${esc(profile.role||'UI/UX Designer & Creative Developer')}<br><span>${esc(profile.location||'Eindhoven, Netherlands')}</span></div><button class="process-toggle" id="process-toggle" type="button" aria-label="See next step in my creative process"><span class="process-symbol" aria-hidden="true">✳</span><span class="process-toggle-text"><span class="process-mini-label">MY CREATIVE LOOP · TAP TO EXPLORE</span><strong id="process-phase" aria-live="polite">01 &nbsp; Listen & learn</strong><small id="process-descriptor">Start with people, not pixels.</small></span><span class="process-arrow" aria-hidden="true">↻</span></button><div class="hero-links"><a class="pill-button" href="#/work">Explore my work <span>↘</span></a><a class="plain-link" href="#/about">More about me ↗</a></div></div></div></section><div class="band" aria-hidden="true"><div class="band-in">${Array.from({length:6},()=>'<span>RESEARCH</span><b>✳</b><span>DESIGN</span><b>✳</b><span>PROTOTYPE</span><b>✳</b><span>BUILD</span><b>✳</b>').join('')}</div></div><section id="work" class="work-section section-pad"><div class="wrap"><div class="section-intro"><div>${small('SELECTED PROJECTS','01')}<h2 class="section-title">Proof is in<br>the <em>work.</em></h2></div><p class="section-aside">A mix of thoughtful product design, prototyping, and front-end experiments. Made with curiosity and a lot of iterations. <strong style="color:var(--ink)">${String(featured.length).padStart(2,'0')} selected works.</strong></p></div><div class="work-controls" role="group" aria-label="Filter projects"><button type="button" data-filter="all" class="filter-btn active" aria-pressed="true">All projects <span>(${featured.length})</span></button><button type="button" data-filter="design" class="filter-btn" aria-pressed="false">UI/UX & apps</button><button type="button" data-filter="development" class="filter-btn" aria-pressed="false">Development</button></div><div class="projects-grid" id="projects-grid">${featured.map((p,i)=>card(p,projects.indexOf(p)+1)).join('')}</div></div></section><section id="about" class="about-section section-pad"><div class="wrap">${small('THE PERSON BEHIND THE PIXELS','02')}<div class="about-grid"><div class="about-photo">${portrait}</div><div class="about-text"><h2 class="large-copy">Curious by nature.<br>Designer by <em>choice.</em></h2>${aboutPars}<div class="about-details"><div><strong>My approach</strong><span>Understand people first, then make things simple.</span></div><div><strong>What I'm into</strong><span>UI/UX, front-end, visual design & new ideas.</span></div></div></div></div></div></section><section class="skills-section section-pad"><div class="wrap">${small('THE TOOLKIT','03')}<h2 class="skills-heading">What I bring <em>to the table.</em></h2><div class="skills-grid">${skillCards}</div><div class="skills-extras"><div class="skills-facts"><div class="skill-fact"><b>01</b><small>UI/UX INTERNSHIP</small></div><div class="skill-fact"><b>10+</b><small>PROJECTS DELIVERED</small></div></div><div class="tech-heading">CORE TECHNOLOGIES & TOOLS <span>✳</span></div><div class="tech-chips">${(D.coreTechnologies||[]).map(t=>`<span class="tech-chip">${esc(t)}</span>`).join('')}</div></div></div></section><section class="experience-section"><div class="wrap">${small('THE JOURNEY','03.5')}<h2 class="skills-heading" style="margin-top:18px">Experience <em>& education.</em></h2>${experiences}</div></section>${contactSection()}`;
  };
  const caseStudy = (p) => {
    const index=projects.indexOf(p), next=projects[(index+1)%projects.length]||p;
    const steps=(p.process||[]).map((s,i)=>{
      const parts=String(s.step).split('/');
      return `<div class="process-step"><span class="step-num">${String(i+1).padStart(2,'0')} / 0${(p.process||[]).length}</span><h3>${esc(parts.length>1?parts.slice(1).join('/').trim():s.step)}</h3><p>${esc(s.detail)}</p></div>`;
    }).join('');
    const gallery=(p.gallery||[]).filter(safeUrl).map(img=>`<img src="${safeUrl(img)}" alt="Additional screenshot from ${esc(p.title)}" loading="lazy">`).join('');
    const tools=(p.tools||[]).join(' · ');
    const link=safeUrl(p.link);
    return `<article><div class="wrap"><div class="case-hero"><div class="case-breadcrumb"><a href="#/work">← BACK TO WORK</a> &nbsp;/&nbsp; ${esc(p.category)}</div><h1 class="case-title">${esc(p.title)}<span style="color:var(--lime)">.</span></h1><div class="case-summary"><p>${esc(p.summary)}</p><span class="case-spark" aria-hidden="true">✳</span></div></div>${graphic(p,index+1,true)}${p.video && /^(?:assets\/[a-z0-9._/-]+\.mp4$|data:video\/mp4;base64,)/i.test(p.video)?`<section class="prototype-video"><div class="prototype-video-heading"><span>✳ PROTOTYPE IN MOTION</span><span>REAL SCREEN RECORDING ↗</span></div><div class="prototype-video-card"><video controls playsinline preload="metadata" poster="${safeUrl(p.videoPoster||p.cover)}" aria-label="Walkthrough video of ${esc(p.title)}"><source src="${safeUrl(p.video)}" type="video/mp4">Your browser does not support embedded video.</video></div><p>${esc(p.videoLabel||'Watch a short prototype demonstration.')}</p></section>`:''}<dl class="case-facts"><div><dt>My role</dt><dd>${esc(p.role||'Design & Development')}</dd></div><div><dt>Project</dt><dd>${esc(p.type||p.category)}</dd></div><div><dt>Year</dt><dd>${esc(p.year)}</dd></div></dl><section class="case-overview"><div class="case-label">01 / THE CONTEXT</div><div><h2>${esc(p.overview||p.summary)}</h2><p>${esc(p.challenge)}</p>${link?`<a href="${link}" target="_blank" rel="noopener noreferrer" class="text-cta">View project / prototype ↗</a>`:''}</div></section><section class="case-process">${small('FROM PROBLEM TO PROTOTYPE','02')}<h2>Behind the <em>process.</em></h2>${steps}<div style="color:var(--muted);font-size:12px;padding-top:16px"><strong style="color:var(--ink)">Methods & tools:</strong> ${esc(tools)}</div></section></div><section class="case-outcome"><div class="wrap outcome-inner"><div>${small('THE RESULT','03')}<h2>What came <em>out of it.</em></h2></div><div class="outcome-copy">${esc(p.outcome)}</div></div></section>${gallery?`<section class="case-gallery section-pad"><div class="wrap"><h2>Project screenshots</h2><p class="gallery-explainer">Captured from the original Figma prototype walkthrough.</p><div class="gallery-grid">${gallery}</div></div></section>`:''}<section class="case-next"><div class="wrap">${small('KEEP EXPLORING','04')}<a href="#/project/${encodeURIComponent(next.slug)}">Next up: ${esc(next.title)} <span>↗</span></a></div></section>${contactSection()}</article>`;
  };
  const moveToAnchor = (route) => {const id=route.replace(/^\//,'');if(['work','about','contact'].includes(id)){const el=document.getElementById(id);if(el)requestAnimationFrame(()=>el.scrollIntoView({behavior:'instant',block:'start'}));}else{window.scrollTo({top:0,behavior:'instant'});}};
  function render(){
    let route=decodeURIComponent(location.hash.slice(1)||'/');
    if(!route.startsWith('/')) route='/';
    if(route.startsWith('/project/')){
      const slug=route.slice(9);
      const p=projects.find(p=>p.slug===slug);
      app.innerHTML=p ? caseStudy(p) : `<div class="wrap" style="padding-top:100px;padding-bottom:140px"><h1>Project not found.</h1><a class="text-cta" href="#/work">← All projects</a></div>`;
      document.title=(p?p.title+' — ':'')+'Martin Hristov | Portfolio';
      window.scrollTo({top:0,behavior:'instant'});
    }else{
      app.innerHTML=home();
      document.title='Martin Hristov — UI/UX Designer & Creative Developer';
      moveToAnchor(route);
    }
    document.querySelectorAll('.desktop-nav a').forEach(a=>{const current = (route ==='/'+a.dataset.nav || (route.startsWith('/project/') && a.dataset.nav==='work'));a.classList.toggle('active',current);});
    const count=document.querySelector('.nav-count');if(count)count.textContent=`(${String(projects.filter(p=>p.featured!==false).length).padStart(2,'0')})`;
    document.querySelectorAll('.filter-btn').forEach(button=>button.addEventListener('click',()=>{
      const filter=button.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
      document.querySelectorAll('.project-card').forEach(c=>{c.hidden=filter!=='all' && c.dataset.kind!==filter;});
    }));
    document.getElementById('mobile-toggle').setAttribute('aria-expanded','false');
    document.getElementById('mobile-nav').hidden=true;
    updateProgress();
  }
  function updateProgress(){const d=document.documentElement;const scrolled=d.scrollTop/(d.scrollHeight-d.clientHeight||1);document.getElementById('page-progress').style.width=(scrolled*100)+'%';}
  document.getElementById('year').textContent=String(new Date().getFullYear());
  const toggle=document.getElementById('mobile-toggle'), mobile=document.getElementById('mobile-nav');
  toggle.addEventListener('click',()=>{mobile.hidden=!mobile.hidden;toggle.setAttribute('aria-expanded',String(!mobile.hidden));});
  mobile.addEventListener('click',(e)=>{if(e.target.closest('a')){mobile.hidden=true;toggle.setAttribute('aria-expanded','false');}});
  const themeButton=document.getElementById('theme-toggle');
  try{if(localStorage.getItem('mh-editorial-theme')==='light')document.body.classList.add('light');}catch(e){}
  themeButton.addEventListener('click',()=>{document.body.classList.toggle('light');try{localStorage.setItem('mh-editorial-theme',document.body.classList.contains('light')?'light':'dark');}catch(e){}themeButton.setAttribute('aria-label',document.body.classList.contains('light')?'Switch to dark theme':'Switch to light theme');});
  window.addEventListener('hashchange',render);
  window.addEventListener('scroll',updateProgress,{passive:true});
  window.addEventListener('resize',updateProgress);
  render();
})();
