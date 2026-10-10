const specs=[
{id:'q',name:'Průtok Jordánu',min:20,max:300,step:5,def:100,u:'m³/s',rec:'<b>50 m³/s</b> – orientační průtok blízký historickému celoročnímu průměru. <b>100 m³/s</b> – scénář výrazného jarního rozvodnění. Jsou to přibližné hodnoty pro porovnání v modelu, nikoli doložené průtoky z Jozuovy doby. Skutečný jarní průtok u Adamu neznáme.',desc:'Kolik vody přiteče k hrázi vody za sekundu. Skutečný průtok v době Jozua neznáme.'},
{id:'t',name:'Doba zadržování',min:1,max:72,step:1,def:21,u:'h',rec:'12–24 h pro orientační scénář; Bible přesnou dobu neudává.',desc:'Celková doba přerušení průtoku, včetně případného čekání a přechodu.'},
{id:'l',name:'Délka modelovaného úseku proti proudu',min:2,max:60,step:1,def:20,u:'km',rec:'10–30 km na začátek; prodluž, pokud model hlásí, že voda zasahuje dál.',desc:'Délka zkoumaného úseku nad Adamem. Není to automaticky skutečná délka jezera.'},
{id:'b',name:'Průměrná šířka zaplavené nivy',min:100,max:1000,step:25,def:350,u:'m',rec:'Pracovní odhad 300–400 m; výchozí hodnota 350 m. Jde o odhad z mapového pozorování, nikoli měření ani pevnou hranici záplavy.',desc:'Efektivní průměrná šířka modelového zatopeného prostoru NAD Adamem. Nejde o šířku vlastního říčního koryta. Nově se šířka u hráze zvětšuje a proti proudu postupně zužuje podle hloubky; průměrná zadaná šířka je modelovým parametrem.'},
{id:'s',name:'Podélný sklon říčního úseku',min:.1,max:3,step:.05,def:.6,u:'m/km',rec:'0,56 m/km jako publikovaná reference pro sousední geomorfologický úsek; citlivost 0,3–1,1 m/km.',desc:'Sklon je zjednodušený konstantní. Není nahrazen skutečným digitálním výškovým profilem.'},
{id:'z',name:'Ztráty ze zadržovaného objemu',min:0,max:60,step:5,def:0,u:'%',rec:'0 % při úplném zadržení; pro citlivostní analýzu lze zkusit 5–20 %. Jde o předpoklad, nikoliv naměřenou ztrátu.',desc:'Podíl přitékající vody, který se neakumuluje v modelovaném prostoru (např. průsaky podložím nebo odtok do bočních částí údolí mimo zvolenou oblast). Rozlití vody do území zahrnutého v nastavené šířce se za ztrátu nepovažuje.'}
];const $=id=>document.getElementById(id);let st={};let profileScaleMode='true';const f=(x,d=2)=>new Intl.NumberFormat('cs-CZ',{maximumFractionDigits:d}).format(x);const query=new URLSearchParams(location.search);
for(const s of specs){let val=Number(query.get(s.id));if(!query.has(s.id)||!Number.isFinite(val))val=s.def;val=Math.max(s.min,Math.min(s.max,val));st[s.id]=val;let div=document.createElement('div');div.className='ctl';div.innerHTML=`<label for="${s.id}">${s.name}<output id="o_${s.id}"></output></label><input type="range" id="${s.id}" min="${s.min}" max="${s.max}" step="${s.step}" value="${val}"><p class="help">${s.desc}</p><div class="rec"><b>Doporučení:</b> ${s.rec}</div>`;(s.id==='q'||s.id==='t'||s.id==='b'?$('controls'):document.getElementById('advancedControls')).append(div);div.querySelector('input').addEventListener('input',e=>{st[s.id]=+e.target.value;draw()})}
function draw(){for(const s of specs)$('o_'+s.id).textContent=f(st[s.id],s.id==='s'?2:0)+' '+s.u;const{q,t,l,b,s,z}=st;const input=q*t*3600,V=input*(1-z/100),S=s/1000,L=l*1000;const g=window.JordanGeometry.solve(V,s,b,l);
const H=g.height, floodLength=H/S, overflow=g.overflow, floodUsed=g.reach;
window.JordanAnalytic={...g,volume:V,gradient:s,width:b,limit:l};
const p=9.81*H,tons=p/9.80665;
$('volume').textContent=f(V/1e6,3);$('height').textContent=f(H,2)+' m';$('tonnes').textContent=f(tons,2)+' t/m²';$('pressure').textContent=f(p,1)+' kN/m²';$('interpretation').innerHTML=`Do modelované oblasti přiteklo <b>${f(input/1e6,2)} mil. m³</b> vody; zůstalo <b>${f(V/1e6,2)} mil. m³</b> (přibližně <b>${f(V/2500,0)} olympijských bazénů</b>). Voda by zvýšila tlak na 1 m² v úrovni dna o sílu odpovídající tíze přibližně <b>${f(tons,2)} tun</b>. Nejde o hmotnost samotné stěny.`;
const al=$('alert');al.className='alert'+(overflow?'':' good');al.innerHTML=overflow?`<b>Pozor, modelovaný úsek je příliš krátký.</b> Celá voda se do klínového prostoru délky ${f(l)} km nevejde bez zvýšení hladiny i na horním okraji oblasti. Výsledek H = ${f(H,2)} m platí pouze při umělém omezení délky. <b>Pro věrohodnější scénář zvětši délku</b>; minimální odhad délky vzdutí při daném sklonu je přibližně ${f(floodLength/1000,1)} km.`:`<b>Geometricky konzistentní scénář.</b> Při zvoleném sklonu by zvýšení hladiny zasahovalo asi <b>${f(floodLength/1000,1)} km</b> proti proudu. Zvolená délka oblasti (${f(l)} km) je dostatečná. Geometrická konzistence sama nedokládá skutečnou možnost zadržení vody v místním terénu.`;
$('geo').innerHTML=`Modelová šířka u hráze <b>${f(g.widthBarrier,0)} m</b>; na horním okraji vzdutí <b>${f(g.widthUpstream,0)} m</b>; plocha zátopy <b>${f(g.area/1e6,2)} km²</b>. Objemová kontrola <b>${f(g.volumeCalculated/1e6,3)} mil. m³</b>. Zadaný sklon: <b>${f(s,2)} m/km</b>; výškový rozdíl dna na ${f(l)} km: <b>${f(s*l,1)} m</b>. ${overflow?'Voda dosahuje až za hranici vykreslené oblasti.':'Teoretická délka zvýšené hladiny: <b>'+f(floodLength/1000,1)+' km</b>.'}`;
// Horizontální i vertikální měřítko jsou v režimu 1:1 vyjádřena shodně v metrech na pixel.
const x0=45,x1=670,Lm=l*1000,drawWidth=x1-x0,drop=s*l;
const trueScale=drawWidth/Lm;
const displayScale=profileScaleMode==='true'?trueScale:150/Math.max(H,drop,1);
const exaggeration=displayScale/trueScale;
const yStart=profileScaleMode==='true'?220:130;
const base=x=>yStart+((x-x0)/drawWidth)*drop*displayScale;
const surface=base(x1)-H*displayScale;
const yBottom=320;
$('ground').setAttribute('d',`M${x0} ${base(x0)} L${x1} ${base(x1)} L${x1} ${yBottom} L${x0} ${yBottom} Z`);
let cross=x1-(floodUsed/L)*drawWidth;
if(overflow)cross=x0;
let water=`M${cross} ${overflow?surface:base(cross)} L${x1} ${surface} L${x1} ${base(x1)} L${cross} ${base(cross)} Z`;
$('water').setAttribute('d',water);
$('barrier').setAttribute('x1',x1);$('barrier').setAttribute('x2',x1);
$('barrier').setAttribute('y1',Math.min(surface,base(x1))-5);$('barrier').setAttribute('y2',base(x1)+5);
$('baseline').setAttribute('x1',x1-160);$('baseline').setAttribute('x2',x1);
$('baseline').setAttribute('y1',base(x1));$('baseline').setAttribute('y2',base(x1));
$('heightline').setAttribute('x1',x1-24);$('heightline').setAttribute('x2',x1-24);
$('heightline').setAttribute('y1',surface);$('heightline').setAttribute('y2',base(x1));
$('heighttext').setAttribute('y',Math.max(75,Math.min(290,surface-14)));
$('heighttext').textContent='Zvýšení hladiny: '+f(H,2)+' m';
$('lengthtext').textContent='Znázorněný úsek: '+f(l)+' km';
$('scaleStatement').innerHTML=profileScaleMode==='true'
 ? `<b>Měřítko profilu: 1 : 1 (bez převýšení).</b> Na ${f(l)} km je pokles dna jen ${f(drop,2)} m a vzdutí ${f(H,2)} m. Grafické zvýšení hladiny tvoří pouze ${f(H*trueScale,3)} pixelu z šířky ${drawWidth} pixelů. Skutečná hloubka je proto prakticky neviditelná; rozhodující je číselná hodnota.`
 : `<b>Pozor: schématické zobrazení se svislým převýšením přibližně ${f(exaggeration,0)}×.</b> Sklon i výška vody jsou vizuálně zveličené, nejde o skutečný profil krajiny. Skutečné hodnoty: výškový rozdíl ${f(drop,2)} m na ${f(l)} km, vzdutí ${f(H,2)} m.`;
// Detail vodního sloupce ve skutečném měřítku vůči osobě 1,80 m.
const cmp=$('height-comparison'); if(cmp){
 const maxHeight=Math.max(H,1.8,0.1), scale=210/maxHeight;
 const waterY=240-H*scale, personY=240-1.8*scale;
 const humanScale=(1.8*scale)/180;
 const pose=`<g transform="translate(340 ${personY}) scale(${humanScale})">
 <ellipse cx="0" cy="174" rx="23" ry="4" fill="#81909b" opacity=".25"/>
 <path d="M-12 42 Q-25 46 -29 61 L-33 100 Q-34 106 -28 108 Q-22 109 -20 103 L-16 78 L-13 105 Q0 114 14 105 L16 78 L20 103 Q22 109 28 108 Q34 106 33 100 L29 61 Q25 47 12 42 Z" fill="#59778e" stroke="#2d4256" stroke-width="2"/>
 <path d="M-13 106 L-12 158 Q-12 167 -5 167 Q2 167 3 158 L6 124 L9 158 Q9 167 16 167 Q23 167 21 158 L16 106 Z" fill="#344b62" stroke="#243448" stroke-width="2"/>
 <path d="M-13 161 L-12 177 L-24 178 Q-30 181 -24 183 L0 183 Q5 180 -4 177 L-4 162 Z M9 161 L9 177 L19 178 Q27 180 25 183 L3 183 Q-1 180 8 176 Z" fill="#333e47"/>
 <rect x="-5" y="35" width="10" height="12" rx="4" fill="#d4a57e"/>
 <ellipse cx="0" cy="20" rx="14" ry="19" fill="#ddb18b" stroke="#986b52" stroke-width="1.2"/>
 <path d="M-14 17 Q-16 -1 -3 1 Q6 -4 15 9 L13 17 Q8 6 3 7 Q-5 12 -12 11 Z" fill="#443b34"/>
 <path d="M-13 76 Q0 84 13 76" fill="none" stroke="#b8cedd" stroke-width="2"/>
 <circle cx="-5" cy="20" r="1.15" fill="#463b34"/><circle cx="5" cy="20" r="1.15" fill="#463b34"/>
 <path d="M-3 30 Q0 32 3 30" fill="none" stroke="#986b52" stroke-width="1"/>
 </g>`;
 cmp.innerHTML=`<svg viewBox="0 0 500 286" role="img" aria-label="Srovnání zvýšení hladiny vody a realistické vektorové postavy vysoké 1,8 metru"><rect width="500" height="286" rx="12" fill="#f3f8fb"/><rect x="65" y="${waterY}" width="185" height="${H*scale}" fill="#81caeb" fill-opacity=".79" stroke="#187bb8" stroke-width="1.8"/><path d="M65 ${waterY} H250" stroke="#0275ac" stroke-width="3"/><line x1="40" y1="240" x2="460" y2="240" stroke="#51606b" stroke-width="2"/>${pose}<text x="156" y="${Math.max(17,waterY-9)}" font-size="17" font-weight="bold" text-anchor="middle" fill="#09537d">${f(H,2)} m</text><text x="383" y="${Math.max(28,personY+24)}" fill="#273a48" font-size="16" font-weight="bold">1,80 m</text><text x="157" y="267" text-anchor="middle" font-size="14" fill="#345">Vzestup hladiny</text><text x="340" y="267" text-anchor="middle" font-size="14" fill="#345">Člověk</text></svg>`;
 $('crossnote').textContent=`Výšky jsou vůči sobě v měřítku 1 : 1; graf zobrazuje PŘÍRŮSTEK hladiny, nikoli celkovou hloubku řeky nebo svislou volně stojící vodní stěnu. Současný výpočet: ${f(H,2)} m = ${f(H/1.8,2)}× výška dospělého člověka.`;
}


}
$('reset').onclick=()=>{for(const s of specs){st[s.id]=s.def;$(s.id).value=s.def}draw()};draw();

document.querySelectorAll('input[name=profileScale]').forEach(el=>el.addEventListener('change',e=>{profileScaleMode=e.target.value;draw()}));
