// Ramesh Kandli — Premium interaction layer
(() => {
  const $=(s,root=document)=>root.querySelector(s), $$=(s,root=document)=>[...root.querySelectorAll(s)];
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav=$('#navbar'), menu=$('#menuBtn'), links=$('#navlinks');
  const year=$('#year'); if(year) year.textContent=new Date().getFullYear();
  const closeMenu=()=>{if(!menu||!links)return;links.classList.remove('open');document.body.classList.remove('menu-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open menu');menu.textContent='☰'};
  if(menu&&links){menu.addEventListener('click',e=>{e.preventDefault();const open=!links.classList.contains('open');links.classList.toggle('open',open);document.body.classList.toggle('menu-open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close menu':'Open menu');menu.textContent=open?'×':'☰'});$$('a',links).forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('click',e=>{if(links.classList.contains('open')&&!nav.contains(e.target))closeMenu()});window.addEventListener('resize',()=>{if(innerWidth>760)closeMenu()});}
  const progress=$('#readingProgress');
  const updateScroll=()=>{const max=document.documentElement.scrollHeight-innerHeight;if(progress)progress.style.width=(max>0?scrollY/max*100:0)+'%';if(nav)nav.classList.toggle('scrolled',scrollY>35)};
  addEventListener('scroll',updateScroll,{passive:true});updateScroll();
  const observer=('IntersectionObserver'in window)?new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12}):null;
  $$('.reveal').forEach(el=>observer?observer.observe(el):el.classList.add('visible'));
  if(!reduced){const field=$('#sparkleField');if(field&&!field.children.length){for(let i=0;i<26;i++){const d=document.createElement('i');d.style.setProperty('--x',Math.random()*100+'%');d.style.setProperty('--dur',(9+Math.random()*13)+'s');d.style.setProperty('--drift',(Math.random()*100-50)+'px');d.style.setProperty('--delay',(-Math.random()*20)+'s');field.appendChild(d)}}}
  // Gentle pointer aura only on devices with a precise pointer.
  if(matchMedia('(pointer:fine)').matches&&!reduced){const aura=$('#cursorAura');if(aura){addEventListener('pointermove',e=>{aura.style.left=e.clientX+'px';aura.style.top=e.clientY+'px';aura.style.opacity='.85'},{passive:true});document.addEventListener('pointerleave',()=>aura.style.opacity='0')}}
  // Theme switch persists on this device.
  const theme=$('#themeToggle');let light=false;try{light=localStorage.getItem('rk-theme')==='light'}catch(e){};
  const setTheme=v=>{document.body.classList.toggle('light-mode',v);if(theme){theme.textContent=v?'☾':'☼';theme.setAttribute('aria-label',v?'Switch to dark theme':'Switch to light theme')}try{localStorage.setItem('rk-theme',v?'light':'dark')}catch(e){}};setTheme(light);
  theme?.addEventListener('click',()=>setTheme(!document.body.classList.contains('light-mode')));
  // Gallery filter + live search.
  const chips=$$('.filter-chip'), tiles=$$('#gallery .tile'), gallerySearch=$('#gallerySearch');let active='all';
  const filterGallery=()=>{const q=(gallerySearch?.value||'').trim().toLowerCase();tiles.forEach(tile=>{const category=tile.dataset.category||'all';const text=tile.innerText.toLowerCase();const ok=(active==='all'||category===active)&&(!q||text.includes(q));tile.classList.toggle('is-hidden',!ok)})};
  chips.forEach(chip=>chip.addEventListener('click',()=>{active=chip.dataset.filter||'all';chips.forEach(c=>c.classList.toggle('active',c===chip));filterGallery()}));gallerySearch?.addEventListener('input',filterGallery);
  // Gallery lightbox: cards are stylized artwork panels, not fake personal photos.
  const box=$('#lightbox'), art=$('#lightboxArt'), title=$('#lightboxTitle'), desc=$('#lightboxDescription'), category=$('#lightboxCategory');
  const openTile=tile=>{if(!box)return;const h= $('h3',tile),p=$('p',tile),small=$('small',tile);title.textContent=h?.textContent||'A moment worth remembering';desc.textContent=p?.textContent||'';category.textContent=small?.textContent||'MEMORY';const bg=getComputedStyle(tile).getPropertyValue('--tileimg').trim();art.style.setProperty('--art',bg&&bg!=='none'?`linear-gradient(135deg,#32172e,#111a36),${bg}`:getComputedStyle(tile).getPropertyValue('--tilebg'));box.classList.add('open');document.body.style.overflow='hidden';$('#lightboxClose')?.focus()};
  const closeBox=()=>{box?.classList.remove('open');document.body.style.overflow=''};
  tiles.forEach(tile=>{tile.addEventListener('click',()=>openTile(tile));tile.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openTile(tile)}})});
  $('#lightboxClose')?.addEventListener('click',closeBox);box?.addEventListener('click',e=>{if(e.target===box)closeBox()});
  // In-page search for sections.
  const searchBox=$('#siteSearch'), searchInput=$('#siteSearchInput'), results=$('#siteSearchResults');
  const sections=[...$$('main section[id]')].map(s=>({id:s.id,title:($('h1,h2',s)?.textContent||s.id).trim(),desc:($('.section-sub',s)?.textContent||'').trim()}));
  const renderResults=q=>{if(!results)return;const found=sections.filter(s=>(s.title+' '+s.desc+' '+s.id).toLowerCase().includes(q.toLowerCase()));results.innerHTML='';(found.length?found:[]).forEach(s=>{const a=document.createElement('a');a.href='#'+s.id;a.className='btn btn-secondary';a.style.justifyContent='space-between';a.innerHTML='<span></span><b>↗</b>';a.firstElementChild.textContent=s.title;results.appendChild(a);a.addEventListener('click',()=>{searchBox.classList.remove('open');document.body.style.overflow='';})});if(!found.length){const p=document.createElement('p');p.style.color='#c9c3d2';p.textContent='No matching section. Try “about”, “gallery”, “skills” or “contact”.';results.appendChild(p)}};
  $('#searchToggle')?.addEventListener('click',()=>{searchBox.classList.add('open');document.body.style.overflow='hidden';renderResults('');searchInput?.focus()});searchInput?.addEventListener('input',()=>renderResults(searchInput.value));$('#siteSearchClose')?.addEventListener('click',()=>{searchBox.classList.remove('open');document.body.style.overflow=''});searchBox?.addEventListener('click',e=>{if(e.target===searchBox){searchBox.classList.remove('open');document.body.style.overflow=''}});
  // Escape closes overlays and mobile navigation.
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeBox();searchBox?.classList.remove('open');document.body.style.overflow='';closeMenu()}});
  // Scroll-to-top button.
  $('#toTop')?.addEventListener('click',()=>scrollTo({top:0,behavior:reduced?'auto':'smooth'}));
  // Form: prepare a real email draft rather than pretending a backend is connected.
  const form=$('#contactForm'),toast=$('#toast');let toastTimer;
  const showToast=msg=>{if(!toast)return;toast.textContent=msg;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),4200)};
  form?.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);const subject=encodeURIComponent(data.get('subject')||'Website message from '+data.get('name'));const body=encodeURIComponent('Name: '+data.get('name')+'\nEmail: '+data.get('email')+'\n\n'+data.get('message'));showToast('Opening your email app with the message ready to send.');location.href='mailto:prameshbhai270@gmail.com?subject='+subject+'&body='+body});
  // Tap feedback, no forced tilt on touch devices.
  document.addEventListener('pointerdown',e=>{const target=e.target.closest('a,button,.tile');if(!target)return;target.classList.remove('tap-pop');void target.offsetWidth;target.classList.add('tap-pop');setTimeout(()=>target.classList.remove('tap-pop'),420)},{passive:true});
  if(matchMedia('(pointer:fine)').matches&&!reduced){$$('.tile,.skill,.stat').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;card.style.transform=`perspective(850px) rotateX(${(.5-y)*3}deg) rotateY(${(x-.5)*4}deg) translateY(-3px)`});card.addEventListener('pointerleave',()=>card.style.transform='')})}
})();
