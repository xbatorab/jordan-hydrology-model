(()=>{
const el=id=>document.getElementById(id);const fmt=(n,k=2)=>new Intl.NumberFormat('cs-CZ',{maximumFractionDigits:k}).format(n);
if(!window.L){el('mapmsg').textContent='Mapovou knihovnu Leaflet se nepodařilo načíst. Zkontrolujte připojení k internetu.';return;}
const map=L.map('jordanmap',{zoomControl:true}).fitBounds([[31.79,35.34],[32.42,35.83]]);L.control.scale({imperial:false}).addTo(map);
let relief=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',{maxZoom:13,maxNativeZoom:13,attribution:'Reliéf © Esri'}).addTo(map);
const alternate=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}',{maxZoom:14,attribution:'© Esri'});let fails=0,loads=0;
relief.on('tileload',()=>loads++);relief.on('tileerror',()=>{if(++fails>=4&&loads===0){map.removeLayer(relief);alternate.addTo(map)}});
L.control.layers({'Reliéfní podklad':relief,'Stínování':alternate},null,{collapsed:true}).addTo(map);
const placesLayer=L.layerGroup().addTo(map);
const siteLabels=[];
// Na široké mapě zobrazujeme základní orientační názvy; v detailu popisky záměrně potlačíme,
// aby nepřekrývaly tok, hráz a zaplavení. Všechny body zůstávají klikatelné.
function refreshLabels(){
 const z=map.getZoom();
 for(const site of siteLabels){
   const show=(z<=10?site.priority===1:z<=12?site.priority<=2:site.priority===1 && site.name==='Adam (Tell ed-Damiyeh)');
   if(show && !site.marker.isTooltipOpen())site.marker.openTooltip();
   if(!show && site.marker.isTooltipOpen())site.marker.closeTooltip();
 }
}
map.on('zoomend moveend',refreshLabels);

function place(lat,lon,name,kind,note,priority=2){
 const m=L.circleMarker([lat,lon],{radius:8,color:'#ffffff',weight:3,fillColor:kind==='uncertain'?'#b48419':kind==='traditional'?'#623eaa':'#ad3b29',fillOpacity:1,interactive:true}).addTo(placesLayer);
 m.bindTooltip(name,{direction:'top',offset:[0,-8],permanent:false,className:'jbib',opacity:1});m.bindPopup('<b>'+name+'</b><br>'+note);siteLabels.push({marker:m,name,priority});return m;
}
place(32.103933,35.546789,'Adam (Tell ed-Damiyeh)','secure','Pravděpodobná identifikace biblického Adamu (Joz 3,16).',1);
place(31.871719,35.444564,'Jericho (Tell es-Sultan)','secure','Archeologická lokalita Jericha.',1);
place(32.1966,35.62118,'Sukkót?','uncertain','Identifikace Tell Deir Alla je diskutována.');
place(32.14214,35.58147,'Saretán?','uncertain','Možná identifikace; lokalizace nejistá.');
// Další orientační lokality s geograficky ověřenými identifikacemi.
place(32.187016,35.692110,'Penuel?','uncertain','Tell edh-Dhahab esh-Sherqiyeh; střední jistota identifikace.');
place(32.055703,35.289536,'Šílo','secure','Khirbet Seilun, vysoce jistá identifikace.');
place(31.916944,35.261111,'Aj?','uncertain','Et-Tell: poloha naleziště je přesná, biblická identifikace sporná.');
// Přibližné směrové názvy geomorfologických oblastí nejsou vydávány za body sídel.
const terrains=L.layerGroup().addTo(map);
function terrain(lat,lng,label){const c=L.marker([lat,lng],{icon:L.divIcon({className:'terrain-label',html:label,iconSize:[142,24],iconAnchor:[71,12]}),interactive:false}).addTo(terrains);return c;}
terrain(32.30,35.36,'Samařská vysočina');
terrain(32.29,35.73,'Gileádské hory');
map.on('zoomend',()=>{if(map.getZoom()>10){map.removeLayer(terrains)}else if(!map.hasLayer(terrains))terrains.addTo(map)});
// Gilgal is an uncertain vicinity, not an exact archaeological site.
L.circle([31.875,35.495],{radius:2300,color:'#d68c21',weight:3,dashArray:'8 5',fillColor:'#f5ce71',fillOpacity:.24}).addTo(placesLayer);
place(31.876,35.493,'Gilgal? (předpokládaná oblast)','uncertain','Umístění zástupné oblasti východně od Jericha; nejedná se o prokázanou polohu Gilgalu.',1);
// Traditional location — historical crossing remains unknown.
const crossing=[31.838333,35.539167];
place(...crossing,'Přechod? – tradiční poloha','traditional','Qasr al-Yahud je pouze tradičně spojován s biblickým přechodem, skutečný bod neznáme.',1);
// The assumed stoppage cross-section is drawn distinctly, never interpreted as an actual wall.
const barrierLat=32.114; // pracovní posun hráze přibližně 1 km severně od Adamu
L.polyline([[barrierLat,35.530],[barrierLat,35.563]],{color:'#ffffff',weight:10,opacity:.95}).addTo(placesLayer);
L.polyline([[barrierLat,35.530],[barrierLat,35.563]],{color:'#db262b',weight:6,dashArray:'11 8'}).addTo(placesLayer).bindTooltip('Zastavení vody u Adamu – model',{permanent:false}).bindPopup('Hypotetická hráz vody: poloha je pouze pracovní předpoklad.');
// Route does not represent surveyed historical itinerary. Geography approximate, markers distinct.
const route=[[31.83,35.66],[31.834,35.63],[31.839,35.595],crossing,[31.854,35.522],[31.867,35.507],[31.875,35.493],[31.872,35.472],[31.871719,35.444564]];
L.polyline(route,{color:'#fff',weight:7,opacity:.85,interactive:false}).addTo(placesLayer);
L.polyline(route,{color:'#171717',weight:3,dashArray:'7 8',opacity:1}).addTo(placesLayer).bindPopup('Pouze ilustrační možný směr: z východního břehu přes Jordán do předpokládané oblasti Gilgalu, poté k Jerichu. Historická cesta není doložena.');
place(31.83,35.66,'Od Šittímu? (směr)','uncertain','Pouze náznak směru pochodu ze země Moáb; poloha biblického Šittímu zde není doložena.',3);
const riverLayer=L.layerGroup().addTo(map);
let surveyedRiver=null; // skutečná geodata, jen pokud se úspěšně načtou

// Fallback is visibly styled and labeled as approximate, and remains available even if remote services fail.
const approxRiver=[[32.44,35.568],[32.406,35.564],[32.375,35.575],[32.348,35.550],[32.322,35.568],[32.294,35.546],[32.269,35.564],[32.24,35.552],[32.217,35.570],[32.191,35.548],[32.164,35.557],[32.138,35.541],[32.105,35.547],[32.076,35.554],[32.046,35.542],[32.016,35.559],[31.986,35.537],[31.961,35.552],[31.933,35.537],[31.910,35.554],[31.884,35.542],[31.859,35.546],[31.838333,35.539167],[31.82,35.543],[31.791,35.548]];
const riverFallback=L.polyline(approxRiver,{color:'#0086b9',weight:4,opacity:.9,dashArray:'5 5'}).addTo(riverLayer).bindPopup('Orientační vedení Jordánu. Přesné meandry jsou dostupné pouze po načtení hydrografických dat.');
L.polyline([[32.21,35.72],[32.19,35.67],[32.16,35.61],[32.12,35.57],[32.106,35.55]],{color:'#2d9bc1',weight:2,dashArray:'6 6',opacity:.75}).addTo(riverLayer).bindTooltip('Jabbok / Zarká (schematicky)');
const riverEndpoint='https://www.ufz.de/arcgis/rest/services/Middle_East/Surface_Water_bodies/MapServer/4/query?where=1%3D1&outFields=*&returnGeometry=true&outSR=4326&f=geojson';
fetch(riverEndpoint,{signal:AbortSignal.timeout?AbortSignal.timeout(14000):undefined}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()}).then(g=>{
 const layer=L.geoJSON(g,{style:{color:'#006ca9',weight:4,opacity:1},interactive:false}).addTo(riverLayer);
 if(layer.getLayers().length){riverLayer.removeLayer(riverFallback); surveyedRiver=g; if(!dem)fallbackFlood();}
}).catch(()=>{});
riverLayer.eachLayer(x=>x.bringToFront?.());placesLayer.eachLayer(x=>x.bringToFront?.());
let dem=null,floodLayer=null,pending=0,loading=false;const Z=11;
const status=(msg,good=false)=>{el('mapmsg').className='mapbadge '+(good?'ok':'warn');el('mapmsg').textContent=msg};
// Bbox chosen to extend upstream past Sukot and sufficiently to both flanks; southern edge slightly below Adam.
const box={north:32.265,south:32.112,west:35.495,east:35.625};
const my=lat=>(1-Math.log(Math.tan(Math.PI/4+lat*Math.PI/360))/Math.PI)/2;
const tile=(lat,lon)=>[(lon+180)/360*2**Z,my(lat)*2**Z];
const invert=(tx,ty)=>[180/Math.PI*Math.atan(Math.sinh(Math.PI*(1-2*ty/2**Z))),tx/2**Z*360-180];
const xy0=tile(box.north,box.west),xy1=tile(box.south,box.east);
async function load(){if(loading)return;loading=true;el('loadDEM').disabled=true;el('loadDEM').textContent='Načítám terén…';status('Načítám výšková data. Základní mapa a orientační zaplavená oblast zůstávají zobrazeny. Zkouším načíst skutečnou výškovou mřížku (DEM Terrarium).');
 const x0=Math.floor(xy0[0]),y0=Math.floor(xy0[1]),x1=Math.floor(xy1[0]),y1=Math.floor(xy1[1]),nx=x1-x0+1,ny=y1-y0+1;
 if(nx*ny>90){status('Výšková oblast přesahuje limit; zobrazuji ORIENTAČNÍ vrstvu, nikoli DEM.');fallbackFlood();loading=false;el('loadDEM').disabled=false;el('loadDEM').textContent='Zkusit DEM znovu';return}
 const can=document.createElement('canvas');can.width=nx*256;can.height=ny*256;const cx=can.getContext('2d',{willReadFrequently:true});
 try{await Promise.all(Array.from({length:nx*ny},(_,i)=>{const x=x0+i%nx,y=y0+Math.floor(i/nx);return new Promise((resolve,reject)=>{let pic=new Image();pic.crossOrigin='anonymous';const clock=setTimeout(()=>{pic.src='';reject(Error('Časový limit DEM'))},12000);pic.onload=()=>{clearTimeout(clock);cx.drawImage(pic,(x-x0)*256,(y-y0)*256);resolve()};pic.onerror=()=>{clearTimeout(clock);reject(Error('DEM server nepovolil CORS nebo neodpovídá'))};pic.src=`https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${Z}/${x}/${y}.png`})}));
 const raw=cx.getImageData(0,0,can.width,can.height).data;
 let left=Math.round((xy0[0]-x0)*256),top=Math.round((xy0[1]-y0)*256),right=Math.round((xy1[0]-x0)*256),bottom=Math.round((xy1[1]-y0)*256);
 // 4-pixel sampling: faster preview, spatial resolution approx. 70–110 m.
 const stride=4,W=Math.floor((right-left)/stride)+1,H=Math.floor((bottom-top)/stride)+1,alt=new Float32Array(W*H);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const k=((top+y*stride)*can.width+(left+x*stride))*4;alt[y*W+x]=raw[k]*256+raw[k+1]+raw[k+2]/256-32768}
 const nw=invert(x0+left/256,y0+top/256),se=invert(x0+(left+(W-1)*stride)/256,y0+(top+(H-1)*stride)/256);
 const bounds={north:nw[0],west:nw[1],south:se[0],east:se[1]};dem={W,H,alt,bounds};
 status('Digitální model terénu byl načten. Probíhá výpočet modré plochy…',true);el('offDEM').hidden=false;update();
 }catch(e){dem=null;status('Nelze načíst výšková data: '+e.message+'. Přepínám na ORIENTAČNÍ vrstvu (nikoli záplavu vypočítanou z reliéfu).');fallbackFlood();}finally{loading=false;el('loadDEM').disabled=false;el('loadDEM').textContent=dem?'Přepočítat z DEM':'Zkusit DEM znovu';}}
// Height-conditioned 4-neighbour connectivity. Stop at synthetic downstream boundary.
function wet(level){const {W,H,alt,bounds:b}=dem;const mask=new Uint8Array(W*H);const queue=new Int32Array(W*H);let a=0,n=0;
 // Seed in low ground close to Adam. A low pixel is not guaranteed to be the historical river bed.
 const sx=Math.round((35.544-b.west)/(b.east-b.west)*(W-1));const sy=Math.round((b.north-32.118)/(b.north-b.south)*(H-1));let start=-1,v=Infinity;
 for(let dy=-9;dy<=9;dy++)for(let dx=-9;dx<=9;dx++){let x=sx+dx,y=sy+dy;if(x<0||x>=W||y<0||y>=H)continue;const k=y*W+x;if(alt[k]<v){v=alt[k];start=k}}
 if(start<0||v>level)return {mask,area:0,volume:0,edge:false,min:v};
 mask[start]=1;queue[n++]=start;const delLat=(b.north-b.south)/(H-1)*111195,delLon=(b.east-b.west)/(W-1)*111195;let area=0,volume=0,edge=false;
 while(a<n){let k=queue[a++],x=k%W,y=(k/W)|0;let lat=b.north+(b.south-b.north)*y/(H-1);let cell=delLat*delLon*Math.cos(lat*Math.PI/180);area+=cell;volume+=Math.max(0,level-alt[k])*cell;if(x===0||y===0||x===W-1||y===H-1)edge=true;
 for(let nk of [k-1,k+1,k-W,k+W]){if(nk<0||nk>=W*H||mask[nk]||alt[nk]>level)continue;let xx=nk%W,yy=(nk/W)|0;if(Math.abs(xx-x)+Math.abs(yy-y)!==1)continue;let nlat=b.north+(b.south-b.north)*yy/(H-1);if(nlat<=barrierLat)continue;mask[nk]=1;queue[n++]=nk}}
 return{mask,area:area/1e6,volume,edge,min:v};}
function flood(){if(!dem)return;const {W,H,alt,bounds:b}=dem;const volume=st.q*st.t*3600*(1-st.z/100);
 // Baseline reference: initial near-wall river level from lowest DEM elevations; this is a modelling assumption.
 // Výchozí objem porovnáváme proti pomocné referenční úrovni u Adamu.
 const sx=Math.round((35.544-b.west)/(b.east-b.west)*(W-1)),sy=Math.round((b.north-32.118)/(b.north-b.south)*(H-1));let min=Infinity;
 for(let dy=-9;dy<=9;dy++)for(let dx=-9;dx<=9;dx++){let x=sx+dx,y=sy+dy;if(x>=0&&x<W&&y>=0&&y<H)min=Math.min(min,alt[y*W+x])}
 const baseline=min+0.2;const baseWet=wet(baseline);let lo=baseline,hi=baseline+90,hit=null;
 for(let i=0;i<22;i++){let mid=(lo+hi)/2;let v=wet(mid);if(v.volume-baseWet.volume<volume)lo=mid;else hi=mid;hit=v}
 const level=(lo+hi)/2;hit=wet(level);let added=Math.max(0,hit.volume-baseWet.volume);
 const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;const g=canvas.getContext('2d');const img=g.createImageData(W,H);
 for(let i=0;i<hit.mask.length;i++)if(hit.mask[i]){let j=i*4;img.data[j]=25;img.data[j+1]=119;img.data[j+2]=219;img.data[j+3]=178}g.putImageData(img,0,0);
 if(floodLayer){map.removeLayer(floodLayer);floodLayer=null;if(window._jordanZoomBandHandler){map.off('zoomend',window._jordanZoomBandHandler);window._jordanZoomBandHandler=null;}}floodLayer=L.imageOverlay(canvas.toDataURL('image/png'),[[b.south,b.west],[b.north,b.east]],{opacity:0.78,interactive:false}).addTo(map);floodLayer.bringToFront();riverLayer.eachLayer(x=>x.bringToFront?.());placesLayer.eachLayer(x=>x.bringToFront?.());
 el('maparea').textContent=fmt(hit.area);el('maprise').textContent=fmt(level-baseline);el('mapvol').textContent=fmt(added/1e6);
 const notice=hit.edge?' UPOZORNĚNÍ: Zaplavená oblast dosáhla hranice dostupného výškového modelu; rozsah a objem mohou být podhodnocené.':'';
 el('demsummary').hidden=false;el('demsummary').textContent='DEM (předběžně): plocha '+fmt(hit.area)+' km²; vzestup hladiny '+fmt(level-baseline)+' m; dodatečný objem '+fmt(added/1e6,3)+' mil. m³. Hlavní panel používá nadále analytický výpočet.';
 const cap=(added<volume*.94)?' Výškový interval nestačí pro celý objem – hodnoty nejsou uzavřené.':'';
 status(`REŽIM DEM – rozdílná metoda od analytického výpočtu v hlavním panelu. Podle dostupného DEM: výška referenční hladiny ~${fmt(baseline,1)} m n. m.; vypočtená hladina ~${fmt(level,1)} m n. m.; dodatečný modelový objem ${fmt(added/1e6)} mil. m³.${notice}${cap} Plocha zahrnuje i výchozí vodní pás; současná topografie není historická rekonstrukce.`,true);
}
function fallbackFlood(){
 el('demsummary').hidden=true;
 if(dem)return;
 const vol=st.q*st.t*3600*(1-st.z/100),slope=Math.max(st.s/1000,0.00005),B=st.b,maxReach=st.l*1000;
 const g=window.JordanAnalytic && Math.abs(window.JordanAnalytic.volume-vol)<1e-4 && window.JordanAnalytic.gradient===st.s && window.JordanAnalytic.width===st.b && window.JordanAnalytic.limit===st.l ? window.JordanAnalytic : window.JordanGeometry.solve(vol,st.s,st.b,st.l);
 const h=g.height,reach=g.reach,over=g.overflow,areaKm2=g.area/1e6;
 // Základní grafická vrstva se kreslí jako pás vedený PŘÍMO po ose řeky,
 // nikoliv jako polygon s paralelními hranami, který u meandrů vytváří artefakty.
 // Vykreslení využívá skutečné souřadnice, když jsou dostupné; jinak přiznanou aproximaci.
 function pathFromGeoJSON(geo){
   if(!geo)return null;
   const lines=[];
   function walk(g){if(!g)return;if(g.type==='FeatureCollection')return g.features.forEach(walk);
     if(g.type==='Feature')return walk(g.geometry);
     if(g.type==='GeometryCollection')return g.geometries.forEach(walk);
     if(g.type==='LineString')lines.push(g.coordinates);
     if(g.type==='MultiLineString')g.coordinates.forEach(x=>lines.push(x));
   }walk(geo);
   // Vyber linii procházející blízko Adamu a dostatečně daleko k severu.
   let best=null,bestScore=Infinity;
   for(const line of lines){if(line.length<3)continue;
     const lat=line.map(c=>c[1]),min=Math.min(...lat),max=Math.max(...lat);
     if(min>barrierLat || max<barrierLat+0.045)continue;
     let closest=Infinity;for(const p of line){
       let dist=Math.hypot((p[1]-barrierLat)*111195,(p[0]-35.548)*94400);
       closest=Math.min(closest,dist);
     }
     if(closest<bestScore){bestScore=closest;best=line;}
   }
   if(!best || bestScore>3500)return null;
   // U části řek se dílčí segmenty nepřipojují; odmítneme neúplný úsek.
   let source=best.map(p=>[p[1],p[0]]);
   const farNorth=source[source.length-1][0]>source[0][0];
   if(!farNorth)source.reverse();
   let closestIndex=0,distMin=Infinity;
   source.forEach((p,i)=>{let d=Math.hypot((p[0]-barrierLat)*111195,(p[1]-35.548)*94400);
     if(d<distMin){distMin=d;closestIndex=i;}});
   return source.slice(closestIndex);
 }
 function cropReach(coords,distanceMeters){
   if(!coords||coords.length<2)return null;
   let result=[coords[0]],covered=0;
   for(let i=1;i<coords.length;i++){
     const d=L.latLng(coords[i-1]).distanceTo(L.latLng(coords[i]));
     if(d<=0)continue;
     if(covered+d>=distanceMeters){let w=(distanceMeters-covered)/d;
       result.push([coords[i-1][0]+(coords[i][0]-coords[i-1][0])*w,coords[i-1][1]+(coords[i][1]-coords[i-1][1])*w]);
       return result;}
     result.push(coords[i]);covered+=d;
   }
   return result;
 }
 const verifiedCoords=pathFromGeoJSON(surveyedRiver);
 // Mapový výukový režim: rámcové břehy údolní nivy jsou vymezeny podle osy toku,
 // nikoli podle barev stínovaného reliéfu (barva není nadmořská výška).
 // Záměrně neděláme spojnice přes vzdálené meandry: výslednou plochu tvoří
 // nepravidelný polygon přibližně kopírující údolí s pevnou horní mezí 450 m.
 const fallbackOrdered=approxRiver.slice().reverse();
 const chosen=verifiedCoords&&verifiedCoords.length>10?verifiedCoords:fallbackOrdered;
 // I náhradní linie začíná nejbližším bodem severně od hráze, nikoli daleko na jihu.
 let startIndex=0,nearest=Infinity;
 chosen.forEach((p,i)=>{const d=Math.hypot((p[0]-barrierLat)*111195,(p[1]-35.548)*94400);if(d<nearest){nearest=d;startIndex=i}});
 const upstream=chosen.slice(startIndex).filter(p=>p[0]>=barrierLat-0.008);
 const floodCoords=cropReach(upstream.length>1?upstream:chosen,reach)||(upstream.length>1?upstream:chosen);
 if(floodLayer)map.removeLayer(floodLayer);
 floodLayer=L.layerGroup().addTo(map);
 function redrawBand(){
   if(!floodLayer||dem)return;
   floodLayer.clearLayers();
   const z=map.getZoom();
   const lat=floodCoords[Math.floor(floodCoords.length/2)][0];
   const mpp=156543.03392*Math.cos(lat*Math.PI/180)/Math.pow(2,z);
   // Posuvný analytický příčný profil: 50 m na konci, více u Adamu.
   // Kreslíme krátké segmenty s odpovídající šířkou, bez bočního posunutí osy.
   let lengths=[0],total=0;
   for(let i=1;i<floodCoords.length;i++){total+=L.latLng(floodCoords[i-1]).distanceTo(L.latLng(floodCoords[i]));lengths.push(total)}
   for(let i=1;i<floodCoords.length;i++){
     const d=(lengths[i-1]+lengths[i])/2;
     const depth=Math.max(0,h-slope*d);
     const width=g.widthUpstream+(g.widthBarrier-g.widthUpstream)*Math.max(0,depth/h);
     const pixelWidth=Math.max(2,width/mpp);
     L.polyline([floodCoords[i-1],floodCoords[i]],{color:'#1685d8',weight:pixelWidth,opacity:.42,lineCap:'round',lineJoin:'round',interactive:false}).addTo(floodLayer);
   }
   // Nepravidelné hrany jsou orientační – ne geodeticky ověřené obrysy nivy.
   riverLayer.eachLayer(x=>x.bringToFront?.());placesLayer.eachLayer(x=>x.bringToFront?.());
 }
 redrawBand();
 if(window._jordanZoomBandHandler)map.off('zoomend',window._jordanZoomBandHandler);
 window._jordanZoomBandHandler=redrawBand;map.on('zoomend',redrawBand);
 el('maparea').textContent=fmt(areaKm2);el('maprise').textContent=fmt(h);el('mapvol').textContent=fmt(vol/1e6,3);
 status('ANALYTICKÝ REŽIM: vypočtený objem '+fmt(vol/1e6,3)+' mil. m³, plocha koridoru '+fmt(areaKm2)+' km², vzestup hladiny '+fmt(h)+' m. Modrý pás sleduje osu Jordánu (ověřená hydrografie, pokud se načte; jinak přibližná trasa), s proměnnou šířkou (širší u hráze, užší proti proudu). Hranice pásu NEJSOU skutečnou hranicí údolní nivy ani zátopou z DEM: vrstva je jen ilustrace u toku. Pro přesné vyloučení vyvýšených svahů je nutné DEM. Přesnou hranici zátopy určí až ověřená data DEM. '+(over?'Zadaný úsek omezuje délku zobrazeného vzdutí.':'') ,true);
}

function update(){clearTimeout(pending);pending=setTimeout(()=>{try{dem?flood():fallbackFlood()}catch(e){dem=null;fallbackFlood();status('Výpočet DEM selhal: '+e.message+'. Zobrazuji analytický model bez reliéfu.')}},180)}
for(let spec of specs)el(spec.id).addEventListener('input',update);
el('reset').addEventListener('click',update);
el('mapall').onclick=()=>map.fitBounds([[31.79,35.34],[32.42,35.83]]);
el('mapadam').onclick=()=>map.fitBounds([[32.07,35.43],[32.31,35.73]]);
el('loadDEM').addEventListener('click',()=>{if(dem){update();return;}load();});
el('offDEM').addEventListener('click',()=>{dem=null;if(floodLayer){map.removeLayer(floodLayer);floodLayer=null;}el('offDEM').hidden=true;el('loadDEM').textContent='Vypočítat zaplavenou oblast podle reliéfu (DEM, online)';fallbackFlood();});
// DEM experimentální režim: aktivuje se výhradně tlačítkem.
fallbackFlood();
refreshLabels();
// Volitelný DEM výpočet se spouští až po kliknutí. Základní vrstva je okamžitá a offline vypočitatelná.

})();
