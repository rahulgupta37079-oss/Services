var wt=Object.defineProperty;var Ie=e=>{throw TypeError(e)};var Pt=(e,t,s)=>t in e?wt(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s;var f=(e,t,s)=>Pt(e,typeof t!="symbol"?t+"":t,s),Te=(e,t,s)=>t.has(e)||Ie("Cannot "+s);var n=(e,t,s)=>(Te(e,t,"read from private field"),s?s.call(e):t.get(e)),h=(e,t,s)=>t.has(e)?Ie("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,s),m=(e,t,s,i)=>(Te(e,t,"write to private field"),i?i.call(e,s):t.set(e,s),s),x=(e,t,s)=>(Te(e,t,"access private method"),s);var Le=(e,t,s,i)=>({set _(r){m(e,t,r,s)},get _(){return n(e,t,i)}});var _e=(e,t,s)=>(i,r)=>{let a=-1;return o(0);async function o(c){if(c<=a)throw new Error("next() called multiple times");a=c;let l,d=!1,p;if(e[c]?(p=e[c][0][0],i.req.routeIndex=c):p=c===e.length&&r||void 0,p)try{l=await p(i,()=>o(c+1))}catch(u){if(u instanceof Error&&t)i.error=u,l=await t(u,i),d=!0;else throw u}else i.finalized===!1&&s&&(l=await s(i));return l&&(i.finalized===!1||d)&&(i.res=l),i}},St=Symbol(),Ct=async(e,t=Object.create(null))=>{const{all:s=!1,dot:i=!1}=t,a=(e instanceof at?e.raw.headers:e.headers).get("Content-Type");return a!=null&&a.startsWith("multipart/form-data")||a!=null&&a.startsWith("application/x-www-form-urlencoded")?kt(e,{all:s,dot:i}):{}};async function kt(e,t){const s=await e.formData();return s?Et(s,t):{}}function Et(e,t){const s=Object.create(null);return e.forEach((i,r)=>{t.all||r.endsWith("[]")?jt(s,r,i):s[r]=i}),t.dot&&Object.entries(s).forEach(([i,r])=>{i.includes(".")&&(Dt(s,i,r),delete s[i])}),s}var jt=(e,t,s)=>{e[t]!==void 0?Array.isArray(e[t])?e[t].push(s):e[t]=[e[t],s]:t.endsWith("[]")?e[t]=[s]:e[t]=s},Dt=(e,t,s)=>{let i=e;const r=t.split(".");r.forEach((a,o)=>{o===r.length-1?i[a]=s:((!i[a]||typeof i[a]!="object"||Array.isArray(i[a])||i[a]instanceof File)&&(i[a]=Object.create(null)),i=i[a])})},et=e=>{const t=e.split("/");return t[0]===""&&t.shift(),t},At=e=>{const{groups:t,path:s}=Mt(e),i=et(s);return Tt(i,t)},Mt=e=>{const t=[];return e=e.replace(/\{[^}]+\}/g,(s,i)=>{const r=`@${i}`;return t.push([r,s]),r}),{groups:t,path:e}},Tt=(e,t)=>{for(let s=t.length-1;s>=0;s--){const[i]=t[s];for(let r=e.length-1;r>=0;r--)if(e[r].includes(i)){e[r]=e[r].replace(i,t[s][1]);break}}return e},we={},Rt=(e,t)=>{if(e==="*")return"*";const s=e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(s){const i=`${e}#${t}`;return we[i]||(s[2]?we[i]=t&&t[0]!==":"&&t[0]!=="*"?[i,s[1],new RegExp(`^${s[2]}(?=/${t})`)]:[e,s[1],new RegExp(`^${s[2]}$`)]:we[i]=[e,s[1],!0]),we[i]}return null},Ne=(e,t)=>{try{return t(e)}catch{return e.replace(/(?:%[0-9A-Fa-f]{2})+/g,s=>{try{return t(s)}catch{return s}})}},Ft=e=>Ne(e,decodeURI),tt=e=>{const t=e.url,s=t.indexOf("/",t.indexOf(":")+4);let i=s;for(;i<t.length;i++){const r=t.charCodeAt(i);if(r===37){const a=t.indexOf("?",i),o=t.slice(s,a===-1?void 0:a);return Ft(o.includes("%25")?o.replace(/%25/g,"%2525"):o)}else if(r===63)break}return t.slice(s,i)},Ot=e=>{const t=tt(e);return t.length>1&&t.at(-1)==="/"?t.slice(0,-1):t},se=(e,t,...s)=>(s.length&&(t=se(t,...s)),`${(e==null?void 0:e[0])==="/"?"":"/"}${e}${t==="/"?"":`${(e==null?void 0:e.at(-1))==="/"?"":"/"}${(t==null?void 0:t[0])==="/"?t.slice(1):t}`}`),st=e=>{if(e.charCodeAt(e.length-1)!==63||!e.includes(":"))return null;const t=e.split("/"),s=[];let i="";return t.forEach(r=>{if(r!==""&&!/\:/.test(r))i+="/"+r;else if(/\:/.test(r))if(/\?/.test(r)){s.length===0&&i===""?s.push("/"):s.push(i);const a=r.replace("?","");i+="/"+a,s.push(i)}else i+="/"+r}),s.filter((r,a,o)=>o.indexOf(r)===a)},Re=e=>/[%+]/.test(e)?(e.indexOf("+")!==-1&&(e=e.replace(/\+/g," ")),e.indexOf("%")!==-1?Ne(e,rt):e):e,it=(e,t,s)=>{let i;if(!s&&t&&!/[%+]/.test(t)){let o=e.indexOf(`?${t}`,8);for(o===-1&&(o=e.indexOf(`&${t}`,8));o!==-1;){const c=e.charCodeAt(o+t.length+1);if(c===61){const l=o+t.length+2,d=e.indexOf("&",l);return Re(e.slice(l,d===-1?void 0:d))}else if(c==38||isNaN(c))return"";o=e.indexOf(`&${t}`,o+1)}if(i=/[%+]/.test(e),!i)return}const r={};i??(i=/[%+]/.test(e));let a=e.indexOf("?",8);for(;a!==-1;){const o=e.indexOf("&",a+1);let c=e.indexOf("=",a);c>o&&o!==-1&&(c=-1);let l=e.slice(a+1,c===-1?o===-1?void 0:o:c);if(i&&(l=Re(l)),a=o,l==="")continue;let d;c===-1?d="":(d=e.slice(c+1,o===-1?void 0:o),i&&(d=Re(d))),s?(r[l]&&Array.isArray(r[l])||(r[l]=[]),r[l].push(d)):r[l]??(r[l]=d)}return t?r[t]:r},qt=it,Nt=(e,t)=>it(e,t,!0),rt=decodeURIComponent,He=e=>Ne(e,rt),ae,A,L,ot,nt,Oe,H,ze,at=(ze=class{constructor(e,t="/",s=[[]]){h(this,L);f(this,"raw");h(this,ae);h(this,A);f(this,"routeIndex",0);f(this,"path");f(this,"bodyCache",{});h(this,H,e=>{const{bodyCache:t,raw:s}=this,i=t[e];if(i)return i;const r=Object.keys(t)[0];return r?t[r].then(a=>(r==="json"&&(a=JSON.stringify(a)),new Response(a)[e]())):t[e]=s[e]()});this.raw=e,this.path=t,m(this,A,s),m(this,ae,{})}param(e){return e?x(this,L,ot).call(this,e):x(this,L,nt).call(this)}query(e){return qt(this.url,e)}queries(e){return Nt(this.url,e)}header(e){if(e)return this.raw.headers.get(e)??void 0;const t={};return this.raw.headers.forEach((s,i)=>{t[i]=s}),t}async parseBody(e){var t;return(t=this.bodyCache).parsedBody??(t.parsedBody=await Ct(this,e))}json(){return n(this,H).call(this,"text").then(e=>JSON.parse(e))}text(){return n(this,H).call(this,"text")}arrayBuffer(){return n(this,H).call(this,"arrayBuffer")}blob(){return n(this,H).call(this,"blob")}formData(){return n(this,H).call(this,"formData")}addValidatedData(e,t){n(this,ae)[e]=t}valid(e){return n(this,ae)[e]}get url(){return this.raw.url}get method(){return this.raw.method}get[St](){return n(this,A)}get matchedRoutes(){return n(this,A)[0].map(([[,e]])=>e)}get routePath(){return n(this,A)[0].map(([[,e]])=>e)[this.routeIndex].path}},ae=new WeakMap,A=new WeakMap,L=new WeakSet,ot=function(e){const t=n(this,A)[0][this.routeIndex][1][e],s=x(this,L,Oe).call(this,t);return s&&/\%/.test(s)?He(s):s},nt=function(){const e={},t=Object.keys(n(this,A)[0][this.routeIndex][1]);for(const s of t){const i=x(this,L,Oe).call(this,n(this,A)[0][this.routeIndex][1][s]);i!==void 0&&(e[s]=/\%/.test(i)?He(i):i)}return e},Oe=function(e){return n(this,A)[1]?n(this,A)[1][e]:e},H=new WeakMap,ze),Bt={Stringify:1},lt=async(e,t,s,i,r)=>{typeof e=="object"&&!(e instanceof String)&&(e instanceof Promise||(e=e.toString()),e instanceof Promise&&(e=await e));const a=e.callbacks;return a!=null&&a.length?(r?r[0]+=e:r=[e],Promise.all(a.map(c=>c({phase:t,buffer:r,context:i}))).then(c=>Promise.all(c.filter(Boolean).map(l=>lt(l,t,!1,i,r))).then(()=>r[0]))):Promise.resolve(e)},It="text/plain; charset=UTF-8",Fe=(e,t)=>({"Content-Type":e,...t}),ge,he,q,oe,N,E,xe,ne,le,K,be,ve,Q,ie,Ue,Lt=(Ue=class{constructor(e,t){h(this,Q);h(this,ge);h(this,he);f(this,"env",{});h(this,q);f(this,"finalized",!1);f(this,"error");h(this,oe);h(this,N);h(this,E);h(this,xe);h(this,ne);h(this,le);h(this,K);h(this,be);h(this,ve);f(this,"render",(...e)=>(n(this,ne)??m(this,ne,t=>this.html(t)),n(this,ne).call(this,...e)));f(this,"setLayout",e=>m(this,xe,e));f(this,"getLayout",()=>n(this,xe));f(this,"setRenderer",e=>{m(this,ne,e)});f(this,"header",(e,t,s)=>{this.finalized&&m(this,E,new Response(n(this,E).body,n(this,E)));const i=n(this,E)?n(this,E).headers:n(this,K)??m(this,K,new Headers);t===void 0?i.delete(e):s!=null&&s.append?i.append(e,t):i.set(e,t)});f(this,"status",e=>{m(this,oe,e)});f(this,"set",(e,t)=>{n(this,q)??m(this,q,new Map),n(this,q).set(e,t)});f(this,"get",e=>n(this,q)?n(this,q).get(e):void 0);f(this,"newResponse",(...e)=>x(this,Q,ie).call(this,...e));f(this,"body",(e,t,s)=>x(this,Q,ie).call(this,e,t,s));f(this,"text",(e,t,s)=>!n(this,K)&&!n(this,oe)&&!t&&!s&&!this.finalized?new Response(e):x(this,Q,ie).call(this,e,t,Fe(It,s)));f(this,"json",(e,t,s)=>x(this,Q,ie).call(this,JSON.stringify(e),t,Fe("application/json",s)));f(this,"html",(e,t,s)=>{const i=r=>x(this,Q,ie).call(this,r,t,Fe("text/html; charset=UTF-8",s));return typeof e=="object"?lt(e,Bt.Stringify,!1,{}).then(i):i(e)});f(this,"redirect",(e,t)=>{const s=String(e);return this.header("Location",/[^\x00-\xFF]/.test(s)?encodeURI(s):s),this.newResponse(null,t??302)});f(this,"notFound",()=>(n(this,le)??m(this,le,()=>new Response),n(this,le).call(this,this)));m(this,ge,e),t&&(m(this,N,t.executionCtx),this.env=t.env,m(this,le,t.notFoundHandler),m(this,ve,t.path),m(this,be,t.matchResult))}get req(){return n(this,he)??m(this,he,new at(n(this,ge),n(this,ve),n(this,be))),n(this,he)}get event(){if(n(this,N)&&"respondWith"in n(this,N))return n(this,N);throw Error("This context has no FetchEvent")}get executionCtx(){if(n(this,N))return n(this,N);throw Error("This context has no ExecutionContext")}get res(){return n(this,E)||m(this,E,new Response(null,{headers:n(this,K)??m(this,K,new Headers)}))}set res(e){if(n(this,E)&&e){e=new Response(e.body,e);for(const[t,s]of n(this,E).headers.entries())if(t!=="content-type")if(t==="set-cookie"){const i=n(this,E).headers.getSetCookie();e.headers.delete("set-cookie");for(const r of i)e.headers.append("set-cookie",r)}else e.headers.set(t,s)}m(this,E,e),this.finalized=!0}get var(){return n(this,q)?Object.fromEntries(n(this,q)):{}}},ge=new WeakMap,he=new WeakMap,q=new WeakMap,oe=new WeakMap,N=new WeakMap,E=new WeakMap,xe=new WeakMap,ne=new WeakMap,le=new WeakMap,K=new WeakMap,be=new WeakMap,ve=new WeakMap,Q=new WeakSet,ie=function(e,t,s){const i=n(this,E)?new Headers(n(this,E).headers):n(this,K)??new Headers;if(typeof t=="object"&&"headers"in t){const a=t.headers instanceof Headers?t.headers:new Headers(t.headers);for(const[o,c]of a)o.toLowerCase()==="set-cookie"?i.append(o,c):i.set(o,c)}if(s)for(const[a,o]of Object.entries(s))if(typeof o=="string")i.set(a,o);else{i.delete(a);for(const c of o)i.append(a,c)}const r=typeof t=="number"?t:(t==null?void 0:t.status)??n(this,oe);return new Response(e,{status:r,headers:i})},Ue),w="ALL",_t="all",Ht=["get","post","put","delete","options","patch"],ct="Can not add a route since the matcher is already built.",dt=class extends Error{},Qt="__COMPOSED_HANDLER",$t=e=>e.text("404 Not Found",404),Qe=(e,t)=>{if("getResponse"in e){const s=e.getResponse();return t.newResponse(s.body,s)}return console.error(e),t.text("Internal Server Error",500)},M,P,ut,T,G,Pe,Se,Ge,pt=(Ge=class{constructor(t={}){h(this,P);f(this,"get");f(this,"post");f(this,"put");f(this,"delete");f(this,"options");f(this,"patch");f(this,"all");f(this,"on");f(this,"use");f(this,"router");f(this,"getPath");f(this,"_basePath","/");h(this,M,"/");f(this,"routes",[]);h(this,T,$t);f(this,"errorHandler",Qe);f(this,"onError",t=>(this.errorHandler=t,this));f(this,"notFound",t=>(m(this,T,t),this));f(this,"fetch",(t,...s)=>x(this,P,Se).call(this,t,s[1],s[0],t.method));f(this,"request",(t,s,i,r)=>t instanceof Request?this.fetch(s?new Request(t,s):t,i,r):(t=t.toString(),this.fetch(new Request(/^https?:\/\//.test(t)?t:`http://localhost${se("/",t)}`,s),i,r)));f(this,"fire",()=>{addEventListener("fetch",t=>{t.respondWith(x(this,P,Se).call(this,t.request,t,void 0,t.request.method))})});[...Ht,_t].forEach(a=>{this[a]=(o,...c)=>(typeof o=="string"?m(this,M,o):x(this,P,G).call(this,a,n(this,M),o),c.forEach(l=>{x(this,P,G).call(this,a,n(this,M),l)}),this)}),this.on=(a,o,...c)=>{for(const l of[o].flat()){m(this,M,l);for(const d of[a].flat())c.map(p=>{x(this,P,G).call(this,d.toUpperCase(),n(this,M),p)})}return this},this.use=(a,...o)=>(typeof a=="string"?m(this,M,a):(m(this,M,"*"),o.unshift(a)),o.forEach(c=>{x(this,P,G).call(this,w,n(this,M),c)}),this);const{strict:i,...r}=t;Object.assign(this,r),this.getPath=i??!0?t.getPath??tt:Ot}route(t,s){const i=this.basePath(t);return s.routes.map(r=>{var o;let a;s.errorHandler===Qe?a=r.handler:(a=async(c,l)=>(await _e([],s.errorHandler)(c,()=>r.handler(c,l))).res,a[Qt]=r.handler),x(o=i,P,G).call(o,r.method,r.path,a)}),this}basePath(t){const s=x(this,P,ut).call(this);return s._basePath=se(this._basePath,t),s}mount(t,s,i){let r,a;i&&(typeof i=="function"?a=i:(a=i.optionHandler,i.replaceRequest===!1?r=l=>l:r=i.replaceRequest));const o=a?l=>{const d=a(l);return Array.isArray(d)?d:[d]}:l=>{let d;try{d=l.executionCtx}catch{}return[l.env,d]};r||(r=(()=>{const l=se(this._basePath,t),d=l==="/"?0:l.length;return p=>{const u=new URL(p.url);return u.pathname=u.pathname.slice(d)||"/",new Request(u,p)}})());const c=async(l,d)=>{const p=await s(r(l.req.raw),...o(l));if(p)return p;await d()};return x(this,P,G).call(this,w,se(t,"*"),c),this}},M=new WeakMap,P=new WeakSet,ut=function(){const t=new pt({router:this.router,getPath:this.getPath});return t.errorHandler=this.errorHandler,m(t,T,n(this,T)),t.routes=this.routes,t},T=new WeakMap,G=function(t,s,i){t=t.toUpperCase(),s=se(this._basePath,s);const r={basePath:this._basePath,path:s,method:t,handler:i};this.router.add(t,s,[i,r]),this.routes.push(r)},Pe=function(t,s){if(t instanceof Error)return this.errorHandler(t,s);throw t},Se=function(t,s,i,r){if(r==="HEAD")return(async()=>new Response(null,await x(this,P,Se).call(this,t,s,i,"GET")))();const a=this.getPath(t,{env:i}),o=this.router.match(r,a),c=new Lt(t,{path:a,matchResult:o,env:i,executionCtx:s,notFoundHandler:n(this,T)});if(o[0].length===1){let d;try{d=o[0][0][0][0](c,async()=>{c.res=await n(this,T).call(this,c)})}catch(p){return x(this,P,Pe).call(this,p,c)}return d instanceof Promise?d.then(p=>p||(c.finalized?c.res:n(this,T).call(this,c))).catch(p=>x(this,P,Pe).call(this,p,c)):d??n(this,T).call(this,c)}const l=_e(o[0],this.errorHandler,n(this,T));return(async()=>{try{const d=await l(c);if(!d.finalized)throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return d.res}catch(d){return x(this,P,Pe).call(this,d,c)}})()},Ge),mt=[];function Wt(e,t){const s=this.buildAllMatchers(),i=(r,a)=>{const o=s[r]||s[w],c=o[2][a];if(c)return c;const l=a.match(o[0]);if(!l)return[[],mt];const d=l.indexOf("",1);return[o[1][d],l]};return this.match=i,i(e,t)}var ke="[^/]+",me=".*",fe="(?:|/.*)",re=Symbol(),zt=new Set(".\\+*[^]$()");function Ut(e,t){return e.length===1?t.length===1?e<t?-1:1:-1:t.length===1||e===me||e===fe?1:t===me||t===fe?-1:e===ke?1:t===ke?-1:e.length===t.length?e<t?-1:1:t.length-e.length}var V,J,R,Ye,qe=(Ye=class{constructor(){h(this,V);h(this,J);h(this,R,Object.create(null))}insert(t,s,i,r,a){if(t.length===0){if(n(this,V)!==void 0)throw re;if(a)return;m(this,V,s);return}const[o,...c]=t,l=o==="*"?c.length===0?["","",me]:["","",ke]:o==="/*"?["","",fe]:o.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);let d;if(l){const p=l[1];let u=l[2]||ke;if(p&&l[2]&&(u===".*"||(u=u.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(u))))throw re;if(d=n(this,R)[u],!d){if(Object.keys(n(this,R)).some(g=>g!==me&&g!==fe))throw re;if(a)return;d=n(this,R)[u]=new qe,p!==""&&m(d,J,r.varIndex++)}!a&&p!==""&&i.push([p,n(d,J)])}else if(d=n(this,R)[o],!d){if(Object.keys(n(this,R)).some(p=>p.length>1&&p!==me&&p!==fe))throw re;if(a)return;d=n(this,R)[o]=new qe}d.insert(c,s,i,r,a)}buildRegExpStr(){const s=Object.keys(n(this,R)).sort(Ut).map(i=>{const r=n(this,R)[i];return(typeof n(r,J)=="number"?`(${i})@${n(r,J)}`:zt.has(i)?`\\${i}`:i)+r.buildRegExpStr()});return typeof n(this,V)=="number"&&s.unshift(`#${n(this,V)}`),s.length===0?"":s.length===1?s[0]:"(?:"+s.join("|")+")"}},V=new WeakMap,J=new WeakMap,R=new WeakMap,Ye),je,ye,Ke,Gt=(Ke=class{constructor(){h(this,je,{varIndex:0});h(this,ye,new qe)}insert(e,t,s){const i=[],r=[];for(let o=0;;){let c=!1;if(e=e.replace(/\{[^}]+\}/g,l=>{const d=`@\\${o}`;return r[o]=[d,l],o++,c=!0,d}),!c)break}const a=e.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let o=r.length-1;o>=0;o--){const[c]=r[o];for(let l=a.length-1;l>=0;l--)if(a[l].indexOf(c)!==-1){a[l]=a[l].replace(c,r[o][1]);break}}return n(this,ye).insert(a,t,i,n(this,je),s),i}buildRegExp(){let e=n(this,ye).buildRegExpStr();if(e==="")return[/^$/,[],[]];let t=0;const s=[],i=[];return e=e.replace(/#(\d+)|@(\d+)|\.\*\$/g,(r,a,o)=>a!==void 0?(s[++t]=Number(a),"$()"):(o!==void 0&&(i[Number(o)]=++t),"")),[new RegExp(`^${e}`),s,i]}},je=new WeakMap,ye=new WeakMap,Ke),Yt=[/^$/,[],Object.create(null)],Ce=Object.create(null);function ft(e){return Ce[e]??(Ce[e]=new RegExp(e==="*"?"":`^${e.replace(/\/\*$|([.\\+*[^\]$()])/g,(t,s)=>s?`\\${s}`:"(?:|/.*)")}$`))}function Kt(){Ce=Object.create(null)}function Vt(e){var d;const t=new Gt,s=[];if(e.length===0)return Yt;const i=e.map(p=>[!/\*|\/:/.test(p[0]),...p]).sort(([p,u],[g,y])=>p?1:g?-1:u.length-y.length),r=Object.create(null);for(let p=0,u=-1,g=i.length;p<g;p++){const[y,j,b]=i[p];y?r[j]=[b.map(([k])=>[k,Object.create(null)]),mt]:u++;let v;try{v=t.insert(j,u,y)}catch(k){throw k===re?new dt(j):k}y||(s[u]=b.map(([k,ee])=>{const de=Object.create(null);for(ee-=1;ee>=0;ee--){const[F,Ae]=v[ee];de[F]=Ae}return[k,de]}))}const[a,o,c]=t.buildRegExp();for(let p=0,u=s.length;p<u;p++)for(let g=0,y=s[p].length;g<y;g++){const j=(d=s[p][g])==null?void 0:d[1];if(!j)continue;const b=Object.keys(j);for(let v=0,k=b.length;v<k;v++)j[b[v]]=c[j[b[v]]]}const l=[];for(const p in o)l[p]=s[o[p]];return[a,l,r]}function te(e,t){if(e){for(const s of Object.keys(e).sort((i,r)=>r.length-i.length))if(ft(s).test(t))return[...e[s]]}}var $,W,De,gt,Ve,Jt=(Ve=class{constructor(){h(this,De);f(this,"name","RegExpRouter");h(this,$);h(this,W);f(this,"match",Wt);m(this,$,{[w]:Object.create(null)}),m(this,W,{[w]:Object.create(null)})}add(e,t,s){var c;const i=n(this,$),r=n(this,W);if(!i||!r)throw new Error(ct);i[e]||[i,r].forEach(l=>{l[e]=Object.create(null),Object.keys(l[w]).forEach(d=>{l[e][d]=[...l[w][d]]})}),t==="/*"&&(t="*");const a=(t.match(/\/:/g)||[]).length;if(/\*$/.test(t)){const l=ft(t);e===w?Object.keys(i).forEach(d=>{var p;(p=i[d])[t]||(p[t]=te(i[d],t)||te(i[w],t)||[])}):(c=i[e])[t]||(c[t]=te(i[e],t)||te(i[w],t)||[]),Object.keys(i).forEach(d=>{(e===w||e===d)&&Object.keys(i[d]).forEach(p=>{l.test(p)&&i[d][p].push([s,a])})}),Object.keys(r).forEach(d=>{(e===w||e===d)&&Object.keys(r[d]).forEach(p=>l.test(p)&&r[d][p].push([s,a]))});return}const o=st(t)||[t];for(let l=0,d=o.length;l<d;l++){const p=o[l];Object.keys(r).forEach(u=>{var g;(e===w||e===u)&&((g=r[u])[p]||(g[p]=[...te(i[u],p)||te(i[w],p)||[]]),r[u][p].push([s,a-d+l+1]))})}}buildAllMatchers(){const e=Object.create(null);return Object.keys(n(this,W)).concat(Object.keys(n(this,$))).forEach(t=>{e[t]||(e[t]=x(this,De,gt).call(this,t))}),m(this,$,m(this,W,void 0)),Kt(),e}},$=new WeakMap,W=new WeakMap,De=new WeakSet,gt=function(e){const t=[];let s=e===w;return[n(this,$),n(this,W)].forEach(i=>{const r=i[e]?Object.keys(i[e]).map(a=>[a,i[e][a]]):[];r.length!==0?(s||(s=!0),t.push(...r)):e!==w&&t.push(...Object.keys(i[w]).map(a=>[a,i[w][a]]))}),s?Vt(t):null},Ve),z,B,Je,Xt=(Je=class{constructor(e){f(this,"name","SmartRouter");h(this,z,[]);h(this,B,[]);m(this,z,e.routers)}add(e,t,s){if(!n(this,B))throw new Error(ct);n(this,B).push([e,t,s])}match(e,t){if(!n(this,B))throw new Error("Fatal error");const s=n(this,z),i=n(this,B),r=s.length;let a=0,o;for(;a<r;a++){const c=s[a];try{for(let l=0,d=i.length;l<d;l++)c.add(...i[l]);o=c.match(e,t)}catch(l){if(l instanceof dt)continue;throw l}this.match=c.match.bind(c),m(this,z,[c]),m(this,B,void 0);break}if(a===r)throw new Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,o}get activeRouter(){if(n(this,B)||n(this,z).length!==1)throw new Error("No active router has been determined yet.");return n(this,z)[0]}},z=new WeakMap,B=new WeakMap,Je),ue=Object.create(null),U,C,X,ce,S,I,Y,Xe,ht=(Xe=class{constructor(e,t,s){h(this,I);h(this,U);h(this,C);h(this,X);h(this,ce,0);h(this,S,ue);if(m(this,C,s||Object.create(null)),m(this,U,[]),e&&t){const i=Object.create(null);i[e]={handler:t,possibleKeys:[],score:0},m(this,U,[i])}m(this,X,[])}insert(e,t,s){m(this,ce,++Le(this,ce)._);let i=this;const r=At(t),a=[];for(let o=0,c=r.length;o<c;o++){const l=r[o],d=r[o+1],p=Rt(l,d),u=Array.isArray(p)?p[0]:l;if(u in n(i,C)){i=n(i,C)[u],p&&a.push(p[1]);continue}n(i,C)[u]=new ht,p&&(n(i,X).push(p),a.push(p[1])),i=n(i,C)[u]}return n(i,U).push({[e]:{handler:s,possibleKeys:a.filter((o,c,l)=>l.indexOf(o)===c),score:n(this,ce)}}),i}search(e,t){var c;const s=[];m(this,S,ue);let r=[this];const a=et(t),o=[];for(let l=0,d=a.length;l<d;l++){const p=a[l],u=l===d-1,g=[];for(let y=0,j=r.length;y<j;y++){const b=r[y],v=n(b,C)[p];v&&(m(v,S,n(b,S)),u?(n(v,C)["*"]&&s.push(...x(this,I,Y).call(this,n(v,C)["*"],e,n(b,S))),s.push(...x(this,I,Y).call(this,v,e,n(b,S)))):g.push(v));for(let k=0,ee=n(b,X).length;k<ee;k++){const de=n(b,X)[k],F=n(b,S)===ue?{}:{...n(b,S)};if(de==="*"){const _=n(b,C)["*"];_&&(s.push(...x(this,I,Y).call(this,_,e,n(b,S))),m(_,S,F),g.push(_));continue}const[Ae,Be,pe]=de;if(!p&&!(pe instanceof RegExp))continue;const O=n(b,C)[Ae],yt=a.slice(l).join("/");if(pe instanceof RegExp){const _=pe.exec(yt);if(_){if(F[Be]=_[0],s.push(...x(this,I,Y).call(this,O,e,n(b,S),F)),Object.keys(n(O,C)).length){m(O,S,F);const Me=((c=_[0].match(/\//))==null?void 0:c.length)??0;(o[Me]||(o[Me]=[])).push(O)}continue}}(pe===!0||pe.test(p))&&(F[Be]=p,u?(s.push(...x(this,I,Y).call(this,O,e,F,n(b,S))),n(O,C)["*"]&&s.push(...x(this,I,Y).call(this,n(O,C)["*"],e,F,n(b,S)))):(m(O,S,F),g.push(O)))}}r=g.concat(o.shift()??[])}return s.length>1&&s.sort((l,d)=>l.score-d.score),[s.map(({handler:l,params:d})=>[l,d])]}},U=new WeakMap,C=new WeakMap,X=new WeakMap,ce=new WeakMap,S=new WeakMap,I=new WeakSet,Y=function(e,t,s,i){const r=[];for(let a=0,o=n(e,U).length;a<o;a++){const c=n(e,U)[a],l=c[t]||c[w],d={};if(l!==void 0&&(l.params=Object.create(null),r.push(l),s!==ue||i&&i!==ue))for(let p=0,u=l.possibleKeys.length;p<u;p++){const g=l.possibleKeys[p],y=d[l.score];l.params[g]=i!=null&&i[g]&&!y?i[g]:s[g]??(i==null?void 0:i[g]),d[l.score]=!0}}return r},Xe),Z,Ze,Zt=(Ze=class{constructor(){f(this,"name","TrieRouter");h(this,Z);m(this,Z,new ht)}add(e,t,s){const i=st(t);if(i){for(let r=0,a=i.length;r<a;r++)n(this,Z).insert(e,i[r],s);return}n(this,Z).insert(e,t,s)}match(e,t){return n(this,Z).search(e,t)}},Z=new WeakMap,Ze),xt=class extends pt{constructor(e={}){super(e),this.router=e.router??new Xt({routers:[new Jt,new Zt]})}},es=e=>{const s={...{origin:"*",allowMethods:["GET","HEAD","PUT","POST","DELETE","PATCH"],allowHeaders:[],exposeHeaders:[]},...e},i=(a=>typeof a=="string"?a==="*"?()=>a:o=>a===o?o:null:typeof a=="function"?a:o=>a.includes(o)?o:null)(s.origin),r=(a=>typeof a=="function"?a:Array.isArray(a)?()=>a:()=>[])(s.allowMethods);return async function(o,c){var p;function l(u,g){o.res.headers.set(u,g)}const d=await i(o.req.header("origin")||"",o);if(d&&l("Access-Control-Allow-Origin",d),s.origin!=="*"){const u=o.req.header("Vary");u?l("Vary",u):l("Vary","Origin")}if(s.credentials&&l("Access-Control-Allow-Credentials","true"),(p=s.exposeHeaders)!=null&&p.length&&l("Access-Control-Expose-Headers",s.exposeHeaders.join(",")),o.req.method==="OPTIONS"){s.maxAge!=null&&l("Access-Control-Max-Age",s.maxAge.toString());const u=await r(o.req.header("origin")||"",o);u.length&&l("Access-Control-Allow-Methods",u.join(","));let g=s.allowHeaders;if(!(g!=null&&g.length)){const y=o.req.header("Access-Control-Request-Headers");y&&(g=y.split(/\s*,\s*/))}return g!=null&&g.length&&(l("Access-Control-Allow-Headers",g.join(",")),o.res.headers.append("Vary","Access-Control-Request-Headers")),o.res.headers.delete("Content-Length"),o.res.headers.delete("Content-Type"),new Response(null,{headers:o.res.headers,status:204,statusText:"No Content"})}await c()}},ts=/^\s*(?:text\/(?!event-stream(?:[;\s]|$))[^;\s]+|application\/(?:javascript|json|xml|xml-dtd|ecmascript|dart|postscript|rtf|tar|toml|vnd\.dart|vnd\.ms-fontobject|vnd\.ms-opentype|wasm|x-httpd-php|x-javascript|x-ns-proxy-autoconfig|x-sh|x-tar|x-virtualbox-hdd|x-virtualbox-ova|x-virtualbox-ovf|x-virtualbox-vbox|x-virtualbox-vdi|x-virtualbox-vhd|x-virtualbox-vmdk|x-www-form-urlencoded)|font\/(?:otf|ttf)|image\/(?:bmp|vnd\.adobe\.photoshop|vnd\.microsoft\.icon|vnd\.ms-dds|x-icon|x-ms-bmp)|message\/rfc822|model\/gltf-binary|x-shader\/x-fragment|x-shader\/x-vertex|[^;\s]+?\+(?:json|text|xml|yaml))(?:[;\s]|$)/i,$e=(e,t=is)=>{const s=/\.([a-zA-Z0-9]+?)$/,i=e.match(s);if(!i)return;let r=t[i[1]];return r&&r.startsWith("text")&&(r+="; charset=utf-8"),r},ss={aac:"audio/aac",avi:"video/x-msvideo",avif:"image/avif",av1:"video/av1",bin:"application/octet-stream",bmp:"image/bmp",css:"text/css",csv:"text/csv",eot:"application/vnd.ms-fontobject",epub:"application/epub+zip",gif:"image/gif",gz:"application/gzip",htm:"text/html",html:"text/html",ico:"image/x-icon",ics:"text/calendar",jpeg:"image/jpeg",jpg:"image/jpeg",js:"text/javascript",json:"application/json",jsonld:"application/ld+json",map:"application/json",mid:"audio/x-midi",midi:"audio/x-midi",mjs:"text/javascript",mp3:"audio/mpeg",mp4:"video/mp4",mpeg:"video/mpeg",oga:"audio/ogg",ogv:"video/ogg",ogx:"application/ogg",opus:"audio/opus",otf:"font/otf",pdf:"application/pdf",png:"image/png",rtf:"application/rtf",svg:"image/svg+xml",tif:"image/tiff",tiff:"image/tiff",ts:"video/mp2t",ttf:"font/ttf",txt:"text/plain",wasm:"application/wasm",webm:"video/webm",weba:"audio/webm",webmanifest:"application/manifest+json",webp:"image/webp",woff:"font/woff",woff2:"font/woff2",xhtml:"application/xhtml+xml",xml:"application/xml",zip:"application/zip","3gp":"video/3gpp","3g2":"video/3gpp2",gltf:"model/gltf+json",glb:"model/gltf-binary"},is=ss,rs=(...e)=>{let t=e.filter(r=>r!=="").join("/");t=t.replace(new RegExp("(?<=\\/)\\/+","g"),"");const s=t.split("/"),i=[];for(const r of s)r===".."&&i.length>0&&i.at(-1)!==".."?i.pop():r!=="."&&i.push(r);return i.join("/")||"."},bt={br:".br",zstd:".zst",gzip:".gz"},as=Object.keys(bt),os="index.html",ns=e=>{const t=e.root??"./",s=e.path,i=e.join??rs;return async(r,a)=>{var p,u,g,y;if(r.finalized)return a();let o;if(e.path)o=e.path;else try{if(o=decodeURIComponent(r.req.path),/(?:^|[\/\\])\.\.(?:$|[\/\\])/.test(o))throw new Error}catch{return await((p=e.onNotFound)==null?void 0:p.call(e,r.req.path,r)),a()}let c=i(t,!s&&e.rewriteRequestPath?e.rewriteRequestPath(o):o);e.isDir&&await e.isDir(c)&&(c=i(c,os));const l=e.getContent;let d=await l(c,r);if(d instanceof Response)return r.newResponse(d.body,d);if(d){const j=e.mimes&&$e(c,e.mimes)||$e(c);if(r.header("Content-Type",j||"application/octet-stream"),e.precompressed&&(!j||ts.test(j))){const b=new Set((u=r.req.header("Accept-Encoding"))==null?void 0:u.split(",").map(v=>v.trim()));for(const v of as){if(!b.has(v))continue;const k=await l(c+bt[v],r);if(k){d=k,r.header("Content-Encoding",v),r.header("Vary","Accept-Encoding",{append:!0});break}}}return await((g=e.onFound)==null?void 0:g.call(e,c,r)),r.body(d)}await((y=e.onNotFound)==null?void 0:y.call(e,c,r)),await a()}},ls=async(e,t)=>{let s;t&&t.manifest?typeof t.manifest=="string"?s=JSON.parse(t.manifest):s=t.manifest:typeof __STATIC_CONTENT_MANIFEST=="string"?s=JSON.parse(__STATIC_CONTENT_MANIFEST):s=__STATIC_CONTENT_MANIFEST;let i;t&&t.namespace?i=t.namespace:i=__STATIC_CONTENT;const r=s[e]||e;if(!r)return null;const a=await i.get(r,{type:"stream"});return a||null},cs=e=>async function(s,i){return ns({...e,getContent:async a=>ls(a,{manifest:e.manifest,namespace:e.namespace?e.namespace:s.env?s.env.__STATIC_CONTENT:void 0})})(s,i)},ds=e=>cs(e);const D=new xt;D.use("/api/*",es());D.use("/static/*",ds({root:"./public"}));async function Ee(e,t,s,i){return console.log("Email would be sent:",{to:e,subject:t,body:s}),{success:!0,message:"Email sent (simulation)"}}D.post("/api/upload",async e=>{try{const s=(await e.req.formData()).get("file");if(!s)return e.json({success:!1,message:"No file uploaded"},400);const i=10*1024*1024;if(s.size>i)return e.json({success:!1,message:"File size exceeds 10MB limit"},400);const r=["application/octet-stream","model/stl","application/sla","text/plain","application/obj","model/obj","application/step","application/stp","model/step"],a=s.name.toLowerCase();if(![".stl",".obj",".step",".stp",".3mf",".ply"].some(u=>a.endsWith(u)))return e.json({success:!1,message:"Invalid file type. Please upload STL, OBJ, STEP, or 3MF files"},400);const l=await s.arrayBuffer(),d=Buffer.from(l).toString("base64"),p={name:s.name,size:s.size,type:s.type,uploadedAt:new Date().toISOString(),base64:d.substring(0,100)+"..."};return console.log("File uploaded:",{name:s.name,size:s.size,type:s.type}),e.json({success:!0,message:"File uploaded successfully",file:{name:s.name,size:s.size,type:s.type}})}catch(t){return console.error("File upload error:",t),e.json({success:!1,message:"File upload failed"},500)}});D.post("/api/quote",async e=>{try{const t=await e.req.json(),{name:s,email:i,phone:r,service:a,material:o,quantity:c,description:l,fileName:d,fileSize:p}=t;if(!s||!i||!a)return e.json({success:!1,message:"Missing required fields"},400);const u=`QT${Date.now()}`;if(e.env.DB)try{await e.env.DB.prepare(`
          INSERT INTO quotes (name, email, phone, service, material, quantity, description, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
        `).bind(s,i,r||null,a,o||null,c||1,l||null).run(),console.log("Quote saved to database")}catch(g){console.error("Database error:",g)}else console.log("Quote request received (no DB):",t);return e.env.EMAIL_API_KEY&&e.env.ADMIN_EMAIL&&await Ee(e.env.ADMIN_EMAIL,`New Quote Request - ${u}`,`
          <h2>New 3D Printing Quote Request</h2>
          <p><strong>Quote ID:</strong> ${u}</p>
          <p><strong>Name:</strong> ${s}</p>
          <p><strong>Email:</strong> ${i}</p>
          <p><strong>Phone:</strong> ${r||"Not provided"}</p>
          <p><strong>Service:</strong> ${a}</p>
          <p><strong>Material:</strong> ${o||"Not specified"}</p>
          <p><strong>Quantity:</strong> ${c||1}</p>
          ${d?`<p><strong>File Uploaded:</strong> ${d} (${(p/1024/1024).toFixed(2)} MB)</p>`:""}
          <p><strong>Description:</strong></p>
          <p>${l||"No description provided"}</p>
        `,e.env.EMAIL_API_KEY),e.env.EMAIL_API_KEY&&await Ee(i,"Quote Request Received - Passion 3D World",`
          <h2>Thank you for your quote request!</h2>
          <p>Hi ${s},</p>
          <p>We've received your quote request (ID: ${u}) and will get back to you within 24 hours with a detailed quote.</p>
          <h3>Request Details:</h3>
          <ul>
            <li>Service: ${a}</li>
            <li>Material: ${o||"Not specified"}</li>
            <li>Quantity: ${c||1}</li>
          </ul>
          <p>If you have any questions, feel free to contact us at info@passion3dworld.com</p>
          <p>Best regards,<br>Passion 3D World Team</p>
        `,e.env.EMAIL_API_KEY),e.json({success:!0,message:"Thank you! We will contact you within 24 hours with a detailed quote.",quoteId:u})}catch(t){return console.error("Quote request error:",t),e.json({success:!1,message:"Server error occurred"},500)}});D.post("/api/contact",async e=>{try{const t=await e.req.json(),{name:s,email:i,subject:r,message:a}=t;if(!s||!i||!a)return e.json({success:!1,message:"Missing required fields"},400);if(e.env.DB)try{await e.env.DB.prepare(`
          INSERT INTO contacts (name, email, subject, message, status)
          VALUES (?, ?, ?, ?, 'unread')
        `).bind(s,i,r||null,a).run(),console.log("Contact message saved to database")}catch(o){console.error("Database error:",o)}else console.log("Contact form received (no DB):",t);return e.env.EMAIL_API_KEY&&e.env.ADMIN_EMAIL&&await Ee(e.env.ADMIN_EMAIL,`New Contact Message from ${s}`,`
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${s}</p>
          <p><strong>Email:</strong> ${i}</p>
          <p><strong>Subject:</strong> ${r||"No subject"}</p>
          <p><strong>Message:</strong></p>
          <p>${a}</p>
          <p><strong>Reply to:</strong> ${i}</p>
        `,e.env.EMAIL_API_KEY),e.env.EMAIL_API_KEY&&await Ee(i,"Message Received - Passion 3D World",`
          <h2>Thank you for contacting us!</h2>
          <p>Hi ${s},</p>
          <p>We've received your message and will get back to you as soon as possible.</p>
          <p>Best regards,<br>Passion 3D World Team</p>
        `,e.env.EMAIL_API_KEY),e.json({success:!0,message:"Thank you for contacting us! We will get back to you soon."})}catch(t){return console.error("Contact form error:",t),e.json({success:!1,message:"Server error occurred"},500)}});D.get("/api/admin/quotes",async e=>{try{if(!e.env.DB)return e.json({success:!1,message:"Database not configured"},503);const t=await e.env.DB.prepare(`
      SELECT * FROM quotes ORDER BY created_at DESC LIMIT 100
    `).all();return e.json({success:!0,quotes:t.results})}catch(t){return console.error("Error fetching quotes:",t),e.json({success:!1,message:"Server error occurred"},500)}});D.get("/api/admin/contacts",async e=>{try{if(!e.env.DB)return e.json({success:!1,message:"Database not configured"},503);const t=await e.env.DB.prepare(`
      SELECT * FROM contacts ORDER BY created_at DESC LIMIT 100
    `).all();return e.json({success:!0,contacts:t.results})}catch(t){return console.error("Error fetching contacts:",t),e.json({success:!1,message:"Server error occurred"},500)}});D.get("/",e=>e.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>3D Printing Service | Passion 3D World</title>
        <meta name="description" content="Professional 3D printing services - FDM, SLA, SLS printing. Fast turnaround, competitive pricing, high quality prints for prototypes, models, and custom parts.">
        <script src="https://cdn.tailwindcss.com"><\/script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/style.css" rel="stylesheet">
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  primary: '#4F46E5',
                  secondary: '#7C3AED',
                }
              }
            }
          }
        <\/script>
    </head>
    <body class="bg-gray-50">
        <!-- Header -->
        <header class="bg-white shadow-sm sticky top-0 z-50">
            <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <i class="fas fa-cube text-primary text-3xl mr-3"></i>
                        <h1 class="text-2xl font-bold text-gray-900">Passion 3D World</h1>
                    </div>
                    <div class="hidden md:flex space-x-8 items-center">
                        <div class="relative group">
                            <button class="text-gray-700 hover:text-primary transition flex items-center">
                                Services <i class="fas fa-chevron-down ml-1 text-xs"></i>
                            </button>
                            <div class="absolute hidden group-hover:block bg-white shadow-xl rounded-lg mt-2 py-2 w-56 z-50">
                                <a href="/3d-printing-quote" class="block px-4 py-2 hover:bg-indigo-50">
                                    <i class="fas fa-print mr-2 text-primary"></i>3D Printing Quote
                                </a>
                                <a href="/cnc-machining-quote" class="block px-4 py-2 hover:bg-indigo-50">
                                    <i class="fas fa-cogs mr-2 text-primary"></i>CNC Machining Quote
                                </a>
                                <a href="/sheet-metal-quote" class="block px-4 py-2 hover:bg-indigo-50">
                                    <i class="fas fa-industry mr-2 text-primary"></i>Sheet Metal Quote
                                </a>
                                <a href="/pcb-quote" class="block px-4 py-2 hover:bg-indigo-50">
                                    <i class="fas fa-microchip mr-2 text-primary"></i>PCB Quote
                                </a>
                                <div class="border-t my-2"></div>
                                <a href="#services" class="block px-4 py-2 hover:bg-indigo-50 text-gray-600 text-sm">
                                    View All Services
                                </a>
                            </div>
                        </div>
                        <a href="#pricing" class="text-gray-700 hover:text-primary transition">Pricing</a>
                        <a href="#materials" class="text-gray-700 hover:text-primary transition">Materials</a>
                        <a href="#portfolio" class="text-gray-700 hover:text-primary transition">Portfolio</a>
                        <a href="#contact" class="text-gray-700 hover:text-primary transition">Contact</a>
                    </div>
                    <a href="#quote" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                        Get Quote
                    </a>
                </div>
            </nav>
        </header>

        <!-- Hero Section -->
        <section class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center">
                    <h2 class="text-5xl font-bold mb-6">Professional Manufacturing Services</h2>
                    <p class="text-xl mb-8 text-indigo-100">3D Printing • CNC Machining • Sheet Metal • PCB Manufacturing</p>
                    <div class="flex justify-center gap-4 flex-wrap">
                        <a href="#quote" class="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                            Request Quote
                        </a>
                        <a href="#services" class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition">
                            Our Services
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features -->
        <section class="py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid md:grid-cols-4 gap-8">
                    <div class="text-center">
                        <div class="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-bolt text-primary text-2xl"></i>
                        </div>
                        <h3 class="font-semibold text-lg mb-2">Fast Turnaround</h3>
                        <p class="text-gray-600">24-72 hours delivery</p>
                    </div>
                    <div class="text-center">
                        <div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-certificate text-secondary text-2xl"></i>
                        </div>
                        <h3 class="font-semibold text-lg mb-2">High Quality</h3>
                        <p class="text-gray-600">Professional grade prints</p>
                    </div>
                    <div class="text-center">
                        <div class="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-dollar-sign text-primary text-2xl"></i>
                        </div>
                        <h3 class="font-semibold text-lg mb-2">Competitive Pricing</h3>
                        <p class="text-gray-600">Best rates in the market</p>
                    </div>
                    <div class="text-center">
                        <div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-headset text-secondary text-2xl"></i>
                        </div>
                        <h3 class="font-semibold text-lg mb-2">Expert Support</h3>
                        <p class="text-gray-600">Free design consultation</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Services -->
        <section id="services" class="py-16 bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold text-gray-900 mb-4">Our 3D Printing Services</h2>
                    <p class="text-xl text-gray-600">Multiple technologies to meet your specific needs</p>
                </div>
                <div class="grid md:grid-cols-3 gap-8">
                    <!-- FDM Printing -->
                    <div class="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition">
                        <div class="bg-indigo-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                            <i class="fas fa-layer-group text-primary text-2xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold mb-3">FDM Printing</h3>
                        <p class="text-gray-600 mb-4">Fused Deposition Modeling for functional prototypes and parts</p>
                        <ul class="space-y-2 mb-6">
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mt-1 mr-2"></i>
                                <span class="text-gray-700">PLA, ABS, PETG, TPU materials</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mt-1 mr-2"></i>
                                <span class="text-gray-700">Large build volume up to 300x300x400mm</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mt-1 mr-2"></i>
                                <span class="text-gray-700">Multiple color options</span>
                            </li>
                        </ul>
                        <p class="text-primary font-semibold text-lg">From ₹50/part</p>
                    </div>

                    <!-- SLA Printing -->
                    <div class="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition border-2 border-primary">
                        <div class="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4">
                            MOST POPULAR
                        </div>
                        <div class="bg-purple-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                            <i class="fas fa-microscope text-secondary text-2xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold mb-3">SLA/Resin Printing</h3>
                        <p class="text-gray-600 mb-4">High-resolution prints for detailed models and miniatures</p>
                        <ul class="space-y-2 mb-6">
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mt-1 mr-2"></i>
                                <span class="text-gray-700">0.025mm layer resolution</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mt-1 mr-2"></i>
                                <span class="text-gray-700">Smooth surface finish</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mt-1 mr-2"></i>
                                <span class="text-gray-700">Clear, standard, tough resins</span>
                            </li>
                        </ul>
                        <p class="text-primary font-semibold text-lg">From ₹100/part</p>
                    </div>

                    <!-- SLS Printing -->
                    <div class="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition">
                        <div class="bg-indigo-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                            <i class="fas fa-industry text-primary text-2xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold mb-3">SLS Printing</h3>
                        <p class="text-gray-600 mb-4">Industrial-grade parts with excellent mechanical properties</p>
                        <ul class="space-y-2 mb-6">
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mt-1 mr-2"></i>
                                <span class="text-gray-700">No support structures needed</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mt-1 mr-2"></i>
                                <span class="text-gray-700">Nylon PA12 material</span>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-check text-green-500 mt-1 mr-2"></i>
                                <span class="text-gray-700">Functional end-use parts</span>
                            </li>
                        </ul>
                        <p class="text-primary font-semibold text-lg">From ₹200/part</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Materials -->
        <section id="materials" class="py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold text-gray-900 mb-4">Available Materials</h2>
                    <p class="text-xl text-gray-600">Choose the right material for your application</p>
                </div>
                <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="border-2 border-gray-200 rounded-lg p-6 hover:border-primary transition">
                        <h4 class="font-bold text-lg mb-2">PLA</h4>
                        <p class="text-gray-600 text-sm">Biodegradable, easy to print, good for prototypes</p>
                    </div>
                    <div class="border-2 border-gray-200 rounded-lg p-6 hover:border-primary transition">
                        <h4 class="font-bold text-lg mb-2">ABS</h4>
                        <p class="text-gray-600 text-sm">Strong, heat resistant, functional parts</p>
                    </div>
                    <div class="border-2 border-gray-200 rounded-lg p-6 hover:border-primary transition">
                        <h4 class="font-bold text-lg mb-2">PETG</h4>
                        <p class="text-gray-600 text-sm">Durable, weather resistant, food safe</p>
                    </div>
                    <div class="border-2 border-gray-200 rounded-lg p-6 hover:border-primary transition">
                        <h4 class="font-bold text-lg mb-2">TPU (Flexible)</h4>
                        <p class="text-gray-600 text-sm">Rubber-like, elastic, shock absorbing</p>
                    </div>
                    <div class="border-2 border-gray-200 rounded-lg p-6 hover:border-primary transition">
                        <h4 class="font-bold text-lg mb-2">Standard Resin</h4>
                        <p class="text-gray-600 text-sm">High detail, smooth finish, general purpose</p>
                    </div>
                    <div class="border-2 border-gray-200 rounded-lg p-6 hover:border-primary transition">
                        <h4 class="font-bold text-lg mb-2">Tough Resin</h4>
                        <p class="text-gray-600 text-sm">ABS-like properties, impact resistant</p>
                    </div>
                    <div class="border-2 border-gray-200 rounded-lg p-6 hover:border-primary transition">
                        <h4 class="font-bold text-lg mb-2">Clear Resin</h4>
                        <p class="text-gray-600 text-sm">Transparent, polishable to clarity</p>
                    </div>
                    <div class="border-2 border-gray-200 rounded-lg p-6 hover:border-primary transition">
                        <h4 class="font-bold text-lg mb-2">Nylon PA12</h4>
                        <p class="text-gray-600 text-sm">Strong, flexible, production-grade</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Pricing Calculator -->
        <section id="pricing" class="py-16 bg-gray-50">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold text-gray-900 mb-4">Estimate Your Cost</h2>
                    <p class="text-xl text-gray-600">Get an instant price estimate for your 3D printing project</p>
                </div>
                <div class="bg-white rounded-xl shadow-lg p-8">
                    <div id="calculator" class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Printing Technology</label>
                            <select id="tech" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                                <option value="fdm">FDM Printing</option>
                                <option value="sla">SLA/Resin Printing</option>
                                <option value="sls">SLS Printing</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Material</label>
                            <select id="material" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                                <option value="pla">PLA</option>
                                <option value="abs">ABS</option>
                                <option value="petg">PETG</option>
                                <option value="tpu">TPU</option>
                                <option value="resin">Standard Resin</option>
                            </select>
                        </div>
                        <div class="grid md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Length (mm)</label>
                                <input type="number" id="length" value="50" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Width (mm)</label>
                                <input type="number" id="width" value="50" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Height (mm)</label>
                                <input type="number" id="height" value="50" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                            <input type="number" id="quantity" value="1" min="1" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Infill Density</label>
                            <select id="infill" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                                <option value="10">10% (Prototype)</option>
                                <option value="20" selected>20% (Standard)</option>
                                <option value="50">50% (Strong)</option>
                                <option value="100">100% (Solid)</option>
                            </select>
                        </div>
                        <button onclick="calculatePrice()" class="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                            Calculate Price
                        </button>
                        <div id="priceResult" class="hidden bg-indigo-50 border-2 border-primary rounded-lg p-6 text-center">
                            <p class="text-gray-700 mb-2">Estimated Cost</p>
                            <p class="text-4xl font-bold text-primary" id="priceAmount">₹0</p>
                            <p class="text-sm text-gray-600 mt-2">* Final price may vary based on actual model complexity</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Quote Request Form -->
        <section id="quote" class="py-16 bg-white">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold text-gray-900 mb-4">Request a Quote</h2>
                    <p class="text-xl text-gray-600">Send us your 3D file and requirements for a detailed quote</p>
                </div>
                <div class="bg-gray-50 rounded-xl shadow-lg p-8">
                    <form id="quoteForm" class="space-y-6">
                        <div class="grid md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                <input type="text" name="name" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                                <input type="email" name="email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <input type="tel" name="phone" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                        </div>
                        <div class="grid md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Service Type *</label>
                                <select name="service" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                                    <option value="">Select service...</option>
                                    <option value="fdm">FDM Printing</option>
                                    <option value="sla">SLA/Resin Printing</option>
                                    <option value="sls">SLS Printing</option>
                                    <option value="design">3D Design Service</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Material Preference</label>
                                <select name="material" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                                    <option value="">Select material...</option>
                                    <option value="pla">PLA</option>
                                    <option value="abs">ABS</option>
                                    <option value="petg">PETG</option>
                                    <option value="tpu">TPU</option>
                                    <option value="resin">Standard Resin</option>
                                    <option value="tough">Tough Resin</option>
                                    <option value="nylon">Nylon PA12</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                            <input type="number" name="quantity" min="1" value="1" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
                            <textarea name="description" rows="4" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Describe your project requirements, dimensions, color preferences, finish requirements, delivery timeline, etc."></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">3D File Upload (Optional)</label>
                            <input type="file" id="fileInput" accept=".stl,.obj,.step,.stp,.3mf,.ply" class="hidden">
                            <div id="fileButton" class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition cursor-pointer">
                                <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                                <p class="text-gray-600 mb-2">Click to upload your 3D file</p>
                                <p class="text-sm text-gray-500">Supported: STL, OBJ, STEP, 3MF (Max 10MB)</p>
                                <p class="text-xs text-gray-400 mt-2">Or email files to: info@passion3dworld.com</p>
                            </div>
                            <div id="fileInfo" class="hidden mt-3 bg-green-50 border border-green-200 rounded-lg p-4">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center">
                                        <i class="fas fa-file-alt text-green-600 text-2xl mr-3"></i>
                                        <div>
                                            <p class="font-semibold text-gray-800" id="fileName">file.stl</p>
                                            <p class="text-sm text-gray-600" id="fileSize">0 MB</p>
                                        </div>
                                    </div>
                                    <button type="button" id="removeFile" class="text-red-500 hover:text-red-700">
                                        <i class="fas fa-times text-xl"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <button type="submit" class="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                            <i class="fas fa-paper-plane mr-2"></i>
                            Submit Quote Request
                        </button>
                        <div id="quoteMessage" class="hidden"></div>
                    </form>
                </div>
            </div>
        </section>

        <!-- Portfolio/Gallery -->
        <section id="portfolio" class="py-16 bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold text-gray-900 mb-4">Our Work</h2>
                    <p class="text-xl text-gray-600">See what we've created for our clients</p>
                </div>
                <div class="grid md:grid-cols-3 gap-8">
                    <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
                        <div class="h-64 bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center">
                            <i class="fas fa-robot text-white text-8xl"></i>
                        </div>
                        <div class="p-6">
                            <h3 class="font-bold text-lg mb-2">Prototype Models</h3>
                            <p class="text-gray-600">Functional prototypes for product development</p>
                        </div>
                    </div>
                    <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
                        <div class="h-64 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                            <i class="fas fa-chess text-white text-8xl"></i>
                        </div>
                        <div class="p-6">
                            <h3 class="font-bold text-lg mb-2">Miniatures & Models</h3>
                            <p class="text-gray-600">Highly detailed miniatures and display models</p>
                        </div>
                    </div>
                    <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
                        <div class="h-64 bg-gradient-to-br from-pink-400 to-red-400 flex items-center justify-center">
                            <i class="fas fa-cog text-white text-8xl"></i>
                        </div>
                        <div class="p-6">
                            <h3 class="font-bold text-lg mb-2">Custom Parts</h3>
                            <p class="text-gray-600">Replacement parts and custom components</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Process -->
        <section class="py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                    <p class="text-xl text-gray-600">Simple 4-step process from design to delivery</p>
                </div>
                <div class="grid md:grid-cols-4 gap-8">
                    <div class="text-center">
                        <div class="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
                        <h3 class="font-semibold text-lg mb-2">Upload Your Design</h3>
                        <p class="text-gray-600">Send us your 3D file or describe your requirements</p>
                    </div>
                    <div class="text-center">
                        <div class="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
                        <h3 class="font-semibold text-lg mb-2">Get a Quote</h3>
                        <p class="text-gray-600">Receive detailed pricing within 24 hours</p>
                    </div>
                    <div class="text-center">
                        <div class="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
                        <h3 class="font-semibold text-lg mb-2">We Print</h3>
                        <p class="text-gray-600">Your parts are printed with care and quality</p>
                    </div>
                    <div class="text-center">
                        <div class="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">4</div>
                        <h3 class="font-semibold text-lg mb-2">Fast Delivery</h3>
                        <p class="text-gray-600">Receive your prints within 2-5 business days</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- FAQ -->
        <section class="py-16 bg-gray-50">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                </div>
                <div class="space-y-4">
                    <div class="bg-white rounded-lg shadow-md p-6">
                        <h3 class="font-semibold text-lg mb-2 flex items-center">
                            <i class="fas fa-question-circle text-primary mr-2"></i>
                            What file formats do you accept?
                        </h3>
                        <p class="text-gray-600 pl-7">We accept STL, OBJ, STEP, and other common 3D file formats. If you don't have a 3D file, we also offer design services.</p>
                    </div>
                    <div class="bg-white rounded-lg shadow-md p-6">
                        <h3 class="font-semibold text-lg mb-2 flex items-center">
                            <i class="fas fa-question-circle text-primary mr-2"></i>
                            What is the typical turnaround time?
                        </h3>
                        <p class="text-gray-600 pl-7">Standard turnaround is 2-5 business days. Rush orders can be completed in 24-48 hours with additional fees.</p>
                    </div>
                    <div class="bg-white rounded-lg shadow-md p-6">
                        <h3 class="font-semibold text-lg mb-2 flex items-center">
                            <i class="fas fa-question-circle text-primary mr-2"></i>
                            Do you offer post-processing services?
                        </h3>
                        <p class="text-gray-600 pl-7">Yes, we offer sanding, painting, vapor smoothing, and other finishing services upon request.</p>
                    </div>
                    <div class="bg-white rounded-lg shadow-md p-6">
                        <h3 class="font-semibold text-lg mb-2 flex items-center">
                            <i class="fas fa-question-circle text-primary mr-2"></i>
                            What is your minimum order quantity?
                        </h3>
                        <p class="text-gray-600 pl-7">No minimum order! We print single prototypes as well as production runs of 1000+ units.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Contact -->
        <section id="contact" class="py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
                    <p class="text-xl text-gray-600">Have questions? We're here to help!</p>
                </div>
                <div class="grid md:grid-cols-2 gap-12">
                    <div>
                        <h3 class="text-2xl font-bold mb-6">Contact Information</h3>
                        <div class="space-y-4">
                            <div class="flex items-start">
                                <i class="fas fa-map-marker-alt text-primary text-xl mt-1 mr-4"></i>
                                <div>
                                    <h4 class="font-semibold">Address</h4>
                                    <p class="text-gray-600">Passion 3D World Studio<br>Your City, Your State</p>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <i class="fas fa-phone text-primary text-xl mt-1 mr-4"></i>
                                <div>
                                    <h4 class="font-semibold">Phone</h4>
                                    <p class="text-gray-600">+91 9137361474</p>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <i class="fas fa-envelope text-primary text-xl mt-1 mr-4"></i>
                                <div>
                                    <h4 class="font-semibold">Email</h4>
                                    <p class="text-gray-600">info@passion3dworld.com</p>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <i class="fas fa-clock text-primary text-xl mt-1 mr-4"></i>
                                <div>
                                    <h4 class="font-semibold">Business Hours</h4>
                                    <p class="text-gray-600">Mon-Fri: 9:00 AM - 12:00 PM<br>Sat: 9:00 AM - 12:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-2xl font-bold mb-6">Send us a Message</h3>
                        <form id="contactForm" class="space-y-4">
                            <div>
                                <input type="text" name="name" placeholder="Your Name" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                            </div>
                            <div>
                                <input type="email" name="email" placeholder="Your Email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                            </div>
                            <div>
                                <input type="text" name="subject" placeholder="Subject" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                            </div>
                            <div>
                                <textarea name="message" rows="4" placeholder="Your Message" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"></textarea>
                            </div>
                            <button type="submit" class="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                                Send Message
                            </button>
                            <div id="contactMessage" class="hidden"></div>
                        </form>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="bg-gray-900 text-white py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div class="flex items-center mb-4">
                            <i class="fas fa-cube text-primary text-2xl mr-2"></i>
                            <h3 class="text-xl font-bold">Passion 3D World</h3>
                        </div>
                        <p class="text-gray-400">Professional 3D printing services for makers, designers, and businesses.</p>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-4">Services</h4>
                        <ul class="space-y-2 text-gray-400">
                            <li><a href="#services" class="hover:text-white transition">FDM Printing</a></li>
                            <li><a href="#services" class="hover:text-white transition">SLA Printing</a></li>
                            <li><a href="#services" class="hover:text-white transition">SLS Printing</a></li>
                            <li><a href="#" class="hover:text-white transition">3D Design</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-4">Quick Links</h4>
                        <ul class="space-y-2 text-gray-400">
                            <li><a href="#pricing" class="hover:text-white transition">Pricing</a></li>
                            <li><a href="#portfolio" class="hover:text-white transition">Portfolio</a></li>
                            <li><a href="#quote" class="hover:text-white transition">Get Quote</a></li>
                            <li><a href="#contact" class="hover:text-white transition">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-4">Follow Us</h4>
                        <div class="flex space-x-4">
                            <a href="#" class="text-gray-400 hover:text-white transition"><i class="fab fa-facebook text-2xl"></i></a>
                            <a href="#" class="text-gray-400 hover:text-white transition"><i class="fab fa-instagram text-2xl"></i></a>
                            <a href="#" class="text-gray-400 hover:text-white transition"><i class="fab fa-twitter text-2xl"></i></a>
                            <a href="#" class="text-gray-400 hover:text-white transition"><i class="fab fa-linkedin text-2xl"></i></a>
                        </div>
                    </div>
                </div>
                <div class="border-t border-gray-800 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 Passion 3D World. All rights reserved.</p>
                </div>
            </div>
        </footer>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"><\/script>
        <script src="/static/app.js"><\/script>
    </body>
    </html>
  `));D.get("/3d-printing-quote",e=>e.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>3D Printing Quote | Passion 3D World</title>
        <script src="https://cdn.tailwindcss.com"><\/script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"><\/script>
        <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#4F46E5',
                        secondary: '#7C3AED',
                    }
                }
            }
        }
        <\/script>
        <link href="/static/style.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <header class="bg-white shadow-sm sticky top-0 z-50">
            <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <i class="fas fa-cube text-primary text-3xl mr-3"></i>
                        <a href="/" class="text-2xl font-bold text-gray-900">Passion 3D World</a>
                    </div>
                    <div class="hidden md:flex space-x-6">
                        <a href="/" class="text-gray-700 hover:text-primary transition">Home</a>
                        <div class="relative group">
                            <button class="text-gray-700 hover:text-primary transition flex items-center">
                                Services <i class="fas fa-chevron-down ml-1 text-xs"></i>
                            </button>
                            <div class="absolute hidden group-hover:block bg-white shadow-xl rounded-lg mt-2 py-2 w-56 z-50">
                                <a href="/3d-printing-quote" class="block px-4 py-2 hover:bg-indigo-50 text-primary font-semibold">
                                    <i class="fas fa-print mr-2"></i>3D Printing
                                </a>
                                <a href="/cnc-machining-quote" class="block px-4 py-2 hover:bg-indigo-50">
                                    <i class="fas fa-cogs mr-2 text-primary"></i>CNC Machining
                                </a>
                                <a href="/sheet-metal-quote" class="block px-4 py-2 hover:bg-indigo-50">
                                    <i class="fas fa-industry mr-2 text-primary"></i>Sheet Metal
                                </a>
                                <a href="/pcb-quote" class="block px-4 py-2 hover:bg-indigo-50">
                                    <i class="fas fa-microchip mr-2 text-primary"></i>PCB Manufacturing
                                </a>
                            </div>
                        </div>
                        <a href="/#contact" class="text-gray-700 hover:text-primary transition">Contact</a>
                    </div>
                    <a href="tel:+919137361474" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                        <i class="fas fa-phone mr-2"></i>Call Now
                    </a>
                </div>
            </nav>
        </header>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="text-center mb-12">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">
                    <i class="fas fa-print text-primary mr-3"></i>
                    3D Printing Quote Calculator
                </h1>
                <p class="text-xl text-gray-600">Get instant pricing for your 3D printing project</p>
            </div>

            <div class="grid lg:grid-cols-3 gap-8">
                <!-- Quote Form -->
                <div class="lg:col-span-2">
                    <div class="bg-white rounded-xl shadow-lg p-8">
                        <h2 class="text-2xl font-bold mb-6">Project Details</h2>
                        
                        <form id="printingQuoteForm" class="space-y-6">
                            <!-- Technology Selection -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-3">
                                    <i class="fas fa-cog mr-2 text-primary"></i>Technology
                                </label>
                                <div class="grid md:grid-cols-3 gap-4">
                                    <label class="relative cursor-pointer">
                                        <input type="radio" name="technology" value="fdm" checked class="peer sr-only">
                                        <div class="border-2 border-gray-300 rounded-lg p-4 peer-checked:border-primary peer-checked:bg-indigo-50">
                                            <h4 class="font-semibold">FDM</h4>
                                            <p class="text-sm text-gray-600">From ₹50/part</p>
                                        </div>
                                    </label>
                                    <label class="relative cursor-pointer">
                                        <input type="radio" name="technology" value="sla" class="peer sr-only">
                                        <div class="border-2 border-gray-300 rounded-lg p-4 peer-checked:border-primary peer-checked:bg-indigo-50">
                                            <h4 class="font-semibold">SLA/Resin</h4>
                                            <p class="text-sm text-gray-600">From ₹100/part</p>
                                        </div>
                                    </label>
                                    <label class="relative cursor-pointer">
                                        <input type="radio" name="technology" value="sls" class="peer sr-only">
                                        <div class="border-2 border-gray-300 rounded-lg p-4 peer-checked:border-primary peer-checked:bg-indigo-50">
                                            <h4 class="font-semibold">SLS</h4>
                                            <p class="text-sm text-gray-600">From ₹200/part</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <!-- Material Selection -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-cube mr-2 text-primary"></i>Material
                                </label>
                                <select id="material" name="material" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                    <option value="pla">PLA - Standard</option>
                                    <option value="abs">ABS - Heat Resistant</option>
                                    <option value="petg">PETG - Durable</option>
                                    <option value="tpu">TPU - Flexible</option>
                                    <option value="resin">Standard Resin</option>
                                    <option value="tough">Tough Resin</option>
                                    <option value="nylon">Nylon PA12</option>
                                </select>
                            </div>

                            <!-- Dimensions -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-ruler-combined mr-2 text-primary"></i>Dimensions (mm)
                                </label>
                                <div class="grid grid-cols-3 gap-4">
                                    <input type="number" id="length" placeholder="Length" value="50" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                    <input type="number" id="width" placeholder="Width" value="50" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                    <input type="number" id="height" placeholder="Height" value="50" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                </div>
                            </div>

                            <!-- Infill & Surface Finish -->
                            <div class="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        <i class="fas fa-percentage mr-2 text-primary"></i>Infill Density
                                    </label>
                                    <select id="infill" name="infill" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                        <option value="10">10% - Prototype</option>
                                        <option value="20" selected>20% - Standard</option>
                                        <option value="50">50% - Strong</option>
                                        <option value="100">100% - Solid</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        <i class="fas fa-paint-brush mr-2 text-primary"></i>Surface Finish
                                    </label>
                                    <select name="finish" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                        <option value="standard">Standard</option>
                                        <option value="smooth">Smooth (Sanding)</option>
                                        <option value="painted">Painted</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Quantity & Color -->
                            <div class="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        <i class="fas fa-sort-numeric-up mr-2 text-primary"></i>Quantity
                                    </label>
                                    <input type="number" id="quantity" name="quantity" value="1" min="1" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        <i class="fas fa-palette mr-2 text-primary"></i>Color
                                    </label>
                                    <select name="color" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                        <option value="standard">Standard (White/Gray)</option>
                                        <option value="black">Black</option>
                                        <option value="custom">Custom Color (+10%)</option>
                                    </select>
                                </div>
                            </div>

                            <!-- File Upload -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-cloud-upload-alt mr-2 text-primary"></i>Upload 3D File
                                </label>
                                <input type="file" id="fileInput3d" accept=".stl,.obj,.step,.stp,.3mf" class="hidden">
                                <div id="fileButton3d" class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition">
                                    <i class="fas fa-file-upload text-3xl text-gray-400 mb-2"></i>
                                    <p class="text-gray-600">Click to upload STL, OBJ, STEP (Max 10MB)</p>
                                </div>
                                <div id="fileInfo3d" class="hidden mt-3 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                                    <div class="flex items-center">
                                        <i class="fas fa-file-alt text-green-600 mr-3"></i>
                                        <span id="fileName3d" class="font-semibold"></span>
                                    </div>
                                    <button type="button" id="removeFile3d" class="text-red-500 hover:text-red-700">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>

                            <button type="button" onclick="calculate3DPrice()" class="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                                <i class="fas fa-calculator mr-2"></i>Calculate Price
                            </button>
                        </form>
                    </div>
                </div>

                <!-- Price Summary -->
                <div class="lg:col-span-1">
                    <div class="bg-white rounded-xl shadow-lg p-8 sticky top-24">
                        <h3 class="text-xl font-bold mb-6">Price Summary</h3>
                        
                        <div id="priceBreakdown" class="space-y-4 mb-6">
                            <div class="flex justify-between text-gray-600">
                                <span>Base Price:</span>
                                <span id="basePrice">₹0</span>
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>Material:</span>
                                <span id="materialCost">₹0</span>
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>Quantity (×<span id="qtyDisplay">1</span>):</span>
                                <span id="quantityCost">₹0</span>
                            </div>
                            <div class="flex justify-between text-green-600">
                                <span>Bulk Discount:</span>
                                <span id="discount">-₹0</span>
                            </div>
                            <hr>
                            <div class="flex justify-between text-2xl font-bold text-primary">
                                <span>Total:</span>
                                <span id="totalPrice">₹0</span>
                            </div>
                        </div>

                        <div class="bg-indigo-50 rounded-lg p-4 mb-6">
                            <h4 class="font-semibold mb-2">
                                <i class="fas fa-info-circle text-primary mr-2"></i>Includes:
                            </h4>
                            <ul class="text-sm space-y-1 text-gray-700">
                                <li>✓ 3D Printing</li>
                                <li>✓ Support Removal</li>
                                <li>✓ Basic Finishing</li>
                                <li>✓ Quality Check</li>
                            </ul>
                        </div>

                        <a href="tel:+919137361474" class="block w-full bg-green-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-700 transition mb-3">
                            <i class="fas fa-phone mr-2"></i>Call to Order
                        </a>
                        <a href="mailto:info@passion3dworld.com" class="block w-full border-2 border-primary text-primary text-center py-3 rounded-lg font-semibold hover:bg-indigo-50 transition">
                            <i class="fas fa-envelope mr-2"></i>Email Quote
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <script src="/static/quote-calculator.js"><\/script>
    </body>
    </html>
  `));D.get("/cnc-machining-quote",e=>e.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CNC Machining Quote | Passion 3D World</title>
        <script src="https://cdn.tailwindcss.com"><\/script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"><\/script>
        <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#4F46E5',
                        secondary: '#7C3AED',
                    }
                }
            }
        }
        <\/script>
        <link href="/static/style.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <header class="bg-white shadow-sm sticky top-0 z-50">
            <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <i class="fas fa-cube text-primary text-3xl mr-3"></i>
                        <a href="/" class="text-2xl font-bold text-gray-900">Passion 3D World</a>
                    </div>
                    <div class="hidden md:flex space-x-6">
                        <a href="/" class="text-gray-700 hover:text-primary transition">Home</a>
                        <div class="relative group">
                            <button class="text-gray-700 hover:text-primary transition flex items-center">
                                Services <i class="fas fa-chevron-down ml-1 text-xs"></i>
                            </button>
                            <div class="absolute hidden group-hover:block bg-white shadow-xl rounded-lg mt-2 py-2 w-56 z-50">
                                <a href="/3d-printing-quote" class="block px-4 py-2 hover:bg-indigo-50">
                                    <i class="fas fa-print mr-2 text-primary"></i>3D Printing
                                </a>
                                <a href="/cnc-machining-quote" class="block px-4 py-2 hover:bg-indigo-50 text-primary font-semibold">
                                    <i class="fas fa-cogs mr-2"></i>CNC Machining
                                </a>
                                <a href="/sheet-metal-quote" class="block px-4 py-2 hover:bg-indigo-50">
                                    <i class="fas fa-industry mr-2 text-primary"></i>Sheet Metal
                                </a>
                                <a href="/pcb-quote" class="block px-4 py-2 hover:bg-indigo-50">
                                    <i class="fas fa-microchip mr-2 text-primary"></i>PCB Manufacturing
                                </a>
                            </div>
                        </div>
                        <a href="/#contact" class="text-gray-700 hover:text-primary transition">Contact</a>
                    </div>
                    <a href="tel:+919137361474" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                        <i class="fas fa-phone mr-2"></i>Call Now
                    </a>
                </div>
            </nav>
        </header>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="text-center mb-12">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">
                    <i class="fas fa-cogs text-primary mr-3"></i>
                    CNC Machining Quote Calculator
                </h1>
                <p class="text-xl text-gray-600">Get instant pricing for precision CNC machining</p>
            </div>

            <div class="grid lg:grid-cols-3 gap-8">
                <!-- Quote Form -->
                <div class="lg:col-span-2">
                    <div class="bg-white rounded-xl shadow-lg p-8">
                        <h2 class="text-2xl font-bold mb-6">Part Specifications</h2>
                        
                        <form id="cncQuoteForm" class="space-y-6">
                            <!-- Material Selection -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-cube mr-2 text-primary"></i>Material
                                </label>
                                <select id="cncMaterial" onchange="calculateCNCPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                    <option value="aluminum">Aluminum 6061</option>
                                    <option value="steel">Mild Steel</option>
                                    <option value="stainless">Stainless Steel 304</option>
                                    <option value="brass">Brass</option>
                                    <option value="copper">Copper</option>
                                    <option value="plastic_abs">Plastic - ABS</option>
                                    <option value="plastic_pom">Plastic - POM (Delrin)</option>
                                    <option value="titanium">Titanium</option>
                                </select>
                            </div>

                            <!-- Dimensions -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-ruler-combined mr-2 text-primary"></i>Part Dimensions (mm)
                                </label>
                                <div class="grid grid-cols-3 gap-4">
                                    <input type="number" id="cncLength" placeholder="Length" value="100" onchange="calculateCNCPrice()" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                    <input type="number" id="cncWidth" placeholder="Width" value="100" onchange="calculateCNCPrice()" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                    <input type="number" id="cncHeight" placeholder="Height" value="50" onchange="calculateCNCPrice()" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                </div>
                                <p class="text-sm text-gray-500 mt-2">Surface Area: <span id="cncSurfaceArea" class="font-semibold">0 cm²</span></p>
                            </div>

                            <!-- Complexity Level -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-3">
                                    <i class="fas fa-sliders-h mr-2 text-primary"></i>Machining Complexity
                                </label>
                                <select id="cncComplexity" onchange="calculateCNCPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                    <option value="simple">Simple - Basic shapes, minimal features</option>
                                    <option value="medium" selected>Medium - Multiple features, some intricate work</option>
                                    <option value="complex">Complex - Complex geometries, tight tolerances</option>
                                    <option value="very_complex">Very Complex - 5-axis work, very tight tolerances</option>
                                </select>
                                <p class="text-sm text-gray-500 mt-2">Estimated Machine Time: <span id="cncMachineTime" class="font-semibold">0 hrs</span></p>
                            </div>

                            <!-- Surface Finish -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-paint-brush mr-2 text-primary"></i>Surface Finish
                                </label>
                                <select id="cncFinish" onchange="calculateCNCPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                    <option value="as_machined">As Machined</option>
                                    <option value="deburred">Deburred</option>
                                    <option value="bead_blasted">Bead Blasted</option>
                                    <option value="anodized">Anodized (Aluminum only)</option>
                                    <option value="powder_coated">Powder Coated</option>
                                    <option value="polished">Polished</option>
                                </select>
                            </div>

                            <!-- Quantity -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-sort-numeric-up mr-2 text-primary"></i>Quantity
                                </label>
                                <input type="number" id="cncQuantity" value="1" min="1" onchange="calculateCNCPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                <p class="text-sm text-gray-500 mt-2">💡 Bulk Discounts: 10+ (10% off), 20+ (15% off), 50+ (20% off)</p>
                            </div>

                            <button type="button" onclick="calculateCNCPrice()" class="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                                <i class="fas fa-calculator mr-2"></i>Calculate Price
                            </button>
                        </form>
                    </div>
                </div>

                <!-- Price Summary -->
                <div class="lg:col-span-1">
                    <div class="bg-white rounded-xl shadow-lg p-8 sticky top-24">
                        <h3 class="text-xl font-bold mb-6">Price Breakdown</h3>
                        
                        <div id="cncPriceBreakdown" class="space-y-4 mb-6">
                            <div class="flex justify-between text-gray-600">
                                <span>Material:</span>
                                <span id="cncMaterialCost">₹0</span>
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>Machining:</span>
                                <span id="cncMachiningCost">₹0</span>
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>Setup:</span>
                                <span id="cncSetupCost">₹0</span>
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>Finish:</span>
                                <span id="cncFinishCost">₹0</span>
                            </div>
                            <hr>
                            <div class="flex justify-between font-semibold">
                                <span>Per Part:</span>
                                <span id="cncPricePerPart">₹0</span>
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>Quantity (×<span id="cncQtyDisplay">1</span>):</span>
                                <span id="cncQuantityCost">₹0</span>
                            </div>
                            <div id="cncDiscountSection" class="hidden">
                                <div class="flex justify-between text-green-600">
                                    <span>Bulk Discount (<span id="cncDiscountPercent">0</span>):</span>
                                    <span id="cncDiscount">-₹0</span>
                                </div>
                            </div>
                            <hr>
                            <div class="flex justify-between text-2xl font-bold text-primary">
                                <span>Total:</span>
                                <span id="cncTotalPrice">₹0</span>
                            </div>
                        </div>

                        <div class="bg-indigo-50 rounded-lg p-4 mb-6">
                            <h4 class="font-semibold mb-2">
                                <i class="fas fa-info-circle text-primary mr-2"></i>Includes:
                            </h4>
                            <ul class="text-sm space-y-1 text-gray-700">
                                <li>✓ CNC Machining</li>
                                <li>✓ Precision ±0.01mm</li>
                                <li>✓ Quality Inspection</li>
                                <li>✓ Deburring</li>
                            </ul>
                        </div>

                        <a href="tel:+919137361474" class="block w-full bg-green-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-700 transition mb-3">
                            <i class="fas fa-phone mr-2"></i>Call to Order
                        </a>
                        <a href="mailto:info@passion3dworld.com" class="block w-full border-2 border-primary text-primary text-center py-3 rounded-lg font-semibold hover:bg-indigo-50 transition">
                            <i class="fas fa-envelope mr-2"></i>Email Quote
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <script src="/static/manufacturing-calculators.js"><\/script>
    </body>
    </html>
  `));D.get("/sheet-metal-quote",e=>e.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sheet Metal Quote | Passion 3D World</title>
        <script src="https://cdn.tailwindcss.com"><\/script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"><\/script>
        <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#4F46E5',
                        secondary: '#7C3AED',
                    }
                }
            }
        }
        <\/script>
        <link href="/static/style.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <header class="bg-white shadow-sm sticky top-0 z-50">
            <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <i class="fas fa-cube text-primary text-3xl mr-3"></i>
                        <a href="/" class="text-2xl font-bold text-gray-900">Passion 3D World</a>
                    </div>
                    <div class="hidden md:flex space-x-6">
                        <a href="/" class="text-gray-700 hover:text-primary transition">Home</a>
                        <div class="relative group">
                            <button class="text-gray-700 hover:text-primary transition flex items-center">
                                Services <i class="fas fa-chevron-down ml-1 text-xs"></i>
                            </button>
                            <div class="absolute hidden group-hover:block bg-white shadow-xl rounded-lg mt-2 py-2 w-56 z-50">
                                <a href="/3d-printing-quote" class="block px-4 py-2 hover:bg-indigo-50">
                                    <i class="fas fa-print mr-2 text-primary"></i>3D Printing
                                </a>
                                <a href="/cnc-machining-quote" class="block px-4 py-2 hover:bg-indigo-50">
                                    <i class="fas fa-cogs mr-2 text-primary"></i>CNC Machining
                                </a>
                                <a href="/sheet-metal-quote" class="block px-4 py-2 hover:bg-indigo-50 text-primary font-semibold">
                                    <i class="fas fa-industry mr-2"></i>Sheet Metal
                                </a>
                                <a href="/pcb-quote" class="block px-4 py-2 hover:bg-indigo-50">
                                    <i class="fas fa-microchip mr-2 text-primary"></i>PCB Manufacturing
                                </a>
                            </div>
                        </div>
                        <a href="/#contact" class="text-gray-700 hover:text-primary transition">Contact</a>
                    </div>
                    <a href="tel:+919137361474" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                        <i class="fas fa-phone mr-2"></i>Call Now
                    </a>
                </div>
            </nav>
        </header>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="text-center mb-12">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">
                    <i class="fas fa-industry text-primary mr-3"></i>
                    Sheet Metal Fabrication Quote Calculator
                </h1>
                <p class="text-xl text-gray-600">Get instant pricing for custom sheet metal fabrication</p>
            </div>

            <div class="grid lg:grid-cols-3 gap-8">
                <!-- Quote Form -->
                <div class="lg:col-span-2">
                    <div class="bg-white rounded-xl shadow-lg p-8">
                        <h2 class="text-2xl font-bold mb-6">Fabrication Details</h2>
                        
                        <form id="sheetMetalQuoteForm" class="space-y-6">
                            <!-- Material Selection -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-cube mr-2 text-primary"></i>Material Type
                                </label>
                                <select id="sheetMaterial" onchange="calculateSheetMetalPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                    <option value="mild_steel">Mild Steel</option>
                                    <option value="stainless">Stainless Steel 304</option>
                                    <option value="aluminum">Aluminum 5052</option>
                                    <option value="galvanized">Galvanized Steel</option>
                                    <option value="copper">Copper</option>
                                </select>
                            </div>

                            <!-- Thickness Selector -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-compress mr-2 text-primary"></i>Material Thickness (mm)
                                </label>
                                <select id="sheetThickness" onchange="calculateSheetMetalPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                    <option value="0.5">0.5mm (26 gauge)</option>
                                    <option value="0.8">0.8mm (22 gauge)</option>
                                    <option value="1.0" selected>1.0mm (20 gauge)</option>
                                    <option value="1.2">1.2mm (18 gauge)</option>
                                    <option value="1.5">1.5mm (16 gauge)</option>
                                    <option value="2.0">2.0mm (14 gauge)</option>
                                    <option value="3.0">3.0mm (11 gauge)</option>
                                    <option value="4.0">4.0mm (8 gauge)</option>
                                    <option value="5.0">5.0mm</option>
                                    <option value="6.0">6.0mm (1/4 inch)</option>
                                    <option value="8.0">8.0mm</option>
                                    <option value="10.0">10.0mm</option>
                                    <option value="12.0">12.0mm</option>
                                    <option value="15.0">15.0mm</option>
                                    <option value="20.0">20.0mm</option>
                                </select>
                            </div>

                            <!-- Sheet Dimensions -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-ruler-combined mr-2 text-primary"></i>Sheet Dimensions (mm)
                                </label>
                                <div class="grid grid-cols-2 gap-4">
                                    <input type="number" id="sheetLength" placeholder="Length" value="200" onchange="calculateSheetMetalPrice()" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                    <input type="number" id="sheetWidth" placeholder="Width" value="150" onchange="calculateSheetMetalPrice()" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                </div>
                                <div class="mt-2 text-sm text-gray-500">
                                    <p>Sheet Area: <span id="sheetArea" class="font-semibold">0 cm²</span></p>
                                    <p>Cutting Perimeter: <span id="sheetPerimeter" class="font-semibold">0 cm</span></p>
                                </div>
                            </div>

                            <!-- Bending Details -->
                            <div class="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        <i class="fas fa-angle-double-right mr-2 text-primary"></i>Number of Bends
                                    </label>
                                    <input type="number" id="bendCount" value="0" min="0" onchange="calculateSheetMetalPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        <i class="fas fa-project-diagram mr-2 text-primary"></i>Bending Complexity
                                    </label>
                                    <select id="bendComplexity" onchange="calculateSheetMetalPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                        <option value="simple">Simple - 90° bends</option>
                                        <option value="medium" selected>Medium - Multiple angles</option>
                                        <option value="complex">Complex - Tight tolerances</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Welding Requirements -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-fire mr-2 text-primary"></i>Welding Requirements
                                </label>
                                <select id="welding" onchange="calculateSheetMetalPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                    <option value="none">No Welding</option>
                                    <option value="spot">Spot Welding</option>
                                    <option value="seam_short">Seam Welding (<50cm)</option>
                                    <option value="seam_long">Seam Welding (>50cm)</option>
                                    <option value="full_assembly">Full Welded Assembly</option>
                                </select>
                            </div>

                            <!-- Surface Finish -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-paint-brush mr-2 text-primary"></i>Surface Finish
                                </label>
                                <select id="sheetFinish" onchange="calculateSheetMetalPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                    <option value="as_cut">As Cut</option>
                                    <option value="deburred">Deburred</option>
                                    <option value="powder_coated">Powder Coated</option>
                                    <option value="painted">Painted</option>
                                    <option value="polished">Polished</option>
                                    <option value="zinc_plated">Zinc Plated</option>
                                </select>
                            </div>

                            <!-- Quantity -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-sort-numeric-up mr-2 text-primary"></i>Quantity
                                </label>
                                <input type="number" id="sheetQuantity" value="1" min="1" onchange="calculateSheetMetalPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                <p class="text-sm text-gray-500 mt-2">💡 Bulk Discounts: 10+ (10%), 20+ (15%), 50+ (20%), 100+ (25%)</p>
                            </div>

                            <button type="button" onclick="calculateSheetMetalPrice()" class="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                                <i class="fas fa-calculator mr-2"></i>Calculate Price
                            </button>
                        </form>
                    </div>
                </div>

                <!-- Price Summary -->
                <div class="lg:col-span-1">
                    <div class="bg-white rounded-xl shadow-lg p-8 sticky top-24">
                        <h3 class="text-xl font-bold mb-6">Price Breakdown</h3>
                        
                        <div id="sheetPriceBreakdown" class="space-y-4 mb-6">
                            <div class="flex justify-between text-gray-600">
                                <span>Material:</span>
                                <span id="sheetMaterialCost">₹0</span>
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>Cutting:</span>
                                <span id="sheetCuttingCost">₹0</span>
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>Bending:</span>
                                <span id="sheetBendingCost">₹0</span>
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>Welding:</span>
                                <span id="sheetWeldingCost">₹0</span>
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>Finish:</span>
                                <span id="sheetFinishCost">₹0</span>
                            </div>
                            <hr>
                            <div class="flex justify-between font-semibold">
                                <span>Per Part:</span>
                                <span id="sheetPricePerPart">₹0</span>
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>Quantity (×<span id="sheetQtyDisplay">1</span>):</span>
                                <span id="sheetQuantityCost">₹0</span>
                            </div>
                            <div id="sheetDiscountSection" class="hidden">
                                <div class="flex justify-between text-green-600">
                                    <span>Bulk Discount (<span id="sheetDiscountPercent">0</span>):</span>
                                    <span id="sheetDiscount">-₹0</span>
                                </div>
                            </div>
                            <hr>
                            <div class="flex justify-between text-2xl font-bold text-primary">
                                <span>Total:</span>
                                <span id="sheetTotalPrice">₹0</span>
                            </div>
                        </div>

                        <div class="bg-indigo-50 rounded-lg p-4 mb-6">
                            <h4 class="font-semibold mb-2">
                                <i class="fas fa-info-circle text-primary mr-2"></i>Includes:
                            </h4>
                            <ul class="text-sm space-y-1 text-gray-700">
                                <li>✓ Laser/Plasma Cutting</li>
                                <li>✓ CNC Press Brake</li>
                                <li>✓ Quality Check</li>
                                <li>✓ Basic Deburring</li>
                            </ul>
                        </div>

                        <a href="tel:+919137361474" class="block w-full bg-green-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-700 transition mb-3">
                            <i class="fas fa-phone mr-2"></i>Call to Order
                        </a>
                        <a href="mailto:info@passion3dworld.com" class="block w-full border-2 border-primary text-primary text-center py-3 rounded-lg font-semibold hover:bg-indigo-50 transition">
                            <i class="fas fa-envelope mr-2"></i>Email Quote
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <script src="/static/manufacturing-calculators.js"><\/script>
    </body>
    </html>
  `));D.get("/pcb-quote",e=>e.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PCB Manufacturing Quote | Passion 3D World</title>
        <script src="https://cdn.tailwindcss.com"><\/script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"><\/script>
        <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#4F46E5',
                        secondary: '#7C3AED',
                    }
                }
            }
        }
        <\/script>
        <link href="/static/style.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <header class="bg-white shadow-sm sticky top-0 z-50">
            <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <i class="fas fa-cube text-primary text-3xl mr-3"></i>
                        <a href="/" class="text-2xl font-bold text-gray-900">Passion 3D World</a>
                    </div>
                    <div class="hidden md:flex space-x-6">
                        <a href="/" class="text-gray-700 hover:text-primary transition">Home</a>
                        <div class="relative group">
                            <button class="text-gray-700 hover:text-primary transition flex items-center">
                                Services <i class="fas fa-chevron-down ml-1 text-xs"></i>
                            </button>
                            <div class="absolute hidden group-hover:block bg-white shadow-xl rounded-lg mt-2 py-2 w-56 z-50">
                                <a href="/3d-printing-quote" class="block px-4 py-2 hover:bg-indigo-50">
                                    <i class="fas fa-print mr-2 text-primary"></i>3D Printing
                                </a>
                                <a href="/cnc-machining-quote" class="block px-4 py-2 hover:bg-indigo-50">
                                    <i class="fas fa-cogs mr-2 text-primary"></i>CNC Machining
                                </a>
                                <a href="/sheet-metal-quote" class="block px-4 py-2 hover:bg-indigo-50">
                                    <i class="fas fa-industry mr-2 text-primary"></i>Sheet Metal
                                </a>
                                <a href="/pcb-quote" class="block px-4 py-2 hover:bg-indigo-50 text-primary font-semibold">
                                    <i class="fas fa-microchip mr-2"></i>PCB Manufacturing
                                </a>
                            </div>
                        </div>
                        <a href="/#contact" class="text-gray-700 hover:text-primary transition">Contact</a>
                    </div>
                    <a href="tel:+919137361474" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                        <i class="fas fa-phone mr-2"></i>Call Now
                    </a>
                </div>
            </nav>
        </header>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="text-center mb-12">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">
                    <i class="fas fa-microchip text-primary mr-3"></i>
                    PCB Manufacturing Quote Calculator
                </h1>
                <p class="text-xl text-gray-600">Get instant pricing for custom PCB fabrication & assembly</p>
            </div>

            <div class="grid lg:grid-cols-3 gap-8">
                <!-- Quote Form -->
                <div class="lg:col-span-2">
                    <div class="bg-white rounded-xl shadow-lg p-8">
                        <h2 class="text-2xl font-bold mb-6">PCB Specifications</h2>
                        
                        <form id="pcbQuoteForm" class="space-y-6">
                            <!-- Layer Count Selector -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-3">
                                    <i class="fas fa-layer-group mr-2 text-primary"></i>PCB Layers
                                </label>
                                <div class="grid grid-cols-4 md:grid-cols-7 gap-2">
                                    <label class="relative cursor-pointer">
                                        <input type="radio" name="pcbLayers" id="pcbLayers" value="1" class="peer sr-only">
                                        <div class="border-2 border-gray-300 rounded-lg p-3 text-center peer-checked:border-primary peer-checked:bg-indigo-50">
                                            <h4 class="font-semibold">1</h4>
                                        </div>
                                    </label>
                                    <label class="relative cursor-pointer">
                                        <input type="radio" name="pcbLayers" value="2" checked class="peer sr-only" onchange="calculatePCBPrice()">
                                        <div class="border-2 border-gray-300 rounded-lg p-3 text-center peer-checked:border-primary peer-checked:bg-indigo-50">
                                            <h4 class="font-semibold">2</h4>
                                        </div>
                                    </label>
                                    <label class="relative cursor-pointer">
                                        <input type="radio" name="pcbLayers" value="4" class="peer sr-only" onchange="calculatePCBPrice()">
                                        <div class="border-2 border-gray-300 rounded-lg p-3 text-center peer-checked:border-primary peer-checked:bg-indigo-50">
                                            <h4 class="font-semibold">4</h4>
                                        </div>
                                    </label>
                                    <label class="relative cursor-pointer">
                                        <input type="radio" name="pcbLayers" value="6" class="peer sr-only" onchange="calculatePCBPrice()">
                                        <div class="border-2 border-gray-300 rounded-lg p-3 text-center peer-checked:border-primary peer-checked:bg-indigo-50">
                                            <h4 class="font-semibold">6</h4>
                                        </div>
                                    </label>
                                    <label class="relative cursor-pointer">
                                        <input type="radio" name="pcbLayers" value="8" class="peer sr-only" onchange="calculatePCBPrice()">
                                        <div class="border-2 border-gray-300 rounded-lg p-3 text-center peer-checked:border-primary peer-checked:bg-indigo-50">
                                            <h4 class="font-semibold">8</h4>
                                        </div>
                                    </label>
                                    <label class="relative cursor-pointer">
                                        <input type="radio" name="pcbLayers" value="10" class="peer sr-only" onchange="calculatePCBPrice()">
                                        <div class="border-2 border-gray-300 rounded-lg p-3 text-center peer-checked:border-primary peer-checked:bg-indigo-50">
                                            <h4 class="font-semibold">10</h4>
                                        </div>
                                    </label>
                                    <label class="relative cursor-pointer">
                                        <input type="radio" name="pcbLayers" value="12" class="peer sr-only" onchange="calculatePCBPrice()">
                                        <div class="border-2 border-gray-300 rounded-lg p-3 text-center peer-checked:border-primary peer-checked:bg-indigo-50">
                                            <h4 class="font-semibold">12</h4>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <!-- Board Dimensions -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-ruler-combined mr-2 text-primary"></i>Board Dimensions (mm)
                                </label>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <input type="number" id="pcbLength" placeholder="Length" value="100" onchange="calculatePCBPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                        <p class="text-xs text-gray-500 mt-1">Length (mm)</p>
                                    </div>
                                    <div>
                                        <input type="number" id="pcbWidth" placeholder="Width" value="80" onchange="calculatePCBPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                        <p class="text-xs text-gray-500 mt-1">Width (mm)</p>
                                    </div>
                                </div>
                                <div class="mt-2 text-sm text-gray-500">
                                    <p>Board Size: <span id="pcbBoardSize" class="font-semibold">100mm × 80mm</span></p>
                                    <p>Board Area: <span id="pcbArea" class="font-semibold">0 cm²</span></p>
                                </div>
                            </div>

                            <!-- PCB Specifications -->
                            <div class="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        <i class="fas fa-compress mr-2 text-primary"></i>Board Thickness
                                    </label>
                                    <select id="pcbThickness" onchange="calculatePCBPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                        <option value="0.8">0.8mm</option>
                                        <option value="1.0">1.0mm</option>
                                        <option value="1.6" selected>1.6mm (Standard)</option>
                                        <option value="2.0">2.0mm</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        <i class="fas fa-ethernet mr-2 text-primary"></i>Copper Weight
                                    </label>
                                    <select id="copperWeight" onchange="calculatePCBPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                        <option value="1oz" selected>1 oz (35µm)</option>
                                        <option value="2oz">2 oz (70µm)</option>
                                        <option value="3oz">3 oz (105µm)</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Surface Finish & Silkscreen -->
                            <div class="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        <i class="fas fa-layer-group mr-2 text-primary"></i>Surface Finish
                                    </label>
                                    <select id="surfaceFinish" onchange="calculatePCBPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                        <option value="hasl">HASL (Hot Air Solder Leveling)</option>
                                        <option value="lead_free_hasl" selected>Lead-Free HASL</option>
                                        <option value="enig">ENIG (Gold)</option>
                                        <option value="immersion_silver">Immersion Silver</option>
                                        <option value="immersion_tin">Immersion Tin</option>
                                        <option value="osp">OSP</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        <i class="fas fa-font mr-2 text-primary"></i>Silkscreen
                                    </label>
                                    <select id="silkscreen" onchange="calculatePCBPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                        <option value="none">No Silkscreen</option>
                                        <option value="one_side" selected>One Side</option>
                                        <option value="both_sides">Both Sides</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Quantity -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-sort-numeric-up mr-2 text-primary"></i>Quantity (boards)
                                </label>
                                <input type="number" id="pcbQuantity" value="10" min="1" onchange="calculatePCBPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                <div class="mt-2 text-sm text-gray-500">
                                    <p class="font-semibold">💡 Quantity Pricing Tiers:</p>
                                    <div class="grid grid-cols-2 gap-2 mt-1">
                                        <div>5-9: 10% off</div>
                                        <div>10-19: 15% off</div>
                                        <div>20-49: 20% off</div>
                                        <div>50-99: 25% off</div>
                                        <div>100-499: 30% off</div>
                                        <div>500-999: 35% off</div>
                                        <div>1000+: 40% off</div>
                                    </div>
                                </div>
                            </div>

                            <!-- PCB Assembly Option -->
                            <div class="border-2 border-gray-200 rounded-lg p-4">
                                <label class="flex items-center cursor-pointer">
                                    <input type="checkbox" id="assembly" onchange="calculatePCBPrice()" class="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary">
                                    <span class="ml-3 font-medium text-gray-900">
                                        <i class="fas fa-wrench text-primary mr-2"></i>Add PCB Assembly (SMT)
                                    </span>
                                </label>
                                <div id="componentCountDiv" class="mt-3">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Number of Components (per board)</label>
                                    <input type="number" id="componentCount" value="0" min="0" onchange="calculatePCBPrice()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                                    <p class="text-xs text-gray-500 mt-1">Assembly includes component placement, soldering, and testing</p>
                                </div>
                            </div>

                            <button type="button" onclick="calculatePCBPrice()" class="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                                <i class="fas fa-calculator mr-2"></i>Calculate Price
                            </button>
                        </form>
                    </div>
                </div>

                <!-- Price Summary -->
                <div class="lg:col-span-1">
                    <div class="bg-white rounded-xl shadow-lg p-8 sticky top-24">
                        <h3 class="text-xl font-bold mb-6">Price Breakdown</h3>
                        
                        <div id="pcbPriceBreakdown" class="space-y-4 mb-6">
                            <div class="flex justify-between text-gray-600">
                                <span>Per Board:</span>
                                <span id="pcbFabCost">₹0</span>
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>Setup Cost:</span>
                                <span id="pcbSetupCost">₹0</span>
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>Surface Finish:</span>
                                <span id="pcbFinishCost">₹0</span>
                            </div>
                            <hr>
                            <div class="flex justify-between text-gray-600">
                                <span>Quantity (×<span id="pcbQtyDisplay">1</span>):</span>
                                <span id="pcbFabTotal">₹0</span>
                            </div>
                            <div id="pcbTierSection" class="hidden bg-blue-50 rounded-lg p-3">
                                <div class="flex justify-between text-blue-700 font-semibold mb-1">
                                    <span id="pcbTierMessage">Prototype Tier</span>
                                    <span id="pcbTierDiscount">10%</span>
                                </div>
                                <div class="flex justify-between text-green-600">
                                    <span>Discount:</span>
                                    <span id="pcbDiscount">-₹0</span>
                                </div>
                            </div>
                            <hr>
                            <div class="flex justify-between font-semibold text-lg">
                                <span>Fabrication Total:</span>
                                <span id="pcbFabFinal">₹0</span>
                            </div>
                            <div id="pcbAssemblySection" class="hidden border-t-2 border-gray-200 pt-4">
                                <h4 class="font-semibold mb-2 text-purple-700">
                                    <i class="fas fa-wrench mr-2"></i>Assembly
                                </h4>
                                <div class="flex justify-between text-gray-600 mb-2">
                                    <span>Components (<span id="pcbComponentCount">0</span>):</span>
                                    <span id="pcbAssemblyCost">₹0</span>
                                </div>
                            </div>
                            <hr>
                            <div class="flex justify-between text-2xl font-bold text-primary">
                                <span>Total:</span>
                                <span id="pcbTotalPrice">₹0</span>
                            </div>
                        </div>

                        <div class="bg-indigo-50 rounded-lg p-4 mb-6">
                            <h4 class="font-semibold mb-2">
                                <i class="fas fa-info-circle text-primary mr-2"></i>Includes:
                            </h4>
                            <ul class="text-sm space-y-1 text-gray-700">
                                <li>✓ PCB Fabrication</li>
                                <li>✓ Electrical Testing</li>
                                <li>✓ Quality Inspection</li>
                                <li>✓ Standard Packaging</li>
                            </ul>
                        </div>

                        <a href="tel:+919137361474" class="block w-full bg-green-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-700 transition mb-3">
                            <i class="fas fa-phone mr-2"></i>Call to Order
                        </a>
                        <a href="mailto:info@passion3dworld.com" class="block w-full border-2 border-primary text-primary text-center py-3 rounded-lg font-semibold hover:bg-indigo-50 transition">
                            <i class="fas fa-envelope mr-2"></i>Email Quote
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <script src="/static/manufacturing-calculators.js"><\/script>
    </body>
    </html>
  `));const We=new xt,ps=Object.assign({"/src/index.tsx":D});let vt=!1;for(const[,e]of Object.entries(ps))e&&(We.all("*",t=>{let s;try{s=t.executionCtx}catch{}return e.fetch(t.req.raw,t.env,s)}),We.notFound(t=>{let s;try{s=t.executionCtx}catch{}return e.fetch(t.req.raw,t.env,s)}),vt=!0);if(!vt)throw new Error("Can't import modules from ['/src/index.ts','/src/index.tsx','/app/server.ts']");export{We as default};
