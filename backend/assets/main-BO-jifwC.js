var zp=Object.defineProperty,Lp=Object.defineProperties;var Tp=Object.getOwnPropertyDescriptors;var id=Object.getOwnPropertySymbols;var Mp=Object.prototype.hasOwnProperty,Pp=Object.prototype.propertyIsEnumerable;var pl=(s,d,c)=>d in s?zp(s,d,{enumerable:!0,configurable:!0,writable:!0,value:c}):s[d]=c,Ee=(s,d)=>{for(var c in d||(d={}))Mp.call(d,c)&&pl(s,c,d[c]);if(id)for(var c of id(d))Pp.call(d,c)&&pl(s,c,d[c]);return s},_e=(s,d)=>Lp(s,Tp(d));var Fp=(s,d)=>()=>(d||s((d={exports:{}}).exports,d),d.exports);var uo=(s,d,c)=>pl(s,typeof d!="symbol"?d+"":d,c);var ze=(s,d,c)=>new Promise((x,h)=>{var C=F=>{try{E(c.next(F))}catch(T){h(T)}},S=F=>{try{E(c.throw(F))}catch(T){h(T)}},E=F=>F.done?x(F.value):Promise.resolve(F.value).then(C,S);E((c=c.apply(s,d)).next())});var qf=Fp(ct=>{(function(){const d=document.createElement("link").relList;if(d&&d.supports&&d.supports("modulepreload"))return;for(const h of document.querySelectorAll('link[rel="modulepreload"]'))x(h);new MutationObserver(h=>{for(const C of h)if(C.type==="childList")for(const S of C.addedNodes)S.tagName==="LINK"&&S.rel==="modulepreload"&&x(S)}).observe(document,{childList:!0,subtree:!0});function c(h){const C={};return h.integrity&&(C.integrity=h.integrity),h.referrerPolicy&&(C.referrerPolicy=h.referrerPolicy),h.crossOrigin==="use-credentials"?C.credentials="include":h.crossOrigin==="anonymous"?C.credentials="omit":C.credentials="same-origin",C}function x(h){if(h.ep)return;h.ep=!0;const C=c(h);fetch(h.href,C)}})();function Ip(s){return s&&s.__esModule&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s}var fl={exports:{}},po={},ml={exports:{}},ve={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ad;function Dp(){if(ad)return ve;ad=1;var s=Symbol.for("react.element"),d=Symbol.for("react.portal"),c=Symbol.for("react.fragment"),x=Symbol.for("react.strict_mode"),h=Symbol.for("react.profiler"),C=Symbol.for("react.provider"),S=Symbol.for("react.context"),E=Symbol.for("react.forward_ref"),F=Symbol.for("react.suspense"),T=Symbol.for("react.memo"),H=Symbol.for("react.lazy"),P=Symbol.iterator;function U(m){return m===null||typeof m!="object"?null:(m=P&&m[P]||m["@@iterator"],typeof m=="function"?m:null)}var Z={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},pe=Object.assign,k={};function G(m,M,oe){this.props=m,this.context=M,this.refs=k,this.updater=oe||Z}G.prototype.isReactComponent={},G.prototype.setState=function(m,M){if(typeof m!="object"&&typeof m!="function"&&m!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,m,M,"setState")},G.prototype.forceUpdate=function(m){this.updater.enqueueForceUpdate(this,m,"forceUpdate")};function ae(){}ae.prototype=G.prototype;function le(m,M,oe){this.props=m,this.context=M,this.refs=k,this.updater=oe||Z}var ne=le.prototype=new ae;ne.constructor=le,pe(ne,G.prototype),ne.isPureReactComponent=!0;var re=Array.isArray,be=Object.prototype.hasOwnProperty,we={current:null},ge={key:!0,ref:!0,__self:!0,__source:!0};function ke(m,M,oe){var se,ye={},xe=null,Le=null;if(M!=null)for(se in M.ref!==void 0&&(Le=M.ref),M.key!==void 0&&(xe=""+M.key),M)be.call(M,se)&&!ge.hasOwnProperty(se)&&(ye[se]=M[se]);var Ce=arguments.length-2;if(Ce===1)ye.children=oe;else if(1<Ce){for(var Ne=Array(Ce),Xe=0;Xe<Ce;Xe++)Ne[Xe]=arguments[Xe+2];ye.children=Ne}if(m&&m.defaultProps)for(se in Ce=m.defaultProps,Ce)ye[se]===void 0&&(ye[se]=Ce[se]);return{$$typeof:s,type:m,key:xe,ref:Le,props:ye,_owner:we.current}}function Se(m,M){return{$$typeof:s,type:m.type,key:M,ref:m.ref,props:m.props,_owner:m._owner}}function Fe(m){return typeof m=="object"&&m!==null&&m.$$typeof===s}function Ie(m){var M={"=":"=0",":":"=2"};return"$"+m.replace(/[=:]/g,function(oe){return M[oe]})}var z=/\/+/g;function R(m,M){return typeof m=="object"&&m!==null&&m.key!=null?Ie(""+m.key):M.toString(36)}function y(m,M,oe,se,ye){var xe=typeof m;(xe==="undefined"||xe==="boolean")&&(m=null);var Le=!1;if(m===null)Le=!0;else switch(xe){case"string":case"number":Le=!0;break;case"object":switch(m.$$typeof){case s:case d:Le=!0}}if(Le)return Le=m,ye=ye(Le),m=se===""?"."+R(Le,0):se,re(ye)?(oe="",m!=null&&(oe=m.replace(z,"$&/")+"/"),y(ye,M,oe,"",function(Xe){return Xe})):ye!=null&&(Fe(ye)&&(ye=Se(ye,oe+(!ye.key||Le&&Le.key===ye.key?"":(""+ye.key).replace(z,"$&/")+"/")+m)),M.push(ye)),1;if(Le=0,se=se===""?".":se+":",re(m))for(var Ce=0;Ce<m.length;Ce++){xe=m[Ce];var Ne=se+R(xe,Ce);Le+=y(xe,M,oe,Ne,ye)}else if(Ne=U(m),typeof Ne=="function")for(m=Ne.call(m),Ce=0;!(xe=m.next()).done;)xe=xe.value,Ne=se+R(xe,Ce++),Le+=y(xe,M,oe,Ne,ye);else if(xe==="object")throw M=String(m),Error("Objects are not valid as a React child (found: "+(M==="[object Object]"?"object with keys {"+Object.keys(m).join(", ")+"}":M)+"). If you meant to render a collection of children, use an array instead.");return Le}function D(m,M,oe){if(m==null)return m;var se=[],ye=0;return y(m,se,"","",function(xe){return M.call(oe,xe,ye++)}),se}function B(m){if(m._status===-1){var M=m._result;M=M(),M.then(function(oe){(m._status===0||m._status===-1)&&(m._status=1,m._result=oe)},function(oe){(m._status===0||m._status===-1)&&(m._status=2,m._result=oe)}),m._status===-1&&(m._status=0,m._result=M)}if(m._status===1)return m._result.default;throw m._result}var N={current:null},j={transition:null},K={ReactCurrentDispatcher:N,ReactCurrentBatchConfig:j,ReactCurrentOwner:we};function V(){throw Error("act(...) is not supported in production builds of React.")}return ve.Children={map:D,forEach:function(m,M,oe){D(m,function(){M.apply(this,arguments)},oe)},count:function(m){var M=0;return D(m,function(){M++}),M},toArray:function(m){return D(m,function(M){return M})||[]},only:function(m){if(!Fe(m))throw Error("React.Children.only expected to receive a single React element child.");return m}},ve.Component=G,ve.Fragment=c,ve.Profiler=h,ve.PureComponent=le,ve.StrictMode=x,ve.Suspense=F,ve.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=K,ve.act=V,ve.cloneElement=function(m,M,oe){if(m==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+m+".");var se=pe({},m.props),ye=m.key,xe=m.ref,Le=m._owner;if(M!=null){if(M.ref!==void 0&&(xe=M.ref,Le=we.current),M.key!==void 0&&(ye=""+M.key),m.type&&m.type.defaultProps)var Ce=m.type.defaultProps;for(Ne in M)be.call(M,Ne)&&!ge.hasOwnProperty(Ne)&&(se[Ne]=M[Ne]===void 0&&Ce!==void 0?Ce[Ne]:M[Ne])}var Ne=arguments.length-2;if(Ne===1)se.children=oe;else if(1<Ne){Ce=Array(Ne);for(var Xe=0;Xe<Ne;Xe++)Ce[Xe]=arguments[Xe+2];se.children=Ce}return{$$typeof:s,type:m.type,key:ye,ref:xe,props:se,_owner:Le}},ve.createContext=function(m){return m={$$typeof:S,_currentValue:m,_currentValue2:m,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},m.Provider={$$typeof:C,_context:m},m.Consumer=m},ve.createElement=ke,ve.createFactory=function(m){var M=ke.bind(null,m);return M.type=m,M},ve.createRef=function(){return{current:null}},ve.forwardRef=function(m){return{$$typeof:E,render:m}},ve.isValidElement=Fe,ve.lazy=function(m){return{$$typeof:H,_payload:{_status:-1,_result:m},_init:B}},ve.memo=function(m,M){return{$$typeof:T,type:m,compare:M===void 0?null:M}},ve.startTransition=function(m){var M=j.transition;j.transition={};try{m()}finally{j.transition=M}},ve.unstable_act=V,ve.useCallback=function(m,M){return N.current.useCallback(m,M)},ve.useContext=function(m){return N.current.useContext(m)},ve.useDebugValue=function(){},ve.useDeferredValue=function(m){return N.current.useDeferredValue(m)},ve.useEffect=function(m,M){return N.current.useEffect(m,M)},ve.useId=function(){return N.current.useId()},ve.useImperativeHandle=function(m,M,oe){return N.current.useImperativeHandle(m,M,oe)},ve.useInsertionEffect=function(m,M){return N.current.useInsertionEffect(m,M)},ve.useLayoutEffect=function(m,M){return N.current.useLayoutEffect(m,M)},ve.useMemo=function(m,M){return N.current.useMemo(m,M)},ve.useReducer=function(m,M,oe){return N.current.useReducer(m,M,oe)},ve.useRef=function(m){return N.current.useRef(m)},ve.useState=function(m){return N.current.useState(m)},ve.useSyncExternalStore=function(m,M,oe){return N.current.useSyncExternalStore(m,M,oe)},ve.useTransition=function(){return N.current.useTransition()},ve.version="18.3.1",ve}var ld;function Nl(){return ld||(ld=1,ml.exports=Dp()),ml.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var sd;function Ap(){if(sd)return po;sd=1;var s=Nl(),d=Symbol.for("react.element"),c=Symbol.for("react.fragment"),x=Object.prototype.hasOwnProperty,h=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,C={key:!0,ref:!0,__self:!0,__source:!0};function S(E,F,T){var H,P={},U=null,Z=null;T!==void 0&&(U=""+T),F.key!==void 0&&(U=""+F.key),F.ref!==void 0&&(Z=F.ref);for(H in F)x.call(F,H)&&!C.hasOwnProperty(H)&&(P[H]=F[H]);if(E&&E.defaultProps)for(H in F=E.defaultProps,F)P[H]===void 0&&(P[H]=F[H]);return{$$typeof:d,type:E,key:U,ref:Z,props:P,_owner:h.current}}return po.Fragment=c,po.jsx=S,po.jsxs=S,po}var cd;function _p(){return cd||(cd=1,fl.exports=Ap()),fl.exports}var i=_p(),g=Nl();const Ht=Ip(g);var Ci={},gl={exports:{}},xt={},hl={exports:{}},xl={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var dd;function Rp(){return dd||(dd=1,function(s){function d(j,K){var V=j.length;j.push(K);e:for(;0<V;){var m=V-1>>>1,M=j[m];if(0<h(M,K))j[m]=K,j[V]=M,V=m;else break e}}function c(j){return j.length===0?null:j[0]}function x(j){if(j.length===0)return null;var K=j[0],V=j.pop();if(V!==K){j[0]=V;e:for(var m=0,M=j.length,oe=M>>>1;m<oe;){var se=2*(m+1)-1,ye=j[se],xe=se+1,Le=j[xe];if(0>h(ye,V))xe<M&&0>h(Le,ye)?(j[m]=Le,j[xe]=V,m=xe):(j[m]=ye,j[se]=V,m=se);else if(xe<M&&0>h(Le,V))j[m]=Le,j[xe]=V,m=xe;else break e}}return K}function h(j,K){var V=j.sortIndex-K.sortIndex;return V!==0?V:j.id-K.id}if(typeof performance=="object"&&typeof performance.now=="function"){var C=performance;s.unstable_now=function(){return C.now()}}else{var S=Date,E=S.now();s.unstable_now=function(){return S.now()-E}}var F=[],T=[],H=1,P=null,U=3,Z=!1,pe=!1,k=!1,G=typeof setTimeout=="function"?setTimeout:null,ae=typeof clearTimeout=="function"?clearTimeout:null,le=typeof setImmediate!="undefined"?setImmediate:null;typeof navigator!="undefined"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function ne(j){for(var K=c(T);K!==null;){if(K.callback===null)x(T);else if(K.startTime<=j)x(T),K.sortIndex=K.expirationTime,d(F,K);else break;K=c(T)}}function re(j){if(k=!1,ne(j),!pe)if(c(F)!==null)pe=!0,B(be);else{var K=c(T);K!==null&&N(re,K.startTime-j)}}function be(j,K){pe=!1,k&&(k=!1,ae(ke),ke=-1),Z=!0;var V=U;try{for(ne(K),P=c(F);P!==null&&(!(P.expirationTime>K)||j&&!Ie());){var m=P.callback;if(typeof m=="function"){P.callback=null,U=P.priorityLevel;var M=m(P.expirationTime<=K);K=s.unstable_now(),typeof M=="function"?P.callback=M:P===c(F)&&x(F),ne(K)}else x(F);P=c(F)}if(P!==null)var oe=!0;else{var se=c(T);se!==null&&N(re,se.startTime-K),oe=!1}return oe}finally{P=null,U=V,Z=!1}}var we=!1,ge=null,ke=-1,Se=5,Fe=-1;function Ie(){return!(s.unstable_now()-Fe<Se)}function z(){if(ge!==null){var j=s.unstable_now();Fe=j;var K=!0;try{K=ge(!0,j)}finally{K?R():(we=!1,ge=null)}}else we=!1}var R;if(typeof le=="function")R=function(){le(z)};else if(typeof MessageChannel!="undefined"){var y=new MessageChannel,D=y.port2;y.port1.onmessage=z,R=function(){D.postMessage(null)}}else R=function(){G(z,0)};function B(j){ge=j,we||(we=!0,R())}function N(j,K){ke=G(function(){j(s.unstable_now())},K)}s.unstable_IdlePriority=5,s.unstable_ImmediatePriority=1,s.unstable_LowPriority=4,s.unstable_NormalPriority=3,s.unstable_Profiling=null,s.unstable_UserBlockingPriority=2,s.unstable_cancelCallback=function(j){j.callback=null},s.unstable_continueExecution=function(){pe||Z||(pe=!0,B(be))},s.unstable_forceFrameRate=function(j){0>j||125<j?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Se=0<j?Math.floor(1e3/j):5},s.unstable_getCurrentPriorityLevel=function(){return U},s.unstable_getFirstCallbackNode=function(){return c(F)},s.unstable_next=function(j){switch(U){case 1:case 2:case 3:var K=3;break;default:K=U}var V=U;U=K;try{return j()}finally{U=V}},s.unstable_pauseExecution=function(){},s.unstable_requestPaint=function(){},s.unstable_runWithPriority=function(j,K){switch(j){case 1:case 2:case 3:case 4:case 5:break;default:j=3}var V=U;U=j;try{return K()}finally{U=V}},s.unstable_scheduleCallback=function(j,K,V){var m=s.unstable_now();switch(typeof V=="object"&&V!==null?(V=V.delay,V=typeof V=="number"&&0<V?m+V:m):V=m,j){case 1:var M=-1;break;case 2:M=250;break;case 5:M=1073741823;break;case 4:M=1e4;break;default:M=5e3}return M=V+M,j={id:H++,callback:K,priorityLevel:j,startTime:V,expirationTime:M,sortIndex:-1},V>m?(j.sortIndex=V,d(T,j),c(F)===null&&j===c(T)&&(k?(ae(ke),ke=-1):k=!0,N(re,V-m))):(j.sortIndex=M,d(F,j),pe||Z||(pe=!0,B(be))),j},s.unstable_shouldYield=Ie,s.unstable_wrapCallback=function(j){var K=U;return function(){var V=U;U=K;try{return j.apply(this,arguments)}finally{U=V}}}}(xl)),xl}var ud;function Op(){return ud||(ud=1,hl.exports=Rp()),hl.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var pd;function $p(){if(pd)return xt;pd=1;var s=Nl(),d=Op();function c(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var x=new Set,h={};function C(e,t){S(e,t),S(e+"Capture",t)}function S(e,t){for(h[e]=t,e=0;e<t.length;e++)x.add(t[e])}var E=!(typeof window=="undefined"||typeof window.document=="undefined"||typeof window.document.createElement=="undefined"),F=Object.prototype.hasOwnProperty,T=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,H={},P={};function U(e){return F.call(P,e)?!0:F.call(H,e)?!1:T.test(e)?P[e]=!0:(H[e]=!0,!1)}function Z(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function pe(e,t,n,r){if(t===null||typeof t=="undefined"||Z(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function k(e,t,n,r,o,a,l){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=o,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=a,this.removeEmptyString=l}var G={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){G[e]=new k(e,0,!1,e,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];G[t]=new k(t,1,!1,e[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){G[e]=new k(e,2,!1,e.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){G[e]=new k(e,2,!1,e,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){G[e]=new k(e,3,!1,e.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(e){G[e]=new k(e,3,!0,e,null,!1,!1)}),["capture","download"].forEach(function(e){G[e]=new k(e,4,!1,e,null,!1,!1)}),["cols","rows","size","span"].forEach(function(e){G[e]=new k(e,6,!1,e,null,!1,!1)}),["rowSpan","start"].forEach(function(e){G[e]=new k(e,5,!1,e.toLowerCase(),null,!1,!1)});var ae=/[\-:]([a-z])/g;function le(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(ae,le);G[t]=new k(t,1,!1,e,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(ae,le);G[t]=new k(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(ae,le);G[t]=new k(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(e){G[e]=new k(e,1,!1,e.toLowerCase(),null,!1,!1)}),G.xlinkHref=new k("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(e){G[e]=new k(e,1,!1,e.toLowerCase(),null,!0,!0)});function ne(e,t,n,r){var o=G.hasOwnProperty(t)?G[t]:null;(o!==null?o.type!==0:r||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(pe(t,n,o,r)&&(n=null),r||o===null?U(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):o.mustUseProperty?e[o.propertyName]=n===null?o.type===3?!1:"":n:(t=o.attributeName,r=o.attributeNamespace,n===null?e.removeAttribute(t):(o=o.type,n=o===3||o===4&&n===!0?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var re=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,be=Symbol.for("react.element"),we=Symbol.for("react.portal"),ge=Symbol.for("react.fragment"),ke=Symbol.for("react.strict_mode"),Se=Symbol.for("react.profiler"),Fe=Symbol.for("react.provider"),Ie=Symbol.for("react.context"),z=Symbol.for("react.forward_ref"),R=Symbol.for("react.suspense"),y=Symbol.for("react.suspense_list"),D=Symbol.for("react.memo"),B=Symbol.for("react.lazy"),N=Symbol.for("react.offscreen"),j=Symbol.iterator;function K(e){return e===null||typeof e!="object"?null:(e=j&&e[j]||e["@@iterator"],typeof e=="function"?e:null)}var V=Object.assign,m;function M(e){if(m===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);m=t&&t[1]||""}return`
`+m+e}var oe=!1;function se(e,t){if(!e||oe)return"";oe=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(w){var r=w}Reflect.construct(e,[],t)}else{try{t.call()}catch(w){r=w}e.call(t.prototype)}else{try{throw Error()}catch(w){r=w}e()}}catch(w){if(w&&r&&typeof w.stack=="string"){for(var o=w.stack.split(`
`),a=r.stack.split(`
`),l=o.length-1,u=a.length-1;1<=l&&0<=u&&o[l]!==a[u];)u--;for(;1<=l&&0<=u;l--,u--)if(o[l]!==a[u]){if(l!==1||u!==1)do if(l--,u--,0>u||o[l]!==a[u]){var p=`
`+o[l].replace(" at new "," at ");return e.displayName&&p.includes("<anonymous>")&&(p=p.replace("<anonymous>",e.displayName)),p}while(1<=l&&0<=u);break}}}finally{oe=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?M(e):""}function ye(e){switch(e.tag){case 5:return M(e.type);case 16:return M("Lazy");case 13:return M("Suspense");case 19:return M("SuspenseList");case 0:case 2:case 15:return e=se(e.type,!1),e;case 11:return e=se(e.type.render,!1),e;case 1:return e=se(e.type,!0),e;default:return""}}function xe(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case ge:return"Fragment";case we:return"Portal";case Se:return"Profiler";case ke:return"StrictMode";case R:return"Suspense";case y:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case Ie:return(e.displayName||"Context")+".Consumer";case Fe:return(e._context.displayName||"Context")+".Provider";case z:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case D:return t=e.displayName||null,t!==null?t:xe(e.type)||"Memo";case B:t=e._payload,e=e._init;try{return xe(e(t))}catch(n){}}return null}function Le(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return xe(t);case 8:return t===ke?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function Ce(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Ne(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Xe(e){var t=Ne(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&typeof n!="undefined"&&typeof n.get=="function"&&typeof n.set=="function"){var o=n.get,a=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return o.call(this)},set:function(l){r=""+l,a.call(this,l)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(l){r=""+l},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function yt(e){e._valueTracker||(e._valueTracker=Xe(e))}function En(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=Ne(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function nn(e){if(e=e||(typeof document!="undefined"?document:void 0),typeof e=="undefined")return null;try{return e.activeElement||e.body}catch(t){return e.body}}function zn(e,t){var n=t.checked;return V({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n!=null?n:e._wrapperState.initialChecked})}function Xn(e,t){var n=t.defaultValue==null?"":t.defaultValue,r=t.checked!=null?t.checked:t.defaultChecked;n=Ce(t.value!=null?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function Ln(e,t){t=t.checked,t!=null&&ne(e,"checked",t,!1)}function Tn(e,t){Ln(e,t);var n=Ce(t.value),r=t.type;if(n!=null)r==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?Pn(e,t.type,n):t.hasOwnProperty("defaultValue")&&Pn(e,t.type,Ce(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Mn(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!(r!=="submit"&&r!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function Pn(e,t,n){(t!=="number"||nn(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var Lt=Array.isArray;function he(e,t,n,r){if(e=e.options,t){t={};for(var o=0;o<n.length;o++)t["$"+n[o]]=!0;for(n=0;n<e.length;n++)o=t.hasOwnProperty("$"+e[n].value),e[n].selected!==o&&(e[n].selected=o),o&&r&&(e[n].defaultSelected=!0)}else{for(n=""+Ce(n),t=null,o=0;o<e.length;o++){if(e[o].value===n){e[o].selected=!0,r&&(e[o].defaultSelected=!0);return}t!==null||e[o].disabled||(t=e[o])}t!==null&&(t.selected=!0)}}function Fn(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(c(91));return V({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function rn(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(c(92));if(Lt(n)){if(1<n.length)throw Error(c(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:Ce(n)}}function Jn(e,t){var n=Ce(t.value),r=Ce(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=""+r)}function er(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function tr(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function In(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?tr(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var W,Q=function(e){return typeof MSApp!="undefined"&&MSApp.execUnsafeLocalFunction?function(t,n,r,o){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,o)})}:e}(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(W=W||document.createElement("div"),W.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=W.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function X(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var _={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Ge=["Webkit","ms","Moz","O"];Object.keys(_).forEach(function(e){Ge.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),_[t]=_[e]})});function nt(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||_.hasOwnProperty(e)&&_[e]?(""+t).trim():t+"px"}function Ae(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=n.indexOf("--")===0,o=nt(n,t[n],r);n==="float"&&(n="cssFloat"),r?e.setProperty(n,o):e[n]=o}}var Dn=V({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Vt(e,t){if(t){if(Dn[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(c(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(c(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(c(61))}if(t.style!=null&&typeof t.style!="object")throw Error(c(62))}}function jr(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Nr=null;function Er(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var on=null,an=null,Wt=null;function L(e){if(e=Kr(e)){if(typeof on!="function")throw Error(c(280));var t=e.stateNode;t&&(t=Oo(t),on(e.stateNode,e.type,t))}}function ce(e){an?Wt?Wt.push(e):Wt=[e]:an=e}function ie(){if(an){var e=an,t=Wt;if(Wt=an=null,L(e),t)for(e=0;e<t.length;e++)L(t[e])}}function fe(e,t){return e(t)}function Be(){}var Pe=!1;function zr(e,t,n){if(Pe)return e(t,n);Pe=!0;try{return fe(e,t,n)}finally{Pe=!1,(an!==null||Wt!==null)&&(Be(),ie())}}function ln(e,t){var n=e.stateNode;if(n===null)return null;var r=Oo(n);if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(c(231,t,typeof n));return n}var Ti=!1;if(E)try{var Lr={};Object.defineProperty(Lr,"passive",{get:function(){Ti=!0}}),window.addEventListener("test",Lr,Lr),window.removeEventListener("test",Lr,Lr)}catch(e){Ti=!1}function Id(e,t,n,r,o,a,l,u,p){var w=Array.prototype.slice.call(arguments,3);try{t.apply(n,w)}catch(A){this.onError(A)}}var Tr=!1,xo=null,yo=!1,Mi=null,Dd={onError:function(e){Tr=!0,xo=e}};function Ad(e,t,n,r,o,a,l,u,p){Tr=!1,xo=null,Id.apply(Dd,arguments)}function _d(e,t,n,r,o,a,l,u,p){if(Ad.apply(this,arguments),Tr){if(Tr){var w=xo;Tr=!1,xo=null}else throw Error(c(198));yo||(yo=!0,Mi=w)}}function An(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function zl(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Ll(e){if(An(e)!==e)throw Error(c(188))}function Rd(e){var t=e.alternate;if(!t){if(t=An(e),t===null)throw Error(c(188));return t!==e?null:e}for(var n=e,r=t;;){var o=n.return;if(o===null)break;var a=o.alternate;if(a===null){if(r=o.return,r!==null){n=r;continue}break}if(o.child===a.child){for(a=o.child;a;){if(a===n)return Ll(o),e;if(a===r)return Ll(o),t;a=a.sibling}throw Error(c(188))}if(n.return!==r.return)n=o,r=a;else{for(var l=!1,u=o.child;u;){if(u===n){l=!0,n=o,r=a;break}if(u===r){l=!0,r=o,n=a;break}u=u.sibling}if(!l){for(u=a.child;u;){if(u===n){l=!0,n=a,r=o;break}if(u===r){l=!0,r=a,n=o;break}u=u.sibling}if(!l)throw Error(c(189))}}if(n.alternate!==r)throw Error(c(190))}if(n.tag!==3)throw Error(c(188));return n.stateNode.current===n?e:t}function Tl(e){return e=Rd(e),e!==null?Ml(e):null}function Ml(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=Ml(e);if(t!==null)return t;e=e.sibling}return null}var Pl=d.unstable_scheduleCallback,Fl=d.unstable_cancelCallback,Od=d.unstable_shouldYield,$d=d.unstable_requestPaint,Qe=d.unstable_now,Ud=d.unstable_getCurrentPriorityLevel,Pi=d.unstable_ImmediatePriority,Il=d.unstable_UserBlockingPriority,vo=d.unstable_NormalPriority,Bd=d.unstable_LowPriority,Dl=d.unstable_IdlePriority,bo=null,_t=null;function Hd(e){if(_t&&typeof _t.onCommitFiberRoot=="function")try{_t.onCommitFiberRoot(bo,e,void 0,(e.current.flags&128)===128)}catch(t){}}var Tt=Math.clz32?Math.clz32:Gd,Vd=Math.log,Wd=Math.LN2;function Gd(e){return e>>>=0,e===0?32:31-(Vd(e)/Wd|0)|0}var wo=64,ko=4194304;function Mr(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function So(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,o=e.suspendedLanes,a=e.pingedLanes,l=n&268435455;if(l!==0){var u=l&~o;u!==0?r=Mr(u):(a&=l,a!==0&&(r=Mr(a)))}else l=n&~o,l!==0?r=Mr(l):a!==0&&(r=Mr(a));if(r===0)return 0;if(t!==0&&t!==r&&(t&o)===0&&(o=r&-r,a=t&-t,o>=a||o===16&&(a&4194240)!==0))return t;if((r&4)!==0&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-Tt(t),o=1<<n,r|=e[n],t&=~o;return r}function Qd(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Yd(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,o=e.expirationTimes,a=e.pendingLanes;0<a;){var l=31-Tt(a),u=1<<l,p=o[l];p===-1?((u&n)===0||(u&r)!==0)&&(o[l]=Qd(u,t)):p<=t&&(e.expiredLanes|=u),a&=~u}}function Fi(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function Al(){var e=wo;return wo<<=1,(wo&4194240)===0&&(wo=64),e}function Ii(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Pr(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-Tt(t),e[t]=n}function Kd(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var o=31-Tt(n),a=1<<o;t[o]=0,r[o]=-1,e[o]=-1,n&=~a}}function Di(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-Tt(n),o=1<<r;o&t|e[r]&t&&(e[r]|=t),n&=~o}}var De=0;function _l(e){return e&=-e,1<e?4<e?(e&268435455)!==0?16:536870912:4:1}var Rl,Ai,Ol,$l,Ul,_i=!1,Co=[],sn=null,cn=null,dn=null,Fr=new Map,Ir=new Map,un=[],qd="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Bl(e,t){switch(e){case"focusin":case"focusout":sn=null;break;case"dragenter":case"dragleave":cn=null;break;case"mouseover":case"mouseout":dn=null;break;case"pointerover":case"pointerout":Fr.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Ir.delete(t.pointerId)}}function Dr(e,t,n,r,o,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:a,targetContainers:[o]},t!==null&&(t=Kr(t),t!==null&&Ai(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,o!==null&&t.indexOf(o)===-1&&t.push(o),e)}function Zd(e,t,n,r,o){switch(t){case"focusin":return sn=Dr(sn,e,t,n,r,o),!0;case"dragenter":return cn=Dr(cn,e,t,n,r,o),!0;case"mouseover":return dn=Dr(dn,e,t,n,r,o),!0;case"pointerover":var a=o.pointerId;return Fr.set(a,Dr(Fr.get(a)||null,e,t,n,r,o)),!0;case"gotpointercapture":return a=o.pointerId,Ir.set(a,Dr(Ir.get(a)||null,e,t,n,r,o)),!0}return!1}function Hl(e){var t=_n(e.target);if(t!==null){var n=An(t);if(n!==null){if(t=n.tag,t===13){if(t=zl(n),t!==null){e.blockedOn=t,Ul(e.priority,function(){Ol(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function jo(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Oi(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);Nr=r,n.target.dispatchEvent(r),Nr=null}else return t=Kr(n),t!==null&&Ai(t),e.blockedOn=n,!1;t.shift()}return!0}function Vl(e,t,n){jo(e)&&n.delete(t)}function Xd(){_i=!1,sn!==null&&jo(sn)&&(sn=null),cn!==null&&jo(cn)&&(cn=null),dn!==null&&jo(dn)&&(dn=null),Fr.forEach(Vl),Ir.forEach(Vl)}function Ar(e,t){e.blockedOn===t&&(e.blockedOn=null,_i||(_i=!0,d.unstable_scheduleCallback(d.unstable_NormalPriority,Xd)))}function _r(e){function t(o){return Ar(o,e)}if(0<Co.length){Ar(Co[0],e);for(var n=1;n<Co.length;n++){var r=Co[n];r.blockedOn===e&&(r.blockedOn=null)}}for(sn!==null&&Ar(sn,e),cn!==null&&Ar(cn,e),dn!==null&&Ar(dn,e),Fr.forEach(t),Ir.forEach(t),n=0;n<un.length;n++)r=un[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<un.length&&(n=un[0],n.blockedOn===null);)Hl(n),n.blockedOn===null&&un.shift()}var nr=re.ReactCurrentBatchConfig,No=!0;function Jd(e,t,n,r){var o=De,a=nr.transition;nr.transition=null;try{De=1,Ri(e,t,n,r)}finally{De=o,nr.transition=a}}function eu(e,t,n,r){var o=De,a=nr.transition;nr.transition=null;try{De=4,Ri(e,t,n,r)}finally{De=o,nr.transition=a}}function Ri(e,t,n,r){if(No){var o=Oi(e,t,n,r);if(o===null)na(e,t,r,Eo,n),Bl(e,r);else if(Zd(o,e,t,n,r))r.stopPropagation();else if(Bl(e,r),t&4&&-1<qd.indexOf(e)){for(;o!==null;){var a=Kr(o);if(a!==null&&Rl(a),a=Oi(e,t,n,r),a===null&&na(e,t,r,Eo,n),a===o)break;o=a}o!==null&&r.stopPropagation()}else na(e,t,r,null,n)}}var Eo=null;function Oi(e,t,n,r){if(Eo=null,e=Er(r),e=_n(e),e!==null)if(t=An(e),t===null)e=null;else if(n=t.tag,n===13){if(e=zl(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return Eo=e,null}function Wl(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Ud()){case Pi:return 1;case Il:return 4;case vo:case Bd:return 16;case Dl:return 536870912;default:return 16}default:return 16}}var pn=null,$i=null,zo=null;function Gl(){if(zo)return zo;var e,t=$i,n=t.length,r,o="value"in pn?pn.value:pn.textContent,a=o.length;for(e=0;e<n&&t[e]===o[e];e++);var l=n-e;for(r=1;r<=l&&t[n-r]===o[a-r];r++);return zo=o.slice(e,1<r?1-r:void 0)}function Lo(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function To(){return!0}function Ql(){return!1}function vt(e){function t(n,r,o,a,l){this._reactName=n,this._targetInst=o,this.type=r,this.nativeEvent=a,this.target=l,this.currentTarget=null;for(var u in e)e.hasOwnProperty(u)&&(n=e[u],this[u]=n?n(a):a[u]);return this.isDefaultPrevented=(a.defaultPrevented!=null?a.defaultPrevented:a.returnValue===!1)?To:Ql,this.isPropagationStopped=Ql,this}return V(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=To)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=To)},persist:function(){},isPersistent:To}),t}var rr={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Ui=vt(rr),Rr=V({},rr,{view:0,detail:0}),tu=vt(Rr),Bi,Hi,Or,Mo=V({},Rr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Wi,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Or&&(Or&&e.type==="mousemove"?(Bi=e.screenX-Or.screenX,Hi=e.screenY-Or.screenY):Hi=Bi=0,Or=e),Bi)},movementY:function(e){return"movementY"in e?e.movementY:Hi}}),Yl=vt(Mo),nu=V({},Mo,{dataTransfer:0}),ru=vt(nu),ou=V({},Rr,{relatedTarget:0}),Vi=vt(ou),iu=V({},rr,{animationName:0,elapsedTime:0,pseudoElement:0}),au=vt(iu),lu=V({},rr,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),su=vt(lu),cu=V({},rr,{data:0}),Kl=vt(cu),du={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},uu={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},pu={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function fu(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=pu[e])?!!t[e]:!1}function Wi(){return fu}var mu=V({},Rr,{key:function(e){if(e.key){var t=du[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Lo(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?uu[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Wi,charCode:function(e){return e.type==="keypress"?Lo(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Lo(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),gu=vt(mu),hu=V({},Mo,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),ql=vt(hu),xu=V({},Rr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Wi}),yu=vt(xu),vu=V({},rr,{propertyName:0,elapsedTime:0,pseudoElement:0}),bu=vt(vu),wu=V({},Mo,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),ku=vt(wu),Su=[9,13,27,32],Gi=E&&"CompositionEvent"in window,$r=null;E&&"documentMode"in document&&($r=document.documentMode);var Cu=E&&"TextEvent"in window&&!$r,Zl=E&&(!Gi||$r&&8<$r&&11>=$r),Xl=" ",Jl=!1;function es(e,t){switch(e){case"keyup":return Su.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function ts(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var or=!1;function ju(e,t){switch(e){case"compositionend":return ts(t);case"keypress":return t.which!==32?null:(Jl=!0,Xl);case"textInput":return e=t.data,e===Xl&&Jl?null:e;default:return null}}function Nu(e,t){if(or)return e==="compositionend"||!Gi&&es(e,t)?(e=Gl(),zo=$i=pn=null,or=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Zl&&t.locale!=="ko"?null:t.data;default:return null}}var Eu={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function ns(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Eu[e.type]:t==="textarea"}function rs(e,t,n,r){ce(r),t=Ao(t,"onChange"),0<t.length&&(n=new Ui("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var Ur=null,Br=null;function zu(e){ws(e,0)}function Po(e){var t=cr(e);if(En(t))return e}function Lu(e,t){if(e==="change")return t}var os=!1;if(E){var Qi;if(E){var Yi="oninput"in document;if(!Yi){var is=document.createElement("div");is.setAttribute("oninput","return;"),Yi=typeof is.oninput=="function"}Qi=Yi}else Qi=!1;os=Qi&&(!document.documentMode||9<document.documentMode)}function as(){Ur&&(Ur.detachEvent("onpropertychange",ls),Br=Ur=null)}function ls(e){if(e.propertyName==="value"&&Po(Br)){var t=[];rs(t,Br,e,Er(e)),zr(zu,t)}}function Tu(e,t,n){e==="focusin"?(as(),Ur=t,Br=n,Ur.attachEvent("onpropertychange",ls)):e==="focusout"&&as()}function Mu(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Po(Br)}function Pu(e,t){if(e==="click")return Po(t)}function Fu(e,t){if(e==="input"||e==="change")return Po(t)}function Iu(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Mt=typeof Object.is=="function"?Object.is:Iu;function Hr(e,t){if(Mt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var o=n[r];if(!F.call(t,o)||!Mt(e[o],t[o]))return!1}return!0}function ss(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function cs(e,t){var n=ss(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=ss(n)}}function ds(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?ds(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function us(){for(var e=window,t=nn();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch(r){n=!1}if(n)e=t.contentWindow;else break;t=nn(e.document)}return t}function Ki(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function Du(e){var t=us(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&ds(n.ownerDocument.documentElement,n)){if(r!==null&&Ki(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var o=n.textContent.length,a=Math.min(r.start,o);r=r.end===void 0?a:Math.min(r.end,o),!e.extend&&a>r&&(o=r,r=a,a=o),o=cs(n,a);var l=cs(n,r);o&&l&&(e.rangeCount!==1||e.anchorNode!==o.node||e.anchorOffset!==o.offset||e.focusNode!==l.node||e.focusOffset!==l.offset)&&(t=t.createRange(),t.setStart(o.node,o.offset),e.removeAllRanges(),a>r?(e.addRange(t),e.extend(l.node,l.offset)):(t.setEnd(l.node,l.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var Au=E&&"documentMode"in document&&11>=document.documentMode,ir=null,qi=null,Vr=null,Zi=!1;function ps(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Zi||ir==null||ir!==nn(r)||(r=ir,"selectionStart"in r&&Ki(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Vr&&Hr(Vr,r)||(Vr=r,r=Ao(qi,"onSelect"),0<r.length&&(t=new Ui("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=ir)))}function Fo(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var ar={animationend:Fo("Animation","AnimationEnd"),animationiteration:Fo("Animation","AnimationIteration"),animationstart:Fo("Animation","AnimationStart"),transitionend:Fo("Transition","TransitionEnd")},Xi={},fs={};E&&(fs=document.createElement("div").style,"AnimationEvent"in window||(delete ar.animationend.animation,delete ar.animationiteration.animation,delete ar.animationstart.animation),"TransitionEvent"in window||delete ar.transitionend.transition);function Io(e){if(Xi[e])return Xi[e];if(!ar[e])return e;var t=ar[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in fs)return Xi[e]=t[n];return e}var ms=Io("animationend"),gs=Io("animationiteration"),hs=Io("animationstart"),xs=Io("transitionend"),ys=new Map,vs="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function fn(e,t){ys.set(e,t),C(t,[e])}for(var Ji=0;Ji<vs.length;Ji++){var ea=vs[Ji],_u=ea.toLowerCase(),Ru=ea[0].toUpperCase()+ea.slice(1);fn(_u,"on"+Ru)}fn(ms,"onAnimationEnd"),fn(gs,"onAnimationIteration"),fn(hs,"onAnimationStart"),fn("dblclick","onDoubleClick"),fn("focusin","onFocus"),fn("focusout","onBlur"),fn(xs,"onTransitionEnd"),S("onMouseEnter",["mouseout","mouseover"]),S("onMouseLeave",["mouseout","mouseover"]),S("onPointerEnter",["pointerout","pointerover"]),S("onPointerLeave",["pointerout","pointerover"]),C("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),C("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),C("onBeforeInput",["compositionend","keypress","textInput","paste"]),C("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),C("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),C("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Wr="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Ou=new Set("cancel close invalid load scroll toggle".split(" ").concat(Wr));function bs(e,t,n){var r=e.type||"unknown-event";e.currentTarget=n,_d(r,t,void 0,e),e.currentTarget=null}function ws(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],o=r.event;r=r.listeners;e:{var a=void 0;if(t)for(var l=r.length-1;0<=l;l--){var u=r[l],p=u.instance,w=u.currentTarget;if(u=u.listener,p!==a&&o.isPropagationStopped())break e;bs(o,u,w),a=p}else for(l=0;l<r.length;l++){if(u=r[l],p=u.instance,w=u.currentTarget,u=u.listener,p!==a&&o.isPropagationStopped())break e;bs(o,u,w),a=p}}}if(yo)throw e=Mi,yo=!1,Mi=null,e}function Oe(e,t){var n=t[sa];n===void 0&&(n=t[sa]=new Set);var r=e+"__bubble";n.has(r)||(ks(t,e,2,!1),n.add(r))}function ta(e,t,n){var r=0;t&&(r|=4),ks(n,e,r,t)}var Do="_reactListening"+Math.random().toString(36).slice(2);function Gr(e){if(!e[Do]){e[Do]=!0,x.forEach(function(n){n!=="selectionchange"&&(Ou.has(n)||ta(n,!1,e),ta(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Do]||(t[Do]=!0,ta("selectionchange",!1,t))}}function ks(e,t,n,r){switch(Wl(t)){case 1:var o=Jd;break;case 4:o=eu;break;default:o=Ri}n=o.bind(null,t,n,e),o=void 0,!Ti||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(o=!0),r?o!==void 0?e.addEventListener(t,n,{capture:!0,passive:o}):e.addEventListener(t,n,!0):o!==void 0?e.addEventListener(t,n,{passive:o}):e.addEventListener(t,n,!1)}function na(e,t,n,r,o){var a=r;if((t&1)===0&&(t&2)===0&&r!==null)e:for(;;){if(r===null)return;var l=r.tag;if(l===3||l===4){var u=r.stateNode.containerInfo;if(u===o||u.nodeType===8&&u.parentNode===o)break;if(l===4)for(l=r.return;l!==null;){var p=l.tag;if((p===3||p===4)&&(p=l.stateNode.containerInfo,p===o||p.nodeType===8&&p.parentNode===o))return;l=l.return}for(;u!==null;){if(l=_n(u),l===null)return;if(p=l.tag,p===5||p===6){r=a=l;continue e}u=u.parentNode}}r=r.return}zr(function(){var w=a,A=Er(n),O=[];e:{var I=ys.get(e);if(I!==void 0){var Y=Ui,J=e;switch(e){case"keypress":if(Lo(n)===0)break e;case"keydown":case"keyup":Y=gu;break;case"focusin":J="focus",Y=Vi;break;case"focusout":J="blur",Y=Vi;break;case"beforeblur":case"afterblur":Y=Vi;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":Y=Yl;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":Y=ru;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":Y=yu;break;case ms:case gs:case hs:Y=au;break;case xs:Y=bu;break;case"scroll":Y=tu;break;case"wheel":Y=ku;break;case"copy":case"cut":case"paste":Y=su;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":Y=ql}var ee=(t&4)!==0,Ye=!ee&&e==="scroll",v=ee?I!==null?I+"Capture":null:I;ee=[];for(var f=w,b;f!==null;){b=f;var $=b.stateNode;if(b.tag===5&&$!==null&&(b=$,v!==null&&($=ln(f,v),$!=null&&ee.push(Qr(f,$,b)))),Ye)break;f=f.return}0<ee.length&&(I=new Y(I,J,null,n,A),O.push({event:I,listeners:ee}))}}if((t&7)===0){e:{if(I=e==="mouseover"||e==="pointerover",Y=e==="mouseout"||e==="pointerout",I&&n!==Nr&&(J=n.relatedTarget||n.fromElement)&&(_n(J)||J[Gt]))break e;if((Y||I)&&(I=A.window===A?A:(I=A.ownerDocument)?I.defaultView||I.parentWindow:window,Y?(J=n.relatedTarget||n.toElement,Y=w,J=J?_n(J):null,J!==null&&(Ye=An(J),J!==Ye||J.tag!==5&&J.tag!==6)&&(J=null)):(Y=null,J=w),Y!==J)){if(ee=Yl,$="onMouseLeave",v="onMouseEnter",f="mouse",(e==="pointerout"||e==="pointerover")&&(ee=ql,$="onPointerLeave",v="onPointerEnter",f="pointer"),Ye=Y==null?I:cr(Y),b=J==null?I:cr(J),I=new ee($,f+"leave",Y,n,A),I.target=Ye,I.relatedTarget=b,$=null,_n(A)===w&&(ee=new ee(v,f+"enter",J,n,A),ee.target=b,ee.relatedTarget=Ye,$=ee),Ye=$,Y&&J)t:{for(ee=Y,v=J,f=0,b=ee;b;b=lr(b))f++;for(b=0,$=v;$;$=lr($))b++;for(;0<f-b;)ee=lr(ee),f--;for(;0<b-f;)v=lr(v),b--;for(;f--;){if(ee===v||v!==null&&ee===v.alternate)break t;ee=lr(ee),v=lr(v)}ee=null}else ee=null;Y!==null&&Ss(O,I,Y,ee,!1),J!==null&&Ye!==null&&Ss(O,Ye,J,ee,!0)}}e:{if(I=w?cr(w):window,Y=I.nodeName&&I.nodeName.toLowerCase(),Y==="select"||Y==="input"&&I.type==="file")var te=Lu;else if(ns(I))if(os)te=Fu;else{te=Mu;var de=Tu}else(Y=I.nodeName)&&Y.toLowerCase()==="input"&&(I.type==="checkbox"||I.type==="radio")&&(te=Pu);if(te&&(te=te(e,w))){rs(O,te,n,A);break e}de&&de(e,I,w),e==="focusout"&&(de=I._wrapperState)&&de.controlled&&I.type==="number"&&Pn(I,"number",I.value)}switch(de=w?cr(w):window,e){case"focusin":(ns(de)||de.contentEditable==="true")&&(ir=de,qi=w,Vr=null);break;case"focusout":Vr=qi=ir=null;break;case"mousedown":Zi=!0;break;case"contextmenu":case"mouseup":case"dragend":Zi=!1,ps(O,n,A);break;case"selectionchange":if(Au)break;case"keydown":case"keyup":ps(O,n,A)}var ue;if(Gi)e:{switch(e){case"compositionstart":var me="onCompositionStart";break e;case"compositionend":me="onCompositionEnd";break e;case"compositionupdate":me="onCompositionUpdate";break e}me=void 0}else or?es(e,n)&&(me="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(me="onCompositionStart");me&&(Zl&&n.locale!=="ko"&&(or||me!=="onCompositionStart"?me==="onCompositionEnd"&&or&&(ue=Gl()):(pn=A,$i="value"in pn?pn.value:pn.textContent,or=!0)),de=Ao(w,me),0<de.length&&(me=new Kl(me,e,null,n,A),O.push({event:me,listeners:de}),ue?me.data=ue:(ue=ts(n),ue!==null&&(me.data=ue)))),(ue=Cu?ju(e,n):Nu(e,n))&&(w=Ao(w,"onBeforeInput"),0<w.length&&(A=new Kl("onBeforeInput","beforeinput",null,n,A),O.push({event:A,listeners:w}),A.data=ue))}ws(O,t)})}function Qr(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Ao(e,t){for(var n=t+"Capture",r=[];e!==null;){var o=e,a=o.stateNode;o.tag===5&&a!==null&&(o=a,a=ln(e,n),a!=null&&r.unshift(Qr(e,a,o)),a=ln(e,t),a!=null&&r.push(Qr(e,a,o))),e=e.return}return r}function lr(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function Ss(e,t,n,r,o){for(var a=t._reactName,l=[];n!==null&&n!==r;){var u=n,p=u.alternate,w=u.stateNode;if(p!==null&&p===r)break;u.tag===5&&w!==null&&(u=w,o?(p=ln(n,a),p!=null&&l.unshift(Qr(n,p,u))):o||(p=ln(n,a),p!=null&&l.push(Qr(n,p,u)))),n=n.return}l.length!==0&&e.push({event:t,listeners:l})}var $u=/\r\n?/g,Uu=/\u0000|\uFFFD/g;function Cs(e){return(typeof e=="string"?e:""+e).replace($u,`
`).replace(Uu,"")}function _o(e,t,n){if(t=Cs(t),Cs(e)!==t&&n)throw Error(c(425))}function Ro(){}var ra=null,oa=null;function ia(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var aa=typeof setTimeout=="function"?setTimeout:void 0,Bu=typeof clearTimeout=="function"?clearTimeout:void 0,js=typeof Promise=="function"?Promise:void 0,Hu=typeof queueMicrotask=="function"?queueMicrotask:typeof js!="undefined"?function(e){return js.resolve(null).then(e).catch(Vu)}:aa;function Vu(e){setTimeout(function(){throw e})}function la(e,t){var n=t,r=0;do{var o=n.nextSibling;if(e.removeChild(n),o&&o.nodeType===8)if(n=o.data,n==="/$"){if(r===0){e.removeChild(o),_r(t);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=o}while(n);_r(t)}function mn(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function Ns(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var sr=Math.random().toString(36).slice(2),Rt="__reactFiber$"+sr,Yr="__reactProps$"+sr,Gt="__reactContainer$"+sr,sa="__reactEvents$"+sr,Wu="__reactListeners$"+sr,Gu="__reactHandles$"+sr;function _n(e){var t=e[Rt];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Gt]||n[Rt]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=Ns(e);e!==null;){if(n=e[Rt])return n;e=Ns(e)}return t}e=n,n=e.parentNode}return null}function Kr(e){return e=e[Rt]||e[Gt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function cr(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(c(33))}function Oo(e){return e[Yr]||null}var ca=[],dr=-1;function gn(e){return{current:e}}function $e(e){0>dr||(e.current=ca[dr],ca[dr]=null,dr--)}function Re(e,t){dr++,ca[dr]=e.current,e.current=t}var hn={},it=gn(hn),pt=gn(!1),Rn=hn;function ur(e,t){var n=e.type.contextTypes;if(!n)return hn;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var o={},a;for(a in n)o[a]=t[a];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=o),o}function ft(e){return e=e.childContextTypes,e!=null}function $o(){$e(pt),$e(it)}function Es(e,t,n){if(it.current!==hn)throw Error(c(168));Re(it,t),Re(pt,n)}function zs(e,t,n){var r=e.stateNode;if(t=t.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var o in r)if(!(o in t))throw Error(c(108,Le(e)||"Unknown",o));return V({},n,r)}function Uo(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||hn,Rn=it.current,Re(it,e),Re(pt,pt.current),!0}function Ls(e,t,n){var r=e.stateNode;if(!r)throw Error(c(169));n?(e=zs(e,t,Rn),r.__reactInternalMemoizedMergedChildContext=e,$e(pt),$e(it),Re(it,e)):$e(pt),Re(pt,n)}var Qt=null,Bo=!1,da=!1;function Ts(e){Qt===null?Qt=[e]:Qt.push(e)}function Qu(e){Bo=!0,Ts(e)}function xn(){if(!da&&Qt!==null){da=!0;var e=0,t=De;try{var n=Qt;for(De=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}Qt=null,Bo=!1}catch(o){throw Qt!==null&&(Qt=Qt.slice(e+1)),Pl(Pi,xn),o}finally{De=t,da=!1}}return null}var pr=[],fr=0,Ho=null,Vo=0,St=[],Ct=0,On=null,Yt=1,Kt="";function $n(e,t){pr[fr++]=Vo,pr[fr++]=Ho,Ho=e,Vo=t}function Ms(e,t,n){St[Ct++]=Yt,St[Ct++]=Kt,St[Ct++]=On,On=e;var r=Yt;e=Kt;var o=32-Tt(r)-1;r&=~(1<<o),n+=1;var a=32-Tt(t)+o;if(30<a){var l=o-o%5;a=(r&(1<<l)-1).toString(32),r>>=l,o-=l,Yt=1<<32-Tt(t)+o|n<<o|r,Kt=a+e}else Yt=1<<a|n<<o|r,Kt=e}function ua(e){e.return!==null&&($n(e,1),Ms(e,1,0))}function pa(e){for(;e===Ho;)Ho=pr[--fr],pr[fr]=null,Vo=pr[--fr],pr[fr]=null;for(;e===On;)On=St[--Ct],St[Ct]=null,Kt=St[--Ct],St[Ct]=null,Yt=St[--Ct],St[Ct]=null}var bt=null,wt=null,Ue=!1,Pt=null;function Ps(e,t){var n=zt(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function Fs(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,bt=e,wt=mn(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,bt=e,wt=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=On!==null?{id:Yt,overflow:Kt}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=zt(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,bt=e,wt=null,!0):!1;default:return!1}}function fa(e){return(e.mode&1)!==0&&(e.flags&128)===0}function ma(e){if(Ue){var t=wt;if(t){var n=t;if(!Fs(e,t)){if(fa(e))throw Error(c(418));t=mn(n.nextSibling);var r=bt;t&&Fs(e,t)?Ps(r,n):(e.flags=e.flags&-4097|2,Ue=!1,bt=e)}}else{if(fa(e))throw Error(c(418));e.flags=e.flags&-4097|2,Ue=!1,bt=e}}}function Is(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;bt=e}function Wo(e){if(e!==bt)return!1;if(!Ue)return Is(e),Ue=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!ia(e.type,e.memoizedProps)),t&&(t=wt)){if(fa(e))throw Ds(),Error(c(418));for(;t;)Ps(e,t),t=mn(t.nextSibling)}if(Is(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(c(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){wt=mn(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}wt=null}}else wt=bt?mn(e.stateNode.nextSibling):null;return!0}function Ds(){for(var e=wt;e;)e=mn(e.nextSibling)}function mr(){wt=bt=null,Ue=!1}function ga(e){Pt===null?Pt=[e]:Pt.push(e)}var Yu=re.ReactCurrentBatchConfig;function qr(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(c(309));var r=n.stateNode}if(!r)throw Error(c(147,e));var o=r,a=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===a?t.ref:(t=function(l){var u=o.refs;l===null?delete u[a]:u[a]=l},t._stringRef=a,t)}if(typeof e!="string")throw Error(c(284));if(!n._owner)throw Error(c(290,e))}return e}function Go(e,t){throw e=Object.prototype.toString.call(t),Error(c(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function As(e){var t=e._init;return t(e._payload)}function _s(e){function t(v,f){if(e){var b=v.deletions;b===null?(v.deletions=[f],v.flags|=16):b.push(f)}}function n(v,f){if(!e)return null;for(;f!==null;)t(v,f),f=f.sibling;return null}function r(v,f){for(v=new Map;f!==null;)f.key!==null?v.set(f.key,f):v.set(f.index,f),f=f.sibling;return v}function o(v,f){return v=jn(v,f),v.index=0,v.sibling=null,v}function a(v,f,b){return v.index=b,e?(b=v.alternate,b!==null?(b=b.index,b<f?(v.flags|=2,f):b):(v.flags|=2,f)):(v.flags|=1048576,f)}function l(v){return e&&v.alternate===null&&(v.flags|=2),v}function u(v,f,b,$){return f===null||f.tag!==6?(f=al(b,v.mode,$),f.return=v,f):(f=o(f,b),f.return=v,f)}function p(v,f,b,$){var te=b.type;return te===ge?A(v,f,b.props.children,$,b.key):f!==null&&(f.elementType===te||typeof te=="object"&&te!==null&&te.$$typeof===B&&As(te)===f.type)?($=o(f,b.props),$.ref=qr(v,f,b),$.return=v,$):($=hi(b.type,b.key,b.props,null,v.mode,$),$.ref=qr(v,f,b),$.return=v,$)}function w(v,f,b,$){return f===null||f.tag!==4||f.stateNode.containerInfo!==b.containerInfo||f.stateNode.implementation!==b.implementation?(f=ll(b,v.mode,$),f.return=v,f):(f=o(f,b.children||[]),f.return=v,f)}function A(v,f,b,$,te){return f===null||f.tag!==7?(f=Yn(b,v.mode,$,te),f.return=v,f):(f=o(f,b),f.return=v,f)}function O(v,f,b){if(typeof f=="string"&&f!==""||typeof f=="number")return f=al(""+f,v.mode,b),f.return=v,f;if(typeof f=="object"&&f!==null){switch(f.$$typeof){case be:return b=hi(f.type,f.key,f.props,null,v.mode,b),b.ref=qr(v,null,f),b.return=v,b;case we:return f=ll(f,v.mode,b),f.return=v,f;case B:var $=f._init;return O(v,$(f._payload),b)}if(Lt(f)||K(f))return f=Yn(f,v.mode,b,null),f.return=v,f;Go(v,f)}return null}function I(v,f,b,$){var te=f!==null?f.key:null;if(typeof b=="string"&&b!==""||typeof b=="number")return te!==null?null:u(v,f,""+b,$);if(typeof b=="object"&&b!==null){switch(b.$$typeof){case be:return b.key===te?p(v,f,b,$):null;case we:return b.key===te?w(v,f,b,$):null;case B:return te=b._init,I(v,f,te(b._payload),$)}if(Lt(b)||K(b))return te!==null?null:A(v,f,b,$,null);Go(v,b)}return null}function Y(v,f,b,$,te){if(typeof $=="string"&&$!==""||typeof $=="number")return v=v.get(b)||null,u(f,v,""+$,te);if(typeof $=="object"&&$!==null){switch($.$$typeof){case be:return v=v.get($.key===null?b:$.key)||null,p(f,v,$,te);case we:return v=v.get($.key===null?b:$.key)||null,w(f,v,$,te);case B:var de=$._init;return Y(v,f,b,de($._payload),te)}if(Lt($)||K($))return v=v.get(b)||null,A(f,v,$,te,null);Go(f,$)}return null}function J(v,f,b,$){for(var te=null,de=null,ue=f,me=f=0,tt=null;ue!==null&&me<b.length;me++){ue.index>me?(tt=ue,ue=null):tt=ue.sibling;var Me=I(v,ue,b[me],$);if(Me===null){ue===null&&(ue=tt);break}e&&ue&&Me.alternate===null&&t(v,ue),f=a(Me,f,me),de===null?te=Me:de.sibling=Me,de=Me,ue=tt}if(me===b.length)return n(v,ue),Ue&&$n(v,me),te;if(ue===null){for(;me<b.length;me++)ue=O(v,b[me],$),ue!==null&&(f=a(ue,f,me),de===null?te=ue:de.sibling=ue,de=ue);return Ue&&$n(v,me),te}for(ue=r(v,ue);me<b.length;me++)tt=Y(ue,v,me,b[me],$),tt!==null&&(e&&tt.alternate!==null&&ue.delete(tt.key===null?me:tt.key),f=a(tt,f,me),de===null?te=tt:de.sibling=tt,de=tt);return e&&ue.forEach(function(Nn){return t(v,Nn)}),Ue&&$n(v,me),te}function ee(v,f,b,$){var te=K(b);if(typeof te!="function")throw Error(c(150));if(b=te.call(b),b==null)throw Error(c(151));for(var de=te=null,ue=f,me=f=0,tt=null,Me=b.next();ue!==null&&!Me.done;me++,Me=b.next()){ue.index>me?(tt=ue,ue=null):tt=ue.sibling;var Nn=I(v,ue,Me.value,$);if(Nn===null){ue===null&&(ue=tt);break}e&&ue&&Nn.alternate===null&&t(v,ue),f=a(Nn,f,me),de===null?te=Nn:de.sibling=Nn,de=Nn,ue=tt}if(Me.done)return n(v,ue),Ue&&$n(v,me),te;if(ue===null){for(;!Me.done;me++,Me=b.next())Me=O(v,Me.value,$),Me!==null&&(f=a(Me,f,me),de===null?te=Me:de.sibling=Me,de=Me);return Ue&&$n(v,me),te}for(ue=r(v,ue);!Me.done;me++,Me=b.next())Me=Y(ue,v,me,Me.value,$),Me!==null&&(e&&Me.alternate!==null&&ue.delete(Me.key===null?me:Me.key),f=a(Me,f,me),de===null?te=Me:de.sibling=Me,de=Me);return e&&ue.forEach(function(Ep){return t(v,Ep)}),Ue&&$n(v,me),te}function Ye(v,f,b,$){if(typeof b=="object"&&b!==null&&b.type===ge&&b.key===null&&(b=b.props.children),typeof b=="object"&&b!==null){switch(b.$$typeof){case be:e:{for(var te=b.key,de=f;de!==null;){if(de.key===te){if(te=b.type,te===ge){if(de.tag===7){n(v,de.sibling),f=o(de,b.props.children),f.return=v,v=f;break e}}else if(de.elementType===te||typeof te=="object"&&te!==null&&te.$$typeof===B&&As(te)===de.type){n(v,de.sibling),f=o(de,b.props),f.ref=qr(v,de,b),f.return=v,v=f;break e}n(v,de);break}else t(v,de);de=de.sibling}b.type===ge?(f=Yn(b.props.children,v.mode,$,b.key),f.return=v,v=f):($=hi(b.type,b.key,b.props,null,v.mode,$),$.ref=qr(v,f,b),$.return=v,v=$)}return l(v);case we:e:{for(de=b.key;f!==null;){if(f.key===de)if(f.tag===4&&f.stateNode.containerInfo===b.containerInfo&&f.stateNode.implementation===b.implementation){n(v,f.sibling),f=o(f,b.children||[]),f.return=v,v=f;break e}else{n(v,f);break}else t(v,f);f=f.sibling}f=ll(b,v.mode,$),f.return=v,v=f}return l(v);case B:return de=b._init,Ye(v,f,de(b._payload),$)}if(Lt(b))return J(v,f,b,$);if(K(b))return ee(v,f,b,$);Go(v,b)}return typeof b=="string"&&b!==""||typeof b=="number"?(b=""+b,f!==null&&f.tag===6?(n(v,f.sibling),f=o(f,b),f.return=v,v=f):(n(v,f),f=al(b,v.mode,$),f.return=v,v=f),l(v)):n(v,f)}return Ye}var gr=_s(!0),Rs=_s(!1),Qo=gn(null),Yo=null,hr=null,ha=null;function xa(){ha=hr=Yo=null}function ya(e){var t=Qo.current;$e(Qo),e._currentValue=t}function va(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function xr(e,t){Yo=e,ha=hr=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(mt=!0),e.firstContext=null)}function jt(e){var t=e._currentValue;if(ha!==e)if(e={context:e,memoizedValue:t,next:null},hr===null){if(Yo===null)throw Error(c(308));hr=e,Yo.dependencies={lanes:0,firstContext:e}}else hr=hr.next=e;return t}var Un=null;function ba(e){Un===null?Un=[e]:Un.push(e)}function Os(e,t,n,r){var o=t.interleaved;return o===null?(n.next=n,ba(t)):(n.next=o.next,o.next=n),t.interleaved=n,qt(e,r)}function qt(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var yn=!1;function wa(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function $s(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function Zt(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function vn(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,(Te&2)!==0){var o=r.pending;return o===null?t.next=t:(t.next=o.next,o.next=t),r.pending=t,qt(e,n)}return o=r.interleaved,o===null?(t.next=t,ba(r)):(t.next=o.next,o.next=t),r.interleaved=t,qt(e,n)}function Ko(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,Di(e,n)}}function Us(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var o=null,a=null;if(n=n.firstBaseUpdate,n!==null){do{var l={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};a===null?o=a=l:a=a.next=l,n=n.next}while(n!==null);a===null?o=a=t:a=a.next=t}else o=a=t;n={baseState:r.baseState,firstBaseUpdate:o,lastBaseUpdate:a,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function qo(e,t,n,r){var o=e.updateQueue;yn=!1;var a=o.firstBaseUpdate,l=o.lastBaseUpdate,u=o.shared.pending;if(u!==null){o.shared.pending=null;var p=u,w=p.next;p.next=null,l===null?a=w:l.next=w,l=p;var A=e.alternate;A!==null&&(A=A.updateQueue,u=A.lastBaseUpdate,u!==l&&(u===null?A.firstBaseUpdate=w:u.next=w,A.lastBaseUpdate=p))}if(a!==null){var O=o.baseState;l=0,A=w=p=null,u=a;do{var I=u.lane,Y=u.eventTime;if((r&I)===I){A!==null&&(A=A.next={eventTime:Y,lane:0,tag:u.tag,payload:u.payload,callback:u.callback,next:null});e:{var J=e,ee=u;switch(I=t,Y=n,ee.tag){case 1:if(J=ee.payload,typeof J=="function"){O=J.call(Y,O,I);break e}O=J;break e;case 3:J.flags=J.flags&-65537|128;case 0:if(J=ee.payload,I=typeof J=="function"?J.call(Y,O,I):J,I==null)break e;O=V({},O,I);break e;case 2:yn=!0}}u.callback!==null&&u.lane!==0&&(e.flags|=64,I=o.effects,I===null?o.effects=[u]:I.push(u))}else Y={eventTime:Y,lane:I,tag:u.tag,payload:u.payload,callback:u.callback,next:null},A===null?(w=A=Y,p=O):A=A.next=Y,l|=I;if(u=u.next,u===null){if(u=o.shared.pending,u===null)break;I=u,u=I.next,I.next=null,o.lastBaseUpdate=I,o.shared.pending=null}}while(!0);if(A===null&&(p=O),o.baseState=p,o.firstBaseUpdate=w,o.lastBaseUpdate=A,t=o.shared.interleaved,t!==null){o=t;do l|=o.lane,o=o.next;while(o!==t)}else a===null&&(o.shared.lanes=0);Vn|=l,e.lanes=l,e.memoizedState=O}}function Bs(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var r=e[t],o=r.callback;if(o!==null){if(r.callback=null,r=n,typeof o!="function")throw Error(c(191,o));o.call(r)}}}var Zr={},Ot=gn(Zr),Xr=gn(Zr),Jr=gn(Zr);function Bn(e){if(e===Zr)throw Error(c(174));return e}function ka(e,t){switch(Re(Jr,t),Re(Xr,e),Re(Ot,Zr),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:In(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=In(t,e)}$e(Ot),Re(Ot,t)}function yr(){$e(Ot),$e(Xr),$e(Jr)}function Hs(e){Bn(Jr.current);var t=Bn(Ot.current),n=In(t,e.type);t!==n&&(Re(Xr,e),Re(Ot,n))}function Sa(e){Xr.current===e&&($e(Ot),$e(Xr))}var He=gn(0);function Zo(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Ca=[];function ja(){for(var e=0;e<Ca.length;e++)Ca[e]._workInProgressVersionPrimary=null;Ca.length=0}var Xo=re.ReactCurrentDispatcher,Na=re.ReactCurrentBatchConfig,Hn=0,Ve=null,qe=null,Je=null,Jo=!1,eo=!1,to=0,Ku=0;function at(){throw Error(c(321))}function Ea(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Mt(e[n],t[n]))return!1;return!0}function za(e,t,n,r,o,a){if(Hn=a,Ve=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Xo.current=e===null||e.memoizedState===null?Ju:ep,e=n(r,o),eo){a=0;do{if(eo=!1,to=0,25<=a)throw Error(c(301));a+=1,Je=qe=null,t.updateQueue=null,Xo.current=tp,e=n(r,o)}while(eo)}if(Xo.current=ni,t=qe!==null&&qe.next!==null,Hn=0,Je=qe=Ve=null,Jo=!1,t)throw Error(c(300));return e}function La(){var e=to!==0;return to=0,e}function $t(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Je===null?Ve.memoizedState=Je=e:Je=Je.next=e,Je}function Nt(){if(qe===null){var e=Ve.alternate;e=e!==null?e.memoizedState:null}else e=qe.next;var t=Je===null?Ve.memoizedState:Je.next;if(t!==null)Je=t,qe=e;else{if(e===null)throw Error(c(310));qe=e,e={memoizedState:qe.memoizedState,baseState:qe.baseState,baseQueue:qe.baseQueue,queue:qe.queue,next:null},Je===null?Ve.memoizedState=Je=e:Je=Je.next=e}return Je}function no(e,t){return typeof t=="function"?t(e):t}function Ta(e){var t=Nt(),n=t.queue;if(n===null)throw Error(c(311));n.lastRenderedReducer=e;var r=qe,o=r.baseQueue,a=n.pending;if(a!==null){if(o!==null){var l=o.next;o.next=a.next,a.next=l}r.baseQueue=o=a,n.pending=null}if(o!==null){a=o.next,r=r.baseState;var u=l=null,p=null,w=a;do{var A=w.lane;if((Hn&A)===A)p!==null&&(p=p.next={lane:0,action:w.action,hasEagerState:w.hasEagerState,eagerState:w.eagerState,next:null}),r=w.hasEagerState?w.eagerState:e(r,w.action);else{var O={lane:A,action:w.action,hasEagerState:w.hasEagerState,eagerState:w.eagerState,next:null};p===null?(u=p=O,l=r):p=p.next=O,Ve.lanes|=A,Vn|=A}w=w.next}while(w!==null&&w!==a);p===null?l=r:p.next=u,Mt(r,t.memoizedState)||(mt=!0),t.memoizedState=r,t.baseState=l,t.baseQueue=p,n.lastRenderedState=r}if(e=n.interleaved,e!==null){o=e;do a=o.lane,Ve.lanes|=a,Vn|=a,o=o.next;while(o!==e)}else o===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function Ma(e){var t=Nt(),n=t.queue;if(n===null)throw Error(c(311));n.lastRenderedReducer=e;var r=n.dispatch,o=n.pending,a=t.memoizedState;if(o!==null){n.pending=null;var l=o=o.next;do a=e(a,l.action),l=l.next;while(l!==o);Mt(a,t.memoizedState)||(mt=!0),t.memoizedState=a,t.baseQueue===null&&(t.baseState=a),n.lastRenderedState=a}return[a,r]}function Vs(){}function Ws(e,t){var n=Ve,r=Nt(),o=t(),a=!Mt(r.memoizedState,o);if(a&&(r.memoizedState=o,mt=!0),r=r.queue,Pa(Ys.bind(null,n,r,e),[e]),r.getSnapshot!==t||a||Je!==null&&Je.memoizedState.tag&1){if(n.flags|=2048,ro(9,Qs.bind(null,n,r,o,t),void 0,null),et===null)throw Error(c(349));(Hn&30)!==0||Gs(n,t,o)}return o}function Gs(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=Ve.updateQueue,t===null?(t={lastEffect:null,stores:null},Ve.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Qs(e,t,n,r){t.value=n,t.getSnapshot=r,Ks(t)&&qs(e)}function Ys(e,t,n){return n(function(){Ks(t)&&qs(e)})}function Ks(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Mt(e,n)}catch(r){return!0}}function qs(e){var t=qt(e,1);t!==null&&At(t,e,1,-1)}function Zs(e){var t=$t();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:no,lastRenderedState:e},t.queue=e,e=e.dispatch=Xu.bind(null,Ve,e),[t.memoizedState,e]}function ro(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=Ve.updateQueue,t===null?(t={lastEffect:null,stores:null},Ve.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function Xs(){return Nt().memoizedState}function ei(e,t,n,r){var o=$t();Ve.flags|=e,o.memoizedState=ro(1|t,n,void 0,r===void 0?null:r)}function ti(e,t,n,r){var o=Nt();r=r===void 0?null:r;var a=void 0;if(qe!==null){var l=qe.memoizedState;if(a=l.destroy,r!==null&&Ea(r,l.deps)){o.memoizedState=ro(t,n,a,r);return}}Ve.flags|=e,o.memoizedState=ro(1|t,n,a,r)}function Js(e,t){return ei(8390656,8,e,t)}function Pa(e,t){return ti(2048,8,e,t)}function ec(e,t){return ti(4,2,e,t)}function tc(e,t){return ti(4,4,e,t)}function nc(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function rc(e,t,n){return n=n!=null?n.concat([e]):null,ti(4,4,nc.bind(null,t,e),n)}function Fa(){}function oc(e,t){var n=Nt();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&Ea(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function ic(e,t){var n=Nt();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&Ea(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function ac(e,t,n){return(Hn&21)===0?(e.baseState&&(e.baseState=!1,mt=!0),e.memoizedState=n):(Mt(n,t)||(n=Al(),Ve.lanes|=n,Vn|=n,e.baseState=!0),t)}function qu(e,t){var n=De;De=n!==0&&4>n?n:4,e(!0);var r=Na.transition;Na.transition={};try{e(!1),t()}finally{De=n,Na.transition=r}}function lc(){return Nt().memoizedState}function Zu(e,t,n){var r=Sn(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},sc(e))cc(t,n);else if(n=Os(e,t,n,r),n!==null){var o=ut();At(n,e,r,o),dc(n,t,r)}}function Xu(e,t,n){var r=Sn(e),o={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(sc(e))cc(t,o);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var l=t.lastRenderedState,u=a(l,n);if(o.hasEagerState=!0,o.eagerState=u,Mt(u,l)){var p=t.interleaved;p===null?(o.next=o,ba(t)):(o.next=p.next,p.next=o),t.interleaved=o;return}}catch(w){}finally{}n=Os(e,t,o,r),n!==null&&(o=ut(),At(n,e,r,o),dc(n,t,r))}}function sc(e){var t=e.alternate;return e===Ve||t!==null&&t===Ve}function cc(e,t){eo=Jo=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function dc(e,t,n){if((n&4194240)!==0){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,Di(e,n)}}var ni={readContext:jt,useCallback:at,useContext:at,useEffect:at,useImperativeHandle:at,useInsertionEffect:at,useLayoutEffect:at,useMemo:at,useReducer:at,useRef:at,useState:at,useDebugValue:at,useDeferredValue:at,useTransition:at,useMutableSource:at,useSyncExternalStore:at,useId:at,unstable_isNewReconciler:!1},Ju={readContext:jt,useCallback:function(e,t){return $t().memoizedState=[e,t===void 0?null:t],e},useContext:jt,useEffect:Js,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,ei(4194308,4,nc.bind(null,t,e),n)},useLayoutEffect:function(e,t){return ei(4194308,4,e,t)},useInsertionEffect:function(e,t){return ei(4,2,e,t)},useMemo:function(e,t){var n=$t();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=$t();return t=n!==void 0?n(t):t,r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=Zu.bind(null,Ve,e),[r.memoizedState,e]},useRef:function(e){var t=$t();return e={current:e},t.memoizedState=e},useState:Zs,useDebugValue:Fa,useDeferredValue:function(e){return $t().memoizedState=e},useTransition:function(){var e=Zs(!1),t=e[0];return e=qu.bind(null,e[1]),$t().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var r=Ve,o=$t();if(Ue){if(n===void 0)throw Error(c(407));n=n()}else{if(n=t(),et===null)throw Error(c(349));(Hn&30)!==0||Gs(r,t,n)}o.memoizedState=n;var a={value:n,getSnapshot:t};return o.queue=a,Js(Ys.bind(null,r,a,e),[e]),r.flags|=2048,ro(9,Qs.bind(null,r,a,n,t),void 0,null),n},useId:function(){var e=$t(),t=et.identifierPrefix;if(Ue){var n=Kt,r=Yt;n=(r&~(1<<32-Tt(r)-1)).toString(32)+n,t=":"+t+"R"+n,n=to++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=Ku++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},ep={readContext:jt,useCallback:oc,useContext:jt,useEffect:Pa,useImperativeHandle:rc,useInsertionEffect:ec,useLayoutEffect:tc,useMemo:ic,useReducer:Ta,useRef:Xs,useState:function(){return Ta(no)},useDebugValue:Fa,useDeferredValue:function(e){var t=Nt();return ac(t,qe.memoizedState,e)},useTransition:function(){var e=Ta(no)[0],t=Nt().memoizedState;return[e,t]},useMutableSource:Vs,useSyncExternalStore:Ws,useId:lc,unstable_isNewReconciler:!1},tp={readContext:jt,useCallback:oc,useContext:jt,useEffect:Pa,useImperativeHandle:rc,useInsertionEffect:ec,useLayoutEffect:tc,useMemo:ic,useReducer:Ma,useRef:Xs,useState:function(){return Ma(no)},useDebugValue:Fa,useDeferredValue:function(e){var t=Nt();return qe===null?t.memoizedState=e:ac(t,qe.memoizedState,e)},useTransition:function(){var e=Ma(no)[0],t=Nt().memoizedState;return[e,t]},useMutableSource:Vs,useSyncExternalStore:Ws,useId:lc,unstable_isNewReconciler:!1};function Ft(e,t){if(e&&e.defaultProps){t=V({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function Ia(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:V({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var ri={isMounted:function(e){return(e=e._reactInternals)?An(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=ut(),o=Sn(e),a=Zt(r,o);a.payload=t,n!=null&&(a.callback=n),t=vn(e,a,o),t!==null&&(At(t,e,o,r),Ko(t,e,o))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=ut(),o=Sn(e),a=Zt(r,o);a.tag=1,a.payload=t,n!=null&&(a.callback=n),t=vn(e,a,o),t!==null&&(At(t,e,o,r),Ko(t,e,o))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=ut(),r=Sn(e),o=Zt(n,r);o.tag=2,t!=null&&(o.callback=t),t=vn(e,o,r),t!==null&&(At(t,e,r,n),Ko(t,e,r))}};function uc(e,t,n,r,o,a,l){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,a,l):t.prototype&&t.prototype.isPureReactComponent?!Hr(n,r)||!Hr(o,a):!0}function pc(e,t,n){var r=!1,o=hn,a=t.contextType;return typeof a=="object"&&a!==null?a=jt(a):(o=ft(t)?Rn:it.current,r=t.contextTypes,a=(r=r!=null)?ur(e,o):hn),t=new t(n,a),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=ri,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=o,e.__reactInternalMemoizedMaskedChildContext=a),t}function fc(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&ri.enqueueReplaceState(t,t.state,null)}function Da(e,t,n,r){var o=e.stateNode;o.props=n,o.state=e.memoizedState,o.refs={},wa(e);var a=t.contextType;typeof a=="object"&&a!==null?o.context=jt(a):(a=ft(t)?Rn:it.current,o.context=ur(e,a)),o.state=e.memoizedState,a=t.getDerivedStateFromProps,typeof a=="function"&&(Ia(e,t,a,n),o.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof o.getSnapshotBeforeUpdate=="function"||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(t=o.state,typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount(),t!==o.state&&ri.enqueueReplaceState(o,o.state,null),qo(e,n,o,r),o.state=e.memoizedState),typeof o.componentDidMount=="function"&&(e.flags|=4194308)}function vr(e,t){try{var n="",r=t;do n+=ye(r),r=r.return;while(r);var o=n}catch(a){o=`
Error generating stack: `+a.message+`
`+a.stack}return{value:e,source:t,stack:o,digest:null}}function Aa(e,t,n){return{value:e,source:null,stack:n!=null?n:null,digest:t!=null?t:null}}function _a(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var np=typeof WeakMap=="function"?WeakMap:Map;function mc(e,t,n){n=Zt(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){di||(di=!0,Xa=r),_a(e,t)},n}function gc(e,t,n){n=Zt(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var o=t.value;n.payload=function(){return r(o)},n.callback=function(){_a(e,t)}}var a=e.stateNode;return a!==null&&typeof a.componentDidCatch=="function"&&(n.callback=function(){_a(e,t),typeof r!="function"&&(wn===null?wn=new Set([this]):wn.add(this));var l=t.stack;this.componentDidCatch(t.value,{componentStack:l!==null?l:""})}),n}function hc(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new np;var o=new Set;r.set(t,o)}else o=r.get(t),o===void 0&&(o=new Set,r.set(t,o));o.has(n)||(o.add(n),e=hp.bind(null,e,t,n),t.then(e,e))}function xc(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function yc(e,t,n,r,o){return(e.mode&1)===0?(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=Zt(-1,1),t.tag=2,vn(n,t,1))),n.lanes|=1),e):(e.flags|=65536,e.lanes=o,e)}var rp=re.ReactCurrentOwner,mt=!1;function dt(e,t,n,r){t.child=e===null?Rs(t,null,n,r):gr(t,e.child,n,r)}function vc(e,t,n,r,o){n=n.render;var a=t.ref;return xr(t,o),r=za(e,t,n,r,a,o),n=La(),e!==null&&!mt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~o,Xt(e,t,o)):(Ue&&n&&ua(t),t.flags|=1,dt(e,t,r,o),t.child)}function bc(e,t,n,r,o){if(e===null){var a=n.type;return typeof a=="function"&&!il(a)&&a.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=a,wc(e,t,a,r,o)):(e=hi(n.type,null,r,t,t.mode,o),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,(e.lanes&o)===0){var l=a.memoizedProps;if(n=n.compare,n=n!==null?n:Hr,n(l,r)&&e.ref===t.ref)return Xt(e,t,o)}return t.flags|=1,e=jn(a,r),e.ref=t.ref,e.return=t,t.child=e}function wc(e,t,n,r,o){if(e!==null){var a=e.memoizedProps;if(Hr(a,r)&&e.ref===t.ref)if(mt=!1,t.pendingProps=r=a,(e.lanes&o)!==0)(e.flags&131072)!==0&&(mt=!0);else return t.lanes=e.lanes,Xt(e,t,o)}return Ra(e,t,n,r,o)}function kc(e,t,n){var r=t.pendingProps,o=r.children,a=e!==null?e.memoizedState:null;if(r.mode==="hidden")if((t.mode&1)===0)t.memoizedState={baseLanes:0,cachePool:null,transitions:null},Re(wr,kt),kt|=n;else{if((n&1073741824)===0)return e=a!==null?a.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,Re(wr,kt),kt|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=a!==null?a.baseLanes:n,Re(wr,kt),kt|=r}else a!==null?(r=a.baseLanes|n,t.memoizedState=null):r=n,Re(wr,kt),kt|=r;return dt(e,t,o,n),t.child}function Sc(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function Ra(e,t,n,r,o){var a=ft(n)?Rn:it.current;return a=ur(t,a),xr(t,o),n=za(e,t,n,r,a,o),r=La(),e!==null&&!mt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~o,Xt(e,t,o)):(Ue&&r&&ua(t),t.flags|=1,dt(e,t,n,o),t.child)}function Cc(e,t,n,r,o){if(ft(n)){var a=!0;Uo(t)}else a=!1;if(xr(t,o),t.stateNode===null)ii(e,t),pc(t,n,r),Da(t,n,r,o),r=!0;else if(e===null){var l=t.stateNode,u=t.memoizedProps;l.props=u;var p=l.context,w=n.contextType;typeof w=="object"&&w!==null?w=jt(w):(w=ft(n)?Rn:it.current,w=ur(t,w));var A=n.getDerivedStateFromProps,O=typeof A=="function"||typeof l.getSnapshotBeforeUpdate=="function";O||typeof l.UNSAFE_componentWillReceiveProps!="function"&&typeof l.componentWillReceiveProps!="function"||(u!==r||p!==w)&&fc(t,l,r,w),yn=!1;var I=t.memoizedState;l.state=I,qo(t,r,l,o),p=t.memoizedState,u!==r||I!==p||pt.current||yn?(typeof A=="function"&&(Ia(t,n,A,r),p=t.memoizedState),(u=yn||uc(t,n,u,r,I,p,w))?(O||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount()),typeof l.componentDidMount=="function"&&(t.flags|=4194308)):(typeof l.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=p),l.props=r,l.state=p,l.context=w,r=u):(typeof l.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{l=t.stateNode,$s(e,t),u=t.memoizedProps,w=t.type===t.elementType?u:Ft(t.type,u),l.props=w,O=t.pendingProps,I=l.context,p=n.contextType,typeof p=="object"&&p!==null?p=jt(p):(p=ft(n)?Rn:it.current,p=ur(t,p));var Y=n.getDerivedStateFromProps;(A=typeof Y=="function"||typeof l.getSnapshotBeforeUpdate=="function")||typeof l.UNSAFE_componentWillReceiveProps!="function"&&typeof l.componentWillReceiveProps!="function"||(u!==O||I!==p)&&fc(t,l,r,p),yn=!1,I=t.memoizedState,l.state=I,qo(t,r,l,o);var J=t.memoizedState;u!==O||I!==J||pt.current||yn?(typeof Y=="function"&&(Ia(t,n,Y,r),J=t.memoizedState),(w=yn||uc(t,n,w,r,I,J,p)||!1)?(A||typeof l.UNSAFE_componentWillUpdate!="function"&&typeof l.componentWillUpdate!="function"||(typeof l.componentWillUpdate=="function"&&l.componentWillUpdate(r,J,p),typeof l.UNSAFE_componentWillUpdate=="function"&&l.UNSAFE_componentWillUpdate(r,J,p)),typeof l.componentDidUpdate=="function"&&(t.flags|=4),typeof l.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof l.componentDidUpdate!="function"||u===e.memoizedProps&&I===e.memoizedState||(t.flags|=4),typeof l.getSnapshotBeforeUpdate!="function"||u===e.memoizedProps&&I===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=J),l.props=r,l.state=J,l.context=p,r=w):(typeof l.componentDidUpdate!="function"||u===e.memoizedProps&&I===e.memoizedState||(t.flags|=4),typeof l.getSnapshotBeforeUpdate!="function"||u===e.memoizedProps&&I===e.memoizedState||(t.flags|=1024),r=!1)}return Oa(e,t,n,r,a,o)}function Oa(e,t,n,r,o,a){Sc(e,t);var l=(t.flags&128)!==0;if(!r&&!l)return o&&Ls(t,n,!1),Xt(e,t,a);r=t.stateNode,rp.current=t;var u=l&&typeof n.getDerivedStateFromError!="function"?null:r.render();return t.flags|=1,e!==null&&l?(t.child=gr(t,e.child,null,a),t.child=gr(t,null,u,a)):dt(e,t,u,a),t.memoizedState=r.state,o&&Ls(t,n,!0),t.child}function jc(e){var t=e.stateNode;t.pendingContext?Es(e,t.pendingContext,t.pendingContext!==t.context):t.context&&Es(e,t.context,!1),ka(e,t.containerInfo)}function Nc(e,t,n,r,o){return mr(),ga(o),t.flags|=256,dt(e,t,n,r),t.child}var $a={dehydrated:null,treeContext:null,retryLane:0};function Ua(e){return{baseLanes:e,cachePool:null,transitions:null}}function Ec(e,t,n){var r=t.pendingProps,o=He.current,a=!1,l=(t.flags&128)!==0,u;if((u=l)||(u=e!==null&&e.memoizedState===null?!1:(o&2)!==0),u?(a=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(o|=1),Re(He,o&1),e===null)return ma(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?((t.mode&1)===0?t.lanes=1:e.data==="$!"?t.lanes=8:t.lanes=1073741824,null):(l=r.children,e=r.fallback,a?(r=t.mode,a=t.child,l={mode:"hidden",children:l},(r&1)===0&&a!==null?(a.childLanes=0,a.pendingProps=l):a=xi(l,r,0,null),e=Yn(e,r,n,null),a.return=t,e.return=t,a.sibling=e,t.child=a,t.child.memoizedState=Ua(n),t.memoizedState=$a,e):Ba(t,l));if(o=e.memoizedState,o!==null&&(u=o.dehydrated,u!==null))return op(e,t,l,r,u,o,n);if(a){a=r.fallback,l=t.mode,o=e.child,u=o.sibling;var p={mode:"hidden",children:r.children};return(l&1)===0&&t.child!==o?(r=t.child,r.childLanes=0,r.pendingProps=p,t.deletions=null):(r=jn(o,p),r.subtreeFlags=o.subtreeFlags&14680064),u!==null?a=jn(u,a):(a=Yn(a,l,n,null),a.flags|=2),a.return=t,r.return=t,r.sibling=a,t.child=r,r=a,a=t.child,l=e.child.memoizedState,l=l===null?Ua(n):{baseLanes:l.baseLanes|n,cachePool:null,transitions:l.transitions},a.memoizedState=l,a.childLanes=e.childLanes&~n,t.memoizedState=$a,r}return a=e.child,e=a.sibling,r=jn(a,{mode:"visible",children:r.children}),(t.mode&1)===0&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function Ba(e,t){return t=xi({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function oi(e,t,n,r){return r!==null&&ga(r),gr(t,e.child,null,n),e=Ba(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function op(e,t,n,r,o,a,l){if(n)return t.flags&256?(t.flags&=-257,r=Aa(Error(c(422))),oi(e,t,l,r)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(a=r.fallback,o=t.mode,r=xi({mode:"visible",children:r.children},o,0,null),a=Yn(a,o,l,null),a.flags|=2,r.return=t,a.return=t,r.sibling=a,t.child=r,(t.mode&1)!==0&&gr(t,e.child,null,l),t.child.memoizedState=Ua(l),t.memoizedState=$a,a);if((t.mode&1)===0)return oi(e,t,l,null);if(o.data==="$!"){if(r=o.nextSibling&&o.nextSibling.dataset,r)var u=r.dgst;return r=u,a=Error(c(419)),r=Aa(a,r,void 0),oi(e,t,l,r)}if(u=(l&e.childLanes)!==0,mt||u){if(r=et,r!==null){switch(l&-l){case 4:o=2;break;case 16:o=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:o=32;break;case 536870912:o=268435456;break;default:o=0}o=(o&(r.suspendedLanes|l))!==0?0:o,o!==0&&o!==a.retryLane&&(a.retryLane=o,qt(e,o),At(r,e,o,-1))}return ol(),r=Aa(Error(c(421))),oi(e,t,l,r)}return o.data==="$?"?(t.flags|=128,t.child=e.child,t=xp.bind(null,e),o._reactRetry=t,null):(e=a.treeContext,wt=mn(o.nextSibling),bt=t,Ue=!0,Pt=null,e!==null&&(St[Ct++]=Yt,St[Ct++]=Kt,St[Ct++]=On,Yt=e.id,Kt=e.overflow,On=t),t=Ba(t,r.children),t.flags|=4096,t)}function zc(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),va(e.return,t,n)}function Ha(e,t,n,r,o){var a=e.memoizedState;a===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:o}:(a.isBackwards=t,a.rendering=null,a.renderingStartTime=0,a.last=r,a.tail=n,a.tailMode=o)}function Lc(e,t,n){var r=t.pendingProps,o=r.revealOrder,a=r.tail;if(dt(e,t,r.children,n),r=He.current,(r&2)!==0)r=r&1|2,t.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&zc(e,n,t);else if(e.tag===19)zc(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(Re(He,r),(t.mode&1)===0)t.memoizedState=null;else switch(o){case"forwards":for(n=t.child,o=null;n!==null;)e=n.alternate,e!==null&&Zo(e)===null&&(o=n),n=n.sibling;n=o,n===null?(o=t.child,t.child=null):(o=n.sibling,n.sibling=null),Ha(t,!1,o,n,a);break;case"backwards":for(n=null,o=t.child,t.child=null;o!==null;){if(e=o.alternate,e!==null&&Zo(e)===null){t.child=o;break}e=o.sibling,o.sibling=n,n=o,o=e}Ha(t,!0,n,null,a);break;case"together":Ha(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function ii(e,t){(t.mode&1)===0&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function Xt(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Vn|=t.lanes,(n&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(c(153));if(t.child!==null){for(e=t.child,n=jn(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=jn(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function ip(e,t,n){switch(t.tag){case 3:jc(t),mr();break;case 5:Hs(t);break;case 1:ft(t.type)&&Uo(t);break;case 4:ka(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,o=t.memoizedProps.value;Re(Qo,r._currentValue),r._currentValue=o;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated!==null?(Re(He,He.current&1),t.flags|=128,null):(n&t.child.childLanes)!==0?Ec(e,t,n):(Re(He,He.current&1),e=Xt(e,t,n),e!==null?e.sibling:null);Re(He,He.current&1);break;case 19:if(r=(n&t.childLanes)!==0,(e.flags&128)!==0){if(r)return Lc(e,t,n);t.flags|=128}if(o=t.memoizedState,o!==null&&(o.rendering=null,o.tail=null,o.lastEffect=null),Re(He,He.current),r)break;return null;case 22:case 23:return t.lanes=0,kc(e,t,n)}return Xt(e,t,n)}var Tc,Va,Mc,Pc;Tc=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}},Va=function(){},Mc=function(e,t,n,r){var o=e.memoizedProps;if(o!==r){e=t.stateNode,Bn(Ot.current);var a=null;switch(n){case"input":o=zn(e,o),r=zn(e,r),a=[];break;case"select":o=V({},o,{value:void 0}),r=V({},r,{value:void 0}),a=[];break;case"textarea":o=Fn(e,o),r=Fn(e,r),a=[];break;default:typeof o.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=Ro)}Vt(n,r);var l;n=null;for(w in o)if(!r.hasOwnProperty(w)&&o.hasOwnProperty(w)&&o[w]!=null)if(w==="style"){var u=o[w];for(l in u)u.hasOwnProperty(l)&&(n||(n={}),n[l]="")}else w!=="dangerouslySetInnerHTML"&&w!=="children"&&w!=="suppressContentEditableWarning"&&w!=="suppressHydrationWarning"&&w!=="autoFocus"&&(h.hasOwnProperty(w)?a||(a=[]):(a=a||[]).push(w,null));for(w in r){var p=r[w];if(u=o!=null?o[w]:void 0,r.hasOwnProperty(w)&&p!==u&&(p!=null||u!=null))if(w==="style")if(u){for(l in u)!u.hasOwnProperty(l)||p&&p.hasOwnProperty(l)||(n||(n={}),n[l]="");for(l in p)p.hasOwnProperty(l)&&u[l]!==p[l]&&(n||(n={}),n[l]=p[l])}else n||(a||(a=[]),a.push(w,n)),n=p;else w==="dangerouslySetInnerHTML"?(p=p?p.__html:void 0,u=u?u.__html:void 0,p!=null&&u!==p&&(a=a||[]).push(w,p)):w==="children"?typeof p!="string"&&typeof p!="number"||(a=a||[]).push(w,""+p):w!=="suppressContentEditableWarning"&&w!=="suppressHydrationWarning"&&(h.hasOwnProperty(w)?(p!=null&&w==="onScroll"&&Oe("scroll",e),a||u===p||(a=[])):(a=a||[]).push(w,p))}n&&(a=a||[]).push("style",n);var w=a;(t.updateQueue=w)&&(t.flags|=4)}},Pc=function(e,t,n,r){n!==r&&(t.flags|=4)};function oo(e,t){if(!Ue)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function lt(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var o=e.child;o!==null;)n|=o.lanes|o.childLanes,r|=o.subtreeFlags&14680064,r|=o.flags&14680064,o.return=e,o=o.sibling;else for(o=e.child;o!==null;)n|=o.lanes|o.childLanes,r|=o.subtreeFlags,r|=o.flags,o.return=e,o=o.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function ap(e,t,n){var r=t.pendingProps;switch(pa(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return lt(t),null;case 1:return ft(t.type)&&$o(),lt(t),null;case 3:return r=t.stateNode,yr(),$e(pt),$e(it),ja(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(Wo(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,Pt!==null&&(tl(Pt),Pt=null))),Va(e,t),lt(t),null;case 5:Sa(t);var o=Bn(Jr.current);if(n=t.type,e!==null&&t.stateNode!=null)Mc(e,t,n,r,o),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!r){if(t.stateNode===null)throw Error(c(166));return lt(t),null}if(e=Bn(Ot.current),Wo(t)){r=t.stateNode,n=t.type;var a=t.memoizedProps;switch(r[Rt]=t,r[Yr]=a,e=(t.mode&1)!==0,n){case"dialog":Oe("cancel",r),Oe("close",r);break;case"iframe":case"object":case"embed":Oe("load",r);break;case"video":case"audio":for(o=0;o<Wr.length;o++)Oe(Wr[o],r);break;case"source":Oe("error",r);break;case"img":case"image":case"link":Oe("error",r),Oe("load",r);break;case"details":Oe("toggle",r);break;case"input":Xn(r,a),Oe("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!a.multiple},Oe("invalid",r);break;case"textarea":rn(r,a),Oe("invalid",r)}Vt(n,a),o=null;for(var l in a)if(a.hasOwnProperty(l)){var u=a[l];l==="children"?typeof u=="string"?r.textContent!==u&&(a.suppressHydrationWarning!==!0&&_o(r.textContent,u,e),o=["children",u]):typeof u=="number"&&r.textContent!==""+u&&(a.suppressHydrationWarning!==!0&&_o(r.textContent,u,e),o=["children",""+u]):h.hasOwnProperty(l)&&u!=null&&l==="onScroll"&&Oe("scroll",r)}switch(n){case"input":yt(r),Mn(r,a,!0);break;case"textarea":yt(r),er(r);break;case"select":case"option":break;default:typeof a.onClick=="function"&&(r.onclick=Ro)}r=o,t.updateQueue=r,r!==null&&(t.flags|=4)}else{l=o.nodeType===9?o:o.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=tr(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=l.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=l.createElement(n,{is:r.is}):(e=l.createElement(n),n==="select"&&(l=e,r.multiple?l.multiple=!0:r.size&&(l.size=r.size))):e=l.createElementNS(e,n),e[Rt]=t,e[Yr]=r,Tc(e,t,!1,!1),t.stateNode=e;e:{switch(l=jr(n,r),n){case"dialog":Oe("cancel",e),Oe("close",e),o=r;break;case"iframe":case"object":case"embed":Oe("load",e),o=r;break;case"video":case"audio":for(o=0;o<Wr.length;o++)Oe(Wr[o],e);o=r;break;case"source":Oe("error",e),o=r;break;case"img":case"image":case"link":Oe("error",e),Oe("load",e),o=r;break;case"details":Oe("toggle",e),o=r;break;case"input":Xn(e,r),o=zn(e,r),Oe("invalid",e);break;case"option":o=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},o=V({},r,{value:void 0}),Oe("invalid",e);break;case"textarea":rn(e,r),o=Fn(e,r),Oe("invalid",e);break;default:o=r}Vt(n,o),u=o;for(a in u)if(u.hasOwnProperty(a)){var p=u[a];a==="style"?Ae(e,p):a==="dangerouslySetInnerHTML"?(p=p?p.__html:void 0,p!=null&&Q(e,p)):a==="children"?typeof p=="string"?(n!=="textarea"||p!=="")&&X(e,p):typeof p=="number"&&X(e,""+p):a!=="suppressContentEditableWarning"&&a!=="suppressHydrationWarning"&&a!=="autoFocus"&&(h.hasOwnProperty(a)?p!=null&&a==="onScroll"&&Oe("scroll",e):p!=null&&ne(e,a,p,l))}switch(n){case"input":yt(e),Mn(e,r,!1);break;case"textarea":yt(e),er(e);break;case"option":r.value!=null&&e.setAttribute("value",""+Ce(r.value));break;case"select":e.multiple=!!r.multiple,a=r.value,a!=null?he(e,!!r.multiple,a,!1):r.defaultValue!=null&&he(e,!!r.multiple,r.defaultValue,!0);break;default:typeof o.onClick=="function"&&(e.onclick=Ro)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return lt(t),null;case 6:if(e&&t.stateNode!=null)Pc(e,t,e.memoizedProps,r);else{if(typeof r!="string"&&t.stateNode===null)throw Error(c(166));if(n=Bn(Jr.current),Bn(Ot.current),Wo(t)){if(r=t.stateNode,n=t.memoizedProps,r[Rt]=t,(a=r.nodeValue!==n)&&(e=bt,e!==null))switch(e.tag){case 3:_o(r.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&_o(r.nodeValue,n,(e.mode&1)!==0)}a&&(t.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[Rt]=t,t.stateNode=r}return lt(t),null;case 13:if($e(He),r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(Ue&&wt!==null&&(t.mode&1)!==0&&(t.flags&128)===0)Ds(),mr(),t.flags|=98560,a=!1;else if(a=Wo(t),r!==null&&r.dehydrated!==null){if(e===null){if(!a)throw Error(c(318));if(a=t.memoizedState,a=a!==null?a.dehydrated:null,!a)throw Error(c(317));a[Rt]=t}else mr(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;lt(t),a=!1}else Pt!==null&&(tl(Pt),Pt=null),a=!0;if(!a)return t.flags&65536?t:null}return(t.flags&128)!==0?(t.lanes=n,t):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(t.child.flags|=8192,(t.mode&1)!==0&&(e===null||(He.current&1)!==0?Ze===0&&(Ze=3):ol())),t.updateQueue!==null&&(t.flags|=4),lt(t),null);case 4:return yr(),Va(e,t),e===null&&Gr(t.stateNode.containerInfo),lt(t),null;case 10:return ya(t.type._context),lt(t),null;case 17:return ft(t.type)&&$o(),lt(t),null;case 19:if($e(He),a=t.memoizedState,a===null)return lt(t),null;if(r=(t.flags&128)!==0,l=a.rendering,l===null)if(r)oo(a,!1);else{if(Ze!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(l=Zo(e),l!==null){for(t.flags|=128,oo(a,!1),r=l.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),t.subtreeFlags=0,r=n,n=t.child;n!==null;)a=n,e=r,a.flags&=14680066,l=a.alternate,l===null?(a.childLanes=0,a.lanes=e,a.child=null,a.subtreeFlags=0,a.memoizedProps=null,a.memoizedState=null,a.updateQueue=null,a.dependencies=null,a.stateNode=null):(a.childLanes=l.childLanes,a.lanes=l.lanes,a.child=l.child,a.subtreeFlags=0,a.deletions=null,a.memoizedProps=l.memoizedProps,a.memoizedState=l.memoizedState,a.updateQueue=l.updateQueue,a.type=l.type,e=l.dependencies,a.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return Re(He,He.current&1|2),t.child}e=e.sibling}a.tail!==null&&Qe()>kr&&(t.flags|=128,r=!0,oo(a,!1),t.lanes=4194304)}else{if(!r)if(e=Zo(l),e!==null){if(t.flags|=128,r=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),oo(a,!0),a.tail===null&&a.tailMode==="hidden"&&!l.alternate&&!Ue)return lt(t),null}else 2*Qe()-a.renderingStartTime>kr&&n!==1073741824&&(t.flags|=128,r=!0,oo(a,!1),t.lanes=4194304);a.isBackwards?(l.sibling=t.child,t.child=l):(n=a.last,n!==null?n.sibling=l:t.child=l,a.last=l)}return a.tail!==null?(t=a.tail,a.rendering=t,a.tail=t.sibling,a.renderingStartTime=Qe(),t.sibling=null,n=He.current,Re(He,r?n&1|2:n&1),t):(lt(t),null);case 22:case 23:return rl(),r=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(t.flags|=8192),r&&(t.mode&1)!==0?(kt&1073741824)!==0&&(lt(t),t.subtreeFlags&6&&(t.flags|=8192)):lt(t),null;case 24:return null;case 25:return null}throw Error(c(156,t.tag))}function lp(e,t){switch(pa(t),t.tag){case 1:return ft(t.type)&&$o(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return yr(),$e(pt),$e(it),ja(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 5:return Sa(t),null;case 13:if($e(He),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(c(340));mr()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return $e(He),null;case 4:return yr(),null;case 10:return ya(t.type._context),null;case 22:case 23:return rl(),null;case 24:return null;default:return null}}var ai=!1,st=!1,sp=typeof WeakSet=="function"?WeakSet:Set,q=null;function br(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){We(e,t,r)}else n.current=null}function Wa(e,t,n){try{n()}catch(r){We(e,t,r)}}var Fc=!1;function cp(e,t){if(ra=No,e=us(),Ki(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var o=r.anchorOffset,a=r.focusNode;r=r.focusOffset;try{n.nodeType,a.nodeType}catch($){n=null;break e}var l=0,u=-1,p=-1,w=0,A=0,O=e,I=null;t:for(;;){for(var Y;O!==n||o!==0&&O.nodeType!==3||(u=l+o),O!==a||r!==0&&O.nodeType!==3||(p=l+r),O.nodeType===3&&(l+=O.nodeValue.length),(Y=O.firstChild)!==null;)I=O,O=Y;for(;;){if(O===e)break t;if(I===n&&++w===o&&(u=l),I===a&&++A===r&&(p=l),(Y=O.nextSibling)!==null)break;O=I,I=O.parentNode}O=Y}n=u===-1||p===-1?null:{start:u,end:p}}else n=null}n=n||{start:0,end:0}}else n=null;for(oa={focusedElem:e,selectionRange:n},No=!1,q=t;q!==null;)if(t=q,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,q=e;else for(;q!==null;){t=q;try{var J=t.alternate;if((t.flags&1024)!==0)switch(t.tag){case 0:case 11:case 15:break;case 1:if(J!==null){var ee=J.memoizedProps,Ye=J.memoizedState,v=t.stateNode,f=v.getSnapshotBeforeUpdate(t.elementType===t.type?ee:Ft(t.type,ee),Ye);v.__reactInternalSnapshotBeforeUpdate=f}break;case 3:var b=t.stateNode.containerInfo;b.nodeType===1?b.textContent="":b.nodeType===9&&b.documentElement&&b.removeChild(b.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(c(163))}}catch($){We(t,t.return,$)}if(e=t.sibling,e!==null){e.return=t.return,q=e;break}q=t.return}return J=Fc,Fc=!1,J}function io(e,t,n){var r=t.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var o=r=r.next;do{if((o.tag&e)===e){var a=o.destroy;o.destroy=void 0,a!==void 0&&Wa(t,n,a)}o=o.next}while(o!==r)}}function li(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function Ga(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function Ic(e){var t=e.alternate;t!==null&&(e.alternate=null,Ic(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Rt],delete t[Yr],delete t[sa],delete t[Wu],delete t[Gu])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Dc(e){return e.tag===5||e.tag===3||e.tag===4}function Ac(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Dc(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Qa(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Ro));else if(r!==4&&(e=e.child,e!==null))for(Qa(e,t,n),e=e.sibling;e!==null;)Qa(e,t,n),e=e.sibling}function Ya(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(Ya(e,t,n),e=e.sibling;e!==null;)Ya(e,t,n),e=e.sibling}var rt=null,It=!1;function bn(e,t,n){for(n=n.child;n!==null;)_c(e,t,n),n=n.sibling}function _c(e,t,n){if(_t&&typeof _t.onCommitFiberUnmount=="function")try{_t.onCommitFiberUnmount(bo,n)}catch(u){}switch(n.tag){case 5:st||br(n,t);case 6:var r=rt,o=It;rt=null,bn(e,t,n),rt=r,It=o,rt!==null&&(It?(e=rt,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):rt.removeChild(n.stateNode));break;case 18:rt!==null&&(It?(e=rt,n=n.stateNode,e.nodeType===8?la(e.parentNode,n):e.nodeType===1&&la(e,n),_r(e)):la(rt,n.stateNode));break;case 4:r=rt,o=It,rt=n.stateNode.containerInfo,It=!0,bn(e,t,n),rt=r,It=o;break;case 0:case 11:case 14:case 15:if(!st&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){o=r=r.next;do{var a=o,l=a.destroy;a=a.tag,l!==void 0&&((a&2)!==0||(a&4)!==0)&&Wa(n,t,l),o=o.next}while(o!==r)}bn(e,t,n);break;case 1:if(!st&&(br(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(u){We(n,t,u)}bn(e,t,n);break;case 21:bn(e,t,n);break;case 22:n.mode&1?(st=(r=st)||n.memoizedState!==null,bn(e,t,n),st=r):bn(e,t,n);break;default:bn(e,t,n)}}function Rc(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new sp),t.forEach(function(r){var o=yp.bind(null,e,r);n.has(r)||(n.add(r),r.then(o,o))})}}function Dt(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var o=n[r];try{var a=e,l=t,u=l;e:for(;u!==null;){switch(u.tag){case 5:rt=u.stateNode,It=!1;break e;case 3:rt=u.stateNode.containerInfo,It=!0;break e;case 4:rt=u.stateNode.containerInfo,It=!0;break e}u=u.return}if(rt===null)throw Error(c(160));_c(a,l,o),rt=null,It=!1;var p=o.alternate;p!==null&&(p.return=null),o.return=null}catch(w){We(o,t,w)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Oc(t,e),t=t.sibling}function Oc(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Dt(t,e),Ut(e),r&4){try{io(3,e,e.return),li(3,e)}catch(ee){We(e,e.return,ee)}try{io(5,e,e.return)}catch(ee){We(e,e.return,ee)}}break;case 1:Dt(t,e),Ut(e),r&512&&n!==null&&br(n,n.return);break;case 5:if(Dt(t,e),Ut(e),r&512&&n!==null&&br(n,n.return),e.flags&32){var o=e.stateNode;try{X(o,"")}catch(ee){We(e,e.return,ee)}}if(r&4&&(o=e.stateNode,o!=null)){var a=e.memoizedProps,l=n!==null?n.memoizedProps:a,u=e.type,p=e.updateQueue;if(e.updateQueue=null,p!==null)try{u==="input"&&a.type==="radio"&&a.name!=null&&Ln(o,a),jr(u,l);var w=jr(u,a);for(l=0;l<p.length;l+=2){var A=p[l],O=p[l+1];A==="style"?Ae(o,O):A==="dangerouslySetInnerHTML"?Q(o,O):A==="children"?X(o,O):ne(o,A,O,w)}switch(u){case"input":Tn(o,a);break;case"textarea":Jn(o,a);break;case"select":var I=o._wrapperState.wasMultiple;o._wrapperState.wasMultiple=!!a.multiple;var Y=a.value;Y!=null?he(o,!!a.multiple,Y,!1):I!==!!a.multiple&&(a.defaultValue!=null?he(o,!!a.multiple,a.defaultValue,!0):he(o,!!a.multiple,a.multiple?[]:"",!1))}o[Yr]=a}catch(ee){We(e,e.return,ee)}}break;case 6:if(Dt(t,e),Ut(e),r&4){if(e.stateNode===null)throw Error(c(162));o=e.stateNode,a=e.memoizedProps;try{o.nodeValue=a}catch(ee){We(e,e.return,ee)}}break;case 3:if(Dt(t,e),Ut(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{_r(t.containerInfo)}catch(ee){We(e,e.return,ee)}break;case 4:Dt(t,e),Ut(e);break;case 13:Dt(t,e),Ut(e),o=e.child,o.flags&8192&&(a=o.memoizedState!==null,o.stateNode.isHidden=a,!a||o.alternate!==null&&o.alternate.memoizedState!==null||(Za=Qe())),r&4&&Rc(e);break;case 22:if(A=n!==null&&n.memoizedState!==null,e.mode&1?(st=(w=st)||A,Dt(t,e),st=w):Dt(t,e),Ut(e),r&8192){if(w=e.memoizedState!==null,(e.stateNode.isHidden=w)&&!A&&(e.mode&1)!==0)for(q=e,A=e.child;A!==null;){for(O=q=A;q!==null;){switch(I=q,Y=I.child,I.tag){case 0:case 11:case 14:case 15:io(4,I,I.return);break;case 1:br(I,I.return);var J=I.stateNode;if(typeof J.componentWillUnmount=="function"){r=I,n=I.return;try{t=r,J.props=t.memoizedProps,J.state=t.memoizedState,J.componentWillUnmount()}catch(ee){We(r,n,ee)}}break;case 5:br(I,I.return);break;case 22:if(I.memoizedState!==null){Bc(O);continue}}Y!==null?(Y.return=I,q=Y):Bc(O)}A=A.sibling}e:for(A=null,O=e;;){if(O.tag===5){if(A===null){A=O;try{o=O.stateNode,w?(a=o.style,typeof a.setProperty=="function"?a.setProperty("display","none","important"):a.display="none"):(u=O.stateNode,p=O.memoizedProps.style,l=p!=null&&p.hasOwnProperty("display")?p.display:null,u.style.display=nt("display",l))}catch(ee){We(e,e.return,ee)}}}else if(O.tag===6){if(A===null)try{O.stateNode.nodeValue=w?"":O.memoizedProps}catch(ee){We(e,e.return,ee)}}else if((O.tag!==22&&O.tag!==23||O.memoizedState===null||O===e)&&O.child!==null){O.child.return=O,O=O.child;continue}if(O===e)break e;for(;O.sibling===null;){if(O.return===null||O.return===e)break e;A===O&&(A=null),O=O.return}A===O&&(A=null),O.sibling.return=O.return,O=O.sibling}}break;case 19:Dt(t,e),Ut(e),r&4&&Rc(e);break;case 21:break;default:Dt(t,e),Ut(e)}}function Ut(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(Dc(n)){var r=n;break e}n=n.return}throw Error(c(160))}switch(r.tag){case 5:var o=r.stateNode;r.flags&32&&(X(o,""),r.flags&=-33);var a=Ac(e);Ya(e,a,o);break;case 3:case 4:var l=r.stateNode.containerInfo,u=Ac(e);Qa(e,u,l);break;default:throw Error(c(161))}}catch(p){We(e,e.return,p)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function dp(e,t,n){q=e,$c(e)}function $c(e,t,n){for(var r=(e.mode&1)!==0;q!==null;){var o=q,a=o.child;if(o.tag===22&&r){var l=o.memoizedState!==null||ai;if(!l){var u=o.alternate,p=u!==null&&u.memoizedState!==null||st;u=ai;var w=st;if(ai=l,(st=p)&&!w)for(q=o;q!==null;)l=q,p=l.child,l.tag===22&&l.memoizedState!==null?Hc(o):p!==null?(p.return=l,q=p):Hc(o);for(;a!==null;)q=a,$c(a),a=a.sibling;q=o,ai=u,st=w}Uc(e)}else(o.subtreeFlags&8772)!==0&&a!==null?(a.return=o,q=a):Uc(e)}}function Uc(e){for(;q!==null;){var t=q;if((t.flags&8772)!==0){var n=t.alternate;try{if((t.flags&8772)!==0)switch(t.tag){case 0:case 11:case 15:st||li(5,t);break;case 1:var r=t.stateNode;if(t.flags&4&&!st)if(n===null)r.componentDidMount();else{var o=t.elementType===t.type?n.memoizedProps:Ft(t.type,n.memoizedProps);r.componentDidUpdate(o,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var a=t.updateQueue;a!==null&&Bs(t,a,r);break;case 3:var l=t.updateQueue;if(l!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}Bs(t,l,n)}break;case 5:var u=t.stateNode;if(n===null&&t.flags&4){n=u;var p=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":p.autoFocus&&n.focus();break;case"img":p.src&&(n.src=p.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var w=t.alternate;if(w!==null){var A=w.memoizedState;if(A!==null){var O=A.dehydrated;O!==null&&_r(O)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(c(163))}st||t.flags&512&&Ga(t)}catch(I){We(t,t.return,I)}}if(t===e){q=null;break}if(n=t.sibling,n!==null){n.return=t.return,q=n;break}q=t.return}}function Bc(e){for(;q!==null;){var t=q;if(t===e){q=null;break}var n=t.sibling;if(n!==null){n.return=t.return,q=n;break}q=t.return}}function Hc(e){for(;q!==null;){var t=q;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{li(4,t)}catch(p){We(t,n,p)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount=="function"){var o=t.return;try{r.componentDidMount()}catch(p){We(t,o,p)}}var a=t.return;try{Ga(t)}catch(p){We(t,a,p)}break;case 5:var l=t.return;try{Ga(t)}catch(p){We(t,l,p)}}}catch(p){We(t,t.return,p)}if(t===e){q=null;break}var u=t.sibling;if(u!==null){u.return=t.return,q=u;break}q=t.return}}var up=Math.ceil,si=re.ReactCurrentDispatcher,Ka=re.ReactCurrentOwner,Et=re.ReactCurrentBatchConfig,Te=0,et=null,Ke=null,ot=0,kt=0,wr=gn(0),Ze=0,ao=null,Vn=0,ci=0,qa=0,lo=null,gt=null,Za=0,kr=1/0,Jt=null,di=!1,Xa=null,wn=null,ui=!1,kn=null,pi=0,so=0,Ja=null,fi=-1,mi=0;function ut(){return(Te&6)!==0?Qe():fi!==-1?fi:fi=Qe()}function Sn(e){return(e.mode&1)===0?1:(Te&2)!==0&&ot!==0?ot&-ot:Yu.transition!==null?(mi===0&&(mi=Al()),mi):(e=De,e!==0||(e=window.event,e=e===void 0?16:Wl(e.type)),e)}function At(e,t,n,r){if(50<so)throw so=0,Ja=null,Error(c(185));Pr(e,n,r),((Te&2)===0||e!==et)&&(e===et&&((Te&2)===0&&(ci|=n),Ze===4&&Cn(e,ot)),ht(e,r),n===1&&Te===0&&(t.mode&1)===0&&(kr=Qe()+500,Bo&&xn()))}function ht(e,t){var n=e.callbackNode;Yd(e,t);var r=So(e,e===et?ot:0);if(r===0)n!==null&&Fl(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&Fl(n),t===1)e.tag===0?Qu(Wc.bind(null,e)):Ts(Wc.bind(null,e)),Hu(function(){(Te&6)===0&&xn()}),n=null;else{switch(_l(r)){case 1:n=Pi;break;case 4:n=Il;break;case 16:n=vo;break;case 536870912:n=Dl;break;default:n=vo}n=Jc(n,Vc.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function Vc(e,t){if(fi=-1,mi=0,(Te&6)!==0)throw Error(c(327));var n=e.callbackNode;if(Sr()&&e.callbackNode!==n)return null;var r=So(e,e===et?ot:0);if(r===0)return null;if((r&30)!==0||(r&e.expiredLanes)!==0||t)t=gi(e,r);else{t=r;var o=Te;Te|=2;var a=Qc();(et!==e||ot!==t)&&(Jt=null,kr=Qe()+500,Gn(e,t));do try{mp();break}catch(u){Gc(e,u)}while(!0);xa(),si.current=a,Te=o,Ke!==null?t=0:(et=null,ot=0,t=Ze)}if(t!==0){if(t===2&&(o=Fi(e),o!==0&&(r=o,t=el(e,o))),t===1)throw n=ao,Gn(e,0),Cn(e,r),ht(e,Qe()),n;if(t===6)Cn(e,r);else{if(o=e.current.alternate,(r&30)===0&&!pp(o)&&(t=gi(e,r),t===2&&(a=Fi(e),a!==0&&(r=a,t=el(e,a))),t===1))throw n=ao,Gn(e,0),Cn(e,r),ht(e,Qe()),n;switch(e.finishedWork=o,e.finishedLanes=r,t){case 0:case 1:throw Error(c(345));case 2:Qn(e,gt,Jt);break;case 3:if(Cn(e,r),(r&130023424)===r&&(t=Za+500-Qe(),10<t)){if(So(e,0)!==0)break;if(o=e.suspendedLanes,(o&r)!==r){ut(),e.pingedLanes|=e.suspendedLanes&o;break}e.timeoutHandle=aa(Qn.bind(null,e,gt,Jt),t);break}Qn(e,gt,Jt);break;case 4:if(Cn(e,r),(r&4194240)===r)break;for(t=e.eventTimes,o=-1;0<r;){var l=31-Tt(r);a=1<<l,l=t[l],l>o&&(o=l),r&=~a}if(r=o,r=Qe()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*up(r/1960))-r,10<r){e.timeoutHandle=aa(Qn.bind(null,e,gt,Jt),r);break}Qn(e,gt,Jt);break;case 5:Qn(e,gt,Jt);break;default:throw Error(c(329))}}}return ht(e,Qe()),e.callbackNode===n?Vc.bind(null,e):null}function el(e,t){var n=lo;return e.current.memoizedState.isDehydrated&&(Gn(e,t).flags|=256),e=gi(e,t),e!==2&&(t=gt,gt=n,t!==null&&tl(t)),e}function tl(e){gt===null?gt=e:gt.push.apply(gt,e)}function pp(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var o=n[r],a=o.getSnapshot;o=o.value;try{if(!Mt(a(),o))return!1}catch(l){return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Cn(e,t){for(t&=~qa,t&=~ci,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-Tt(t),r=1<<n;e[n]=-1,t&=~r}}function Wc(e){if((Te&6)!==0)throw Error(c(327));Sr();var t=So(e,0);if((t&1)===0)return ht(e,Qe()),null;var n=gi(e,t);if(e.tag!==0&&n===2){var r=Fi(e);r!==0&&(t=r,n=el(e,r))}if(n===1)throw n=ao,Gn(e,0),Cn(e,t),ht(e,Qe()),n;if(n===6)throw Error(c(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Qn(e,gt,Jt),ht(e,Qe()),null}function nl(e,t){var n=Te;Te|=1;try{return e(t)}finally{Te=n,Te===0&&(kr=Qe()+500,Bo&&xn())}}function Wn(e){kn!==null&&kn.tag===0&&(Te&6)===0&&Sr();var t=Te;Te|=1;var n=Et.transition,r=De;try{if(Et.transition=null,De=1,e)return e()}finally{De=r,Et.transition=n,Te=t,(Te&6)===0&&xn()}}function rl(){kt=wr.current,$e(wr)}function Gn(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,Bu(n)),Ke!==null)for(n=Ke.return;n!==null;){var r=n;switch(pa(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&$o();break;case 3:yr(),$e(pt),$e(it),ja();break;case 5:Sa(r);break;case 4:yr();break;case 13:$e(He);break;case 19:$e(He);break;case 10:ya(r.type._context);break;case 22:case 23:rl()}n=n.return}if(et=e,Ke=e=jn(e.current,null),ot=kt=t,Ze=0,ao=null,qa=ci=Vn=0,gt=lo=null,Un!==null){for(t=0;t<Un.length;t++)if(n=Un[t],r=n.interleaved,r!==null){n.interleaved=null;var o=r.next,a=n.pending;if(a!==null){var l=a.next;a.next=o,r.next=l}n.pending=r}Un=null}return e}function Gc(e,t){do{var n=Ke;try{if(xa(),Xo.current=ni,Jo){for(var r=Ve.memoizedState;r!==null;){var o=r.queue;o!==null&&(o.pending=null),r=r.next}Jo=!1}if(Hn=0,Je=qe=Ve=null,eo=!1,to=0,Ka.current=null,n===null||n.return===null){Ze=1,ao=t,Ke=null;break}e:{var a=e,l=n.return,u=n,p=t;if(t=ot,u.flags|=32768,p!==null&&typeof p=="object"&&typeof p.then=="function"){var w=p,A=u,O=A.tag;if((A.mode&1)===0&&(O===0||O===11||O===15)){var I=A.alternate;I?(A.updateQueue=I.updateQueue,A.memoizedState=I.memoizedState,A.lanes=I.lanes):(A.updateQueue=null,A.memoizedState=null)}var Y=xc(l);if(Y!==null){Y.flags&=-257,yc(Y,l,u,a,t),Y.mode&1&&hc(a,w,t),t=Y,p=w;var J=t.updateQueue;if(J===null){var ee=new Set;ee.add(p),t.updateQueue=ee}else J.add(p);break e}else{if((t&1)===0){hc(a,w,t),ol();break e}p=Error(c(426))}}else if(Ue&&u.mode&1){var Ye=xc(l);if(Ye!==null){(Ye.flags&65536)===0&&(Ye.flags|=256),yc(Ye,l,u,a,t),ga(vr(p,u));break e}}a=p=vr(p,u),Ze!==4&&(Ze=2),lo===null?lo=[a]:lo.push(a),a=l;do{switch(a.tag){case 3:a.flags|=65536,t&=-t,a.lanes|=t;var v=mc(a,p,t);Us(a,v);break e;case 1:u=p;var f=a.type,b=a.stateNode;if((a.flags&128)===0&&(typeof f.getDerivedStateFromError=="function"||b!==null&&typeof b.componentDidCatch=="function"&&(wn===null||!wn.has(b)))){a.flags|=65536,t&=-t,a.lanes|=t;var $=gc(a,u,t);Us(a,$);break e}}a=a.return}while(a!==null)}Kc(n)}catch(te){t=te,Ke===n&&n!==null&&(Ke=n=n.return);continue}break}while(!0)}function Qc(){var e=si.current;return si.current=ni,e===null?ni:e}function ol(){(Ze===0||Ze===3||Ze===2)&&(Ze=4),et===null||(Vn&268435455)===0&&(ci&268435455)===0||Cn(et,ot)}function gi(e,t){var n=Te;Te|=2;var r=Qc();(et!==e||ot!==t)&&(Jt=null,Gn(e,t));do try{fp();break}catch(o){Gc(e,o)}while(!0);if(xa(),Te=n,si.current=r,Ke!==null)throw Error(c(261));return et=null,ot=0,Ze}function fp(){for(;Ke!==null;)Yc(Ke)}function mp(){for(;Ke!==null&&!Od();)Yc(Ke)}function Yc(e){var t=Xc(e.alternate,e,kt);e.memoizedProps=e.pendingProps,t===null?Kc(e):Ke=t,Ka.current=null}function Kc(e){var t=e;do{var n=t.alternate;if(e=t.return,(t.flags&32768)===0){if(n=ap(n,t,kt),n!==null){Ke=n;return}}else{if(n=lp(n,t),n!==null){n.flags&=32767,Ke=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Ze=6,Ke=null;return}}if(t=t.sibling,t!==null){Ke=t;return}Ke=t=e}while(t!==null);Ze===0&&(Ze=5)}function Qn(e,t,n){var r=De,o=Et.transition;try{Et.transition=null,De=1,gp(e,t,n,r)}finally{Et.transition=o,De=r}return null}function gp(e,t,n,r){do Sr();while(kn!==null);if((Te&6)!==0)throw Error(c(327));n=e.finishedWork;var o=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(c(177));e.callbackNode=null,e.callbackPriority=0;var a=n.lanes|n.childLanes;if(Kd(e,a),e===et&&(Ke=et=null,ot=0),(n.subtreeFlags&2064)===0&&(n.flags&2064)===0||ui||(ui=!0,Jc(vo,function(){return Sr(),null})),a=(n.flags&15990)!==0,(n.subtreeFlags&15990)!==0||a){a=Et.transition,Et.transition=null;var l=De;De=1;var u=Te;Te|=4,Ka.current=null,cp(e,n),Oc(n,e),Du(oa),No=!!ra,oa=ra=null,e.current=n,dp(n),$d(),Te=u,De=l,Et.transition=a}else e.current=n;if(ui&&(ui=!1,kn=e,pi=o),a=e.pendingLanes,a===0&&(wn=null),Hd(n.stateNode),ht(e,Qe()),t!==null)for(r=e.onRecoverableError,n=0;n<t.length;n++)o=t[n],r(o.value,{componentStack:o.stack,digest:o.digest});if(di)throw di=!1,e=Xa,Xa=null,e;return(pi&1)!==0&&e.tag!==0&&Sr(),a=e.pendingLanes,(a&1)!==0?e===Ja?so++:(so=0,Ja=e):so=0,xn(),null}function Sr(){if(kn!==null){var e=_l(pi),t=Et.transition,n=De;try{if(Et.transition=null,De=16>e?16:e,kn===null)var r=!1;else{if(e=kn,kn=null,pi=0,(Te&6)!==0)throw Error(c(331));var o=Te;for(Te|=4,q=e.current;q!==null;){var a=q,l=a.child;if((q.flags&16)!==0){var u=a.deletions;if(u!==null){for(var p=0;p<u.length;p++){var w=u[p];for(q=w;q!==null;){var A=q;switch(A.tag){case 0:case 11:case 15:io(8,A,a)}var O=A.child;if(O!==null)O.return=A,q=O;else for(;q!==null;){A=q;var I=A.sibling,Y=A.return;if(Ic(A),A===w){q=null;break}if(I!==null){I.return=Y,q=I;break}q=Y}}}var J=a.alternate;if(J!==null){var ee=J.child;if(ee!==null){J.child=null;do{var Ye=ee.sibling;ee.sibling=null,ee=Ye}while(ee!==null)}}q=a}}if((a.subtreeFlags&2064)!==0&&l!==null)l.return=a,q=l;else e:for(;q!==null;){if(a=q,(a.flags&2048)!==0)switch(a.tag){case 0:case 11:case 15:io(9,a,a.return)}var v=a.sibling;if(v!==null){v.return=a.return,q=v;break e}q=a.return}}var f=e.current;for(q=f;q!==null;){l=q;var b=l.child;if((l.subtreeFlags&2064)!==0&&b!==null)b.return=l,q=b;else e:for(l=f;q!==null;){if(u=q,(u.flags&2048)!==0)try{switch(u.tag){case 0:case 11:case 15:li(9,u)}}catch(te){We(u,u.return,te)}if(u===l){q=null;break e}var $=u.sibling;if($!==null){$.return=u.return,q=$;break e}q=u.return}}if(Te=o,xn(),_t&&typeof _t.onPostCommitFiberRoot=="function")try{_t.onPostCommitFiberRoot(bo,e)}catch(te){}r=!0}return r}finally{De=n,Et.transition=t}}return!1}function qc(e,t,n){t=vr(n,t),t=mc(e,t,1),e=vn(e,t,1),t=ut(),e!==null&&(Pr(e,1,t),ht(e,t))}function We(e,t,n){if(e.tag===3)qc(e,e,n);else for(;t!==null;){if(t.tag===3){qc(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(wn===null||!wn.has(r))){e=vr(n,e),e=gc(t,e,1),t=vn(t,e,1),e=ut(),t!==null&&(Pr(t,1,e),ht(t,e));break}}t=t.return}}function hp(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=ut(),e.pingedLanes|=e.suspendedLanes&n,et===e&&(ot&n)===n&&(Ze===4||Ze===3&&(ot&130023424)===ot&&500>Qe()-Za?Gn(e,0):qa|=n),ht(e,t)}function Zc(e,t){t===0&&((e.mode&1)===0?t=1:(t=ko,ko<<=1,(ko&130023424)===0&&(ko=4194304)));var n=ut();e=qt(e,t),e!==null&&(Pr(e,t,n),ht(e,n))}function xp(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Zc(e,n)}function yp(e,t){var n=0;switch(e.tag){case 13:var r=e.stateNode,o=e.memoizedState;o!==null&&(n=o.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(c(314))}r!==null&&r.delete(t),Zc(e,n)}var Xc;Xc=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||pt.current)mt=!0;else{if((e.lanes&n)===0&&(t.flags&128)===0)return mt=!1,ip(e,t,n);mt=(e.flags&131072)!==0}else mt=!1,Ue&&(t.flags&1048576)!==0&&Ms(t,Vo,t.index);switch(t.lanes=0,t.tag){case 2:var r=t.type;ii(e,t),e=t.pendingProps;var o=ur(t,it.current);xr(t,n),o=za(null,t,r,e,o,n);var a=La();return t.flags|=1,typeof o=="object"&&o!==null&&typeof o.render=="function"&&o.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,ft(r)?(a=!0,Uo(t)):a=!1,t.memoizedState=o.state!==null&&o.state!==void 0?o.state:null,wa(t),o.updater=ri,t.stateNode=o,o._reactInternals=t,Da(t,r,e,n),t=Oa(null,t,r,!0,a,n)):(t.tag=0,Ue&&a&&ua(t),dt(null,t,o,n),t=t.child),t;case 16:r=t.elementType;e:{switch(ii(e,t),e=t.pendingProps,o=r._init,r=o(r._payload),t.type=r,o=t.tag=bp(r),e=Ft(r,e),o){case 0:t=Ra(null,t,r,e,n);break e;case 1:t=Cc(null,t,r,e,n);break e;case 11:t=vc(null,t,r,e,n);break e;case 14:t=bc(null,t,r,Ft(r.type,e),n);break e}throw Error(c(306,r,""))}return t;case 0:return r=t.type,o=t.pendingProps,o=t.elementType===r?o:Ft(r,o),Ra(e,t,r,o,n);case 1:return r=t.type,o=t.pendingProps,o=t.elementType===r?o:Ft(r,o),Cc(e,t,r,o,n);case 3:e:{if(jc(t),e===null)throw Error(c(387));r=t.pendingProps,a=t.memoizedState,o=a.element,$s(e,t),qo(t,r,null,n);var l=t.memoizedState;if(r=l.element,a.isDehydrated)if(a={element:r,isDehydrated:!1,cache:l.cache,pendingSuspenseBoundaries:l.pendingSuspenseBoundaries,transitions:l.transitions},t.updateQueue.baseState=a,t.memoizedState=a,t.flags&256){o=vr(Error(c(423)),t),t=Nc(e,t,r,n,o);break e}else if(r!==o){o=vr(Error(c(424)),t),t=Nc(e,t,r,n,o);break e}else for(wt=mn(t.stateNode.containerInfo.firstChild),bt=t,Ue=!0,Pt=null,n=Rs(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(mr(),r===o){t=Xt(e,t,n);break e}dt(e,t,r,n)}t=t.child}return t;case 5:return Hs(t),e===null&&ma(t),r=t.type,o=t.pendingProps,a=e!==null?e.memoizedProps:null,l=o.children,ia(r,o)?l=null:a!==null&&ia(r,a)&&(t.flags|=32),Sc(e,t),dt(e,t,l,n),t.child;case 6:return e===null&&ma(t),null;case 13:return Ec(e,t,n);case 4:return ka(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=gr(t,null,r,n):dt(e,t,r,n),t.child;case 11:return r=t.type,o=t.pendingProps,o=t.elementType===r?o:Ft(r,o),vc(e,t,r,o,n);case 7:return dt(e,t,t.pendingProps,n),t.child;case 8:return dt(e,t,t.pendingProps.children,n),t.child;case 12:return dt(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,o=t.pendingProps,a=t.memoizedProps,l=o.value,Re(Qo,r._currentValue),r._currentValue=l,a!==null)if(Mt(a.value,l)){if(a.children===o.children&&!pt.current){t=Xt(e,t,n);break e}}else for(a=t.child,a!==null&&(a.return=t);a!==null;){var u=a.dependencies;if(u!==null){l=a.child;for(var p=u.firstContext;p!==null;){if(p.context===r){if(a.tag===1){p=Zt(-1,n&-n),p.tag=2;var w=a.updateQueue;if(w!==null){w=w.shared;var A=w.pending;A===null?p.next=p:(p.next=A.next,A.next=p),w.pending=p}}a.lanes|=n,p=a.alternate,p!==null&&(p.lanes|=n),va(a.return,n,t),u.lanes|=n;break}p=p.next}}else if(a.tag===10)l=a.type===t.type?null:a.child;else if(a.tag===18){if(l=a.return,l===null)throw Error(c(341));l.lanes|=n,u=l.alternate,u!==null&&(u.lanes|=n),va(l,n,t),l=a.sibling}else l=a.child;if(l!==null)l.return=a;else for(l=a;l!==null;){if(l===t){l=null;break}if(a=l.sibling,a!==null){a.return=l.return,l=a;break}l=l.return}a=l}dt(e,t,o.children,n),t=t.child}return t;case 9:return o=t.type,r=t.pendingProps.children,xr(t,n),o=jt(o),r=r(o),t.flags|=1,dt(e,t,r,n),t.child;case 14:return r=t.type,o=Ft(r,t.pendingProps),o=Ft(r.type,o),bc(e,t,r,o,n);case 15:return wc(e,t,t.type,t.pendingProps,n);case 17:return r=t.type,o=t.pendingProps,o=t.elementType===r?o:Ft(r,o),ii(e,t),t.tag=1,ft(r)?(e=!0,Uo(t)):e=!1,xr(t,n),pc(t,r,o),Da(t,r,o,n),Oa(null,t,r,!0,e,n);case 19:return Lc(e,t,n);case 22:return kc(e,t,n)}throw Error(c(156,t.tag))};function Jc(e,t){return Pl(e,t)}function vp(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function zt(e,t,n,r){return new vp(e,t,n,r)}function il(e){return e=e.prototype,!(!e||!e.isReactComponent)}function bp(e){if(typeof e=="function")return il(e)?1:0;if(e!=null){if(e=e.$$typeof,e===z)return 11;if(e===D)return 14}return 2}function jn(e,t){var n=e.alternate;return n===null?(n=zt(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function hi(e,t,n,r,o,a){var l=2;if(r=e,typeof e=="function")il(e)&&(l=1);else if(typeof e=="string")l=5;else e:switch(e){case ge:return Yn(n.children,o,a,t);case ke:l=8,o|=8;break;case Se:return e=zt(12,n,t,o|2),e.elementType=Se,e.lanes=a,e;case R:return e=zt(13,n,t,o),e.elementType=R,e.lanes=a,e;case y:return e=zt(19,n,t,o),e.elementType=y,e.lanes=a,e;case N:return xi(n,o,a,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case Fe:l=10;break e;case Ie:l=9;break e;case z:l=11;break e;case D:l=14;break e;case B:l=16,r=null;break e}throw Error(c(130,e==null?e:typeof e,""))}return t=zt(l,n,t,o),t.elementType=e,t.type=r,t.lanes=a,t}function Yn(e,t,n,r){return e=zt(7,e,r,t),e.lanes=n,e}function xi(e,t,n,r){return e=zt(22,e,r,t),e.elementType=N,e.lanes=n,e.stateNode={isHidden:!1},e}function al(e,t,n){return e=zt(6,e,null,t),e.lanes=n,e}function ll(e,t,n){return t=zt(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function wp(e,t,n,r,o){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Ii(0),this.expirationTimes=Ii(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Ii(0),this.identifierPrefix=r,this.onRecoverableError=o,this.mutableSourceEagerHydrationData=null}function sl(e,t,n,r,o,a,l,u,p){return e=new wp(e,t,n,u,p),t===1?(t=1,a===!0&&(t|=8)):t=0,a=zt(3,null,null,t),e.current=a,a.stateNode=e,a.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},wa(a),e}function kp(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:we,key:r==null?null:""+r,children:e,containerInfo:t,implementation:n}}function ed(e){if(!e)return hn;e=e._reactInternals;e:{if(An(e)!==e||e.tag!==1)throw Error(c(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(ft(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(c(171))}if(e.tag===1){var n=e.type;if(ft(n))return zs(e,n,t)}return t}function td(e,t,n,r,o,a,l,u,p){return e=sl(n,r,!0,e,o,a,l,u,p),e.context=ed(null),n=e.current,r=ut(),o=Sn(n),a=Zt(r,o),a.callback=t!=null?t:null,vn(n,a,o),e.current.lanes=o,Pr(e,o,r),ht(e,r),e}function yi(e,t,n,r){var o=t.current,a=ut(),l=Sn(o);return n=ed(n),t.context===null?t.context=n:t.pendingContext=n,t=Zt(a,l),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=vn(o,t,l),e!==null&&(At(e,o,l,a),Ko(e,o,l)),l}function vi(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function nd(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function cl(e,t){nd(e,t),(e=e.alternate)&&nd(e,t)}function Sp(){return null}var rd=typeof reportError=="function"?reportError:function(e){console.error(e)};function dl(e){this._internalRoot=e}bi.prototype.render=dl.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(c(409));yi(e,t,null,null)},bi.prototype.unmount=dl.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Wn(function(){yi(null,e,null,null)}),t[Gt]=null}};function bi(e){this._internalRoot=e}bi.prototype.unstable_scheduleHydration=function(e){if(e){var t=$l();e={blockedOn:null,target:e,priority:t};for(var n=0;n<un.length&&t!==0&&t<un[n].priority;n++);un.splice(n,0,e),n===0&&Hl(e)}};function ul(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function wi(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function od(){}function Cp(e,t,n,r,o){if(o){if(typeof r=="function"){var a=r;r=function(){var w=vi(l);a.call(w)}}var l=td(t,r,e,0,null,!1,!1,"",od);return e._reactRootContainer=l,e[Gt]=l.current,Gr(e.nodeType===8?e.parentNode:e),Wn(),l}for(;o=e.lastChild;)e.removeChild(o);if(typeof r=="function"){var u=r;r=function(){var w=vi(p);u.call(w)}}var p=sl(e,0,!1,null,null,!1,!1,"",od);return e._reactRootContainer=p,e[Gt]=p.current,Gr(e.nodeType===8?e.parentNode:e),Wn(function(){yi(t,p,n,r)}),p}function ki(e,t,n,r,o){var a=n._reactRootContainer;if(a){var l=a;if(typeof o=="function"){var u=o;o=function(){var p=vi(l);u.call(p)}}yi(t,l,e,o)}else l=Cp(n,t,e,o,r);return vi(l)}Rl=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=Mr(t.pendingLanes);n!==0&&(Di(t,n|1),ht(t,Qe()),(Te&6)===0&&(kr=Qe()+500,xn()))}break;case 13:Wn(function(){var r=qt(e,1);if(r!==null){var o=ut();At(r,e,1,o)}}),cl(e,1)}},Ai=function(e){if(e.tag===13){var t=qt(e,134217728);if(t!==null){var n=ut();At(t,e,134217728,n)}cl(e,134217728)}},Ol=function(e){if(e.tag===13){var t=Sn(e),n=qt(e,t);if(n!==null){var r=ut();At(n,e,t,r)}cl(e,t)}},$l=function(){return De},Ul=function(e,t){var n=De;try{return De=e,t()}finally{De=n}},on=function(e,t,n){switch(t){case"input":if(Tn(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var o=Oo(r);if(!o)throw Error(c(90));En(r),Tn(r,o)}}}break;case"textarea":Jn(e,n);break;case"select":t=n.value,t!=null&&he(e,!!n.multiple,t,!1)}},fe=nl,Be=Wn;var jp={usingClientEntryPoint:!1,Events:[Kr,cr,Oo,ce,ie,nl]},co={findFiberByHostInstance:_n,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Np={bundleType:co.bundleType,version:co.version,rendererPackageName:co.rendererPackageName,rendererConfig:co.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:re.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Tl(e),e===null?null:e.stateNode},findFiberByHostInstance:co.findFiberByHostInstance||Sp,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__!="undefined"){var Si=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Si.isDisabled&&Si.supportsFiber)try{bo=Si.inject(Np),_t=Si}catch(e){}}return xt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=jp,xt.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!ul(t))throw Error(c(200));return kp(e,t,null,n)},xt.createRoot=function(e,t){if(!ul(e))throw Error(c(299));var n=!1,r="",o=rd;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(o=t.onRecoverableError)),t=sl(e,1,!1,null,null,n,!1,r,o),e[Gt]=t.current,Gr(e.nodeType===8?e.parentNode:e),new dl(t)},xt.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(c(188)):(e=Object.keys(e).join(","),Error(c(268,e)));return e=Tl(t),e=e===null?null:e.stateNode,e},xt.flushSync=function(e){return Wn(e)},xt.hydrate=function(e,t,n){if(!wi(t))throw Error(c(200));return ki(null,e,t,!0,n)},xt.hydrateRoot=function(e,t,n){if(!ul(e))throw Error(c(405));var r=n!=null&&n.hydratedSources||null,o=!1,a="",l=rd;if(n!=null&&(n.unstable_strictMode===!0&&(o=!0),n.identifierPrefix!==void 0&&(a=n.identifierPrefix),n.onRecoverableError!==void 0&&(l=n.onRecoverableError)),t=td(t,null,e,1,n!=null?n:null,o,!1,a,l),e[Gt]=t.current,Gr(e),r)for(e=0;e<r.length;e++)n=r[e],o=n._getVersion,o=o(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,o]:t.mutableSourceEagerHydrationData.push(n,o);return new bi(t)},xt.render=function(e,t,n){if(!wi(t))throw Error(c(200));return ki(null,e,t,!1,n)},xt.unmountComponentAtNode=function(e){if(!wi(e))throw Error(c(40));return e._reactRootContainer?(Wn(function(){ki(null,null,e,!1,function(){e._reactRootContainer=null,e[Gt]=null})}),!0):!1},xt.unstable_batchedUpdates=nl,xt.unstable_renderSubtreeIntoContainer=function(e,t,n,r){if(!wi(n))throw Error(c(200));if(e==null||e._reactInternals===void 0)throw Error(c(38));return ki(e,t,n,!1,r)},xt.version="18.3.1-next-f1338f8080-20240426",xt}var fd;function Up(){if(fd)return gl.exports;fd=1;function s(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__=="undefined"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s)}catch(d){console.error(d)}}return s(),gl.exports=$p(),gl.exports}var md;function Bp(){if(md)return Ci;md=1;var s=Up();return Ci.createRoot=s.createRoot,Ci.hydrateRoot=s.hydrateRoot,Ci}var Hp=Bp();const Vp=()=>i.jsx("footer",{className:"microsoft-footer",children:i.jsx("p",{className:"footer-text",children:"© 2025 Designetica by Cloud Experience Studio - Microsoft"})});var Sd={color:void 0,size:void 0,className:void 0,style:void 0,attr:void 0},gd=Ht.createContext&&Ht.createContext(Sd),Wp=["attr","size","title"];function Gp(s,d){if(s==null)return{};var c=Qp(s,d),x,h;if(Object.getOwnPropertySymbols){var C=Object.getOwnPropertySymbols(s);for(h=0;h<C.length;h++)x=C[h],!(d.indexOf(x)>=0)&&Object.prototype.propertyIsEnumerable.call(s,x)&&(c[x]=s[x])}return c}function Qp(s,d){if(s==null)return{};var c={};for(var x in s)if(Object.prototype.hasOwnProperty.call(s,x)){if(d.indexOf(x)>=0)continue;c[x]=s[x]}return c}function Ei(){return Ei=Object.assign?Object.assign.bind():function(s){for(var d=1;d<arguments.length;d++){var c=arguments[d];for(var x in c)Object.prototype.hasOwnProperty.call(c,x)&&(s[x]=c[x])}return s},Ei.apply(this,arguments)}function hd(s,d){var c=Object.keys(s);if(Object.getOwnPropertySymbols){var x=Object.getOwnPropertySymbols(s);d&&(x=x.filter(function(h){return Object.getOwnPropertyDescriptor(s,h).enumerable})),c.push.apply(c,x)}return c}function zi(s){for(var d=1;d<arguments.length;d++){var c=arguments[d]!=null?arguments[d]:{};d%2?hd(Object(c),!0).forEach(function(x){Yp(s,x,c[x])}):Object.getOwnPropertyDescriptors?Object.defineProperties(s,Object.getOwnPropertyDescriptors(c)):hd(Object(c)).forEach(function(x){Object.defineProperty(s,x,Object.getOwnPropertyDescriptor(c,x))})}return s}function Yp(s,d,c){return d=Kp(d),d in s?Object.defineProperty(s,d,{value:c,enumerable:!0,configurable:!0,writable:!0}):s[d]=c,s}function Kp(s){var d=qp(s,"string");return typeof d=="symbol"?d:d+""}function qp(s,d){if(typeof s!="object"||!s)return s;var c=s[Symbol.toPrimitive];if(c!==void 0){var x=c.call(s,d);if(typeof x!="object")return x;throw new TypeError("@@toPrimitive must return a primitive value.")}return(d==="string"?String:Number)(s)}function Cd(s){return s&&s.map((d,c)=>Ht.createElement(d.tag,zi({key:c},d.attr),Cd(d.child)))}function je(s){return d=>Ht.createElement(Zp,Ei({attr:zi({},s.attr)},d),Cd(s.child))}function Zp(s){var d=c=>{var{attr:x,size:h,title:C}=s,S=Gp(s,Wp),E=h||c.size||"1em",F;return c.className&&(F=c.className),s.className&&(F=(F?F+" ":"")+s.className),Ht.createElement("svg",Ei({stroke:"currentColor",fill:"currentColor",strokeWidth:"0"},c.attr,x,S,{className:F,style:zi(zi({color:s.color||c.color},c.style),s.style),height:E,width:E,xmlns:"http://www.w3.org/2000/svg"}),C&&Ht.createElement("title",null,C),s.children)};return gd!==void 0?Ht.createElement(gd.Consumer,null,c=>d(c)):d(Sd)}function xd(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"circle",attr:{cx:"12",cy:"12",r:"10"},child:[]},{tag:"line",attr:{x1:"12",y1:"8",x2:"12",y2:"12"},child:[]},{tag:"line",attr:{x1:"12",y1:"16",x2:"12.01",y2:"16"},child:[]}]})(s)}function Bt(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"polyline",attr:{points:"20 6 9 17 4 12"},child:[]}]})(s)}function Xp(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"polyline",attr:{points:"15 18 9 12 15 6"},child:[]}]})(s)}function Jp(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"polyline",attr:{points:"9 18 15 12 9 6"},child:[]}]})(s)}function ef(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"circle",attr:{cx:"12",cy:"12",r:"10"},child:[]},{tag:"polyline",attr:{points:"12 6 12 12 16 14"},child:[]}]})(s)}function jd(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"polyline",attr:{points:"16 18 22 12 16 6"},child:[]},{tag:"polyline",attr:{points:"8 6 2 12 8 18"},child:[]}]})(s)}function Nd(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"rect",attr:{x:"9",y:"9",width:"13",height:"13",rx:"2",ry:"2"},child:[]},{tag:"path",attr:{d:"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"},child:[]}]})(s)}function mo(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"rect",attr:{x:"4",y:"4",width:"16",height:"16",rx:"2",ry:"2"},child:[]},{tag:"rect",attr:{x:"9",y:"9",width:"6",height:"6"},child:[]},{tag:"line",attr:{x1:"9",y1:"1",x2:"9",y2:"4"},child:[]},{tag:"line",attr:{x1:"15",y1:"1",x2:"15",y2:"4"},child:[]},{tag:"line",attr:{x1:"9",y1:"20",x2:"9",y2:"23"},child:[]},{tag:"line",attr:{x1:"15",y1:"20",x2:"15",y2:"23"},child:[]},{tag:"line",attr:{x1:"20",y1:"9",x2:"23",y2:"9"},child:[]},{tag:"line",attr:{x1:"20",y1:"14",x2:"23",y2:"14"},child:[]},{tag:"line",attr:{x1:"1",y1:"9",x2:"4",y2:"9"},child:[]},{tag:"line",attr:{x1:"1",y1:"14",x2:"4",y2:"14"},child:[]}]})(s)}function go(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"path",attr:{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"},child:[]},{tag:"polyline",attr:{points:"7 10 12 15 17 10"},child:[]},{tag:"line",attr:{x1:"12",y1:"15",x2:"12",y2:"3"},child:[]}]})(s)}function tf(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"path",attr:{d:"M12 20h9"},child:[]},{tag:"path",attr:{d:"M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"},child:[]}]})(s)}function nf(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"path",attr:{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"},child:[]},{tag:"polyline",attr:{points:"15 3 21 3 21 9"},child:[]},{tag:"line",attr:{x1:"10",y1:"14",x2:"21",y2:"3"},child:[]}]})(s)}function Ed(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"path",attr:{d:"M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"},child:[]},{tag:"path",attr:{d:"M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"},child:[]},{tag:"path",attr:{d:"M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"},child:[]},{tag:"path",attr:{d:"M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"},child:[]},{tag:"path",attr:{d:"M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"},child:[]}]})(s)}function zd(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"path",attr:{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"},child:[]},{tag:"polyline",attr:{points:"14 2 14 8 20 8"},child:[]},{tag:"line",attr:{x1:"16",y1:"13",x2:"8",y2:"13"},child:[]},{tag:"line",attr:{x1:"16",y1:"17",x2:"8",y2:"17"},child:[]},{tag:"polyline",attr:{points:"10 9 9 9 8 9"},child:[]}]})(s)}function yd(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"path",attr:{d:"M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"},child:[]}]})(s)}function vd(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"path",attr:{d:"M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"},child:[]}]})(s)}function Zn(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"rect",attr:{x:"3",y:"3",width:"18",height:"18",rx:"2",ry:"2"},child:[]},{tag:"circle",attr:{cx:"8.5",cy:"8.5",r:"1.5"},child:[]},{tag:"polyline",attr:{points:"21 15 16 10 5 21"},child:[]}]})(s)}function rf(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"polygon",attr:{points:"12 2 2 7 12 12 22 7 12 2"},child:[]},{tag:"polyline",attr:{points:"2 17 12 22 22 17"},child:[]},{tag:"polyline",attr:{points:"2 12 12 17 22 12"},child:[]}]})(s)}function Sl(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"path",attr:{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"},child:[]},{tag:"path",attr:{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"},child:[]}]})(s)}function Li(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"line",attr:{x1:"12",y1:"2",x2:"12",y2:"6"},child:[]},{tag:"line",attr:{x1:"12",y1:"18",x2:"12",y2:"22"},child:[]},{tag:"line",attr:{x1:"4.93",y1:"4.93",x2:"7.76",y2:"7.76"},child:[]},{tag:"line",attr:{x1:"16.24",y1:"16.24",x2:"19.07",y2:"19.07"},child:[]},{tag:"line",attr:{x1:"2",y1:"12",x2:"6",y2:"12"},child:[]},{tag:"line",attr:{x1:"18",y1:"12",x2:"22",y2:"12"},child:[]},{tag:"line",attr:{x1:"4.93",y1:"19.07",x2:"7.76",y2:"16.24"},child:[]},{tag:"line",attr:{x1:"16.24",y1:"7.76",x2:"19.07",y2:"4.93"},child:[]}]})(s)}function of(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"path",attr:{d:"M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"},child:[]}]})(s)}function af(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"path",attr:{d:"M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"},child:[]}]})(s)}function yl(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"rect",attr:{x:"2",y:"3",width:"20",height:"14",rx:"2",ry:"2"},child:[]},{tag:"line",attr:{x1:"8",y1:"21",x2:"16",y2:"21"},child:[]},{tag:"line",attr:{x1:"12",y1:"17",x2:"12",y2:"21"},child:[]}]})(s)}function lf(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"polygon",attr:{points:"5 3 19 12 5 21 5 3"},child:[]}]})(s)}function sf(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"line",attr:{x1:"12",y1:"5",x2:"12",y2:"19"},child:[]},{tag:"line",attr:{x1:"5",y1:"12",x2:"19",y2:"12"},child:[]}]})(s)}function vl(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"polyline",attr:{points:"23 4 23 10 17 10"},child:[]},{tag:"polyline",attr:{points:"1 20 1 14 7 14"},child:[]},{tag:"path",attr:{d:"M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"},child:[]}]})(s)}function Ld(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"path",attr:{d:"M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"},child:[]},{tag:"polyline",attr:{points:"17 21 17 13 7 13 7 21"},child:[]},{tag:"polyline",attr:{points:"7 3 7 8 15 8"},child:[]}]})(s)}function Cl(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"line",attr:{x1:"22",y1:"2",x2:"11",y2:"13"},child:[]},{tag:"polygon",attr:{points:"22 2 15 22 11 13 2 9 22 2"},child:[]}]})(s)}function cf(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"circle",attr:{cx:"18",cy:"5",r:"3"},child:[]},{tag:"circle",attr:{cx:"6",cy:"12",r:"3"},child:[]},{tag:"circle",attr:{cx:"18",cy:"19",r:"3"},child:[]},{tag:"line",attr:{x1:"8.59",y1:"13.51",x2:"15.42",y2:"17.49"},child:[]},{tag:"line",attr:{x1:"15.41",y1:"6.51",x2:"8.59",y2:"10.49"},child:[]}]})(s)}function Td(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"circle",attr:{cx:"12",cy:"12",r:"10"},child:[]},{tag:"rect",attr:{x:"9",y:"9",width:"6",height:"6"},child:[]}]})(s)}function df(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"path",attr:{d:"M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"},child:[]},{tag:"line",attr:{x1:"7",y1:"7",x2:"7.01",y2:"7"},child:[]}]})(s)}function uf(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"polyline",attr:{points:"3 6 5 6 21 6"},child:[]},{tag:"path",attr:{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"},child:[]},{tag:"line",attr:{x1:"10",y1:"11",x2:"10",y2:"17"},child:[]},{tag:"line",attr:{x1:"14",y1:"11",x2:"14",y2:"17"},child:[]}]})(s)}function ho(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"path",attr:{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"},child:[]},{tag:"polyline",attr:{points:"17 8 12 3 7 8"},child:[]},{tag:"line",attr:{x1:"12",y1:"3",x2:"12",y2:"15"},child:[]}]})(s)}function pf(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"path",attr:{d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"},child:[]},{tag:"circle",attr:{cx:"12",cy:"7",r:"4"},child:[]}]})(s)}function tn(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"line",attr:{x1:"18",y1:"6",x2:"6",y2:"18"},child:[]},{tag:"line",attr:{x1:"6",y1:"6",x2:"18",y2:"18"},child:[]}]})(s)}function El(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"polygon",attr:{points:"13 2 3 14 12 14 11 22 21 10 12 10 13 2"},child:[]}]})(s)}const Md=({onImageUpload:s,onAnalyzeImage:d,isAnalyzing:c=!1,className:x=""})=>{const[h,C]=g.useState(!1),[S,E]=g.useState(null),[F,T]=g.useState(""),H=g.useCallback(ae=>{ae.preventDefault(),C(!0)},[]),P=g.useCallback(ae=>{ae.preventDefault(),C(!1)},[]),U=g.useCallback(ae=>{ae.preventDefault(),C(!1);const ne=Array.from(ae.dataTransfer.files).find(re=>re.type.startsWith("image/"));ne&&pe(ne)},[]),Z=g.useCallback(ae=>{var ne;const le=(ne=ae.target.files)==null?void 0:ne[0];le&&le.type.startsWith("image/")&&pe(le)},[]),pe=g.useCallback(ae=>{const le=new FileReader;le.onload=ne=>{var be;const re=(be=ne.target)==null?void 0:be.result;E(re),T(ae.name),s(ae)},le.readAsDataURL(ae)},[s]),k=g.useCallback(()=>{S&&F&&d&&d(S,F)},[S,F,d]),G=g.useCallback(()=>{E(null),T("")},[]);return S?i.jsxs("div",{className:`image-preview-zone ${x}`,children:[i.jsxs("div",{className:"preview-header",children:[i.jsxs("span",{className:"preview-title",children:[i.jsx(Zn,{}),F]}),i.jsx("button",{className:"clear-btn",onClick:G,"aria-label":"Clear image",children:i.jsx(tn,{})})]}),i.jsx("div",{className:"preview-image-container",children:i.jsx("img",{src:S,alt:"Upload preview",className:"preview-image"})}),i.jsx("div",{className:"preview-actions",children:i.jsx("button",{className:"analyze-btn primary",onClick:k,disabled:c,"aria-label":"Analyze image and generate wireframe",children:c?i.jsxs(i.Fragment,{children:[i.jsx(Li,{className:"spinning"}),"Analyzing..."]}):i.jsxs(i.Fragment,{children:[i.jsx(ho,{}),"Generate Wireframe"]})})})]}):i.jsx("div",{className:`image-upload-zone ${h?"drag-over":""} ${x}`,onDragOver:H,onDragLeave:P,onDrop:U,children:i.jsxs("div",{className:"upload-content",children:[i.jsx(Zn,{className:"upload-icon"}),i.jsx("h3",{children:"Drop UI image here"}),i.jsx("p",{children:"Upload a screenshot, mockup, or sketch to generate a wireframe"}),i.jsxs("label",{className:"upload-btn",children:[i.jsx(ho,{}),"Choose Image",i.jsx("input",{type:"file",accept:"image/*",onChange:Z,className:"hidden-input"})]}),i.jsx("div",{className:"supported-formats",children:i.jsx("small",{children:"Supports PNG, JPG, WebP, SVG"})})]})})},ff=({onDemoGenerate:s,isGenerating:d=!1})=>{const[c,x]=g.useState(null),h=[{id:"microsoft-learn",name:"Microsoft Learn Course Page",path:"/Hero300.png",description:"Microsoft Learn course page with navigation, hero section, and course cards using our actual template",wireframeType:"microsoft-learn"},{id:"microsoft-docs",name:"Microsoft Documentation Page",path:"/azure.png",description:"Microsoft documentation page with sidebar, breadcrumbs, and content sections",wireframeType:"microsoft-docs"},{id:"dashboard",name:"Admin Dashboard",path:"/windowsLogo.png",description:"Modern dashboard with charts, widgets, and data visualization",wireframeType:"dashboard"},{id:"ecommerce",name:"E-commerce Product Page",path:"/module.png",description:"Product page with images, details, and purchase options",wireframeType:"ecommerce"}],C=S=>{x(S.id);let E="";S.id==="microsoft-learn"?E="Microsoft Learn course page":S.id==="microsoft-docs"?E="Microsoft documentation page":E=S.name,s(S.path,E)};return i.jsxs("div",{className:"demo-image-selector",children:[i.jsxs("div",{className:"demo-header",children:[i.jsxs("h3",{children:[i.jsx(El,{className:"demo-icon"}),"Quick Demo Wireframes"]}),i.jsx("p",{children:"Generate wireframes instantly from common UI patterns"})]}),i.jsx("div",{className:"demo-grid",children:h.map(S=>i.jsxs("div",{className:`demo-card ${c===S.id?"selected":""} ${d&&c===S.id?"generating":""}`,onClick:()=>!d&&C(S),children:[i.jsxs("div",{className:"demo-image-container",children:[i.jsx("img",{src:S.path,alt:S.name,className:"demo-image",onError:E=>{E.target.style.display="none"}}),i.jsx(Zn,{className:"demo-fallback-icon"})]}),i.jsxs("div",{className:"demo-info",children:[i.jsx("h4",{className:"demo-name",children:S.name}),i.jsx("p",{className:"demo-description",children:S.description})]}),i.jsx("div",{className:"demo-action",children:d&&c===S.id?i.jsxs("span",{className:"generating-text",children:[i.jsx("div",{className:"spinner"}),"Generating..."]}):i.jsxs("button",{className:"demo-btn",children:[i.jsx(lf,{}),"Generate"]})})]},S.id))}),i.jsx("div",{className:"demo-note",children:i.jsx("p",{children:"💡 These are pre-configured wireframes for quick demonstrations. Each generates a different layout type with Microsoft's #E9ECEF hero styling."})})]})},mf=({isOpen:s,onClose:d,onImageUpload:c,onAnalyzeImage:x,onDemoGenerate:h,isAnalyzing:C=!1})=>{const[S,E]=g.useState("upload");return s?i.jsx("div",{className:"image-upload-modal-overlay",onClick:d,children:i.jsxs("div",{className:"image-upload-modal",onClick:F=>F.stopPropagation(),children:[i.jsxs("div",{className:"modal-header",children:[i.jsx("h2",{children:"Image to Wireframe"}),i.jsx("button",{className:"close-btn",onClick:d,title:"Close modal",children:i.jsx(tn,{})})]}),i.jsxs("div",{className:"modal-tabs",children:[i.jsxs("button",{className:`tab-btn ${S==="upload"?"active":""}`,onClick:()=>E("upload"),children:[i.jsx(Zn,{}),"Upload Image"]}),i.jsxs("button",{className:`tab-btn ${S==="demo"?"active":""}`,onClick:()=>E("demo"),children:[i.jsx(El,{}),"Try Demo Examples"]})]}),i.jsx("div",{className:"modal-content",children:S==="upload"?i.jsxs("div",{className:"upload-tab",children:[i.jsx("p",{className:"tab-description",children:"Upload an image of a UI design, wireframe, or website screenshot to generate a wireframe based on its layout."}),i.jsx(Md,{onImageUpload:c,onAnalyzeImage:x,isAnalyzing:C,className:"modal-upload-zone"})]}):i.jsxs("div",{className:"demo-tab",children:[i.jsx("p",{className:"tab-description",children:"Try these instant examples to see how images are converted to wireframes."}),i.jsx(ff,{onDemoGenerate:h,isGenerating:C})]})})]})}):null};class gf{constructor(){uo(this,"accessToken","");uo(this,"baseUrl","https://api.figma.com/v1")}setAccessToken(d){this.accessToken=d}makeRequest(d){return ze(this,null,function*(){if(!this.accessToken)throw new Error("Figma access token not set. Please authenticate first.");const c=yield fetch(`${this.baseUrl}${d}`,{headers:{"X-Figma-Token":this.accessToken,"Content-Type":"application/json"}});if(!c.ok)throw c.status===401?new Error("Invalid Figma access token. Please check your credentials."):c.status===403?new Error("Access denied. Please check file permissions in Figma."):c.status===404?new Error("Figma file not found. Please check the file URL or ID."):new Error(`Figma API error: ${c.status} ${c.statusText}`);return c.json()})}getTeamProjects(d){return ze(this,null,function*(){return this.makeRequest(`/teams/${d}/projects`)})}getProjectFiles(d){return ze(this,null,function*(){return this.makeRequest(`/projects/${d}/files`)})}getFile(d){return ze(this,null,function*(){const c=yield this.makeRequest(`/files/${d}`);return{document:c.document,components:c.components||{},styles:c.styles||{},name:c.name,lastModified:c.lastModified,thumbnailUrl:c.thumbnailUrl||"",version:c.version}})}getFileImages(d,c){return ze(this,null,function*(){const x=c.join(",");return(yield this.makeRequest(`/images/${d}?ids=${x}&format=png&scale=2`)).images||{}})}extractFrames(d){const c=[],x=h=>{(h.type==="FRAME"||h.type==="COMPONENT")&&c.push({id:h.id,name:h.name,type:h.type,children:h.children,absoluteBoundingBox:h.absoluteBoundingBox,fills:h.fills,strokes:h.strokes,strokeWeight:h.strokeWeight,cornerRadius:h.cornerRadius}),h.children&&h.children.forEach(x)};return d.children.forEach(x),c}convertFramesToWireframe(d,c){return ze(this,null,function*(){try{const x=d.map(S=>S.id),h=yield this.getFileImages(c,x);let C=`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Figma Import - Wireframe</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f5f5f5;
            padding: 20px;
        }
        .figma-import-container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .figma-header {
            background: #1e1e1e;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .figma-frames {
            padding: 20px;
            display: grid;
            gap: 20px;
        }
        .figma-frame {
            border: 1px solid #e1e1e1;
            border-radius: 8px;
            overflow: hidden;
            background: white;
        }
        .frame-header {
            background: #f8f9fa;
            padding: 12px 16px;
            border-bottom: 1px solid #e1e1e1;
            font-weight: 600;
            color: #333;
        }
        .frame-content {
            padding: 16px;
            min-height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
        .frame-image {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .frame-placeholder {
            background: #f1f3f4;
            border: 2px dashed #dadce0;
            border-radius: 8px;
            padding: 40px;
            text-align: center;
            color: #5f6368;
        }
        .frame-info {
            position: absolute;
            top: 8px;
            right: 8px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="figma-import-container">
        <div class="figma-header">
            <h1>🎨 Imported from Figma</h1>
            <p>Wireframe generated from Figma frames</p>
        </div>
        <div class="figma-frames">
`;return d.forEach((S,E)=>{const F=h[S.id],T=S.absoluteBoundingBox;C+=`
            <div class="figma-frame">
                <div class="frame-header">
                    ${S.name||`Frame ${E+1}`}
                </div>
                <div class="frame-content">
                    ${F?`<img src="${F}" alt="${S.name}" class="frame-image" />`:`<div class="frame-placeholder">
                         <p>Frame: ${S.name}</p>
                         <p>Type: ${S.type}</p>
                         ${T?`<p>Size: ${Math.round(T.width)} × ${Math.round(T.height)}</p>`:""}
                       </div>`}
                    ${T?`<div class="frame-info">${Math.round(T.width)} × ${Math.round(T.height)}</div>`:""}
                </div>
            </div>
        `}),C+=`
        </div>
    </div>
</body>
</html>
`,C}catch(x){throw console.error("Error converting frames to wireframe:",x),new Error("Failed to convert Figma frames to wireframe")}})}parseFileUrl(d){const c=d.match(/figma\.com\/file\/([a-zA-Z0-9]+)/);return c?c[1]:null}validateToken(){return ze(this,null,function*(){try{return yield this.makeRequest("/me"),!0}catch(d){return!1}})}}const Kn=new gf,Pd=({isOpen:s,onClose:d,onImport:c,onExport:x})=>{const[h,C]=g.useState("import"),[S,E]=g.useState(!1),[F,T]=g.useState(""),[H,P]=g.useState(""),[U,Z]=g.useState(!1),[pe,k]=g.useState(null),[G,ae]=g.useState(null),[le,ne]=g.useState([]),[re,be]=g.useState([]),[we,ge]=g.useState("figma-file");g.useEffect(()=>{if(pe||G){const y=setTimeout(()=>{k(null),ae(null)},5e3);return()=>clearTimeout(y)}},[pe,G]);const ke=g.useCallback(()=>ze(null,null,function*(){if(!F.trim()){k("Please enter your Figma access token");return}Z(!0),k(null);try{yield new Promise(y=>setTimeout(y,1500)),F.toLowerCase().includes("figd_")||F.length>10?(Kn.setAccessToken(F),E(!0),ae("Successfully connected to Figma!"),window.open("https://www.figma.com/","_blank")):k('Please enter a valid Figma access token starting with "figd_"')}catch(y){k(y instanceof Error?y.message:"Failed to connect to Figma")}finally{Z(!1)}}),[F]),Se=g.useCallback(()=>ze(null,null,function*(){if(!H.trim()){k("Please enter a Figma file URL");return}Z(!0),k(null),ne([]);try{const y=Kn.parseFileUrl(H);if(!y){k("Invalid Figma URL. Please use a valid Figma file URL.");return}const D=yield Kn.getFile(y),B=Kn.extractFrames(D.document);ne(B),ae(`Loaded ${B.length} frames from Figma file`)}catch(y){k(y instanceof Error?y.message:"Failed to load Figma file")}finally{Z(!1)}}),[H]),Fe=g.useCallback(y=>{be(D=>D.includes(y)?D.filter(B=>B!==y):[...D,y])},[]),Ie=g.useCallback(()=>ze(null,null,function*(){if(re.length===0){k("Please select at least one frame to import");return}Z(!0),k(null);try{const y=Kn.parseFileUrl(H);if(!y){k("Invalid Figma URL");return}const D=le.filter(N=>re.includes(N.id)),B=yield Kn.convertFramesToWireframe(D,y);c(B,"Figma Import"),ae("Successfully imported frames as wireframe!"),d()}catch(y){k(y instanceof Error?y.message:"Failed to import frames")}finally{Z(!1)}}),[re,le,H,c,d]),z=g.useCallback(()=>{x(we),ae("Export initiated! Check your Figma workspace."),d()},[we,x,d]),R=g.useCallback(()=>{E(!1),T(""),ne([]),be([]),P(""),Kn.setAccessToken(""),ae("Disconnected from Figma")},[]);return s?i.jsx("div",{className:"figma-modal-overlay",children:i.jsxs("div",{className:"figma-modal",children:[i.jsxs("div",{className:"figma-modal-header",children:[i.jsxs("div",{className:"figma-modal-title",children:[i.jsx(Sl,{className:"figma-icon"}),i.jsx("h2",{children:"Figma Integration"})]}),i.jsx("button",{className:"figma-modal-close",onClick:d,"aria-label":"Close Figma integration modal",children:i.jsx(tn,{})})]}),pe&&i.jsxs("div",{className:"figma-message figma-error",children:[i.jsx(xd,{}),i.jsx("span",{children:pe})]}),G&&i.jsxs("div",{className:"figma-message figma-success",children:[i.jsx(Bt,{}),i.jsx("span",{children:G})]}),i.jsx("div",{className:`figma-connection-status ${S?"connected":"disconnected"}`,children:S?i.jsxs(i.Fragment,{children:[i.jsx(Bt,{className:"status-icon"}),i.jsx("span",{children:"Connected to Figma"}),i.jsx("button",{className:"disconnect-btn",onClick:R,children:"Disconnect"})]}):i.jsxs(i.Fragment,{children:[i.jsx(xd,{className:"status-icon"}),i.jsx("span",{children:"Not connected to Figma"})]})}),i.jsxs("div",{className:"figma-tabs",children:[i.jsxs("button",{className:`figma-tab ${h==="import"?"active":""}`,onClick:()=>C("import"),children:[i.jsx(ho,{}),"Import from Figma"]}),i.jsxs("button",{className:`figma-tab ${h==="export"?"active":""}`,onClick:()=>C("export"),children:[i.jsx(go,{}),"Export to Figma"]})]}),i.jsxs("div",{className:"figma-modal-content",children:[h==="import"&&i.jsx("div",{className:"figma-tab-content",children:S?i.jsxs("div",{className:"figma-import-section",children:[i.jsxs("div",{className:"figma-input-group",children:[i.jsx("label",{htmlFor:"figma-url",children:"Figma File URL"}),i.jsx("input",{id:"figma-url",type:"url",placeholder:"https://www.figma.com/file/...",value:H,onChange:y=>P(y.target.value),className:"figma-input"})]}),i.jsxs("button",{className:"figma-btn figma-btn-secondary",onClick:Se,disabled:U||!H.trim(),children:[U?i.jsx(vl,{className:"spinning"}):i.jsx(rf,{}),U?"Loading...":"Load Frames"]}),le.length>0&&i.jsxs("div",{className:"figma-frames-section",children:[i.jsxs("h4",{children:["Select Frames to Import (",le.length," available)"]}),i.jsx("div",{className:"figma-frames-grid",children:le.map(y=>i.jsxs("div",{className:`figma-frame-card ${re.includes(y.id)?"selected":""}`,onClick:()=>Fe(y.id),children:[i.jsx("div",{className:"frame-preview",children:i.jsx(zd,{size:24})}),i.jsxs("div",{className:"frame-info",children:[i.jsx("h5",{children:y.name}),i.jsx("span",{className:"frame-type",children:y.type}),y.absoluteBoundingBox&&i.jsxs("span",{className:"frame-size",children:[Math.round(y.absoluteBoundingBox.width)," × ",Math.round(y.absoluteBoundingBox.height)]})]}),re.includes(y.id)&&i.jsx("div",{className:"frame-selected-indicator",children:i.jsx(Bt,{})})]},y.id))}),i.jsxs("div",{className:"figma-actions",children:[i.jsx("button",{className:"figma-btn figma-btn-outline",onClick:()=>be(le.map(y=>y.id)),children:"Select All"}),i.jsx("button",{className:"figma-btn figma-btn-outline",onClick:()=>be([]),children:"Clear Selection"}),i.jsxs("button",{className:"figma-btn figma-btn-primary",onClick:Ie,disabled:U||re.length===0,children:[U?i.jsx(vl,{className:"spinning"}):i.jsx(ho,{}),"Import Selected (",re.length,")"]})]})]})]}):i.jsxs("div",{className:"figma-auth-section",children:[i.jsx("h3",{children:"Connect to Figma"}),i.jsx("p",{children:"Enter your Figma access token to get started."}),i.jsxs("div",{className:"figma-input-group",children:[i.jsx("label",{htmlFor:"figma-token",children:"Figma Access Token"}),i.jsx("input",{id:"figma-token",type:"password",placeholder:"figd_...",value:F,onChange:y=>T(y.target.value),className:"figma-input"}),i.jsx("small",{children:i.jsxs("a",{href:"https://www.figma.com/developers/api#access-tokens",target:"_blank",rel:"noopener noreferrer",className:"figma-link",children:[i.jsx(nf,{}),"How to get your access token"]})})]}),i.jsxs("button",{className:"figma-btn figma-btn-primary",onClick:ke,disabled:U||!F.trim(),children:[U?i.jsx(vl,{className:"spinning"}):i.jsx(Sl,{}),U?"Connecting...":"Connect to Figma"]})]})}),h==="export"&&i.jsx("div",{className:"figma-tab-content",children:i.jsxs("div",{className:"figma-export-section",children:[i.jsx("h3",{children:"Export to Figma"}),i.jsx("p",{children:"Export your current wireframe to Figma."}),i.jsxs("div",{className:"figma-input-group",children:[i.jsx("label",{children:"Export Format"}),i.jsxs("div",{className:"figma-radio-group",children:[i.jsxs("label",{className:"figma-radio-label",children:[i.jsx("input",{type:"radio",name:"exportFormat",value:"figma-file",checked:we==="figma-file",onChange:y=>ge(y.target.value)}),i.jsx("span",{children:"Complete Figma File"})]}),i.jsxs("label",{className:"figma-radio-label",children:[i.jsx("input",{type:"radio",name:"exportFormat",value:"figma-components",checked:we==="figma-components",onChange:y=>ge(y.target.value)}),i.jsx("span",{children:"Component Library"})]})]})]}),i.jsxs("button",{className:"figma-btn figma-btn-primary",onClick:z,disabled:U,children:[i.jsx(go,{}),"Export to Figma"]})]})})]})]})}):null},hf=({error:s,savedWireframesCount:d,onLoadClick:c,description:x,onDescriptionChange:h,onSubmit:C,loading:S,handleStop:E,showAiSuggestions:F,aiSuggestions:T,suggestionLoading:H,onAiSuggestionClick:P,onGenerateAiSuggestions:U,onImageUpload:Z,onAnalyzeImage:pe,isAnalyzingImage:k=!1,onFigmaImport:G,onFigmaExport:ae,onDemoGenerate:le})=>{const ne=g.useRef(null),[re,be]=g.useState(!1),[we,ge]=g.useState(!1),[ke,Se]=g.useState(!1),Fe=g.useRef(null);g.useEffect(()=>{ne.current&&ne.current.focus()},[]),g.useEffect(()=>(U&&x.length>0&&(Fe.current&&window.clearTimeout(Fe.current),Fe.current=window.setTimeout(()=>{U(x)},300)),()=>{Fe.current&&window.clearTimeout(Fe.current)}),[x,U]);const Ie=()=>{be(y=>!y)},z=(y,D)=>{G&&G(y,D),ge(!1)},R=y=>{ae&&ae(y),ge(!1)};return i.jsxs("div",{className:"landing-page",children:[i.jsx("div",{className:"landing-container",children:i.jsxs("div",{className:"landing-content",children:[i.jsx("h1",{className:"main-heading",children:"What will you design today?"}),i.jsx("p",{className:"main-subtitle",children:"Sketch your vision, ship your wireframe - Designetica AI does the heavy lifting."}),s&&i.jsx("div",{className:"error error-center",children:s}),d>0&&i.jsx("div",{className:"action-buttons-center",children:i.jsxs("button",{type:"button",onClick:c,className:"secondary-btn-center",children:[i.jsx(yd,{})," Load Previous Work"]})}),i.jsx("form",{onSubmit:C,className:"main-form",children:i.jsxs("div",{className:"input-container",children:[i.jsxs("div",{className:"textarea-container",children:[i.jsx("textarea",{ref:ne,value:x,onChange:h,onKeyDown:y=>{y.key==="Enter"&&!y.shiftKey&&(y.preventDefault(),x.trim()&&!S&&C(y))},placeholder:"How can Designetica help you today? (e.g., 'Create a Microsoft Learn certification dashboard with Azure exam tracking and study progress')",rows:4,required:!0,className:"app-textarea main-input"}),i.jsx("button",{type:"submit",disabled:S||!x.trim(),className:"send-btn",title:S?"Generating...":"Generate Wireframe",children:S?i.jsx(Li,{className:"loading-spinner"}):i.jsx(Cl,{className:"send-icon"})}),S&&i.jsx("button",{type:"button",className:`stop-btn ${S?"generating":""}`,onClick:E,title:"Stop wireframe generation",children:i.jsx(Td,{})})]}),F&&T.length>0&&i.jsxs("div",{className:"ai-suggestions-inline ai-suggestions-dynamic",children:[i.jsxs("div",{className:"ai-suggestions-label",children:[i.jsx(mo,{className:"ai-icon"}),i.jsx("span",{children:"AI Suggestions:"}),H&&i.jsx("span",{className:"loading-dot",children:"●"})]}),i.jsx("div",{className:"ai-suggestions-buttons",children:T.map((y,D)=>i.jsxs("button",{type:"button",className:"ai-suggestion-pill ai-suggestion-button",onClick:()=>{P(y)},children:[i.jsx("span",{className:"ai-badge",children:"AI"}),y]},D))})]}),i.jsxs("div",{className:"integration-pills-container",children:[i.jsxs("button",{type:"button",className:"integration-pill figma-pill",onClick:()=>{console.log("🔗 Figma pill clicked on landing page!"),ge(!0)},title:"Import designs from Figma",children:[i.jsx(Ed,{className:"pill-icon"}),i.jsx("span",{children:"Import from Figma"})]}),i.jsxs("button",{type:"button",className:"integration-pill image-pill",onClick:Ie,title:"Upload UI image to analyze",children:[i.jsx(Zn,{className:"pill-icon"}),i.jsx("span",{children:"Upload Image"})]}),i.jsxs("button",{type:"button",className:"integration-pill github-pill",onClick:()=>{console.log("🔗 GitHub pill clicked on landing page!"),Se(!0)},title:"Connect to GitHub repository",children:[i.jsx(vd,{className:"pill-icon"}),i.jsx("span",{children:"Connect GitHub"})]})]})]})}),re&&Z&&pe&&le&&i.jsx(mf,{isOpen:re,onClose:()=>be(!1),onImageUpload:Z,onAnalyzeImage:pe,onDemoGenerate:le,isAnalyzing:k})]})}),i.jsx(Pd,{isOpen:we,onClose:()=>ge(!1),onImport:z,onExport:R}),ke&&i.jsx("div",{className:"modal-overlay",onClick:()=>Se(!1),children:i.jsxs("div",{className:"modal-content github-modal",onClick:y=>y.stopPropagation(),children:[i.jsxs("div",{className:"modal-header",children:[i.jsx("h2",{children:"🚀 Connect to GitHub"}),i.jsx("button",{className:"modal-close-btn",onClick:()=>Se(!1),children:"×"})]}),i.jsxs("div",{className:"modal-body",children:[i.jsxs("div",{className:"github-benefits",children:[i.jsxs("div",{className:"benefit-item",children:[i.jsx(El,{className:"benefit-icon"}),i.jsxs("div",{children:[i.jsx("h4",{children:"Import Repositories"}),i.jsx("p",{children:"Import existing projects and wireframes from your GitHub repositories"})]})]}),i.jsxs("div",{className:"benefit-item",children:[i.jsx(yd,{className:"benefit-icon"}),i.jsxs("div",{children:[i.jsx("h4",{children:"Save Wireframes"}),i.jsx("p",{children:"Automatically save your wireframes to GitHub for version control"})]})]}),i.jsxs("div",{className:"benefit-item",children:[i.jsx(Sl,{className:"benefit-icon"}),i.jsxs("div",{children:[i.jsx("h4",{children:"Team Collaboration"}),i.jsx("p",{children:"Share wireframes with your team through GitHub integration"})]})]})]}),i.jsxs("div",{className:"modal-actions",children:[i.jsxs("button",{className:"btn-primary github-connect-btn",children:[i.jsx(vd,{}),"Connect with GitHub"]}),i.jsx("button",{className:"btn-secondary",onClick:()=>Se(!1),children:"Maybe Later"})]})]})]})}),i.jsx(Vp,{})]})},xf=({isAI:s,isLoading:d})=>d?i.jsx("span",{className:"suggestion-source-indicator loading",children:i.jsx("span",{className:"loading-dots",children:"..."})}):i.jsx("span",{className:`suggestion-source-indicator ${s?"ai":"local"}`,children:"AI"}),yf=({isVisible:s,message:d="Loading...",progress:c})=>s?i.jsxs("div",{className:`loading-overlay ${s?"visible":""}`,children:[i.jsx("div",{className:"loading-spinner",children:i.jsx("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:i.jsx("path",{d:"M21 12a9 9 0 1 1-6.219-8.56"})})}),i.jsx("div",{className:"loading-message",children:d}),c!==void 0&&i.jsxs("div",{className:"loading-progress-container",children:[i.jsx("div",{className:"loading-progress-bar",children:i.jsx("div",{className:"loading-progress-fill",style:{"--progress":`${Math.max(0,Math.min(100,c))}%`}})}),i.jsxs("div",{className:"loading-progress-text",children:[Math.round(c),"%"]})]})]}):null;function Fd(s){return je({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"path",attr:{d:"M8 8h8v8h-8z"},child:[]},{tag:"path",attr:{d:"M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"},child:[]}]})(s)}const vf=({onFigmaIntegration:s,onSave:d,onOpenLibrary:c,onAddPages:x,onViewHtmlCode:h,onExportPowerPoint:C,onPresentationMode:S,onShareUrl:E,onImportHtml:F})=>{const[T,H]=g.useState(!1);return i.jsx("div",{className:"compact-toolbar",children:i.jsxs("div",{className:"compact-toolbar-buttons",children:[i.jsx("button",{className:"compact-btn",onClick:F,title:"Import HTML","aria-label":"Import HTML",children:i.jsx(ho,{})}),i.jsx("button",{className:"compact-btn",onClick:x,title:"Add More Pages","aria-label":"Add More Pages",children:i.jsx(sf,{})}),i.jsx("button",{className:"compact-btn",onClick:()=>{console.log("🔧 DEBUG: Fluent Component Library button clicked in CompactToolbar"),c==null||c()},title:"Open Component Library","aria-label":"Open Component Library",children:i.jsx(Fd,{})}),i.jsxs("div",{className:"compact-export-dropdown",children:[i.jsx("button",{className:"compact-btn",onClick:()=>H(!T),title:"Export Options","aria-label":"Export Options",children:i.jsx(go,{})}),T&&i.jsxs("div",{className:"compact-export-menu",children:[i.jsxs("button",{className:"compact-export-option",onClick:()=>{C==null||C(),H(!1)},title:"Export as HTML Presentation","aria-label":"Export as HTML Presentation",children:[i.jsx(yl,{}),i.jsx("span",{className:"compact-export-label",children:"HTML Presentation"})]}),i.jsxs("button",{className:"compact-export-option",onClick:()=>{s==null||s(),H(!1)},title:"Export to Figma","aria-label":"Export to Figma",children:[i.jsx(Ed,{}),i.jsx("span",{className:"compact-export-label",children:"Figma"})]}),i.jsxs("button",{className:"compact-export-option",onClick:()=>{S==null||S(),H(!1)},title:"Presentation Mode","aria-label":"Presentation Mode",children:[i.jsx(yl,{}),i.jsx("span",{className:"compact-export-label",children:"Present"})]})]})]}),i.jsx("button",{className:"compact-btn",onClick:h,title:"View HTML Code","aria-label":"View HTML Code",children:i.jsx(jd,{})}),i.jsx("button",{className:"compact-btn",onClick:E,title:"Share URL","aria-label":"Share URL",children:i.jsx(cf,{})}),i.jsx("button",{className:"compact-btn",onClick:S,title:"Presentation Mode","aria-label":"Presentation Mode",children:i.jsx(yl,{})}),i.jsx("button",{className:"compact-btn compact-btn-primary",onClick:d,title:"Save Wireframe","aria-label":"Save Wireframe",children:i.jsx(Ld,{})})]})})},bf=({isOpen:s,onClose:d,onAddPages:c,existingPages:x=[],onGeneratePageContent:h})=>{const[C,S]=g.useState(x),[E,F]=g.useState(""),[T,H]=g.useState(""),[P,U]=g.useState("page"),[Z,pe]=g.useState(!1),[k,G]=g.useState({}),[ae,le]=g.useState(""),ne="addPages_draft";g.useEffect(()=>{if(s){const N=localStorage.getItem(ne);if(N)try{const j=JSON.parse(N);F(j.name||""),H(j.description||""),U(j.type||"page")}catch(j){console.warn("Failed to load draft:",j)}}},[s]),g.useEffect(()=>{if(s&&(E||T)){const N={name:E,description:T,type:P,timestamp:Date.now()};localStorage.setItem(ne,JSON.stringify(N))}},[E,T,P,s]);const re=()=>{localStorage.removeItem(ne)},be=(N,j,K)=>{const V=`
            max-width: 1200px; margin: 0 auto; padding: 40px 20px; 
            font-family: 'Segoe UI', sans-serif; line-height: 1.6;
            background: #ffffff; min-height: 100vh;
        `,m=`
            color: #3C4858; margin: 0 0 24px 0; font-size: 28px; font-weight: 600;
        `,M=`
            background: #8E9AAF; color: white; border: none; padding: 12px 24px; 
            border-radius: 4px; cursor: pointer; font-weight: 600; margin: 8px;
            transition: background-color 0.2s ease;
        `,oe=`
            background: #f3f2f1; color: #3C4858; border: 1px solid #e1dfdd; 
            padding: 12px 24px; border-radius: 4px; cursor: pointer; margin: 8px;
            transition: background-color 0.2s ease;
        `,se=`
            background: white; border: 1px solid #e1dfdd; border-radius: 8px; 
            padding: 24px; margin: 16px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `,ye=`
            background: #E9ECEF; 
            padding: 60px 40px; border-radius: 12px; margin: 20px 0;
            text-align: center; border: 1px solid #e1dfdd;
        `;switch(K){case"modal":return`
                    <div style="${V}">
                        <div style="background: rgba(0,0,0,0.3); position: fixed; top: 80px; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; z-index: 1000;">
                            <div style="${se} max-width: 500px; position: relative; z-index: 1001;">
                                <button style="position: absolute; top: 16px; right: 16px; background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
                                <h2 style="${m} font-size: 24px;">${N}</h2>
                                <p style="color: #68769C; margin: 0 0 24px 0;">${j}</p>
                                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                                    <button style="${oe}">Cancel</button>
                                    <button style="${M}">Confirm</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;case"component":return`
                    <div style="${V}">
                        <div style="${se}">
                            <h3 style="${m} font-size: 20px; margin-bottom: 16px;">${N} Component</h3>
                            <p style="color: #68769C; margin: 0 0 20px 0;">${j}</p>
                            <div style="border: 2px dashed #e1dfdd; padding: 20px; text-align: center; border-radius: 8px;">
                                <p style="color: #a19f9d; margin: 0;">Component content goes here</p>
                                <p style="color: #a19f9d; margin: 8px 0 0 0; font-size: 14px;">Customize this ${K} based on your needs</p>
                            </div>
                        </div>
                    </div>
                `;default:const xe=j.toLowerCase().includes("form")||j.toLowerCase().includes("input"),Le=j.toLowerCase().includes("dashboard")||j.toLowerCase().includes("analytics"),Ce=j.toLowerCase().includes("list")||j.toLowerCase().includes("table");return xe?`
                        <div style="${V}">
                            <h1 style="${m}">${N}</h1>
                            <p style="color: #68769C; margin: 0 0 32px 0;">${j}</p>
                            <form style="${se}">
                                <div style="margin-bottom: 20px;">
                                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #3C4858;">Field Name</label>
                                    <input type="text" style="width: 100%; padding: 12px; border: 1px solid #e1dfdd; border-radius: 4px; font-size: 16px;" placeholder="Enter value...">
                                </div>
                                <div style="margin-bottom: 20px;">
                                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #3C4858;">Description</label>
                                    <textarea style="width: 100%; padding: 12px; border: 1px solid #e1dfdd; border-radius: 4px; font-size: 16px; min-height: 100px;" placeholder="Enter description..."></textarea>
                                </div>
                                <button type="submit" style="${M}">Submit</button>
                            </form>
                        </div>
                    `:Le?`
                        <div style="${V}">
                            <div style="${ye}">
                                <h1 style="${m} margin-bottom: 16px;">${N}</h1>
                                <p style="color: #68769C; margin: 0; font-size: 18px;">${j}</p>
                            </div>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 32px;">
                                <div style="${se}">
                                    <h3 style="margin: 0 0 12px 0; color: #3C4858; font-size: 16px;">Total Users</h3>
                                    <p style="font-size: 32px; font-weight: bold; margin: 0; color: #8E9AAF;">1,234</p>
                                    <p style="font-size: 14px; color: #107c10; margin: 8px 0 0 0;">↗ +12% vs last month</p>
                                </div>
                                <div style="${se}">
                                    <h3 style="margin: 0 0 12px 0; color: #3C4858; font-size: 16px;">Active Sessions</h3>
                                    <p style="font-size: 32px; font-weight: bold; margin: 0; color: #8E9AAF;">5,678</p>
                                    <p style="font-size: 14px; color: #107c10; margin: 8px 0 0 0;">↗ +8% vs last month</p>
                                </div>
                                <div style="${se}">
                                    <h3 style="margin: 0 0 12px 0; color: #3C4858; font-size: 16px;">Completion Rate</h3>
                                    <p style="font-size: 32px; font-weight: bold; margin: 0; color: #8E9AAF;">87%</p>
                                    <p style="font-size: 14px; color: #107c10; margin: 8px 0 0 0;">↗ +5% vs last month</p>
                                </div>
                            </div>
                            <div style="${se}">
                                <h3 style="margin: 0 0 16px 0; color: #3C4858;">Recent Activity</h3>
                                <p style="color: #68769C; margin: 0 0 20px 0;">Monitor real-time dashboard metrics and analytics.</p>
                                <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                                    <button style="${M}">View Details</button>
                                    <button style="${oe}">Export Data</button>
                                </div>
                            </div>
                        </div>
                    `:Ce?`
                        <div style="${V}">
                            <h1 style="${m}">${N}</h1>
                            <p style="color: #68769C; margin: 0 0 32px 0;">${j}</p>
                            <div style="${se}">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                                    <input type="search" style="padding: 12px; border: 1px solid #e1dfdd; border-radius: 4px; width: 300px;" placeholder="Search items...">
                                    <button style="${M}">Add New</button>
                                </div>
                                <div style="overflow-x: auto;">
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <thead>
                                            <tr style="border-bottom: 2px solid #e1dfdd;">
                                                <th style="text-align: left; padding: 12px; font-weight: 600;">Item</th>
                                                <th style="text-align: left; padding: 12px; font-weight: 600;">Status</th>
                                                <th style="text-align: left; padding: 12px; font-weight: 600;">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr style="border-bottom: 1px solid #e1dfdd;">
                                                <td style="padding: 12px;">Sample Item 1</td>
                                                <td style="padding: 12px;"><span style="background: #d4f4dd; color: #0f5132; padding: 4px 8px; border-radius: 12px; font-size: 14px;">Active</span></td>
                                                <td style="padding: 12px;"><button style="background: none; border: 1px solid #e1dfdd; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Edit</button></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    `:`
                        <div style="${V}">
                            <div style="${ye}">
                                <h1 style="${m} margin-bottom: 16px;">${N}</h1>
                                <p style="color: #68769C; margin: 0; font-size: 18px;">${j}</p>
                            </div>
                            <div style="${se}">
                                <h2 style="color: #3C4858; margin: 0 0 16px 0;">Welcome to ${N}</h2>
                                <p style="color: #68769C; line-height: 1.6;">This page is ready for your content. You can customize it by asking me to generate specific content or modify the layout.</p>
                                <div style="margin: 24px 0;">
                                    <button style="${M}">Get Started</button>
                                    <button style="${oe}">Learn More</button>
                                </div>
                            </div>
                        </div>
                    `}};g.useEffect(()=>{S(x)},[x]);const we=N=>{switch(N){case"page":return'e.g., "A user dashboard with navigation menu, statistics cards, recent activity feed, and action buttons for key features like settings and profile management"';case"modal":return'e.g., "A confirmation dialog with title, message text, cancel and confirm buttons, and a warning icon for delete operations"';case"component":return'e.g., "A reusable navigation bar with logo, menu items, search box, user avatar dropdown, and responsive mobile hamburger menu"';default:return"Describe the purpose, layout, and key elements of this page..."}},ge=()=>{const N={};return E.trim()||(N.name="Page name is required"),T.trim()?T.trim().length<10&&(N.description="Please provide a more detailed description (at least 10 characters)"):N.description="Page description is required for AI content generation",G(N),Object.keys(N).length===0},ke=()=>ze(null,null,function*(){if(ge()){pe(!0),le("Preparing content generation...");try{let N="";if(h){console.log("🤖 Starting AI content generation for:",E.trim()),le(`Generating AI content for "${E.trim()}"...`);const K=`Create a ${P} called "${E.trim()}". ${T.trim()}`;console.log("🤖 Content description:",K),N=yield h(K,P),console.log("🤖 AI content generated:",{pageType:P,pageName:E.trim(),contentLength:(N==null?void 0:N.length)||0,hasContent:!!N}),le("Content generated successfully!")}else console.warn("🤖 No AI generation callback provided"),le("Creating smart template..."),N=be(E.trim(),T.trim(),P);const j={id:`page-${Date.now()}`,name:E.trim(),description:T.trim(),type:P,htmlContent:N};S([...C,j]),F(""),H(""),U("page"),G({}),re(),console.log("📊 Page Generation Analytics:",{pageType:P,pageName:E.trim(),descriptionLength:T.trim().length,aiGenerated:!!N,contentLength:(N==null?void 0:N.length)||0,generationTime:Date.now(),hasAICallback:!!h}),c([...C,j]),d()}catch(N){console.error("Failed to generate page content:",N),G({ai:"AI content generation failed. Page will be created with basic template."});const j=`
                <div style="max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: 'Segoe UI', sans-serif; background: #ffffff; min-height: 100vh;">
                    <div style="background: linear-gradient(135deg, #fff4e6 0%, #fef3c7 100%); padding: 60px 40px; border-radius: 12px; margin: 20px 0; text-align: center; border: 1px solid #e1dfdd;">
                        <h1 style="color: #3C4858; margin: 0 0 16px 0; font-size: 28px; font-weight: 600;">📄 ${E.trim()}</h1>
                        <p style="color: #68769C; margin: 0 0 16px 0; font-size: 16px;">
                            ${T.trim()}
                        </p>
                        <p style="color: #a19f9d; margin: 0 0 24px 0; font-size: 14px;">
                            AI content generation temporarily unavailable. Ask me to "generate content for ${E.trim()}" to try again.
                        </p>
                        <button style="background: #8E9AAF; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-weight: 600; transition: background-color 0.2s ease;">
                            Generate Content
                        </button>
                    </div>
                </div>
            `,K={id:`page-${Date.now()}`,name:E.trim(),description:T.trim(),type:P,htmlContent:j};S([...C,K]),F(""),H(""),U("page"),setTimeout(()=>{G({}),c([...C,K]),d()},2e3)}finally{pe(!1),le("")}}}),Se=N=>{S(C.filter(j=>j.id!==N))},Fe=N=>{const j=_e(Ee({},N),{id:`page-${Date.now()}`,name:`${N.name} (Copy)`});S([...C,j])},Ie=()=>ze(null,null,function*(){E.trim()&&T.trim()&&!Z?yield ke():(c(C),d())}),z=new Set(x.map(N=>N.id)),R=C.filter(N=>!z.has(N.id)).length,y=E.trim()&&T.trim()&&T.trim().length>=10,D=N=>{N.key==="Enter"&&E.trim()&&ke()},B={page:"Page",modal:"Modal",component:"Component"};return s?i.jsx("div",{className:"modal-overlay",onClick:d,children:i.jsxs("div",{className:"modal-content",onClick:N=>N.stopPropagation(),children:[i.jsxs("div",{className:"modal-header",children:[i.jsx("h2",{className:"modal-title",children:"Add Pages to Wireframe"}),i.jsx("button",{className:"modal-close",onClick:d,title:"Close",children:i.jsx(tn,{})})]}),i.jsxs("div",{className:"modal-body",children:[i.jsxs("div",{className:"add-page-form",children:[i.jsx("h3",{className:"form-title",children:"Add New Page"}),i.jsxs("div",{className:"form-row",children:[i.jsxs("div",{className:"form-group",children:[i.jsx("label",{htmlFor:"pageName",children:"Page Name *"}),i.jsx("input",{id:"pageName",type:"text",value:E,onChange:N=>{F(N.target.value),k.name&&G(j=>_e(Ee({},j),{name:""}))},onKeyPress:D,placeholder:"e.g., Login Page, Dashboard, Profile",className:`form-input ${k.name?"error":""}`}),k.name&&i.jsx("span",{className:"error-message",children:k.name})]}),i.jsxs("div",{className:"form-group",children:[i.jsx("label",{htmlFor:"pageType",children:"Type"}),i.jsxs("select",{id:"pageType",value:P,onChange:N=>U(N.target.value),className:"form-select",children:[i.jsx("option",{value:"page",children:"Page"}),i.jsx("option",{value:"modal",children:"Modal"}),i.jsx("option",{value:"component",children:"Component"})]})]})]}),i.jsxs("div",{className:"form-group",children:[i.jsx("label",{htmlFor:"pageDescription",children:"Description * (Used for AI Content Generation)"}),i.jsx("textarea",{id:"pageDescription",value:T,onChange:N=>{H(N.target.value),k.description&&G(j=>_e(Ee({},j),{description:""}))},placeholder:we(P),className:`form-textarea ${k.description?"error":""}`,rows:4}),k.description&&i.jsx("span",{className:"error-message",children:k.description}),k.ai&&i.jsx("span",{className:"warning-message",children:k.ai}),i.jsx("div",{className:"description-help",children:"💡 Be specific about components, layout, and functionality for better AI-generated content"})]})]}),C.length>0&&i.jsxs("div",{className:"pages-list",children:[i.jsx("h3",{className:"list-title",children:R>0?i.jsxs(i.Fragment,{children:["All Pages (",C.length,")",i.jsxs("span",{className:"new-pages-indicator",children:["• ",R," new"]})]}):C.length>0?`Existing Pages (${C.length})`:"No pages yet - fill form above to add first page"}),"                            ",i.jsx("div",{className:"pages-grid",children:C.map(N=>{const j=z.has(N.id);return i.jsxs("div",{className:`page-card ${j?"existing-page":"new-page"}`,children:[i.jsxs("div",{className:"page-header",children:[i.jsxs("div",{className:"page-info",children:[i.jsxs("h4",{className:"page-name",children:[N.name,!j&&i.jsx("span",{className:"new-badge",children:"NEW"})]}),i.jsx("span",{className:`page-type-badge page-type-${N.type}`,children:B[N.type]})]}),i.jsxs("div",{className:"page-actions",children:[i.jsx("button",{className:"action-btn",onClick:()=>Fe(N),title:"Duplicate",children:i.jsx(Nd,{})}),i.jsx("button",{className:"action-btn delete",onClick:()=>Se(N.id),title:"Delete",children:i.jsx(uf,{})})]})]}),N.description&&i.jsx("p",{className:"page-description",children:N.description})]},N.id)})})]})]}),i.jsxs("div",{className:"modal-footer",children:[i.jsx("button",{className:"btn-secondary",onClick:d,children:"Cancel"}),i.jsx("button",{className:"btn-primary",onClick:Ie,disabled:!y&&R===0,children:Z?i.jsxs(i.Fragment,{children:[i.jsx("div",{className:"spinner"}),ae||"Generating..."]}):y?`Add "${E.trim()}" Page`:R>0?`Add ${R} New Page${R!==1?"s":""}`:"Fill Form to Add Page"})]})]})}):null},wf=({isOpen:s,onClose:d,onSave:c,currentHtml:x,currentCss:h,designTheme:C,colorScheme:S,initialName:E="",isUpdating:F=!1,existingWireframe:T})=>{const[H,P]=g.useState(E||(T==null?void 0:T.name)||""),[U,Z]=g.useState((T==null?void 0:T.description)||""),[pe,k]=g.useState((T==null?void 0:T.tags)||[]),[G,ae]=g.useState(""),[le,ne]=g.useState({format:"html",includeCSS:!0,minifyCode:!1,generateThumbnail:!0}),[re,be]=g.useState(!1),[we,ge]=g.useState(!1),ke=g.useCallback(()=>{G.trim()&&!pe.includes(G.trim())&&(k(y=>[...y,G.trim()]),ae(""))},[G,pe]),Se=g.useCallback(y=>{k(D=>D.filter(B=>B!==y))},[]),Fe=g.useCallback(y=>{y.key==="Enter"&&y.target===y.currentTarget&&ke()},[ke]),Ie=g.useCallback(y=>{const D=["button","input","select","textarea",".card",".component","[data-component]","nav","header","footer","section","article"],B=document.createElement("div");B.innerHTML=y;let N=0;return D.forEach(j=>{N+=B.querySelectorAll(j).length}),N},[]),z=g.useCallback(()=>ze(null,null,function*(){return new Promise(y=>{setTimeout(()=>{y("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmNmZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzMzMzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPldpcmVmcmFtZTwvdGV4dD48L3N2Zz4=")},500)})}),[]),R=g.useCallback(()=>ze(null,null,function*(){if(H.trim()){be(!0);try{const y=le.generateThumbnail?yield z():void 0,D={name:H.trim(),description:U.trim(),tags:pe,html:x,css:h,thumbnail:y,metadata:{componentCount:Ie(x),layoutType:"responsive",designTheme:C,colorScheme:S}};yield c(D,le),ge(!0),setTimeout(()=>{ge(!1),d()},1500)}catch(y){console.error("Save failed:",y)}finally{be(!1)}}}),[H,U,pe,x,h,le,C,S,Ie,z,c,d]);return s?we?i.jsx("div",{className:"modal-overlay",children:i.jsx("div",{className:"save-modal success-modal",children:i.jsxs("div",{className:"success-content",children:[i.jsx(Bt,{className:"success-icon"}),i.jsx("h3",{children:"Wireframe Saved Successfully!"}),i.jsxs("p",{children:['"',H,'" has been saved to your library.']})]})})}):i.jsx("div",{className:"modal-overlay",children:i.jsxs("div",{className:"save-modal",children:[i.jsxs("div",{className:"modal-header",children:[i.jsxs("h3",{children:[i.jsx(Ld,{className:"modal-icon"}),F?"Update Wireframe":"Save Wireframe"]}),i.jsx("button",{className:"close-btn",onClick:d,"aria-label":"Close modal",children:i.jsx(tn,{})})]}),i.jsxs("div",{className:"modal-body",children:[i.jsxs("div",{className:"form-section",children:[i.jsxs("label",{htmlFor:"wireframe-name",className:"form-label",children:[i.jsx(tf,{className:"label-icon"}),"Wireframe Name"]}),i.jsx("input",{id:"wireframe-name",type:"text",value:H,onChange:y=>P(y.target.value),placeholder:"Enter a name for your wireframe",className:"form-input",autoFocus:!0})]}),i.jsxs("div",{className:"form-section",children:[i.jsxs("label",{htmlFor:"wireframe-description",className:"form-label",children:[i.jsx(zd,{className:"label-icon"}),"Description (Optional)"]}),i.jsx("textarea",{id:"wireframe-description",value:U,onChange:y=>Z(y.target.value),placeholder:"Describe your wireframe design and purpose",className:"form-textarea",rows:3})]}),i.jsxs("div",{className:"form-section",children:[i.jsxs("label",{className:"form-label",children:[i.jsx(df,{className:"label-icon"}),"Tags"]}),i.jsxs("div",{className:"tags-input-wrapper",children:[i.jsx("input",{type:"text",value:G,onChange:y=>ae(y.target.value),onKeyDown:Fe,placeholder:"Add tags (press Enter)",className:"tag-input"}),i.jsx("button",{type:"button",onClick:ke,className:"add-tag-btn",disabled:!G.trim(),children:"Add"})]}),pe.length>0&&i.jsx("div",{className:"tags-list",children:pe.map((y,D)=>i.jsxs("span",{className:"tag",children:[y,i.jsx("button",{onClick:()=>Se(y),className:"remove-tag-btn","aria-label":`Remove ${y} tag`,children:i.jsx(tn,{})})]},D))})]}),i.jsxs("div",{className:"form-section",children:[i.jsx("h4",{className:"section-title",children:"Save Options"}),i.jsxs("div",{className:"option-group",children:[i.jsxs("label",{className:"option-label",children:[i.jsx(jd,{className:"label-icon"}),"Export Format"]}),i.jsxs("div",{className:"radio-group",children:[i.jsxs("label",{className:"radio-option",children:[i.jsx("input",{type:"radio",name:"format",value:"html",checked:le.format==="html",onChange:y=>ne(D=>_e(Ee({},D),{format:y.target.value}))}),i.jsx("span",{children:"HTML + CSS"})]}),i.jsxs("label",{className:"radio-option",children:[i.jsx("input",{type:"radio",name:"format",value:"react",checked:le.format==="react",onChange:y=>ne(D=>_e(Ee({},D),{format:y.target.value}))}),i.jsx("span",{children:"React Components"})]}),i.jsxs("label",{className:"radio-option",children:[i.jsx("input",{type:"radio",name:"format",value:"figma",checked:le.format==="figma",onChange:y=>ne(D=>_e(Ee({},D),{format:y.target.value}))}),i.jsx("span",{children:"Figma Export"})]})]})]}),i.jsxs("div",{className:"checkbox-group",children:[i.jsxs("label",{className:"checkbox-option",children:[i.jsx("input",{type:"checkbox",checked:le.includeCSS,onChange:y=>ne(D=>_e(Ee({},D),{includeCSS:y.target.checked}))}),i.jsx("span",{children:"Include CSS styles"})]}),i.jsxs("label",{className:"checkbox-option",children:[i.jsx("input",{type:"checkbox",checked:le.minifyCode,onChange:y=>ne(D=>_e(Ee({},D),{minifyCode:y.target.checked}))}),i.jsx("span",{children:"Minify code for production"})]}),i.jsxs("label",{className:"checkbox-option",children:[i.jsx("input",{type:"checkbox",checked:le.generateThumbnail,onChange:y=>ne(D=>_e(Ee({},D),{generateThumbnail:y.target.checked}))}),i.jsxs("span",{className:"thumbnail-option",children:[i.jsx(Zn,{className:"option-icon"}),"Generate preview thumbnail"]})]})]})]}),i.jsxs("div",{className:"preview-info",children:[i.jsx("h4",{className:"section-title",children:"Wireframe Info"}),i.jsxs("div",{className:"info-grid",children:[i.jsxs("div",{className:"info-item",children:[i.jsx("span",{className:"info-label",children:"Components:"}),i.jsx("span",{className:"info-value",children:Ie(x)||"None"})]}),i.jsxs("div",{className:"info-item",children:[i.jsx("span",{className:"info-label",children:"Theme:"}),i.jsx("span",{className:"info-value",children:C})]}),i.jsxs("div",{className:"info-item",children:[i.jsx("span",{className:"info-label",children:"Color Scheme:"}),i.jsx("span",{className:"info-value",children:S})]}),i.jsxs("div",{className:"info-item",children:[i.jsx("span",{className:"info-label",children:"Code Size:"}),i.jsxs("span",{className:"info-value",children:[(x.length+h.length/1024).toFixed(1),"KB"]})]})]})]})]}),i.jsxs("div",{className:"modal-footer",children:[i.jsx("button",{onClick:d,className:"cancel-btn",disabled:re,children:"Cancel"}),i.jsx("button",{onClick:R,className:"save-btn",disabled:!H.trim()||re,children:re?i.jsxs(i.Fragment,{children:[i.jsx("div",{className:"loading-spinner"}),"Saving..."]}):i.jsxs(i.Fragment,{children:[i.jsx(go,{className:"btn-icon"}),F?"Update":"Save"," Wireframe"]})})]})]})}):null};function Ni(s={}){const{title:d="Learning for everyone, everywhere",summary:c="Explore Microsoft product documentation, training, credentials, Q&A, code references, and shows.",eyebrow:x="MICROSOFT LEARN",ctaText:h="Get Started",secondaryCtaText:C="Browse",showSecondaryButton:S=!0,backgroundColor:E="#E9ECEF",heroImageUrl:F="public/hero300.png"}=s;return`
    <!-- Microsoft Learn Accent Hero Section -->
    <section class="hero hero-image background-color-body-accent gradient-border-right gradient-border-body-accent" 
             style="--hero-background-image-light: url('${F}'); --hero-background-image-dark: url('${F}'); 
                    position: relative; display: flex; flex-direction: column; min-height: 300px; padding: 2rem; 
                    background-color: ${E}; background-image: var(--hero-background-image-light); 
                    background-size: cover; background-position: center; background-repeat: no-repeat;">
      
      <!-- Gradient Border Right -->
      <div style="content: ''; position: absolute; right: 0; top: 0; bottom: 0; width: 4px; 
                  background: linear-gradient(180deg, ${E} 0%, rgba(232, 230, 223, 0) 100%);"></div>
      
      <!-- Hero Content -->
      <div class="hero-content" style="max-width: 800px; z-index: 1;">
        <!-- Eyebrow Text -->
        <p class="letter-spacing-wide text-transform-uppercase font-size-sm" 
           style="letter-spacing: 0.2em; text-transform: uppercase; font-size: 0.875rem; 
                  line-height: 1.25rem; margin: 0 0 0.5rem 0; color: #3C4858; font-weight: 600;">
          ${x}
        </p>
        
        <!-- Main Title -->
        <h1 class="font-size-h1 font-weight-semibold" 
            style="font-size: 2.5rem; line-height: 3rem; font-weight: 600; margin: 0 0 1rem 0; color: #3C4858;">
          ${d}
        </h1>
        
        <!-- Summary Text -->
        <p class="font-size-lg font-weight-semibold margin-block-sm" 
           style="font-size: 1.125rem; line-height: 1.75rem; font-weight: 600; 
                  margin-top: 0.5rem; margin-bottom: 0.5rem; color: #3C4858;">
          ${c}
        </p>
        
        <!-- Action Buttons -->
        <div class="buttons margin-top-md" style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 1rem;">
          <button class="button border button-clear" 
                  style="display: inline-flex; align-items: center; justify-content: center; 
                         padding: 0.5rem 1rem; border-radius: 0.25rem; font-family: 'Segoe UI', sans-serif; 
                         font-size: 0.875rem; font-weight: 600; text-decoration: none; cursor: pointer; 
                         transition: all 0.2s ease; min-height: 2.5rem; border: 1px solid #8E9AAF; 
                         background-color: transparent; color: #8E9AAF;">
            ${h}
          </button>
          ${S?`
          <button class="button border" 
                  style="display: inline-flex; align-items: center; justify-content: center; 
                         padding: 0.5rem 1rem; border-radius: 0.25rem; font-family: 'Segoe UI', sans-serif; 
                         font-size: 0.875rem; font-weight: 600; text-decoration: none; cursor: pointer; 
                         transition: all 0.2s ease; min-height: 2.5rem; border: 1px solid #8E9AAF; 
                         background-color: #8E9AAF; color: white;">
            ${C}
          </button>
          `:""}
        </div>
      </div>
    </section>
    
    <style>
      /* Microsoft Learn Accent Hero CSS Classes */
      .hero {
        position: relative;
        display: flex;
        flex-direction: column;
        min-height: 300px;
        padding: 2rem;
        font-family: 'Segoe UI', sans-serif;
      }
      
      .hero-image {
        background-image: var(--hero-background-image-light);
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      }
      
      .background-color-body-accent {
        background-color: #E9ECEF;
      }
      
      .gradient-border-right::after {
        content: '';
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background: linear-gradient(180deg, #E9ECEF 0%, rgba(232, 230, 223, 0) 100%);
      }
      
      .hero-content {
        max-width: 800px;
        z-index: 1;
      }
      
      .button:hover {
        opacity: 0.9;
        transform: translateY(-1px);
      }
      
      .button.button-clear:hover {
        background-color: #8E9AAF !important;
        color: white !important;
      }
      
      .button.border:hover {
        background-color: #68769C !important;
        border-color: #68769C !important;
      }
      
      @media (max-width: 768px) {
        .hero {
          padding: 1rem;
        }
        
        .font-size-h1 {
          font-size: 1.875rem !important;
          line-height: 2.25rem !important;
        }
        
        .buttons {
          flex-direction: column;
        }
        
        .button {
          width: 100%;
          justify-content: center;
        }
      }
    </style>
  `}const Cr=[{id:"contact",name:"Contact Form",description:"Basic contact form with name, email, and message",fields:[{type:"text",label:"Name",name:"name",required:!0,placeholder:"Your Name"},{type:"email",label:"Email",name:"email",required:!0,placeholder:"your@email.com"},{type:"textarea",label:"Message",name:"message",required:!0,placeholder:"Your message..."}]},{id:"login",name:"Login Form",description:"User authentication form",fields:[{type:"email",label:"Email",name:"email",required:!0,placeholder:"your@email.com"},{type:"password",label:"Password",name:"password",required:!0},{type:"checkbox",label:"Remember me",name:"remember"}]},{id:"registration",name:"Registration Form",description:"User registration form",fields:[{type:"text",label:"First Name",name:"firstName",required:!0},{type:"text",label:"Last Name",name:"lastName",required:!0},{type:"email",label:"Email",name:"email",required:!0},{type:"password",label:"Password",name:"password",required:!0},{type:"password",label:"Confirm Password",name:"confirmPassword",required:!0}]}],en=s=>{const d=s.fields.map(c=>{var x,h;switch(c.type){case"textarea":return`
          <div class="form-field">
            <label for="${c.name}">${c.label}${c.required?" *":""}</label>
            <textarea 
              id="${c.name}" 
              name="${c.name}" 
              ${c.required?"required":""}
              placeholder="${c.placeholder||""}"
            ></textarea>
          </div>
        `;case"select":const C=((x=c.options)==null?void 0:x.map(E=>`<option value="${E}">${E}</option>`).join(""))||"";return`
          <div class="form-field">
            <label for="${c.name}">${c.label}${c.required?" *":""}</label>
            <select id="${c.name}" name="${c.name}" ${c.required?"required":""}>
              ${C}
            </select>
          </div>
        `;case"checkbox":return`
          <div class="form-field checkbox-field">
            <input 
              type="checkbox" 
              id="${c.name}" 
              name="${c.name}"
            />
            <label for="${c.name}">${c.label}</label>
          </div>
        `;case"radio":const S=((h=c.options)==null?void 0:h.map(E=>`
          <div class="radio-option">
            <input type="radio" id="${c.name}_${E}" name="${c.name}" value="${E}"/>
            <label for="${c.name}_${E}">${E}</label>
          </div>
        `).join(""))||"";return`
          <div class="form-field">
            <label>${c.label}${c.required?" *":""}</label>
            ${S}
          </div>
        `;default:return`
          <div class="form-field">
            <label for="${c.name}">${c.label}${c.required?" *":""}</label>
            <input 
              type="${c.type}" 
              id="${c.name}" 
              name="${c.name}" 
              ${c.required?"required":""}
              placeholder="${c.placeholder||""}"
            />
          </div>
        `}}).join("");return`
    <div class="form-container">
      <form class="generated-form">
        <h2>${s.name}</h2>
        <p class="form-description">${s.description}</p>
        ${d}
        <div class="form-actions">
          <button type="submit" class="submit-btn">Submit</button>
          <button type="reset" class="reset-btn">Reset</button>
        </div>
      </form>
    </div>
    <style>
      .form-container {
        max-width: 500px;
        margin: 20px auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background: #fff;
      }
      .generated-form h2 {
        margin-bottom: 10px;
        color: #333;
      }
      .form-description {
        margin-bottom: 20px;
        color: #666;
        font-style: italic;
      }
      .form-field {
        margin-bottom: 15px;
      }
      .form-field label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
        color: #333;
      }
      .form-field input,
      .form-field textarea,
      .form-field select {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
      }
      .checkbox-field {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .checkbox-field input {
        width: auto;
      }
      .radio-option {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 5px;
      }
      .radio-option input {
        width: auto;
      }
      .form-actions {
        display: flex;
        gap: 10px;
        margin-top: 20px;
      }
      .submit-btn,
      .reset-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      }
      .submit-btn {
        background-color: #007cba;
        color: white;
      }
      .reset-btn {
        background-color: #6c757d;
        color: white;
      }
      .submit-btn:hover {
        background-color: #005a85;
      }
      .reset-btn:hover {
        background-color: #545b62;
      }
    </style>
  `},kf=({isOpen:s,onClose:d,onAddComponent:c,onGenerateWithAI:x,currentDescription:h})=>{if(!s)return null;console.log("🔍 ComponentLibraryModal debug:",{onGenerateWithAI:!!x,currentDescription:h,shouldShowAIButton:!!(x&&h)});const C=[{id:"ms-learn-header-basic",name:"Microsoft Learn Site Header",description:"Official Microsoft Learn site header with logo and brand",category:"Navigation",htmlCode:`<div style="display: flex; align-items: center; padding: 12px 24px; background: white; border-bottom: 1px solid #e1e5e9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
    <!-- Microsoft logo -->
    <a href="https://www.microsoft.com" aria-label="Microsoft" style="display: flex; align-items: center; margin-right: 16px; text-decoration: none;">
        <svg aria-hidden="true" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px;">
            <path d="M11.5216 0.5H0V11.9067H11.5216V0.5Z" fill="#f25022" />
            <path d="M24.2418 0.5H12.7202V11.9067H24.2418V0.5Z" fill="#7fba00" />
            <path d="M11.5216 13.0933H0V24.5H11.5216V13.0933Z" fill="#00a4ef" />
            <path d="M24.2418 13.0933H12.7202V24.5H24.2418V13.0933Z" fill="#ffb900" />
        </svg>
    </a>

    <!-- Divider -->
    <div style="width: 1px; height: 24px; background: #e1e5e9; margin-right: 16px;"></div>

    <!-- Brand -->
    <a href="#" style="color: #3C4858; text-decoration: none; font-weight: 600; font-size: 16px; margin-right: auto;">
        <span>Microsoft Learn</span>
    </a>

    <!-- Navigation -->
    <nav aria-label="site header navigation" style="display: flex; align-items: center; gap: 8px;">
        <a href="#" style="color: #3C4858; text-decoration: none; padding: 8px 12px; border-radius: 4px; transition: background 0.2s; font-size: 14px;">Documentation</a>
        <a href="#" style="color: #3C4858; text-decoration: none; padding: 8px 12px; border-radius: 4px; transition: background 0.2s; font-size: 14px;">Training</a>
        <a href="#" style="color: #3C4858; text-decoration: none; padding: 8px 12px; border-radius: 4px; transition: background 0.2s; font-size: 14px;">Certifications</a>
    </nav>
</div>`},{id:"ms-learn-header-centered",name:"Microsoft Learn Header (Centered Logo)",description:"Microsoft Learn header with centered logo layout",category:"Navigation",htmlCode:`<div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 24px; background: white; border-bottom: 1px solid #e1e5e9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
    <!-- Brand -->
    <a href="#" style="color: #3C4858; text-decoration: none; font-weight: 600; font-size: 16px;">
        <span>Microsoft Learn</span>
    </a>

    <!-- Centered Microsoft logo -->
    <a href="https://www.microsoft.com" aria-label="Microsoft" style="display: flex; align-items: center; text-decoration: none;">
        <svg aria-hidden="true" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px;">
            <path d="M11.5216 0.5H0V11.9067H11.5216V0.5Z" fill="#f25022" />
            <path d="M24.2418 0.5H12.7202V11.9067H24.2418V0.5Z" fill="#7fba00" />
            <path d="M11.5216 13.0933H0V24.5H11.5216V13.0933Z" fill="#00a4ef" />
            <path d="M24.2418 13.0933H12.7202V24.5H24.2418V13.0933Z" fill="#ffb900" />
        </svg>
    </a>

    <a href="#" style="color: #8E9AAF; text-decoration: none; font-size: 14px; padding: 6px 12px; border: 1px solid #8E9AAF; border-radius: 4px; transition: all 0.2s;">
        <span>Sign in</span>
    </a>
</div>`},{id:"ms-learn-header-with-nav",name:"Microsoft Learn Header with Extended Nav",description:"Full Microsoft Learn header with comprehensive navigation",category:"Navigation",htmlCode:`<div style="background: white; border-bottom: 1px solid #e1e5e9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
    <!-- Main header -->
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 24px;">
        <!-- Left section -->
        <div style="display: flex; align-items: center;">
            <!-- Microsoft logo -->
            <a href="https://www.microsoft.com" aria-label="Microsoft" style="display: flex; align-items: center; margin-right: 16px; text-decoration: none;">
                <svg aria-hidden="true" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px;">
                    <path d="M11.5216 0.5H0V11.9067H11.5216V0.5Z" fill="#f25022" />
                    <path d="M24.2418 0.5H12.7202V11.9067H24.2418V0.5Z" fill="#7fba00" />
                    <path d="M11.5216 13.0933H0V24.5H11.5216V13.0933Z" fill="#00a4ef" />
                    <path d="M24.2418 13.0933H12.7202V24.5H24.2418V13.0933Z" fill="#ffb900" />
                </svg>
            </a>

            <!-- Divider -->
            <div style="width: 1px; height: 24px; background: #e1e5e9; margin-right: 16px;"></div>

            <!-- Brand -->
            <a href="#" style="color: #3C4858; text-decoration: none; font-weight: 600; font-size: 16px;">
                <span>Microsoft Learn</span>
            </a>
        </div>

        <!-- Right section -->
        <div style="display: flex; align-items: center; gap: 16px;">
            <button style="background: none; border: none; color: #3C4858; cursor: pointer; padding: 8px; border-radius: 4px; font-size: 14px;">🔍 Search</button>
            <a href="#" style="color: #8E9AAF; text-decoration: none; font-size: 14px; padding: 6px 12px; border: 1px solid #8E9AAF; border-radius: 4px;">Sign in</a>
        </div>
    </div>

    <!-- Secondary navigation -->
    <div style="padding: 0 24px; border-top: 1px solid #f3f2f1;">
        <nav style="display: flex; gap: 32px; padding: 12px 0;">
            <a href="#" style="color: #3C4858; text-decoration: none; font-size: 14px; padding: 8px 0; border-bottom: 2px solid transparent; transition: border-color 0.2s;">Browse</a>
            <a href="#" style="color: #3C4858; text-decoration: none; font-size: 14px; padding: 8px 0; border-bottom: 2px solid transparent; transition: border-color 0.2s;">Learning Paths</a>
            <a href="#" style="color: #3C4858; text-decoration: none; font-size: 14px; padding: 8px 0; border-bottom: 2px solid transparent; transition: border-color 0.2s;">Modules</a>
            <a href="#" style="color: #3C4858; text-decoration: none; font-size: 14px; padding: 8px 0; border-bottom: 2px solid #8E9AAF;">Certifications</a>
            <a href="#" style="color: #3C4858; text-decoration: none; font-size: 14px; padding: 8px 0; border-bottom: 2px solid transparent; transition: border-color 0.2s;">Q&A</a>
        </nav>
    </div>
</div>`},{id:"button-primary",name:"Primary Button",description:"Main call-to-action button",category:"Buttons",htmlCode:'<button style="background: #8E9AAF; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-weight: 600;">Click Me</button>'},{id:"button-secondary",name:"Secondary Button",description:"Secondary action button",category:"Buttons",htmlCode:'<button style="background: #f3f2f1; color: #3C4858; border: 1px solid #e1dfdd; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-weight: 600;">Secondary</button>'},{id:"card-basic",name:"Basic Card",description:"Simple card layout",category:"Cards",htmlCode:'<div style="background: white; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #e1e5e9;"><h3 style="margin: 0 0 12px 0; color: #3C4858;">Card Title</h3><p style="margin: 0; color: #68769C;">Card content goes here with some descriptive text.</p></div>'},{id:"form-contact",name:"Contact Form",description:"Microsoft Learn contact form with validation",category:"Forms",htmlCode:en(Cr.find(P=>P.id==="contact"))},{id:"form-feedback",name:"Feedback Form",description:"Microsoft Learn feedback form with radio buttons",category:"Forms",htmlCode:en(Cr.find(P=>P.id==="feedback")||Cr[0])},{id:"form-registration",name:"Registration Form",description:"Microsoft Learn registration form with validation",category:"Forms",htmlCode:en(Cr.find(P=>P.id==="registration"))},{id:"form-survey",name:"Survey Form",description:"Microsoft Learn survey form with various inputs",category:"Forms",htmlCode:en(Cr.find(P=>P.id==="survey")||Cr[0])},{id:"form-input-text",name:"Text Input Field",description:"Microsoft Learn text input with proper styling",category:"Forms",htmlCode:en({name:"Sample Input Form",description:"Example form with text input",fields:[{id:"sample-input",name:"input",label:"Input Label",type:"text",required:!0,placeholder:"Enter text here...",description:"This is a helpful description for the input field"}]})},{id:"form-textarea",name:"Textarea Field",description:"Microsoft Learn textarea with validation",category:"Forms",htmlCode:en({name:"Sample Textarea Form",description:"Example form with textarea",fields:[{id:"sample-textarea",name:"textarea",label:"Textarea Label",type:"textarea",required:!0,placeholder:"Enter your message...",rows:4,minLength:10}]})},{id:"form-select",name:"Select Dropdown",description:"Microsoft Learn select field with options",category:"Forms",htmlCode:en({name:"Sample Select Form",description:"Example form with select",fields:[{id:"sample-select",name:"select",label:"Select an Option",type:"select",required:!0,options:["Option 1","Option 2","Option 3"],description:"Choose one of the available options"}]})},{id:"form-checkbox",name:"Checkbox Field",description:"Microsoft Learn checkbox with proper styling",category:"Forms",htmlCode:en({name:"Sample Checkbox Form",description:"Example form with checkbox",fields:[{id:"sample-checkbox",name:"checkbox",label:"Checkbox Label",type:"checkbox",required:!0,placeholder:"I agree to the terms and conditions"}]})},{id:"form-radio",name:"Radio Button Group",description:"Microsoft Learn radio buttons with validation",category:"Forms",htmlCode:en({name:"Sample Radio Form",description:"Example form with radio buttons",fields:[{id:"sample-radio",name:"radio",label:"Choose an Option",type:"radio",required:!0,options:["Yes","No","Maybe"]}]})},{id:"form-input",name:"Basic Text Input (Legacy)",description:"Simple text input field",category:"Forms",htmlCode:'<div style="margin-bottom: 16px;"><label style="display: block; margin-bottom: 4px; font-weight: 600; color: #3C4858;">Label:</label><input type="text" style="width: 100%; max-width: 300px; padding: 8px 12px; border: 1px solid #e1dfdd; border-radius: 4px; font-size: 14px;" placeholder="Enter text..."></div>'},{id:"fluent-select",name:"FluentUI Select",description:"Microsoft FluentUI Select component with dropdown arrow and options",category:"Forms",htmlCode:`<div style="max-width: 300px; font-family: 'Segoe UI', Tahoma, Arial, sans-serif;">
    <label style="
        display: block; 
        margin-bottom: 4px; 
        font-size: 14px; 
        font-weight: 600; 
        color: #3C4858;
    ">Select an option</label>
    
    <div style="position: relative;">
        <select style="
            width: 100%;
            height: 32px;
            padding: 4px 24px 4px 8px;
            border: 1px solid #8a8886;
            border-radius: 2px;
            background: white;
            font-size: 14px;
            font-family: inherit;
            color: #3C4858;
            cursor: pointer;
            outline: none;
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
        " class="fluent-select-input"
        onmouseover="this.style.borderColor='#3C4858'"
        onmouseout="this.style.borderColor='#8a8886'"
        onfocus="this.style.borderColor='#8E9AAF'; this.style.boxShadow='0 0 0 1px #8E9AAF'"
        onblur="this.style.borderColor='#8a8886'; this.style.boxShadow='none'">
            <option value="">Choose an option</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
            <option value="option4">Option 4</option>
        </select>
        
        <!-- Custom dropdown arrow -->
        <div style="
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            pointer-events: none;
            color: #68769C;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 16px;
            height: 16px;
        ">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.427 7.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 7H4.604a.25.25 0 00-.177.427z"/>
            </svg>
        </div>
    </div>
    
    <style>
        .fluent-select-input:hover {
            border-color: #3C4858 !important;
        }
        
        .fluent-select-input:focus {
            border-color: #8E9AAF !important;
            box-shadow: 0 0 0 1px #8E9AAF !important;
        }
        
        .fluent-select-input:disabled {
            background-color: #f3f2f1;
            color: #a19f9d;
            border-color: #c8c6c4;
            cursor: not-allowed;
        }
        
        /* Custom scrollbar for options */
        .fluent-select-input option {
            padding: 8px;
            font-size: 14px;
            color: #3C4858;
            background: white;
        }
        
        .fluent-select-input option:hover {
            background: #f3f2f1;
        }
        
        .fluent-select-input option:checked {
            background: #8E9AAF;
            color: white;
        }
    </style>
</div>`},{id:"navigation-header",name:"Microsoft Learn Header",description:"Microsoft Learn site header with navigation",category:"Navigation",htmlCode:`
              <header class="docs-header" style="background: #f8f9fa; padding: 12px 0; border-bottom: 1px solid #e1e4e8;">
                <div class="docs-header-container" style="max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: space-between;">
                  <div class="docs-header-brand" style="display: flex; align-items: center; gap: 12px;">
                    <img src="dist/windowsLogo.png">
                    <span style="font-size: 16px; font-weight: 600; color: #24292f;">Microsoft Learn</span>
                  </div>
                  <nav class="docs-header-nav" style="display: flex; align-items: center; gap: 24px;">
                    <a href="#" style="color: #656d76; text-decoration: none; font-weight: 500; font-size: 14px;">Documentation</a>
                    <a href="#" style="color: #656d76; text-decoration: none; font-weight: 500; font-size: 14px;">Learning Paths</a>
                    <a href="#" style="color: #656d76; text-decoration: none; font-weight: 500; font-size: 14px;">Certifications</a>
                    <a href="#" style="color: #656d76; text-decoration: none; font-weight: 500; font-size: 14px;">Q&A</a>
                    <button style="background: #8E9AAF; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer;">Sign in</button>
                  </nav>
                </div>
              </header>
            `},{id:"hero-section",name:"Microsoft Learn Accent Hero",description:"Microsoft Learn hero section with accent background",category:"Sections",htmlCode:Ni({title:"Build your next great idea",summary:"Transform your vision into reality with Microsoft Learn's comprehensive resources and tools.",eyebrow:"MICROSOFT LEARN",ctaText:"Get Started",showSecondaryButton:!0,secondaryCtaText:"Learn More",backgroundColor:"#E9ECEF",heroImageUrl:"https://learn.microsoft.com/media/learn/home/hero-learn.svg"})},{id:"atlas-hero",name:"Fluent Hero - Azure",description:"Microsoft Azure themed hero section",category:"Fluent",htmlCode:Ni({title:"Build and deploy with Azure",summary:"Create scalable applications with Microsoft Azure cloud services and tools.",eyebrow:"MICROSOFT AZURE",ctaText:"Get Started",showSecondaryButton:!0,secondaryCtaText:"Learn More",backgroundColor:"#E9ECEF",heroImageUrl:"https://learn.microsoft.com/media/learn/Product/Microsoft-Azure/azure.svg"})},{id:"atlas-hero-ai",name:"Fluent Hero - AI",description:"AI and machine learning themed hero section",category:"Fluent",htmlCode:Ni({title:"Accelerate innovation with AI",summary:"Transform your business with artificial intelligence and machine learning solutions.",eyebrow:"AI & MACHINE LEARNING",ctaText:"Explore AI",showSecondaryButton:!1,backgroundColor:"#E9ECEF",heroImageUrl:"https://learn.microsoft.com/media/learn/Product/Azure/azure-ai.svg"})},{id:"fluentui-progressbar",name:"FluentUI ProgressBar",description:"Progress indicator showing completion status",category:"Data Display",htmlCode:`<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; background: white;">
    <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #3C4858;">Progress Bar Example</h3>
    
    <!-- Determinate Progress Bar -->
    <div style="margin-bottom: 24px;">
        <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #3C4858;">File Upload Progress (75%)</label>
        <div style="width: 100%; height: 4px; background-color: #f3f2f1; border-radius: 2px; overflow: hidden;">
            <div style="width: 75%; height: 100%; background-color: #8E9AAF; border-radius: 2px; transition: width 0.3s ease;"></div>
        </div>
    </div>
    
    <!-- Indeterminate Progress Bar -->
    <div style="margin-bottom: 24px;">
        <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #3C4858;">Loading...</label>
        <div style="width: 100%; height: 4px; background-color: #f3f2f1; border-radius: 2px; overflow: hidden;">
            <div style="width: 30%; height: 100%; background-color: #8E9AAF; border-radius: 2px; animation: progress-indeterminate 2s infinite linear;"></div>
        </div>
    </div>
    
    <style>
        @keyframes progress-indeterminate {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(333%); }
        }
    </style>
</div>`},{id:"fluentui-popover",name:"FluentUI Popover",description:"Contextual overlay for additional information",category:"Overlays",htmlCode:`<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; background: white; position: relative;">
    <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #3C4858;">Popover Example</h3>
    
    <!-- Trigger Button -->
    <button style="background: #8E9AAF; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-size: 14px; cursor: pointer; font-family: inherit;" 
            onmouseover="document.getElementById('popover-content').style.display='block'" 
            onmouseout="document.getElementById('popover-content').style.display='none'">
        Hover for info
    </button>
    
    <!-- Popover Content -->
    <div id="popover-content" style="display: none; position: absolute; top: 60px; left: 20px; background: white; border: 1px solid #d1d1d1; border-radius: 8px; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.14), 0 0px 4px rgba(0, 0, 0, 0.12); padding: 16px; max-width: 280px; z-index: 1000;">
        <div style="font-size: 14px; font-weight: 600; color: #3C4858; margin-bottom: 8px;">Additional Information</div>
        <div style="font-size: 14px; color: #68769C; line-height: 1.4;">This popover provides contextual information that appears when you hover over the trigger element.</div>
        
        <!-- Arrow -->
        <div style="position: absolute; top: -8px; left: 16px; width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-bottom: 8px solid white;"></div>
        <div style="position: absolute; top: -9px; left: 16px; width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-bottom: 8px solid #d1d1d1;"></div>
    </div>
</div>`},{id:"fluentui-persona",name:"FluentUI Persona",description:"User profile representation with avatar and details",category:"Data Display",htmlCode:`<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; background: white;">
    <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #3C4858;">Persona Examples</h3>
    
    <!-- Large Persona -->
    <div style="display: flex; align-items: center; margin-bottom: 24px; padding: 12px; border-radius: 8px; background: #faf9f8;">
        <div style="width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, #8E9AAF, #68769C); display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; font-weight: 600; margin-right: 16px;">
            JD
        </div>
        <div>
            <div style="font-size: 20px; font-weight: 600; color: #3C4858; margin-bottom: 4px;">John Doe</div>
            <div style="font-size: 14px; color: #68769C; margin-bottom: 2px;">Senior Software Engineer</div>
            <div style="font-size: 14px; color: #68769C;">Microsoft Corporation</div>
        </div>
    </div>
    
    <!-- Medium Persona -->
    <div style="display: flex; align-items: center; margin-bottom: 24px; padding: 8px; border-radius: 6px; background: #f3f2f1;">
        <div style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #ca5010, #a4400e); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: 600; margin-right: 12px;">
            AS
        </div>
        <div>
            <div style="font-size: 16px; font-weight: 600; color: #3C4858; margin-bottom: 2px;">Alice Smith</div>
            <div style="font-size: 13px; color: #68769C;">Product Manager</div>
        </div>
    </div>
    
    <!-- Small Persona -->
    <div style="display: flex; align-items: center; padding: 6px; border-radius: 4px; background: #edebe9;">
        <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #038387, #026c70); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: 600; margin-right: 8px;">
            BJ
        </div>
        <div>
            <div style="font-size: 14px; font-weight: 600; color: #3C4858;">Bob Johnson</div>
        </div>
    </div>
</div>`},{id:"fluentui-nav",name:"FluentUI Nav",description:"Navigation component with hierarchical structure",category:"Navigation",htmlCode:`<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; background: white; border-right: 1px solid #edebe9; width: 280px; height: 400px; padding: 16px 0;">
    <div style="padding: 0 16px 16px 16px; border-bottom: 1px solid #edebe9; margin-bottom: 8px;">
        <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #3C4858;">Navigation</h3>
    </div>
    
    <nav style="padding: 0 8px;">
        <!-- Home -->
        <a href="#" style="display: flex; align-items: center; padding: 8px 12px; border-radius: 4px; text-decoration: none; color: #3C4858; background: #f3f2f1; margin-bottom: 2px;">
            <span style="margin-right: 8px;">🏠</span>
            <span style="font-size: 14px; font-weight: 600;">Home</span>
        </a>
        
        <!-- Documents -->
        <a href="#" style="display: flex; align-items: center; padding: 8px 12px; border-radius: 4px; text-decoration: none; color: #3C4858; margin-bottom: 2px; transition: background 0.2s;" onmouseover="this.style.background='#f3f2f1'" onmouseout="this.style.background='transparent'">
            <span style="margin-right: 8px;">📁</span>
            <span style="font-size: 14px;">Documents</span>
        </a>
        
        <!-- Recent Files (Expandable) -->
        <div style="margin-bottom: 2px;">
            <a href="#" style="display: flex; align-items: center; padding: 8px 12px; border-radius: 4px; text-decoration: none; color: #3C4858; transition: background 0.2s;" onmouseover="this.style.background='#f3f2f1'" onmouseout="this.style.background='transparent'">
                <span style="margin-right: 8px;">▶</span>
                <span style="font-size: 14px;">Recent Files</span>
            </a>
            <div style="margin-left: 32px; margin-top: 4px;">
                <a href="#" style="display: block; padding: 6px 8px; border-radius: 4px; text-decoration: none; color: #68769C; font-size: 13px; transition: background 0.2s;" onmouseover="this.style.background='#f3f2f1'" onmouseout="this.style.background='transparent'">
                    Report.docx
                </a>
                <a href="#" style="display: block; padding: 6px 8px; border-radius: 4px; text-decoration: none; color: #68769C; font-size: 13px; transition: background 0.2s;" onmouseover="this.style.background='#f3f2f1'" onmouseout="this.style.background='transparent'">
                    Presentation.pptx
                </a>
            </div>
        </div>
        
        <!-- Settings -->
        <a href="#" style="display: flex; align-items: center; padding: 8px 12px; border-radius: 4px; text-decoration: none; color: #3C4858; margin-bottom: 2px; transition: background 0.2s;" onmouseover="this.style.background='#f3f2f1'" onmouseout="this.style.background='transparent'">
            <span style="margin-right: 8px;">⚙️</span>
            <span style="font-size: 14px;">Settings</span>
        </a>
        
        <!-- Help -->
        <a href="#" style="display: flex; align-items: center; padding: 8px 12px; border-radius: 4px; text-decoration: none; color: #3C4858; transition: background 0.2s;" onmouseover="this.style.background='#f3f2f1'" onmouseout="this.style.background='transparent'">
            <span style="margin-right: 8px;">❓</span>
            <span style="font-size: 14px;">Help</span>
        </a>
    </nav>
</div>`},{id:"fluentui-messagebar",name:"FluentUI MessageBar",description:"Notification messages for different states",category:"Feedback",htmlCode:`<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; background: white;">
    <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #3C4858;">MessageBar Examples</h3>
    
    <!-- Success Message -->
    <div style="display: flex; align-items: center; padding: 12px 16px; background: #f3f9fd; border: 1px solid #c7e0f4; border-left: 4px solid #8E9AAF; border-radius: 4px; margin-bottom: 12px;">
        <span style="margin-right: 12px; color: #8E9AAF; font-size: 16px;">✓</span>
        <div>
            <div style="font-size: 14px; font-weight: 600; color: #3C4858; margin-bottom: 2px;">Success</div>
            <div style="font-size: 14px; color: #68769C;">Your changes have been saved successfully.</div>
        </div>
        <button style="margin-left: auto; background: none; border: none; color: #68769C; cursor: pointer; font-size: 16px; padding: 4px;" onclick="this.parentElement.style.display='none'">×</button>
    </div>
    
    <!-- Warning Message -->
    <div style="display: flex; align-items: center; padding: 12px 16px; background: #fff9f5; border: 1px solid #fdcfb4; border-left: 4px solid #ff8c00; border-radius: 4px; margin-bottom: 12px;">
        <span style="margin-right: 12px; color: #ff8c00; font-size: 16px;">⚠</span>
        <div>
            <div style="font-size: 14px; font-weight: 600; color: #3C4858; margin-bottom: 2px;">Warning</div>
            <div style="font-size: 14px; color: #68769C;">Some features may not work as expected in this browser.</div>
        </div>
        <button style="margin-left: auto; background: none; border: none; color: #68769C; cursor: pointer; font-size: 16px; padding: 4px;" onclick="this.parentElement.style.display='none'">×</button>
    </div>
    
    <!-- Error Message -->
    <div style="display: flex; align-items: center; padding: 12px 16px; background: #fdf6f6; border: 1px solid #f1bbbb; border-left: 4px solid #d13438; border-radius: 4px; margin-bottom: 12px;">
        <span style="margin-right: 12px; color: #d13438; font-size: 16px;">✕</span>
        <div>
            <div style="font-size: 14px; font-weight: 600; color: #3C4858; margin-bottom: 2px;">Error</div>
            <div style="font-size: 14px; color: #68769C;">Failed to connect to the server. Please try again.</div>
        </div>
        <button style="margin-left: auto; background: none; border: none; color: #68769C; cursor: pointer; font-size: 16px; padding: 4px;" onclick="this.parentElement.style.display='none'">×</button>
    </div>
    
    <!-- Info Message -->
    <div style="display: flex; align-items: center; padding: 12px 16px; background: #f6f6f6; border: 1px solid #d1d1d1; border-left: 4px solid #68769C; border-radius: 4px;">
        <span style="margin-right: 12px; color: #68769C; font-size: 16px;">ℹ</span>
        <div>
            <div style="font-size: 14px; font-weight: 600; color: #3C4858; margin-bottom: 2px;">Information</div>
            <div style="font-size: 14px; color: #68769C;">New features are available. Check out what's new in the latest update.</div>
        </div>
        <button style="margin-left: auto; background: none; border: none; color: #68769C; cursor: pointer; font-size: 16px; padding: 4px;" onclick="this.parentElement.style.display='none'">×</button>
    </div>
</div>`},{id:"fluentui-image",name:"FluentUI Image",description:"Responsive image component with different shapes",category:"Media",htmlCode:`<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; background: white;">
    <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #3C4858;">Image Examples</h3>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px;">
        <!-- Regular Image -->
        <div>
            <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #3C4858;">Regular Image</h4>
            <img src="https://via.placeholder.com/200x150/0078d4/ffffff?text=Image" 
                 alt="Example image" 
                 style="width: 100%; height: 150px; object-fit: cover; border-radius: 4px; border: 1px solid #edebe9;" />
        </div>
        
        <!-- Circular Image -->
        <div>
            <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #3C4858;">Circular Image</h4>
            <img src="https://via.placeholder.com/150x150/ca5010/ffffff?text=Avatar" 
                 alt="Avatar image" 
                 style="width: 150px; height: 150px; object-fit: cover; border-radius: 50%; border: 1px solid #edebe9;" />
        </div>
        
        <!-- Image with Placeholder -->
        <div>
            <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #3C4858;">Image Placeholder</h4>
            <div style="width: 100%; height: 150px; background: #f3f2f1; border: 2px dashed #d1d1d1; border-radius: 4px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #68769C;">
                <div style="font-size: 32px; margin-bottom: 8px;">🖼️</div>
                <div style="font-size: 14px; text-align: center;">No image available</div>
            </div>
        </div>
        
        <!-- Image with Caption -->
        <div>
            <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #3C4858;">Image with Caption</h4>
            <figure style="margin: 0;">
                <img src="https://via.placeholder.com/200x120/038387/ffffff?text=Graph" 
                     alt="Chart visualization" 
                     style="width: 100%; height: 120px; object-fit: cover; border-radius: 4px; border: 1px solid #edebe9;" />
                <figcaption style="margin-top: 8px; font-size: 13px; color: #68769C; text-align: center;">Data visualization chart</figcaption>
            </figure>
        </div>
    </div>
</div>`},{id:"fluentui-dialog",name:"FluentUI Dialog",description:"Modal dialog for important user interactions",category:"Overlays",htmlCode:`<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; background: white; position: relative;">
    <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #3C4858;">Dialog Example</h3>
    
    <!-- Trigger Button -->
    <button onclick="document.getElementById('dialog-overlay').style.display='flex'" 
            style="background: #8E9AAF; color: white; border: none; padding: 10px 20px; border-radius: 4px; font-size: 14px; cursor: pointer; font-family: inherit;">
        Open Dialog
    </button>
    
    <!-- Dialog Overlay -->
    <div id="dialog-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4); z-index: 1000; align-items: center; justify-content: center;">
        <!-- Dialog Container -->
        <div style="background: white; border-radius: 8px; box-shadow: 0 25.6px 57.6px rgba(0, 0, 0, 0.22), 0 4.8px 14.4px rgba(0, 0, 0, 0.18); max-width: 480px; width: 90%; max-height: 90vh; overflow: hidden;">
            <!-- Dialog Header -->
            <div style="padding: 24px 24px 16px 24px; border-bottom: 1px solid #edebe9;">
                <div style="display: flex; align-items: center; justify-content: between;">
                    <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #3C4858; flex: 1;">Confirm Action</h2>
                    <button onclick="document.getElementById('dialog-overlay').style.display='none'" 
                            style="background: none; border: none; color: #68769C; cursor: pointer; font-size: 16px; padding: 4px; margin-left: 16px;">
                        ✕
                    </button>
                </div>
            </div>
            
            <!-- Dialog Content -->
            <div style="padding: 24px;">
                <p style="margin: 0 0 16px 0; font-size: 14px; color: #3C4858; line-height: 1.5;">
                    Are you sure you want to proceed with this action? This operation cannot be undone and will permanently affect your data.
                </p>
                
                <div style="display: flex; align-items: center; margin-bottom: 24px; padding: 12px; background: #fff9f5; border: 1px solid #fdcfb4; border-radius: 4px;">
                    <span style="margin-right: 8px; color: #ff8c00;">⚠</span>
                    <span style="font-size: 13px; color: #68769C;">This action will delete 15 items permanently.</span>
                </div>
            </div>
            
            <!-- Dialog Footer -->
            <div style="padding: 16px 24px 24px 24px; display: flex; justify-content: flex-end; gap: 12px;">
                <button onclick="document.getElementById('dialog-overlay').style.display='none'" 
                        style="background: transparent; color: #3C4858; border: 1px solid #d1d1d1; padding: 8px 16px; border-radius: 4px; font-size: 14px; cursor: pointer; font-family: inherit;">
                    Cancel
                </button>
                <button onclick="document.getElementById('dialog-overlay').style.display='none'" 
                        style="background: #d13438; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-size: 14px; cursor: pointer; font-family: inherit;">
                    Delete
                </button>
            </div>
        </div>
    </div>
</div>`},{id:"fluentui-datagrid",name:"FluentUI DataGrid",description:"Data table with sorting and selection capabilities",category:"Data Display",htmlCode:`<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; background: white;">
    <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #3C4858;">Data Grid Example</h3>
    
    <!-- Data Grid Container -->
    <div style="border: 1px solid #d1d1d1; border-radius: 4px; overflow: hidden; background: white;">
        <!-- Header -->
        <div style="background: #f8f8f8; border-bottom: 1px solid #d1d1d1; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center;">
                <input type="checkbox" style="margin-right: 12px; cursor: pointer;" onchange="toggleAllRows(this)">
                <span style="font-size: 14px; font-weight: 600; color: #3C4858;">Select all</span>
            </div>
            <div style="font-size: 13px; color: #68769C;">5 items</div>
        </div>
        
        <!-- Table -->
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background: #faf9f8; border-bottom: 1px solid #edebe9;">
                    <th style="text-align: left; padding: 12px 16px; font-size: 14px; font-weight: 600; color: #3C4858; width: 40px;">
                        <input type="checkbox" style="cursor: pointer;">
                    </th>
                    <th style="text-align: left; padding: 12px 16px; font-size: 14px; font-weight: 600; color: #3C4858; cursor: pointer;" onclick="sortTable(0)">
                        Name <span style="color: #68769C;">↕</span>
                    </th>
                    <th style="text-align: left; padding: 12px 16px; font-size: 14px; font-weight: 600; color: #3C4858; cursor: pointer;" onclick="sortTable(1)">
                        Email <span style="color: #68769C;">↕</span>
                    </th>
                    <th style="text-align: left; padding: 12px 16px; font-size: 14px; font-weight: 600; color: #3C4858; cursor: pointer;" onclick="sortTable(2)">
                        Role <span style="color: #68769C;">↕</span>
                    </th>
                    <th style="text-align: left; padding: 12px 16px; font-size: 14px; font-weight: 600; color: #3C4858; cursor: pointer;" onclick="sortTable(3)">
                        Status <span style="color: #68769C;">↕</span>
                    </th>
                    <th style="text-align: center; padding: 12px 16px; font-size: 14px; font-weight: 600; color: #3C4858; width: 80px;">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr style="border-bottom: 1px solid #f3f2f1;" onmouseover="this.style.background='#faf9f8'" onmouseout="this.style.background='white'">
                    <td style="padding: 12px 16px;"><input type="checkbox" style="cursor: pointer;"></td>
                    <td style="padding: 12px 16px; font-size: 14px; color: #3C4858;">John Doe</td>
                    <td style="padding: 12px 16px; font-size: 14px; color: #68769C;">john.doe@company.com</td>
                    <td style="padding: 12px 16px; font-size: 14px; color: #68769C;">Administrator</td>
                    <td style="padding: 12px 16px;"><span style="background: #f3f9fd; color: #8E9AAF; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;">Active</span></td>
                    <td style="padding: 12px 16px; text-align: center;"><button style="background: none; border: none; color: #68769C; cursor: pointer; font-size: 16px;">⋯</button></td>
                </tr>
                <tr style="border-bottom: 1px solid #f3f2f1;" onmouseover="this.style.background='#faf9f8'" onmouseout="this.style.background='white'">
                    <td style="padding: 12px 16px;"><input type="checkbox" style="cursor: pointer;"></td>
                    <td style="padding: 12px 16px; font-size: 14px; color: #3C4858;">Alice Smith</td>
                    <td style="padding: 12px 16px; font-size: 14px; color: #68769C;">alice.smith@company.com</td>
                    <td style="padding: 12px 16px; font-size: 14px; color: #68769C;">Editor</td>
                    <td style="padding: 12px 16px;"><span style="background: #f3f9fd; color: #8E9AAF; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;">Active</span></td>
                    <td style="padding: 12px 16px; text-align: center;"><button style="background: none; border: none; color: #68769C; cursor: pointer; font-size: 16px;">⋯</button></td>
                </tr>
                <tr style="border-bottom: 1px solid #f3f2f1;" onmouseover="this.style.background='#faf9f8'" onmouseout="this.style.background='white'">
                    <td style="padding: 12px 16px;"><input type="checkbox" style="cursor: pointer;"></td>
                    <td style="padding: 12px 16px; font-size: 14px; color: #3C4858;">Bob Johnson</td>
                    <td style="padding: 12px 16px; font-size: 14px; color: #68769C;">bob.johnson@company.com</td>
                    <td style="padding: 12px 16px; font-size: 14px; color: #68769C;">Viewer</td>
                    <td style="padding: 12px 16px;"><span style="background: #fff9f5; color: #ff8c00; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;">Pending</span></td>
                    <td style="padding: 12px 16px; text-align: center;"><button style="background: none; border: none; color: #68769C; cursor: pointer; font-size: 16px;">⋯</button></td>
                </tr>
            </tbody>
        </table>
        
        <!-- Footer -->
        <div style="background: #faf9f8; border-top: 1px solid #edebe9; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between;">
            <div style="font-size: 13px; color: #68769C;">Showing 1-3 of 3 items</div>
            <div style="display: flex; gap: 8px;">
                <button style="background: #f3f2f1; border: 1px solid #d1d1d1; color: #68769C; padding: 6px 12px; border-radius: 4px; font-size: 13px; cursor: pointer;" disabled>Previous</button>
                <button style="background: #f3f2f1; border: 1px solid #d1d1d1; color: #68769C; padding: 6px 12px; border-radius: 4px; font-size: 13px; cursor: pointer;" disabled>Next</button>
            </div>
        </div>
    </div>
    
    <script>
        function toggleAllRows(checkbox) {
            const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
            checkboxes.forEach(cb => cb.checked = checkbox.checked);
        }
        
        function sortTable(columnIndex) {
            // Simple sort indication - in real implementation would sort data
            alert('Sorting by column ' + (columnIndex + 1));
        }
    <\/script>
</div>`},{id:"fluentui-combobox",name:"FluentUI ComboBox",description:"Dropdown with search and selection capabilities",category:"Forms",htmlCode:`<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; background: white;">
    <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #3C4858;">ComboBox Examples</h3>
    
    <!-- Basic ComboBox -->
    <div style="margin-bottom: 24px; max-width: 300px;">
        <label style="display: block; margin-bottom: 4px; font-size: 14px; font-weight: 600; color: #3C4858;">Select Country</label>
        <div style="position: relative;">
            <input type="text" 
                   placeholder="Type to search or select..."
                   style="width: 100%; padding: 8px 32px 8px 12px; border: 1px solid #d1d1d1; border-radius: 4px; font-size: 14px; color: #3C4858; background: white;"
                   onfocus="this.nextElementSibling.style.display='block'"
                   onblur="setTimeout(() => this.nextElementSibling.style.display='none', 200)">
            <div style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); color: #68769C; pointer-events: none;">▼</div>
            
            <!-- Dropdown Options -->
            <div style="display: none; position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid #d1d1d1; border-radius: 4px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); z-index: 1000; max-height: 200px; overflow-y: auto;">
                <div style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f3f2f1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'"
                     onclick="this.parentElement.previousElementSibling.previousElementSibling.value='United States'; this.parentElement.style.display='none';">
                    United States
                </div>
                <div style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f3f2f1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'"
                     onclick="this.parentElement.previousElementSibling.previousElementSibling.value='Canada'; this.parentElement.style.display='none';">
                    Canada
                </div>
                <div style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f3f2f1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'"
                     onclick="this.parentElement.previousElementSibling.previousElementSibling.value='United Kingdom'; this.parentElement.style.display='none';">
                    United Kingdom
                </div>
                <div style="padding: 8px 12px; cursor: pointer;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'"
                     onclick="this.parentElement.previousElementSibling.previousElementSibling.value='Germany'; this.parentElement.style.display='none';">
                    Germany
                </div>
            </div>
        </div>
    </div>
    
    <!-- Multi-select ComboBox -->
    <div style="max-width: 300px;">
        <label style="display: block; margin-bottom: 4px; font-size: 14px; font-weight: 600; color: #3C4858;">Select Skills (Multi-select)</label>
        <div style="border: 1px solid #d1d1d1; border-radius: 4px; padding: 4px; min-height: 36px; display: flex; flex-wrap: wrap; gap: 4px; align-items: center;">
            <!-- Selected Tags -->
            <span style="background: #e1f5fe; color: #8E9AAF; padding: 2px 8px; border-radius: 12px; font-size: 12px; display: flex; align-items: center; gap: 4px;">
                JavaScript <span style="cursor: pointer; font-weight: bold;">×</span>
            </span>
            <span style="background: #e1f5fe; color: #8E9AAF; padding: 2px 8px; border-radius: 12px; font-size: 12px; display: flex; align-items: center; gap: 4px;">
                React <span style="cursor: pointer; font-weight: bold;">×</span>
            </span>
            <input type="text" 
                   placeholder="Add more skills..."
                   style="border: none; outline: none; flex: 1; min-width: 120px; font-size: 14px; padding: 4px;">
        </div>
    </div>
</div>`},{id:"fluentui-checkbox",name:"FluentUI Checkbox",description:"Checkbox input with various states and styles",category:"Forms",htmlCode:`<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; background: white;">
    <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #3C4858;">Checkbox Examples</h3>
    
    <!-- Basic Checkboxes -->
    <div style="margin-bottom: 24px;">
        <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #3C4858;">Basic Checkboxes</h4>
        
        <label style="display: flex; align-items: center; margin-bottom: 8px; cursor: pointer;">
            <input type="checkbox" checked style="margin-right: 8px; transform: scale(1.2);">
            <span style="font-size: 14px; color: #3C4858;">Checked option</span>
        </label>
        
        <label style="display: flex; align-items: center; margin-bottom: 8px; cursor: pointer;">
            <input type="checkbox" style="margin-right: 8px; transform: scale(1.2);">
            <span style="font-size: 14px; color: #3C4858;">Unchecked option</span>
        </label>
        
        <label style="display: flex; align-items: center; margin-bottom: 8px; cursor: pointer;">
            <input type="checkbox" indeterminate style="margin-right: 8px; transform: scale(1.2);">
            <span style="font-size: 14px; color: #3C4858;">Indeterminate option</span>
        </label>
        
        <label style="display: flex; align-items: center; margin-bottom: 8px; cursor: not-allowed; opacity: 0.6;">
            <input type="checkbox" disabled style="margin-right: 8px; transform: scale(1.2);">
            <span style="font-size: 14px; color: #3C4858;">Disabled option</span>
        </label>
    </div>
    
    <!-- Checkbox Group -->
    <div style="margin-bottom: 24px;">
        <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #3C4858;">Notification Preferences</h4>
        <div style="background: #faf9f8; padding: 16px; border-radius: 6px; border: 1px solid #edebe9;">
            <label style="display: flex; align-items: center; margin-bottom: 12px; cursor: pointer;">
                <input type="checkbox" checked style="margin-right: 8px; transform: scale(1.2);">
                <div>
                    <div style="font-size: 14px; font-weight: 600; color: #3C4858;">Email notifications</div>
                    <div style="font-size: 12px; color: #68769C;">Receive updates via email</div>
                </div>
            </label>
            
            <label style="display: flex; align-items: center; margin-bottom: 12px; cursor: pointer;">
                <input type="checkbox" style="margin-right: 8px; transform: scale(1.2);">
                <div>
                    <div style="font-size: 14px; font-weight: 600; color: #3C4858;">Push notifications</div>
                    <div style="font-size: 12px; color: #68769C;">Receive push notifications on your device</div>
                </div>
            </label>
            
            <label style="display: flex; align-items: center; cursor: pointer;">
                <input type="checkbox" checked style="margin-right: 8px; transform: scale(1.2);">
                <div>
                    <div style="font-size: 14px; font-weight: 600; color: #3C4858;">SMS notifications</div>
                    <div style="font-size: 12px; color: #68769C;">Receive important updates via SMS</div>
                </div>
            </label>
        </div>
    </div>
    
    <!-- Styled Checkboxes -->
    <div>
        <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #3C4858;">Terms & Conditions</h4>
        <label style="display: flex; align-items: flex-start; cursor: pointer; padding: 12px; border: 1px solid #d1d1d1; border-radius: 4px; background: white;">
            <input type="checkbox" required style="margin-right: 12px; margin-top: 2px; transform: scale(1.2);">
            <div style="font-size: 14px; color: #3C4858; line-height: 1.4;">
                I agree to the <a href="#" style="color: #8E9AAF; text-decoration: none;">Terms of Service</a> and <a href="#" style="color: #8E9AAF; text-decoration: none;">Privacy Policy</a>
            </div>
        </label>
    </div>
</div>`},{id:"fluentui-card-footer",name:"FluentUI Card Footer",description:"Card footer with actions and information",category:"Cards",htmlCode:`<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; background: white;">
    <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #3C4858;">Card Footer Examples</h3>
    
    <!-- Card with Action Footer -->
    <div style="background: white; border: 1px solid #edebe9; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); margin-bottom: 24px; max-width: 320px;">
        <!-- Card Content -->
        <div style="padding: 16px;">
            <h4 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #3C4858;">Project Update</h4>
            <p style="margin: 0; font-size: 14px; color: #68769C; line-height: 1.4;">The new feature has been successfully deployed to production and is ready for user testing.</p>
        </div>
        
        <!-- Card Footer -->
        <div style="padding: 12px 16px; border-top: 1px solid #f3f2f1; background: #faf9f8; border-radius: 0 0 8px 8px; display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 12px; color: #68769C;">2 hours ago</div>
            <div style="display: flex; gap: 8px;">
                <button style="background: none; border: 1px solid #d1d1d1; color: #3C4858; padding: 6px 12px; border-radius: 4px; font-size: 13px; cursor: pointer;">Dismiss</button>
                <button style="background: #8E9AAF; border: none; color: white; padding: 6px 12px; border-radius: 4px; font-size: 13px; cursor: pointer;">View Details</button>
            </div>
        </div>
    </div>
    
    <!-- Card with Info Footer -->
    <div style="background: white; border: 1px solid #edebe9; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); margin-bottom: 24px; max-width: 320px;">
        <div style="padding: 16px;">
            <h4 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #3C4858;">User Profile</h4>
            <p style="margin: 0; font-size: 14px; color: #68769C;">Software Engineer with 5+ years of experience in React and TypeScript development.</p>
        </div>
        
        <div style="padding: 12px 16px; border-top: 1px solid #f3f2f1; background: #faf9f8; border-radius: 0 0 8px 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 12px; color: #68769C;">Status:</span>
                    <span style="background: #f3f9fd; color: #8E9AAF; padding: 2px 6px; border-radius: 10px; font-size: 11px; font-weight: 600;">Online</span>
                </div>
                <div style="font-size: 12px; color: #68769C;">Last seen: 5 min ago</div>
            </div>
        </div>
    </div>
    
    <!-- Card with Social Footer -->
    <div style="background: white; border: 1px solid #edebe9; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); max-width: 320px;">
        <div style="padding: 16px;">
            <h4 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #3C4858;">Team Achievement</h4>
            <p style="margin: 0; font-size: 14px; color: #68769C;">Our development team successfully completed the quarterly sprint with 98% of planned features delivered.</p>
        </div>
        
        <div style="padding: 12px 16px; border-top: 1px solid #f3f2f1; background: #faf9f8; border-radius: 0 0 8px 8px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; gap: 12px;">
                <button style="background: none; border: none; color: #68769C; cursor: pointer; display: flex; align-items: center; gap: 4px; font-size: 13px;" 
                        onmouseover="this.style.color='#8E9AAF'" 
                        onmouseout="this.style.color='#68769C'">
                    👍 12
                </button>
                <button style="background: none; border: none; color: #68769C; cursor: pointer; display: flex; align-items: center; gap: 4px; font-size: 13px;"
                        onmouseover="this.style.color='#8E9AAF'" 
                        onmouseout="this.style.color='#68769C'">
                    💬 3
                </button>
                <button style="background: none; border: none; color: #68769C; cursor: pointer; display: flex; align-items: center; gap: 4px; font-size: 13px;"
                        onmouseover="this.style.color='#8E9AAF'" 
                        onmouseout="this.style.color='#68769C'">
                    🔗 Share
                </button>
            </div>
            <div style="font-size: 12px; color: #68769C;">Dec 15</div>
        </div>
    </div>
</div>`},{id:"fluentui-card-header",name:"FluentUI Card Header",description:"Card header with title, avatar, and actions",category:"Cards",htmlCode:`<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; background: white;">
    <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #3C4858;">Card Header Examples</h3>
    
    <!-- Card with Simple Header -->
    <div style="background: white; border: 1px solid #edebe9; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); margin-bottom: 24px; max-width: 380px;">
        <!-- Card Header -->
        <div style="padding: 16px; border-bottom: 1px solid #f3f2f1; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h4 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #3C4858;">Weekly Report</h4>
                <p style="margin: 0; font-size: 12px; color: #68769C;">Generated on December 15, 2024</p>
            </div>
            <button style="background: none; border: none; color: #68769C; cursor: pointer; font-size: 16px; padding: 4px;">⋯</button>
        </div>
        
        <!-- Card Content -->
        <div style="padding: 16px;">
            <p style="margin: 0; font-size: 14px; color: #68769C; line-height: 1.4;">This week's performance metrics show a 15% improvement in user engagement and a 10% increase in conversion rates.</p>
        </div>
    </div>
    
    <!-- Card with Avatar Header -->
    <div style="background: white; border: 1px solid #edebe9; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); margin-bottom: 24px; max-width: 380px;">
        <!-- Card Header with Avatar -->
        <div style="padding: 16px; border-bottom: 1px solid #f3f2f1; display: flex; align-items: center; gap: 12px;">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #8E9AAF, #68769C); display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; font-weight: 600;">
                JD
            </div>
            <div style="flex: 1;">
                <h4 style="margin: 0 0 2px 0; font-size: 14px; font-weight: 600; color: #3C4858;">John Doe</h4>
                <p style="margin: 0; font-size: 12px; color: #68769C;">Senior Developer • 2 hours ago</p>
            </div>
            <div style="display: flex; gap: 8px;">
                <button style="background: none; border: 1px solid #d1d1d1; color: #3C4858; padding: 6px 12px; border-radius: 4px; font-size: 12px; cursor: pointer;">Follow</button>
                <button style="background: none; border: none; color: #68769C; cursor: pointer; font-size: 16px; padding: 4px;">⋯</button>
            </div>
        </div>
        
        <!-- Card Content -->
        <div style="padding: 16px;">
            <p style="margin: 0; font-size: 14px; color: #68769C; line-height: 1.4;">Just completed the new authentication system. The implementation includes two-factor authentication and social login options.</p>
        </div>
    </div>
    
    <!-- Card with Icon Header -->
    <div style="background: white; border: 1px solid #edebe9; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); margin-bottom: 24px; max-width: 380px;">
        <!-- Card Header with Icon -->
        <div style="padding: 16px; border-bottom: 1px solid #f3f2f1; display: flex; align-items: center; gap: 12px;">
            <div style="width: 40px; height: 40px; border-radius: 8px; background: #e1f5fe; display: flex; align-items: center; justify-content: center; color: #8E9AAF; font-size: 18px;">
                📊
            </div>
            <div style="flex: 1;">
                <h4 style="margin: 0 0 2px 0; font-size: 16px; font-weight: 600; color: #3C4858;">Analytics Dashboard</h4>
                <p style="margin: 0; font-size: 12px; color: #68769C;">Real-time performance metrics</p>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="background: #f3f9fd; color: #8E9AAF; padding: 2px 6px; border-radius: 10px; font-size: 11px; font-weight: 600;">Live</span>
                <button style="background: none; border: none; color: #68769C; cursor: pointer; font-size: 16px; padding: 4px;">⋯</button>
            </div>
        </div>
        
        <!-- Card Content -->
        <div style="padding: 16px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div style="text-align: center;">
                    <div style="font-size: 24px; font-weight: 600; color: #8E9AAF; margin-bottom: 4px;">1,234</div>
                    <div style="font-size: 12px; color: #68769C;">Active Users</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 24px; font-weight: 600; color: #038387; margin-bottom: 4px;">89.5%</div>
                    <div style="font-size: 12px; color: #68769C;">Satisfaction</div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Card with Status Header -->
    <div style="background: white; border: 1px solid #edebe9; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); max-width: 380px;">
        <!-- Card Header with Status -->
        <div style="padding: 16px; border-bottom: 1px solid #f3f2f1;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <h4 style="margin: 0; font-size: 16px; font-weight: 600; color: #3C4858;">System Status</h4>
                <span style="background: #f3f9fd; color: #8E9AAF; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">Operational</span>
            </div>
            <p style="margin: 0; font-size: 12px; color: #68769C;">All systems are running normally</p>
        </div>
        
        <!-- Card Content -->
        <div style="padding: 16px;">
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 14px; color: #3C4858;">API Services</span>
                    <span style="background: #f3f9fd; color: #8E9AAF; padding: 2px 6px; border-radius: 10px; font-size: 11px; font-weight: 600;">99.9%</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 14px; color: #3C4858;">Database</span>
                    <span style="background: #f3f9fd; color: #8E9AAF; padding: 2px 6px; border-radius: 10px; font-size: 11px; font-weight: 600;">100%</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 14px; color: #3C4858;">CDN</span>
                    <span style="background: #fff9f5; color: #ff8c00; padding: 2px 6px; border-radius: 10px; font-size: 11px; font-weight: 600;">98.2%</span>
                </div>
            </div>
        </div>
    </div>
</div>`},{id:"fluentui-card-preview",name:"FluentUI Card Preview",description:"Card preview with media and content preview",category:"Cards",htmlCode:`<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; background: white;">
    <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #3C4858;">Card Preview Examples</h3>
    
    <!-- Image Preview Card -->
    <div style="background: white; border: 1px solid #edebe9; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); margin-bottom: 24px; max-width: 320px; overflow: hidden;">
        <!-- Card Preview Section -->
        <div style="position: relative; height: 180px; background: linear-gradient(135deg, #8E9AAF, #68769C); overflow: hidden;">
            <img src="https://via.placeholder.com/320x180/0078d4/ffffff?text=Preview+Image" 
                 alt="Preview" 
                 style="width: 100%; height: 100%; object-fit: cover;" />
            
            <!-- Preview Overlay -->
            <div style="position: absolute; top: 8px; right: 8px; background: rgba(0, 0, 0, 0.6); color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">
                NEW
            </div>
            
            <!-- Preview Actions -->
            <div style="position: absolute; bottom: 8px; left: 8px; display: flex; gap: 8px;">
                <button style="background: rgba(255, 255, 255, 0.9); border: none; color: #3C4858; padding: 6px 8px; border-radius: 16px; font-size: 12px; cursor: pointer; backdrop-filter: blur(4px);">
                    👁️ Preview
                </button>
                <button style="background: rgba(255, 255, 255, 0.9); border: none; color: #3C4858; padding: 6px 8px; border-radius: 16px; font-size: 12px; cursor: pointer; backdrop-filter: blur(4px);">
                    ❤️ Like
                </button>
            </div>
        </div>
        
        <!-- Card Content -->
        <div style="padding: 16px;">
            <h4 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #3C4858;">New Product Launch</h4>
            <p style="margin: 0 0 12px 0; font-size: 14px; color: #68769C; line-height: 1.4;">Introducing our latest innovation that will transform the way you work and collaborate.</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 12px; color: #68769C;">Dec 15, 2024</span>
                <button style="background: #8E9AAF; border: none; color: white; padding: 6px 12px; border-radius: 4px; font-size: 13px; cursor: pointer;">Learn More</button>
            </div>
        </div>
    </div>
    
    <!-- Video Preview Card -->
    <div style="background: white; border: 1px solid #edebe9; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); margin-bottom: 24px; max-width: 320px; overflow: hidden;">
        <!-- Video Preview Section -->
        <div style="position: relative; height: 180px; background: #000; display: flex; align-items: center; justify-content: center; overflow: hidden;">
            <div style="position: absolute; inset: 0; background: url('https://via.placeholder.com/320x180/000000/ffffff?text=Video+Thumbnail') center/cover;"></div>
            
            <!-- Play Button -->
            <button style="position: relative; z-index: 2; width: 60px; height: 60px; border-radius: 50%; background: rgba(255, 255, 255, 0.9); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 20px; backdrop-filter: blur(4px);">
                ▶️
            </button>
            
            <!-- Duration -->
            <div style="position: absolute; bottom: 8px; right: 8px; background: rgba(0, 0, 0, 0.8); color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600;">
                3:45
            </div>
        </div>
        
        <!-- Card Content -->
        <div style="padding: 16px;">
            <h4 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #3C4858;">Tutorial: Getting Started</h4>
            <p style="margin: 0 0 12px 0; font-size: 14px; color: #68769C; line-height: 1.4;">Learn the basics of our platform in this comprehensive tutorial video.</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 12px; color: #68769C;">1.2K views</span>
                    <span style="font-size: 12px; color: #68769C;">•</span>
                    <span style="font-size: 12px; color: #68769C;">5 days ago</span>
                </div>
                <button style="background: none; border: 1px solid #d1d1d1; color: #3C4858; padding: 6px 12px; border-radius: 4px; font-size: 13px; cursor: pointer;">Save</button>
            </div>
        </div>
    </div>
    
    <!-- Document Preview Card -->
    <div style="background: white; border: 1px solid #edebe9; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); max-width: 320px; overflow: hidden;">
        <!-- Document Preview Section -->
        <div style="position: relative; height: 180px; background: #f8f9fa; border-bottom: 1px solid #edebe9; display: flex; flex-direction: column; padding: 16px;">
            <!-- Document Header -->
            <div style="display: flex; justify-content: between; align-items: flex-start; margin-bottom: 12px;">
                <div style="flex: 1;">
                    <div style="font-size: 18px; font-weight: 600; color: #3C4858; margin-bottom: 4px;">Q4 Report</div>
                    <div style="font-size: 12px; color: #68769C;">Microsoft Word Document</div>
                </div>
                <div style="width: 32px; height: 32px; background: #8E9AAF; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: 600;">
                    W
                </div>
            </div>
            
            <!-- Document Preview Content -->
            <div style="flex: 1; overflow: hidden;">
                <div style="font-size: 12px; color: #3C4858; line-height: 1.3; margin-bottom: 8px;">
                    <strong>Executive Summary</strong>
                </div>
                <div style="font-size: 11px; color: #68769C; line-height: 1.2;">
                    This quarter showed significant growth across all key metrics. Revenue increased by 23% compared to the previous quarter, with customer satisfaction reaching an all-time high...
                </div>
            </div>
            
            <!-- Document Stats -->
            <div style="display: flex; justify-content: between; font-size: 10px; color: #68769C; margin-top: 8px;">
                <span>12 pages</span>
                <span>Last modified: 2 hours ago</span>
            </div>
        </div>
        
        <!-- Card Content -->
        <div style="padding: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <div>
                    <div style="font-size: 14px; font-weight: 600; color: #3C4858;">Quarterly Business Report</div>
                    <div style="font-size: 12px; color: #68769C;">by Sarah Johnson</div>
                </div>
                <button style="background: none; border: none; color: #68769C; cursor: pointer; font-size: 16px; padding: 4px;">⋯</button>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; gap: 8px;">
                    <button style="background: #8E9AAF; border: none; color: white; padding: 6px 12px; border-radius: 4px; font-size: 13px; cursor: pointer;">Open</button>
                    <button style="background: none; border: 1px solid #d1d1d1; color: #3C4858; padding: 6px 12px; border-radius: 4px; font-size: 13px; cursor: pointer;">Download</button>
                </div>
                <span style="background: #f3f9fd; color: #8E9AAF; padding: 2px 6px; border-radius: 10px; font-size: 11px; font-weight: 600;">Shared</span>
            </div>
        </div>
    </div>
</div>`},{id:"fluentui-compound-button",name:"FluentUI Compound Button",description:"Buttons with primary and secondary text content",category:"Buttons",htmlCode:`<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; background: white;">
    <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #3C4858;">Compound Button Examples</h3>
    
    <!-- Primary Compound Buttons -->
    <div style="margin-bottom: 24px;">
        <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #3C4858;">Primary Compound Buttons</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 16px;">
            
            <!-- Create New Project -->
            <button style="background: #8E9AAF; border: none; color: white; padding: 12px 16px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 12px; min-width: 200px; text-align: left; transition: background 0.2s;"
                    onmouseover="this.style.background='#68769C'" 
                    onmouseout="this.style.background='#8E9AAF'">
                <div style="font-size: 24px;">📁</div>
                <div>
                    <div style="font-size: 14px; font-weight: 600; margin-bottom: 2px;">Create New Project</div>
                    <div style="font-size: 12px; opacity: 0.9;">Start a new project from scratch</div>
                </div>
            </button>
            
            <!-- Import Data -->
            <button style="background: #8E9AAF; border: none; color: white; padding: 12px 16px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 12px; min-width: 200px; text-align: left; transition: background 0.2s;"
                    onmouseover="this.style.background='#68769C'" 
                    onmouseout="this.style.background='#8E9AAF'">
                <div style="font-size: 24px;">📥</div>
                <div>
                    <div style="font-size: 14px; font-weight: 600; margin-bottom: 2px;">Import Data</div>
                    <div style="font-size: 12px; opacity: 0.9;">Upload files or connect data sources</div>
                </div>
            </button>
        </div>
    </div>
    
    <!-- Secondary Compound Buttons -->
    <div style="margin-bottom: 24px;">
        <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #3C4858;">Secondary Compound Buttons</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 16px;">
            
            <!-- View Templates -->
            <button style="background: transparent; border: 1px solid #d1d1d1; color: #3C4858; padding: 12px 16px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 12px; min-width: 200px; text-align: left; transition: all 0.2s;"
                    onmouseover="this.style.background='#f3f2f1'; this.style.borderColor='#c7c6c4'" 
                    onmouseout="this.style.background='transparent'; this.style.borderColor='#d1d1d1'">
                <div style="font-size: 24px;">📋</div>
                <div>
                    <div style="font-size: 14px; font-weight: 600; margin-bottom: 2px;">View Templates</div>
                    <div style="font-size: 12px; color: #68769C;">Browse pre-built templates</div>
                </div>
            </button>
            
            <!-- Settings -->
            <button style="background: transparent; border: 1px solid #d1d1d1; color: #3C4858; padding: 12px 16px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 12px; min-width: 200px; text-align: left; transition: all 0.2s;"
                    onmouseover="this.style.background='#f3f2f1'; this.style.borderColor='#c7c6c4'" 
                    onmouseout="this.style.background='transparent'; this.style.borderColor='#d1d1d1'">
                <div style="font-size: 24px;">⚙️</div>
                <div>
                    <div style="font-size: 14px; font-weight: 600; margin-bottom: 2px;">Settings</div>
                    <div style="font-size: 12px; color: #68769C;">Configure your preferences</div>
                </div>
            </button>
        </div>
    </div>
    
    <!-- Large Compound Buttons -->
    <div style="margin-bottom: 24px;">
        <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #3C4858;">Large Compound Buttons</h4>
        <div style="display: flex; flex-direction: column; gap: 12px; max-width: 400px;">
            
            <!-- Upgrade Plan -->
            <button style="background: linear-gradient(135deg, #8E9AAF, #68769C); border: none; color: white; padding: 16px 20px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 16px; text-align: left; transition: transform 0.2s; position: relative; overflow: hidden;"
                    onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(0, 120, 212, 0.3)'" 
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                <div style="font-size: 32px;">⭐</div>
                <div style="flex: 1;">
                    <div style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">Upgrade to Premium</div>
                    <div style="font-size: 13px; opacity: 0.9; line-height: 1.3;">Unlock advanced features and remove limitations</div>
                </div>
                <div style="font-size: 18px; opacity: 0.8;">→</div>
            </button>
            
            <!-- Team Collaboration -->
            <button style="background: white; border: 2px solid #edebe9; color: #3C4858; padding: 16px 20px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 16px; text-align: left; transition: all 0.2s;"
                    onmouseover="this.style.borderColor='#8E9AAF'; this.style.boxShadow='0 2px 8px rgba(0, 120, 212, 0.1)'" 
                    onmouseout="this.style.borderColor='#edebe9'; this.style.boxShadow='none'">
                <div style="font-size: 32px;">👥</div>
                <div style="flex: 1;">
                    <div style="font-size: 16px; font-weight: 600; margin-bottom: 4px; color: #3C4858;">Invite Team Members</div>
                    <div style="font-size: 13px; color: #68769C; line-height: 1.3;">Collaborate with your team in real-time</div>
                </div>
                <div style="font-size: 18px; color: #68769C;">→</div>
            </button>
        </div>
    </div>
    
    <!-- Action Cards Style -->
    <div>
        <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #3C4858;">Action Cards</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px;">
            
            <!-- Analytics -->
            <button style="background: white; border: 1px solid #edebe9; color: #3C4858; padding: 16px; border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);"
                    onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0, 0, 0, 0.15)'" 
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 1px 3px rgba(0, 0, 0, 0.1)'">
                <div style="font-size: 28px; margin-bottom: 8px;">📊</div>
                <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">Analytics</div>
                <div style="font-size: 12px; color: #68769C;">View performance metrics</div>
            </button>
            
            <!-- Reports -->
            <button style="background: white; border: 1px solid #edebe9; color: #3C4858; padding: 16px; border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);"
                    onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0, 0, 0, 0.15)'" 
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 1px 3px rgba(0, 0, 0, 0.1)'">
                <div style="font-size: 28px; margin-bottom: 8px;">📄</div>
                <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">Reports</div>
                <div style="font-size: 12px; color: #68769C;">Generate detailed reports</div>
            </button>
            
            <!-- Export -->
            <button style="background: white; border: 1px solid #edebe9; color: #3C4858; padding: 16px; border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);"
                    onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0, 0, 0, 0.15)'" 
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 1px 3px rgba(0, 0, 0, 0.1)'">
                <div style="font-size: 28px; margin-bottom: 8px;">📤</div>
                <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">Export</div>
                <div style="font-size: 12px; color: #68769C;">Download your data</div>
            </button>
        </div>
    </div>
</div>`},{id:"fluentui-menu-button",name:"FluentUI Menu Button",description:"Button with dropdown menu options",category:"Buttons",htmlCode:`<div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; background: white;">
    <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #3C4858;">Menu Button Examples</h3>
    
    <!-- Primary Menu Button -->
    <div style="margin-bottom: 24px;">
        <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #3C4858;">Primary Menu Button</h4>
        <div style="position: relative; display: inline-block;">
            <button onclick="toggleMenu('menu1')" 
                    style="background: #8E9AAF; border: none; color: white; padding: 8px 12px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600;">
                New Item
                <span style="font-size: 12px;">▼</span>
            </button>
            
            <div id="menu1" style="display: none; position: absolute; top: 100%; left: 0; background: white; border: 1px solid #d1d1d1; border-radius: 4px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); z-index: 1000; min-width: 160px; margin-top: 4px;">
                <div onclick="selectOption('Document')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #3C4858; border-bottom: 1px solid #f3f2f1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'">
                    📄 Document
                </div>
                <div onclick="selectOption('Spreadsheet')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #3C4858; border-bottom: 1px solid #f3f2f1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'">
                    📊 Spreadsheet
                </div>
                <div onclick="selectOption('Presentation')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #3C4858; border-bottom: 1px solid #f3f2f1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'">
                    📈 Presentation
                </div>
                <div onclick="selectOption('Folder')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #3C4858;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'">
                    📁 Folder
                </div>
            </div>
        </div>
    </div>
    
    <!-- Secondary Menu Button -->
    <div style="margin-bottom: 24px;">
        <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #3C4858;">Secondary Menu Button</h4>
        <div style="position: relative; display: inline-block;">
            <button onclick="toggleMenu('menu2')" 
                    style="background: transparent; border: 1px solid #d1d1d1; color: #3C4858; padding: 8px 12px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 14px;">
                Actions
                <span style="font-size: 12px;">▼</span>
            </button>
            
            <div id="menu2" style="display: none; position: absolute; top: 100%; left: 0; background: white; border: 1px solid #d1d1d1; border-radius: 4px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); z-index: 1000; min-width: 140px; margin-top: 4px;">
                <div onclick="selectOption('Edit')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #3C4858; border-bottom: 1px solid #f3f2f1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'">
                    ✏️ Edit
                </div>
                <div onclick="selectOption('Copy')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #3C4858; border-bottom: 1px solid #f3f2f1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'">
                    📋 Copy
                </div>
                <div onclick="selectOption('Share')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #3C4858; border-bottom: 1px solid #f3f2f1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'">
                    🔗 Share
                </div>
                <div onclick="selectOption('Delete')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #d13438;" 
                     onmouseover="this.style.background='#fdf6f6'" 
                     onmouseout="this.style.background='white'">
                    🗑️ Delete
                </div>
            </div>
        </div>
    </div>
    
    <!-- Icon Menu Button -->
    <div style="margin-bottom: 24px;">
        <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #3C4858;">Icon Menu Button</h4>
        <div style="position: relative; display: inline-block;">
            <button onclick="toggleMenu('menu3')" 
                    style="background: #f3f2f1; border: 1px solid #d1d1d1; color: #3C4858; padding: 8px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; font-size: 16px;">
                ⋯
            </button>
            
            <div id="menu3" style="display: none; position: absolute; top: 100%; right: 0; background: white; border: 1px solid #d1d1d1; border-radius: 4px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); z-index: 1000; min-width: 160px; margin-top: 4px;">
                <div onclick="selectOption('View Details')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #3C4858; border-bottom: 1px solid #f3f2f1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'">
                    👁️ View Details
                </div>
                <div onclick="selectOption('Download')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #3C4858; border-bottom: 1px solid #f3f2f1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'">
                    💾 Download
                </div>
                <div onclick="selectOption('Properties')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #3C4858; border-bottom: 1px solid #f3f2f1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'">
                    ⚙️ Properties
                </div>
                <div onclick="selectOption('Move to Trash')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #d13438;" 
                     onmouseover="this.style.background='#fdf6f6'" 
                     onmouseout="this.style.background='white'">
                    🗑️ Move to Trash
                </div>
            </div>
        </div>
    </div>
    
    <!-- Split Menu Button -->
    <div style="margin-bottom: 24px;">
        <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #3C4858;">Split Menu Button</h4>
        <div style="display: flex;">
            <!-- Main Action -->
            <button onclick="selectOption('Save')" 
                    style="background: #8E9AAF; border: none; color: white; padding: 8px 16px; border-radius: 4px 0 0 4px; cursor: pointer; font-size: 14px; font-weight: 600;">
                Save
            </button>
            
            <!-- Dropdown Part -->
            <div style="position: relative; display: inline-block;">
                <button onclick="toggleMenu('menu4')" 
                        style="background: #68769C; border: none; color: white; padding: 8px; border-radius: 0 4px 4px 0; cursor: pointer; font-size: 12px; border-left: 1px solid rgba(255, 255, 255, 0.2);">
                    ▼
                </button>
                
                <div id="menu4" style="display: none; position: absolute; top: 100%; right: 0; background: white; border: 1px solid #d1d1d1; border-radius: 4px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); z-index: 1000; min-width: 140px; margin-top: 4px;">
                    <div onclick="selectOption('Save As')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #3C4858; border-bottom: 1px solid #f3f2f1;" 
                         onmouseover="this.style.background='#f3f2f1'" 
                         onmouseout="this.style.background='white'">
                        💾 Save As...
                    </div>
                    <div onclick="selectOption('Save Copy')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #3C4858; border-bottom: 1px solid #f3f2f1;" 
                         onmouseover="this.style.background='#f3f2f1'" 
                         onmouseout="this.style.background='white'">
                        📋 Save Copy
                    </div>
                    <div onclick="selectOption('Export')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #3C4858;" 
                         onmouseover="this.style.background='#f3f2f1'" 
                         onmouseout="this.style.background='white'">
                        📤 Export
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Context Menu Button -->
    <div>
        <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #3C4858;">Context Menu Button</h4>
        <div style="position: relative; display: inline-block;">
            <button onclick="toggleMenu('menu5')" 
                    style="background: white; border: 1px solid #d1d1d1; color: #3C4858; padding: 8px 12px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 14px;">
                📁 Project Folder
                <span style="font-size: 12px;">▼</span>
            </button>
            
            <div id="menu5" style="display: none; position: absolute; top: 100%; left: 0; background: white; border: 1px solid #d1d1d1; border-radius: 4px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); z-index: 1000; min-width: 180px; margin-top: 4px;">
                <!-- Group 1 -->
                <div onclick="selectOption('Open')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #3C4858; border-bottom: 1px solid #f3f2f1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'">
                    📂 Open
                </div>
                <div onclick="selectOption('Open in New Window')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #3C4858; border-bottom: 1px solid #e1e1e1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'">
                    🪟 Open in New Window
                </div>
                
                <!-- Group 2 -->
                <div onclick="selectOption('Rename')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #3C4858; border-bottom: 1px solid #f3f2f1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'">
                    ✏️ Rename
                </div>
                <div onclick="selectOption('Move')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #3C4858; border-bottom: 1px solid #f3f2f1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'">
                    📦 Move
                </div>
                <div onclick="selectOption('Copy')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #3C4858; border-bottom: 1px solid #e1e1e1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'">
                    📋 Copy
                </div>
                
                <!-- Group 3 -->
                <div onclick="selectOption('Properties')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #3C4858; border-bottom: 1px solid #f3f2f1;" 
                     onmouseover="this.style.background='#f3f2f1'" 
                     onmouseout="this.style.background='white'">
                    ⚙️ Properties
                </div>
                <div onclick="selectOption('Delete')" style="padding: 8px 12px; cursor: pointer; font-size: 14px; color: #d13438;" 
                     onmouseover="this.style.background='#fdf6f6'" 
                     onmouseout="this.style.background='white'">
                    🗑️ Delete
                </div>
            </div>
        </div>
    </div>
    
    <script>
        function toggleMenu(menuId) {
            // Close all other menus
            const allMenus = document.querySelectorAll('[id^="menu"]');
            allMenus.forEach(menu => {
                if (menu.id !== menuId) {
                    menu.style.display = 'none';
                }
            });
            
            // Toggle the target menu
            const menu = document.getElementById(menuId);
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        }
        
        function selectOption(option) {
            alert('Selected: ' + option);
            // Close all menus
            const allMenus = document.querySelectorAll('[id^="menu"]');
            allMenus.forEach(menu => menu.style.display = 'none');
        }
        
        // Close menus when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('button') && !event.target.closest('[id^="menu"]')) {
                const allMenus = document.querySelectorAll('[id^="menu"]');
                allMenus.forEach(menu => menu.style.display = 'none');
            }
        });
    <\/script>
</div>`}],S=P=>{console.log("🚀 Component clicked:",P.name),c(P),d()},[E,F]=g.useState("All"),T=g.useMemo(()=>["All",...Array.from(new Set(C.map(U=>U.category))).sort()],[]),H=g.useMemo(()=>E==="All"?C:C.filter(P=>P.category===E),[E]);return i.jsx("div",{className:"component-library-modal-overlay",children:i.jsxs("div",{className:"component-library-modal",children:[i.jsxs("div",{className:"component-library-header",children:[i.jsxs("div",{className:"component-library-title",children:[i.jsx("div",{className:"fluentui-logo",children:"F"}),i.jsxs("div",{children:[i.jsx("h2",{children:"FluentUI Component Library"}),i.jsx("p",{className:"library-instructions",children:"Click components to add them to your wireframe"})]})]}),i.jsx("button",{onClick:d,className:"component-library-close",children:"×"})]}),i.jsxs("div",{className:"component-library-content",children:[i.jsxs("div",{className:"component-library-sidebar",children:[i.jsx("h3",{children:"Categories"}),i.jsx("div",{className:"category-filters",children:T.map(P=>i.jsxs("button",{onClick:()=>F(P),className:`category-button ${E===P?"active":""}`,children:[P,i.jsxs("span",{className:"category-count",children:["(",P==="All"?C.length:C.filter(U=>U.category===P).length,")"]})]},P))})]}),i.jsxs("div",{className:"component-library-main",children:[i.jsx("div",{className:"component-library-grid",children:H.map(P=>i.jsxs("div",{onClick:()=>S(P),className:"component-item",children:[i.jsx("div",{className:"component-preview",children:i.jsx("div",{dangerouslySetInnerHTML:{__html:P.htmlCode}})}),i.jsxs("div",{className:"component-info",children:[i.jsx("h4",{children:P.name}),i.jsx("p",{children:P.description}),i.jsx("span",{className:"component-category",children:P.category})]})]},P.id))}),x&&h&&i.jsxs("div",{className:"ai-generation-section",children:[i.jsx("h3",{children:"Or Generate with AI"}),i.jsxs("p",{children:['Skip the component selection and let AI generate a complete wireframe for: "',i.jsx("em",{children:h}),'"']}),i.jsx("button",{onClick:()=>{x(h),d()},className:"ai-generation-button",children:"🤖 Generate with AI"})]})]})]})]})})},Sf=({htmlContent:s,onUpdateHtml:d,onNavigateToPage:c,availablePages:x})=>{const h=g.useRef(null),[C,S]=g.useState(!1),[E,F]=g.useState({x:0,y:0}),[T,H]=g.useState(null),[P,U]=g.useState(!1),[Z,pe]=g.useState({x:0,y:0}),[k,G]=g.useState(null),[ae,le]=g.useState(!1);g.useEffect(()=>{console.log("🔄 LinkableWireframe: htmlContent changed",{length:(s==null?void 0:s.length)||0,preview:(s==null?void 0:s.substring(0,100))+"...",hasContent:!!s})},[s]),console.log("LinkableWireframe mounted with:",{htmlContent:(s==null?void 0:s.substring(0,100))+"...",availablePages:x,availablePagesCount:x.length});const ne=g.useCallback(z=>{var V;const R=z.tagName.toLowerCase(),y=z.hasAttribute("data-linkable")||z.hasAttribute("data-page-link"),D=z.classList.contains("button")||z.classList.contains("btn")||z.classList.contains("link")||z.classList.contains("cta")||z.classList.contains("primary")||z.classList.contains("secondary")||z.classList.contains("card")||z.classList.contains("clickable"),B=window.getComputedStyle(z),N=B.cursor==="pointer"||B.cursor==="hand",j=/^(click|learn|view|get|start|sign|join|book|call|contact|about|home|services|portfolio|blog)/i.test(((V=z.textContent)==null?void 0:V.trim())||""),K=R==="button"||R==="a"||y||D||z.role==="button"||N||j;return z.textContent&&z.textContent.trim()&&console.log(`Checking element: "${z.textContent.trim()}"`,{tagName:R,hasLinkAttribute:y,hasButtonClass:D,looksClickable:N,hasActionText:j,isLinkable:K,classList:Array.from(z.classList),cursor:B.cursor}),K},[]),re=g.useCallback(z=>{var j;const R=z.classList.contains("atlas-component")||z.classList.contains("component-container")||z.classList.contains("card")||z.classList.contains("button")||z.classList.contains("form-group")||z.classList.contains("hero-section")||z.classList.contains("nav-section"),y=window.getComputedStyle(z),D=y.position==="absolute"||y.position==="relative",B=z.tagName.toLowerCase()==="div"&&(z.children.length>0||((j=z.textContent)==null?void 0:j.trim())),N=z.hasAttribute("data-draggable")||z.getAttribute("draggable")==="true";return!!(R||D||B||N)},[]),be=g.useCallback((z,R)=>{var B;z.preventDefault(),z.stopPropagation();const y=R.getBoundingClientRect();((B=h.current)==null?void 0:B.getBoundingClientRect())&&(pe({x:z.clientX-y.left,y:z.clientY-y.top}),G(R),U(!0),H(R),R.style.zIndex="1000",R.style.opacity="0.8",R.style.cursor="grabbing",R.setAttribute("data-dragging","true"),console.log("🎯 Started dragging element:",R.tagName,R.className))},[]),we=g.useCallback(z=>{if(!P||!k||!h.current)return;z.preventDefault();const R=h.current.getBoundingClientRect(),y=z.clientX-R.left-Z.x,D=z.clientY-R.top-Z.y;k.style.position="absolute",k.style.left=`${Math.max(0,y)}px`,k.style.top=`${Math.max(0,D)}px`,console.log("🎯 Dragging to:",y,D)},[P,k,Z]),ge=g.useCallback(()=>{k&&(k.style.zIndex="",k.style.opacity="",k.style.cursor="",U(!1),G(null),h.current&&d&&d(h.current.innerHTML),console.log("🎯 Finished dragging element"))},[k,d]),ke=g.useCallback(z=>{var K;const R=z.target;if(console.log("Element clicked:",R,"Text:",R.textContent),R.closest(".toolbar-btn")||R.classList.contains("toolbar-btn")){console.log("🔧 Toolbar button clicked, allowing event to proceed");return}let y=R,D=0;for(;y&&D<5&&(console.log(`Checking element at depth ${D}:`,y,"Is linkable:",ne(y)),!ne(y));)y=y.parentElement,D++;if(!y||!ne(y)){console.log("No linkable element found"),S(!1),H(null);return}console.log("Found linkable element:",y);const B=y.getAttribute("data-page-link");if(B&&x.find(V=>V.id===B)){console.log("Navigating to existing link:",B),z.preventDefault(),c(B);return}z.preventDefault();const N=y.getBoundingClientRect(),j=(K=h.current)==null?void 0:K.getBoundingClientRect();j&&(F({x:N.left-j.left+N.width/2,y:N.bottom-j.top+10}),H(y),S(!0))},[ne,x,c]);g.useEffect(()=>{const z=h.current;if(!z){console.log("❌ No container ref found");return}console.log("✅ Setting up click listeners on container:",z);const R=D=>{const B=D.target;if(console.log("🎯 Click captured!",B),B.closest(".toolbar-btn")||B.classList.contains("toolbar-btn")){console.log("🔧 Toolbar button clicked in capture, allowing event to proceed");return}ke(D)};z.addEventListener("click",ke),z.addEventListener("click",R,!0);const y=D=>{console.log("📄 Document click:",D.target)};return document.addEventListener("click",y),()=>{z.removeEventListener("click",ke),z.removeEventListener("click",R,!0),document.removeEventListener("click",y)}},[ke]);const Se=g.useCallback(z=>{var R;if(T){if(T.setAttribute("data-page-link",z),T.style.cursor="pointer",T.style.position="relative",!T.querySelector(".link-indicator")){const y=document.createElement("span");y.className="link-indicator",y.innerHTML="🔗",y.title=`Links to: ${(R=x.find(D=>D.id===z))==null?void 0:R.name}`,T.appendChild(y)}h.current&&d(h.current.innerHTML),S(!1),H(null)}},[T,x,d]),Fe=g.useCallback(()=>{if(!T)return;T.removeAttribute("data-page-link"),T.style.cursor="";const z=T.querySelector(".link-indicator");z&&z.remove(),h.current&&d(h.current.innerHTML),S(!1),H(null)},[T,d]);g.useEffect(()=>{const z=R=>{const y=R.target;!y.closest(".link-menu")&&!y.closest("[data-linkable]")&&(S(!1),H(null))};if(C)return document.addEventListener("click",z),()=>document.removeEventListener("click",z)},[C]),g.useEffect(()=>{const z=y=>{if(P&&k&&h.current){y.preventDefault();const D=h.current.getBoundingClientRect(),B=y.clientX-D.left-Z.x,N=y.clientY-D.top-Z.y;k.style.position="absolute",k.style.left=`${Math.max(0,B)}px`,k.style.top=`${Math.max(0,N)}px`}},R=()=>{P&&k&&(k.style.zIndex="",k.style.opacity="",k.style.cursor="",k.removeAttribute("data-dragging"),U(!1),G(null),h.current&&d&&d(h.current.innerHTML))};if(P)return document.addEventListener("mousemove",z),document.addEventListener("mouseup",R),()=>{document.removeEventListener("mousemove",z),document.removeEventListener("mouseup",R)}},[P,k,Z,d]),g.useEffect(()=>(console.log("🚀 LinkableWireframe component mounted"),()=>{console.log("💀 LinkableWireframe component unmounted")}),[]);const Ie=Ht.useMemo(()=>{if(!s||typeof s!="string")return"";let z=s.trim();return z=z.replace(/^[0'"]+|[0'"]+$/g,""),z=z.replace(/^'''html\s*/gi,""),z=z.replace(/^```html\s*/gi,""),z=z.replace(/```\s*$/gi,""),z.trim()},[s]);return i.jsxs("div",{className:"linkable-wireframe",ref:h,onMouseMove:we,onMouseUp:ge,onMouseLeave:ge,children:[Ie&&Ie.length>0?i.jsx("div",{dangerouslySetInnerHTML:{__html:Ie},onMouseDown:z=>{const R=z.target;if(z.button===2&&ne(R)){ke(z.nativeEvent);return}z.button===0&&re(R)&&(ae||(le(!0),setTimeout(()=>le(!1),3e3)),be(z,R))}}):i.jsx("div",{className:"empty-page",children:i.jsxs("div",{className:"empty-page-content",children:[i.jsx("h3",{children:"📄 Empty Page"}),i.jsx("p",{children:"This page doesn't have any content yet."}),i.jsx("p",{children:"Ask the AI to generate content for this page, or copy content from another page."})]})}),C&&i.jsxs("div",{className:"link-menu",style:{"--menu-x":`${E.x}px`,"--menu-y":`${E.y}px`},children:[i.jsxs("div",{className:"link-menu-header",children:[i.jsx("h4",{children:"Link to Page"}),i.jsx("button",{className:"close-menu",onClick:()=>S(!1),children:"×"})]}),i.jsxs("div",{className:"link-menu-content",children:[x.length>0?i.jsx("div",{className:"page-options",children:x.map(z=>i.jsxs("button",{className:"page-option",onClick:()=>Se(z.id),children:[i.jsxs("span",{className:"page-icon",children:[z.type==="page"&&"📄",z.type==="modal"&&"🔲",z.type==="component"&&"🧩"]}),i.jsxs("div",{className:"page-info",children:[i.jsx("div",{className:"page-name",children:z.name}),i.jsx("div",{className:"page-description",children:z.description})]})]},z.id))}):i.jsxs("div",{className:"no-pages",children:[i.jsx("p",{children:"No pages available to link to."}),i.jsx("p",{children:"Create some pages first!"})]}),(T==null?void 0:T.hasAttribute("data-page-link"))&&i.jsx("div",{className:"link-actions",children:i.jsx("button",{className:"remove-link",onClick:Fe,children:"Remove Link"})})]})]}),ae&&i.jsx("div",{className:"drag-hint",children:"🎯 Drag components to move them around! Right-click buttons to add page links."})]})},bl=({message:s,onReact:d,reactions:c=[]})=>{const x=()=>{switch(s.status){case"sending":return i.jsx(ef,{className:"status-icon sending"});case"sent":return i.jsx(Bt,{className:"status-icon sent"});case"delivered":return i.jsxs("div",{className:"status-icon delivered",children:[i.jsx(Bt,{}),i.jsx(Bt,{})]});case"read":return i.jsxs("div",{className:"status-icon read",children:[i.jsx(Bt,{}),i.jsx(Bt,{})]});default:return null}};return i.jsxs("div",{className:`enhanced-message ${s.type}-message`,children:[i.jsx("div",{className:"message-avatar",children:s.type==="user"?i.jsx(pf,{className:"avatar-icon"}):i.jsx(mo,{className:"avatar-icon ai-avatar"})}),i.jsxs("div",{className:"message-body",children:[i.jsxs("div",{className:"message-header",children:[i.jsx("span",{className:"message-sender",children:s.type==="user"?"You":"AI Assistant"}),i.jsx("span",{className:"message-time",children:s.timestamp.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}),x()]}),i.jsx("div",{className:"message-content-wrapper",children:i.jsx("div",{className:"message-content",children:s.content})}),c.length>0&&i.jsx("div",{className:"message-reactions",children:c.map((h,C)=>i.jsxs("button",{className:`reaction-btn ${h.userReacted?"user-reacted":""}`,onClick:()=>d==null?void 0:d(s.id,h.emoji),children:[i.jsx("span",{className:"reaction-emoji",children:h.emoji}),i.jsx("span",{className:"reaction-count",children:h.count})]},C))})]})]})},Cf=({pages:s,currentPageId:d,onPageSwitch:c})=>{console.log("🔥 PageNavigation render with:",{pages:s.map(h=>({id:h.id,name:h.name})),currentPageId:d});const x=h=>["First","Second","Third","Fourth","Fifth","Sixth","Seventh","Eighth","Ninth","Tenth"][h]||`Page ${h+1}`;return!s||s.length===0?null:i.jsx("div",{className:"page-navigation breadcrumb-style",children:i.jsx("div",{className:"breadcrumb-container",children:s.map((h,C)=>i.jsxs(Ht.Fragment,{children:[i.jsx("button",{className:`breadcrumb-item ${d===h.id?"active":""}`,onClick:()=>c(h.id),title:`${h.name} - ${h.description}`,children:x(C)}),C<s.length-1&&i.jsx("span",{className:"breadcrumb-separator",children:"/"})]},h.id))})})},jf=({isOpen:s,onClose:d,htmlContent:c,title:x="HTML Code"})=>{const[h,C]=g.useState(!1);if(!s)return null;const S=()=>ze(null,null,function*(){try{yield navigator.clipboard.writeText(c),C(!0),setTimeout(()=>C(!1),2e3)}catch(T){console.error("Failed to copy text: ",T)}}),E=()=>{const T=new Blob([c],{type:"text/html"}),H=URL.createObjectURL(T),P=document.createElement("a");P.href=H,P.download="wireframe.html",document.body.appendChild(P),P.click(),document.body.removeChild(P),URL.revokeObjectURL(H)},F=T=>T.replace(/></g,`>
<`).replace(/^\s*\n/gm,"").split(`
`).map(H=>H.trim()).filter(H=>H.length>0).join(`
`);return i.jsx("div",{className:"html-code-overlay",children:i.jsxs("div",{className:"html-code-modal",children:[i.jsxs("div",{className:"html-code-header",children:[i.jsxs("div",{className:"header-left",children:[i.jsx("h2",{children:x}),i.jsx("p",{children:"Copy or download the HTML code for your wireframe"})]}),i.jsxs("div",{className:"header-right",children:[i.jsxs("button",{className:"code-action-btn",onClick:S,title:"Copy to Clipboard",children:[h?i.jsx(Bt,{}):i.jsx(Nd,{}),h?"Copied!":"Copy"]}),i.jsxs("button",{className:"code-action-btn",onClick:E,title:"Download HTML File",children:[i.jsx(go,{}),"Download"]}),i.jsx("button",{className:"close-btn",onClick:d,title:"Close Code Viewer",children:i.jsx(tn,{})})]})]}),i.jsx("div",{className:"html-code-content",children:i.jsx("pre",{className:"html-code-block",children:i.jsx("code",{children:F(c)})})}),i.jsxs("div",{className:"html-code-footer",children:[i.jsx("div",{className:"footer-info",children:i.jsxs("small",{children:[c.length," characters • Ready to use HTML code"]})}),i.jsx("button",{className:"btn-secondary",onClick:d,children:"Close"})]})]})})},Nf=({isOpen:s,onClose:d,wireframeName:c,wireframeDescription:x,pages:h})=>{const[C,S]=g.useState(0),[E,F]=g.useState(!1);g.useEffect(()=>{if(!s)return;const Z=pe=>{switch(pe.key){case"ArrowLeft":H();break;case"ArrowRight":T();break;case"Escape":d();break;case"f":case"F":P();break}};return document.addEventListener("keydown",Z),()=>document.removeEventListener("keydown",Z)},[s,C,h.length]),g.useEffect(()=>{s&&S(0)},[s]);const T=g.useCallback(()=>{C<h.length-1&&S(Z=>Z+1)},[C,h.length]),H=g.useCallback(()=>{C>0&&S(Z=>Z-1)},[C]),P=g.useCallback(()=>{F(Z=>!Z)},[]);if(!s||h.length===0)return null;const U=h[C];return i.jsxs("div",{className:`presentation-mode ${E?"fullscreen":""}`,children:[i.jsx("div",{className:"presentation-overlay",onClick:d}),i.jsxs("div",{className:"presentation-container",children:[i.jsxs("div",{className:"presentation-header",children:[i.jsxs("div",{className:"presentation-info",children:[i.jsx("h2",{className:"presentation-title",children:c}),x&&i.jsx("p",{className:"presentation-description",children:x})]}),i.jsxs("div",{className:"presentation-controls",children:[i.jsx("button",{className:"presentation-btn",onClick:P,title:E?"Exit Fullscreen (F)":"Fullscreen (F)",children:E?i.jsx(af,{}):i.jsx(of,{})}),i.jsx("button",{className:"presentation-btn presentation-close",onClick:d,title:"Close Presentation (Esc)",children:i.jsx(tn,{})})]})]}),h.length>1&&i.jsxs("div",{className:"presentation-nav",children:[i.jsx("button",{className:"nav-btn prev",onClick:H,disabled:C===0,title:"Previous Page (←)",children:i.jsx(Xp,{})}),i.jsxs("div",{className:"page-indicator",children:[i.jsx("span",{className:"current-page",children:C+1}),i.jsx("span",{className:"page-separator",children:"/"}),i.jsx("span",{className:"total-pages",children:h.length})]}),i.jsx("button",{className:"nav-btn next",onClick:T,disabled:C===h.length-1,title:"Next Page (→)",children:i.jsx(Jp,{})})]}),i.jsxs("div",{className:"presentation-content",children:[i.jsxs("div",{className:"page-header",children:[i.jsx("h3",{className:"page-title",children:U.name}),U.description&&i.jsx("p",{className:"page-description",children:U.description})]}),i.jsx("div",{className:"wireframe-display",children:i.jsx("iframe",{srcDoc:U.content,className:"wireframe-iframe",title:`${U.name} Preview`,sandbox:"allow-same-origin allow-scripts"})})]}),h.length>1&&i.jsx("div",{className:"page-thumbnails",children:h.map((Z,pe)=>i.jsxs("button",{className:`thumbnail ${pe===C?"active":""}`,onClick:()=>S(pe),title:Z.name,children:[i.jsx("div",{className:"thumbnail-preview",children:i.jsx("iframe",{srcDoc:Z.content,className:"thumbnail-iframe",title:`${Z.name} Thumbnail`,sandbox:"allow-same-origin"})}),i.jsx("span",{className:"thumbnail-label",children:Z.name})]},Z.id))}),i.jsx("div",{className:"presentation-help",children:i.jsx("small",{children:"Use ← → arrows to navigate • Press F for fullscreen • Press Esc to exit"})})]})]})};function Ef(s){return ze(this,null,function*(){try{console.log("Starting PowerPoint export...");let d="";typeof s=="string"?d=s:s&&typeof s=="object"?s.pageContents?d=Object.values(s.pageContents).join(`
`):s.main?d=s.main:d=JSON.stringify(s):d=String(s||"");const x=`
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Wireframe Export</title>
          <style>
            body {
              font-family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif;
              margin: 20px;
              background: white;
            }
            .wireframe-container {
              border: 1px solid #ccc;
              padding: 20px;
              border-radius: 8px;
            }
          </style>
        </head>
        <body>
          <div class="wireframe-container">
            <h1>Wireframe Export</h1>
            <div class="content">
              ${d.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,"").replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,"").replace(/class="[^"]*"/g,"").replace(/id="[^"]*"/g,"")}
            </div>
          </div>
        </body>
      </html>
    `,h=new Blob([x],{type:"text/html"}),C=URL.createObjectURL(h),S=document.createElement("a");return S.href=C,S.download=`wireframe-export-${Date.now()}.html`,document.body.appendChild(S),S.click(),document.body.removeChild(S),URL.revokeObjectURL(C),{success:!0,message:"PowerPoint export completed successfully!"}}catch(d){return console.error("PowerPoint export failed:",d),{success:!1,message:"PowerPoint export failed. Please try again."}}})}const zf=(s,d="Wireframe")=>ze(null,null,function*(){try{const c={title:d,content:s,timestamp:new Date().toISOString(),id:bd()},x=`data:text/html;charset=utf-8,${encodeURIComponent(s)}`;return navigator.clipboard&&navigator.clipboard.writeText&&(yield navigator.clipboard.writeText(x)),{success:!0,shareUrl:x,shareId:c.id,message:"Share URL generated and copied to clipboard!",instructions:"Share this URL to let others view your wireframe. The URL contains the complete wireframe data."}}catch(c){return console.error("Generate share URL failed:",c),{success:!0,shareUrl:`data:text/html;charset=utf-8,${encodeURIComponent(s)}`,shareId:bd(),message:"Share URL generated (fallback mode)",instructions:"Copy this URL to share your wireframe."}}}),bd=()=>Math.random().toString(36).substring(2)+Date.now().toString(36),Lf=({description:s,setDescription:d,handleSubmit:c,loading:x,loadingStage:h,fallback:C,processingTime:S,handleStop:E,showAiSuggestions:F,aiSuggestions:T,suggestionLoading:H,isAiSourced:P=!1,setShowAiSuggestions:U,onGenerateAiSuggestions:Z,error:pe,htmlWireframe:k,setHtmlWireframe:G,onAiSuggestionClick:ae,designTheme:le,colorScheme:ne,onAddComponent:re,onGeneratePageContent:be})=>{var Wt;const we=g.useRef(null),ge=g.useRef(null),ke=g.useRef(!1),[Se,Fe]=g.useState([]),[Ie,z]=g.useState(!1),[R,y]=g.useState([]),[D,B]=g.useState(null),[N,j]=g.useState({}),[K,V]=g.useState(!1),[m,M]=g.useState(!1),[oe,se]=g.useState(!1),[ye,xe]=g.useState(!1),[Le,Ce]=g.useState([]),[Ne,Xe]=g.useState(!1),[yt,En]=g.useState(),[nn,zn]=g.useState({}),[Xn,Ln]=g.useState(!1),[Tn,Mn]=g.useState(!1),[Pn,Lt]=g.useState(!1);g.useEffect(()=>{console.log("🧹 SplitLayout mounted - clearing AI suggestions"),U(!1)},[U]);const he=g.useCallback((L,ce)=>{const ie={id:Date.now().toString(),type:L,content:ce,timestamp:new Date};Fe(fe=>[...fe,ie])},[]);g.useEffect(()=>{if(console.log("🔥 useEffect for Home page:",{htmlWireframe:!!k,htmlWireframeLength:k==null?void 0:k.length,wireframePagesLength:R.length}),k&&R.length===0){console.log("🔥 Creating Home page automatically");const L={id:"home-page",name:"Home",description:"Main landing page",type:"page"};y([L]),B(L.id),j(ce=>_e(Ee({},ce),{[L.id]:k}))}},[k,R.length]),g.useEffect(()=>{var L;D&&k&&(console.log("🔄 Updating current page content:",{currentPageId:D,htmlWireframeLength:k.length,previousContent:((L=N[D])==null?void 0:L.length)||0}),j(ce=>_e(Ee({},ce),{[D]:k})))},[k,D]);const Fn=g.useCallback(L=>{console.log("🔥 handleAddPagesToWireframe called with pages:",L),console.log("🔥 Current wireframePages:",R);const ce=new Set(R.map(fe=>fe.id)),ie=L.filter(fe=>!ce.has(fe.id));if(console.log("🔥 New pages found:",ie),console.log("🔥 New pages with content:",ie.map(fe=>{var Be;return{id:fe.id,name:fe.name,hasContent:!!(fe.htmlContent&&fe.htmlContent.trim()),contentLength:((Be=fe.htmlContent)==null?void 0:Be.length)||0}})),console.log("🔥 Setting wireframePages to:",L),y(L),ie.length>0){const fe=ie[0];console.log("🔥 Switching to first new page:",fe),D&&k?j(Pe=>_e(Ee({},Pe),{[D]:k})):k&&!D&&j(Pe=>_e(Ee({},Pe),{[fe.id]:k}));const Be={};ie.forEach(Pe=>{Pe.htmlContent&&Pe.htmlContent.trim()&&(console.log(`🔥 Storing AI-generated content for page ${Pe.id}:`,Pe.htmlContent.substring(0,100)+"..."),Be[Pe.id]=Pe.htmlContent)}),Object.keys(Be).length>0&&j(Pe=>Ee(Ee({},Pe),Be)),console.log("🔥 Setting currentPageId to:",fe.id),B(fe.id),fe.htmlContent&&fe.htmlContent.trim()?(console.log("🔥 Loading AI-generated content for first new page"),G(fe.htmlContent),ie.length===1?he("ai",`🤖 Added "${fe.name}" page with AI-generated content! You can switch between pages using the navigation above.`):he("ai",`🤖 Added "${fe.name}" page with AI-generated content! Plus ${ie.length-1} other new page(s). You can switch between pages using the navigation above.`)):ie.length===1?he("ai",`📄 Added "${fe.name}" page and switched to it. You can now click on buttons and links in your wireframe to set up navigation between pages!`):he("ai",`📄 Added ${ie.length} new pages and switched to "${fe.name}". You can now click on buttons and links in your wireframe to set up navigation between pages!`)}console.log("🔥 Closing modal"),z(!1)},[D,k,he]),rn=g.useCallback(L=>ze(null,null,function*(){if(console.log("🔥 handlePageSwitch called with pageId:",L),D===L){console.log("🔥 Already on this page, skipping switch");return}if(D){const fe=N[D]||k;console.log("🔥 Saving current page content for:",D),j(Be=>_e(Ee({},Be),{[D]:fe}))}B(L);const ce=N[L],ie=R.find(fe=>fe.id===L);if(ce)console.log("🔥 Loading existing content for page:",L),G(ce),ie&&he("ai",`📄 Switched to "${ie.name}" page. Content loaded! You can click on buttons and links to set up navigation between pages.`);else if(ie&&ie.htmlContent&&ie.htmlContent.trim())console.log("🔥 Loading AI-generated content from page object for:",L),G(ie.htmlContent),j(fe=>_e(Ee({},fe),{[L]:ie.htmlContent})),he("ai",`📄 Switched to "${ie.name}" page with AI-generated content! You can click on buttons and links to set up navigation between pages.`);else if(console.log("🔥 New empty page detected:",L),ie){const fe=`
          <div style="max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: 'Segoe UI', sans-serif; background: #ffffff; min-height: 100vh;">
            <div style="background: #E9ECEF; padding: 60px 40px; border-radius: 12px; margin: 20px 0; text-align: center; border: 1px solid #e1dfdd;">
              <h1 style="color: #3C4858; margin: 0 0 16px 0; font-size: 28px; font-weight: 600;">📄 ${ie.name}</h1>
              <p style="color: #68769C; margin: 0 0 24px 0; font-size: 16px;">
                This is a new ${ie.type||"page"}. Click the buttons below or ask me to generate content for this page.
              </p>
              <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                <button style="background: #8E9AAF; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-weight: 600; transition: background-color 0.2s ease;">
                  Generate Content
                </button>
                <button style="background: #f3f2f1; color: #3C4858; border: 1px solid #e1dfdd; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-weight: 600; transition: background-color 0.2s ease;">
                  Copy from Home
                </button>
              </div>
            </div>
          </div>
        `;G(fe),j(Be=>_e(Ee({},Be),{[L]:fe})),he("ai",`📄 Switched to "${ie.name}" page. This is a new ${ie.type||"page"} ready for content! You can ask me to "generate content for ${ie.name}" or "create a ${ie.type} layout" and I'll customize it for you.`)}}),[D,k,N,R,he]),Jn=g.useCallback(()=>{z(!0)},[]),er=g.useCallback((L,ce)=>{zn(ie=>{const fe=ie[L]||[];return fe.find(Pe=>Pe.emoji===ce)?_e(Ee({},ie),{[L]:fe.map(Pe=>Pe.emoji===ce?_e(Ee({},Pe),{count:Pe.userReacted?Pe.count-1:Pe.count+1,userReacted:!Pe.userReacted}):Pe).filter(Pe=>Pe.count>0)}):_e(Ee({},ie),{[L]:[...fe,{emoji:ce,count:1,userReacted:!0}]})})},[]),tr=g.useCallback(()=>{V(!0)},[]),In=g.useCallback((L,ce)=>{console.log("Importing Figma file:",ce),G&&G(L),he("ai",`✅ Successfully imported "${ce}" from Figma! The wireframe has been converted and is ready for editing.`),V(!1)},[G,he]),W=g.useCallback(()=>{const L=document.createElement("input");L.type="file",L.accept=".html,.htm",L.onchange=ce=>{var fe;const ie=(fe=ce.target.files)==null?void 0:fe[0];if(ie){const Be=new FileReader;Be.onload=Pe=>{var ln;const zr=(ln=Pe.target)==null?void 0:ln.result;zr&&G&&(G(zr),he("ai",`✅ Successfully imported "${ie.name}"! The HTML wireframe is ready for editing.`))},Be.readAsText(ie)}},L.click()},[G,he]),Q=g.useCallback(L=>{console.log("Exporting to Figma as:",L),he("ai",`Wireframe exported to Figma as ${L} successfully! You can now access it in your Figma workspace.`),V(!1)},[he]),X=g.useCallback(()=>{Ln(!0)},[]),_=g.useCallback(L=>{he("user","[Image uploaded for analysis]"),setTimeout(()=>{he("ai","🔍 Analyzing your uploaded image for UI components. Please wait while I detect buttons, inputs, and other elements..."),console.log("Image data URL:",L)},500)},[he]),Ge=g.useCallback(()=>{M(L=>!L),m||se(!1)},[m]);g.useCallback(()=>{se(L=>!L),oe||M(!1)},[oe]),g.useCallback((L,ce)=>{d(ce),se(!1),he("user",`🎯 Demo: ${ce}`),setTimeout(()=>{c({preventDefault:()=>{}})},100)},[d,he,c]);const nt=g.useCallback(()=>{xe(!0),Xe(!1),En(void 0)},[]),Ae=g.useCallback(L=>ze(null,null,function*(){const ce=new Date().toISOString();if(Ne&&yt){const ie=_e(Ee(Ee({},yt),L),{updatedAt:ce});Ce(fe=>fe.map(Be=>Be.id===yt.id?ie:Be)),he("ai",`✅ Wireframe "${L.name}" updated successfully!`)}else{const ie=_e(Ee({},L),{id:`wireframe_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,createdAt:ce,updatedAt:ce});Ce(fe=>[...fe,ie]),he("ai",`💾 Wireframe "${L.name}" saved successfully! You can access it from the library.`)}localStorage.setItem("designetica_saved_wireframes",JSON.stringify(Le)),xe(!1)}),[Ne,yt,Le,he]),Dn=g.useCallback(()=>{Lt(!0)},[]),Vt=g.useCallback(()=>ze(null,null,function*(){try{const L={name:`Wireframe ${new Date().toLocaleDateString()}`,description:"Generated wireframe design",pages:R.length>0?R:[{id:"main",name:"Main Page",description:"Main wireframe page",type:"page"}],pageContents:R.length>0?N:{main:k||"<p>No content available</p>"}};yield Ef(L)}catch(L){console.error("PowerPoint export failed:",L)}}),[R,N,k]),jr=g.useCallback(()=>ze(null,null,function*(){try{const L={name:`Wireframe ${new Date().toLocaleDateString()}`,description:"Generated wireframe design",pages:R.length>0?R:[{id:"main",name:"Main Page",description:"Main wireframe page",type:"page"}],pageContents:R.length>0?N:{main:k||"<p>No content available</p>"}},ie=yield zf(k||"<p>No wireframe content available</p>",L.name);ie.success?(console.log("✅ Share URL generated:",ie.shareUrl),console.log("Share URL copied to clipboard!")):console.error("Failed to generate share URL:",ie.message)}catch(L){console.error("Share URL generation failed:",L)}}),[R,N,k]),Nr=g.useCallback(()=>{Mn(!0)},[]);g.useEffect(()=>{const L=localStorage.getItem("designetica_saved_wireframes");if(L)try{const ce=JSON.parse(L);Ce(ce)}catch(ce){console.error("Failed to load saved wireframes:",ce)}},[]);const Er=g.useCallback(()=>{nt()},[nt]),on=g.useCallback(L=>{L.preventDefault(),console.log("🚀 Direct AI generation called!",{description:s.trim(),loading:x}),s.trim()&&!x?(m&&M(!1),console.log("🤖 Direct AI approach: Calling handleSubmit for immediate AI generation"),(ke.current||Se.length>0)&&(he("user",s),he("ai","� Generating wireframe with Microsoft Learn components...")),c(L)):console.log("❌ enhancedHandleSubmit: Conditions not met",{descriptionTrimmed:s.trim(),descriptionLength:s.trim().length,loading:x})},[s,x,d,Se.length,m,M,he]),an=()=>{ge.current&&(ge.current.scrollTop=ge.current.scrollHeight)};return g.useEffect(()=>{an()},[Se,x]),g.useEffect(()=>{we.current&&we.current.focus()},[]),g.useEffect(()=>{if(k&&!x&&Se.length>0){const L=Se[Se.length-1];L&&L.type==="user"&&he("ai","✅ Wireframe created successfully! Check the preview on the right.")}},[k,x,Se,he]),g.useEffect(()=>{!ke.current&&s&&s.trim()&&(he("user",s),d(""),ke.current=!0)},[s,he,d]),i.jsxs("div",{className:"split-layout",children:[i.jsxs("div",{className:"left-pane",children:[i.jsxs("div",{className:"chat-messages",ref:ge,children:[Se.length===0&&!x&&i.jsx(bl,{message:{id:"welcome",type:"ai",content:"👋 Hello! I'm your AI wireframe assistant. Describe what you'd like to create and I'll generate a wireframe for you.",timestamp:new Date,status:"sent"}}),Se.map(L=>i.jsx(bl,{message:L,onReact:er,reactions:nn[L.id]||[]},L.id)),x&&i.jsx(bl,{message:{id:"loading",type:"ai",content:"Creating your wireframe...",timestamp:new Date,status:"sending"}})]}),i.jsxs("div",{className:"chat-input-container",children:[pe&&i.jsx("div",{className:"error error-margin",children:pe}),i.jsx("form",{onSubmit:on,className:"chat-form",children:i.jsxs("div",{className:"chat-input-wrapper",children:[i.jsx("textarea",{ref:we,value:s,onChange:L=>{const ce=L.target.value;d(ce),ce.length<=2&&U(!1)},onClick:()=>{s.length>2&&(Z&&Z(s),U(!0))},onKeyDown:L=>{L.key==="Enter"&&!L.shiftKey&&(L.preventDefault(),on(L))},placeholder:"Describe your wireframe idea...",className:"chat-input",rows:3}),i.jsx("button",{type:"button",onClick:Ge,className:"chat-image-btn",title:"Upload UI image to analyze",children:i.jsx(Zn,{})}),i.jsx("button",{type:"button",onClick:Dn,className:"chat-atlas-btn",title:"Open Fluent Component Library",children:i.jsx(Fd,{})}),i.jsx("button",{type:"submit",disabled:x||!s.trim(),className:"chat-send-btn",children:x?i.jsx(Li,{className:"loading-spinner"}):i.jsx(Cl,{})})]})}),m&&i.jsx("div",{className:"image-upload-section",children:i.jsx(Md,{onImageUpload:L=>{const ce=new FileReader;ce.onload=ie=>{var Be;const fe=(Be=ie.target)==null?void 0:Be.result;_(fe)},ce.readAsDataURL(L)},onAnalyzeImage:(L,ce)=>{console.log("Analyzing image:",ce,L)},isAnalyzing:x})}),F&&T.length>0&&i.jsxs("div",{className:"ai-suggestions-inline ai-suggestions-dynamic",children:[i.jsxs("div",{className:"ai-suggestions-label",children:[i.jsx(mo,{className:"ai-icon"}),i.jsx("span",{children:"AI Suggestions:"}),H&&i.jsx("span",{className:"loading-dot",children:"●"})]}),i.jsx("div",{className:"ai-suggestions-buttons",children:T.map((L,ce)=>i.jsxs("button",{type:"button",className:"ai-suggestion-pill ai-suggestion-button",onClick:ie=>{ie.preventDefault(),ie.stopPropagation(),d(L),ae(L)},children:[i.jsx("span",{className:"ai-badge",children:"AI"}),L]},ce))})]})]})]}),i.jsx("div",{className:"right-pane",children:k||R.length>0?i.jsxs("div",{className:"wireframe-panel",children:[i.jsx(vf,{onImportHtml:W,onFigmaIntegration:tr,onSave:Er,onOpenLibrary:Dn,onAddPages:Jn,onViewHtmlCode:X,onExportPowerPoint:Vt,onPresentationMode:Nr,onShareUrl:jr}),i.jsx(Cf,{pages:R,currentPageId:D,onPageSwitch:rn}),i.jsx("div",{className:"wireframe-container",children:i.jsx("div",{className:"wireframe-content",children:i.jsx(Sf,{htmlContent:D&&N[D]||k,onUpdateHtml:L=>{D&&j(ce=>_e(Ee({},ce),{[D]:L})),!D||R.length},onNavigateToPage:rn,availablePages:R})})})]}):i.jsxs("div",{className:"ai-assistant-container",children:[i.jsx("h1",{className:"ai-assistant-title",children:"AI Wireframe Assistant"}),i.jsxs("div",{className:"complexity-section",children:[i.jsx("h3",{className:"complexity-title",children:"Choose complexity level"}),i.jsxs("div",{className:"complexity-options",children:[i.jsxs("label",{className:"complexity-option selected",children:[i.jsx("input",{type:"radio",name:"complexity",value:"simple",defaultChecked:!0,className:"complexity-radio"}),i.jsx("div",{className:"complexity-label",children:"Simple"}),i.jsx("p",{className:"complexity-description",children:"Basic components and layouts. Perfect for quick prototypes and simple interfaces."})]}),i.jsxs("label",{className:"complexity-option",children:[i.jsx("input",{type:"radio",name:"complexity",value:"detailed",className:"complexity-radio"}),i.jsx("div",{className:"complexity-label",children:"Detailed"}),i.jsx("p",{className:"complexity-description",children:"Rich interactions and complex layouts. Great for production-ready designs."})]})]})]}),i.jsx("div",{className:"ai-assistant-input-container",children:i.jsx("textarea",{ref:we,value:s,onChange:L=>{const ce=L.target.value;d(ce),ce.length<=2&&U(!1)},onClick:()=>{s.length>2&&(Z&&Z(s),U(!0))},onKeyDown:L=>{L.key==="Enter"&&!L.shiftKey&&(L.preventDefault(),s.trim()&&!x&&on(L))},placeholder:"Describe your wireframe idea... (e.g., 'Create a modern login form with email, password, and social login options')",className:"ai-assistant-input"})}),i.jsx("button",{type:"submit",disabled:x||!s.trim(),className:"ai-assistant-submit",onClick:L=>{on(L)},children:x?i.jsxs(i.Fragment,{children:[i.jsx(Li,{className:"loading-spinner"}),"Generating..."]}):i.jsxs(i.Fragment,{children:[i.jsx(Cl,{}),"Create Wireframe"]})}),x&&i.jsxs("button",{type:"button",className:"ai-assistant-submit stop-generating",onClick:E,children:[i.jsx(Td,{}),"Stop Generation"]}),F&&T.length>0&&i.jsxs("div",{className:"ai-suggestions-inline",children:[i.jsxs("div",{className:"ai-suggestions-label",children:[i.jsx(mo,{className:"ai-icon"}),i.jsx("span",{children:"AI Suggestions:"}),H&&i.jsx("span",{className:"loading-dot",children:"●"})]}),i.jsx("div",{className:"ai-suggestions-buttons",children:T.map((L,ce)=>i.jsxs("button",{type:"button",className:"ai-suggestion-pill ai-suggestion-button",onClick:ie=>{ie.preventDefault(),ie.stopPropagation(),d(L),ae(L)},children:[i.jsx(mo,{})," ",L,i.jsx(xf,{isAI:P,isLoading:H})]},ce))})]}),i.jsxs("div",{className:"feature-callout",children:[i.jsx("div",{className:"feature-callout-title",children:"💡 Pro Tip"}),i.jsx("p",{className:"feature-callout-text",children:"Be specific about your requirements. Mention components, layout, colors, and interactions for better results."})]}),i.jsx(yf,{isVisible:x,message:h||(x?"Creating your wireframe...":"")})]})}),i.jsx(bf,{isOpen:Ie,onClose:()=>z(!1),onAddPages:Fn,existingPages:R,onGeneratePageContent:be}),i.jsx(wf,{isOpen:ye,onClose:()=>xe(!1),onSave:Ae,currentHtml:k,currentCss:"/* Generated CSS styles */",designTheme:le,colorScheme:ne,isUpdating:Ne,existingWireframe:yt}),i.jsx(Pd,{isOpen:K,onClose:()=>V(!1),onImport:In,onExport:Q}),i.jsx(kf,{isOpen:Pn,onClose:()=>{console.log("🔄 Component library modal closing"),Lt(!1)},onAddComponent:L=>{console.log("✨ Component added:",L.name),re&&re(L),he("ai",`✨ Added ${L.name} to your wireframe!`)},onGenerateWithAI:L=>{console.log("🤖 AI generation requested for:",L);const ce=new Event("submit");c(ce),he("ai","🤖 Generating wireframe with AI...")},currentDescription:s}),i.jsx(jf,{isOpen:Xn,onClose:()=>Ln(!1),htmlContent:D&&N[D]||k,title:D?`HTML Code - ${((Wt=R.find(L=>L.id===D))==null?void 0:Wt.name)||"Unknown Page"}`:"HTML Code - Main Wireframe"}),i.jsx(Nf,{isOpen:Tn,onClose:()=>Mn(!1),wireframeName:`Wireframe ${new Date().toLocaleDateString()}`,wireframeDescription:"Generated wireframe design",pages:R.length>0?R.map(L=>({id:L.id,name:L.name,description:L.description,content:N[L.id]||k||"<p>No content available</p>"})):k?[{id:"main",name:"Main Wireframe",description:"Primary wireframe content",content:k}]:[]})]})},Tf=({onLogoClick:s})=>i.jsxs("nav",{className:"top-nav",children:[i.jsx("div",{className:"navbar-left",children:i.jsxs("button",{onClick:s,className:"navbar-logo-button",title:"Back to Home",children:[i.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 25 25",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[i.jsx("path",{d:"M11.5216 0.5H0V11.9067H11.5216V0.5Z",fill:"#F26522"}),i.jsx("path",{d:"M24.2418 0.5H12.7202V11.9067H24.2418V0.5Z",fill:"#8DC63F"}),i.jsx("path",{d:"M11.5216 13.0933H0V24.5H11.5216V13.0933Z",fill:"#00AEEF"}),i.jsx("path",{d:"M24.2418 13.0933H12.7202V24.5H24.2418V13.0933Z",fill:"#FFC20E"})]}),i.jsx("span",{className:"navbar-logo-text",children:"Designetica"})]})}),i.jsx("div",{className:"navbar-right",children:i.jsx("img",{src:"/cxsLogo.png",alt:"CXS Logo",className:"navbar-cxs-logo"})})]}),Mf=({saveTitle:s,setSaveTitle:d,onSave:c,onCancel:x})=>i.jsx("div",{className:"modal-overlay",children:i.jsxs("div",{className:"modal",children:[i.jsx("h3",{children:"Save Wireframe"}),i.jsx("input",{type:"text",value:s,onChange:h=>d(h.target.value),placeholder:"Enter a name for this wireframe",autoFocus:!0}),i.jsxs("div",{className:"modal-buttons",children:[i.jsx("button",{onClick:c,disabled:!s.trim(),children:"Save"}),i.jsx("button",{onClick:x,children:"Cancel"})]})]})}),Pf=({savedWireframes:s,onLoad:d,onDelete:c,onClose:x})=>i.jsx("div",{className:"modal-overlay",children:i.jsxs("div",{className:"modal",children:[i.jsx("h3",{children:"Load Wireframe"}),s.length===0?i.jsx("p",{children:"No saved wireframes found."}):i.jsx("div",{className:"saved-list",children:s.map(h=>i.jsxs("div",{className:"saved-item",children:[i.jsxs("div",{className:"saved-info",children:[i.jsx("strong",{children:h.name}),i.jsx("small",{children:new Date(h.createdAt).toLocaleDateString()}),i.jsx("div",{className:"saved-description",children:h.description})]}),i.jsxs("div",{className:"saved-actions",children:[i.jsx("button",{onClick:()=>d(h),children:"Load"}),i.jsx("button",{onClick:()=>c(h.id),className:"delete-btn",title:"Delete wireframe","aria-label":"Delete wireframe",children:i.jsx(tn,{})})]})]},h.id))}),i.jsx("div",{className:"modal-buttons",children:i.jsx("button",{onClick:x,children:"Close"})})]})}),Ff=({message:s,type:d="success",duration:c=3e3,onClose:x})=>{const[h,C]=g.useState(!0);return g.useEffect(()=>{const S=setTimeout(()=>{C(!1),setTimeout(()=>{x==null||x()},300)},c);return()=>clearTimeout(S)},[c,x]),h?i.jsxs("div",{className:`toast toast-${d} ${h?"toast-visible":"toast-hidden"}`,children:[i.jsxs("div",{className:"toast-content",children:[i.jsxs("span",{className:"toast-icon",children:[d==="success"&&"✅",d==="info"&&"ℹ️",d==="warning"&&"⚠️",d==="error"&&"❌"]}),i.jsx("span",{className:"toast-message",children:s})]}),i.jsx("button",{className:"toast-close",onClick:()=>{C(!1),setTimeout(()=>x==null?void 0:x(),300)},children:"×"})]}):null},If={development:{primary:7072,fallback:5001,frontend:5173},production:{primary:443,frontend:443}},qn={FALLBACK_SUGGESTIONS:["Create a Microsoft Learn learning path browser with role-based filtering (Developer, Admin, Architect)","Design Azure certification journey pages with exam codes (AZ-900, AZ-104, AZ-204, AZ-305)","Build Microsoft Learn training dashboard with module completion tracking and time estimates","Add Microsoft Learn skills assessment portal with technology-specific evaluation paths","Generate Microsoft Docs-style API reference pages with code samples and Try It buttons","Create Microsoft Learn module structure with objectives, knowledge checks, and summary","Design Microsoft Learn hands-on lab interface with Azure sandbox environment integration","Build Microsoft Learn Q&A community pages with expert answers and voting system","Design Azure services catalog with pricing, regions, and getting started tutorials","Create Microsoft 365 admin center training modules with role-based permissions guides","Build Power Platform learning center with app templates and connector documentation","Generate Visual Studio Code extension marketplace with development tutorials","Create Microsoft Learn career path explorer with job role requirements and skill mapping","Design certification preparation hub with study guides, practice exams, and community forums","Build Microsoft Learn profile dashboard with achievements, transcripts, and learning streaks","Add Microsoft Learn mentorship platform connecting learners with industry experts","Generate Microsoft Learn interactive tutorials with step-by-step Azure portal guidance","Create Microsoft Learn code playground with live compilation and Azure resource deployment","Design Microsoft Learn assessment engine with adaptive questioning and personalized feedback","Build Microsoft Learn virtual labs with real Azure environments and guided exercises"],ENDPOINTS:{GENERATE_WIREFRAME:"/api/generate-wireframe",GENERATE_SUGGESTIONS:"/api/generate-suggestions",GET_TEMPLATE:"/api/get-template",HEALTH:"/api/health"},PORTS:If,BASE_URL:"https://func-designetica-vjib6nx2wh4a4.azurewebsites.net"},Df=(s,d)=>`${qn.BASE_URL}${s}`,Af="modulepreload",_f=function(s){return"/"+s},wd={},Rf=function(d,c,x){let h=Promise.resolve();if(c&&c.length>0){let S=function(T){return Promise.all(T.map(H=>Promise.resolve(H).then(P=>({status:"fulfilled",value:P}),P=>({status:"rejected",reason:P}))))};document.getElementsByTagName("link");const E=document.querySelector("meta[property=csp-nonce]"),F=(E==null?void 0:E.nonce)||(E==null?void 0:E.getAttribute("nonce"));h=S(c.map(T=>{if(T=_f(T),T in wd)return;wd[T]=!0;const H=T.endsWith(".css"),P=H?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${T}"]${P}`))return;const U=document.createElement("link");if(U.rel=H?"stylesheet":Af,H||(U.as="script"),U.crossOrigin="",U.href=T,F&&U.setAttribute("nonce",F),document.head.appendChild(U),H)return new Promise((Z,pe)=>{U.addEventListener("load",Z),U.addEventListener("error",()=>pe(new Error(`Unable to preload CSS for ${T}`)))})}))}function C(S){const E=new Event("vite:preloadError",{cancelable:!0});if(E.payload=S,window.dispatchEvent(E),!E.defaultPrevented)throw S}return h.then(S=>{for(const E of S||[])E.status==="rejected"&&C(E.reason);return d().catch(C)})},Of={maxRetries:3,delayMs:1e3,backoffFactor:1.5},$f=s=>new Promise(d=>setTimeout(d,s));class jl extends Error{constructor(d,c){super(c),this.status=d,this.name="ApiError"}}function Uf(s){return s.message.includes("Failed to fetch")?"Unable to connect to the backend server. Please ensure the Azure Functions backend is running on localhost:7072":s.message.includes("NetworkError")?"Network connection error. Please check your internet connection and try again":s.message.includes("timeout")?"Request timed out. The backend may be overloaded, please try again in a moment":s.message}function Bf(x,h){return ze(this,arguments,function*(s,d,c=Of){let C=null,S=c.delayMs;for(let E=0;E<=c.maxRetries;E++)try{const F=yield fetch(s,_e(Ee({},d),{signal:AbortSignal.timeout(3e4)}));if(!F.ok)throw new jl(F.status,`HTTP error! status: ${F.status}`);return F}catch(F){if(C=F,E===c.maxRetries){const T=Uf(C);throw new Error(T)}if(F instanceof TypeError||F instanceof jl&&F.status>=500){console.warn(`Attempt ${E+1} failed, retrying in ${S}ms...`),yield $f(S),S*=c.backoffFactor;continue}throw F}throw C})}function ji(x){return ze(this,arguments,function*(s,d={},c){const h=`${qn.BASE_URL}${s}`,C=Ee({headers:Ee({"Content-Type":"application/json"},d.headers)},d);try{return yield(yield Bf(h,C,c)).json()}catch(S){if(S instanceof jl)switch(S.status){case 401:throw new Error("Unauthorized: Please check your API credentials");case 403:throw new Error("Forbidden: You don't have permission to access this resource");case 404:throw new Error("Not Found: The requested resource doesn't exist");case 429:throw new Error("Too Many Requests: Please try again later");case 500:throw new Error("Server Error: Something went wrong on our end");default:throw new Error(`API Error: ${S.message}`)}throw S instanceof TypeError?new Error("Network Error: Please check your internet connection"):S}})}const Hf={get:(s,d={})=>ji(s,_e(Ee({},d),{method:"GET"})),post:(s,d,c={})=>(console.log("🔍 API POST Debug:",{endpoint:s,data:d,dataType:typeof d,stringifiedData:JSON.stringify(d),options:c}),ji(s,_e(Ee({},c),{method:"POST",body:JSON.stringify(d),headers:Ee({"Content-Type":"application/json"},c.headers)}))),put:(s,d,c={})=>ji(s,_e(Ee({},c),{method:"PUT",body:JSON.stringify(d)})),delete:(s,d={})=>ji(s,_e(Ee({},d),{method:"DELETE"}))},fo={},Xf=1800*1e3,Vf=s=>{if(s==null)return"";if(typeof s=="string"){let d=s.trim();return d=d.replace(/^[0'"]+|[0'"]+$/g,""),d=d.replace(/^'''html\s*/gi,""),d=d.replace(/^```html\s*/gi,""),d=d.replace(/```\s*$/gi,""),d.trim()}try{let d=String(s).trim();return d=d.replace(/^[0'"]+|[0'"]+$/g,""),d=d.replace(/^'''html\s*/gi,""),d=d.replace(/^```html\s*/gi,""),d=d.replace(/```\s*$/gi,""),d.trim()}catch(d){return console.error("Failed to convert HTML content to string:",d),""}},Wf=()=>{const[s,d]=g.useState(!1),[c,x]=g.useState(""),[h,C]=g.useState(null),[S,E]=g.useState(!1),[F,T]=g.useState(0),H=g.useRef(null),P=g.useRef([]);g.useEffect(()=>()=>{P.current.forEach(k=>clearTimeout(k)),H.current&&H.current.abort()},[]);const U=g.useCallback(()=>{H.current&&(H.current.abort(),H.current=null),P.current.forEach(k=>clearTimeout(k)),P.current=[]},[]),Z=g.useCallback((k,G="microsoftlearn",ae="primary",le=!1,ne=!1)=>ze(null,null,function*(){var Ie,z,R;U(),console.log("🎨 Generating wireframe with enhanced fallback support:",{description:k.substring(0,100)+"...",theme:G,colorScheme:ae,skipCache:le,fastMode:ne});const re=!1;d(!0),C(null),E(!1),x("🤖 AI mode: Initializing AI model...");const be=`${k}-${G}-${ae}-${re}-DEVELOPMENT-NOCACHE-${Date.now()}`,we=setTimeout(()=>x("🤖 Analyzing your description..."),1e3),ge=setTimeout(()=>x("🤖 Generating wireframe code..."),3e3),ke=setTimeout(()=>x("🤖 Optimizing layout..."),8e3),Se=setTimeout(()=>x("🤖 Finalizing components..."),15e3),Fe=setTimeout(()=>x("🤖 Almost done..."),25e3);P.current=[we,ge,ke,Se,Fe];try{const D=new AbortController;H.current=D,console.log("🚀 Making API call with:",{description:k,theme:G,colorScheme:ae,fastMode:re,timestamp:Date.now()});const B=yield Hf.post(qn.ENDPOINTS.GENERATE_WIREFRAME+`?t=${Date.now()}`,{description:k,theme:G,colorScheme:ae,fastMode:re},{signal:D.signal,headers:{"Cache-Control":"no-cache, no-store, must-revalidate",Pragma:"no-cache",Expires:"0"}});if(console.log("📥 API response received:",{hasHtml:!!B.html,htmlLength:(Ie=B.html)==null?void 0:Ie.length,fallback:B.fallback,source:B.source,title:((R=(z=B.html)==null?void 0:z.match(/<title>(.*?)<\/title>/))==null?void 0:R[1])||"No title found"}),console.log("API response received"),console.log("API response data keys:",Object.keys(B)),console.log("API response data structure:",B),!B||typeof B!="object")throw console.error("API returned invalid data structure:",B),new Error("Invalid data structure from wireframe API");E(B.fallback||!1),B.processingTime&&T(B.processingTime),console.log("API returned HTML content type:",typeof B.html),console.log("HTML is null?",B.html===null),console.log("HTML is undefined?",B.html===void 0);const N=Vf(B.html);return N?(console.log("HTML content length after ensureString:",N.length),console.log("HTML content preview:",N.substring(0,100)+"...")):console.error("HTML content is empty after ensureString"),N&&N.length>0&&!B.fallback&&(fo[be]={html:N,timestamp:Date.now(),processingTime:B.processingTime||0}),{html:N,fallback:B.fallback||!1,processingTime:B.processingTime||0,fromCache:!1}}catch(y){if(console.error("❌ Error generating wireframe:",y),y instanceof Error&&y.name==="AbortError")throw C("Request was cancelled"),y;try{console.log("🔄 Attempting enhanced fallback generation...");const{generateFallbackWireframe:D}=yield Rf(()=>ze(null,null,function*(){const{generateFallbackWireframe:N}=yield import("./fallbackWireframeGenerator-DdQEPr-p.js");return{generateFallbackWireframe:N}}),[]),B=D({description:k,theme:G||"microsoftlearn",colorScheme:ae||"primary"});return fo[`fallback-${be}`]={html:B,timestamp:Date.now(),processingTime:0},console.log("✅ Enhanced fallback wireframe generated successfully"),C(null),E(!0),{html:B,fallback:!0,processingTime:0,fromCache:!1}}catch(D){console.error("❌ Enhanced fallback also failed:",D);const B=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wireframe - ${k}</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            background: #f8f9fa;
            margin: 0;
            padding: 20px;
            color: #171717;
        }
        .fallback-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            text-align: center;
        }
        .error-notice {
            background: #fff4ce;
            border: 1px solid #ffb900;
            color: #8a6914;
            padding: 16px;
            border-radius: 4px;
            margin-bottom: 24px;
        }
        h1 { color: #F2CC60; margin-bottom: 16px; }
        p { color: #68769C; line-height: 1.6; margin-bottom: 16px; }
        .btn {
            background: #F2CC60;
            color: #2D2D2D;
            padding: 12px 24px;
            border: none;
            border-radius: 4px;
            text-decoration: none;
            display: inline-block;
            margin: 8px;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="fallback-container">
        <div class="error-notice">
            <strong>⚠️ Emergency Fallback:</strong> Both API and enhanced fallback failed. 
            This is a minimal emergency wireframe for "${k}".
        </div>
        <h1>${k}</h1>
        <p>This is an emergency fallback wireframe. Please check your connection and try again.</p>
        <a href="#" class="btn">Retry</a>
        <a href="#" class="btn">Help</a>
    </div>
</body>
</html>`;return C("System fallback active - Basic wireframe generated"),E(!0),{html:B,fallback:!0,processingTime:0,fromCache:!1}}}finally{d(!1),x(""),P.current.forEach(y=>clearTimeout(y)),P.current=[],H.current=null}}),[U]),pe=g.useCallback(()=>{const k=Object.keys(fo).length;Object.keys(fo).forEach(G=>delete fo[G]),console.log(`Cleared ${k} items from wireframe cache`)},[]);return{generateWireframe:Z,isLoading:s,loadingStage:c,error:h,fallback:S,processingTime:F,cancelGeneration:U,clearCache:pe}},wl={};function Gf(s,d){wl[s]||(wl[s]={count:0,totalTime:0,minTime:d,maxTime:d,lastTime:d,avgTime:d});const c=wl[s];c.count++,c.totalTime+=d,c.minTime=Math.min(c.minTime,d),c.maxTime=Math.max(c.maxTime,d),c.lastTime=d,c.avgTime=c.totalTime/c.count}class kl{constructor(d){uo(this,"startTime");uo(this,"name");this.name=d,this.startTime=performance.now()}stop(){const c=performance.now()-this.startTime;return Gf(this.name,c),c}}const Qf=()=>{const[s,d]=g.useState(!1);return{isVisible:s,toggle:()=>d(!s),show:()=>d(!0),hide:()=>d(!1)}};function Yf(){const[s,d]=g.useState(""),[c,x]=g.useState(""),[h,C]=g.useState([]),[S,E]=g.useState(!1),[F,T]=g.useState(""),[H,P]=g.useState(!1),[U,Z]=g.useState([]),[pe,k]=g.useState(!1),[G,ae]=g.useState(!1),[le]=g.useState(!1),ne="microsoftlearn",[re,be]=g.useState("primary"),[we,ge]=g.useState(Date.now()),[ke,Se]=g.useState(!0),[Fe,Ie]=g.useState(!1),[z,R]=g.useState([]),[y,D]=g.useState(!1);Qf();const{generateWireframe:B,isLoading:N,loadingStage:j,error:K,fallback:V,processingTime:m,cancelGeneration:M}=Wf();g.useEffect(()=>{localStorage.removeItem("snapframe_current"),localStorage.removeItem("currentWireframe"),localStorage.removeItem("lastUsedTheme"),localStorage.setItem("lastUsedTheme","microsoftlearn")},[]),g.useEffect(()=>{ye()},[]),g.useEffect(()=>{c?window.history.pushState({view:"wireframe"},"",window.location.pathname):window.history.replaceState({view:"landing"},"",window.location.pathname)},[c]);const oe=(W,Q="success")=>{const X={id:Date.now(),message:W,type:Q};R(_=>[..._,X])},se=W=>{R(Q=>Q.filter(X=>X.id!==W))},ye=()=>{const W=localStorage.getItem("snapframe_saved");W&&C(JSON.parse(W))},xe=()=>{if(!c||!F.trim())return;const W={id:Date.now().toString(),name:F.trim(),description:s,html:c,createdAt:new Date().toISOString()},Q=[...h,W];C(Q),localStorage.setItem("snapframe_saved",JSON.stringify(Q)),E(!1),T(""),console.log("Wireframe Saved!",`"${F.trim()}" has been saved successfully.`)},Le=W=>{Ne(W.html),d(W.description),P(!1),console.log("Wireframe Loaded!",`"${W.name}" has been loaded.`)},Ce=W=>{h.find(X=>X.id===W);const Q=h.filter(X=>X.id!==W);C(Q),localStorage.setItem("snapframe_saved",JSON.stringify(Q))},Ne=W=>{console.log("⚡ handleWireframeGenerated called"),Se(!1);let Q="";try{W&&typeof W=="string"?Q=W.trim():W&&(Q=String(W).trim()),Q=Q.replace(/^[0'"]+|[0'"]+$/g,""),Q=Q.replace(/^'''html\s*/gi,""),Q=Q.replace(/^```html\s*/gi,""),Q=Q.replace(/```\s*$/gi,""),Q=Q.trim()}catch(X){console.error("⚡ Error processing HTML:",X)}Q&&Q.length>0?x(Q):x(""),ge(Date.now())},Xe=(W,Q)=>ze(null,null,function*(){var Ge,nt;const X=Q||s;console.log("🔍 handleSubmit called with description:",X,"override:",Q),W.preventDefault();const _=new kl("wireframe-generation");try{console.log("🚀 Form submitted with description:",X);const Ae=yield B(X,ne,re,!0,y);console.log("✅ Wireframe generation result:",{hasResult:!!Ae,hasHtml:!!(Ae&&Ae.html),htmlLength:((Ge=Ae==null?void 0:Ae.html)==null?void 0:Ge.length)||0,htmlPreview:((nt=Ae==null?void 0:Ae.html)==null?void 0:nt.substring(0,200))||"No HTML",fallback:Ae==null?void 0:Ae.fallback,fromCache:Ae==null?void 0:Ae.fromCache}),Ae&&Ae.html&&typeof Ae.html=="string"&&Ae.html.length>0?(Ne(Ae.html),k(!1)):x("")}catch(Ae){console.error("🔍 Exception in handleSubmit:",Ae)}finally{_.stop()}}),yt=()=>{M()},En=W=>ze(null,null,function*(){console.log("🚀 AI suggestion clicked:",W),console.log("🚀 Current designTheme:",ne),console.log("🚀 Current colorScheme:",re),k(!1),d(W);const Q=new kl("ai-suggestion-wireframe");try{const X=yield B(W,ne,re);X&&X.html&&typeof X.html=="string"&&X.html.length>0&&Ne(X.html)}catch(X){console.error("🚀 Exception in handleAiSuggestionClick:",X)}finally{Q.stop()}}),nn=W=>{console.log("🔧 App.tsx: handleAddComponent called with:",W),console.log("🔧 App.tsx: Current htmlWireframe length:",(c==null?void 0:c.length)||0);const Q=Xn(W);if(console.log("🔧 App.tsx: Generated HTML:",Q),c){const X=Ln(c,Q);console.log("🔧 App.tsx: Updating existing wireframe, new length:",X.length),x(X),console.log("🔧 App.tsx: Added to existing wireframe")}else{const X=Tn(Q);console.log("🔧 App.tsx: Creating new wireframe, length:",X.length),x(X),console.log("🔧 App.tsx: Created new wireframe with component")}ge(Date.now()),oe(`✨ Added ${W.name}! Hover over components to see drag handles, then drag to reposition.`,"success")},zn=(W,Q)=>ze(null,null,function*(){try{return console.log(`Generating ${Q} content:`,W),(yield B(W,ne,re)).html||""}catch(X){throw console.error("Failed to generate page content:",X),X}}),Xn=W=>{if(console.log("🔧 generateComponentHtml: Processing component:",W),W.htmlCode){console.log("🔧 generateComponentHtml: Using component.htmlCode");let Ge=W.htmlCode;if(Ge.trim().startsWith("<")&&Ge.trim().endsWith(">")){const Dn=new DOMParser().parseFromString(Ge,"text/html").body.children;if(Dn.length===1){const Vt=Dn[0];Vt.setAttribute("data-draggable","true"),Vt.classList.add("atlas-component"),Ge=Vt.outerHTML}else Ge=`<div class="atlas-component component-container" data-draggable="true" style="display: inline-block; margin: 8px;">${Ge}</div>`}return Ge}const{id:Q,name:X,defaultProps:_}=W;switch(console.log("🔧 generateComponentHtml: Using fallback logic for ID:",Q),Q){case"ms-learn-layout":return`<div class="ms-learn-layout" style="margin: 10px; padding: 20px; border: 2px solid #8E9AAF; border-radius: 8px; background: #f8f9fa;">
          <h3 style="color: #8E9AAF;">📄 Microsoft Learn Complete Layout</h3>
          <p>Complete Microsoft Learn page layout with top nav, hero, content sections, and footer</p>
        </div>`;case"ms-learn-topnav":return`<nav class="ms-learn-topnav" style="margin: 10px; padding: 15px; background: #8E9AAF; color: white; border-radius: 4px;">
          <h4 style="margin: 0; color: white;">🧭 Microsoft Learn Navigation</h4>
          <p style="margin: 5px 0 0 0; font-size: 14px; color: #e1f5fe;">Official Microsoft Learn top navigation with search, menus, and branding</p>
        </nav>`;case"microsoft-learn-topnav":return`<header class="microsoft-learn-header" style="
          width: 100%;
          background-color: #2B2B2B;
          color: white;
          padding: 12px 24px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        ">
          <div class="header-container" style="
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
          ">
            <div class="logo-section" style="display: flex; align-items: center;">
              <span class="ms-logo" style="
                font-size: 16px;
                font-weight: 600;
                color: #FFFFFF;
                margin-right: 32px;
              ">🪟 Microsoft Learn</span>
            </div>
            <nav class="main-nav" style="
              display: flex;
              align-items: center;
              gap: 24px;
            ">
              <a href="#" style="color: #CCCCCC; text-decoration: none; font-size: 14px;">Learning Paths</a>
              <a href="#" style="color: #CCCCCC; text-decoration: none; font-size: 14px;">Certifications</a>
              <a href="#" style="color: #CCCCCC; text-decoration: none; font-size: 14px;">Documentation</a>
              <a href="#" style="color: #CCCCCC; text-decoration: none; font-size: 14px;">Community</a>
            </nav>
            <div class="user-section" style="
              display: flex;
              align-items: center;
              gap: 16px;
            ">
              <button class="search-btn" style="
                background: none;
                border: none;
                color: #CCCCCC;
                font-size: 16px;
                cursor: pointer;
              ">🔍</button>
              <button class="profile-btn" style="
                background: #8E9AAF;
                border: none;
                color: white;
                padding: 6px 12px;
                border-radius: 4px;
                font-size: 14px;
                cursor: pointer;
              ">Sign in</button>
            </div>
          </div>
        </header>`;case"ms-learn-hero":return`<section class="ms-learn-hero" style="margin: 10px; padding: 30px; background: linear-gradient(135deg, #8E9AAF, #68769C); color: white; border-radius: 8px; text-align: center;">
          <h2 style="margin: 0 0 10px 0; color: white;">🚀 Microsoft Learn Hero Section</h2>
          <p style="margin: 0; font-size: 16px;">Engaging hero section with call-to-action and learning paths</p>
        </section>`;case"ms-learn-footer":return`<footer class="ms-learn-footer" style="margin: 10px; padding: 20px; background: #3C4858; color: white; border-radius: 4px;">
          <h4 style="margin: 0 0 10px 0; color: white;">🦶 Microsoft Learn Footer</h4>
          <p style="margin: 0; font-size: 14px; color: #d1d1d1;">Footer with community links and feedback options</p>
        </footer>`;case"atlas-button-primary":return`<button class="button button-primary button-lg atlas-component" data-draggable="true" style="margin: 10px; padding: 12px 24px; background: #8E9AAF; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">${(_==null?void 0:_.text)||"Primary Button"}</button>`;case"atlas-button-primary-filled":return`<button class="button button-primary-filled" style="margin: 10px; padding: 12px 24px; background: #8E9AAF; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">${(_==null?void 0:_.text)||"Primary Filled Button"}</button>`;case"atlas-button-primary-clear":return`<button class="button button-primary-clear" style="margin: 10px; padding: 12px 24px; background: transparent; color: #8E9AAF; border: 2px solid #8E9AAF; border-radius: 4px; cursor: pointer; font-weight: 500;">${(_==null?void 0:_.text)||"Primary Clear Button"}</button>`;case"atlas-button-secondary":return`<button class="button button-secondary button-lg" style="margin: 10px; padding: 12px 24px; background: #f3f2f1; color: #3C4858; border: 1px solid #e1dfdd; border-radius: 4px; cursor: pointer; font-weight: 500;">${(_==null?void 0:_.text)||"Secondary Button"}</button>`;case"atlas-button-secondary-clear":return`<button class="button button-secondary-clear" style="margin: 10px; padding: 12px 24px; background: transparent; color: #3C4858; border: 2px solid #e1dfdd; border-radius: 4px; cursor: pointer; font-weight: 500;">${(_==null?void 0:_.text)||"Secondary Clear Button"}</button>`;case"atlas-button-secondary-filled":return`<button class="button button-secondary-filled" style="margin: 10px; padding: 12px 24px; background: #68769C; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">${(_==null?void 0:_.text)||"Secondary Filled Button"}</button>`;case"atlas-button-danger":return`<button class="button button-danger" style="margin: 10px; padding: 12px 24px; background: #d13438; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">${(_==null?void 0:_.text)||"Danger Button"}</button>`;case"atlas-button-success":return`<button class="button button-success" style="margin: 10px; padding: 12px 24px; background: #107c10; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">${(_==null?void 0:_.text)||"Success Button"}</button>`;case"atlas-button-warning":return`<button class="button button-warning" style="margin: 10px; padding: 12px 24px; background: #ffb900; color: #3C4858; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">${(_==null?void 0:_.text)||"Warning Button"}</button>`;case"atlas-button-loading":return'<button class="button button-loading" style="margin: 10px; padding: 12px 24px; background: #8E9AAF; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;" disabled>⏳ Loading...</button>';case"atlas-button-small":return`<button class="button button-small" style="margin: 10px; padding: 8px 16px; background: #8E9AAF; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; font-size: 12px;">${(_==null?void 0:_.text)||"Small Button"}</button>`;case"atlas-button-large":return`<button class="button button-large" style="margin: 10px; padding: 16px 32px; background: #8E9AAF; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; font-size: 18px;">${(_==null?void 0:_.text)||"Large Button"}</button>`;case"atlas-button-block":return`<button class="button button-block" style="margin: 10px; padding: 12px 24px; background: #8E9AAF; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; width: 100%; display: block;">${(_==null?void 0:_.text)||"Block Button"}</button>`;case"atlas-button-search":return`<button class="button button-primary button-lg button-search" style="margin: 10px; padding: 12px 24px; background: #8E9AAF; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; display: inline-flex; align-items: center; gap: 8px;">🔍 ${(_==null?void 0:_.text)||"Search"}</button>`;case"atlas-input":return`<div style="margin: 10px;">
          <label style="display: block; margin-bottom: 5px; color: #3C4858; font-weight: 600;">${(_==null?void 0:_.label)||"Input Label"}</label>
          <input type="text" class="form-control" placeholder="${(_==null?void 0:_.placeholder)||"Enter text here..."}" style="width: 100%; padding: 8px 12px; border: 1px solid #e1dfdd; border-radius: 4px; font-family: 'Segoe UI', sans-serif;">
        </div>`;case"atlas-textarea":return`<div style="margin: 10px;">
          <label style="display: block; margin-bottom: 5px; color: #3C4858; font-weight: 600;">${(_==null?void 0:_.label)||"Textarea Label"}</label>
          <textarea class="form-control" placeholder="${(_==null?void 0:_.placeholder)||"Enter your text here..."}" rows="4" style="width: 100%; padding: 8px 12px; border: 1px solid #e1dfdd; border-radius: 4px; font-family: 'Segoe UI', sans-serif; resize: vertical;"></textarea>
        </div>`;case"atlas-select":return`<div style="margin: 10px;">
          <label style="display: block; margin-bottom: 5px; color: #3C4858; font-weight: 600;">${(_==null?void 0:_.label)||"Select Label"}</label>
          <select class="form-control" style="width: 100%; padding: 8px 12px; border: 1px solid #e1dfdd; border-radius: 4px; font-family: 'Segoe UI', sans-serif;">
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>
        </div>`;case"atlas-checkbox":return`<div style="margin: 10px;">
          <label style="display: flex; align-items: center; color: #3C4858; font-weight: 500; cursor: pointer;">
            <input type="checkbox" style="margin-right: 8px; width: 16px; height: 16px;">
            ${(_==null?void 0:_.label)||"Checkbox Label"}
          </label>
        </div>`;case"atlas-radio":return`<div style="margin: 10px;">
          <label style="display: flex; align-items: center; color: #3C4858; font-weight: 500; cursor: pointer;">
            <input type="radio" name="radio-group" style="margin-right: 8px; width: 16px; height: 16px;">
            ${(_==null?void 0:_.label)||"Radio Button Label"}
          </label>
        </div>`;case"atlas-toggle":return`<div style="margin: 10px;">
          <label style="display: flex; align-items: center; color: #3C4858; font-weight: 500; cursor: pointer;">
            <div style="position: relative; width: 44px; height: 24px; background: #e1dfdd; border-radius: 12px; margin-right: 8px; transition: background 0.3s;">
              <div style="position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; background: white; border-radius: 50%; transition: transform 0.3s;"></div>
            </div>
            ${(_==null?void 0:_.label)||"Toggle Switch"}
          </label>
        </div>`;case"atlas-label":return`<label style="margin: 10px; display: block; color: #3C4858; font-weight: 600; font-size: 14px;">${(_==null?void 0:_.text)||"Form Label"}</label>`;case"atlas-breadcrumb":return`<nav style="margin: 10px; padding: 10px; background: #f8f9fa; border-radius: 4px;">
          <div style="color: #68769C; font-size: 14px;">
            🏠 <a href="#" style="color: #8E9AAF; text-decoration: none;">Home</a> &gt; 
            <a href="#" style="color: #8E9AAF; text-decoration: none;">Category</a> &gt; 
            <span style="color: #3C4858; font-weight: 600;">Current Page</span>
          </div>
        </nav>`;case"atlas-site-header":return`<header style="margin: 10px; padding: 20px; background: #3C4858; color: white; border-radius: 4px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0; color: white;">🌐 Atlas Site Header</h3>
            <nav style="display: flex; gap: 20px;">
              <a href="#" style="color: #ffffff; text-decoration: none;">Home</a>
              <a href="#" style="color: #ffffff; text-decoration: none;">About</a>
              <a href="#" style="color: #ffffff; text-decoration: none;">Contact</a>
            </nav>
          </div>
        </header>`;case"atlas-pagination":return`<nav style="margin: 10px; padding: 15px; text-align: center;">
          <div style="display: inline-flex; gap: 5px;">
            <button style="padding: 8px 12px; border: 1px solid #e1dfdd; background: white; border-radius: 4px; cursor: pointer;">&laquo;</button>
            <button style="padding: 8px 12px; border: 1px solid #8E9AAF; background: #8E9AAF; color: white; border-radius: 4px;">1</button>
            <button style="padding: 8px 12px; border: 1px solid #e1dfdd; background: white; border-radius: 4px; cursor: pointer;">2</button>
            <button style="padding: 8px 12px; border: 1px solid #e1dfdd; background: white; border-radius: 4px; cursor: pointer;">3</button>
            <button style="padding: 8px 12px; border: 1px solid #e1dfdd; background: white; border-radius: 4px; cursor: pointer;">&raquo;</button>
          </div>
        </nav>`;case"atlas-gradient-card":return`<div class="gradient-card" style="margin: 10px; padding: 25px; background: linear-gradient(135deg, #8E9AAF, #68769C); color: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,120,212,0.3);">
          <h4 style="margin: 0 0 10px 0; color: white;">✨ Gradient Card</h4>
          <p style="margin: 0; color: #e1f5fe;">A beautiful gradient card component with Microsoft Learn styling.</p>
        </div>`;case"atlas-hero":return Ni({title:"Build your next great idea",summary:"Transform your vision into reality with Microsoft Learn's comprehensive resources and tools.",eyebrow:"MICROSOFT LEARN",ctaText:"Get Started",showSecondaryButton:!0,secondaryCtaText:"Learn More",backgroundColor:"#E9ECEF",heroImageUrl:"https://learn.microsoft.com/media/learn/home/hero-learn.svg"});case"atlas-banner":return`<div class="banner" style="margin: 10px; padding: 20px; background: #fff4ce; border: 1px solid #ffb900; border-radius: 4px; color: #3C4858;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 20px;">ℹ️</span>
            <div>
              <h4 style="margin: 0 0 5px 0; color: #3C4858;">Important Banner</h4>
              <p style="margin: 0; color: #68769C;">This is an informational banner component.</p>
            </div>
          </div>
        </div>`;case"atlas-container":return`<div class="container" style="margin: 10px; padding: 20px; border: 1px solid #e1dfdd; border-radius: 4px; background: #f9f9f9;">
          <h3 style="margin: 0 0 10px 0; color: #3C4858;">📦 Container</h3>
          <p style="margin: 0; color: #68769C;">This is a container component. Add your content here.</p>
        </div>`;case"atlas-card":return`<div class="card atlas-component" data-draggable="true" style="margin: 10px; padding: 20px; border: 1px solid #e1dfdd; border-radius: 8px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h4 style="margin: 0 0 10px 0; color: #3C4858;">💳 Card Title</h4>
          <p style="margin: 0; color: #68769C;">Card content goes here. This is a Microsoft Learn styled card component.</p>
        </div>`;case"atlas-heading":return`<h2 style="margin: 10px; color: #3C4858; font-size: 2rem; font-weight: 600;">📝 ${(_==null?void 0:_.text)||"Heading Component"}</h2>`;case"atlas-text":return`<p style="margin: 10px; color: #68769C; line-height: 1.5; font-family: 'Segoe UI', sans-serif;">${(_==null?void 0:_.text)||"This is a text component. You can use it to display paragraphs of content with Microsoft Learn styling."}</p>`;default:return`<div style="margin: 10px; padding: 15px; border: 2px dashed #e1dfdd; border-radius: 4px; color: #68769C; text-align: center; background: #f9f9f9;">
          <h4 style="margin: 0 0 5px 0; color: #3C4858;">🔧 ${X||"Unknown Component"}</h4>
          <p style="margin: 0; font-size: 12px;">Component ID: ${Q}</p>
        </div>`}},Ln=(W,Q)=>{const X=W.match(/<div[^>]*class="[^"]*wireframe-container[^"]*"[^>]*>/);if(X){const Ge=W.indexOf("</div>",X.index+X[0].length);if(Ge!==-1)return W.slice(0,Ge)+Q+W.slice(Ge)}const _=W.lastIndexOf("</body>");return _!==-1?W.slice(0,_)+Q+W.slice(_):W+Q},Tn=W=>`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Component Wireframe</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .wireframe-container { padding: 20px; min-height: 400px; }
        .button { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; }
        .button-primary { background: #8E9AAF; color: white; }
        .button-secondary { background: #f3f2f1; color: #3C4858; border: 1px solid #e1dfdd; }
        .button-lg { padding: 12px 24px; }
        .button-search { display: inline-flex; align-items: center; gap: 8px; }
    </style>
</head>
<body>
    <div class="wireframe-container">
        <h1>Component Library Wireframe</h1>
        <p>Components added from the library:</p>
        ${W}
    </div>
</body>
</html>`,Mn=(W,Q)=>ze(null,null,function*(){Q&&be(Q);const X="microsoftlearn",_=Q||re;if(!s.trim())return;const Ge=new kl("design-change-wireframe");try{const nt=yield B(s,X,_);nt&&nt.html?typeof nt.html=="string"&&nt.html.length>0?Ne(nt.html):(console.error("Error: Received invalid wireframe data"),oe("Error: Received invalid wireframe data. Please try again.","error")):(console.error("Error: No wireframe generated"),oe("Error: No wireframe generated. Please try again.","error"))}catch(nt){console.error("🎨 Error in design change:",nt)}finally{Ge.stop()}}),Pn=W=>ze(null,null,function*(){try{const Q=new AbortController,X=setTimeout(()=>Q.abort(),1e4),_=yield fetch(Df(qn.ENDPOINTS.GENERATE_SUGGESTIONS),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({description:W.trim()}),signal:Q.signal});return clearTimeout(X),_.ok?(yield _.json()).suggestions||qn.FALLBACK_SUGGESTIONS:(console.warn(`AI suggestions API returned ${_.status}, using fallback suggestions`),qn.FALLBACK_SUGGESTIONS)}catch(Q){return Q instanceof Error?console.warn("AI suggestions temporarily unavailable, using fallback suggestions:",Q.message):console.warn("AI suggestions temporarily unavailable, using fallback suggestions"),qn.FALLBACK_SUGGESTIONS}}),Lt=W=>ze(null,null,function*(){if(W.trim().length>=3){ae(!0);try{const X=yield Pn(W);Z(X),k(X.length>0)}catch(X){console.warn("Unable to generate AI suggestions, continuing without them"),Z([]),k(!1)}finally{ae(!1)}}else Z([]),k(!1),ae(!1)}),he=()=>{console.log("Multi-step feature clicked")},Fn=W=>{console.log("Image uploaded:",W.name,W.size)},rn=()=>{x(""),Se(!0),d("")},Jn=(W,Q)=>ze(null,null,function*(){console.log("Analyzing image:",Q,"Size:",W.length,"bytes"),Ie(!0);try{const X=`Generate a wireframe based on the uploaded image: ${Q}. Analyze the layout, components, and structure shown in the image.`;d(X);const _=yield B(X,ne,re);_&&_.html&&Ne(_.html)}catch(X){console.error("Error analyzing image:",X)}finally{Ie(!1)}}),er=(W,Q)=>{console.log("Figma file imported:",Q),x(W),Se(!1),ge(Date.now()),oe(`Figma design imported: ${Q}`,"success")},tr=W=>{console.log("Exporting to Figma format:",W),oe(`Exported to ${W}`,"success")},In=(W,Q)=>ze(null,null,function*(){console.log("Demo image generate requested:",W,Q);try{d(Q),oe("Generating wireframe from demo image...","info");const X=yield B(Q,ne,re);X&&X.html&&(Ne(X.html),oe("Demo wireframe generated!","success"))}catch(X){console.error("Error generating demo wireframe:",X),oe("Failed to generate demo wireframe","error")}});return i.jsxs("div",{className:"app-content with-navbar",children:[i.jsx(Tf,{onLogoClick:rn}),ke&&!c?i.jsx(hf,{error:K,savedWireframesCount:h.length,onLoadClick:()=>P(!0),description:s,onDescriptionChange:W=>{const Q=W.target.value;d(Q),Q.length<=2&&k(!1)},onSubmit:Xe,loading:N,handleStop:yt,showAiSuggestions:pe,aiSuggestions:U,suggestionLoading:G,onAiSuggestionClick:En,onGenerateAiSuggestions:Lt,onImageUpload:Fn,onAnalyzeImage:Jn,isAnalyzingImage:Fe,onFigmaImport:er,onFigmaExport:tr,onDemoGenerate:In}):i.jsx(Lf,{description:s,setDescription:d,handleSubmit:Xe,loading:N,loadingStage:j,fallback:V,processingTime:m,handleStop:yt,showAiSuggestions:pe,aiSuggestions:U,suggestionLoading:G,isAiSourced:le,setShowAiSuggestions:k,onGenerateAiSuggestions:Lt,error:K,savedWireframesCount:h.length,onLoadClick:()=>P(!0),htmlWireframe:c,setHtmlWireframe:x,onSave:()=>E(!0),onMultiStep:he,designTheme:ne,colorScheme:re,setColorScheme:be,onDesignChange:Mn,onAiSuggestionClick:En,forceUpdateKey:we,onBackToLanding:rn,onAddComponent:nn,onGeneratePageContent:zn}),S&&i.jsx(Mf,{saveTitle:F,setSaveTitle:T,onSave:xe,onCancel:()=>E(!1)}),H&&i.jsx(Pf,{savedWireframes:h,onLoad:Le,onDelete:Ce,onClose:()=>P(!1)}),z.map(W=>i.jsx(Ff,{message:W.message,type:W.type,onClose:()=>se(W.id)},W.id))]})}function Kf(){return i.jsx(Yf,{})}window.React=Ht;const kd=document.getElementById("root");kd&&Hp.createRoot(kd).render(i.jsx(g.StrictMode,{children:i.jsx(Kf,{})}))});export default qf();
