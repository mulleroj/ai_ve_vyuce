(() => {
 const menu=document.getElementById('site-menu');
 const groups=[...document.querySelectorAll('.nav-group')];
 const mobile=window.matchMedia('(max-width: 1060px)');
 const areaByTarget={
  'hub-start':'start','safe-start':'start','basics':'start',
  'hub-prepare':'prepare','lesson':'prepare','materials':'prepare','worksheet':'prepare','test':'prepare','prompts':'prepare','workflow':'prepare',
  'hub-teach':'teach','activities':'teach','english':'teach','student-ai':'teach',
  'hub-tools':'tools','compare':'tools','compare-choice':'tools','assistant-agent':'tools',
  'hub-create':'create','vibe':'create','build':'create',
  'hub-discover':'discover','magazine':'discover','article':'discover','series':'discover','dily':'discover','dil-1':'discover','dil-2':'discover','dil-3':'discover','dil-4':'discover'
 };
 function setCurrent(area){
  groups.forEach(group=>{
   const current=group.dataset.area===area;
   const summary=group.querySelector('summary');
   group.classList.toggle('is-current',current);
   if(current)summary?.setAttribute('aria-current','location');
   else summary?.removeAttribute('aria-current');
  });
 }
 const areaElements=[...document.querySelectorAll('[id]')].filter(element=>areaByTarget[element.id]).map(element=>({element,area:areaByTarget[element.id]}));
 function syncHash(){const id=decodeURIComponent(location.hash.slice(1));if(areaByTarget[id])setCurrent(areaByTarget[id]);}
 let scrollPending=false;
 function syncScrollArea(){let area=document.body?.classList?.contains('series-page')?'discover':null;for(const item of areaElements){if(item.element.getBoundingClientRect().top<=150)area=item.area;}setCurrent(area);}
 window.addEventListener('scroll',()=>{if(scrollPending)return;scrollPending=true;requestAnimationFrame(()=>{scrollPending=false;syncScrollArea();});},{passive:true});
 window.addEventListener('resize',syncScrollArea);
 if(menu){
  menu.open=!mobile.matches;
  syncHash();
  requestAnimationFrame(syncScrollArea);
  window.addEventListener('hashchange',()=>{syncHash();syncScrollArea();});
  document.addEventListener('keydown',event=>{
   if(event.key!=='Escape')return;
   const openGroup=groups.find(group=>group.open);
   const activeGroup=document.activeElement?.closest('.nav-group');
   const wasOpen=Boolean(openGroup)||(mobile.matches&&menu.open);
   if(!wasOpen)return;
   event.preventDefault();
   groups.forEach(group=>{group.open=false;});
   if(mobile.matches){menu.open=false;menu.querySelector('.menu-toggle')?.focus();}
   else (activeGroup||openGroup)?.querySelector('summary')?.focus();
  });
  document.addEventListener('click',event=>{
   if(menu.contains(event.target))return;
   groups.forEach(group=>{group.open=false;});
   if(mobile.matches)menu.open=false;
  });
  menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
   const group=link.closest('.nav-group');
   if(group)setCurrent(group.dataset.area);
   groups.forEach(item=>{item.open=false;});
   if(mobile.matches)menu.open=false;
  }));
  mobile.addEventListener?.('change',()=>{menu.open=!mobile.matches;groups.forEach(group=>{group.open=false;});});
 }
 const brief=document.getElementById('app-brief');
 if(brief)brief.addEventListener('submit',event=>{
  event.preventDefault();
  const goal=brief.elements.goal.value.trim();
  const task=brief.elements.task.value;
  const output=document.getElementById('app-brief-output');
  output.textContent='Návrhové zadání: Vytvořte jednoduchou výukovou pomůcku, ve které žák '+task.toLowerCase()+'. Cílem je: '+goal+'. Nejprve navrhněte obrazovky a ověřovací úlohy. Nepoužívejte osobní údaje. Před použitím nechte učitele zkontrolovat obsah, přístupnost a správnost.';
 });
})();
