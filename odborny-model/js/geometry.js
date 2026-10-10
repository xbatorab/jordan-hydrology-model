/* Analytický příčný profil: šířka zátopy B(x) = bmin + (B0-bmin) h(x)/H.
   Průřez D(x)= bmin*h + (B0-bmin)*h²/(2H). Základní hloubka Jordánu
   není modelována; jde o přírůstek zadrženého objemu nad referenční rovinou. */
(function(global){'use strict';
function solve(volume,gradient,meanWidth,limitKm,minWidth=50){
 const S=Math.max(0.00001,gradient/1000), B=Math.max(meanWidth,minWidth+1), b=Math.min(minWidth, B-1);
 const top=2*B-b, maxR=Math.max(1,limitKm*1000);
 function calc(h){const R=Math.min(maxR,h/S);
   const i1=h*R-S*R*R/2;
   const i2=h*h*R-h*S*R*R+S*S*R*R*R/3;
   const v=b*i1+(top-b)*i2/(2*h);
   const area=b*R+(top-b)*(R-S*R*R/(2*h));
   return {v,area,R}; }
 if(!(volume>0))return {height:0,reach:0,area:0,volumeCalculated:0,widthBarrier:top,widthUpstream:b,overflow:false,meanWidth:B};
 let low=0,high=1;while(calc(high).v<volume&&high<1e6)high*=2;
 for(let i=0;i<70;i++){const mid=(low+high)/2;if(calc(mid).v<volume)low=mid;else high=mid;}
 const H=(low+high)/2, out=calc(H);
 return {height:H,reach:out.R,area:out.area,volumeCalculated:out.v,widthBarrier:top,widthUpstream: b+(top-b)*Math.max(0,1-S*out.R/H),overflow:H/S>maxR,meanWidth:B};
}
global.JordanGeometry={solve};
})(window);
