!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.ccDirective=e():t.ccDirective=e()}(window,(function(){return function(t){var e={};function n(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(o,r,function(e){return t[e]}.bind(null,r));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){"use strict";function o(t,e,n){let o,r=n[e];if(e<t)for(o=e;o<t;o++)n[o]=n[o+1];else for(o=e;o>t;o--)n[o]=n[o-1];n[o]=r}function r(t){return"BODY"===t.nodeName?0:r(t.parentNode)+(t.scrollTop||0)}function f(t){return"BODY"===t.nodeName?0:f(t.parentNode)+(t.scrollLeft||0)}function i(t){return t?i(t.offsetParent)+t.offsetTop:0}function l(t){return t?l(t.offsetParent)+t.offsetLeft:0}n.r(e),n.d(e,"dragMove",(function(){return a}));var a=function(t){t.directive("drag-move",{bind:function(t,e){if("function"!=typeof e.value)return;let n,a,s,u,c,p,d,m,g,y,v=Object.assign({direction:"v",offsetY:0,offsetX:0,activeClass:"",zIndex:9},e.value()),h=0,x=0,b=0,E=[],M=9999999,O=-9999999;function j(t){t.preventDefault();let e=t.clientY-p,r=t.clientX-c,f=d+e,i=m+r,l=e>0?-s:s,a=r>0?-u:u,x=Math.min(d,f),j=Math.max(d,f),N=Math.min(m,i),T=Math.max(m,i);"v"===v.direction?(y.style.top=f+"px",n.forEach((t,e)=>{let n=E[e].t,o=E[e].v;t!==g&&j>n-s/2+o&&n+s/2+o>x&&(h=e,o=l>0?l+E[e].mgtb+v.offsetY:l-E[e].mgtb-v.offsetY,0!==E[e].v&&o!==E[e].v&&(h=o<0?h+1:h-1,o=0),E[e].v=o,t.style.transform=`translate3d(0,${o}px,0)`)})):"h"===v.direction?(y.style.left=i+"px",n.forEach((t,e)=>{let n=E[e].l,o=E[e].h;t!==g&&T>n-u/2+o&&n+u/2+o>N&&(h=e,o=a>0?a+E[e].mglr+v.offsetX:a-E[e].mglr-v.offsetX,0!==E[e].h&&o!==E[e].h&&(h=o<0?h+1:h-1,o=0),E[e].h=o,t.style.transform=`translate3d(${o}px,0,0)`)})):"vh"===v.direction&&(y.style.left=i+"px",y.style.top=f+"px",E.forEach((t,e)=>{let r=E[e].l,f=E[e].h,i=E[e].t,l=E[e].v;if(e!==b&&j>i-s/2+l&&i+s/2+l>x&&T>r-u/2+f&&r+u/2+f>N){let t;if(h=e,e>b)for(t=b+1;t<=e;t++)f=-u-E[t].mglr-v.offsetX,E[t-1].flag=1,l=0,E[t].l===M&&(f=E[t-1].l-M+E[t-1].mglr-v.offsetX,l=-s-E[t].mgtb-v.offsetY),E[t].flag&&(f=0,l=0,E[t].flag=0,E[t-1].flag=0),n[t].style.transform=`translate3d(${f}px,${l}px,0)`;else for(t=b-1;t>=e;t--)f=u+E[t].mglr+v.offsetX,E[t+1].flag=1,l=0,E[t].l===O&&(f=E[t+1].l-O-E[t+1].mglr+v.offsetX,l=s+E[t].mgtb+v.offsetY),E[t].flag&&(f=0,l=0,E[t].flag=0,E[t+1].flag=0),n[t].style.transform=`translate3d(${f}px,${l}px,0)`;o(h,b,n),b=h}})),m=i,d=f,p=t.clientY,c=t.clientX}function N(){switch(y.style.transitionDuration="0.3s",v.direction){case"v":y.style.top=E[h].t+"px";break;case"h":y.style.left=E[h].l+"px";break;case"vh":y.style.top=E[h].t+"px",y.style.left=E[h].l+"px"}setTimeout(()=>{y.remove(),n.forEach(t=>{g.style.visibility="",t.style.transform="",t.style.transitionDuration=""}),"function"==typeof v.onChange&&v.onChange((function(t){return!t instanceof Array||x===h||(t=JSON.parse(JSON.stringify(t)),o(h,x,t)),t}),h,x)},300),document.removeEventListener("mousemove",j),document.removeEventListener("mouseup",N)}t.addEventListener("mousedown",(function(e){if(!(["SELECT","INPUT","TEXTAREA"].indexOf(e.target.nodeName)>-1)){if(n=[].slice.call(t.children),E=[],g=null,e.preventDefault(),n.forEach((n,o)=>{let c=function(t){let e=getComputedStyle(t);return{top:parseInt(e.marginTop),bottom:parseInt(e.marginBottom),left:parseInt(e.marginLeft),right:parseInt(e.marginRight)}}(n);if(E.push({t:i(n)-r(t),l:l(n)-f(t),v:0,h:0,flag:0,mgtb:Math.max(c.top,c.bottom),mglr:Math.max(c.left,c.right)}),function t(e,n,o){return e===o||e!==n&&t(e.parentNode,n,o)}(e.target,t,n)){if(g=n,x=o,h=o,b=o,a=n.cloneNode(!0),v.activeClass){let t=a.className.split(" ");t.push(v.activeClass),a.className=t.join(" ")}d=i(n)-r(t),m=l(n)-f(t),y=document.createElement("div"),y.style.cssText=`overflow:hidden;position:absolute;top:${d}px;width:${n.offsetWidth+c.left}px;z-index:${v.zIndex};left:${l(n)}px;margin-left:-${c.left}px;margin-top:-${c.top}px`,a.style.margin=getComputedStyle(n).margin,y.appendChild(a),n.style.cssText="visibility:hidden",s=n.offsetHeight,u=n.offsetWidth,document.body.appendChild(y)}else n.style.transform="translate3d(0,0,0)",n.style.transitionDuration="0.3s"}),!g)return n.forEach(t=>{t.style.transform="",t.style.transitionDuration=""});E.forEach(t=>{M=Math.min(t.l,M),O=Math.max(t.l,O)}),p=e.clientY,c=e.clientX,document.addEventListener("mouseup",N),document.addEventListener("mousemove",j)}}))}})}}])}));