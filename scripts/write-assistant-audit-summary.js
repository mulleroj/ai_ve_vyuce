const fs=require('node:fs');
const file='artifacts/assistant-catalog-audit.json';
const dest=process.env.GITHUB_STEP_SUMMARY;
if(!fs.existsSync(file)){fs.appendFileSync(dest,'# Assistant and catalog audit\n\nEvidence JSON was not produced. Inspect job logs.\n');process.exit(0)}
const r=JSON.parse(fs.readFileSync(file,'utf8'));
const lines=['# Assistant and catalog audit','','Source commit: '+r.targetSha,'','## Pages'];
for(const p of r.pages){
 lines.push('','### '+p.file,'','- Title: '+p.title,'- Description: '+p.description,'- Canonical: '+p.canonical,'- Main landmarks: main='+p.landmarks.main+', role=main='+p.landmarks.roleMain,'- Card count: '+p.cards.length+'; card elements: '+JSON.stringify(p.cardTagCounts),'- Styles: '+p.styles.join(', ')+'; inline style blocks: '+p.inlineStyleCount,'- Background: body '+p.pageBackground+'; hero '+p.heroBackground+' / '+p.heroBackgroundImage,'- Axe: '+p.axe.violations.length+' confirmed violation(s), '+p.axe.incomplete.length+' manual-review item(s), '+p.axe.passes+' passed checks','- Screenshots include desktop 1440, tablet 768, mobile 390, mobile menu open and local navigation open.');
 for(const c of p.cards)lines.push('  - '+c.title+' ('+c.provider+'): '+c.description+'; href: '+c.links.map(x=>x.href).join(', '));
 for(const v of p.axe.violations)lines.push('  - '+v.id+' ['+v.impact+']: '+v.help+'; nodes: '+v.nodes.map(n=>n.target.join(', ')).join(' | '));
 for(const x of p.viewports.filter(v=>v.overflow))lines.push('- Horizontal overflow at '+x.viewport+'px');
 if(p.filters)for(const f of p.filters)lines.push('- Filter '+f.name+': selected='+f.pressed+', visible='+f.visibleCards.join(', ')+', empty state='+f.emptyStateVisible);
 lines.push('- Mobile menu: Enter expanded='+p.mobileKeyboard.expandedAfterEnter+', visible='+p.mobileKeyboard.menuVisibleAfterEnter+'; Escape expanded='+p.mobileKeyboard.expandedAfterEscape+', focus restored='+p.mobileKeyboard.focusRestored);
}
lines.push('','## Findings','',...(r.findings.length?r.findings.map(x=>'- '+x):['- No automated runtime or overflow findings.']));
lines.push('','## Axe manual review','');
for(const p of r.manualReview)lines.push('- '+p.file+': '+p.checks.map(x=>x.id+' ('+x.impact+')').join(', '));
lines.push('','## No-JavaScript behavior','');
for(const x of r.noJs)lines.push('- '+x.file+': cards='+x.cards+', empty state visible='+x.emptyStateVisible+', nav visible='+x.navVisible+', nav links='+x.navLinks.length+', overflow='+x.overflow);
lines.push('','## Repeated links (context matters)','');
for(const x of r.duplicateHrefGroups)lines.push('- '+x.href+' ('+x.contexts.length+' occurrences): '+x.contexts.map(c=>c.page+' / '+c.context).join('; '));
fs.appendFileSync(dest,lines.join('\n')+'\n');
