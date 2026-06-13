(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();function Jg(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var e0={exports:{}},Dc={},t0={exports:{}},Xe={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Aa=Symbol.for("react.element"),_x=Symbol.for("react.portal"),vx=Symbol.for("react.fragment"),xx=Symbol.for("react.strict_mode"),yx=Symbol.for("react.profiler"),Sx=Symbol.for("react.provider"),Mx=Symbol.for("react.context"),Ex=Symbol.for("react.forward_ref"),Tx=Symbol.for("react.suspense"),wx=Symbol.for("react.memo"),Ax=Symbol.for("react.lazy"),yp=Symbol.iterator;function Rx(t){return t===null||typeof t!="object"?null:(t=yp&&t[yp]||t["@@iterator"],typeof t=="function"?t:null)}var n0={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},i0=Object.assign,r0={};function ho(t,e,n){this.props=t,this.context=e,this.refs=r0,this.updater=n||n0}ho.prototype.isReactComponent={};ho.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};ho.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function s0(){}s0.prototype=ho.prototype;function Jh(t,e,n){this.props=t,this.context=e,this.refs=r0,this.updater=n||n0}var ed=Jh.prototype=new s0;ed.constructor=Jh;i0(ed,ho.prototype);ed.isPureReactComponent=!0;var Sp=Array.isArray,o0=Object.prototype.hasOwnProperty,td={current:null},a0={key:!0,ref:!0,__self:!0,__source:!0};function l0(t,e,n){var i,r={},s=null,o=null;if(e!=null)for(i in e.ref!==void 0&&(o=e.ref),e.key!==void 0&&(s=""+e.key),e)o0.call(e,i)&&!a0.hasOwnProperty(i)&&(r[i]=e[i]);var a=arguments.length-2;if(a===1)r.children=n;else if(1<a){for(var l=Array(a),c=0;c<a;c++)l[c]=arguments[c+2];r.children=l}if(t&&t.defaultProps)for(i in a=t.defaultProps,a)r[i]===void 0&&(r[i]=a[i]);return{$$typeof:Aa,type:t,key:s,ref:o,props:r,_owner:td.current}}function Cx(t,e){return{$$typeof:Aa,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function nd(t){return typeof t=="object"&&t!==null&&t.$$typeof===Aa}function bx(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var Mp=/\/+/g;function iu(t,e){return typeof t=="object"&&t!==null&&t.key!=null?bx(""+t.key):e.toString(36)}function Fl(t,e,n,i,r){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var o=!1;if(t===null)o=!0;else switch(s){case"string":case"number":o=!0;break;case"object":switch(t.$$typeof){case Aa:case _x:o=!0}}if(o)return o=t,r=r(o),t=i===""?"."+iu(o,0):i,Sp(r)?(n="",t!=null&&(n=t.replace(Mp,"$&/")+"/"),Fl(r,e,n,"",function(c){return c})):r!=null&&(nd(r)&&(r=Cx(r,n+(!r.key||o&&o.key===r.key?"":(""+r.key).replace(Mp,"$&/")+"/")+t)),e.push(r)),1;if(o=0,i=i===""?".":i+":",Sp(t))for(var a=0;a<t.length;a++){s=t[a];var l=i+iu(s,a);o+=Fl(s,e,n,l,r)}else if(l=Rx(t),typeof l=="function")for(t=l.call(t),a=0;!(s=t.next()).done;)s=s.value,l=i+iu(s,a++),o+=Fl(s,e,n,l,r);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return o}function Ba(t,e,n){if(t==null)return t;var i=[],r=0;return Fl(t,i,"","",function(s){return e.call(n,s,r++)}),i}function Px(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var mn={current:null},kl={transition:null},Lx={ReactCurrentDispatcher:mn,ReactCurrentBatchConfig:kl,ReactCurrentOwner:td};function c0(){throw Error("act(...) is not supported in production builds of React.")}Xe.Children={map:Ba,forEach:function(t,e,n){Ba(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return Ba(t,function(){e++}),e},toArray:function(t){return Ba(t,function(e){return e})||[]},only:function(t){if(!nd(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};Xe.Component=ho;Xe.Fragment=vx;Xe.Profiler=yx;Xe.PureComponent=Jh;Xe.StrictMode=xx;Xe.Suspense=Tx;Xe.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Lx;Xe.act=c0;Xe.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var i=i0({},t.props),r=t.key,s=t.ref,o=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,o=td.current),e.key!==void 0&&(r=""+e.key),t.type&&t.type.defaultProps)var a=t.type.defaultProps;for(l in e)o0.call(e,l)&&!a0.hasOwnProperty(l)&&(i[l]=e[l]===void 0&&a!==void 0?a[l]:e[l])}var l=arguments.length-2;if(l===1)i.children=n;else if(1<l){a=Array(l);for(var c=0;c<l;c++)a[c]=arguments[c+2];i.children=a}return{$$typeof:Aa,type:t.type,key:r,ref:s,props:i,_owner:o}};Xe.createContext=function(t){return t={$$typeof:Mx,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:Sx,_context:t},t.Consumer=t};Xe.createElement=l0;Xe.createFactory=function(t){var e=l0.bind(null,t);return e.type=t,e};Xe.createRef=function(){return{current:null}};Xe.forwardRef=function(t){return{$$typeof:Ex,render:t}};Xe.isValidElement=nd;Xe.lazy=function(t){return{$$typeof:Ax,_payload:{_status:-1,_result:t},_init:Px}};Xe.memo=function(t,e){return{$$typeof:wx,type:t,compare:e===void 0?null:e}};Xe.startTransition=function(t){var e=kl.transition;kl.transition={};try{t()}finally{kl.transition=e}};Xe.unstable_act=c0;Xe.useCallback=function(t,e){return mn.current.useCallback(t,e)};Xe.useContext=function(t){return mn.current.useContext(t)};Xe.useDebugValue=function(){};Xe.useDeferredValue=function(t){return mn.current.useDeferredValue(t)};Xe.useEffect=function(t,e){return mn.current.useEffect(t,e)};Xe.useId=function(){return mn.current.useId()};Xe.useImperativeHandle=function(t,e,n){return mn.current.useImperativeHandle(t,e,n)};Xe.useInsertionEffect=function(t,e){return mn.current.useInsertionEffect(t,e)};Xe.useLayoutEffect=function(t,e){return mn.current.useLayoutEffect(t,e)};Xe.useMemo=function(t,e){return mn.current.useMemo(t,e)};Xe.useReducer=function(t,e,n){return mn.current.useReducer(t,e,n)};Xe.useRef=function(t){return mn.current.useRef(t)};Xe.useState=function(t){return mn.current.useState(t)};Xe.useSyncExternalStore=function(t,e,n){return mn.current.useSyncExternalStore(t,e,n)};Xe.useTransition=function(){return mn.current.useTransition()};Xe.version="18.3.1";t0.exports=Xe;var Ra=t0.exports;const en=Jg(Ra);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ix=Ra,Dx=Symbol.for("react.element"),Nx=Symbol.for("react.fragment"),Ux=Object.prototype.hasOwnProperty,Ox=Ix.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Fx={key:!0,ref:!0,__self:!0,__source:!0};function u0(t,e,n){var i,r={},s=null,o=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(o=e.ref);for(i in e)Ux.call(e,i)&&!Fx.hasOwnProperty(i)&&(r[i]=e[i]);if(t&&t.defaultProps)for(i in e=t.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:Dx,type:t,key:s,ref:o,props:r,_owner:Ox.current}}Dc.Fragment=Nx;Dc.jsx=u0;Dc.jsxs=u0;e0.exports=Dc;var G=e0.exports,mf={},f0={exports:{}},Un={},h0={exports:{}},d0={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(L,$){var J=L.length;L.push($);e:for(;0<J;){var le=J-1>>>1,we=L[le];if(0<r(we,$))L[le]=$,L[J]=we,J=le;else break e}}function n(L){return L.length===0?null:L[0]}function i(L){if(L.length===0)return null;var $=L[0],J=L.pop();if(J!==$){L[0]=J;e:for(var le=0,we=L.length,Je=we>>>1;le<Je;){var K=2*(le+1)-1,re=L[K],_e=K+1,ae=L[_e];if(0>r(re,J))_e<we&&0>r(ae,re)?(L[le]=ae,L[_e]=J,le=_e):(L[le]=re,L[K]=J,le=K);else if(_e<we&&0>r(ae,J))L[le]=ae,L[_e]=J,le=_e;else break e}}return $}function r(L,$){var J=L.sortIndex-$.sortIndex;return J!==0?J:L.id-$.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var o=Date,a=o.now();t.unstable_now=function(){return o.now()-a}}var l=[],c=[],u=1,h=null,d=3,p=!1,g=!1,v=!1,m=typeof setTimeout=="function"?setTimeout:null,f=typeof clearTimeout=="function"?clearTimeout:null,_=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function x(L){for(var $=n(c);$!==null;){if($.callback===null)i(c);else if($.startTime<=L)i(c),$.sortIndex=$.expirationTime,e(l,$);else break;$=n(c)}}function y(L){if(v=!1,x(L),!g)if(n(l)!==null)g=!0,X(b);else{var $=n(c);$!==null&&ie(y,$.startTime-L)}}function b(L,$){g=!1,v&&(v=!1,f(C),C=-1),p=!0;var J=d;try{for(x($),h=n(l);h!==null&&(!(h.expirationTime>$)||L&&!P());){var le=h.callback;if(typeof le=="function"){h.callback=null,d=h.priorityLevel;var we=le(h.expirationTime<=$);$=t.unstable_now(),typeof we=="function"?h.callback=we:h===n(l)&&i(l),x($)}else i(l);h=n(l)}if(h!==null)var Je=!0;else{var K=n(c);K!==null&&ie(y,K.startTime-$),Je=!1}return Je}finally{h=null,d=J,p=!1}}var A=!1,R=null,C=-1,T=5,S=-1;function P(){return!(t.unstable_now()-S<T)}function j(){if(R!==null){var L=t.unstable_now();S=L;var $=!0;try{$=R(!0,L)}finally{$?H():(A=!1,R=null)}}else A=!1}var H;if(typeof _=="function")H=function(){_(j)};else if(typeof MessageChannel<"u"){var Y=new MessageChannel,ee=Y.port2;Y.port1.onmessage=j,H=function(){ee.postMessage(null)}}else H=function(){m(j,0)};function X(L){R=L,A||(A=!0,H())}function ie(L,$){C=m(function(){L(t.unstable_now())},$)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(L){L.callback=null},t.unstable_continueExecution=function(){g||p||(g=!0,X(b))},t.unstable_forceFrameRate=function(L){0>L||125<L?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):T=0<L?Math.floor(1e3/L):5},t.unstable_getCurrentPriorityLevel=function(){return d},t.unstable_getFirstCallbackNode=function(){return n(l)},t.unstable_next=function(L){switch(d){case 1:case 2:case 3:var $=3;break;default:$=d}var J=d;d=$;try{return L()}finally{d=J}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(L,$){switch(L){case 1:case 2:case 3:case 4:case 5:break;default:L=3}var J=d;d=L;try{return $()}finally{d=J}},t.unstable_scheduleCallback=function(L,$,J){var le=t.unstable_now();switch(typeof J=="object"&&J!==null?(J=J.delay,J=typeof J=="number"&&0<J?le+J:le):J=le,L){case 1:var we=-1;break;case 2:we=250;break;case 5:we=1073741823;break;case 4:we=1e4;break;default:we=5e3}return we=J+we,L={id:u++,callback:$,priorityLevel:L,startTime:J,expirationTime:we,sortIndex:-1},J>le?(L.sortIndex=J,e(c,L),n(l)===null&&L===n(c)&&(v?(f(C),C=-1):v=!0,ie(y,J-le))):(L.sortIndex=we,e(l,L),g||p||(g=!0,X(b))),L},t.unstable_shouldYield=P,t.unstable_wrapCallback=function(L){var $=d;return function(){var J=d;d=$;try{return L.apply(this,arguments)}finally{d=J}}}})(d0);h0.exports=d0;var kx=h0.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Bx=Ra,Nn=kx;function ne(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var p0=new Set,sa={};function ss(t,e){Qs(t,e),Qs(t+"Capture",e)}function Qs(t,e){for(sa[t]=e,t=0;t<e.length;t++)p0.add(e[t])}var Bi=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),gf=Object.prototype.hasOwnProperty,zx=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Ep={},Tp={};function Hx(t){return gf.call(Tp,t)?!0:gf.call(Ep,t)?!1:zx.test(t)?Tp[t]=!0:(Ep[t]=!0,!1)}function Gx(t,e,n,i){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function Vx(t,e,n,i){if(e===null||typeof e>"u"||Gx(t,e,n,i))return!0;if(i)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function gn(t,e,n,i,r,s,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=o}var Yt={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){Yt[t]=new gn(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];Yt[e]=new gn(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){Yt[t]=new gn(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){Yt[t]=new gn(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){Yt[t]=new gn(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){Yt[t]=new gn(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){Yt[t]=new gn(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){Yt[t]=new gn(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){Yt[t]=new gn(t,5,!1,t.toLowerCase(),null,!1,!1)});var id=/[\-:]([a-z])/g;function rd(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(id,rd);Yt[e]=new gn(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(id,rd);Yt[e]=new gn(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(id,rd);Yt[e]=new gn(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){Yt[t]=new gn(t,1,!1,t.toLowerCase(),null,!1,!1)});Yt.xlinkHref=new gn("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){Yt[t]=new gn(t,1,!1,t.toLowerCase(),null,!0,!0)});function sd(t,e,n,i){var r=Yt.hasOwnProperty(e)?Yt[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(Vx(e,n,r,i)&&(n=null),i||r===null?Hx(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):r.mustUseProperty?t[r.propertyName]=n===null?r.type===3?!1:"":n:(e=r.attributeName,i=r.attributeNamespace,n===null?t.removeAttribute(e):(r=r.type,n=r===3||r===4&&n===!0?"":""+n,i?t.setAttributeNS(i,e,n):t.setAttribute(e,n))))}var ji=Bx.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,za=Symbol.for("react.element"),bs=Symbol.for("react.portal"),Ps=Symbol.for("react.fragment"),od=Symbol.for("react.strict_mode"),_f=Symbol.for("react.profiler"),m0=Symbol.for("react.provider"),g0=Symbol.for("react.context"),ad=Symbol.for("react.forward_ref"),vf=Symbol.for("react.suspense"),xf=Symbol.for("react.suspense_list"),ld=Symbol.for("react.memo"),nr=Symbol.for("react.lazy"),_0=Symbol.for("react.offscreen"),wp=Symbol.iterator;function Eo(t){return t===null||typeof t!="object"?null:(t=wp&&t[wp]||t["@@iterator"],typeof t=="function"?t:null)}var Et=Object.assign,ru;function ko(t){if(ru===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);ru=e&&e[1]||""}return`
`+ru+t}var su=!1;function ou(t,e){if(!t||su)return"";su=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(c){var i=c}Reflect.construct(t,[],e)}else{try{e.call()}catch(c){i=c}t.call(e.prototype)}else{try{throw Error()}catch(c){i=c}t()}}catch(c){if(c&&i&&typeof c.stack=="string"){for(var r=c.stack.split(`
`),s=i.stack.split(`
`),o=r.length-1,a=s.length-1;1<=o&&0<=a&&r[o]!==s[a];)a--;for(;1<=o&&0<=a;o--,a--)if(r[o]!==s[a]){if(o!==1||a!==1)do if(o--,a--,0>a||r[o]!==s[a]){var l=`
`+r[o].replace(" at new "," at ");return t.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",t.displayName)),l}while(1<=o&&0<=a);break}}}finally{su=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?ko(t):""}function Wx(t){switch(t.tag){case 5:return ko(t.type);case 16:return ko("Lazy");case 13:return ko("Suspense");case 19:return ko("SuspenseList");case 0:case 2:case 15:return t=ou(t.type,!1),t;case 11:return t=ou(t.type.render,!1),t;case 1:return t=ou(t.type,!0),t;default:return""}}function yf(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case Ps:return"Fragment";case bs:return"Portal";case _f:return"Profiler";case od:return"StrictMode";case vf:return"Suspense";case xf:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case g0:return(t.displayName||"Context")+".Consumer";case m0:return(t._context.displayName||"Context")+".Provider";case ad:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case ld:return e=t.displayName||null,e!==null?e:yf(t.type)||"Memo";case nr:e=t._payload,t=t._init;try{return yf(t(e))}catch{}}return null}function Xx(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return yf(e);case 8:return e===od?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function xr(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function v0(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function jx(t){var e=v0(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),i=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var r=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return r.call(this)},set:function(o){i=""+o,s.call(this,o)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return i},setValue:function(o){i=""+o},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function Ha(t){t._valueTracker||(t._valueTracker=jx(t))}function x0(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),i="";return t&&(i=v0(t)?t.checked?"true":"false":t.value),t=i,t!==n?(e.setValue(t),!0):!1}function rc(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function Sf(t,e){var n=e.checked;return Et({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function Ap(t,e){var n=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;n=xr(e.value!=null?e.value:n),t._wrapperState={initialChecked:i,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function y0(t,e){e=e.checked,e!=null&&sd(t,"checked",e,!1)}function Mf(t,e){y0(t,e);var n=xr(e.value),i=e.type;if(n!=null)i==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(i==="submit"||i==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?Ef(t,e.type,n):e.hasOwnProperty("defaultValue")&&Ef(t,e.type,xr(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function Rp(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function Ef(t,e,n){(e!=="number"||rc(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var Bo=Array.isArray;function Gs(t,e,n,i){if(t=t.options,e){e={};for(var r=0;r<n.length;r++)e["$"+n[r]]=!0;for(n=0;n<t.length;n++)r=e.hasOwnProperty("$"+t[n].value),t[n].selected!==r&&(t[n].selected=r),r&&i&&(t[n].defaultSelected=!0)}else{for(n=""+xr(n),e=null,r=0;r<t.length;r++){if(t[r].value===n){t[r].selected=!0,i&&(t[r].defaultSelected=!0);return}e!==null||t[r].disabled||(e=t[r])}e!==null&&(e.selected=!0)}}function Tf(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(ne(91));return Et({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function Cp(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(ne(92));if(Bo(n)){if(1<n.length)throw Error(ne(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:xr(n)}}function S0(t,e){var n=xr(e.value),i=xr(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),i!=null&&(t.defaultValue=""+i)}function bp(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function M0(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function wf(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?M0(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var Ga,E0=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,i,r){MSApp.execUnsafeLocalFunction(function(){return t(e,n,i,r)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(Ga=Ga||document.createElement("div"),Ga.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=Ga.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function oa(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var Ko={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Yx=["Webkit","ms","Moz","O"];Object.keys(Ko).forEach(function(t){Yx.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),Ko[e]=Ko[t]})});function T0(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||Ko.hasOwnProperty(t)&&Ko[t]?(""+e).trim():e+"px"}function w0(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var i=n.indexOf("--")===0,r=T0(n,e[n],i);n==="float"&&(n="cssFloat"),i?t.setProperty(n,r):t[n]=r}}var Kx=Et({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Af(t,e){if(e){if(Kx[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(ne(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(ne(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(ne(61))}if(e.style!=null&&typeof e.style!="object")throw Error(ne(62))}}function Rf(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Cf=null;function cd(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var bf=null,Vs=null,Ws=null;function Pp(t){if(t=Pa(t)){if(typeof bf!="function")throw Error(ne(280));var e=t.stateNode;e&&(e=kc(e),bf(t.stateNode,t.type,e))}}function A0(t){Vs?Ws?Ws.push(t):Ws=[t]:Vs=t}function R0(){if(Vs){var t=Vs,e=Ws;if(Ws=Vs=null,Pp(t),e)for(t=0;t<e.length;t++)Pp(e[t])}}function C0(t,e){return t(e)}function b0(){}var au=!1;function P0(t,e,n){if(au)return t(e,n);au=!0;try{return C0(t,e,n)}finally{au=!1,(Vs!==null||Ws!==null)&&(b0(),R0())}}function aa(t,e){var n=t.stateNode;if(n===null)return null;var i=kc(n);if(i===null)return null;n=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(t=t.type,i=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!i;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(ne(231,e,typeof n));return n}var Pf=!1;if(Bi)try{var To={};Object.defineProperty(To,"passive",{get:function(){Pf=!0}}),window.addEventListener("test",To,To),window.removeEventListener("test",To,To)}catch{Pf=!1}function $x(t,e,n,i,r,s,o,a,l){var c=Array.prototype.slice.call(arguments,3);try{e.apply(n,c)}catch(u){this.onError(u)}}var $o=!1,sc=null,oc=!1,Lf=null,qx={onError:function(t){$o=!0,sc=t}};function Zx(t,e,n,i,r,s,o,a,l){$o=!1,sc=null,$x.apply(qx,arguments)}function Qx(t,e,n,i,r,s,o,a,l){if(Zx.apply(this,arguments),$o){if($o){var c=sc;$o=!1,sc=null}else throw Error(ne(198));oc||(oc=!0,Lf=c)}}function os(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function L0(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function Lp(t){if(os(t)!==t)throw Error(ne(188))}function Jx(t){var e=t.alternate;if(!e){if(e=os(t),e===null)throw Error(ne(188));return e!==t?null:t}for(var n=t,i=e;;){var r=n.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){n=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===n)return Lp(r),t;if(s===i)return Lp(r),e;s=s.sibling}throw Error(ne(188))}if(n.return!==i.return)n=r,i=s;else{for(var o=!1,a=r.child;a;){if(a===n){o=!0,n=r,i=s;break}if(a===i){o=!0,i=r,n=s;break}a=a.sibling}if(!o){for(a=s.child;a;){if(a===n){o=!0,n=s,i=r;break}if(a===i){o=!0,i=s,n=r;break}a=a.sibling}if(!o)throw Error(ne(189))}}if(n.alternate!==i)throw Error(ne(190))}if(n.tag!==3)throw Error(ne(188));return n.stateNode.current===n?t:e}function I0(t){return t=Jx(t),t!==null?D0(t):null}function D0(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=D0(t);if(e!==null)return e;t=t.sibling}return null}var N0=Nn.unstable_scheduleCallback,Ip=Nn.unstable_cancelCallback,ey=Nn.unstable_shouldYield,ty=Nn.unstable_requestPaint,bt=Nn.unstable_now,ny=Nn.unstable_getCurrentPriorityLevel,ud=Nn.unstable_ImmediatePriority,U0=Nn.unstable_UserBlockingPriority,ac=Nn.unstable_NormalPriority,iy=Nn.unstable_LowPriority,O0=Nn.unstable_IdlePriority,Nc=null,mi=null;function ry(t){if(mi&&typeof mi.onCommitFiberRoot=="function")try{mi.onCommitFiberRoot(Nc,t,void 0,(t.current.flags&128)===128)}catch{}}var si=Math.clz32?Math.clz32:ay,sy=Math.log,oy=Math.LN2;function ay(t){return t>>>=0,t===0?32:31-(sy(t)/oy|0)|0}var Va=64,Wa=4194304;function zo(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function lc(t,e){var n=t.pendingLanes;if(n===0)return 0;var i=0,r=t.suspendedLanes,s=t.pingedLanes,o=n&268435455;if(o!==0){var a=o&~r;a!==0?i=zo(a):(s&=o,s!==0&&(i=zo(s)))}else o=n&~r,o!==0?i=zo(o):s!==0&&(i=zo(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=i;0<e;)n=31-si(e),r=1<<n,i|=t[n],e&=~r;return i}function ly(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function cy(t,e){for(var n=t.suspendedLanes,i=t.pingedLanes,r=t.expirationTimes,s=t.pendingLanes;0<s;){var o=31-si(s),a=1<<o,l=r[o];l===-1?(!(a&n)||a&i)&&(r[o]=ly(a,e)):l<=e&&(t.expiredLanes|=a),s&=~a}}function If(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function F0(){var t=Va;return Va<<=1,!(Va&4194240)&&(Va=64),t}function lu(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function Ca(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-si(e),t[e]=n}function uy(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var i=t.eventTimes;for(t=t.expirationTimes;0<n;){var r=31-si(n),s=1<<r;e[r]=0,i[r]=-1,t[r]=-1,n&=~s}}function fd(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var i=31-si(n),r=1<<i;r&e|t[i]&e&&(t[i]|=e),n&=~r}}var at=0;function k0(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var B0,hd,z0,H0,G0,Df=!1,Xa=[],cr=null,ur=null,fr=null,la=new Map,ca=new Map,rr=[],fy="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Dp(t,e){switch(t){case"focusin":case"focusout":cr=null;break;case"dragenter":case"dragleave":ur=null;break;case"mouseover":case"mouseout":fr=null;break;case"pointerover":case"pointerout":la.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":ca.delete(e.pointerId)}}function wo(t,e,n,i,r,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=Pa(e),e!==null&&hd(e)),t):(t.eventSystemFlags|=i,e=t.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),t)}function hy(t,e,n,i,r){switch(e){case"focusin":return cr=wo(cr,t,e,n,i,r),!0;case"dragenter":return ur=wo(ur,t,e,n,i,r),!0;case"mouseover":return fr=wo(fr,t,e,n,i,r),!0;case"pointerover":var s=r.pointerId;return la.set(s,wo(la.get(s)||null,t,e,n,i,r)),!0;case"gotpointercapture":return s=r.pointerId,ca.set(s,wo(ca.get(s)||null,t,e,n,i,r)),!0}return!1}function V0(t){var e=Xr(t.target);if(e!==null){var n=os(e);if(n!==null){if(e=n.tag,e===13){if(e=L0(n),e!==null){t.blockedOn=e,G0(t.priority,function(){z0(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Bl(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=Nf(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var i=new n.constructor(n.type,n);Cf=i,n.target.dispatchEvent(i),Cf=null}else return e=Pa(n),e!==null&&hd(e),t.blockedOn=n,!1;e.shift()}return!0}function Np(t,e,n){Bl(t)&&n.delete(e)}function dy(){Df=!1,cr!==null&&Bl(cr)&&(cr=null),ur!==null&&Bl(ur)&&(ur=null),fr!==null&&Bl(fr)&&(fr=null),la.forEach(Np),ca.forEach(Np)}function Ao(t,e){t.blockedOn===e&&(t.blockedOn=null,Df||(Df=!0,Nn.unstable_scheduleCallback(Nn.unstable_NormalPriority,dy)))}function ua(t){function e(r){return Ao(r,t)}if(0<Xa.length){Ao(Xa[0],t);for(var n=1;n<Xa.length;n++){var i=Xa[n];i.blockedOn===t&&(i.blockedOn=null)}}for(cr!==null&&Ao(cr,t),ur!==null&&Ao(ur,t),fr!==null&&Ao(fr,t),la.forEach(e),ca.forEach(e),n=0;n<rr.length;n++)i=rr[n],i.blockedOn===t&&(i.blockedOn=null);for(;0<rr.length&&(n=rr[0],n.blockedOn===null);)V0(n),n.blockedOn===null&&rr.shift()}var Xs=ji.ReactCurrentBatchConfig,cc=!0;function py(t,e,n,i){var r=at,s=Xs.transition;Xs.transition=null;try{at=1,dd(t,e,n,i)}finally{at=r,Xs.transition=s}}function my(t,e,n,i){var r=at,s=Xs.transition;Xs.transition=null;try{at=4,dd(t,e,n,i)}finally{at=r,Xs.transition=s}}function dd(t,e,n,i){if(cc){var r=Nf(t,e,n,i);if(r===null)vu(t,e,i,uc,n),Dp(t,i);else if(hy(r,t,e,n,i))i.stopPropagation();else if(Dp(t,i),e&4&&-1<fy.indexOf(t)){for(;r!==null;){var s=Pa(r);if(s!==null&&B0(s),s=Nf(t,e,n,i),s===null&&vu(t,e,i,uc,n),s===r)break;r=s}r!==null&&i.stopPropagation()}else vu(t,e,i,null,n)}}var uc=null;function Nf(t,e,n,i){if(uc=null,t=cd(i),t=Xr(t),t!==null)if(e=os(t),e===null)t=null;else if(n=e.tag,n===13){if(t=L0(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return uc=t,null}function W0(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(ny()){case ud:return 1;case U0:return 4;case ac:case iy:return 16;case O0:return 536870912;default:return 16}default:return 16}}var ar=null,pd=null,zl=null;function X0(){if(zl)return zl;var t,e=pd,n=e.length,i,r="value"in ar?ar.value:ar.textContent,s=r.length;for(t=0;t<n&&e[t]===r[t];t++);var o=n-t;for(i=1;i<=o&&e[n-i]===r[s-i];i++);return zl=r.slice(t,1<i?1-i:void 0)}function Hl(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function ja(){return!0}function Up(){return!1}function On(t){function e(n,i,r,s,o){this._reactName=n,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=o,this.currentTarget=null;for(var a in t)t.hasOwnProperty(a)&&(n=t[a],this[a]=n?n(s):s[a]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?ja:Up,this.isPropagationStopped=Up,this}return Et(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=ja)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=ja)},persist:function(){},isPersistent:ja}),e}var po={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},md=On(po),ba=Et({},po,{view:0,detail:0}),gy=On(ba),cu,uu,Ro,Uc=Et({},ba,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:gd,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==Ro&&(Ro&&t.type==="mousemove"?(cu=t.screenX-Ro.screenX,uu=t.screenY-Ro.screenY):uu=cu=0,Ro=t),cu)},movementY:function(t){return"movementY"in t?t.movementY:uu}}),Op=On(Uc),_y=Et({},Uc,{dataTransfer:0}),vy=On(_y),xy=Et({},ba,{relatedTarget:0}),fu=On(xy),yy=Et({},po,{animationName:0,elapsedTime:0,pseudoElement:0}),Sy=On(yy),My=Et({},po,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),Ey=On(My),Ty=Et({},po,{data:0}),Fp=On(Ty),wy={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Ay={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Ry={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Cy(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=Ry[t])?!!e[t]:!1}function gd(){return Cy}var by=Et({},ba,{key:function(t){if(t.key){var e=wy[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=Hl(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?Ay[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:gd,charCode:function(t){return t.type==="keypress"?Hl(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?Hl(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),Py=On(by),Ly=Et({},Uc,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),kp=On(Ly),Iy=Et({},ba,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:gd}),Dy=On(Iy),Ny=Et({},po,{propertyName:0,elapsedTime:0,pseudoElement:0}),Uy=On(Ny),Oy=Et({},Uc,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),Fy=On(Oy),ky=[9,13,27,32],_d=Bi&&"CompositionEvent"in window,qo=null;Bi&&"documentMode"in document&&(qo=document.documentMode);var By=Bi&&"TextEvent"in window&&!qo,j0=Bi&&(!_d||qo&&8<qo&&11>=qo),Bp=" ",zp=!1;function Y0(t,e){switch(t){case"keyup":return ky.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function K0(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var Ls=!1;function zy(t,e){switch(t){case"compositionend":return K0(e);case"keypress":return e.which!==32?null:(zp=!0,Bp);case"textInput":return t=e.data,t===Bp&&zp?null:t;default:return null}}function Hy(t,e){if(Ls)return t==="compositionend"||!_d&&Y0(t,e)?(t=X0(),zl=pd=ar=null,Ls=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return j0&&e.locale!=="ko"?null:e.data;default:return null}}var Gy={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Hp(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!Gy[t.type]:e==="textarea"}function $0(t,e,n,i){A0(i),e=fc(e,"onChange"),0<e.length&&(n=new md("onChange","change",null,n,i),t.push({event:n,listeners:e}))}var Zo=null,fa=null;function Vy(t){o_(t,0)}function Oc(t){var e=Ns(t);if(x0(e))return t}function Wy(t,e){if(t==="change")return e}var q0=!1;if(Bi){var hu;if(Bi){var du="oninput"in document;if(!du){var Gp=document.createElement("div");Gp.setAttribute("oninput","return;"),du=typeof Gp.oninput=="function"}hu=du}else hu=!1;q0=hu&&(!document.documentMode||9<document.documentMode)}function Vp(){Zo&&(Zo.detachEvent("onpropertychange",Z0),fa=Zo=null)}function Z0(t){if(t.propertyName==="value"&&Oc(fa)){var e=[];$0(e,fa,t,cd(t)),P0(Vy,e)}}function Xy(t,e,n){t==="focusin"?(Vp(),Zo=e,fa=n,Zo.attachEvent("onpropertychange",Z0)):t==="focusout"&&Vp()}function jy(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Oc(fa)}function Yy(t,e){if(t==="click")return Oc(e)}function Ky(t,e){if(t==="input"||t==="change")return Oc(e)}function $y(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var ai=typeof Object.is=="function"?Object.is:$y;function ha(t,e){if(ai(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),i=Object.keys(e);if(n.length!==i.length)return!1;for(i=0;i<n.length;i++){var r=n[i];if(!gf.call(e,r)||!ai(t[r],e[r]))return!1}return!0}function Wp(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function Xp(t,e){var n=Wp(t);t=0;for(var i;n;){if(n.nodeType===3){if(i=t+n.textContent.length,t<=e&&i>=e)return{node:n,offset:e-t};t=i}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Wp(n)}}function Q0(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?Q0(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function J0(){for(var t=window,e=rc();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=rc(t.document)}return e}function vd(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function qy(t){var e=J0(),n=t.focusedElem,i=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&Q0(n.ownerDocument.documentElement,n)){if(i!==null&&vd(n)){if(e=i.start,t=i.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var r=n.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!t.extend&&s>i&&(r=i,i=s,s=r),r=Xp(n,s);var o=Xp(n,i);r&&o&&(t.rangeCount!==1||t.anchorNode!==r.node||t.anchorOffset!==r.offset||t.focusNode!==o.node||t.focusOffset!==o.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),t.removeAllRanges(),s>i?(t.addRange(e),t.extend(o.node,o.offset)):(e.setEnd(o.node,o.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var Zy=Bi&&"documentMode"in document&&11>=document.documentMode,Is=null,Uf=null,Qo=null,Of=!1;function jp(t,e,n){var i=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Of||Is==null||Is!==rc(i)||(i=Is,"selectionStart"in i&&vd(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),Qo&&ha(Qo,i)||(Qo=i,i=fc(Uf,"onSelect"),0<i.length&&(e=new md("onSelect","select",null,e,n),t.push({event:e,listeners:i}),e.target=Is)))}function Ya(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var Ds={animationend:Ya("Animation","AnimationEnd"),animationiteration:Ya("Animation","AnimationIteration"),animationstart:Ya("Animation","AnimationStart"),transitionend:Ya("Transition","TransitionEnd")},pu={},e_={};Bi&&(e_=document.createElement("div").style,"AnimationEvent"in window||(delete Ds.animationend.animation,delete Ds.animationiteration.animation,delete Ds.animationstart.animation),"TransitionEvent"in window||delete Ds.transitionend.transition);function Fc(t){if(pu[t])return pu[t];if(!Ds[t])return t;var e=Ds[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in e_)return pu[t]=e[n];return t}var t_=Fc("animationend"),n_=Fc("animationiteration"),i_=Fc("animationstart"),r_=Fc("transitionend"),s_=new Map,Yp="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Sr(t,e){s_.set(t,e),ss(e,[t])}for(var mu=0;mu<Yp.length;mu++){var gu=Yp[mu],Qy=gu.toLowerCase(),Jy=gu[0].toUpperCase()+gu.slice(1);Sr(Qy,"on"+Jy)}Sr(t_,"onAnimationEnd");Sr(n_,"onAnimationIteration");Sr(i_,"onAnimationStart");Sr("dblclick","onDoubleClick");Sr("focusin","onFocus");Sr("focusout","onBlur");Sr(r_,"onTransitionEnd");Qs("onMouseEnter",["mouseout","mouseover"]);Qs("onMouseLeave",["mouseout","mouseover"]);Qs("onPointerEnter",["pointerout","pointerover"]);Qs("onPointerLeave",["pointerout","pointerover"]);ss("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));ss("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));ss("onBeforeInput",["compositionend","keypress","textInput","paste"]);ss("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));ss("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));ss("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Ho="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),eS=new Set("cancel close invalid load scroll toggle".split(" ").concat(Ho));function Kp(t,e,n){var i=t.type||"unknown-event";t.currentTarget=n,Qx(i,e,void 0,t),t.currentTarget=null}function o_(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var i=t[n],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var o=i.length-1;0<=o;o--){var a=i[o],l=a.instance,c=a.currentTarget;if(a=a.listener,l!==s&&r.isPropagationStopped())break e;Kp(r,a,c),s=l}else for(o=0;o<i.length;o++){if(a=i[o],l=a.instance,c=a.currentTarget,a=a.listener,l!==s&&r.isPropagationStopped())break e;Kp(r,a,c),s=l}}}if(oc)throw t=Lf,oc=!1,Lf=null,t}function gt(t,e){var n=e[Hf];n===void 0&&(n=e[Hf]=new Set);var i=t+"__bubble";n.has(i)||(a_(e,t,2,!1),n.add(i))}function _u(t,e,n){var i=0;e&&(i|=4),a_(n,t,i,e)}var Ka="_reactListening"+Math.random().toString(36).slice(2);function da(t){if(!t[Ka]){t[Ka]=!0,p0.forEach(function(n){n!=="selectionchange"&&(eS.has(n)||_u(n,!1,t),_u(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[Ka]||(e[Ka]=!0,_u("selectionchange",!1,e))}}function a_(t,e,n,i){switch(W0(e)){case 1:var r=py;break;case 4:r=my;break;default:r=dd}n=r.bind(null,e,n,t),r=void 0,!Pf||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?t.addEventListener(e,n,{capture:!0,passive:r}):t.addEventListener(e,n,!0):r!==void 0?t.addEventListener(e,n,{passive:r}):t.addEventListener(e,n,!1)}function vu(t,e,n,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var o=i.tag;if(o===3||o===4){var a=i.stateNode.containerInfo;if(a===r||a.nodeType===8&&a.parentNode===r)break;if(o===4)for(o=i.return;o!==null;){var l=o.tag;if((l===3||l===4)&&(l=o.stateNode.containerInfo,l===r||l.nodeType===8&&l.parentNode===r))return;o=o.return}for(;a!==null;){if(o=Xr(a),o===null)return;if(l=o.tag,l===5||l===6){i=s=o;continue e}a=a.parentNode}}i=i.return}P0(function(){var c=s,u=cd(n),h=[];e:{var d=s_.get(t);if(d!==void 0){var p=md,g=t;switch(t){case"keypress":if(Hl(n)===0)break e;case"keydown":case"keyup":p=Py;break;case"focusin":g="focus",p=fu;break;case"focusout":g="blur",p=fu;break;case"beforeblur":case"afterblur":p=fu;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=Op;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=vy;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=Dy;break;case t_:case n_:case i_:p=Sy;break;case r_:p=Uy;break;case"scroll":p=gy;break;case"wheel":p=Fy;break;case"copy":case"cut":case"paste":p=Ey;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=kp}var v=(e&4)!==0,m=!v&&t==="scroll",f=v?d!==null?d+"Capture":null:d;v=[];for(var _=c,x;_!==null;){x=_;var y=x.stateNode;if(x.tag===5&&y!==null&&(x=y,f!==null&&(y=aa(_,f),y!=null&&v.push(pa(_,y,x)))),m)break;_=_.return}0<v.length&&(d=new p(d,g,null,n,u),h.push({event:d,listeners:v}))}}if(!(e&7)){e:{if(d=t==="mouseover"||t==="pointerover",p=t==="mouseout"||t==="pointerout",d&&n!==Cf&&(g=n.relatedTarget||n.fromElement)&&(Xr(g)||g[zi]))break e;if((p||d)&&(d=u.window===u?u:(d=u.ownerDocument)?d.defaultView||d.parentWindow:window,p?(g=n.relatedTarget||n.toElement,p=c,g=g?Xr(g):null,g!==null&&(m=os(g),g!==m||g.tag!==5&&g.tag!==6)&&(g=null)):(p=null,g=c),p!==g)){if(v=Op,y="onMouseLeave",f="onMouseEnter",_="mouse",(t==="pointerout"||t==="pointerover")&&(v=kp,y="onPointerLeave",f="onPointerEnter",_="pointer"),m=p==null?d:Ns(p),x=g==null?d:Ns(g),d=new v(y,_+"leave",p,n,u),d.target=m,d.relatedTarget=x,y=null,Xr(u)===c&&(v=new v(f,_+"enter",g,n,u),v.target=x,v.relatedTarget=m,y=v),m=y,p&&g)t:{for(v=p,f=g,_=0,x=v;x;x=cs(x))_++;for(x=0,y=f;y;y=cs(y))x++;for(;0<_-x;)v=cs(v),_--;for(;0<x-_;)f=cs(f),x--;for(;_--;){if(v===f||f!==null&&v===f.alternate)break t;v=cs(v),f=cs(f)}v=null}else v=null;p!==null&&$p(h,d,p,v,!1),g!==null&&m!==null&&$p(h,m,g,v,!0)}}e:{if(d=c?Ns(c):window,p=d.nodeName&&d.nodeName.toLowerCase(),p==="select"||p==="input"&&d.type==="file")var b=Wy;else if(Hp(d))if(q0)b=Ky;else{b=jy;var A=Xy}else(p=d.nodeName)&&p.toLowerCase()==="input"&&(d.type==="checkbox"||d.type==="radio")&&(b=Yy);if(b&&(b=b(t,c))){$0(h,b,n,u);break e}A&&A(t,d,c),t==="focusout"&&(A=d._wrapperState)&&A.controlled&&d.type==="number"&&Ef(d,"number",d.value)}switch(A=c?Ns(c):window,t){case"focusin":(Hp(A)||A.contentEditable==="true")&&(Is=A,Uf=c,Qo=null);break;case"focusout":Qo=Uf=Is=null;break;case"mousedown":Of=!0;break;case"contextmenu":case"mouseup":case"dragend":Of=!1,jp(h,n,u);break;case"selectionchange":if(Zy)break;case"keydown":case"keyup":jp(h,n,u)}var R;if(_d)e:{switch(t){case"compositionstart":var C="onCompositionStart";break e;case"compositionend":C="onCompositionEnd";break e;case"compositionupdate":C="onCompositionUpdate";break e}C=void 0}else Ls?Y0(t,n)&&(C="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(C="onCompositionStart");C&&(j0&&n.locale!=="ko"&&(Ls||C!=="onCompositionStart"?C==="onCompositionEnd"&&Ls&&(R=X0()):(ar=u,pd="value"in ar?ar.value:ar.textContent,Ls=!0)),A=fc(c,C),0<A.length&&(C=new Fp(C,t,null,n,u),h.push({event:C,listeners:A}),R?C.data=R:(R=K0(n),R!==null&&(C.data=R)))),(R=By?zy(t,n):Hy(t,n))&&(c=fc(c,"onBeforeInput"),0<c.length&&(u=new Fp("onBeforeInput","beforeinput",null,n,u),h.push({event:u,listeners:c}),u.data=R))}o_(h,e)})}function pa(t,e,n){return{instance:t,listener:e,currentTarget:n}}function fc(t,e){for(var n=e+"Capture",i=[];t!==null;){var r=t,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=aa(t,n),s!=null&&i.unshift(pa(t,s,r)),s=aa(t,e),s!=null&&i.push(pa(t,s,r))),t=t.return}return i}function cs(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function $p(t,e,n,i,r){for(var s=e._reactName,o=[];n!==null&&n!==i;){var a=n,l=a.alternate,c=a.stateNode;if(l!==null&&l===i)break;a.tag===5&&c!==null&&(a=c,r?(l=aa(n,s),l!=null&&o.unshift(pa(n,l,a))):r||(l=aa(n,s),l!=null&&o.push(pa(n,l,a)))),n=n.return}o.length!==0&&t.push({event:e,listeners:o})}var tS=/\r\n?/g,nS=/\u0000|\uFFFD/g;function qp(t){return(typeof t=="string"?t:""+t).replace(tS,`
`).replace(nS,"")}function $a(t,e,n){if(e=qp(e),qp(t)!==e&&n)throw Error(ne(425))}function hc(){}var Ff=null,kf=null;function Bf(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var zf=typeof setTimeout=="function"?setTimeout:void 0,iS=typeof clearTimeout=="function"?clearTimeout:void 0,Zp=typeof Promise=="function"?Promise:void 0,rS=typeof queueMicrotask=="function"?queueMicrotask:typeof Zp<"u"?function(t){return Zp.resolve(null).then(t).catch(sS)}:zf;function sS(t){setTimeout(function(){throw t})}function xu(t,e){var n=e,i=0;do{var r=n.nextSibling;if(t.removeChild(n),r&&r.nodeType===8)if(n=r.data,n==="/$"){if(i===0){t.removeChild(r),ua(e);return}i--}else n!=="$"&&n!=="$?"&&n!=="$!"||i++;n=r}while(n);ua(e)}function hr(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function Qp(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var mo=Math.random().toString(36).slice(2),di="__reactFiber$"+mo,ma="__reactProps$"+mo,zi="__reactContainer$"+mo,Hf="__reactEvents$"+mo,oS="__reactListeners$"+mo,aS="__reactHandles$"+mo;function Xr(t){var e=t[di];if(e)return e;for(var n=t.parentNode;n;){if(e=n[zi]||n[di]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=Qp(t);t!==null;){if(n=t[di])return n;t=Qp(t)}return e}t=n,n=t.parentNode}return null}function Pa(t){return t=t[di]||t[zi],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function Ns(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(ne(33))}function kc(t){return t[ma]||null}var Gf=[],Us=-1;function Mr(t){return{current:t}}function _t(t){0>Us||(t.current=Gf[Us],Gf[Us]=null,Us--)}function ht(t,e){Us++,Gf[Us]=t.current,t.current=e}var yr={},sn=Mr(yr),Mn=Mr(!1),Qr=yr;function Js(t,e){var n=t.type.contextTypes;if(!n)return yr;var i=t.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in n)r[s]=e[s];return i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=r),r}function En(t){return t=t.childContextTypes,t!=null}function dc(){_t(Mn),_t(sn)}function Jp(t,e,n){if(sn.current!==yr)throw Error(ne(168));ht(sn,e),ht(Mn,n)}function l_(t,e,n){var i=t.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return n;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(ne(108,Xx(t)||"Unknown",r));return Et({},n,i)}function pc(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||yr,Qr=sn.current,ht(sn,t),ht(Mn,Mn.current),!0}function em(t,e,n){var i=t.stateNode;if(!i)throw Error(ne(169));n?(t=l_(t,e,Qr),i.__reactInternalMemoizedMergedChildContext=t,_t(Mn),_t(sn),ht(sn,t)):_t(Mn),ht(Mn,n)}var Pi=null,Bc=!1,yu=!1;function c_(t){Pi===null?Pi=[t]:Pi.push(t)}function lS(t){Bc=!0,c_(t)}function Er(){if(!yu&&Pi!==null){yu=!0;var t=0,e=at;try{var n=Pi;for(at=1;t<n.length;t++){var i=n[t];do i=i(!0);while(i!==null)}Pi=null,Bc=!1}catch(r){throw Pi!==null&&(Pi=Pi.slice(t+1)),N0(ud,Er),r}finally{at=e,yu=!1}}return null}var Os=[],Fs=0,mc=null,gc=0,zn=[],Hn=0,Jr=null,Ii=1,Di="";function Or(t,e){Os[Fs++]=gc,Os[Fs++]=mc,mc=t,gc=e}function u_(t,e,n){zn[Hn++]=Ii,zn[Hn++]=Di,zn[Hn++]=Jr,Jr=t;var i=Ii;t=Di;var r=32-si(i)-1;i&=~(1<<r),n+=1;var s=32-si(e)+r;if(30<s){var o=r-r%5;s=(i&(1<<o)-1).toString(32),i>>=o,r-=o,Ii=1<<32-si(e)+r|n<<r|i,Di=s+t}else Ii=1<<s|n<<r|i,Di=t}function xd(t){t.return!==null&&(Or(t,1),u_(t,1,0))}function yd(t){for(;t===mc;)mc=Os[--Fs],Os[Fs]=null,gc=Os[--Fs],Os[Fs]=null;for(;t===Jr;)Jr=zn[--Hn],zn[Hn]=null,Di=zn[--Hn],zn[Hn]=null,Ii=zn[--Hn],zn[Hn]=null}var Dn=null,In=null,vt=!1,ii=null;function f_(t,e){var n=Wn(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function tm(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,Dn=t,In=hr(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,Dn=t,In=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=Jr!==null?{id:Ii,overflow:Di}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=Wn(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,Dn=t,In=null,!0):!1;default:return!1}}function Vf(t){return(t.mode&1)!==0&&(t.flags&128)===0}function Wf(t){if(vt){var e=In;if(e){var n=e;if(!tm(t,e)){if(Vf(t))throw Error(ne(418));e=hr(n.nextSibling);var i=Dn;e&&tm(t,e)?f_(i,n):(t.flags=t.flags&-4097|2,vt=!1,Dn=t)}}else{if(Vf(t))throw Error(ne(418));t.flags=t.flags&-4097|2,vt=!1,Dn=t}}}function nm(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;Dn=t}function qa(t){if(t!==Dn)return!1;if(!vt)return nm(t),vt=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!Bf(t.type,t.memoizedProps)),e&&(e=In)){if(Vf(t))throw h_(),Error(ne(418));for(;e;)f_(t,e),e=hr(e.nextSibling)}if(nm(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(ne(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){In=hr(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}In=null}}else In=Dn?hr(t.stateNode.nextSibling):null;return!0}function h_(){for(var t=In;t;)t=hr(t.nextSibling)}function eo(){In=Dn=null,vt=!1}function Sd(t){ii===null?ii=[t]:ii.push(t)}var cS=ji.ReactCurrentBatchConfig;function Co(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(ne(309));var i=n.stateNode}if(!i)throw Error(ne(147,t));var r=i,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(o){var a=r.refs;o===null?delete a[s]:a[s]=o},e._stringRef=s,e)}if(typeof t!="string")throw Error(ne(284));if(!n._owner)throw Error(ne(290,t))}return t}function Za(t,e){throw t=Object.prototype.toString.call(e),Error(ne(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function im(t){var e=t._init;return e(t._payload)}function d_(t){function e(f,_){if(t){var x=f.deletions;x===null?(f.deletions=[_],f.flags|=16):x.push(_)}}function n(f,_){if(!t)return null;for(;_!==null;)e(f,_),_=_.sibling;return null}function i(f,_){for(f=new Map;_!==null;)_.key!==null?f.set(_.key,_):f.set(_.index,_),_=_.sibling;return f}function r(f,_){return f=gr(f,_),f.index=0,f.sibling=null,f}function s(f,_,x){return f.index=x,t?(x=f.alternate,x!==null?(x=x.index,x<_?(f.flags|=2,_):x):(f.flags|=2,_)):(f.flags|=1048576,_)}function o(f){return t&&f.alternate===null&&(f.flags|=2),f}function a(f,_,x,y){return _===null||_.tag!==6?(_=Ru(x,f.mode,y),_.return=f,_):(_=r(_,x),_.return=f,_)}function l(f,_,x,y){var b=x.type;return b===Ps?u(f,_,x.props.children,y,x.key):_!==null&&(_.elementType===b||typeof b=="object"&&b!==null&&b.$$typeof===nr&&im(b)===_.type)?(y=r(_,x.props),y.ref=Co(f,_,x),y.return=f,y):(y=Kl(x.type,x.key,x.props,null,f.mode,y),y.ref=Co(f,_,x),y.return=f,y)}function c(f,_,x,y){return _===null||_.tag!==4||_.stateNode.containerInfo!==x.containerInfo||_.stateNode.implementation!==x.implementation?(_=Cu(x,f.mode,y),_.return=f,_):(_=r(_,x.children||[]),_.return=f,_)}function u(f,_,x,y,b){return _===null||_.tag!==7?(_=qr(x,f.mode,y,b),_.return=f,_):(_=r(_,x),_.return=f,_)}function h(f,_,x){if(typeof _=="string"&&_!==""||typeof _=="number")return _=Ru(""+_,f.mode,x),_.return=f,_;if(typeof _=="object"&&_!==null){switch(_.$$typeof){case za:return x=Kl(_.type,_.key,_.props,null,f.mode,x),x.ref=Co(f,null,_),x.return=f,x;case bs:return _=Cu(_,f.mode,x),_.return=f,_;case nr:var y=_._init;return h(f,y(_._payload),x)}if(Bo(_)||Eo(_))return _=qr(_,f.mode,x,null),_.return=f,_;Za(f,_)}return null}function d(f,_,x,y){var b=_!==null?_.key:null;if(typeof x=="string"&&x!==""||typeof x=="number")return b!==null?null:a(f,_,""+x,y);if(typeof x=="object"&&x!==null){switch(x.$$typeof){case za:return x.key===b?l(f,_,x,y):null;case bs:return x.key===b?c(f,_,x,y):null;case nr:return b=x._init,d(f,_,b(x._payload),y)}if(Bo(x)||Eo(x))return b!==null?null:u(f,_,x,y,null);Za(f,x)}return null}function p(f,_,x,y,b){if(typeof y=="string"&&y!==""||typeof y=="number")return f=f.get(x)||null,a(_,f,""+y,b);if(typeof y=="object"&&y!==null){switch(y.$$typeof){case za:return f=f.get(y.key===null?x:y.key)||null,l(_,f,y,b);case bs:return f=f.get(y.key===null?x:y.key)||null,c(_,f,y,b);case nr:var A=y._init;return p(f,_,x,A(y._payload),b)}if(Bo(y)||Eo(y))return f=f.get(x)||null,u(_,f,y,b,null);Za(_,y)}return null}function g(f,_,x,y){for(var b=null,A=null,R=_,C=_=0,T=null;R!==null&&C<x.length;C++){R.index>C?(T=R,R=null):T=R.sibling;var S=d(f,R,x[C],y);if(S===null){R===null&&(R=T);break}t&&R&&S.alternate===null&&e(f,R),_=s(S,_,C),A===null?b=S:A.sibling=S,A=S,R=T}if(C===x.length)return n(f,R),vt&&Or(f,C),b;if(R===null){for(;C<x.length;C++)R=h(f,x[C],y),R!==null&&(_=s(R,_,C),A===null?b=R:A.sibling=R,A=R);return vt&&Or(f,C),b}for(R=i(f,R);C<x.length;C++)T=p(R,f,C,x[C],y),T!==null&&(t&&T.alternate!==null&&R.delete(T.key===null?C:T.key),_=s(T,_,C),A===null?b=T:A.sibling=T,A=T);return t&&R.forEach(function(P){return e(f,P)}),vt&&Or(f,C),b}function v(f,_,x,y){var b=Eo(x);if(typeof b!="function")throw Error(ne(150));if(x=b.call(x),x==null)throw Error(ne(151));for(var A=b=null,R=_,C=_=0,T=null,S=x.next();R!==null&&!S.done;C++,S=x.next()){R.index>C?(T=R,R=null):T=R.sibling;var P=d(f,R,S.value,y);if(P===null){R===null&&(R=T);break}t&&R&&P.alternate===null&&e(f,R),_=s(P,_,C),A===null?b=P:A.sibling=P,A=P,R=T}if(S.done)return n(f,R),vt&&Or(f,C),b;if(R===null){for(;!S.done;C++,S=x.next())S=h(f,S.value,y),S!==null&&(_=s(S,_,C),A===null?b=S:A.sibling=S,A=S);return vt&&Or(f,C),b}for(R=i(f,R);!S.done;C++,S=x.next())S=p(R,f,C,S.value,y),S!==null&&(t&&S.alternate!==null&&R.delete(S.key===null?C:S.key),_=s(S,_,C),A===null?b=S:A.sibling=S,A=S);return t&&R.forEach(function(j){return e(f,j)}),vt&&Or(f,C),b}function m(f,_,x,y){if(typeof x=="object"&&x!==null&&x.type===Ps&&x.key===null&&(x=x.props.children),typeof x=="object"&&x!==null){switch(x.$$typeof){case za:e:{for(var b=x.key,A=_;A!==null;){if(A.key===b){if(b=x.type,b===Ps){if(A.tag===7){n(f,A.sibling),_=r(A,x.props.children),_.return=f,f=_;break e}}else if(A.elementType===b||typeof b=="object"&&b!==null&&b.$$typeof===nr&&im(b)===A.type){n(f,A.sibling),_=r(A,x.props),_.ref=Co(f,A,x),_.return=f,f=_;break e}n(f,A);break}else e(f,A);A=A.sibling}x.type===Ps?(_=qr(x.props.children,f.mode,y,x.key),_.return=f,f=_):(y=Kl(x.type,x.key,x.props,null,f.mode,y),y.ref=Co(f,_,x),y.return=f,f=y)}return o(f);case bs:e:{for(A=x.key;_!==null;){if(_.key===A)if(_.tag===4&&_.stateNode.containerInfo===x.containerInfo&&_.stateNode.implementation===x.implementation){n(f,_.sibling),_=r(_,x.children||[]),_.return=f,f=_;break e}else{n(f,_);break}else e(f,_);_=_.sibling}_=Cu(x,f.mode,y),_.return=f,f=_}return o(f);case nr:return A=x._init,m(f,_,A(x._payload),y)}if(Bo(x))return g(f,_,x,y);if(Eo(x))return v(f,_,x,y);Za(f,x)}return typeof x=="string"&&x!==""||typeof x=="number"?(x=""+x,_!==null&&_.tag===6?(n(f,_.sibling),_=r(_,x),_.return=f,f=_):(n(f,_),_=Ru(x,f.mode,y),_.return=f,f=_),o(f)):n(f,_)}return m}var to=d_(!0),p_=d_(!1),_c=Mr(null),vc=null,ks=null,Md=null;function Ed(){Md=ks=vc=null}function Td(t){var e=_c.current;_t(_c),t._currentValue=e}function Xf(t,e,n){for(;t!==null;){var i=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),t===n)break;t=t.return}}function js(t,e){vc=t,Md=ks=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(Sn=!0),t.firstContext=null)}function jn(t){var e=t._currentValue;if(Md!==t)if(t={context:t,memoizedValue:e,next:null},ks===null){if(vc===null)throw Error(ne(308));ks=t,vc.dependencies={lanes:0,firstContext:t}}else ks=ks.next=t;return e}var jr=null;function wd(t){jr===null?jr=[t]:jr.push(t)}function m_(t,e,n,i){var r=e.interleaved;return r===null?(n.next=n,wd(e)):(n.next=r.next,r.next=n),e.interleaved=n,Hi(t,i)}function Hi(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var ir=!1;function Ad(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function g_(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function Fi(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function dr(t,e,n){var i=t.updateQueue;if(i===null)return null;if(i=i.shared,Qe&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,Hi(t,n)}return r=i.interleaved,r===null?(e.next=e,wd(i)):(e.next=r.next,r.next=e),i.interleaved=e,Hi(t,n)}function Gl(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,fd(t,n)}}function rm(t,e){var n=t.updateQueue,i=t.alternate;if(i!==null&&(i=i.updateQueue,n===i)){var r=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?r=s=o:s=s.next=o,n=n.next}while(n!==null);s===null?r=s=e:s=s.next=e}else r=s=e;n={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function xc(t,e,n,i){var r=t.updateQueue;ir=!1;var s=r.firstBaseUpdate,o=r.lastBaseUpdate,a=r.shared.pending;if(a!==null){r.shared.pending=null;var l=a,c=l.next;l.next=null,o===null?s=c:o.next=c,o=l;var u=t.alternate;u!==null&&(u=u.updateQueue,a=u.lastBaseUpdate,a!==o&&(a===null?u.firstBaseUpdate=c:a.next=c,u.lastBaseUpdate=l))}if(s!==null){var h=r.baseState;o=0,u=c=l=null,a=s;do{var d=a.lane,p=a.eventTime;if((i&d)===d){u!==null&&(u=u.next={eventTime:p,lane:0,tag:a.tag,payload:a.payload,callback:a.callback,next:null});e:{var g=t,v=a;switch(d=e,p=n,v.tag){case 1:if(g=v.payload,typeof g=="function"){h=g.call(p,h,d);break e}h=g;break e;case 3:g.flags=g.flags&-65537|128;case 0:if(g=v.payload,d=typeof g=="function"?g.call(p,h,d):g,d==null)break e;h=Et({},h,d);break e;case 2:ir=!0}}a.callback!==null&&a.lane!==0&&(t.flags|=64,d=r.effects,d===null?r.effects=[a]:d.push(a))}else p={eventTime:p,lane:d,tag:a.tag,payload:a.payload,callback:a.callback,next:null},u===null?(c=u=p,l=h):u=u.next=p,o|=d;if(a=a.next,a===null){if(a=r.shared.pending,a===null)break;d=a,a=d.next,d.next=null,r.lastBaseUpdate=d,r.shared.pending=null}}while(!0);if(u===null&&(l=h),r.baseState=l,r.firstBaseUpdate=c,r.lastBaseUpdate=u,e=r.shared.interleaved,e!==null){r=e;do o|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);ts|=o,t.lanes=o,t.memoizedState=h}}function sm(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var i=t[e],r=i.callback;if(r!==null){if(i.callback=null,i=n,typeof r!="function")throw Error(ne(191,r));r.call(i)}}}var La={},gi=Mr(La),ga=Mr(La),_a=Mr(La);function Yr(t){if(t===La)throw Error(ne(174));return t}function Rd(t,e){switch(ht(_a,e),ht(ga,t),ht(gi,La),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:wf(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=wf(e,t)}_t(gi),ht(gi,e)}function no(){_t(gi),_t(ga),_t(_a)}function __(t){Yr(_a.current);var e=Yr(gi.current),n=wf(e,t.type);e!==n&&(ht(ga,t),ht(gi,n))}function Cd(t){ga.current===t&&(_t(gi),_t(ga))}var yt=Mr(0);function yc(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var Su=[];function bd(){for(var t=0;t<Su.length;t++)Su[t]._workInProgressVersionPrimary=null;Su.length=0}var Vl=ji.ReactCurrentDispatcher,Mu=ji.ReactCurrentBatchConfig,es=0,St=null,Dt=null,kt=null,Sc=!1,Jo=!1,va=0,uS=0;function $t(){throw Error(ne(321))}function Pd(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!ai(t[n],e[n]))return!1;return!0}function Ld(t,e,n,i,r,s){if(es=s,St=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,Vl.current=t===null||t.memoizedState===null?pS:mS,t=n(i,r),Jo){s=0;do{if(Jo=!1,va=0,25<=s)throw Error(ne(301));s+=1,kt=Dt=null,e.updateQueue=null,Vl.current=gS,t=n(i,r)}while(Jo)}if(Vl.current=Mc,e=Dt!==null&&Dt.next!==null,es=0,kt=Dt=St=null,Sc=!1,e)throw Error(ne(300));return t}function Id(){var t=va!==0;return va=0,t}function ui(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return kt===null?St.memoizedState=kt=t:kt=kt.next=t,kt}function Yn(){if(Dt===null){var t=St.alternate;t=t!==null?t.memoizedState:null}else t=Dt.next;var e=kt===null?St.memoizedState:kt.next;if(e!==null)kt=e,Dt=t;else{if(t===null)throw Error(ne(310));Dt=t,t={memoizedState:Dt.memoizedState,baseState:Dt.baseState,baseQueue:Dt.baseQueue,queue:Dt.queue,next:null},kt===null?St.memoizedState=kt=t:kt=kt.next=t}return kt}function xa(t,e){return typeof e=="function"?e(t):e}function Eu(t){var e=Yn(),n=e.queue;if(n===null)throw Error(ne(311));n.lastRenderedReducer=t;var i=Dt,r=i.baseQueue,s=n.pending;if(s!==null){if(r!==null){var o=r.next;r.next=s.next,s.next=o}i.baseQueue=r=s,n.pending=null}if(r!==null){s=r.next,i=i.baseState;var a=o=null,l=null,c=s;do{var u=c.lane;if((es&u)===u)l!==null&&(l=l.next={lane:0,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),i=c.hasEagerState?c.eagerState:t(i,c.action);else{var h={lane:u,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null};l===null?(a=l=h,o=i):l=l.next=h,St.lanes|=u,ts|=u}c=c.next}while(c!==null&&c!==s);l===null?o=i:l.next=a,ai(i,e.memoizedState)||(Sn=!0),e.memoizedState=i,e.baseState=o,e.baseQueue=l,n.lastRenderedState=i}if(t=n.interleaved,t!==null){r=t;do s=r.lane,St.lanes|=s,ts|=s,r=r.next;while(r!==t)}else r===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function Tu(t){var e=Yn(),n=e.queue;if(n===null)throw Error(ne(311));n.lastRenderedReducer=t;var i=n.dispatch,r=n.pending,s=e.memoizedState;if(r!==null){n.pending=null;var o=r=r.next;do s=t(s,o.action),o=o.next;while(o!==r);ai(s,e.memoizedState)||(Sn=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,i]}function v_(){}function x_(t,e){var n=St,i=Yn(),r=e(),s=!ai(i.memoizedState,r);if(s&&(i.memoizedState=r,Sn=!0),i=i.queue,Dd(M_.bind(null,n,i,t),[t]),i.getSnapshot!==e||s||kt!==null&&kt.memoizedState.tag&1){if(n.flags|=2048,ya(9,S_.bind(null,n,i,r,e),void 0,null),zt===null)throw Error(ne(349));es&30||y_(n,e,r)}return r}function y_(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=St.updateQueue,e===null?(e={lastEffect:null,stores:null},St.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function S_(t,e,n,i){e.value=n,e.getSnapshot=i,E_(e)&&T_(t)}function M_(t,e,n){return n(function(){E_(e)&&T_(t)})}function E_(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!ai(t,n)}catch{return!0}}function T_(t){var e=Hi(t,1);e!==null&&oi(e,t,1,-1)}function om(t){var e=ui();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:xa,lastRenderedState:t},e.queue=t,t=t.dispatch=dS.bind(null,St,t),[e.memoizedState,t]}function ya(t,e,n,i){return t={tag:t,create:e,destroy:n,deps:i,next:null},e=St.updateQueue,e===null?(e={lastEffect:null,stores:null},St.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(i=n.next,n.next=t,t.next=i,e.lastEffect=t)),t}function w_(){return Yn().memoizedState}function Wl(t,e,n,i){var r=ui();St.flags|=t,r.memoizedState=ya(1|e,n,void 0,i===void 0?null:i)}function zc(t,e,n,i){var r=Yn();i=i===void 0?null:i;var s=void 0;if(Dt!==null){var o=Dt.memoizedState;if(s=o.destroy,i!==null&&Pd(i,o.deps)){r.memoizedState=ya(e,n,s,i);return}}St.flags|=t,r.memoizedState=ya(1|e,n,s,i)}function am(t,e){return Wl(8390656,8,t,e)}function Dd(t,e){return zc(2048,8,t,e)}function A_(t,e){return zc(4,2,t,e)}function R_(t,e){return zc(4,4,t,e)}function C_(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function b_(t,e,n){return n=n!=null?n.concat([t]):null,zc(4,4,C_.bind(null,e,t),n)}function Nd(){}function P_(t,e){var n=Yn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Pd(e,i[1])?i[0]:(n.memoizedState=[t,e],t)}function L_(t,e){var n=Yn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Pd(e,i[1])?i[0]:(t=t(),n.memoizedState=[t,e],t)}function I_(t,e,n){return es&21?(ai(n,e)||(n=F0(),St.lanes|=n,ts|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,Sn=!0),t.memoizedState=n)}function fS(t,e){var n=at;at=n!==0&&4>n?n:4,t(!0);var i=Mu.transition;Mu.transition={};try{t(!1),e()}finally{at=n,Mu.transition=i}}function D_(){return Yn().memoizedState}function hS(t,e,n){var i=mr(t);if(n={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null},N_(t))U_(e,n);else if(n=m_(t,e,n,i),n!==null){var r=hn();oi(n,t,i,r),O_(n,e,i)}}function dS(t,e,n){var i=mr(t),r={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null};if(N_(t))U_(e,r);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var o=e.lastRenderedState,a=s(o,n);if(r.hasEagerState=!0,r.eagerState=a,ai(a,o)){var l=e.interleaved;l===null?(r.next=r,wd(e)):(r.next=l.next,l.next=r),e.interleaved=r;return}}catch{}finally{}n=m_(t,e,r,i),n!==null&&(r=hn(),oi(n,t,i,r),O_(n,e,i))}}function N_(t){var e=t.alternate;return t===St||e!==null&&e===St}function U_(t,e){Jo=Sc=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function O_(t,e,n){if(n&4194240){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,fd(t,n)}}var Mc={readContext:jn,useCallback:$t,useContext:$t,useEffect:$t,useImperativeHandle:$t,useInsertionEffect:$t,useLayoutEffect:$t,useMemo:$t,useReducer:$t,useRef:$t,useState:$t,useDebugValue:$t,useDeferredValue:$t,useTransition:$t,useMutableSource:$t,useSyncExternalStore:$t,useId:$t,unstable_isNewReconciler:!1},pS={readContext:jn,useCallback:function(t,e){return ui().memoizedState=[t,e===void 0?null:e],t},useContext:jn,useEffect:am,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,Wl(4194308,4,C_.bind(null,e,t),n)},useLayoutEffect:function(t,e){return Wl(4194308,4,t,e)},useInsertionEffect:function(t,e){return Wl(4,2,t,e)},useMemo:function(t,e){var n=ui();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var i=ui();return e=n!==void 0?n(e):e,i.memoizedState=i.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},i.queue=t,t=t.dispatch=hS.bind(null,St,t),[i.memoizedState,t]},useRef:function(t){var e=ui();return t={current:t},e.memoizedState=t},useState:om,useDebugValue:Nd,useDeferredValue:function(t){return ui().memoizedState=t},useTransition:function(){var t=om(!1),e=t[0];return t=fS.bind(null,t[1]),ui().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var i=St,r=ui();if(vt){if(n===void 0)throw Error(ne(407));n=n()}else{if(n=e(),zt===null)throw Error(ne(349));es&30||y_(i,e,n)}r.memoizedState=n;var s={value:n,getSnapshot:e};return r.queue=s,am(M_.bind(null,i,s,t),[t]),i.flags|=2048,ya(9,S_.bind(null,i,s,n,e),void 0,null),n},useId:function(){var t=ui(),e=zt.identifierPrefix;if(vt){var n=Di,i=Ii;n=(i&~(1<<32-si(i)-1)).toString(32)+n,e=":"+e+"R"+n,n=va++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=uS++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},mS={readContext:jn,useCallback:P_,useContext:jn,useEffect:Dd,useImperativeHandle:b_,useInsertionEffect:A_,useLayoutEffect:R_,useMemo:L_,useReducer:Eu,useRef:w_,useState:function(){return Eu(xa)},useDebugValue:Nd,useDeferredValue:function(t){var e=Yn();return I_(e,Dt.memoizedState,t)},useTransition:function(){var t=Eu(xa)[0],e=Yn().memoizedState;return[t,e]},useMutableSource:v_,useSyncExternalStore:x_,useId:D_,unstable_isNewReconciler:!1},gS={readContext:jn,useCallback:P_,useContext:jn,useEffect:Dd,useImperativeHandle:b_,useInsertionEffect:A_,useLayoutEffect:R_,useMemo:L_,useReducer:Tu,useRef:w_,useState:function(){return Tu(xa)},useDebugValue:Nd,useDeferredValue:function(t){var e=Yn();return Dt===null?e.memoizedState=t:I_(e,Dt.memoizedState,t)},useTransition:function(){var t=Tu(xa)[0],e=Yn().memoizedState;return[t,e]},useMutableSource:v_,useSyncExternalStore:x_,useId:D_,unstable_isNewReconciler:!1};function ti(t,e){if(t&&t.defaultProps){e=Et({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function jf(t,e,n,i){e=t.memoizedState,n=n(i,e),n=n==null?e:Et({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var Hc={isMounted:function(t){return(t=t._reactInternals)?os(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var i=hn(),r=mr(t),s=Fi(i,r);s.payload=e,n!=null&&(s.callback=n),e=dr(t,s,r),e!==null&&(oi(e,t,r,i),Gl(e,t,r))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var i=hn(),r=mr(t),s=Fi(i,r);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=dr(t,s,r),e!==null&&(oi(e,t,r,i),Gl(e,t,r))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=hn(),i=mr(t),r=Fi(n,i);r.tag=2,e!=null&&(r.callback=e),e=dr(t,r,i),e!==null&&(oi(e,t,i,n),Gl(e,t,i))}};function lm(t,e,n,i,r,s,o){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(i,s,o):e.prototype&&e.prototype.isPureReactComponent?!ha(n,i)||!ha(r,s):!0}function F_(t,e,n){var i=!1,r=yr,s=e.contextType;return typeof s=="object"&&s!==null?s=jn(s):(r=En(e)?Qr:sn.current,i=e.contextTypes,s=(i=i!=null)?Js(t,r):yr),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=Hc,t.stateNode=e,e._reactInternals=t,i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=r,t.__reactInternalMemoizedMaskedChildContext=s),e}function cm(t,e,n,i){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,i),e.state!==t&&Hc.enqueueReplaceState(e,e.state,null)}function Yf(t,e,n,i){var r=t.stateNode;r.props=n,r.state=t.memoizedState,r.refs={},Ad(t);var s=e.contextType;typeof s=="object"&&s!==null?r.context=jn(s):(s=En(e)?Qr:sn.current,r.context=Js(t,s)),r.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(jf(t,e,s,n),r.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&Hc.enqueueReplaceState(r,r.state,null),xc(t,n,r,i),r.state=t.memoizedState),typeof r.componentDidMount=="function"&&(t.flags|=4194308)}function io(t,e){try{var n="",i=e;do n+=Wx(i),i=i.return;while(i);var r=n}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:r,digest:null}}function wu(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function Kf(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var _S=typeof WeakMap=="function"?WeakMap:Map;function k_(t,e,n){n=Fi(-1,n),n.tag=3,n.payload={element:null};var i=e.value;return n.callback=function(){Tc||(Tc=!0,rh=i),Kf(t,e)},n}function B_(t,e,n){n=Fi(-1,n),n.tag=3;var i=t.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;n.payload=function(){return i(r)},n.callback=function(){Kf(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){Kf(t,e),typeof i!="function"&&(pr===null?pr=new Set([this]):pr.add(this));var o=e.stack;this.componentDidCatch(e.value,{componentStack:o!==null?o:""})}),n}function um(t,e,n){var i=t.pingCache;if(i===null){i=t.pingCache=new _S;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(n)||(r.add(n),t=LS.bind(null,t,e,n),e.then(t,t))}function fm(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function hm(t,e,n,i,r){return t.mode&1?(t.flags|=65536,t.lanes=r,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=Fi(-1,1),e.tag=2,dr(n,e,1))),n.lanes|=1),t)}var vS=ji.ReactCurrentOwner,Sn=!1;function un(t,e,n,i){e.child=t===null?p_(e,null,n,i):to(e,t.child,n,i)}function dm(t,e,n,i,r){n=n.render;var s=e.ref;return js(e,r),i=Ld(t,e,n,i,s,r),n=Id(),t!==null&&!Sn?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,Gi(t,e,r)):(vt&&n&&xd(e),e.flags|=1,un(t,e,i,r),e.child)}function pm(t,e,n,i,r){if(t===null){var s=n.type;return typeof s=="function"&&!Gd(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,z_(t,e,s,i,r)):(t=Kl(n.type,null,i,e,e.mode,r),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&r)){var o=s.memoizedProps;if(n=n.compare,n=n!==null?n:ha,n(o,i)&&t.ref===e.ref)return Gi(t,e,r)}return e.flags|=1,t=gr(s,i),t.ref=e.ref,t.return=e,e.child=t}function z_(t,e,n,i,r){if(t!==null){var s=t.memoizedProps;if(ha(s,i)&&t.ref===e.ref)if(Sn=!1,e.pendingProps=i=s,(t.lanes&r)!==0)t.flags&131072&&(Sn=!0);else return e.lanes=t.lanes,Gi(t,e,r)}return $f(t,e,n,i,r)}function H_(t,e,n){var i=e.pendingProps,r=i.children,s=t!==null?t.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},ht(zs,bn),bn|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,ht(zs,bn),bn|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:n,ht(zs,bn),bn|=i}else s!==null?(i=s.baseLanes|n,e.memoizedState=null):i=n,ht(zs,bn),bn|=i;return un(t,e,r,n),e.child}function G_(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function $f(t,e,n,i,r){var s=En(n)?Qr:sn.current;return s=Js(e,s),js(e,r),n=Ld(t,e,n,i,s,r),i=Id(),t!==null&&!Sn?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,Gi(t,e,r)):(vt&&i&&xd(e),e.flags|=1,un(t,e,n,r),e.child)}function mm(t,e,n,i,r){if(En(n)){var s=!0;pc(e)}else s=!1;if(js(e,r),e.stateNode===null)Xl(t,e),F_(e,n,i),Yf(e,n,i,r),i=!0;else if(t===null){var o=e.stateNode,a=e.memoizedProps;o.props=a;var l=o.context,c=n.contextType;typeof c=="object"&&c!==null?c=jn(c):(c=En(n)?Qr:sn.current,c=Js(e,c));var u=n.getDerivedStateFromProps,h=typeof u=="function"||typeof o.getSnapshotBeforeUpdate=="function";h||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==i||l!==c)&&cm(e,o,i,c),ir=!1;var d=e.memoizedState;o.state=d,xc(e,i,o,r),l=e.memoizedState,a!==i||d!==l||Mn.current||ir?(typeof u=="function"&&(jf(e,n,u,i),l=e.memoizedState),(a=ir||lm(e,n,a,i,d,l,c))?(h||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(e.flags|=4194308)):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=l),o.props=i,o.state=l,o.context=c,i=a):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{o=e.stateNode,g_(t,e),a=e.memoizedProps,c=e.type===e.elementType?a:ti(e.type,a),o.props=c,h=e.pendingProps,d=o.context,l=n.contextType,typeof l=="object"&&l!==null?l=jn(l):(l=En(n)?Qr:sn.current,l=Js(e,l));var p=n.getDerivedStateFromProps;(u=typeof p=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==h||d!==l)&&cm(e,o,i,l),ir=!1,d=e.memoizedState,o.state=d,xc(e,i,o,r);var g=e.memoizedState;a!==h||d!==g||Mn.current||ir?(typeof p=="function"&&(jf(e,n,p,i),g=e.memoizedState),(c=ir||lm(e,n,c,i,d,g,l)||!1)?(u||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(i,g,l),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(i,g,l)),typeof o.componentDidUpdate=="function"&&(e.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof o.componentDidUpdate!="function"||a===t.memoizedProps&&d===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===t.memoizedProps&&d===t.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=g),o.props=i,o.state=g,o.context=l,i=c):(typeof o.componentDidUpdate!="function"||a===t.memoizedProps&&d===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===t.memoizedProps&&d===t.memoizedState||(e.flags|=1024),i=!1)}return qf(t,e,n,i,s,r)}function qf(t,e,n,i,r,s){G_(t,e);var o=(e.flags&128)!==0;if(!i&&!o)return r&&em(e,n,!1),Gi(t,e,s);i=e.stateNode,vS.current=e;var a=o&&typeof n.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,t!==null&&o?(e.child=to(e,t.child,null,s),e.child=to(e,null,a,s)):un(t,e,a,s),e.memoizedState=i.state,r&&em(e,n,!0),e.child}function V_(t){var e=t.stateNode;e.pendingContext?Jp(t,e.pendingContext,e.pendingContext!==e.context):e.context&&Jp(t,e.context,!1),Rd(t,e.containerInfo)}function gm(t,e,n,i,r){return eo(),Sd(r),e.flags|=256,un(t,e,n,i),e.child}var Zf={dehydrated:null,treeContext:null,retryLane:0};function Qf(t){return{baseLanes:t,cachePool:null,transitions:null}}function W_(t,e,n){var i=e.pendingProps,r=yt.current,s=!1,o=(e.flags&128)!==0,a;if((a=o)||(a=t!==null&&t.memoizedState===null?!1:(r&2)!==0),a?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(r|=1),ht(yt,r&1),t===null)return Wf(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(o=i.children,t=i.fallback,s?(i=e.mode,s=e.child,o={mode:"hidden",children:o},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=o):s=Wc(o,i,0,null),t=qr(t,i,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=Qf(n),e.memoizedState=Zf,t):Ud(e,o));if(r=t.memoizedState,r!==null&&(a=r.dehydrated,a!==null))return xS(t,e,o,i,a,r,n);if(s){s=i.fallback,o=e.mode,r=t.child,a=r.sibling;var l={mode:"hidden",children:i.children};return!(o&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=l,e.deletions=null):(i=gr(r,l),i.subtreeFlags=r.subtreeFlags&14680064),a!==null?s=gr(a,s):(s=qr(s,o,n,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,o=t.child.memoizedState,o=o===null?Qf(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},s.memoizedState=o,s.childLanes=t.childLanes&~n,e.memoizedState=Zf,i}return s=t.child,t=s.sibling,i=gr(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=n),i.return=e,i.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=i,e.memoizedState=null,i}function Ud(t,e){return e=Wc({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function Qa(t,e,n,i){return i!==null&&Sd(i),to(e,t.child,null,n),t=Ud(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function xS(t,e,n,i,r,s,o){if(n)return e.flags&256?(e.flags&=-257,i=wu(Error(ne(422))),Qa(t,e,o,i)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=Wc({mode:"visible",children:i.children},r,0,null),s=qr(s,r,o,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&to(e,t.child,null,o),e.child.memoizedState=Qf(o),e.memoizedState=Zf,s);if(!(e.mode&1))return Qa(t,e,o,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var a=i.dgst;return i=a,s=Error(ne(419)),i=wu(s,i,void 0),Qa(t,e,o,i)}if(a=(o&t.childLanes)!==0,Sn||a){if(i=zt,i!==null){switch(o&-o){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|o)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,Hi(t,r),oi(i,t,r,-1))}return Hd(),i=wu(Error(ne(421))),Qa(t,e,o,i)}return r.data==="$?"?(e.flags|=128,e.child=t.child,e=IS.bind(null,t),r._reactRetry=e,null):(t=s.treeContext,In=hr(r.nextSibling),Dn=e,vt=!0,ii=null,t!==null&&(zn[Hn++]=Ii,zn[Hn++]=Di,zn[Hn++]=Jr,Ii=t.id,Di=t.overflow,Jr=e),e=Ud(e,i.children),e.flags|=4096,e)}function _m(t,e,n){t.lanes|=e;var i=t.alternate;i!==null&&(i.lanes|=e),Xf(t.return,e,n)}function Au(t,e,n,i,r){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:n,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=n,s.tailMode=r)}function X_(t,e,n){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if(un(t,e,i.children,n),i=yt.current,i&2)i=i&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&_m(t,n,e);else if(t.tag===19)_m(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}i&=1}if(ht(yt,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(n=e.child,r=null;n!==null;)t=n.alternate,t!==null&&yc(t)===null&&(r=n),n=n.sibling;n=r,n===null?(r=e.child,e.child=null):(r=n.sibling,n.sibling=null),Au(e,!1,r,n,s);break;case"backwards":for(n=null,r=e.child,e.child=null;r!==null;){if(t=r.alternate,t!==null&&yc(t)===null){e.child=r;break}t=r.sibling,r.sibling=n,n=r,r=t}Au(e,!0,n,null,s);break;case"together":Au(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function Xl(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function Gi(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),ts|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(ne(153));if(e.child!==null){for(t=e.child,n=gr(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=gr(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function yS(t,e,n){switch(e.tag){case 3:V_(e),eo();break;case 5:__(e);break;case 1:En(e.type)&&pc(e);break;case 4:Rd(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;ht(_c,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(ht(yt,yt.current&1),e.flags|=128,null):n&e.child.childLanes?W_(t,e,n):(ht(yt,yt.current&1),t=Gi(t,e,n),t!==null?t.sibling:null);ht(yt,yt.current&1);break;case 19:if(i=(n&e.childLanes)!==0,t.flags&128){if(i)return X_(t,e,n);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),ht(yt,yt.current),i)break;return null;case 22:case 23:return e.lanes=0,H_(t,e,n)}return Gi(t,e,n)}var j_,Jf,Y_,K_;j_=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};Jf=function(){};Y_=function(t,e,n,i){var r=t.memoizedProps;if(r!==i){t=e.stateNode,Yr(gi.current);var s=null;switch(n){case"input":r=Sf(t,r),i=Sf(t,i),s=[];break;case"select":r=Et({},r,{value:void 0}),i=Et({},i,{value:void 0}),s=[];break;case"textarea":r=Tf(t,r),i=Tf(t,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(t.onclick=hc)}Af(n,i);var o;n=null;for(c in r)if(!i.hasOwnProperty(c)&&r.hasOwnProperty(c)&&r[c]!=null)if(c==="style"){var a=r[c];for(o in a)a.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else c!=="dangerouslySetInnerHTML"&&c!=="children"&&c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(sa.hasOwnProperty(c)?s||(s=[]):(s=s||[]).push(c,null));for(c in i){var l=i[c];if(a=r?.[c],i.hasOwnProperty(c)&&l!==a&&(l!=null||a!=null))if(c==="style")if(a){for(o in a)!a.hasOwnProperty(o)||l&&l.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in l)l.hasOwnProperty(o)&&a[o]!==l[o]&&(n||(n={}),n[o]=l[o])}else n||(s||(s=[]),s.push(c,n)),n=l;else c==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,a=a?a.__html:void 0,l!=null&&a!==l&&(s=s||[]).push(c,l)):c==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(c,""+l):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&(sa.hasOwnProperty(c)?(l!=null&&c==="onScroll"&&gt("scroll",t),s||a===l||(s=[])):(s=s||[]).push(c,l))}n&&(s=s||[]).push("style",n);var c=s;(e.updateQueue=c)&&(e.flags|=4)}};K_=function(t,e,n,i){n!==i&&(e.flags|=4)};function bo(t,e){if(!vt)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:i.sibling=null}}function qt(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,i=0;if(e)for(var r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=t,r=r.sibling;else for(r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=t,r=r.sibling;return t.subtreeFlags|=i,t.childLanes=n,e}function SS(t,e,n){var i=e.pendingProps;switch(yd(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return qt(e),null;case 1:return En(e.type)&&dc(),qt(e),null;case 3:return i=e.stateNode,no(),_t(Mn),_t(sn),bd(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(t===null||t.child===null)&&(qa(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,ii!==null&&(ah(ii),ii=null))),Jf(t,e),qt(e),null;case 5:Cd(e);var r=Yr(_a.current);if(n=e.type,t!==null&&e.stateNode!=null)Y_(t,e,n,i,r),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(ne(166));return qt(e),null}if(t=Yr(gi.current),qa(e)){i=e.stateNode,n=e.type;var s=e.memoizedProps;switch(i[di]=e,i[ma]=s,t=(e.mode&1)!==0,n){case"dialog":gt("cancel",i),gt("close",i);break;case"iframe":case"object":case"embed":gt("load",i);break;case"video":case"audio":for(r=0;r<Ho.length;r++)gt(Ho[r],i);break;case"source":gt("error",i);break;case"img":case"image":case"link":gt("error",i),gt("load",i);break;case"details":gt("toggle",i);break;case"input":Ap(i,s),gt("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},gt("invalid",i);break;case"textarea":Cp(i,s),gt("invalid",i)}Af(n,s),r=null;for(var o in s)if(s.hasOwnProperty(o)){var a=s[o];o==="children"?typeof a=="string"?i.textContent!==a&&(s.suppressHydrationWarning!==!0&&$a(i.textContent,a,t),r=["children",a]):typeof a=="number"&&i.textContent!==""+a&&(s.suppressHydrationWarning!==!0&&$a(i.textContent,a,t),r=["children",""+a]):sa.hasOwnProperty(o)&&a!=null&&o==="onScroll"&&gt("scroll",i)}switch(n){case"input":Ha(i),Rp(i,s,!0);break;case"textarea":Ha(i),bp(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=hc)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{o=r.nodeType===9?r:r.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=M0(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=o.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof i.is=="string"?t=o.createElement(n,{is:i.is}):(t=o.createElement(n),n==="select"&&(o=t,i.multiple?o.multiple=!0:i.size&&(o.size=i.size))):t=o.createElementNS(t,n),t[di]=e,t[ma]=i,j_(t,e,!1,!1),e.stateNode=t;e:{switch(o=Rf(n,i),n){case"dialog":gt("cancel",t),gt("close",t),r=i;break;case"iframe":case"object":case"embed":gt("load",t),r=i;break;case"video":case"audio":for(r=0;r<Ho.length;r++)gt(Ho[r],t);r=i;break;case"source":gt("error",t),r=i;break;case"img":case"image":case"link":gt("error",t),gt("load",t),r=i;break;case"details":gt("toggle",t),r=i;break;case"input":Ap(t,i),r=Sf(t,i),gt("invalid",t);break;case"option":r=i;break;case"select":t._wrapperState={wasMultiple:!!i.multiple},r=Et({},i,{value:void 0}),gt("invalid",t);break;case"textarea":Cp(t,i),r=Tf(t,i),gt("invalid",t);break;default:r=i}Af(n,r),a=r;for(s in a)if(a.hasOwnProperty(s)){var l=a[s];s==="style"?w0(t,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&E0(t,l)):s==="children"?typeof l=="string"?(n!=="textarea"||l!=="")&&oa(t,l):typeof l=="number"&&oa(t,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(sa.hasOwnProperty(s)?l!=null&&s==="onScroll"&&gt("scroll",t):l!=null&&sd(t,s,l,o))}switch(n){case"input":Ha(t),Rp(t,i,!1);break;case"textarea":Ha(t),bp(t);break;case"option":i.value!=null&&t.setAttribute("value",""+xr(i.value));break;case"select":t.multiple=!!i.multiple,s=i.value,s!=null?Gs(t,!!i.multiple,s,!1):i.defaultValue!=null&&Gs(t,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(t.onclick=hc)}switch(n){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return qt(e),null;case 6:if(t&&e.stateNode!=null)K_(t,e,t.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(ne(166));if(n=Yr(_a.current),Yr(gi.current),qa(e)){if(i=e.stateNode,n=e.memoizedProps,i[di]=e,(s=i.nodeValue!==n)&&(t=Dn,t!==null))switch(t.tag){case 3:$a(i.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&$a(i.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else i=(n.nodeType===9?n:n.ownerDocument).createTextNode(i),i[di]=e,e.stateNode=i}return qt(e),null;case 13:if(_t(yt),i=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(vt&&In!==null&&e.mode&1&&!(e.flags&128))h_(),eo(),e.flags|=98560,s=!1;else if(s=qa(e),i!==null&&i.dehydrated!==null){if(t===null){if(!s)throw Error(ne(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(ne(317));s[di]=e}else eo(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;qt(e),s=!1}else ii!==null&&(ah(ii),ii=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(i=i!==null,i!==(t!==null&&t.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(t===null||yt.current&1?Nt===0&&(Nt=3):Hd())),e.updateQueue!==null&&(e.flags|=4),qt(e),null);case 4:return no(),Jf(t,e),t===null&&da(e.stateNode.containerInfo),qt(e),null;case 10:return Td(e.type._context),qt(e),null;case 17:return En(e.type)&&dc(),qt(e),null;case 19:if(_t(yt),s=e.memoizedState,s===null)return qt(e),null;if(i=(e.flags&128)!==0,o=s.rendering,o===null)if(i)bo(s,!1);else{if(Nt!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(o=yc(t),o!==null){for(e.flags|=128,bo(s,!1),i=o.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=n,n=e.child;n!==null;)s=n,t=i,s.flags&=14680066,o=s.alternate,o===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=o.childLanes,s.lanes=o.lanes,s.child=o.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=o.memoizedProps,s.memoizedState=o.memoizedState,s.updateQueue=o.updateQueue,s.type=o.type,t=o.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return ht(yt,yt.current&1|2),e.child}t=t.sibling}s.tail!==null&&bt()>ro&&(e.flags|=128,i=!0,bo(s,!1),e.lanes=4194304)}else{if(!i)if(t=yc(o),t!==null){if(e.flags|=128,i=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),bo(s,!0),s.tail===null&&s.tailMode==="hidden"&&!o.alternate&&!vt)return qt(e),null}else 2*bt()-s.renderingStartTime>ro&&n!==1073741824&&(e.flags|=128,i=!0,bo(s,!1),e.lanes=4194304);s.isBackwards?(o.sibling=e.child,e.child=o):(n=s.last,n!==null?n.sibling=o:e.child=o,s.last=o)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=bt(),e.sibling=null,n=yt.current,ht(yt,i?n&1|2:n&1),e):(qt(e),null);case 22:case 23:return zd(),i=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?bn&1073741824&&(qt(e),e.subtreeFlags&6&&(e.flags|=8192)):qt(e),null;case 24:return null;case 25:return null}throw Error(ne(156,e.tag))}function MS(t,e){switch(yd(e),e.tag){case 1:return En(e.type)&&dc(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return no(),_t(Mn),_t(sn),bd(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return Cd(e),null;case 13:if(_t(yt),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(ne(340));eo()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return _t(yt),null;case 4:return no(),null;case 10:return Td(e.type._context),null;case 22:case 23:return zd(),null;case 24:return null;default:return null}}var Ja=!1,tn=!1,ES=typeof WeakSet=="function"?WeakSet:Set,ge=null;function Bs(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(i){wt(t,e,i)}else n.current=null}function eh(t,e,n){try{n()}catch(i){wt(t,e,i)}}var vm=!1;function TS(t,e){if(Ff=cc,t=J0(),vd(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var o=0,a=-1,l=-1,c=0,u=0,h=t,d=null;t:for(;;){for(var p;h!==n||r!==0&&h.nodeType!==3||(a=o+r),h!==s||i!==0&&h.nodeType!==3||(l=o+i),h.nodeType===3&&(o+=h.nodeValue.length),(p=h.firstChild)!==null;)d=h,h=p;for(;;){if(h===t)break t;if(d===n&&++c===r&&(a=o),d===s&&++u===i&&(l=o),(p=h.nextSibling)!==null)break;h=d,d=h.parentNode}h=p}n=a===-1||l===-1?null:{start:a,end:l}}else n=null}n=n||{start:0,end:0}}else n=null;for(kf={focusedElem:t,selectionRange:n},cc=!1,ge=e;ge!==null;)if(e=ge,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,ge=t;else for(;ge!==null;){e=ge;try{var g=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(g!==null){var v=g.memoizedProps,m=g.memoizedState,f=e.stateNode,_=f.getSnapshotBeforeUpdate(e.elementType===e.type?v:ti(e.type,v),m);f.__reactInternalSnapshotBeforeUpdate=_}break;case 3:var x=e.stateNode.containerInfo;x.nodeType===1?x.textContent="":x.nodeType===9&&x.documentElement&&x.removeChild(x.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(ne(163))}}catch(y){wt(e,e.return,y)}if(t=e.sibling,t!==null){t.return=e.return,ge=t;break}ge=e.return}return g=vm,vm=!1,g}function ea(t,e,n){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&t)===t){var s=r.destroy;r.destroy=void 0,s!==void 0&&eh(e,n,s)}r=r.next}while(r!==i)}}function Gc(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var i=n.create;n.destroy=i()}n=n.next}while(n!==e)}}function th(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function $_(t){var e=t.alternate;e!==null&&(t.alternate=null,$_(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[di],delete e[ma],delete e[Hf],delete e[oS],delete e[aS])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function q_(t){return t.tag===5||t.tag===3||t.tag===4}function xm(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||q_(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function nh(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=hc));else if(i!==4&&(t=t.child,t!==null))for(nh(t,e,n),t=t.sibling;t!==null;)nh(t,e,n),t=t.sibling}function ih(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(i!==4&&(t=t.child,t!==null))for(ih(t,e,n),t=t.sibling;t!==null;)ih(t,e,n),t=t.sibling}var Vt=null,ni=!1;function $i(t,e,n){for(n=n.child;n!==null;)Z_(t,e,n),n=n.sibling}function Z_(t,e,n){if(mi&&typeof mi.onCommitFiberUnmount=="function")try{mi.onCommitFiberUnmount(Nc,n)}catch{}switch(n.tag){case 5:tn||Bs(n,e);case 6:var i=Vt,r=ni;Vt=null,$i(t,e,n),Vt=i,ni=r,Vt!==null&&(ni?(t=Vt,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):Vt.removeChild(n.stateNode));break;case 18:Vt!==null&&(ni?(t=Vt,n=n.stateNode,t.nodeType===8?xu(t.parentNode,n):t.nodeType===1&&xu(t,n),ua(t)):xu(Vt,n.stateNode));break;case 4:i=Vt,r=ni,Vt=n.stateNode.containerInfo,ni=!0,$i(t,e,n),Vt=i,ni=r;break;case 0:case 11:case 14:case 15:if(!tn&&(i=n.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,o=s.destroy;s=s.tag,o!==void 0&&(s&2||s&4)&&eh(n,e,o),r=r.next}while(r!==i)}$i(t,e,n);break;case 1:if(!tn&&(Bs(n,e),i=n.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=n.memoizedProps,i.state=n.memoizedState,i.componentWillUnmount()}catch(a){wt(n,e,a)}$i(t,e,n);break;case 21:$i(t,e,n);break;case 22:n.mode&1?(tn=(i=tn)||n.memoizedState!==null,$i(t,e,n),tn=i):$i(t,e,n);break;default:$i(t,e,n)}}function ym(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new ES),e.forEach(function(i){var r=DS.bind(null,t,i);n.has(i)||(n.add(i),i.then(r,r))})}}function qn(t,e){var n=e.deletions;if(n!==null)for(var i=0;i<n.length;i++){var r=n[i];try{var s=t,o=e,a=o;e:for(;a!==null;){switch(a.tag){case 5:Vt=a.stateNode,ni=!1;break e;case 3:Vt=a.stateNode.containerInfo,ni=!0;break e;case 4:Vt=a.stateNode.containerInfo,ni=!0;break e}a=a.return}if(Vt===null)throw Error(ne(160));Z_(s,o,r),Vt=null,ni=!1;var l=r.alternate;l!==null&&(l.return=null),r.return=null}catch(c){wt(r,e,c)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)Q_(e,t),e=e.sibling}function Q_(t,e){var n=t.alternate,i=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(qn(e,t),ci(t),i&4){try{ea(3,t,t.return),Gc(3,t)}catch(v){wt(t,t.return,v)}try{ea(5,t,t.return)}catch(v){wt(t,t.return,v)}}break;case 1:qn(e,t),ci(t),i&512&&n!==null&&Bs(n,n.return);break;case 5:if(qn(e,t),ci(t),i&512&&n!==null&&Bs(n,n.return),t.flags&32){var r=t.stateNode;try{oa(r,"")}catch(v){wt(t,t.return,v)}}if(i&4&&(r=t.stateNode,r!=null)){var s=t.memoizedProps,o=n!==null?n.memoizedProps:s,a=t.type,l=t.updateQueue;if(t.updateQueue=null,l!==null)try{a==="input"&&s.type==="radio"&&s.name!=null&&y0(r,s),Rf(a,o);var c=Rf(a,s);for(o=0;o<l.length;o+=2){var u=l[o],h=l[o+1];u==="style"?w0(r,h):u==="dangerouslySetInnerHTML"?E0(r,h):u==="children"?oa(r,h):sd(r,u,h,c)}switch(a){case"input":Mf(r,s);break;case"textarea":S0(r,s);break;case"select":var d=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var p=s.value;p!=null?Gs(r,!!s.multiple,p,!1):d!==!!s.multiple&&(s.defaultValue!=null?Gs(r,!!s.multiple,s.defaultValue,!0):Gs(r,!!s.multiple,s.multiple?[]:"",!1))}r[ma]=s}catch(v){wt(t,t.return,v)}}break;case 6:if(qn(e,t),ci(t),i&4){if(t.stateNode===null)throw Error(ne(162));r=t.stateNode,s=t.memoizedProps;try{r.nodeValue=s}catch(v){wt(t,t.return,v)}}break;case 3:if(qn(e,t),ci(t),i&4&&n!==null&&n.memoizedState.isDehydrated)try{ua(e.containerInfo)}catch(v){wt(t,t.return,v)}break;case 4:qn(e,t),ci(t);break;case 13:qn(e,t),ci(t),r=t.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(kd=bt())),i&4&&ym(t);break;case 22:if(u=n!==null&&n.memoizedState!==null,t.mode&1?(tn=(c=tn)||u,qn(e,t),tn=c):qn(e,t),ci(t),i&8192){if(c=t.memoizedState!==null,(t.stateNode.isHidden=c)&&!u&&t.mode&1)for(ge=t,u=t.child;u!==null;){for(h=ge=u;ge!==null;){switch(d=ge,p=d.child,d.tag){case 0:case 11:case 14:case 15:ea(4,d,d.return);break;case 1:Bs(d,d.return);var g=d.stateNode;if(typeof g.componentWillUnmount=="function"){i=d,n=d.return;try{e=i,g.props=e.memoizedProps,g.state=e.memoizedState,g.componentWillUnmount()}catch(v){wt(i,n,v)}}break;case 5:Bs(d,d.return);break;case 22:if(d.memoizedState!==null){Mm(h);continue}}p!==null?(p.return=d,ge=p):Mm(h)}u=u.sibling}e:for(u=null,h=t;;){if(h.tag===5){if(u===null){u=h;try{r=h.stateNode,c?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(a=h.stateNode,l=h.memoizedProps.style,o=l!=null&&l.hasOwnProperty("display")?l.display:null,a.style.display=T0("display",o))}catch(v){wt(t,t.return,v)}}}else if(h.tag===6){if(u===null)try{h.stateNode.nodeValue=c?"":h.memoizedProps}catch(v){wt(t,t.return,v)}}else if((h.tag!==22&&h.tag!==23||h.memoizedState===null||h===t)&&h.child!==null){h.child.return=h,h=h.child;continue}if(h===t)break e;for(;h.sibling===null;){if(h.return===null||h.return===t)break e;u===h&&(u=null),h=h.return}u===h&&(u=null),h.sibling.return=h.return,h=h.sibling}}break;case 19:qn(e,t),ci(t),i&4&&ym(t);break;case 21:break;default:qn(e,t),ci(t)}}function ci(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(q_(n)){var i=n;break e}n=n.return}throw Error(ne(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(oa(r,""),i.flags&=-33);var s=xm(t);ih(t,s,r);break;case 3:case 4:var o=i.stateNode.containerInfo,a=xm(t);nh(t,a,o);break;default:throw Error(ne(161))}}catch(l){wt(t,t.return,l)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function wS(t,e,n){ge=t,J_(t)}function J_(t,e,n){for(var i=(t.mode&1)!==0;ge!==null;){var r=ge,s=r.child;if(r.tag===22&&i){var o=r.memoizedState!==null||Ja;if(!o){var a=r.alternate,l=a!==null&&a.memoizedState!==null||tn;a=Ja;var c=tn;if(Ja=o,(tn=l)&&!c)for(ge=r;ge!==null;)o=ge,l=o.child,o.tag===22&&o.memoizedState!==null?Em(r):l!==null?(l.return=o,ge=l):Em(r);for(;s!==null;)ge=s,J_(s),s=s.sibling;ge=r,Ja=a,tn=c}Sm(t)}else r.subtreeFlags&8772&&s!==null?(s.return=r,ge=s):Sm(t)}}function Sm(t){for(;ge!==null;){var e=ge;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:tn||Gc(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!tn)if(n===null)i.componentDidMount();else{var r=e.elementType===e.type?n.memoizedProps:ti(e.type,n.memoizedProps);i.componentDidUpdate(r,n.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&sm(e,s,i);break;case 3:var o=e.updateQueue;if(o!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}sm(e,o,n)}break;case 5:var a=e.stateNode;if(n===null&&e.flags&4){n=a;var l=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&n.focus();break;case"img":l.src&&(n.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var c=e.alternate;if(c!==null){var u=c.memoizedState;if(u!==null){var h=u.dehydrated;h!==null&&ua(h)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(ne(163))}tn||e.flags&512&&th(e)}catch(d){wt(e,e.return,d)}}if(e===t){ge=null;break}if(n=e.sibling,n!==null){n.return=e.return,ge=n;break}ge=e.return}}function Mm(t){for(;ge!==null;){var e=ge;if(e===t){ge=null;break}var n=e.sibling;if(n!==null){n.return=e.return,ge=n;break}ge=e.return}}function Em(t){for(;ge!==null;){var e=ge;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{Gc(4,e)}catch(l){wt(e,n,l)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(l){wt(e,r,l)}}var s=e.return;try{th(e)}catch(l){wt(e,s,l)}break;case 5:var o=e.return;try{th(e)}catch(l){wt(e,o,l)}}}catch(l){wt(e,e.return,l)}if(e===t){ge=null;break}var a=e.sibling;if(a!==null){a.return=e.return,ge=a;break}ge=e.return}}var AS=Math.ceil,Ec=ji.ReactCurrentDispatcher,Od=ji.ReactCurrentOwner,Xn=ji.ReactCurrentBatchConfig,Qe=0,zt=null,It=null,Xt=0,bn=0,zs=Mr(0),Nt=0,Sa=null,ts=0,Vc=0,Fd=0,ta=null,xn=null,kd=0,ro=1/0,bi=null,Tc=!1,rh=null,pr=null,el=!1,lr=null,wc=0,na=0,sh=null,jl=-1,Yl=0;function hn(){return Qe&6?bt():jl!==-1?jl:jl=bt()}function mr(t){return t.mode&1?Qe&2&&Xt!==0?Xt&-Xt:cS.transition!==null?(Yl===0&&(Yl=F0()),Yl):(t=at,t!==0||(t=window.event,t=t===void 0?16:W0(t.type)),t):1}function oi(t,e,n,i){if(50<na)throw na=0,sh=null,Error(ne(185));Ca(t,n,i),(!(Qe&2)||t!==zt)&&(t===zt&&(!(Qe&2)&&(Vc|=n),Nt===4&&sr(t,Xt)),Tn(t,i),n===1&&Qe===0&&!(e.mode&1)&&(ro=bt()+500,Bc&&Er()))}function Tn(t,e){var n=t.callbackNode;cy(t,e);var i=lc(t,t===zt?Xt:0);if(i===0)n!==null&&Ip(n),t.callbackNode=null,t.callbackPriority=0;else if(e=i&-i,t.callbackPriority!==e){if(n!=null&&Ip(n),e===1)t.tag===0?lS(Tm.bind(null,t)):c_(Tm.bind(null,t)),rS(function(){!(Qe&6)&&Er()}),n=null;else{switch(k0(i)){case 1:n=ud;break;case 4:n=U0;break;case 16:n=ac;break;case 536870912:n=O0;break;default:n=ac}n=av(n,ev.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function ev(t,e){if(jl=-1,Yl=0,Qe&6)throw Error(ne(327));var n=t.callbackNode;if(Ys()&&t.callbackNode!==n)return null;var i=lc(t,t===zt?Xt:0);if(i===0)return null;if(i&30||i&t.expiredLanes||e)e=Ac(t,i);else{e=i;var r=Qe;Qe|=2;var s=nv();(zt!==t||Xt!==e)&&(bi=null,ro=bt()+500,$r(t,e));do try{bS();break}catch(a){tv(t,a)}while(!0);Ed(),Ec.current=s,Qe=r,It!==null?e=0:(zt=null,Xt=0,e=Nt)}if(e!==0){if(e===2&&(r=If(t),r!==0&&(i=r,e=oh(t,r))),e===1)throw n=Sa,$r(t,0),sr(t,i),Tn(t,bt()),n;if(e===6)sr(t,i);else{if(r=t.current.alternate,!(i&30)&&!RS(r)&&(e=Ac(t,i),e===2&&(s=If(t),s!==0&&(i=s,e=oh(t,s))),e===1))throw n=Sa,$r(t,0),sr(t,i),Tn(t,bt()),n;switch(t.finishedWork=r,t.finishedLanes=i,e){case 0:case 1:throw Error(ne(345));case 2:Fr(t,xn,bi);break;case 3:if(sr(t,i),(i&130023424)===i&&(e=kd+500-bt(),10<e)){if(lc(t,0)!==0)break;if(r=t.suspendedLanes,(r&i)!==i){hn(),t.pingedLanes|=t.suspendedLanes&r;break}t.timeoutHandle=zf(Fr.bind(null,t,xn,bi),e);break}Fr(t,xn,bi);break;case 4:if(sr(t,i),(i&4194240)===i)break;for(e=t.eventTimes,r=-1;0<i;){var o=31-si(i);s=1<<o,o=e[o],o>r&&(r=o),i&=~s}if(i=r,i=bt()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*AS(i/1960))-i,10<i){t.timeoutHandle=zf(Fr.bind(null,t,xn,bi),i);break}Fr(t,xn,bi);break;case 5:Fr(t,xn,bi);break;default:throw Error(ne(329))}}}return Tn(t,bt()),t.callbackNode===n?ev.bind(null,t):null}function oh(t,e){var n=ta;return t.current.memoizedState.isDehydrated&&($r(t,e).flags|=256),t=Ac(t,e),t!==2&&(e=xn,xn=n,e!==null&&ah(e)),t}function ah(t){xn===null?xn=t:xn.push.apply(xn,t)}function RS(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var i=0;i<n.length;i++){var r=n[i],s=r.getSnapshot;r=r.value;try{if(!ai(s(),r))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function sr(t,e){for(e&=~Fd,e&=~Vc,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-si(e),i=1<<n;t[n]=-1,e&=~i}}function Tm(t){if(Qe&6)throw Error(ne(327));Ys();var e=lc(t,0);if(!(e&1))return Tn(t,bt()),null;var n=Ac(t,e);if(t.tag!==0&&n===2){var i=If(t);i!==0&&(e=i,n=oh(t,i))}if(n===1)throw n=Sa,$r(t,0),sr(t,e),Tn(t,bt()),n;if(n===6)throw Error(ne(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,Fr(t,xn,bi),Tn(t,bt()),null}function Bd(t,e){var n=Qe;Qe|=1;try{return t(e)}finally{Qe=n,Qe===0&&(ro=bt()+500,Bc&&Er())}}function ns(t){lr!==null&&lr.tag===0&&!(Qe&6)&&Ys();var e=Qe;Qe|=1;var n=Xn.transition,i=at;try{if(Xn.transition=null,at=1,t)return t()}finally{at=i,Xn.transition=n,Qe=e,!(Qe&6)&&Er()}}function zd(){bn=zs.current,_t(zs)}function $r(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,iS(n)),It!==null)for(n=It.return;n!==null;){var i=n;switch(yd(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&dc();break;case 3:no(),_t(Mn),_t(sn),bd();break;case 5:Cd(i);break;case 4:no();break;case 13:_t(yt);break;case 19:_t(yt);break;case 10:Td(i.type._context);break;case 22:case 23:zd()}n=n.return}if(zt=t,It=t=gr(t.current,null),Xt=bn=e,Nt=0,Sa=null,Fd=Vc=ts=0,xn=ta=null,jr!==null){for(e=0;e<jr.length;e++)if(n=jr[e],i=n.interleaved,i!==null){n.interleaved=null;var r=i.next,s=n.pending;if(s!==null){var o=s.next;s.next=r,i.next=o}n.pending=i}jr=null}return t}function tv(t,e){do{var n=It;try{if(Ed(),Vl.current=Mc,Sc){for(var i=St.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}Sc=!1}if(es=0,kt=Dt=St=null,Jo=!1,va=0,Od.current=null,n===null||n.return===null){Nt=1,Sa=e,It=null;break}e:{var s=t,o=n.return,a=n,l=e;if(e=Xt,a.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var c=l,u=a,h=u.tag;if(!(u.mode&1)&&(h===0||h===11||h===15)){var d=u.alternate;d?(u.updateQueue=d.updateQueue,u.memoizedState=d.memoizedState,u.lanes=d.lanes):(u.updateQueue=null,u.memoizedState=null)}var p=fm(o);if(p!==null){p.flags&=-257,hm(p,o,a,s,e),p.mode&1&&um(s,c,e),e=p,l=c;var g=e.updateQueue;if(g===null){var v=new Set;v.add(l),e.updateQueue=v}else g.add(l);break e}else{if(!(e&1)){um(s,c,e),Hd();break e}l=Error(ne(426))}}else if(vt&&a.mode&1){var m=fm(o);if(m!==null){!(m.flags&65536)&&(m.flags|=256),hm(m,o,a,s,e),Sd(io(l,a));break e}}s=l=io(l,a),Nt!==4&&(Nt=2),ta===null?ta=[s]:ta.push(s),s=o;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var f=k_(s,l,e);rm(s,f);break e;case 1:a=l;var _=s.type,x=s.stateNode;if(!(s.flags&128)&&(typeof _.getDerivedStateFromError=="function"||x!==null&&typeof x.componentDidCatch=="function"&&(pr===null||!pr.has(x)))){s.flags|=65536,e&=-e,s.lanes|=e;var y=B_(s,a,e);rm(s,y);break e}}s=s.return}while(s!==null)}rv(n)}catch(b){e=b,It===n&&n!==null&&(It=n=n.return);continue}break}while(!0)}function nv(){var t=Ec.current;return Ec.current=Mc,t===null?Mc:t}function Hd(){(Nt===0||Nt===3||Nt===2)&&(Nt=4),zt===null||!(ts&268435455)&&!(Vc&268435455)||sr(zt,Xt)}function Ac(t,e){var n=Qe;Qe|=2;var i=nv();(zt!==t||Xt!==e)&&(bi=null,$r(t,e));do try{CS();break}catch(r){tv(t,r)}while(!0);if(Ed(),Qe=n,Ec.current=i,It!==null)throw Error(ne(261));return zt=null,Xt=0,Nt}function CS(){for(;It!==null;)iv(It)}function bS(){for(;It!==null&&!ey();)iv(It)}function iv(t){var e=ov(t.alternate,t,bn);t.memoizedProps=t.pendingProps,e===null?rv(t):It=e,Od.current=null}function rv(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=MS(n,e),n!==null){n.flags&=32767,It=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{Nt=6,It=null;return}}else if(n=SS(n,e,bn),n!==null){It=n;return}if(e=e.sibling,e!==null){It=e;return}It=e=t}while(e!==null);Nt===0&&(Nt=5)}function Fr(t,e,n){var i=at,r=Xn.transition;try{Xn.transition=null,at=1,PS(t,e,n,i)}finally{Xn.transition=r,at=i}return null}function PS(t,e,n,i){do Ys();while(lr!==null);if(Qe&6)throw Error(ne(327));n=t.finishedWork;var r=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(ne(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(uy(t,s),t===zt&&(It=zt=null,Xt=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||el||(el=!0,av(ac,function(){return Ys(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=Xn.transition,Xn.transition=null;var o=at;at=1;var a=Qe;Qe|=4,Od.current=null,TS(t,n),Q_(n,t),qy(kf),cc=!!Ff,kf=Ff=null,t.current=n,wS(n),ty(),Qe=a,at=o,Xn.transition=s}else t.current=n;if(el&&(el=!1,lr=t,wc=r),s=t.pendingLanes,s===0&&(pr=null),ry(n.stateNode),Tn(t,bt()),e!==null)for(i=t.onRecoverableError,n=0;n<e.length;n++)r=e[n],i(r.value,{componentStack:r.stack,digest:r.digest});if(Tc)throw Tc=!1,t=rh,rh=null,t;return wc&1&&t.tag!==0&&Ys(),s=t.pendingLanes,s&1?t===sh?na++:(na=0,sh=t):na=0,Er(),null}function Ys(){if(lr!==null){var t=k0(wc),e=Xn.transition,n=at;try{if(Xn.transition=null,at=16>t?16:t,lr===null)var i=!1;else{if(t=lr,lr=null,wc=0,Qe&6)throw Error(ne(331));var r=Qe;for(Qe|=4,ge=t.current;ge!==null;){var s=ge,o=s.child;if(ge.flags&16){var a=s.deletions;if(a!==null){for(var l=0;l<a.length;l++){var c=a[l];for(ge=c;ge!==null;){var u=ge;switch(u.tag){case 0:case 11:case 15:ea(8,u,s)}var h=u.child;if(h!==null)h.return=u,ge=h;else for(;ge!==null;){u=ge;var d=u.sibling,p=u.return;if($_(u),u===c){ge=null;break}if(d!==null){d.return=p,ge=d;break}ge=p}}}var g=s.alternate;if(g!==null){var v=g.child;if(v!==null){g.child=null;do{var m=v.sibling;v.sibling=null,v=m}while(v!==null)}}ge=s}}if(s.subtreeFlags&2064&&o!==null)o.return=s,ge=o;else e:for(;ge!==null;){if(s=ge,s.flags&2048)switch(s.tag){case 0:case 11:case 15:ea(9,s,s.return)}var f=s.sibling;if(f!==null){f.return=s.return,ge=f;break e}ge=s.return}}var _=t.current;for(ge=_;ge!==null;){o=ge;var x=o.child;if(o.subtreeFlags&2064&&x!==null)x.return=o,ge=x;else e:for(o=_;ge!==null;){if(a=ge,a.flags&2048)try{switch(a.tag){case 0:case 11:case 15:Gc(9,a)}}catch(b){wt(a,a.return,b)}if(a===o){ge=null;break e}var y=a.sibling;if(y!==null){y.return=a.return,ge=y;break e}ge=a.return}}if(Qe=r,Er(),mi&&typeof mi.onPostCommitFiberRoot=="function")try{mi.onPostCommitFiberRoot(Nc,t)}catch{}i=!0}return i}finally{at=n,Xn.transition=e}}return!1}function wm(t,e,n){e=io(n,e),e=k_(t,e,1),t=dr(t,e,1),e=hn(),t!==null&&(Ca(t,1,e),Tn(t,e))}function wt(t,e,n){if(t.tag===3)wm(t,t,n);else for(;e!==null;){if(e.tag===3){wm(e,t,n);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(pr===null||!pr.has(i))){t=io(n,t),t=B_(e,t,1),e=dr(e,t,1),t=hn(),e!==null&&(Ca(e,1,t),Tn(e,t));break}}e=e.return}}function LS(t,e,n){var i=t.pingCache;i!==null&&i.delete(e),e=hn(),t.pingedLanes|=t.suspendedLanes&n,zt===t&&(Xt&n)===n&&(Nt===4||Nt===3&&(Xt&130023424)===Xt&&500>bt()-kd?$r(t,0):Fd|=n),Tn(t,e)}function sv(t,e){e===0&&(t.mode&1?(e=Wa,Wa<<=1,!(Wa&130023424)&&(Wa=4194304)):e=1);var n=hn();t=Hi(t,e),t!==null&&(Ca(t,e,n),Tn(t,n))}function IS(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),sv(t,n)}function DS(t,e){var n=0;switch(t.tag){case 13:var i=t.stateNode,r=t.memoizedState;r!==null&&(n=r.retryLane);break;case 19:i=t.stateNode;break;default:throw Error(ne(314))}i!==null&&i.delete(e),sv(t,n)}var ov;ov=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||Mn.current)Sn=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return Sn=!1,yS(t,e,n);Sn=!!(t.flags&131072)}else Sn=!1,vt&&e.flags&1048576&&u_(e,gc,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;Xl(t,e),t=e.pendingProps;var r=Js(e,sn.current);js(e,n),r=Ld(null,e,i,t,r,n);var s=Id();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,En(i)?(s=!0,pc(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,Ad(e),r.updater=Hc,e.stateNode=r,r._reactInternals=e,Yf(e,i,t,n),e=qf(null,e,i,!0,s,n)):(e.tag=0,vt&&s&&xd(e),un(null,e,r,n),e=e.child),e;case 16:i=e.elementType;e:{switch(Xl(t,e),t=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=US(i),t=ti(i,t),r){case 0:e=$f(null,e,i,t,n);break e;case 1:e=mm(null,e,i,t,n);break e;case 11:e=dm(null,e,i,t,n);break e;case 14:e=pm(null,e,i,ti(i.type,t),n);break e}throw Error(ne(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:ti(i,r),$f(t,e,i,r,n);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:ti(i,r),mm(t,e,i,r,n);case 3:e:{if(V_(e),t===null)throw Error(ne(387));i=e.pendingProps,s=e.memoizedState,r=s.element,g_(t,e),xc(e,i,null,n);var o=e.memoizedState;if(i=o.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=io(Error(ne(423)),e),e=gm(t,e,i,n,r);break e}else if(i!==r){r=io(Error(ne(424)),e),e=gm(t,e,i,n,r);break e}else for(In=hr(e.stateNode.containerInfo.firstChild),Dn=e,vt=!0,ii=null,n=p_(e,null,i,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(eo(),i===r){e=Gi(t,e,n);break e}un(t,e,i,n)}e=e.child}return e;case 5:return __(e),t===null&&Wf(e),i=e.type,r=e.pendingProps,s=t!==null?t.memoizedProps:null,o=r.children,Bf(i,r)?o=null:s!==null&&Bf(i,s)&&(e.flags|=32),G_(t,e),un(t,e,o,n),e.child;case 6:return t===null&&Wf(e),null;case 13:return W_(t,e,n);case 4:return Rd(e,e.stateNode.containerInfo),i=e.pendingProps,t===null?e.child=to(e,null,i,n):un(t,e,i,n),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:ti(i,r),dm(t,e,i,r,n);case 7:return un(t,e,e.pendingProps,n),e.child;case 8:return un(t,e,e.pendingProps.children,n),e.child;case 12:return un(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,o=r.value,ht(_c,i._currentValue),i._currentValue=o,s!==null)if(ai(s.value,o)){if(s.children===r.children&&!Mn.current){e=Gi(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var a=s.dependencies;if(a!==null){o=s.child;for(var l=a.firstContext;l!==null;){if(l.context===i){if(s.tag===1){l=Fi(-1,n&-n),l.tag=2;var c=s.updateQueue;if(c!==null){c=c.shared;var u=c.pending;u===null?l.next=l:(l.next=u.next,u.next=l),c.pending=l}}s.lanes|=n,l=s.alternate,l!==null&&(l.lanes|=n),Xf(s.return,n,e),a.lanes|=n;break}l=l.next}}else if(s.tag===10)o=s.type===e.type?null:s.child;else if(s.tag===18){if(o=s.return,o===null)throw Error(ne(341));o.lanes|=n,a=o.alternate,a!==null&&(a.lanes|=n),Xf(o,n,e),o=s.sibling}else o=s.child;if(o!==null)o.return=s;else for(o=s;o!==null;){if(o===e){o=null;break}if(s=o.sibling,s!==null){s.return=o.return,o=s;break}o=o.return}s=o}un(t,e,r.children,n),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,js(e,n),r=jn(r),i=i(r),e.flags|=1,un(t,e,i,n),e.child;case 14:return i=e.type,r=ti(i,e.pendingProps),r=ti(i.type,r),pm(t,e,i,r,n);case 15:return z_(t,e,e.type,e.pendingProps,n);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:ti(i,r),Xl(t,e),e.tag=1,En(i)?(t=!0,pc(e)):t=!1,js(e,n),F_(e,i,r),Yf(e,i,r,n),qf(null,e,i,!0,t,n);case 19:return X_(t,e,n);case 22:return H_(t,e,n)}throw Error(ne(156,e.tag))};function av(t,e){return N0(t,e)}function NS(t,e,n,i){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Wn(t,e,n,i){return new NS(t,e,n,i)}function Gd(t){return t=t.prototype,!(!t||!t.isReactComponent)}function US(t){if(typeof t=="function")return Gd(t)?1:0;if(t!=null){if(t=t.$$typeof,t===ad)return 11;if(t===ld)return 14}return 2}function gr(t,e){var n=t.alternate;return n===null?(n=Wn(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function Kl(t,e,n,i,r,s){var o=2;if(i=t,typeof t=="function")Gd(t)&&(o=1);else if(typeof t=="string")o=5;else e:switch(t){case Ps:return qr(n.children,r,s,e);case od:o=8,r|=8;break;case _f:return t=Wn(12,n,e,r|2),t.elementType=_f,t.lanes=s,t;case vf:return t=Wn(13,n,e,r),t.elementType=vf,t.lanes=s,t;case xf:return t=Wn(19,n,e,r),t.elementType=xf,t.lanes=s,t;case _0:return Wc(n,r,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case m0:o=10;break e;case g0:o=9;break e;case ad:o=11;break e;case ld:o=14;break e;case nr:o=16,i=null;break e}throw Error(ne(130,t==null?t:typeof t,""))}return e=Wn(o,n,e,r),e.elementType=t,e.type=i,e.lanes=s,e}function qr(t,e,n,i){return t=Wn(7,t,i,e),t.lanes=n,t}function Wc(t,e,n,i){return t=Wn(22,t,i,e),t.elementType=_0,t.lanes=n,t.stateNode={isHidden:!1},t}function Ru(t,e,n){return t=Wn(6,t,null,e),t.lanes=n,t}function Cu(t,e,n){return e=Wn(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function OS(t,e,n,i,r){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=lu(0),this.expirationTimes=lu(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=lu(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function Vd(t,e,n,i,r,s,o,a,l){return t=new OS(t,e,n,a,l),e===1?(e=1,s===!0&&(e|=8)):e=0,s=Wn(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:i,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Ad(s),t}function FS(t,e,n){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:bs,key:i==null?null:""+i,children:t,containerInfo:e,implementation:n}}function lv(t){if(!t)return yr;t=t._reactInternals;e:{if(os(t)!==t||t.tag!==1)throw Error(ne(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(En(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(ne(171))}if(t.tag===1){var n=t.type;if(En(n))return l_(t,n,e)}return e}function cv(t,e,n,i,r,s,o,a,l){return t=Vd(n,i,!0,t,r,s,o,a,l),t.context=lv(null),n=t.current,i=hn(),r=mr(n),s=Fi(i,r),s.callback=e??null,dr(n,s,r),t.current.lanes=r,Ca(t,r,i),Tn(t,i),t}function Xc(t,e,n,i){var r=e.current,s=hn(),o=mr(r);return n=lv(n),e.context===null?e.context=n:e.pendingContext=n,e=Fi(s,o),e.payload={element:t},i=i===void 0?null:i,i!==null&&(e.callback=i),t=dr(r,e,o),t!==null&&(oi(t,r,o,s),Gl(t,r,o)),o}function Rc(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function Am(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function Wd(t,e){Am(t,e),(t=t.alternate)&&Am(t,e)}function kS(){return null}var uv=typeof reportError=="function"?reportError:function(t){console.error(t)};function Xd(t){this._internalRoot=t}jc.prototype.render=Xd.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(ne(409));Xc(t,e,null,null)};jc.prototype.unmount=Xd.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;ns(function(){Xc(null,t,null,null)}),e[zi]=null}};function jc(t){this._internalRoot=t}jc.prototype.unstable_scheduleHydration=function(t){if(t){var e=H0();t={blockedOn:null,target:t,priority:e};for(var n=0;n<rr.length&&e!==0&&e<rr[n].priority;n++);rr.splice(n,0,t),n===0&&V0(t)}};function jd(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function Yc(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function Rm(){}function BS(t,e,n,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var c=Rc(o);s.call(c)}}var o=cv(e,i,t,0,null,!1,!1,"",Rm);return t._reactRootContainer=o,t[zi]=o.current,da(t.nodeType===8?t.parentNode:t),ns(),o}for(;r=t.lastChild;)t.removeChild(r);if(typeof i=="function"){var a=i;i=function(){var c=Rc(l);a.call(c)}}var l=Vd(t,0,!1,null,null,!1,!1,"",Rm);return t._reactRootContainer=l,t[zi]=l.current,da(t.nodeType===8?t.parentNode:t),ns(function(){Xc(e,l,n,i)}),l}function Kc(t,e,n,i,r){var s=n._reactRootContainer;if(s){var o=s;if(typeof r=="function"){var a=r;r=function(){var l=Rc(o);a.call(l)}}Xc(e,o,t,r)}else o=BS(n,e,t,r,i);return Rc(o)}B0=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=zo(e.pendingLanes);n!==0&&(fd(e,n|1),Tn(e,bt()),!(Qe&6)&&(ro=bt()+500,Er()))}break;case 13:ns(function(){var i=Hi(t,1);if(i!==null){var r=hn();oi(i,t,1,r)}}),Wd(t,1)}};hd=function(t){if(t.tag===13){var e=Hi(t,134217728);if(e!==null){var n=hn();oi(e,t,134217728,n)}Wd(t,134217728)}};z0=function(t){if(t.tag===13){var e=mr(t),n=Hi(t,e);if(n!==null){var i=hn();oi(n,t,e,i)}Wd(t,e)}};H0=function(){return at};G0=function(t,e){var n=at;try{return at=t,e()}finally{at=n}};bf=function(t,e,n){switch(e){case"input":if(Mf(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var i=n[e];if(i!==t&&i.form===t.form){var r=kc(i);if(!r)throw Error(ne(90));x0(i),Mf(i,r)}}}break;case"textarea":S0(t,n);break;case"select":e=n.value,e!=null&&Gs(t,!!n.multiple,e,!1)}};C0=Bd;b0=ns;var zS={usingClientEntryPoint:!1,Events:[Pa,Ns,kc,A0,R0,Bd]},Po={findFiberByHostInstance:Xr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},HS={bundleType:Po.bundleType,version:Po.version,rendererPackageName:Po.rendererPackageName,rendererConfig:Po.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:ji.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=I0(t),t===null?null:t.stateNode},findFiberByHostInstance:Po.findFiberByHostInstance||kS,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var tl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!tl.isDisabled&&tl.supportsFiber)try{Nc=tl.inject(HS),mi=tl}catch{}}Un.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=zS;Un.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!jd(e))throw Error(ne(200));return FS(t,e,null,n)};Un.createRoot=function(t,e){if(!jd(t))throw Error(ne(299));var n=!1,i="",r=uv;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=Vd(t,1,!1,null,null,n,!1,i,r),t[zi]=e.current,da(t.nodeType===8?t.parentNode:t),new Xd(e)};Un.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(ne(188)):(t=Object.keys(t).join(","),Error(ne(268,t)));return t=I0(e),t=t===null?null:t.stateNode,t};Un.flushSync=function(t){return ns(t)};Un.hydrate=function(t,e,n){if(!Yc(e))throw Error(ne(200));return Kc(null,t,e,!0,n)};Un.hydrateRoot=function(t,e,n){if(!jd(t))throw Error(ne(405));var i=n!=null&&n.hydratedSources||null,r=!1,s="",o=uv;if(n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),e=cv(e,null,t,1,n??null,r,!1,s,o),t[zi]=e.current,da(t),i)for(t=0;t<i.length;t++)n=i[t],r=n._getVersion,r=r(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,r]:e.mutableSourceEagerHydrationData.push(n,r);return new jc(e)};Un.render=function(t,e,n){if(!Yc(e))throw Error(ne(200));return Kc(null,t,e,!1,n)};Un.unmountComponentAtNode=function(t){if(!Yc(t))throw Error(ne(40));return t._reactRootContainer?(ns(function(){Kc(null,null,t,!1,function(){t._reactRootContainer=null,t[zi]=null})}),!0):!1};Un.unstable_batchedUpdates=Bd;Un.unstable_renderSubtreeIntoContainer=function(t,e,n,i){if(!Yc(n))throw Error(ne(200));if(t==null||t._reactInternals===void 0)throw Error(ne(38));return Kc(t,e,n,!1,i)};Un.version="18.3.1-next-f1338f8080-20240426";function fv(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(fv)}catch(t){console.error(t)}}fv(),f0.exports=Un;var GS=f0.exports,Cm=GS;mf.createRoot=Cm.createRoot,mf.hydrateRoot=Cm.hydrateRoot;/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Yd="170",VS=0,bm=1,WS=2,hv=1,XS=2,Ci=3,Vi=0,wn=1,Ln=2,_r=0,Ks=1,Pm=2,Lm=3,Im=4,jS=5,Hr=100,YS=101,KS=102,$S=103,qS=104,ZS=200,QS=201,JS=202,eM=203,lh=204,ch=205,tM=206,nM=207,iM=208,rM=209,sM=210,oM=211,aM=212,lM=213,cM=214,uh=0,fh=1,hh=2,so=3,dh=4,ph=5,mh=6,gh=7,Kd=0,uM=1,fM=2,vr=0,hM=1,dM=2,pM=3,mM=4,gM=5,_M=6,vM=7,dv=300,oo=301,ao=302,_h=303,vh=304,$c=306,xh=1e3,Ni=1001,yh=1002,dn=1003,xM=1004,nl=1005,pi=1006,bu=1007,Kr=1008,Wi=1009,pv=1010,mv=1011,Ma=1012,$d=1013,is=1014,Ui=1015,Ia=1016,qd=1017,Zd=1018,lo=1020,gv=35902,_v=1021,vv=1022,ri=1023,xv=1024,yv=1025,$s=1026,co=1027,Sv=1028,Qd=1029,Mv=1030,Jd=1031,ep=1033,$l=33776,ql=33777,Zl=33778,Ql=33779,Sh=35840,Mh=35841,Eh=35842,Th=35843,wh=36196,Ah=37492,Rh=37496,Ch=37808,bh=37809,Ph=37810,Lh=37811,Ih=37812,Dh=37813,Nh=37814,Uh=37815,Oh=37816,Fh=37817,kh=37818,Bh=37819,zh=37820,Hh=37821,Jl=36492,Gh=36494,Vh=36495,Ev=36283,Wh=36284,Xh=36285,jh=36286,yM=3200,SM=3201,Tv=0,MM=1,or="",Pn="srgb",go="srgb-linear",qc="linear",ct="srgb",us=7680,Dm=519,EM=512,TM=513,wM=514,wv=515,AM=516,RM=517,CM=518,bM=519,Nm=35044,Um="300 es",Oi=2e3,Cc=2001;class _o{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const Zt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Om=1234567;const qs=Math.PI/180,Ea=180/Math.PI;function vo(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Zt[t&255]+Zt[t>>8&255]+Zt[t>>16&255]+Zt[t>>24&255]+"-"+Zt[e&255]+Zt[e>>8&255]+"-"+Zt[e>>16&15|64]+Zt[e>>24&255]+"-"+Zt[n&63|128]+Zt[n>>8&255]+"-"+Zt[n>>16&255]+Zt[n>>24&255]+Zt[i&255]+Zt[i>>8&255]+Zt[i>>16&255]+Zt[i>>24&255]).toLowerCase()}function fn(t,e,n){return Math.max(e,Math.min(n,t))}function tp(t,e){return(t%e+e)%e}function PM(t,e,n,i,r){return i+(t-e)*(r-i)/(n-e)}function LM(t,e,n){return t!==e?(n-t)/(e-t):0}function ia(t,e,n){return(1-n)*t+n*e}function IM(t,e,n,i){return ia(t,e,1-Math.exp(-n*i))}function DM(t,e=1){return e-Math.abs(tp(t,e*2)-e)}function NM(t,e,n){return t<=e?0:t>=n?1:(t=(t-e)/(n-e),t*t*(3-2*t))}function UM(t,e,n){return t<=e?0:t>=n?1:(t=(t-e)/(n-e),t*t*t*(t*(t*6-15)+10))}function OM(t,e){return t+Math.floor(Math.random()*(e-t+1))}function FM(t,e){return t+Math.random()*(e-t)}function kM(t){return t*(.5-Math.random())}function BM(t){t!==void 0&&(Om=t);let e=Om+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function zM(t){return t*qs}function HM(t){return t*Ea}function GM(t){return(t&t-1)===0&&t!==0}function VM(t){return Math.pow(2,Math.ceil(Math.log(t)/Math.LN2))}function WM(t){return Math.pow(2,Math.floor(Math.log(t)/Math.LN2))}function XM(t,e,n,i,r){const s=Math.cos,o=Math.sin,a=s(n/2),l=o(n/2),c=s((e+i)/2),u=o((e+i)/2),h=s((e-i)/2),d=o((e-i)/2),p=s((i-e)/2),g=o((i-e)/2);switch(r){case"XYX":t.set(a*u,l*h,l*d,a*c);break;case"YZY":t.set(l*d,a*u,l*h,a*c);break;case"ZXZ":t.set(l*h,l*d,a*u,a*c);break;case"XZX":t.set(a*u,l*g,l*p,a*c);break;case"YXY":t.set(l*p,a*u,l*g,a*c);break;case"ZYZ":t.set(l*g,l*p,a*u,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function Cs(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("Invalid component type.")}}function ln(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("Invalid component type.")}}const jM={DEG2RAD:qs,RAD2DEG:Ea,generateUUID:vo,clamp:fn,euclideanModulo:tp,mapLinear:PM,inverseLerp:LM,lerp:ia,damp:IM,pingpong:DM,smoothstep:NM,smootherstep:UM,randInt:OM,randFloat:FM,randFloatSpread:kM,seededRandom:BM,degToRad:zM,radToDeg:HM,isPowerOfTwo:GM,ceilPowerOfTwo:VM,floorPowerOfTwo:WM,setQuaternionFromProperEuler:XM,normalize:ln,denormalize:Cs};class st{constructor(e=0,n=0){st.prototype.isVector2=!0,this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(fn(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ze{constructor(e,n,i,r,s,o,a,l,c){ze.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,a,l,c)}set(e,n,i,r,s,o,a,l,c){const u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=n,u[4]=s,u[5]=l,u[6]=i,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],u=i[4],h=i[7],d=i[2],p=i[5],g=i[8],v=r[0],m=r[3],f=r[6],_=r[1],x=r[4],y=r[7],b=r[2],A=r[5],R=r[8];return s[0]=o*v+a*_+l*b,s[3]=o*m+a*x+l*A,s[6]=o*f+a*y+l*R,s[1]=c*v+u*_+h*b,s[4]=c*m+u*x+h*A,s[7]=c*f+u*y+h*R,s[2]=d*v+p*_+g*b,s[5]=d*m+p*x+g*A,s[8]=d*f+p*y+g*R,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return n*o*u-n*a*c-i*s*u+i*a*l+r*s*c-r*o*l}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=u*o-a*c,d=a*l-u*s,p=c*s-o*l,g=n*h+i*d+r*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=h*v,e[1]=(r*c-u*i)*v,e[2]=(a*i-r*o)*v,e[3]=d*v,e[4]=(u*n-r*l)*v,e[5]=(r*s-a*n)*v,e[6]=p*v,e[7]=(i*l-c*n)*v,e[8]=(o*n-i*s)*v,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+n,0,0,1),this}scale(e,n){return this.premultiply(Pu.makeScale(e,n)),this}rotate(e){return this.premultiply(Pu.makeRotation(-e)),this}translate(e,n){return this.premultiply(Pu.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Pu=new ze;function Av(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function bc(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function YM(){const t=bc("canvas");return t.style.display="block",t}const Fm={};function Go(t){t in Fm||(Fm[t]=!0,console.warn(t))}function KM(t,e,n){return new Promise(function(i,r){function s(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:r();break;case t.TIMEOUT_EXPIRED:setTimeout(s,n);break;default:i()}}setTimeout(s,n)})}function $M(t){const e=t.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function qM(t){const e=t.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Ze={enabled:!0,workingColorSpace:go,spaces:{},convert:function(t,e,n){return this.enabled===!1||e===n||!e||!n||(this.spaces[e].transfer===ct&&(t.r=ki(t.r),t.g=ki(t.g),t.b=ki(t.b)),this.spaces[e].primaries!==this.spaces[n].primaries&&(t.applyMatrix3(this.spaces[e].toXYZ),t.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===ct&&(t.r=Zs(t.r),t.g=Zs(t.g),t.b=Zs(t.b))),t},fromWorkingColorSpace:function(t,e){return this.convert(t,this.workingColorSpace,e)},toWorkingColorSpace:function(t,e){return this.convert(t,e,this.workingColorSpace)},getPrimaries:function(t){return this.spaces[t].primaries},getTransfer:function(t){return t===or?qc:this.spaces[t].transfer},getLuminanceCoefficients:function(t,e=this.workingColorSpace){return t.fromArray(this.spaces[e].luminanceCoefficients)},define:function(t){Object.assign(this.spaces,t)},_getMatrix:function(t,e,n){return t.copy(this.spaces[e].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(t){return this.spaces[t].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(t=this.workingColorSpace){return this.spaces[t].workingColorSpaceConfig.unpackColorSpace}};function ki(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function Zs(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}const km=[.64,.33,.3,.6,.15,.06],Bm=[.2126,.7152,.0722],zm=[.3127,.329],Hm=new ze().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Gm=new ze().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Ze.define({[go]:{primaries:km,whitePoint:zm,transfer:qc,toXYZ:Hm,fromXYZ:Gm,luminanceCoefficients:Bm,workingColorSpaceConfig:{unpackColorSpace:Pn},outputColorSpaceConfig:{drawingBufferColorSpace:Pn}},[Pn]:{primaries:km,whitePoint:zm,transfer:ct,toXYZ:Hm,fromXYZ:Gm,luminanceCoefficients:Bm,outputColorSpaceConfig:{drawingBufferColorSpace:Pn}}});let fs;class ZM{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{fs===void 0&&(fs=bc("canvas")),fs.width=e.width,fs.height=e.height;const i=fs.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=fs}return n.width>2048||n.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),n.toDataURL("image/jpeg",.6)):n.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=bc("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=ki(s[o]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(ki(n[i]/255)*255):n[i]=ki(n[i]);return{data:n,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let QM=0;class Rv{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:QM++}),this.uuid=vo(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(Lu(r[o].image)):s.push(Lu(r[o]))}else s=Lu(r);i.url=s}return n||(e.images[this.uuid]=i),i}}function Lu(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?ZM.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let JM=0;class pn extends _o{constructor(e=pn.DEFAULT_IMAGE,n=pn.DEFAULT_MAPPING,i=Ni,r=Ni,s=pi,o=Kr,a=ri,l=Wi,c=pn.DEFAULT_ANISOTROPY,u=or){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:JM++}),this.uuid=vo(),this.name="",this.source=new Rv(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new st(0,0),this.repeat=new st(1,1),this.center=new st(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ze,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==dv)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case xh:e.x=e.x-Math.floor(e.x);break;case Ni:e.x=e.x<0?0:1;break;case yh:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case xh:e.y=e.y-Math.floor(e.y);break;case Ni:e.y=e.y<0?0:1;break;case yh:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}pn.DEFAULT_IMAGE=null;pn.DEFAULT_MAPPING=dv;pn.DEFAULT_ANISOTROPY=1;class At{constructor(e=0,n=0,i=0,r=1){At.prototype.isVector4=!0,this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*n+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*n+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*n+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*n+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s;const l=e.elements,c=l[0],u=l[4],h=l[8],d=l[1],p=l[5],g=l[9],v=l[2],m=l[6],f=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+v)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const x=(c+1)/2,y=(p+1)/2,b=(f+1)/2,A=(u+d)/4,R=(h+v)/4,C=(g+m)/4;return x>y&&x>b?x<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(x),r=A/i,s=R/i):y>b?y<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(y),i=A/r,s=C/r):b<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(b),i=R/s,r=C/s),this.set(i,r,s,n),this}let _=Math.sqrt((m-g)*(m-g)+(h-v)*(h-v)+(d-u)*(d-u));return Math.abs(_)<.001&&(_=1),this.x=(m-g)/_,this.y=(h-v)/_,this.z=(d-u)/_,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this.w=Math.max(e.w,Math.min(n.w,this.w)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this.w=Math.max(e,Math.min(n,this.w)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class eE extends _o{constructor(e=1,n=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=1,this.scissor=new At(0,0,e,n),this.scissorTest=!1,this.viewport=new At(0,0,e,n);const r={width:e,height:n,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:pi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new pn(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=n,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const n=Object.assign({},e.texture.image);return this.texture.source=new Rv(n),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class rs extends eE{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class Cv extends pn{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=dn,this.minFilter=dn,this.wrapR=Ni,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class tE extends pn{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=dn,this.minFilter=dn,this.wrapR=Ni,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Da{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,o,a){let l=i[r+0],c=i[r+1],u=i[r+2],h=i[r+3];const d=s[o+0],p=s[o+1],g=s[o+2],v=s[o+3];if(a===0){e[n+0]=l,e[n+1]=c,e[n+2]=u,e[n+3]=h;return}if(a===1){e[n+0]=d,e[n+1]=p,e[n+2]=g,e[n+3]=v;return}if(h!==v||l!==d||c!==p||u!==g){let m=1-a;const f=l*d+c*p+u*g+h*v,_=f>=0?1:-1,x=1-f*f;if(x>Number.EPSILON){const b=Math.sqrt(x),A=Math.atan2(b,f*_);m=Math.sin(m*A)/b,a=Math.sin(a*A)/b}const y=a*_;if(l=l*m+d*y,c=c*m+p*y,u=u*m+g*y,h=h*m+v*y,m===1-a){const b=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=b,c*=b,u*=b,h*=b}}e[n]=l,e[n+1]=c,e[n+2]=u,e[n+3]=h}static multiplyQuaternionsFlat(e,n,i,r,s,o){const a=i[r],l=i[r+1],c=i[r+2],u=i[r+3],h=s[o],d=s[o+1],p=s[o+2],g=s[o+3];return e[n]=a*g+u*h+l*p-c*d,e[n+1]=l*g+u*d+c*h-a*p,e[n+2]=c*g+u*p+a*d-l*h,e[n+3]=u*g-a*h-l*d-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),u=a(r/2),h=a(s/2),d=l(i/2),p=l(r/2),g=l(s/2);switch(o){case"XYZ":this._x=d*u*h+c*p*g,this._y=c*p*h-d*u*g,this._z=c*u*g+d*p*h,this._w=c*u*h-d*p*g;break;case"YXZ":this._x=d*u*h+c*p*g,this._y=c*p*h-d*u*g,this._z=c*u*g-d*p*h,this._w=c*u*h+d*p*g;break;case"ZXY":this._x=d*u*h-c*p*g,this._y=c*p*h+d*u*g,this._z=c*u*g+d*p*h,this._w=c*u*h-d*p*g;break;case"ZYX":this._x=d*u*h-c*p*g,this._y=c*p*h+d*u*g,this._z=c*u*g-d*p*h,this._w=c*u*h+d*p*g;break;case"YZX":this._x=d*u*h+c*p*g,this._y=c*p*h+d*u*g,this._z=c*u*g-d*p*h,this._w=c*u*h-d*p*g;break;case"XZY":this._x=d*u*h-c*p*g,this._y=c*p*h-d*u*g,this._z=c*u*g+d*p*h,this._w=c*u*h+d*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],r=n[4],s=n[8],o=n[1],a=n[5],l=n[9],c=n[2],u=n[6],h=n[10],d=i+a+h;if(d>0){const p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(u-l)*p,this._y=(s-c)*p,this._z=(o-r)*p}else if(i>a&&i>h){const p=2*Math.sqrt(1+i-a-h);this._w=(u-l)/p,this._x=.25*p,this._y=(r+o)/p,this._z=(s+c)/p}else if(a>h){const p=2*Math.sqrt(1+a-i-h);this._w=(s-c)/p,this._x=(r+o)/p,this._y=.25*p,this._z=(l+u)/p}else{const p=2*Math.sqrt(1+h-i-a);this._w=(o-r)/p,this._x=(s+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(fn(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,r=e._y,s=e._z,o=e._w,a=n._x,l=n._y,c=n._z,u=n._w;return this._x=i*u+o*a+r*c-s*l,this._y=r*u+o*l+s*a-i*c,this._z=s*u+o*c+i*l-r*a,this._w=o*u-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,n){if(n===0)return this;if(n===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,o=this._w;let a=o*e._w+i*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=r,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const p=1-n;return this._w=p*o+n*this._w,this._x=p*i+n*this._x,this._y=p*r+n*this._y,this._z=p*s+n*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,a),h=Math.sin((1-n)*u)/c,d=Math.sin(n*u)/c;return this._w=o*h+this._w*d,this._x=i*h+this._x*d,this._y=r*h+this._y*d,this._z=s*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(n),s*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class k{constructor(e=0,n=0,i=0){k.prototype.isVector3=!0,this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(Vm.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(Vm.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const n=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*i),u=2*(a*n-s*r),h=2*(s*i-o*n);return this.x=n+l*c+o*h-a*u,this.y=i+l*u+a*c-s*h,this.z=r+l*h+s*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,r=e.y,s=e.z,o=n.x,a=n.y,l=n.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Iu.copy(this).projectOnVector(e),this.sub(Iu)}reflect(e){return this.sub(Iu.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(fn(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Iu=new k,Vm=new Da;class Na{constructor(e=new k(1/0,1/0,1/0),n=new k(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(Zn.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(Zn.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=Zn.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(n===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Zn):Zn.fromBufferAttribute(s,o),Zn.applyMatrix4(e.matrixWorld),this.expandByPoint(Zn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),il.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),il.copy(i.boundingBox)),il.applyMatrix4(e.matrixWorld),this.union(il)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Zn),Zn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Lo),rl.subVectors(this.max,Lo),hs.subVectors(e.a,Lo),ds.subVectors(e.b,Lo),ps.subVectors(e.c,Lo),qi.subVectors(ds,hs),Zi.subVectors(ps,ds),Ar.subVectors(hs,ps);let n=[0,-qi.z,qi.y,0,-Zi.z,Zi.y,0,-Ar.z,Ar.y,qi.z,0,-qi.x,Zi.z,0,-Zi.x,Ar.z,0,-Ar.x,-qi.y,qi.x,0,-Zi.y,Zi.x,0,-Ar.y,Ar.x,0];return!Du(n,hs,ds,ps,rl)||(n=[1,0,0,0,1,0,0,0,1],!Du(n,hs,ds,ps,rl))?!1:(sl.crossVectors(qi,Zi),n=[sl.x,sl.y,sl.z],Du(n,hs,ds,ps,rl))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Zn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Zn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Ei[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ei[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ei[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ei[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ei[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ei[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ei[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ei[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ei),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Ei=[new k,new k,new k,new k,new k,new k,new k,new k],Zn=new k,il=new Na,hs=new k,ds=new k,ps=new k,qi=new k,Zi=new k,Ar=new k,Lo=new k,rl=new k,sl=new k,Rr=new k;function Du(t,e,n,i,r){for(let s=0,o=t.length-3;s<=o;s+=3){Rr.fromArray(t,s);const a=r.x*Math.abs(Rr.x)+r.y*Math.abs(Rr.y)+r.z*Math.abs(Rr.z),l=e.dot(Rr),c=n.dot(Rr),u=i.dot(Rr);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const nE=new Na,Io=new k,Nu=new k;class Ua{constructor(e=new k,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):nE.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Io.subVectors(e,this.center);const n=Io.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(Io,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Nu.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Io.copy(e.center).add(Nu)),this.expandByPoint(Io.copy(e.center).sub(Nu))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Ti=new k,Uu=new k,ol=new k,Qi=new k,Ou=new k,al=new k,Fu=new k;class bv{constructor(e=new k,n=new k(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ti)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=Ti.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(Ti.copy(this.origin).addScaledVector(this.direction,n),Ti.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){Uu.copy(e).add(n).multiplyScalar(.5),ol.copy(n).sub(e).normalize(),Qi.copy(this.origin).sub(Uu);const s=e.distanceTo(n)*.5,o=-this.direction.dot(ol),a=Qi.dot(this.direction),l=-Qi.dot(ol),c=Qi.lengthSq(),u=Math.abs(1-o*o);let h,d,p,g;if(u>0)if(h=o*l-a,d=o*a-l,g=s*u,h>=0)if(d>=-g)if(d<=g){const v=1/u;h*=v,d*=v,p=h*(h+o*d+2*a)+d*(o*h+d+2*l)+c}else d=s,h=Math.max(0,-(o*d+a)),p=-h*h+d*(d+2*l)+c;else d=-s,h=Math.max(0,-(o*d+a)),p=-h*h+d*(d+2*l)+c;else d<=-g?(h=Math.max(0,-(-o*s+a)),d=h>0?-s:Math.min(Math.max(-s,-l),s),p=-h*h+d*(d+2*l)+c):d<=g?(h=0,d=Math.min(Math.max(-s,-l),s),p=d*(d+2*l)+c):(h=Math.max(0,-(o*s+a)),d=h>0?s:Math.min(Math.max(-s,-l),s),p=-h*h+d*(d+2*l)+c);else d=o>0?-s:s,h=Math.max(0,-(o*d+a)),p=-h*h+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(Uu).addScaledVector(ol,d),p}intersectSphere(e,n){Ti.subVectors(e.center,this.origin);const i=Ti.dot(this.direction),r=Ti.dot(Ti)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,n):this.at(a,n)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),u>=0?(s=(e.min.y-d.y)*u,o=(e.max.y-d.y)*u):(s=(e.max.y-d.y)*u,o=(e.min.y-d.y)*u),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),h>=0?(a=(e.min.z-d.z)*h,l=(e.max.z-d.z)*h):(a=(e.max.z-d.z)*h,l=(e.min.z-d.z)*h),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,Ti)!==null}intersectTriangle(e,n,i,r,s){Ou.subVectors(n,e),al.subVectors(i,e),Fu.crossVectors(Ou,al);let o=this.direction.dot(Fu),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Qi.subVectors(this.origin,e);const l=a*this.direction.dot(al.crossVectors(Qi,al));if(l<0)return null;const c=a*this.direction.dot(Ou.cross(Qi));if(c<0||l+c>o)return null;const u=-a*Qi.dot(Fu);return u<0?null:this.at(u/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Mt{constructor(e,n,i,r,s,o,a,l,c,u,h,d,p,g,v,m){Mt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,a,l,c,u,h,d,p,g,v,m)}set(e,n,i,r,s,o,a,l,c,u,h,d,p,g,v,m){const f=this.elements;return f[0]=e,f[4]=n,f[8]=i,f[12]=r,f[1]=s,f[5]=o,f[9]=a,f[13]=l,f[2]=c,f[6]=u,f[10]=h,f[14]=d,f[3]=p,f[7]=g,f[11]=v,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Mt().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){const n=this.elements,i=e.elements,r=1/ms.setFromMatrixColumn(e,0).length(),s=1/ms.setFromMatrixColumn(e,1).length(),o=1/ms.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*o,n[9]=i[9]*o,n[10]=i[10]*o,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){const d=o*u,p=o*h,g=a*u,v=a*h;n[0]=l*u,n[4]=-l*h,n[8]=c,n[1]=p+g*c,n[5]=d-v*c,n[9]=-a*l,n[2]=v-d*c,n[6]=g+p*c,n[10]=o*l}else if(e.order==="YXZ"){const d=l*u,p=l*h,g=c*u,v=c*h;n[0]=d+v*a,n[4]=g*a-p,n[8]=o*c,n[1]=o*h,n[5]=o*u,n[9]=-a,n[2]=p*a-g,n[6]=v+d*a,n[10]=o*l}else if(e.order==="ZXY"){const d=l*u,p=l*h,g=c*u,v=c*h;n[0]=d-v*a,n[4]=-o*h,n[8]=g+p*a,n[1]=p+g*a,n[5]=o*u,n[9]=v-d*a,n[2]=-o*c,n[6]=a,n[10]=o*l}else if(e.order==="ZYX"){const d=o*u,p=o*h,g=a*u,v=a*h;n[0]=l*u,n[4]=g*c-p,n[8]=d*c+v,n[1]=l*h,n[5]=v*c+d,n[9]=p*c-g,n[2]=-c,n[6]=a*l,n[10]=o*l}else if(e.order==="YZX"){const d=o*l,p=o*c,g=a*l,v=a*c;n[0]=l*u,n[4]=v-d*h,n[8]=g*h+p,n[1]=h,n[5]=o*u,n[9]=-a*u,n[2]=-c*u,n[6]=p*h+g,n[10]=d-v*h}else if(e.order==="XZY"){const d=o*l,p=o*c,g=a*l,v=a*c;n[0]=l*u,n[4]=-h,n[8]=c*u,n[1]=d*h+v,n[5]=o*u,n[9]=p*h-g,n[2]=g*h-p,n[6]=a*u,n[10]=v*h+d}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(iE,e,rE)}lookAt(e,n,i){const r=this.elements;return Rn.subVectors(e,n),Rn.lengthSq()===0&&(Rn.z=1),Rn.normalize(),Ji.crossVectors(i,Rn),Ji.lengthSq()===0&&(Math.abs(i.z)===1?Rn.x+=1e-4:Rn.z+=1e-4,Rn.normalize(),Ji.crossVectors(i,Rn)),Ji.normalize(),ll.crossVectors(Rn,Ji),r[0]=Ji.x,r[4]=ll.x,r[8]=Rn.x,r[1]=Ji.y,r[5]=ll.y,r[9]=Rn.y,r[2]=Ji.z,r[6]=ll.z,r[10]=Rn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],u=i[1],h=i[5],d=i[9],p=i[13],g=i[2],v=i[6],m=i[10],f=i[14],_=i[3],x=i[7],y=i[11],b=i[15],A=r[0],R=r[4],C=r[8],T=r[12],S=r[1],P=r[5],j=r[9],H=r[13],Y=r[2],ee=r[6],X=r[10],ie=r[14],L=r[3],$=r[7],J=r[11],le=r[15];return s[0]=o*A+a*S+l*Y+c*L,s[4]=o*R+a*P+l*ee+c*$,s[8]=o*C+a*j+l*X+c*J,s[12]=o*T+a*H+l*ie+c*le,s[1]=u*A+h*S+d*Y+p*L,s[5]=u*R+h*P+d*ee+p*$,s[9]=u*C+h*j+d*X+p*J,s[13]=u*T+h*H+d*ie+p*le,s[2]=g*A+v*S+m*Y+f*L,s[6]=g*R+v*P+m*ee+f*$,s[10]=g*C+v*j+m*X+f*J,s[14]=g*T+v*H+m*ie+f*le,s[3]=_*A+x*S+y*Y+b*L,s[7]=_*R+x*P+y*ee+b*$,s[11]=_*C+x*j+y*X+b*J,s[15]=_*T+x*H+y*ie+b*le,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],h=e[6],d=e[10],p=e[14],g=e[3],v=e[7],m=e[11],f=e[15];return g*(+s*l*h-r*c*h-s*a*d+i*c*d+r*a*p-i*l*p)+v*(+n*l*p-n*c*d+s*o*d-r*o*p+r*c*u-s*l*u)+m*(+n*c*h-n*a*p-s*o*h+i*o*p+s*a*u-i*c*u)+f*(-r*a*u-n*l*h+n*a*d+r*o*h-i*o*d+i*l*u)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=e[9],d=e[10],p=e[11],g=e[12],v=e[13],m=e[14],f=e[15],_=h*m*c-v*d*c+v*l*p-a*m*p-h*l*f+a*d*f,x=g*d*c-u*m*c-g*l*p+o*m*p+u*l*f-o*d*f,y=u*v*c-g*h*c+g*a*p-o*v*p-u*a*f+o*h*f,b=g*h*l-u*v*l-g*a*d+o*v*d+u*a*m-o*h*m,A=n*_+i*x+r*y+s*b;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/A;return e[0]=_*R,e[1]=(v*d*s-h*m*s-v*r*p+i*m*p+h*r*f-i*d*f)*R,e[2]=(a*m*s-v*l*s+v*r*c-i*m*c-a*r*f+i*l*f)*R,e[3]=(h*l*s-a*d*s-h*r*c+i*d*c+a*r*p-i*l*p)*R,e[4]=x*R,e[5]=(u*m*s-g*d*s+g*r*p-n*m*p-u*r*f+n*d*f)*R,e[6]=(g*l*s-o*m*s-g*r*c+n*m*c+o*r*f-n*l*f)*R,e[7]=(o*d*s-u*l*s+u*r*c-n*d*c-o*r*p+n*l*p)*R,e[8]=y*R,e[9]=(g*h*s-u*v*s-g*i*p+n*v*p+u*i*f-n*h*f)*R,e[10]=(o*v*s-g*a*s+g*i*c-n*v*c-o*i*f+n*a*f)*R,e[11]=(u*a*s-o*h*s-u*i*c+n*h*c+o*i*p-n*a*p)*R,e[12]=b*R,e[13]=(u*v*r-g*h*r+g*i*d-n*v*d-u*i*m+n*h*m)*R,e[14]=(g*a*r-o*v*r-g*i*l+n*v*l+o*i*m-n*a*m)*R,e[15]=(o*h*r-u*a*r+u*i*l-n*h*l-o*i*d+n*a*d)*R,this}scale(e){const n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),r=Math.sin(n),s=1-i,o=e.x,a=e.y,l=e.z,c=s*o,u=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,u*a+i,u*l-r*o,0,c*l-r*a,u*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){const r=this.elements,s=n._x,o=n._y,a=n._z,l=n._w,c=s+s,u=o+o,h=a+a,d=s*c,p=s*u,g=s*h,v=o*u,m=o*h,f=a*h,_=l*c,x=l*u,y=l*h,b=i.x,A=i.y,R=i.z;return r[0]=(1-(v+f))*b,r[1]=(p+y)*b,r[2]=(g-x)*b,r[3]=0,r[4]=(p-y)*A,r[5]=(1-(d+f))*A,r[6]=(m+_)*A,r[7]=0,r[8]=(g+x)*R,r[9]=(m-_)*R,r[10]=(1-(d+v))*R,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){const r=this.elements;let s=ms.set(r[0],r[1],r[2]).length();const o=ms.set(r[4],r[5],r[6]).length(),a=ms.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],Qn.copy(this);const c=1/s,u=1/o,h=1/a;return Qn.elements[0]*=c,Qn.elements[1]*=c,Qn.elements[2]*=c,Qn.elements[4]*=u,Qn.elements[5]*=u,Qn.elements[6]*=u,Qn.elements[8]*=h,Qn.elements[9]*=h,Qn.elements[10]*=h,n.setFromRotationMatrix(Qn),i.x=s,i.y=o,i.z=a,this}makePerspective(e,n,i,r,s,o,a=Oi){const l=this.elements,c=2*s/(n-e),u=2*s/(i-r),h=(n+e)/(n-e),d=(i+r)/(i-r);let p,g;if(a===Oi)p=-(o+s)/(o-s),g=-2*o*s/(o-s);else if(a===Cc)p=-o/(o-s),g=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=u,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,n,i,r,s,o,a=Oi){const l=this.elements,c=1/(n-e),u=1/(i-r),h=1/(o-s),d=(n+e)*c,p=(i+r)*u;let g,v;if(a===Oi)g=(o+s)*h,v=-2*h;else if(a===Cc)g=s*h,v=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=v,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}}const ms=new k,Qn=new Mt,iE=new k(0,0,0),rE=new k(1,1,1),Ji=new k,ll=new k,Rn=new k,Wm=new Mt,Xm=new Da;class vi{constructor(e=0,n=0,i=0,r=vi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],u=r[9],h=r[2],d=r[6],p=r[10];switch(n){case"XYZ":this._y=Math.asin(fn(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-fn(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(fn(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-fn(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(fn(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-fn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return Wm.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Wm,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return Xm.setFromEuler(this),this.setFromQuaternion(Xm,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}vi.DEFAULT_ORDER="XYZ";class Pv{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let sE=0;const jm=new k,gs=new Da,wi=new Mt,cl=new k,Do=new k,oE=new k,aE=new Da,Ym=new k(1,0,0),Km=new k(0,1,0),$m=new k(0,0,1),qm={type:"added"},lE={type:"removed"},_s={type:"childadded",child:null},ku={type:"childremoved",child:null};class jt extends _o{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:sE++}),this.uuid=vo(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=jt.DEFAULT_UP.clone();const e=new k,n=new vi,i=new Da,r=new k(1,1,1);function s(){i.setFromEuler(n,!1)}function o(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Mt},normalMatrix:{value:new ze}}),this.matrix=new Mt,this.matrixWorld=new Mt,this.matrixAutoUpdate=jt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=jt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Pv,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return gs.setFromAxisAngle(e,n),this.quaternion.multiply(gs),this}rotateOnWorldAxis(e,n){return gs.setFromAxisAngle(e,n),this.quaternion.premultiply(gs),this}rotateX(e){return this.rotateOnAxis(Ym,e)}rotateY(e){return this.rotateOnAxis(Km,e)}rotateZ(e){return this.rotateOnAxis($m,e)}translateOnAxis(e,n){return jm.copy(e).applyQuaternion(this.quaternion),this.position.add(jm.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(Ym,e)}translateY(e){return this.translateOnAxis(Km,e)}translateZ(e){return this.translateOnAxis($m,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(wi.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?cl.copy(e):cl.set(e,n,i);const r=this.parent;this.updateWorldMatrix(!0,!1),Do.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?wi.lookAt(Do,cl,this.up):wi.lookAt(cl,Do,this.up),this.quaternion.setFromRotationMatrix(wi),r&&(wi.extractRotation(r.matrixWorld),gs.setFromRotationMatrix(wi),this.quaternion.premultiply(gs.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(qm),_s.child=e,this.dispatchEvent(_s),_s.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(lE),ku.child=e,this.dispatchEvent(ku),ku.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),wi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),wi.multiply(e.parent.matrixWorld)),e.applyMatrix4(wi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(qm),_s.child=e,this.dispatchEvent(_s),_s.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,n);if(o!==void 0)return o}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Do,e,oE),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Do,aE,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];s(e.shapes,h)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(e.animations,l))}}if(n){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),h=o(e.shapes),d=o(e.skeletons),p=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),d.length>0&&(i.skeletons=d),p.length>0&&(i.animations=p),g.length>0&&(i.nodes=g)}return i.object=r,i;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}jt.DEFAULT_UP=new k(0,1,0);jt.DEFAULT_MATRIX_AUTO_UPDATE=!0;jt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Jn=new k,Ai=new k,Bu=new k,Ri=new k,vs=new k,xs=new k,Zm=new k,zu=new k,Hu=new k,Gu=new k,Vu=new At,Wu=new At,Xu=new At;class Vn{constructor(e=new k,n=new k,i=new k){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),Jn.subVectors(e,n),r.cross(Jn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){Jn.subVectors(r,n),Ai.subVectors(i,n),Bu.subVectors(e,n);const o=Jn.dot(Jn),a=Jn.dot(Ai),l=Jn.dot(Bu),c=Ai.dot(Ai),u=Ai.dot(Bu),h=o*c-a*a;if(h===0)return s.set(0,0,0),null;const d=1/h,p=(c*l-a*u)*d,g=(o*u-a*l)*d;return s.set(1-p-g,g,p)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,Ri)===null?!1:Ri.x>=0&&Ri.y>=0&&Ri.x+Ri.y<=1}static getInterpolation(e,n,i,r,s,o,a,l){return this.getBarycoord(e,n,i,r,Ri)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Ri.x),l.addScaledVector(o,Ri.y),l.addScaledVector(a,Ri.z),l)}static getInterpolatedAttribute(e,n,i,r,s,o){return Vu.setScalar(0),Wu.setScalar(0),Xu.setScalar(0),Vu.fromBufferAttribute(e,n),Wu.fromBufferAttribute(e,i),Xu.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(Vu,s.x),o.addScaledVector(Wu,s.y),o.addScaledVector(Xu,s.z),o}static isFrontFacing(e,n,i,r){return Jn.subVectors(i,n),Ai.subVectors(e,n),Jn.cross(Ai).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Jn.subVectors(this.c,this.b),Ai.subVectors(this.a,this.b),Jn.cross(Ai).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Vn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return Vn.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,r,s){return Vn.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return Vn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Vn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,r=this.b,s=this.c;let o,a;vs.subVectors(r,i),xs.subVectors(s,i),zu.subVectors(e,i);const l=vs.dot(zu),c=xs.dot(zu);if(l<=0&&c<=0)return n.copy(i);Hu.subVectors(e,r);const u=vs.dot(Hu),h=xs.dot(Hu);if(u>=0&&h<=u)return n.copy(r);const d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return o=l/(l-u),n.copy(i).addScaledVector(vs,o);Gu.subVectors(e,s);const p=vs.dot(Gu),g=xs.dot(Gu);if(g>=0&&p<=g)return n.copy(s);const v=p*c-l*g;if(v<=0&&c>=0&&g<=0)return a=c/(c-g),n.copy(i).addScaledVector(xs,a);const m=u*g-p*h;if(m<=0&&h-u>=0&&p-g>=0)return Zm.subVectors(s,r),a=(h-u)/(h-u+(p-g)),n.copy(r).addScaledVector(Zm,a);const f=1/(m+v+d);return o=v*f,a=d*f,n.copy(i).addScaledVector(vs,o).addScaledVector(xs,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Lv={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},er={h:0,s:0,l:0},ul={h:0,s:0,l:0};function ju(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class Le{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=Pn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ze.toWorkingColorSpace(this,n),this}setRGB(e,n,i,r=Ze.workingColorSpace){return this.r=e,this.g=n,this.b=i,Ze.toWorkingColorSpace(this,r),this}setHSL(e,n,i,r=Ze.workingColorSpace){if(e=tp(e,1),n=fn(n,0,1),i=fn(i,0,1),n===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+n):i+n-i*n,o=2*i-s;this.r=ju(o,s,e+1/3),this.g=ju(o,s,e),this.b=ju(o,s,e-1/3)}return Ze.toWorkingColorSpace(this,r),this}setStyle(e,n=Pn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(o===6)return this.setHex(parseInt(s,16),n);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=Pn){const i=Lv[e.toLowerCase()];return i!==void 0?this.setHex(i,n):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ki(e.r),this.g=ki(e.g),this.b=ki(e.b),this}copyLinearToSRGB(e){return this.r=Zs(e.r),this.g=Zs(e.g),this.b=Zs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Pn){return Ze.fromWorkingColorSpace(Qt.copy(this),e),Math.round(fn(Qt.r*255,0,255))*65536+Math.round(fn(Qt.g*255,0,255))*256+Math.round(fn(Qt.b*255,0,255))}getHexString(e=Pn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=Ze.workingColorSpace){Ze.fromWorkingColorSpace(Qt.copy(this),n);const i=Qt.r,r=Qt.g,s=Qt.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case i:l=(r-s)/h+(r<s?6:0);break;case r:l=(s-i)/h+2;break;case s:l=(i-r)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,n=Ze.workingColorSpace){return Ze.fromWorkingColorSpace(Qt.copy(this),n),e.r=Qt.r,e.g=Qt.g,e.b=Qt.b,e}getStyle(e=Pn){Ze.fromWorkingColorSpace(Qt.copy(this),e);const n=Qt.r,i=Qt.g,r=Qt.b;return e!==Pn?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(er),this.setHSL(er.h+e,er.s+n,er.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(er),e.getHSL(ul);const i=ia(er.h,ul.h,n),r=ia(er.s,ul.s,n),s=ia(er.l,ul.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Qt=new Le;Le.NAMES=Lv;let cE=0;class xo extends _o{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:cE++}),this.uuid=vo(),this.name="",this.blending=Ks,this.side=Vi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=lh,this.blendDst=ch,this.blendEquation=Hr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Le(0,0,0),this.blendAlpha=0,this.depthFunc=so,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Dm,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=us,this.stencilZFail=us,this.stencilZPass=us,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){console.warn(`THREE.Material: parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){console.warn(`THREE.Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Ks&&(i.blending=this.blending),this.side!==Vi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==lh&&(i.blendSrc=this.blendSrc),this.blendDst!==ch&&(i.blendDst=this.blendDst),this.blendEquation!==Hr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==so&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Dm&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==us&&(i.stencilFail=this.stencilFail),this.stencilZFail!==us&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==us&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(n){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class np extends xo{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new Le(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new vi,this.combine=Kd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Pt=new k,fl=new st;class nn{constructor(e,n,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=Nm,this.updateRanges=[],this.gpuType=Ui,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)fl.fromBufferAttribute(this,n),fl.applyMatrix3(e),this.setXY(n,fl.x,fl.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)Pt.fromBufferAttribute(this,n),Pt.applyMatrix3(e),this.setXYZ(n,Pt.x,Pt.y,Pt.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)Pt.fromBufferAttribute(this,n),Pt.applyMatrix4(e),this.setXYZ(n,Pt.x,Pt.y,Pt.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)Pt.fromBufferAttribute(this,n),Pt.applyNormalMatrix(e),this.setXYZ(n,Pt.x,Pt.y,Pt.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)Pt.fromBufferAttribute(this,n),Pt.transformDirection(e),this.setXYZ(n,Pt.x,Pt.y,Pt.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=Cs(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=ln(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=Cs(n,this.array)),n}setX(e,n){return this.normalized&&(n=ln(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=Cs(n,this.array)),n}setY(e,n){return this.normalized&&(n=ln(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=Cs(n,this.array)),n}setZ(e,n){return this.normalized&&(n=ln(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=Cs(n,this.array)),n}setW(e,n){return this.normalized&&(n=ln(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=ln(n,this.array),i=ln(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=ln(n,this.array),i=ln(i,this.array),r=ln(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=ln(n,this.array),i=ln(i,this.array),r=ln(r,this.array),s=ln(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Nm&&(e.usage=this.usage),e}}class Iv extends nn{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class Dv extends nn{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class _i extends nn{constructor(e,n,i){super(new Float32Array(e),n,i)}}let uE=0;const Bn=new Mt,Yu=new jt,ys=new k,Cn=new Na,No=new Na,Ft=new k;class yi extends _o{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:uE++}),this.uuid=vo(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Av(e)?Dv:Iv)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new ze().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Bn.makeRotationFromQuaternion(e),this.applyMatrix4(Bn),this}rotateX(e){return Bn.makeRotationX(e),this.applyMatrix4(Bn),this}rotateY(e){return Bn.makeRotationY(e),this.applyMatrix4(Bn),this}rotateZ(e){return Bn.makeRotationZ(e),this.applyMatrix4(Bn),this}translate(e,n,i){return Bn.makeTranslation(e,n,i),this.applyMatrix4(Bn),this}scale(e,n,i){return Bn.makeScale(e,n,i),this.applyMatrix4(Bn),this}lookAt(e){return Yu.lookAt(e),Yu.updateMatrix(),this.applyMatrix4(Yu.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ys).negate(),this.translate(ys.x,ys.y,ys.z),this}setFromPoints(e){const n=this.getAttribute("position");if(n===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new _i(i,3))}else{for(let i=0,r=n.count;i<r;i++){const s=e[i];n.setXYZ(i,s.x,s.y,s.z||0)}e.length>n.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Na);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new k(-1/0,-1/0,-1/0),new k(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){const s=n[i];Cn.setFromBufferAttribute(s),this.morphTargetsRelative?(Ft.addVectors(this.boundingBox.min,Cn.min),this.boundingBox.expandByPoint(Ft),Ft.addVectors(this.boundingBox.max,Cn.max),this.boundingBox.expandByPoint(Ft)):(this.boundingBox.expandByPoint(Cn.min),this.boundingBox.expandByPoint(Cn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ua);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new k,1/0);return}if(e){const i=this.boundingSphere.center;if(Cn.setFromBufferAttribute(e),n)for(let s=0,o=n.length;s<o;s++){const a=n[s];No.setFromBufferAttribute(a),this.morphTargetsRelative?(Ft.addVectors(Cn.min,No.min),Cn.expandByPoint(Ft),Ft.addVectors(Cn.max,No.max),Cn.expandByPoint(Ft)):(Cn.expandByPoint(No.min),Cn.expandByPoint(No.max))}Cn.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)Ft.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Ft));if(n)for(let s=0,o=n.length;s<o;s++){const a=n[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)Ft.fromBufferAttribute(a,c),l&&(ys.fromBufferAttribute(e,c),Ft.add(ys)),r=Math.max(r,i.distanceToSquared(Ft))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,r=n.normal,s=n.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new nn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let C=0;C<i.count;C++)a[C]=new k,l[C]=new k;const c=new k,u=new k,h=new k,d=new st,p=new st,g=new st,v=new k,m=new k;function f(C,T,S){c.fromBufferAttribute(i,C),u.fromBufferAttribute(i,T),h.fromBufferAttribute(i,S),d.fromBufferAttribute(s,C),p.fromBufferAttribute(s,T),g.fromBufferAttribute(s,S),u.sub(c),h.sub(c),p.sub(d),g.sub(d);const P=1/(p.x*g.y-g.x*p.y);isFinite(P)&&(v.copy(u).multiplyScalar(g.y).addScaledVector(h,-p.y).multiplyScalar(P),m.copy(h).multiplyScalar(p.x).addScaledVector(u,-g.x).multiplyScalar(P),a[C].add(v),a[T].add(v),a[S].add(v),l[C].add(m),l[T].add(m),l[S].add(m))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let C=0,T=_.length;C<T;++C){const S=_[C],P=S.start,j=S.count;for(let H=P,Y=P+j;H<Y;H+=3)f(e.getX(H+0),e.getX(H+1),e.getX(H+2))}const x=new k,y=new k,b=new k,A=new k;function R(C){b.fromBufferAttribute(r,C),A.copy(b);const T=a[C];x.copy(T),x.sub(b.multiplyScalar(b.dot(T))).normalize(),y.crossVectors(A,T);const P=y.dot(l[C])<0?-1:1;o.setXYZW(C,x.x,x.y,x.z,P)}for(let C=0,T=_.length;C<T;++C){const S=_[C],P=S.start,j=S.count;for(let H=P,Y=P+j;H<Y;H+=3)R(e.getX(H+0)),R(e.getX(H+1)),R(e.getX(H+2))}}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new nn(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let d=0,p=i.count;d<p;d++)i.setXYZ(d,0,0,0);const r=new k,s=new k,o=new k,a=new k,l=new k,c=new k,u=new k,h=new k;if(e)for(let d=0,p=e.count;d<p;d+=3){const g=e.getX(d+0),v=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(n,g),s.fromBufferAttribute(n,v),o.fromBufferAttribute(n,m),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),a.fromBufferAttribute(i,g),l.fromBufferAttribute(i,v),c.fromBufferAttribute(i,m),a.add(u),l.add(u),c.add(u),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,p=n.count;d<p;d+=3)r.fromBufferAttribute(n,d+0),s.fromBufferAttribute(n,d+1),o.fromBufferAttribute(n,d+2),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),i.setXYZ(d+0,u.x,u.y,u.z),i.setXYZ(d+1,u.x,u.y,u.z),i.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)Ft.fromBufferAttribute(e,n),Ft.normalize(),e.setXYZ(n,Ft.x,Ft.y,Ft.z)}toNonIndexed(){function e(a,l){const c=a.array,u=a.itemSize,h=a.normalized,d=new c.constructor(l.length*u);let p=0,g=0;for(let v=0,m=l.length;v<m;v++){a.isInterleavedBufferAttribute?p=l[v]*a.data.stride+a.offset:p=l[v]*u;for(let f=0;f<u;f++)d[g++]=c[p++]}return new nn(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new yi,i=this.index.array,r=this.attributes;for(const a in r){const l=r[a],c=e(l,i);n.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let u=0,h=c.length;u<h;u++){const d=c[u],p=e(d,i);l.push(p)}n.morphAttributes[a]=l}n.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];n.addGroup(c.start,c.count,c.materialIndex)}return n}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){const p=c[h];u.push(p.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(n));const r=e.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(n))}const s=e.morphAttributes;for(const c in s){const u=[],h=s[c];for(let d=0,p=h.length;d<p;d++)u.push(h[d].clone(n));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,u=o.length;c<u;c++){const h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Qm=new Mt,Cr=new bv,hl=new Ua,Jm=new k,dl=new k,pl=new k,ml=new k,Ku=new k,gl=new k,eg=new k,_l=new k;class Wt extends jt{constructor(e=new yi,n=new np){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,n){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;n.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){gl.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=a[l],h=s[l];u!==0&&(Ku.fromBufferAttribute(h,e),o?gl.addScaledVector(Ku,u):gl.addScaledVector(Ku.sub(n),u))}n.add(gl)}return n}raycast(e,n){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),hl.copy(i.boundingSphere),hl.applyMatrix4(s),Cr.copy(e.ray).recast(e.near),!(hl.containsPoint(Cr.origin)===!1&&(Cr.intersectSphere(hl,Jm)===null||Cr.origin.distanceToSquared(Jm)>(e.far-e.near)**2))&&(Qm.copy(s).invert(),Cr.copy(e.ray).applyMatrix4(Qm),!(i.boundingBox!==null&&Cr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,Cr)))}_computeIntersections(e,n,i){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,d=s.groups,p=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,v=d.length;g<v;g++){const m=d[g],f=o[m.materialIndex],_=Math.max(m.start,p.start),x=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let y=_,b=x;y<b;y+=3){const A=a.getX(y),R=a.getX(y+1),C=a.getX(y+2);r=vl(this,f,e,i,c,u,h,A,R,C),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const g=Math.max(0,p.start),v=Math.min(a.count,p.start+p.count);for(let m=g,f=v;m<f;m+=3){const _=a.getX(m),x=a.getX(m+1),y=a.getX(m+2);r=vl(this,o,e,i,c,u,h,_,x,y),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,v=d.length;g<v;g++){const m=d[g],f=o[m.materialIndex],_=Math.max(m.start,p.start),x=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let y=_,b=x;y<b;y+=3){const A=y,R=y+1,C=y+2;r=vl(this,f,e,i,c,u,h,A,R,C),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const g=Math.max(0,p.start),v=Math.min(l.count,p.start+p.count);for(let m=g,f=v;m<f;m+=3){const _=m,x=m+1,y=m+2;r=vl(this,o,e,i,c,u,h,_,x,y),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}}}function fE(t,e,n,i,r,s,o,a){let l;if(e.side===wn?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===Vi,a),l===null)return null;_l.copy(a),_l.applyMatrix4(t.matrixWorld);const c=n.ray.origin.distanceTo(_l);return c<n.near||c>n.far?null:{distance:c,point:_l.clone(),object:t}}function vl(t,e,n,i,r,s,o,a,l,c){t.getVertexPosition(a,dl),t.getVertexPosition(l,pl),t.getVertexPosition(c,ml);const u=fE(t,e,n,i,dl,pl,ml,eg);if(u){const h=new k;Vn.getBarycoord(eg,dl,pl,ml,h),r&&(u.uv=Vn.getInterpolatedAttribute(r,a,l,c,h,new st)),s&&(u.uv1=Vn.getInterpolatedAttribute(s,a,l,c,h,new st)),o&&(u.normal=Vn.getInterpolatedAttribute(o,a,l,c,h,new k),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const d={a,b:l,c,normal:new k,materialIndex:0};Vn.getNormal(dl,pl,ml,d.normal),u.face=d,u.barycoord=h}return u}class Xi extends yi{constructor(e=1,n=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],u=[],h=[];let d=0,p=0;g("z","y","x",-1,-1,i,n,e,o,s,0),g("z","y","x",1,-1,i,n,-e,o,s,1),g("x","z","y",1,1,e,i,n,r,o,2),g("x","z","y",1,-1,e,i,-n,r,o,3),g("x","y","z",1,-1,e,n,i,r,s,4),g("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new _i(c,3)),this.setAttribute("normal",new _i(u,3)),this.setAttribute("uv",new _i(h,2));function g(v,m,f,_,x,y,b,A,R,C,T){const S=y/R,P=b/C,j=y/2,H=b/2,Y=A/2,ee=R+1,X=C+1;let ie=0,L=0;const $=new k;for(let J=0;J<X;J++){const le=J*P-H;for(let we=0;we<ee;we++){const Je=we*S-j;$[v]=Je*_,$[m]=le*x,$[f]=Y,c.push($.x,$.y,$.z),$[v]=0,$[m]=0,$[f]=A>0?1:-1,u.push($.x,$.y,$.z),h.push(we/R),h.push(1-J/C),ie+=1}}for(let J=0;J<C;J++)for(let le=0;le<R;le++){const we=d+le+ee*J,Je=d+le+ee*(J+1),K=d+(le+1)+ee*(J+1),re=d+(le+1)+ee*J;l.push(we,Je,re),l.push(Je,K,re),L+=6}a.addGroup(p,L,T),p+=L,d+=ie}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Xi(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function uo(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const r=t[n][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone():Array.isArray(r)?e[n][i]=r.slice():e[n][i]=r}}return e}function cn(t){const e={};for(let n=0;n<t.length;n++){const i=uo(t[n]);for(const r in i)e[r]=i[r]}return e}function hE(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function Nv(t){const e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ze.workingColorSpace}const dE={clone:uo,merge:cn};var pE=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,mE=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class xi extends xo{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=pE,this.fragmentShader=mE,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=uo(e.uniforms),this.uniformsGroups=hE(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?n.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?n.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?n.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?n.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?n.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?n.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?n.uniforms[r]={type:"m4",value:o.toArray()}:n.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}}class Uv extends jt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Mt,this.projectionMatrix=new Mt,this.projectionMatrixInverse=new Mt,this.coordinateSystem=Oi}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,n){super.updateWorldMatrix(e,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const tr=new k,tg=new st,ng=new st;class Gn extends Uv{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=Ea*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(qs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ea*2*Math.atan(Math.tan(qs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){tr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(tr.x,tr.y).multiplyScalar(-e/tr.z),tr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(tr.x,tr.y).multiplyScalar(-e/tr.z)}getViewSize(e,n){return this.getViewBounds(e,tg,ng),n.subVectors(ng,tg)}setViewOffset(e,n,i,r,s,o){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(qs*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,n-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}const Ss=-90,Ms=1;class gE extends jt{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Gn(Ss,Ms,e,n);r.layers=this.layers,this.add(r);const s=new Gn(Ss,Ms,e,n);s.layers=this.layers,this.add(s);const o=new Gn(Ss,Ms,e,n);o.layers=this.layers,this.add(o);const a=new Gn(Ss,Ms,e,n);a.layers=this.layers,this.add(a);const l=new Gn(Ss,Ms,e,n);l.layers=this.layers,this.add(l);const c=new Gn(Ss,Ms,e,n);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,r,s,o,a,l]=n;for(const c of n)this.remove(c);if(e===Oi)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Cc)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of n)this.add(c),c.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,u]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(n,s),e.setRenderTarget(i,1,r),e.render(n,o),e.setRenderTarget(i,2,r),e.render(n,a),e.setRenderTarget(i,3,r),e.render(n,l),e.setRenderTarget(i,4,r),e.render(n,c),i.texture.generateMipmaps=v,e.setRenderTarget(i,5,r),e.render(n,u),e.setRenderTarget(h,d,p),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class Ov extends pn{constructor(e,n,i,r,s,o,a,l,c,u){e=e!==void 0?e:[],n=n!==void 0?n:oo,super(e,n,i,r,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class _E extends rs{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new Ov(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:pi}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Xi(5,5,5),s=new xi({name:"CubemapFromEquirect",uniforms:uo(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:wn,blending:_r});s.uniforms.tEquirect.value=n;const o=new Wt(r,s),a=n.minFilter;return n.minFilter===Kr&&(n.minFilter=pi),new gE(1,10,this).update(e,o),n.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,n,i,r){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(n,i,r);e.setRenderTarget(s)}}const $u=new k,vE=new k,xE=new ze;class kr{constructor(e=new k(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const r=$u.subVectors(i,n).cross(vE.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n){const i=e.delta($u),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:n.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||xE.getNormalMatrix(e),r=this.coplanarPoint($u).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const br=new Ua,xl=new k;class ip{constructor(e=new kr,n=new kr,i=new kr,r=new kr,s=new kr,o=new kr){this.planes=[e,n,i,r,s,o]}set(e,n,i,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(n),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=Oi){const i=this.planes,r=e.elements,s=r[0],o=r[1],a=r[2],l=r[3],c=r[4],u=r[5],h=r[6],d=r[7],p=r[8],g=r[9],v=r[10],m=r[11],f=r[12],_=r[13],x=r[14],y=r[15];if(i[0].setComponents(l-s,d-c,m-p,y-f).normalize(),i[1].setComponents(l+s,d+c,m+p,y+f).normalize(),i[2].setComponents(l+o,d+u,m+g,y+_).normalize(),i[3].setComponents(l-o,d-u,m-g,y-_).normalize(),i[4].setComponents(l-a,d-h,m-v,y-x).normalize(),n===Oi)i[5].setComponents(l+a,d+h,m+v,y+x).normalize();else if(n===Cc)i[5].setComponents(a,h,v,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),br.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),br.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(br)}intersectsSprite(e){return br.center.set(0,0,0),br.radius=.7071067811865476,br.applyMatrix4(e.matrixWorld),this.intersectsSphere(br)}intersectsSphere(e){const n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const r=n[i];if(xl.x=r.normal.x>0?e.max.x:e.min.x,xl.y=r.normal.y>0?e.max.y:e.min.y,xl.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(xl)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Fv(){let t=null,e=!1,n=null,i=null;function r(s,o){n(s,o),i=t.requestAnimationFrame(r)}return{start:function(){e!==!0&&n!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function yE(t){const e=new WeakMap;function n(a,l){const c=a.array,u=a.usage,h=c.byteLength,d=t.createBuffer();t.bindBuffer(l,d),t.bufferData(l,c,u),a.onUploadCallback();let p;if(c instanceof Float32Array)p=t.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=t.HALF_FLOAT:p=t.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=t.SHORT;else if(c instanceof Uint32Array)p=t.UNSIGNED_INT;else if(c instanceof Int32Array)p=t.INT;else if(c instanceof Int8Array)p=t.BYTE;else if(c instanceof Uint8Array)p=t.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function i(a,l,c){const u=l.array,h=l.updateRanges;if(t.bindBuffer(c,a),h.length===0)t.bufferSubData(c,0,u);else{h.sort((p,g)=>p.start-g.start);let d=0;for(let p=1;p<h.length;p++){const g=h[d],v=h[p];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++d,h[d]=v)}h.length=d+1;for(let p=0,g=h.length;p<g;p++){const v=h[p];t.bufferSubData(c,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(t.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=e.get(a);if(c===void 0)e.set(a,n(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}class Oa extends yi{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};const s=e/2,o=n/2,a=Math.floor(i),l=Math.floor(r),c=a+1,u=l+1,h=e/a,d=n/l,p=[],g=[],v=[],m=[];for(let f=0;f<u;f++){const _=f*d-o;for(let x=0;x<c;x++){const y=x*h-s;g.push(y,-_,0),v.push(0,0,1),m.push(x/a),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let _=0;_<a;_++){const x=_+c*f,y=_+c*(f+1),b=_+1+c*(f+1),A=_+1+c*f;p.push(x,y,A),p.push(y,b,A)}this.setIndex(p),this.setAttribute("position",new _i(g,3)),this.setAttribute("normal",new _i(v,3)),this.setAttribute("uv",new _i(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Oa(e.width,e.height,e.widthSegments,e.heightSegments)}}var SE=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ME=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,EE=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,TE=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,wE=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,AE=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,RE=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,CE=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,bE=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,PE=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,LE=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,IE=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,DE=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,NE=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,UE=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,OE=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,FE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,kE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,BE=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,zE=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,HE=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,GE=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,VE=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,WE=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,XE=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,jE=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,YE=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,KE=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,$E=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,qE=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,ZE="gl_FragColor = linearToOutputTexel( gl_FragColor );",QE=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,JE=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,e1=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,t1=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,n1=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,i1=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,r1=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,s1=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,o1=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,a1=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,l1=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,c1=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,u1=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,f1=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,h1=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,d1=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,p1=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,m1=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,g1=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,_1=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,v1=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,x1=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,y1=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,S1=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,M1=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,E1=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,T1=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,w1=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,A1=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,R1=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,C1=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,b1=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,P1=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,L1=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,I1=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,D1=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,N1=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,U1=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,O1=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,F1=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,k1=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,B1=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,z1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,H1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,G1=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,V1=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,W1=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,X1=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,j1=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Y1=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,K1=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,$1=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,q1=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Z1=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Q1=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,J1=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,eT=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,tT=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,nT=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,iT=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,rT=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,sT=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,oT=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,aT=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,lT=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,cT=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,uT=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,fT=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,hT=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,dT=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,pT=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,mT=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,gT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,_T=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,vT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,xT=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const yT=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ST=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,MT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ET=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,TT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,wT=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,AT=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,RT=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,CT=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,bT=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,PT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,LT=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,IT=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,DT=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,NT=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,UT=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,OT=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,FT=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,kT=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,BT=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zT=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,HT=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,GT=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,VT=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,WT=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,XT=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,jT=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,YT=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,KT=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,$T=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,qT=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ZT=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,QT=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,JT=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ge={alphahash_fragment:SE,alphahash_pars_fragment:ME,alphamap_fragment:EE,alphamap_pars_fragment:TE,alphatest_fragment:wE,alphatest_pars_fragment:AE,aomap_fragment:RE,aomap_pars_fragment:CE,batching_pars_vertex:bE,batching_vertex:PE,begin_vertex:LE,beginnormal_vertex:IE,bsdfs:DE,iridescence_fragment:NE,bumpmap_pars_fragment:UE,clipping_planes_fragment:OE,clipping_planes_pars_fragment:FE,clipping_planes_pars_vertex:kE,clipping_planes_vertex:BE,color_fragment:zE,color_pars_fragment:HE,color_pars_vertex:GE,color_vertex:VE,common:WE,cube_uv_reflection_fragment:XE,defaultnormal_vertex:jE,displacementmap_pars_vertex:YE,displacementmap_vertex:KE,emissivemap_fragment:$E,emissivemap_pars_fragment:qE,colorspace_fragment:ZE,colorspace_pars_fragment:QE,envmap_fragment:JE,envmap_common_pars_fragment:e1,envmap_pars_fragment:t1,envmap_pars_vertex:n1,envmap_physical_pars_fragment:d1,envmap_vertex:i1,fog_vertex:r1,fog_pars_vertex:s1,fog_fragment:o1,fog_pars_fragment:a1,gradientmap_pars_fragment:l1,lightmap_pars_fragment:c1,lights_lambert_fragment:u1,lights_lambert_pars_fragment:f1,lights_pars_begin:h1,lights_toon_fragment:p1,lights_toon_pars_fragment:m1,lights_phong_fragment:g1,lights_phong_pars_fragment:_1,lights_physical_fragment:v1,lights_physical_pars_fragment:x1,lights_fragment_begin:y1,lights_fragment_maps:S1,lights_fragment_end:M1,logdepthbuf_fragment:E1,logdepthbuf_pars_fragment:T1,logdepthbuf_pars_vertex:w1,logdepthbuf_vertex:A1,map_fragment:R1,map_pars_fragment:C1,map_particle_fragment:b1,map_particle_pars_fragment:P1,metalnessmap_fragment:L1,metalnessmap_pars_fragment:I1,morphinstance_vertex:D1,morphcolor_vertex:N1,morphnormal_vertex:U1,morphtarget_pars_vertex:O1,morphtarget_vertex:F1,normal_fragment_begin:k1,normal_fragment_maps:B1,normal_pars_fragment:z1,normal_pars_vertex:H1,normal_vertex:G1,normalmap_pars_fragment:V1,clearcoat_normal_fragment_begin:W1,clearcoat_normal_fragment_maps:X1,clearcoat_pars_fragment:j1,iridescence_pars_fragment:Y1,opaque_fragment:K1,packing:$1,premultiplied_alpha_fragment:q1,project_vertex:Z1,dithering_fragment:Q1,dithering_pars_fragment:J1,roughnessmap_fragment:eT,roughnessmap_pars_fragment:tT,shadowmap_pars_fragment:nT,shadowmap_pars_vertex:iT,shadowmap_vertex:rT,shadowmask_pars_fragment:sT,skinbase_vertex:oT,skinning_pars_vertex:aT,skinning_vertex:lT,skinnormal_vertex:cT,specularmap_fragment:uT,specularmap_pars_fragment:fT,tonemapping_fragment:hT,tonemapping_pars_fragment:dT,transmission_fragment:pT,transmission_pars_fragment:mT,uv_pars_fragment:gT,uv_pars_vertex:_T,uv_vertex:vT,worldpos_vertex:xT,background_vert:yT,background_frag:ST,backgroundCube_vert:MT,backgroundCube_frag:ET,cube_vert:TT,cube_frag:wT,depth_vert:AT,depth_frag:RT,distanceRGBA_vert:CT,distanceRGBA_frag:bT,equirect_vert:PT,equirect_frag:LT,linedashed_vert:IT,linedashed_frag:DT,meshbasic_vert:NT,meshbasic_frag:UT,meshlambert_vert:OT,meshlambert_frag:FT,meshmatcap_vert:kT,meshmatcap_frag:BT,meshnormal_vert:zT,meshnormal_frag:HT,meshphong_vert:GT,meshphong_frag:VT,meshphysical_vert:WT,meshphysical_frag:XT,meshtoon_vert:jT,meshtoon_frag:YT,points_vert:KT,points_frag:$T,shadow_vert:qT,shadow_frag:ZT,sprite_vert:QT,sprite_frag:JT},ce={common:{diffuse:{value:new Le(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ze}},envmap:{envMap:{value:null},envMapRotation:{value:new ze},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ze}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ze}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ze},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ze},normalScale:{value:new st(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ze},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ze}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ze}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ze}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Le(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Le(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0},uvTransform:{value:new ze}},sprite:{diffuse:{value:new Le(16777215)},opacity:{value:1},center:{value:new st(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}}},hi={basic:{uniforms:cn([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.fog]),vertexShader:Ge.meshbasic_vert,fragmentShader:Ge.meshbasic_frag},lambert:{uniforms:cn([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,ce.lights,{emissive:{value:new Le(0)}}]),vertexShader:Ge.meshlambert_vert,fragmentShader:Ge.meshlambert_frag},phong:{uniforms:cn([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,ce.lights,{emissive:{value:new Le(0)},specular:{value:new Le(1118481)},shininess:{value:30}}]),vertexShader:Ge.meshphong_vert,fragmentShader:Ge.meshphong_frag},standard:{uniforms:cn([ce.common,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.roughnessmap,ce.metalnessmap,ce.fog,ce.lights,{emissive:{value:new Le(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag},toon:{uniforms:cn([ce.common,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.gradientmap,ce.fog,ce.lights,{emissive:{value:new Le(0)}}]),vertexShader:Ge.meshtoon_vert,fragmentShader:Ge.meshtoon_frag},matcap:{uniforms:cn([ce.common,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,{matcap:{value:null}}]),vertexShader:Ge.meshmatcap_vert,fragmentShader:Ge.meshmatcap_frag},points:{uniforms:cn([ce.points,ce.fog]),vertexShader:Ge.points_vert,fragmentShader:Ge.points_frag},dashed:{uniforms:cn([ce.common,ce.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ge.linedashed_vert,fragmentShader:Ge.linedashed_frag},depth:{uniforms:cn([ce.common,ce.displacementmap]),vertexShader:Ge.depth_vert,fragmentShader:Ge.depth_frag},normal:{uniforms:cn([ce.common,ce.bumpmap,ce.normalmap,ce.displacementmap,{opacity:{value:1}}]),vertexShader:Ge.meshnormal_vert,fragmentShader:Ge.meshnormal_frag},sprite:{uniforms:cn([ce.sprite,ce.fog]),vertexShader:Ge.sprite_vert,fragmentShader:Ge.sprite_frag},background:{uniforms:{uvTransform:{value:new ze},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ge.background_vert,fragmentShader:Ge.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ze}},vertexShader:Ge.backgroundCube_vert,fragmentShader:Ge.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ge.cube_vert,fragmentShader:Ge.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ge.equirect_vert,fragmentShader:Ge.equirect_frag},distanceRGBA:{uniforms:cn([ce.common,ce.displacementmap,{referencePosition:{value:new k},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ge.distanceRGBA_vert,fragmentShader:Ge.distanceRGBA_frag},shadow:{uniforms:cn([ce.lights,ce.fog,{color:{value:new Le(0)},opacity:{value:1}}]),vertexShader:Ge.shadow_vert,fragmentShader:Ge.shadow_frag}};hi.physical={uniforms:cn([hi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ze},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ze},clearcoatNormalScale:{value:new st(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ze},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ze},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ze},sheen:{value:0},sheenColor:{value:new Le(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ze},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ze},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ze},transmissionSamplerSize:{value:new st},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ze},attenuationDistance:{value:0},attenuationColor:{value:new Le(0)},specularColor:{value:new Le(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ze},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ze},anisotropyVector:{value:new st},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ze}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag};const yl={r:0,b:0,g:0},Pr=new vi,ew=new Mt;function tw(t,e,n,i,r,s,o){const a=new Le(0);let l=s===!0?0:1,c,u,h=null,d=0,p=null;function g(_){let x=_.isScene===!0?_.background:null;return x&&x.isTexture&&(x=(_.backgroundBlurriness>0?n:e).get(x)),x}function v(_){let x=!1;const y=g(_);y===null?f(a,l):y&&y.isColor&&(f(y,1),x=!0);const b=t.xr.getEnvironmentBlendMode();b==="additive"?i.buffers.color.setClear(0,0,0,1,o):b==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(t.autoClear||x)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function m(_,x){const y=g(x);y&&(y.isCubeTexture||y.mapping===$c)?(u===void 0&&(u=new Wt(new Xi(1,1,1),new xi({name:"BackgroundCubeMaterial",uniforms:uo(hi.backgroundCube.uniforms),vertexShader:hi.backgroundCube.vertexShader,fragmentShader:hi.backgroundCube.fragmentShader,side:wn,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(b,A,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),Pr.copy(x.backgroundRotation),Pr.x*=-1,Pr.y*=-1,Pr.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(Pr.y*=-1,Pr.z*=-1),u.material.uniforms.envMap.value=y,u.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(ew.makeRotationFromEuler(Pr)),u.material.toneMapped=Ze.getTransfer(y.colorSpace)!==ct,(h!==y||d!==y.version||p!==t.toneMapping)&&(u.material.needsUpdate=!0,h=y,d=y.version,p=t.toneMapping),u.layers.enableAll(),_.unshift(u,u.geometry,u.material,0,0,null)):y&&y.isTexture&&(c===void 0&&(c=new Wt(new Oa(2,2),new xi({name:"BackgroundMaterial",uniforms:uo(hi.background.uniforms),vertexShader:hi.background.vertexShader,fragmentShader:hi.background.fragmentShader,side:Vi,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=y,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=Ze.getTransfer(y.colorSpace)!==ct,y.matrixAutoUpdate===!0&&y.updateMatrix(),c.material.uniforms.uvTransform.value.copy(y.matrix),(h!==y||d!==y.version||p!==t.toneMapping)&&(c.material.needsUpdate=!0,h=y,d=y.version,p=t.toneMapping),c.layers.enableAll(),_.unshift(c,c.geometry,c.material,0,0,null))}function f(_,x){_.getRGB(yl,Nv(t)),i.buffers.color.setClear(yl.r,yl.g,yl.b,x,o)}return{getClearColor:function(){return a},setClearColor:function(_,x=1){a.set(_),l=x,f(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(_){l=_,f(a,l)},render:v,addToRenderList:m}}function nw(t,e){const n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},r=d(null);let s=r,o=!1;function a(S,P,j,H,Y){let ee=!1;const X=h(H,j,P);s!==X&&(s=X,c(s.object)),ee=p(S,H,j,Y),ee&&g(S,H,j,Y),Y!==null&&e.update(Y,t.ELEMENT_ARRAY_BUFFER),(ee||o)&&(o=!1,y(S,P,j,H),Y!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(Y).buffer))}function l(){return t.createVertexArray()}function c(S){return t.bindVertexArray(S)}function u(S){return t.deleteVertexArray(S)}function h(S,P,j){const H=j.wireframe===!0;let Y=i[S.id];Y===void 0&&(Y={},i[S.id]=Y);let ee=Y[P.id];ee===void 0&&(ee={},Y[P.id]=ee);let X=ee[H];return X===void 0&&(X=d(l()),ee[H]=X),X}function d(S){const P=[],j=[],H=[];for(let Y=0;Y<n;Y++)P[Y]=0,j[Y]=0,H[Y]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:j,attributeDivisors:H,object:S,attributes:{},index:null}}function p(S,P,j,H){const Y=s.attributes,ee=P.attributes;let X=0;const ie=j.getAttributes();for(const L in ie)if(ie[L].location>=0){const J=Y[L];let le=ee[L];if(le===void 0&&(L==="instanceMatrix"&&S.instanceMatrix&&(le=S.instanceMatrix),L==="instanceColor"&&S.instanceColor&&(le=S.instanceColor)),J===void 0||J.attribute!==le||le&&J.data!==le.data)return!0;X++}return s.attributesNum!==X||s.index!==H}function g(S,P,j,H){const Y={},ee=P.attributes;let X=0;const ie=j.getAttributes();for(const L in ie)if(ie[L].location>=0){let J=ee[L];J===void 0&&(L==="instanceMatrix"&&S.instanceMatrix&&(J=S.instanceMatrix),L==="instanceColor"&&S.instanceColor&&(J=S.instanceColor));const le={};le.attribute=J,J&&J.data&&(le.data=J.data),Y[L]=le,X++}s.attributes=Y,s.attributesNum=X,s.index=H}function v(){const S=s.newAttributes;for(let P=0,j=S.length;P<j;P++)S[P]=0}function m(S){f(S,0)}function f(S,P){const j=s.newAttributes,H=s.enabledAttributes,Y=s.attributeDivisors;j[S]=1,H[S]===0&&(t.enableVertexAttribArray(S),H[S]=1),Y[S]!==P&&(t.vertexAttribDivisor(S,P),Y[S]=P)}function _(){const S=s.newAttributes,P=s.enabledAttributes;for(let j=0,H=P.length;j<H;j++)P[j]!==S[j]&&(t.disableVertexAttribArray(j),P[j]=0)}function x(S,P,j,H,Y,ee,X){X===!0?t.vertexAttribIPointer(S,P,j,Y,ee):t.vertexAttribPointer(S,P,j,H,Y,ee)}function y(S,P,j,H){v();const Y=H.attributes,ee=j.getAttributes(),X=P.defaultAttributeValues;for(const ie in ee){const L=ee[ie];if(L.location>=0){let $=Y[ie];if($===void 0&&(ie==="instanceMatrix"&&S.instanceMatrix&&($=S.instanceMatrix),ie==="instanceColor"&&S.instanceColor&&($=S.instanceColor)),$!==void 0){const J=$.normalized,le=$.itemSize,we=e.get($);if(we===void 0)continue;const Je=we.buffer,K=we.type,re=we.bytesPerElement,_e=K===t.INT||K===t.UNSIGNED_INT||$.gpuType===$d;if($.isInterleavedBufferAttribute){const ae=$.data,De=ae.stride,Fe=$.offset;if(ae.isInstancedInterleavedBuffer){for(let We=0;We<L.locationSize;We++)f(L.location+We,ae.meshPerAttribute);S.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let We=0;We<L.locationSize;We++)m(L.location+We);t.bindBuffer(t.ARRAY_BUFFER,Je);for(let We=0;We<L.locationSize;We++)x(L.location+We,le/L.locationSize,K,J,De*re,(Fe+le/L.locationSize*We)*re,_e)}else{if($.isInstancedBufferAttribute){for(let ae=0;ae<L.locationSize;ae++)f(L.location+ae,$.meshPerAttribute);S.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let ae=0;ae<L.locationSize;ae++)m(L.location+ae);t.bindBuffer(t.ARRAY_BUFFER,Je);for(let ae=0;ae<L.locationSize;ae++)x(L.location+ae,le/L.locationSize,K,J,le*re,le/L.locationSize*ae*re,_e)}}else if(X!==void 0){const J=X[ie];if(J!==void 0)switch(J.length){case 2:t.vertexAttrib2fv(L.location,J);break;case 3:t.vertexAttrib3fv(L.location,J);break;case 4:t.vertexAttrib4fv(L.location,J);break;default:t.vertexAttrib1fv(L.location,J)}}}}_()}function b(){C();for(const S in i){const P=i[S];for(const j in P){const H=P[j];for(const Y in H)u(H[Y].object),delete H[Y];delete P[j]}delete i[S]}}function A(S){if(i[S.id]===void 0)return;const P=i[S.id];for(const j in P){const H=P[j];for(const Y in H)u(H[Y].object),delete H[Y];delete P[j]}delete i[S.id]}function R(S){for(const P in i){const j=i[P];if(j[S.id]===void 0)continue;const H=j[S.id];for(const Y in H)u(H[Y].object),delete H[Y];delete j[S.id]}}function C(){T(),o=!0,s!==r&&(s=r,c(s.object))}function T(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:C,resetDefaultState:T,dispose:b,releaseStatesOfGeometry:A,releaseStatesOfProgram:R,initAttributes:v,enableAttribute:m,disableUnusedAttributes:_}}function iw(t,e,n){let i;function r(c){i=c}function s(c,u){t.drawArrays(i,c,u),n.update(u,i,1)}function o(c,u,h){h!==0&&(t.drawArraysInstanced(i,c,u,h),n.update(u,i,h))}function a(c,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,h);let p=0;for(let g=0;g<h;g++)p+=u[g];n.update(p,i,1)}function l(c,u,h,d){if(h===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)o(c[g],u[g],d[g]);else{p.multiDrawArraysInstancedWEBGL(i,c,0,u,0,d,0,h);let g=0;for(let v=0;v<h;v++)g+=u[v]*d[v];n.update(g,i,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function rw(t,e,n,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");r=t.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(R){return!(R!==ri&&i.convert(R)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(R){const C=R===Ia&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==Wi&&i.convert(R)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==Ui&&!C)}function l(R){if(R==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=n.precision!==void 0?n.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=n.logarithmicDepthBuffer===!0,d=n.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),p=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),g=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=t.getParameter(t.MAX_TEXTURE_SIZE),m=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),f=t.getParameter(t.MAX_VERTEX_ATTRIBS),_=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),x=t.getParameter(t.MAX_VARYING_VECTORS),y=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),b=g>0,A=t.getParameter(t.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reverseDepthBuffer:d,maxTextures:p,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:_,maxVaryings:x,maxFragmentUniforms:y,vertexTextures:b,maxSamples:A}}function sw(t){const e=this;let n=null,i=0,r=!1,s=!1;const o=new kr,a=new ze,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const p=h.length!==0||d||i!==0||r;return r=d,i=h.length,p},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,d){n=u(h,d,0)},this.setState=function(h,d,p){const g=h.clippingPlanes,v=h.clipIntersection,m=h.clipShadows,f=t.get(h);if(!r||g===null||g.length===0||s&&!m)s?u(null):c();else{const _=s?0:i,x=_*4;let y=f.clippingState||null;l.value=y,y=u(g,d,x,p);for(let b=0;b!==x;++b)y[b]=n[b];f.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=_}};function c(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(h,d,p,g){const v=h!==null?h.length:0;let m=null;if(v!==0){if(m=l.value,g!==!0||m===null){const f=p+v*4,_=d.matrixWorldInverse;a.getNormalMatrix(_),(m===null||m.length<f)&&(m=new Float32Array(f));for(let x=0,y=p;x!==v;++x,y+=4)o.copy(h[x]).applyMatrix4(_,a),o.normal.toArray(m,y),m[y+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}function ow(t){let e=new WeakMap;function n(o,a){return a===_h?o.mapping=oo:a===vh&&(o.mapping=ao),o}function i(o){if(o&&o.isTexture){const a=o.mapping;if(a===_h||a===vh)if(e.has(o)){const l=e.get(o).texture;return n(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new _E(l.height);return c.fromEquirectangularTexture(t,o),e.set(o,c),o.addEventListener("dispose",r),n(c.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class kv extends Uv{constructor(e=-1,n=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,a=r+n,l=r-n;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}const Hs=4,ig=[.125,.215,.35,.446,.526,.582],Gr=20,qu=new kv,rg=new Le;let Zu=null,Qu=0,Ju=0,ef=!1;const Br=(1+Math.sqrt(5))/2,Es=1/Br,sg=[new k(-Br,Es,0),new k(Br,Es,0),new k(-Es,0,Br),new k(Es,0,Br),new k(0,Br,-Es),new k(0,Br,Es),new k(-1,1,-1),new k(1,1,-1),new k(-1,1,1),new k(1,1,1)];class og{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,n=0,i=.1,r=100){Zu=this._renderer.getRenderTarget(),Qu=this._renderer.getActiveCubeFace(),Ju=this._renderer.getActiveMipmapLevel(),ef=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),n>0&&this._blur(s,0,0,n),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=cg(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=lg(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Zu,Qu,Ju),this._renderer.xr.enabled=ef,e.scissorTest=!1,Sl(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===oo||e.mapping===ao?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Zu=this._renderer.getRenderTarget(),Qu=this._renderer.getActiveCubeFace(),Ju=this._renderer.getActiveMipmapLevel(),ef=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:pi,minFilter:pi,generateMipmaps:!1,type:Ia,format:ri,colorSpace:go,depthBuffer:!1},r=ag(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ag(e,n,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=aw(s)),this._blurMaterial=lw(s,e,n)}return r}_compileMaterial(e){const n=new Wt(this._lodPlanes[0],e);this._renderer.compile(n,qu)}_sceneToCubeUV(e,n,i,r){const a=new Gn(90,1,n,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,d=u.toneMapping;u.getClearColor(rg),u.toneMapping=vr,u.autoClear=!1;const p=new np({name:"PMREM.Background",side:wn,depthWrite:!1,depthTest:!1}),g=new Wt(new Xi,p);let v=!1;const m=e.background;m?m.isColor&&(p.color.copy(m),e.background=null,v=!0):(p.color.copy(rg),v=!0);for(let f=0;f<6;f++){const _=f%3;_===0?(a.up.set(0,l[f],0),a.lookAt(c[f],0,0)):_===1?(a.up.set(0,0,l[f]),a.lookAt(0,c[f],0)):(a.up.set(0,l[f],0),a.lookAt(0,0,c[f]));const x=this._cubeSize;Sl(r,_*x,f>2?x:0,x,x),u.setRenderTarget(r),v&&u.render(g,a),u.render(e,a)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=d,u.autoClear=h,e.background=m}_textureToCubeUV(e,n){const i=this._renderer,r=e.mapping===oo||e.mapping===ao;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=cg()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=lg());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new Wt(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;const l=this._cubeSize;Sl(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(o,qu)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=sg[(r-s-1)%sg.length];this._blur(e,s-1,s,o,a)}n.autoClear=i}_blur(e,n,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,n,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,n,i,r,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new Wt(this._lodPlanes[r],c),d=c.uniforms,p=this._sizeLods[i]-1,g=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*Gr-1),v=s/g,m=isFinite(s)?1+Math.floor(u*v):Gr;m>Gr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Gr}`);const f=[];let _=0;for(let R=0;R<Gr;++R){const C=R/v,T=Math.exp(-C*C/2);f.push(T),R===0?_+=T:R<m&&(_+=2*T)}for(let R=0;R<f.length;R++)f[R]=f[R]/_;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=f,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:x}=this;d.dTheta.value=g,d.mipInt.value=x-i;const y=this._sizeLods[r],b=3*y*(r>x-Hs?r-x+Hs:0),A=4*(this._cubeSize-y);Sl(n,b,A,3*y,2*y),l.setRenderTarget(n),l.render(h,qu)}}function aw(t){const e=[],n=[],i=[];let r=t;const s=t-Hs+1+ig.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);n.push(a);let l=1/a;o>t-Hs?l=ig[o-t+Hs-1]:o===0&&(l=0),i.push(l);const c=1/(a-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],p=6,g=6,v=3,m=2,f=1,_=new Float32Array(v*g*p),x=new Float32Array(m*g*p),y=new Float32Array(f*g*p);for(let A=0;A<p;A++){const R=A%3*2/3-1,C=A>2?0:-1,T=[R,C,0,R+2/3,C,0,R+2/3,C+1,0,R,C,0,R+2/3,C+1,0,R,C+1,0];_.set(T,v*g*A),x.set(d,m*g*A);const S=[A,A,A,A,A,A];y.set(S,f*g*A)}const b=new yi;b.setAttribute("position",new nn(_,v)),b.setAttribute("uv",new nn(x,m)),b.setAttribute("faceIndex",new nn(y,f)),e.push(b),r>Hs&&r--}return{lodPlanes:e,sizeLods:n,sigmas:i}}function ag(t,e,n){const i=new rs(t,e,n);return i.texture.mapping=$c,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Sl(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function lw(t,e,n){const i=new Float32Array(Gr),r=new k(0,1,0);return new xi({name:"SphericalGaussianBlur",defines:{n:Gr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:rp(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:_r,depthTest:!1,depthWrite:!1})}function lg(){return new xi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:rp(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:_r,depthTest:!1,depthWrite:!1})}function cg(){return new xi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:rp(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:_r,depthTest:!1,depthWrite:!1})}function rp(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function cw(t){let e=new WeakMap,n=null;function i(a){if(a&&a.isTexture){const l=a.mapping,c=l===_h||l===vh,u=l===oo||l===ao;if(c||u){let h=e.get(a);const d=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return n===null&&(n=new og(t)),h=c?n.fromEquirectangular(a,h):n.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),h.texture;if(h!==void 0)return h.texture;{const p=a.image;return c&&p&&p.height>0||u&&p&&r(p)?(n===null&&(n=new og(t)),h=c?n.fromEquirectangular(a):n.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),a.addEventListener("dispose",s),h.texture):null}}}return a}function r(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:o}}function uw(t){const e={};function n(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=t.getExtension("WEBGL_depth_texture")||t.getExtension("MOZ_WEBGL_depth_texture")||t.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=t.getExtension("EXT_texture_filter_anisotropic")||t.getExtension("MOZ_EXT_texture_filter_anisotropic")||t.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=t.getExtension("WEBGL_compressed_texture_s3tc")||t.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=t.getExtension("WEBGL_compressed_texture_pvrtc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=t.getExtension(i)}return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const r=n(i);return r===null&&Go("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function fw(t,e,n,i){const r={},s=new WeakMap;function o(h){const d=h.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);for(const g in d.morphAttributes){const v=d.morphAttributes[g];for(let m=0,f=v.length;m<f;m++)e.remove(v[m])}d.removeEventListener("dispose",o),delete r[d.id];const p=s.get(d);p&&(e.remove(p),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,n.memory.geometries--}function a(h,d){return r[d.id]===!0||(d.addEventListener("dispose",o),r[d.id]=!0,n.memory.geometries++),d}function l(h){const d=h.attributes;for(const g in d)e.update(d[g],t.ARRAY_BUFFER);const p=h.morphAttributes;for(const g in p){const v=p[g];for(let m=0,f=v.length;m<f;m++)e.update(v[m],t.ARRAY_BUFFER)}}function c(h){const d=[],p=h.index,g=h.attributes.position;let v=0;if(p!==null){const _=p.array;v=p.version;for(let x=0,y=_.length;x<y;x+=3){const b=_[x+0],A=_[x+1],R=_[x+2];d.push(b,A,A,R,R,b)}}else if(g!==void 0){const _=g.array;v=g.version;for(let x=0,y=_.length/3-1;x<y;x+=3){const b=x+0,A=x+1,R=x+2;d.push(b,A,A,R,R,b)}}else return;const m=new(Av(d)?Dv:Iv)(d,1);m.version=v;const f=s.get(h);f&&e.remove(f),s.set(h,m)}function u(h){const d=s.get(h);if(d){const p=h.index;p!==null&&d.version<p.version&&c(h)}else c(h);return s.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function hw(t,e,n){let i;function r(d){i=d}let s,o;function a(d){s=d.type,o=d.bytesPerElement}function l(d,p){t.drawElements(i,p,s,d*o),n.update(p,i,1)}function c(d,p,g){g!==0&&(t.drawElementsInstanced(i,p,s,d*o,g),n.update(p,i,g))}function u(d,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,s,d,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];n.update(m,i,1)}function h(d,p,g,v){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<d.length;f++)c(d[f]/o,p[f],v[f]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,s,d,0,v,0,g);let f=0;for(let _=0;_<g;_++)f+=p[_]*v[_];n.update(f,i,1)}}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function dw(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(n.calls++,o){case t.TRIANGLES:n.triangles+=a*(s/3);break;case t.LINES:n.lines+=a*(s/2);break;case t.LINE_STRIP:n.lines+=a*(s-1);break;case t.LINE_LOOP:n.lines+=a*s;break;case t.POINTS:n.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function pw(t,e,n){const i=new WeakMap,r=new At;function s(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0;let d=i.get(a);if(d===void 0||d.count!==h){let T=function(){R.dispose(),i.delete(a),a.removeEventListener("dispose",T)};d!==void 0&&d.texture.dispose();const p=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,v=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],f=a.morphAttributes.normal||[],_=a.morphAttributes.color||[];let x=0;p===!0&&(x=1),g===!0&&(x=2),v===!0&&(x=3);let y=a.attributes.position.count*x,b=1;y>e.maxTextureSize&&(b=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);const A=new Float32Array(y*b*4*h),R=new Cv(A,y,b,h);R.type=Ui,R.needsUpdate=!0;const C=x*4;for(let S=0;S<h;S++){const P=m[S],j=f[S],H=_[S],Y=y*b*4*S;for(let ee=0;ee<P.count;ee++){const X=ee*C;p===!0&&(r.fromBufferAttribute(P,ee),A[Y+X+0]=r.x,A[Y+X+1]=r.y,A[Y+X+2]=r.z,A[Y+X+3]=0),g===!0&&(r.fromBufferAttribute(j,ee),A[Y+X+4]=r.x,A[Y+X+5]=r.y,A[Y+X+6]=r.z,A[Y+X+7]=0),v===!0&&(r.fromBufferAttribute(H,ee),A[Y+X+8]=r.x,A[Y+X+9]=r.y,A[Y+X+10]=r.z,A[Y+X+11]=H.itemSize===4?r.w:1)}}d={count:h,texture:R,size:new st(y,b)},i.set(a,d),a.addEventListener("dispose",T)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(t,"morphTexture",o.morphTexture,n);else{let p=0;for(let v=0;v<c.length;v++)p+=c[v];const g=a.morphTargetsRelative?1:1-p;l.getUniforms().setValue(t,"morphTargetBaseInfluence",g),l.getUniforms().setValue(t,"morphTargetInfluences",c)}l.getUniforms().setValue(t,"morphTargetsTexture",d.texture,n),l.getUniforms().setValue(t,"morphTargetsTextureSize",d.size)}return{update:s}}function mw(t,e,n,i){let r=new WeakMap;function s(l){const c=i.render.frame,u=l.geometry,h=e.get(l,u);if(r.get(h)!==c&&(e.update(h),r.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),r.get(l)!==c&&(n.update(l.instanceMatrix,t.ARRAY_BUFFER),l.instanceColor!==null&&n.update(l.instanceColor,t.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;r.get(d)!==c&&(d.update(),r.set(d,c))}return h}function o(){r=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),n.remove(c.instanceMatrix),c.instanceColor!==null&&n.remove(c.instanceColor)}return{update:s,dispose:o}}class Bv extends pn{constructor(e,n,i,r,s,o,a,l,c,u=$s){if(u!==$s&&u!==co)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&u===$s&&(i=is),i===void 0&&u===co&&(i=lo),super(null,r,s,o,a,l,u,i,c),this.isDepthTexture=!0,this.image={width:e,height:n},this.magFilter=a!==void 0?a:dn,this.minFilter=l!==void 0?l:dn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}const zv=new pn,ug=new Bv(1,1),Hv=new Cv,Gv=new tE,Vv=new Ov,fg=[],hg=[],dg=new Float32Array(16),pg=new Float32Array(9),mg=new Float32Array(4);function yo(t,e,n){const i=t[0];if(i<=0||i>0)return t;const r=e*n;let s=fg[r];if(s===void 0&&(s=new Float32Array(r),fg[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=n,t[o].toArray(s,a)}return s}function Ut(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function Ot(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function Zc(t,e){let n=hg[e];n===void 0&&(n=new Int32Array(e),hg[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function gw(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function _w(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Ut(n,e))return;t.uniform2fv(this.addr,e),Ot(n,e)}}function vw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(Ut(n,e))return;t.uniform3fv(this.addr,e),Ot(n,e)}}function xw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Ut(n,e))return;t.uniform4fv(this.addr,e),Ot(n,e)}}function yw(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Ut(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),Ot(n,e)}else{if(Ut(n,i))return;mg.set(i),t.uniformMatrix2fv(this.addr,!1,mg),Ot(n,i)}}function Sw(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Ut(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),Ot(n,e)}else{if(Ut(n,i))return;pg.set(i),t.uniformMatrix3fv(this.addr,!1,pg),Ot(n,i)}}function Mw(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Ut(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),Ot(n,e)}else{if(Ut(n,i))return;dg.set(i),t.uniformMatrix4fv(this.addr,!1,dg),Ot(n,i)}}function Ew(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function Tw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Ut(n,e))return;t.uniform2iv(this.addr,e),Ot(n,e)}}function ww(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Ut(n,e))return;t.uniform3iv(this.addr,e),Ot(n,e)}}function Aw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Ut(n,e))return;t.uniform4iv(this.addr,e),Ot(n,e)}}function Rw(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function Cw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Ut(n,e))return;t.uniform2uiv(this.addr,e),Ot(n,e)}}function bw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Ut(n,e))return;t.uniform3uiv(this.addr,e),Ot(n,e)}}function Pw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Ut(n,e))return;t.uniform4uiv(this.addr,e),Ot(n,e)}}function Lw(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r);let s;this.type===t.SAMPLER_2D_SHADOW?(ug.compareFunction=wv,s=ug):s=zv,n.setTexture2D(e||s,r)}function Iw(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||Gv,r)}function Dw(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||Vv,r)}function Nw(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||Hv,r)}function Uw(t){switch(t){case 5126:return gw;case 35664:return _w;case 35665:return vw;case 35666:return xw;case 35674:return yw;case 35675:return Sw;case 35676:return Mw;case 5124:case 35670:return Ew;case 35667:case 35671:return Tw;case 35668:case 35672:return ww;case 35669:case 35673:return Aw;case 5125:return Rw;case 36294:return Cw;case 36295:return bw;case 36296:return Pw;case 35678:case 36198:case 36298:case 36306:case 35682:return Lw;case 35679:case 36299:case 36307:return Iw;case 35680:case 36300:case 36308:case 36293:return Dw;case 36289:case 36303:case 36311:case 36292:return Nw}}function Ow(t,e){t.uniform1fv(this.addr,e)}function Fw(t,e){const n=yo(e,this.size,2);t.uniform2fv(this.addr,n)}function kw(t,e){const n=yo(e,this.size,3);t.uniform3fv(this.addr,n)}function Bw(t,e){const n=yo(e,this.size,4);t.uniform4fv(this.addr,n)}function zw(t,e){const n=yo(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function Hw(t,e){const n=yo(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function Gw(t,e){const n=yo(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function Vw(t,e){t.uniform1iv(this.addr,e)}function Ww(t,e){t.uniform2iv(this.addr,e)}function Xw(t,e){t.uniform3iv(this.addr,e)}function jw(t,e){t.uniform4iv(this.addr,e)}function Yw(t,e){t.uniform1uiv(this.addr,e)}function Kw(t,e){t.uniform2uiv(this.addr,e)}function $w(t,e){t.uniform3uiv(this.addr,e)}function qw(t,e){t.uniform4uiv(this.addr,e)}function Zw(t,e,n){const i=this.cache,r=e.length,s=Zc(n,r);Ut(i,s)||(t.uniform1iv(this.addr,s),Ot(i,s));for(let o=0;o!==r;++o)n.setTexture2D(e[o]||zv,s[o])}function Qw(t,e,n){const i=this.cache,r=e.length,s=Zc(n,r);Ut(i,s)||(t.uniform1iv(this.addr,s),Ot(i,s));for(let o=0;o!==r;++o)n.setTexture3D(e[o]||Gv,s[o])}function Jw(t,e,n){const i=this.cache,r=e.length,s=Zc(n,r);Ut(i,s)||(t.uniform1iv(this.addr,s),Ot(i,s));for(let o=0;o!==r;++o)n.setTextureCube(e[o]||Vv,s[o])}function eA(t,e,n){const i=this.cache,r=e.length,s=Zc(n,r);Ut(i,s)||(t.uniform1iv(this.addr,s),Ot(i,s));for(let o=0;o!==r;++o)n.setTexture2DArray(e[o]||Hv,s[o])}function tA(t){switch(t){case 5126:return Ow;case 35664:return Fw;case 35665:return kw;case 35666:return Bw;case 35674:return zw;case 35675:return Hw;case 35676:return Gw;case 5124:case 35670:return Vw;case 35667:case 35671:return Ww;case 35668:case 35672:return Xw;case 35669:case 35673:return jw;case 5125:return Yw;case 36294:return Kw;case 36295:return $w;case 36296:return qw;case 35678:case 36198:case 36298:case 36306:case 35682:return Zw;case 35679:case 36299:case 36307:return Qw;case 35680:case 36300:case 36308:case 36293:return Jw;case 36289:case 36303:case 36311:case 36292:return eA}}class nA{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=Uw(n.type)}}class iA{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=tA(n.type)}}class rA{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,n[a.id],i)}}}const tf=/(\w+)(\])?(\[|\.)?/g;function gg(t,e){t.seq.push(e),t.map[e.id]=e}function sA(t,e,n){const i=t.name,r=i.length;for(tf.lastIndex=0;;){const s=tf.exec(i),o=tf.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){gg(n,c===void 0?new nA(a,t,e):new iA(a,t,e));break}else{let h=n.map[a];h===void 0&&(h=new rA(a),gg(n,h)),n=h}}}class ec{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(n,r),o=e.getUniformLocation(n,s.name);sA(s,o,this)}}setValue(e,n,i,r){const s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){const r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,o=n.length;s!==o;++s){const a=n[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,n){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in n&&i.push(o)}return i}}function _g(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const oA=37297;let aA=0;function lA(t,e){const n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${n[o]}`)}return i.join(`
`)}const vg=new ze;function cA(t){Ze._getMatrix(vg,Ze.workingColorSpace,t);const e=`mat3( ${vg.elements.map(n=>n.toFixed(4))} )`;switch(Ze.getTransfer(t)){case qc:return[e,"LinearTransferOETF"];case ct:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",t),[e,"LinearTransferOETF"]}}function xg(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),r=t.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const o=parseInt(s[1]);return n.toUpperCase()+`

`+r+`

`+lA(t.getShaderSource(e),o)}else return r}function uA(t,e){const n=cA(e);return[`vec4 ${t}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}function fA(t,e){let n;switch(e){case hM:n="Linear";break;case dM:n="Reinhard";break;case pM:n="Cineon";break;case mM:n="ACESFilmic";break;case _M:n="AgX";break;case vM:n="Neutral";break;case gM:n="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),n="Linear"}return"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const Ml=new k;function hA(){Ze.getLuminanceCoefficients(Ml);const t=Ml.x.toFixed(4),e=Ml.y.toFixed(4),n=Ml.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function dA(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Vo).join(`
`)}function pA(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function mA(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=t.getActiveAttrib(e,r),o=s.name;let a=1;s.type===t.FLOAT_MAT2&&(a=2),s.type===t.FLOAT_MAT3&&(a=3),s.type===t.FLOAT_MAT4&&(a=4),n[o]={type:s.type,location:t.getAttribLocation(e,o),locationSize:a}}return n}function Vo(t){return t!==""}function yg(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Sg(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const gA=/^[ \t]*#include +<([\w\d./]+)>/gm;function Yh(t){return t.replace(gA,vA)}const _A=new Map;function vA(t,e){let n=Ge[e];if(n===void 0){const i=_A.get(e);if(i!==void 0)n=Ge[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Yh(n)}const xA=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Mg(t){return t.replace(xA,yA)}function yA(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Eg(t){let e=`precision ${t.precision} float;
	precision ${t.precision} int;
	precision ${t.precision} sampler2D;
	precision ${t.precision} samplerCube;
	precision ${t.precision} sampler3D;
	precision ${t.precision} sampler2DArray;
	precision ${t.precision} sampler2DShadow;
	precision ${t.precision} samplerCubeShadow;
	precision ${t.precision} sampler2DArrayShadow;
	precision ${t.precision} isampler2D;
	precision ${t.precision} isampler3D;
	precision ${t.precision} isamplerCube;
	precision ${t.precision} isampler2DArray;
	precision ${t.precision} usampler2D;
	precision ${t.precision} usampler3D;
	precision ${t.precision} usamplerCube;
	precision ${t.precision} usampler2DArray;
	`;return t.precision==="highp"?e+=`
#define HIGH_PRECISION`:t.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:t.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function SA(t){let e="SHADOWMAP_TYPE_BASIC";return t.shadowMapType===hv?e="SHADOWMAP_TYPE_PCF":t.shadowMapType===XS?e="SHADOWMAP_TYPE_PCF_SOFT":t.shadowMapType===Ci&&(e="SHADOWMAP_TYPE_VSM"),e}function MA(t){let e="ENVMAP_TYPE_CUBE";if(t.envMap)switch(t.envMapMode){case oo:case ao:e="ENVMAP_TYPE_CUBE";break;case $c:e="ENVMAP_TYPE_CUBE_UV";break}return e}function EA(t){let e="ENVMAP_MODE_REFLECTION";if(t.envMap)switch(t.envMapMode){case ao:e="ENVMAP_MODE_REFRACTION";break}return e}function TA(t){let e="ENVMAP_BLENDING_NONE";if(t.envMap)switch(t.combine){case Kd:e="ENVMAP_BLENDING_MULTIPLY";break;case uM:e="ENVMAP_BLENDING_MIX";break;case fM:e="ENVMAP_BLENDING_ADD";break}return e}function wA(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),7*16)),texelHeight:i,maxMip:n}}function AA(t,e,n,i){const r=t.getContext(),s=n.defines;let o=n.vertexShader,a=n.fragmentShader;const l=SA(n),c=MA(n),u=EA(n),h=TA(n),d=wA(n),p=dA(n),g=pA(s),v=r.createProgram();let m,f,_=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(m=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g].filter(Vo).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g].filter(Vo).join(`
`),f.length>0&&(f+=`
`)):(m=[Eg(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Vo).join(`
`),f=[Eg(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+u:"",n.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor||n.batchingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==vr?"#define TONE_MAPPING":"",n.toneMapping!==vr?Ge.tonemapping_pars_fragment:"",n.toneMapping!==vr?fA("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",Ge.colorspace_pars_fragment,uA("linearToOutputTexel",n.outputColorSpace),hA(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(Vo).join(`
`)),o=Yh(o),o=yg(o,n),o=Sg(o,n),a=Yh(a),a=yg(a,n),a=Sg(a,n),o=Mg(o),a=Mg(a),n.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",n.glslVersion===Um?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===Um?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const x=_+m+o,y=_+f+a,b=_g(r,r.VERTEX_SHADER,x),A=_g(r,r.FRAGMENT_SHADER,y);r.attachShader(v,b),r.attachShader(v,A),n.index0AttributeName!==void 0?r.bindAttribLocation(v,0,n.index0AttributeName):n.morphTargets===!0&&r.bindAttribLocation(v,0,"position"),r.linkProgram(v);function R(P){if(t.debug.checkShaderErrors){const j=r.getProgramInfoLog(v).trim(),H=r.getShaderInfoLog(b).trim(),Y=r.getShaderInfoLog(A).trim();let ee=!0,X=!0;if(r.getProgramParameter(v,r.LINK_STATUS)===!1)if(ee=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,v,b,A);else{const ie=xg(r,b,"vertex"),L=xg(r,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(v,r.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+j+`
`+ie+`
`+L)}else j!==""?console.warn("THREE.WebGLProgram: Program Info Log:",j):(H===""||Y==="")&&(X=!1);X&&(P.diagnostics={runnable:ee,programLog:j,vertexShader:{log:H,prefix:m},fragmentShader:{log:Y,prefix:f}})}r.deleteShader(b),r.deleteShader(A),C=new ec(r,v),T=mA(r,v)}let C;this.getUniforms=function(){return C===void 0&&R(this),C};let T;this.getAttributes=function(){return T===void 0&&R(this),T};let S=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=r.getProgramParameter(v,oA)),S},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(v),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=aA++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=b,this.fragmentShader=A,this}let RA=0;class CA{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const n=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(n),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new bA(e),n.set(e,i)),i}}class bA{constructor(e){this.id=RA++,this.code=e,this.usedTimes=0}}function PA(t,e,n,i,r,s,o){const a=new Pv,l=new CA,c=new Set,u=[],h=r.logarithmicDepthBuffer,d=r.vertexTextures;let p=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(T){return c.add(T),T===0?"uv":`uv${T}`}function m(T,S,P,j,H){const Y=j.fog,ee=H.geometry,X=T.isMeshStandardMaterial?j.environment:null,ie=(T.isMeshStandardMaterial?n:e).get(T.envMap||X),L=ie&&ie.mapping===$c?ie.image.height:null,$=g[T.type];T.precision!==null&&(p=r.getMaxPrecision(T.precision),p!==T.precision&&console.warn("THREE.WebGLProgram.getParameters:",T.precision,"not supported, using",p,"instead."));const J=ee.morphAttributes.position||ee.morphAttributes.normal||ee.morphAttributes.color,le=J!==void 0?J.length:0;let we=0;ee.morphAttributes.position!==void 0&&(we=1),ee.morphAttributes.normal!==void 0&&(we=2),ee.morphAttributes.color!==void 0&&(we=3);let Je,K,re,_e;if($){const ot=hi[$];Je=ot.vertexShader,K=ot.fragmentShader}else Je=T.vertexShader,K=T.fragmentShader,l.update(T),re=l.getVertexShaderID(T),_e=l.getFragmentShaderID(T);const ae=t.getRenderTarget(),De=t.state.buffers.depth.getReversed(),Fe=H.isInstancedMesh===!0,We=H.isBatchedMesh===!0,xt=!!T.map,$e=!!T.matcap,Rt=!!ie,U=!!T.aoMap,Fn=!!T.lightMap,je=!!T.bumpMap,Ye=!!T.normalMap,be=!!T.displacementMap,dt=!!T.emissiveMap,Ce=!!T.metalnessMap,w=!!T.roughnessMap,M=T.anisotropy>0,F=T.clearcoat>0,Z=T.dispersion>0,te=T.iridescence>0,q=T.sheen>0,Ae=T.transmission>0,fe=M&&!!T.anisotropyMap,ve=F&&!!T.clearcoatMap,qe=F&&!!T.clearcoatNormalMap,se=F&&!!T.clearcoatRoughnessMap,xe=te&&!!T.iridescenceMap,Pe=te&&!!T.iridescenceThicknessMap,Ue=q&&!!T.sheenColorMap,ye=q&&!!T.sheenRoughnessMap,Ke=!!T.specularMap,He=!!T.specularColorMap,ut=!!T.specularIntensityMap,I=Ae&&!!T.transmissionMap,ue=Ae&&!!T.thicknessMap,W=!!T.gradientMap,Q=!!T.alphaMap,pe=T.alphaTest>0,he=!!T.alphaHash,ke=!!T.extensions;let Tt=vr;T.toneMapped&&(ae===null||ae.isXRRenderTarget===!0)&&(Tt=t.toneMapping);const Kt={shaderID:$,shaderType:T.type,shaderName:T.name,vertexShader:Je,fragmentShader:K,defines:T.defines,customVertexShaderID:re,customFragmentShaderID:_e,isRawShaderMaterial:T.isRawShaderMaterial===!0,glslVersion:T.glslVersion,precision:p,batching:We,batchingColor:We&&H._colorsTexture!==null,instancing:Fe,instancingColor:Fe&&H.instanceColor!==null,instancingMorph:Fe&&H.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:ae===null?t.outputColorSpace:ae.isXRRenderTarget===!0?ae.texture.colorSpace:go,alphaToCoverage:!!T.alphaToCoverage,map:xt,matcap:$e,envMap:Rt,envMapMode:Rt&&ie.mapping,envMapCubeUVHeight:L,aoMap:U,lightMap:Fn,bumpMap:je,normalMap:Ye,displacementMap:d&&be,emissiveMap:dt,normalMapObjectSpace:Ye&&T.normalMapType===MM,normalMapTangentSpace:Ye&&T.normalMapType===Tv,metalnessMap:Ce,roughnessMap:w,anisotropy:M,anisotropyMap:fe,clearcoat:F,clearcoatMap:ve,clearcoatNormalMap:qe,clearcoatRoughnessMap:se,dispersion:Z,iridescence:te,iridescenceMap:xe,iridescenceThicknessMap:Pe,sheen:q,sheenColorMap:Ue,sheenRoughnessMap:ye,specularMap:Ke,specularColorMap:He,specularIntensityMap:ut,transmission:Ae,transmissionMap:I,thicknessMap:ue,gradientMap:W,opaque:T.transparent===!1&&T.blending===Ks&&T.alphaToCoverage===!1,alphaMap:Q,alphaTest:pe,alphaHash:he,combine:T.combine,mapUv:xt&&v(T.map.channel),aoMapUv:U&&v(T.aoMap.channel),lightMapUv:Fn&&v(T.lightMap.channel),bumpMapUv:je&&v(T.bumpMap.channel),normalMapUv:Ye&&v(T.normalMap.channel),displacementMapUv:be&&v(T.displacementMap.channel),emissiveMapUv:dt&&v(T.emissiveMap.channel),metalnessMapUv:Ce&&v(T.metalnessMap.channel),roughnessMapUv:w&&v(T.roughnessMap.channel),anisotropyMapUv:fe&&v(T.anisotropyMap.channel),clearcoatMapUv:ve&&v(T.clearcoatMap.channel),clearcoatNormalMapUv:qe&&v(T.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:se&&v(T.clearcoatRoughnessMap.channel),iridescenceMapUv:xe&&v(T.iridescenceMap.channel),iridescenceThicknessMapUv:Pe&&v(T.iridescenceThicknessMap.channel),sheenColorMapUv:Ue&&v(T.sheenColorMap.channel),sheenRoughnessMapUv:ye&&v(T.sheenRoughnessMap.channel),specularMapUv:Ke&&v(T.specularMap.channel),specularColorMapUv:He&&v(T.specularColorMap.channel),specularIntensityMapUv:ut&&v(T.specularIntensityMap.channel),transmissionMapUv:I&&v(T.transmissionMap.channel),thicknessMapUv:ue&&v(T.thicknessMap.channel),alphaMapUv:Q&&v(T.alphaMap.channel),vertexTangents:!!ee.attributes.tangent&&(Ye||M),vertexColors:T.vertexColors,vertexAlphas:T.vertexColors===!0&&!!ee.attributes.color&&ee.attributes.color.itemSize===4,pointsUvs:H.isPoints===!0&&!!ee.attributes.uv&&(xt||Q),fog:!!Y,useFog:T.fog===!0,fogExp2:!!Y&&Y.isFogExp2,flatShading:T.flatShading===!0,sizeAttenuation:T.sizeAttenuation===!0,logarithmicDepthBuffer:h,reverseDepthBuffer:De,skinning:H.isSkinnedMesh===!0,morphTargets:ee.morphAttributes.position!==void 0,morphNormals:ee.morphAttributes.normal!==void 0,morphColors:ee.morphAttributes.color!==void 0,morphTargetsCount:le,morphTextureStride:we,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:T.dithering,shadowMapEnabled:t.shadowMap.enabled&&P.length>0,shadowMapType:t.shadowMap.type,toneMapping:Tt,decodeVideoTexture:xt&&T.map.isVideoTexture===!0&&Ze.getTransfer(T.map.colorSpace)===ct,decodeVideoTextureEmissive:dt&&T.emissiveMap.isVideoTexture===!0&&Ze.getTransfer(T.emissiveMap.colorSpace)===ct,premultipliedAlpha:T.premultipliedAlpha,doubleSided:T.side===Ln,flipSided:T.side===wn,useDepthPacking:T.depthPacking>=0,depthPacking:T.depthPacking||0,index0AttributeName:T.index0AttributeName,extensionClipCullDistance:ke&&T.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ke&&T.extensions.multiDraw===!0||We)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:T.customProgramCacheKey()};return Kt.vertexUv1s=c.has(1),Kt.vertexUv2s=c.has(2),Kt.vertexUv3s=c.has(3),c.clear(),Kt}function f(T){const S=[];if(T.shaderID?S.push(T.shaderID):(S.push(T.customVertexShaderID),S.push(T.customFragmentShaderID)),T.defines!==void 0)for(const P in T.defines)S.push(P),S.push(T.defines[P]);return T.isRawShaderMaterial===!1&&(_(S,T),x(S,T),S.push(t.outputColorSpace)),S.push(T.customProgramCacheKey),S.join()}function _(T,S){T.push(S.precision),T.push(S.outputColorSpace),T.push(S.envMapMode),T.push(S.envMapCubeUVHeight),T.push(S.mapUv),T.push(S.alphaMapUv),T.push(S.lightMapUv),T.push(S.aoMapUv),T.push(S.bumpMapUv),T.push(S.normalMapUv),T.push(S.displacementMapUv),T.push(S.emissiveMapUv),T.push(S.metalnessMapUv),T.push(S.roughnessMapUv),T.push(S.anisotropyMapUv),T.push(S.clearcoatMapUv),T.push(S.clearcoatNormalMapUv),T.push(S.clearcoatRoughnessMapUv),T.push(S.iridescenceMapUv),T.push(S.iridescenceThicknessMapUv),T.push(S.sheenColorMapUv),T.push(S.sheenRoughnessMapUv),T.push(S.specularMapUv),T.push(S.specularColorMapUv),T.push(S.specularIntensityMapUv),T.push(S.transmissionMapUv),T.push(S.thicknessMapUv),T.push(S.combine),T.push(S.fogExp2),T.push(S.sizeAttenuation),T.push(S.morphTargetsCount),T.push(S.morphAttributeCount),T.push(S.numDirLights),T.push(S.numPointLights),T.push(S.numSpotLights),T.push(S.numSpotLightMaps),T.push(S.numHemiLights),T.push(S.numRectAreaLights),T.push(S.numDirLightShadows),T.push(S.numPointLightShadows),T.push(S.numSpotLightShadows),T.push(S.numSpotLightShadowsWithMaps),T.push(S.numLightProbes),T.push(S.shadowMapType),T.push(S.toneMapping),T.push(S.numClippingPlanes),T.push(S.numClipIntersection),T.push(S.depthPacking)}function x(T,S){a.disableAll(),S.supportsVertexTextures&&a.enable(0),S.instancing&&a.enable(1),S.instancingColor&&a.enable(2),S.instancingMorph&&a.enable(3),S.matcap&&a.enable(4),S.envMap&&a.enable(5),S.normalMapObjectSpace&&a.enable(6),S.normalMapTangentSpace&&a.enable(7),S.clearcoat&&a.enable(8),S.iridescence&&a.enable(9),S.alphaTest&&a.enable(10),S.vertexColors&&a.enable(11),S.vertexAlphas&&a.enable(12),S.vertexUv1s&&a.enable(13),S.vertexUv2s&&a.enable(14),S.vertexUv3s&&a.enable(15),S.vertexTangents&&a.enable(16),S.anisotropy&&a.enable(17),S.alphaHash&&a.enable(18),S.batching&&a.enable(19),S.dispersion&&a.enable(20),S.batchingColor&&a.enable(21),T.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.reverseDepthBuffer&&a.enable(4),S.skinning&&a.enable(5),S.morphTargets&&a.enable(6),S.morphNormals&&a.enable(7),S.morphColors&&a.enable(8),S.premultipliedAlpha&&a.enable(9),S.shadowMapEnabled&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),S.decodeVideoTextureEmissive&&a.enable(20),S.alphaToCoverage&&a.enable(21),T.push(a.mask)}function y(T){const S=g[T.type];let P;if(S){const j=hi[S];P=dE.clone(j.uniforms)}else P=T.uniforms;return P}function b(T,S){let P;for(let j=0,H=u.length;j<H;j++){const Y=u[j];if(Y.cacheKey===S){P=Y,++P.usedTimes;break}}return P===void 0&&(P=new AA(t,S,T,s),u.push(P)),P}function A(T){if(--T.usedTimes===0){const S=u.indexOf(T);u[S]=u[u.length-1],u.pop(),T.destroy()}}function R(T){l.remove(T)}function C(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:y,acquireProgram:b,releaseProgram:A,releaseShaderCache:R,programs:u,dispose:C}}function LA(){let t=new WeakMap;function e(o){return t.has(o)}function n(o){let a=t.get(o);return a===void 0&&(a={},t.set(o,a)),a}function i(o){t.delete(o)}function r(o,a,l){t.get(o)[a]=l}function s(){t=new WeakMap}return{has:e,get:n,remove:i,update:r,dispose:s}}function IA(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.z!==e.z?t.z-e.z:t.id-e.id}function Tg(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function wg(){const t=[];let e=0;const n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function o(h,d,p,g,v,m){let f=t[e];return f===void 0?(f={id:h.id,object:h,geometry:d,material:p,groupOrder:g,renderOrder:h.renderOrder,z:v,group:m},t[e]=f):(f.id=h.id,f.object=h,f.geometry=d,f.material=p,f.groupOrder=g,f.renderOrder=h.renderOrder,f.z=v,f.group=m),e++,f}function a(h,d,p,g,v,m){const f=o(h,d,p,g,v,m);p.transmission>0?i.push(f):p.transparent===!0?r.push(f):n.push(f)}function l(h,d,p,g,v,m){const f=o(h,d,p,g,v,m);p.transmission>0?i.unshift(f):p.transparent===!0?r.unshift(f):n.unshift(f)}function c(h,d){n.length>1&&n.sort(h||IA),i.length>1&&i.sort(d||Tg),r.length>1&&r.sort(d||Tg)}function u(){for(let h=e,d=t.length;h<d;h++){const p=t[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:a,unshift:l,finish:u,sort:c}}function DA(){let t=new WeakMap;function e(i,r){const s=t.get(i);let o;return s===void 0?(o=new wg,t.set(i,[o])):r>=s.length?(o=new wg,s.push(o)):o=s[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}function NA(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new k,color:new Le};break;case"SpotLight":n={position:new k,direction:new k,color:new Le,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new k,color:new Le,distance:0,decay:0};break;case"HemisphereLight":n={direction:new k,skyColor:new Le,groundColor:new Le};break;case"RectAreaLight":n={color:new Le,position:new k,halfWidth:new k,halfHeight:new k};break}return t[e.id]=n,n}}}function UA(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new st};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new st};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new st,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let OA=0;function FA(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function kA(t){const e=new NA,n=UA(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new k);const r=new k,s=new Mt,o=new Mt;function a(c){let u=0,h=0,d=0;for(let T=0;T<9;T++)i.probe[T].set(0,0,0);let p=0,g=0,v=0,m=0,f=0,_=0,x=0,y=0,b=0,A=0,R=0;c.sort(FA);for(let T=0,S=c.length;T<S;T++){const P=c[T],j=P.color,H=P.intensity,Y=P.distance,ee=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)u+=j.r*H,h+=j.g*H,d+=j.b*H;else if(P.isLightProbe){for(let X=0;X<9;X++)i.probe[X].addScaledVector(P.sh.coefficients[X],H);R++}else if(P.isDirectionalLight){const X=e.get(P);if(X.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const ie=P.shadow,L=n.get(P);L.shadowIntensity=ie.intensity,L.shadowBias=ie.bias,L.shadowNormalBias=ie.normalBias,L.shadowRadius=ie.radius,L.shadowMapSize=ie.mapSize,i.directionalShadow[p]=L,i.directionalShadowMap[p]=ee,i.directionalShadowMatrix[p]=P.shadow.matrix,_++}i.directional[p]=X,p++}else if(P.isSpotLight){const X=e.get(P);X.position.setFromMatrixPosition(P.matrixWorld),X.color.copy(j).multiplyScalar(H),X.distance=Y,X.coneCos=Math.cos(P.angle),X.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),X.decay=P.decay,i.spot[v]=X;const ie=P.shadow;if(P.map&&(i.spotLightMap[b]=P.map,b++,ie.updateMatrices(P),P.castShadow&&A++),i.spotLightMatrix[v]=ie.matrix,P.castShadow){const L=n.get(P);L.shadowIntensity=ie.intensity,L.shadowBias=ie.bias,L.shadowNormalBias=ie.normalBias,L.shadowRadius=ie.radius,L.shadowMapSize=ie.mapSize,i.spotShadow[v]=L,i.spotShadowMap[v]=ee,y++}v++}else if(P.isRectAreaLight){const X=e.get(P);X.color.copy(j).multiplyScalar(H),X.halfWidth.set(P.width*.5,0,0),X.halfHeight.set(0,P.height*.5,0),i.rectArea[m]=X,m++}else if(P.isPointLight){const X=e.get(P);if(X.color.copy(P.color).multiplyScalar(P.intensity),X.distance=P.distance,X.decay=P.decay,P.castShadow){const ie=P.shadow,L=n.get(P);L.shadowIntensity=ie.intensity,L.shadowBias=ie.bias,L.shadowNormalBias=ie.normalBias,L.shadowRadius=ie.radius,L.shadowMapSize=ie.mapSize,L.shadowCameraNear=ie.camera.near,L.shadowCameraFar=ie.camera.far,i.pointShadow[g]=L,i.pointShadowMap[g]=ee,i.pointShadowMatrix[g]=P.shadow.matrix,x++}i.point[g]=X,g++}else if(P.isHemisphereLight){const X=e.get(P);X.skyColor.copy(P.color).multiplyScalar(H),X.groundColor.copy(P.groundColor).multiplyScalar(H),i.hemi[f]=X,f++}}m>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ce.LTC_FLOAT_1,i.rectAreaLTC2=ce.LTC_FLOAT_2):(i.rectAreaLTC1=ce.LTC_HALF_1,i.rectAreaLTC2=ce.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=d;const C=i.hash;(C.directionalLength!==p||C.pointLength!==g||C.spotLength!==v||C.rectAreaLength!==m||C.hemiLength!==f||C.numDirectionalShadows!==_||C.numPointShadows!==x||C.numSpotShadows!==y||C.numSpotMaps!==b||C.numLightProbes!==R)&&(i.directional.length=p,i.spot.length=v,i.rectArea.length=m,i.point.length=g,i.hemi.length=f,i.directionalShadow.length=_,i.directionalShadowMap.length=_,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=_,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=y+b-A,i.spotLightMap.length=b,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=R,C.directionalLength=p,C.pointLength=g,C.spotLength=v,C.rectAreaLength=m,C.hemiLength=f,C.numDirectionalShadows=_,C.numPointShadows=x,C.numSpotShadows=y,C.numSpotMaps=b,C.numLightProbes=R,i.version=OA++)}function l(c,u){let h=0,d=0,p=0,g=0,v=0;const m=u.matrixWorldInverse;for(let f=0,_=c.length;f<_;f++){const x=c[f];if(x.isDirectionalLight){const y=i.directional[h];y.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(m),h++}else if(x.isSpotLight){const y=i.spot[p];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(m),p++}else if(x.isRectAreaLight){const y=i.rectArea[g];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(m),o.identity(),s.copy(x.matrixWorld),s.premultiply(m),o.extractRotation(s),y.halfWidth.set(x.width*.5,0,0),y.halfHeight.set(0,x.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),g++}else if(x.isPointLight){const y=i.point[d];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(m),d++}else if(x.isHemisphereLight){const y=i.hemi[v];y.direction.setFromMatrixPosition(x.matrixWorld),y.direction.transformDirection(m),v++}}}return{setup:a,setupView:l,state:i}}function Ag(t){const e=new kA(t),n=[],i=[];function r(u){c.camera=u,n.length=0,i.length=0}function s(u){n.push(u)}function o(u){i.push(u)}function a(){e.setup(n)}function l(u){e.setupView(n,u)}const c={lightsArray:n,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:a,setupLightsView:l,pushLight:s,pushShadow:o}}function BA(t){let e=new WeakMap;function n(r,s=0){const o=e.get(r);let a;return o===void 0?(a=new Ag(t),e.set(r,[a])):s>=o.length?(a=new Ag(t),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:n,dispose:i}}class zA extends xo{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=yM,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class HA extends xo{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const GA=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,VA=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function WA(t,e,n){let i=new ip;const r=new st,s=new st,o=new At,a=new zA({depthPacking:SM}),l=new HA,c={},u=n.maxTextureSize,h={[Vi]:wn,[wn]:Vi,[Ln]:Ln},d=new xi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new st},radius:{value:4}},vertexShader:GA,fragmentShader:VA}),p=d.clone();p.defines.HORIZONTAL_PASS=1;const g=new yi;g.setAttribute("position",new nn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Wt(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=hv;let f=this.type;this.render=function(A,R,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;const T=t.getRenderTarget(),S=t.getActiveCubeFace(),P=t.getActiveMipmapLevel(),j=t.state;j.setBlending(_r),j.buffers.color.setClear(1,1,1,1),j.buffers.depth.setTest(!0),j.setScissorTest(!1);const H=f!==Ci&&this.type===Ci,Y=f===Ci&&this.type!==Ci;for(let ee=0,X=A.length;ee<X;ee++){const ie=A[ee],L=ie.shadow;if(L===void 0){console.warn("THREE.WebGLShadowMap:",ie,"has no shadow.");continue}if(L.autoUpdate===!1&&L.needsUpdate===!1)continue;r.copy(L.mapSize);const $=L.getFrameExtents();if(r.multiply($),s.copy(L.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/$.x),r.x=s.x*$.x,L.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/$.y),r.y=s.y*$.y,L.mapSize.y=s.y)),L.map===null||H===!0||Y===!0){const le=this.type!==Ci?{minFilter:dn,magFilter:dn}:{};L.map!==null&&L.map.dispose(),L.map=new rs(r.x,r.y,le),L.map.texture.name=ie.name+".shadowMap",L.camera.updateProjectionMatrix()}t.setRenderTarget(L.map),t.clear();const J=L.getViewportCount();for(let le=0;le<J;le++){const we=L.getViewport(le);o.set(s.x*we.x,s.y*we.y,s.x*we.z,s.y*we.w),j.viewport(o),L.updateMatrices(ie,le),i=L.getFrustum(),y(R,C,L.camera,ie,this.type)}L.isPointLightShadow!==!0&&this.type===Ci&&_(L,C),L.needsUpdate=!1}f=this.type,m.needsUpdate=!1,t.setRenderTarget(T,S,P)};function _(A,R){const C=e.update(v);d.defines.VSM_SAMPLES!==A.blurSamples&&(d.defines.VSM_SAMPLES=A.blurSamples,p.defines.VSM_SAMPLES=A.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new rs(r.x,r.y)),d.uniforms.shadow_pass.value=A.map.texture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,t.setRenderTarget(A.mapPass),t.clear(),t.renderBufferDirect(R,null,C,d,v,null),p.uniforms.shadow_pass.value=A.mapPass.texture,p.uniforms.resolution.value=A.mapSize,p.uniforms.radius.value=A.radius,t.setRenderTarget(A.map),t.clear(),t.renderBufferDirect(R,null,C,p,v,null)}function x(A,R,C,T){let S=null;const P=C.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(P!==void 0)S=P;else if(S=C.isPointLight===!0?l:a,t.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0){const j=S.uuid,H=R.uuid;let Y=c[j];Y===void 0&&(Y={},c[j]=Y);let ee=Y[H];ee===void 0&&(ee=S.clone(),Y[H]=ee,R.addEventListener("dispose",b)),S=ee}if(S.visible=R.visible,S.wireframe=R.wireframe,T===Ci?S.side=R.shadowSide!==null?R.shadowSide:R.side:S.side=R.shadowSide!==null?R.shadowSide:h[R.side],S.alphaMap=R.alphaMap,S.alphaTest=R.alphaTest,S.map=R.map,S.clipShadows=R.clipShadows,S.clippingPlanes=R.clippingPlanes,S.clipIntersection=R.clipIntersection,S.displacementMap=R.displacementMap,S.displacementScale=R.displacementScale,S.displacementBias=R.displacementBias,S.wireframeLinewidth=R.wireframeLinewidth,S.linewidth=R.linewidth,C.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const j=t.properties.get(S);j.light=C}return S}function y(A,R,C,T,S){if(A.visible===!1)return;if(A.layers.test(R.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&S===Ci)&&(!A.frustumCulled||i.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,A.matrixWorld);const H=e.update(A),Y=A.material;if(Array.isArray(Y)){const ee=H.groups;for(let X=0,ie=ee.length;X<ie;X++){const L=ee[X],$=Y[L.materialIndex];if($&&$.visible){const J=x(A,$,T,S);A.onBeforeShadow(t,A,R,C,H,J,L),t.renderBufferDirect(C,null,H,J,A,L),A.onAfterShadow(t,A,R,C,H,J,L)}}}else if(Y.visible){const ee=x(A,Y,T,S);A.onBeforeShadow(t,A,R,C,H,ee,null),t.renderBufferDirect(C,null,H,ee,A,null),A.onAfterShadow(t,A,R,C,H,ee,null)}}const j=A.children;for(let H=0,Y=j.length;H<Y;H++)y(j[H],R,C,T,S)}function b(A){A.target.removeEventListener("dispose",b);for(const C in c){const T=c[C],S=A.target.uuid;S in T&&(T[S].dispose(),delete T[S])}}}const XA={[uh]:fh,[hh]:mh,[dh]:gh,[so]:ph,[fh]:uh,[mh]:hh,[gh]:dh,[ph]:so};function jA(t,e){function n(){let I=!1;const ue=new At;let W=null;const Q=new At(0,0,0,0);return{setMask:function(pe){W!==pe&&!I&&(t.colorMask(pe,pe,pe,pe),W=pe)},setLocked:function(pe){I=pe},setClear:function(pe,he,ke,Tt,Kt){Kt===!0&&(pe*=Tt,he*=Tt,ke*=Tt),ue.set(pe,he,ke,Tt),Q.equals(ue)===!1&&(t.clearColor(pe,he,ke,Tt),Q.copy(ue))},reset:function(){I=!1,W=null,Q.set(-1,0,0,0)}}}function i(){let I=!1,ue=!1,W=null,Q=null,pe=null;return{setReversed:function(he){if(ue!==he){const ke=e.get("EXT_clip_control");ue?ke.clipControlEXT(ke.LOWER_LEFT_EXT,ke.ZERO_TO_ONE_EXT):ke.clipControlEXT(ke.LOWER_LEFT_EXT,ke.NEGATIVE_ONE_TO_ONE_EXT);const Tt=pe;pe=null,this.setClear(Tt)}ue=he},getReversed:function(){return ue},setTest:function(he){he?ae(t.DEPTH_TEST):De(t.DEPTH_TEST)},setMask:function(he){W!==he&&!I&&(t.depthMask(he),W=he)},setFunc:function(he){if(ue&&(he=XA[he]),Q!==he){switch(he){case uh:t.depthFunc(t.NEVER);break;case fh:t.depthFunc(t.ALWAYS);break;case hh:t.depthFunc(t.LESS);break;case so:t.depthFunc(t.LEQUAL);break;case dh:t.depthFunc(t.EQUAL);break;case ph:t.depthFunc(t.GEQUAL);break;case mh:t.depthFunc(t.GREATER);break;case gh:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}Q=he}},setLocked:function(he){I=he},setClear:function(he){pe!==he&&(ue&&(he=1-he),t.clearDepth(he),pe=he)},reset:function(){I=!1,W=null,Q=null,pe=null,ue=!1}}}function r(){let I=!1,ue=null,W=null,Q=null,pe=null,he=null,ke=null,Tt=null,Kt=null;return{setTest:function(ot){I||(ot?ae(t.STENCIL_TEST):De(t.STENCIL_TEST))},setMask:function(ot){ue!==ot&&!I&&(t.stencilMask(ot),ue=ot)},setFunc:function(ot,Kn,Si){(W!==ot||Q!==Kn||pe!==Si)&&(t.stencilFunc(ot,Kn,Si),W=ot,Q=Kn,pe=Si)},setOp:function(ot,Kn,Si){(he!==ot||ke!==Kn||Tt!==Si)&&(t.stencilOp(ot,Kn,Si),he=ot,ke=Kn,Tt=Si)},setLocked:function(ot){I=ot},setClear:function(ot){Kt!==ot&&(t.clearStencil(ot),Kt=ot)},reset:function(){I=!1,ue=null,W=null,Q=null,pe=null,he=null,ke=null,Tt=null,Kt=null}}}const s=new n,o=new i,a=new r,l=new WeakMap,c=new WeakMap;let u={},h={},d=new WeakMap,p=[],g=null,v=!1,m=null,f=null,_=null,x=null,y=null,b=null,A=null,R=new Le(0,0,0),C=0,T=!1,S=null,P=null,j=null,H=null,Y=null;const ee=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let X=!1,ie=0;const L=t.getParameter(t.VERSION);L.indexOf("WebGL")!==-1?(ie=parseFloat(/^WebGL (\d)/.exec(L)[1]),X=ie>=1):L.indexOf("OpenGL ES")!==-1&&(ie=parseFloat(/^OpenGL ES (\d)/.exec(L)[1]),X=ie>=2);let $=null,J={};const le=t.getParameter(t.SCISSOR_BOX),we=t.getParameter(t.VIEWPORT),Je=new At().fromArray(le),K=new At().fromArray(we);function re(I,ue,W,Q){const pe=new Uint8Array(4),he=t.createTexture();t.bindTexture(I,he),t.texParameteri(I,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(I,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let ke=0;ke<W;ke++)I===t.TEXTURE_3D||I===t.TEXTURE_2D_ARRAY?t.texImage3D(ue,0,t.RGBA,1,1,Q,0,t.RGBA,t.UNSIGNED_BYTE,pe):t.texImage2D(ue+ke,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,pe);return he}const _e={};_e[t.TEXTURE_2D]=re(t.TEXTURE_2D,t.TEXTURE_2D,1),_e[t.TEXTURE_CUBE_MAP]=re(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),_e[t.TEXTURE_2D_ARRAY]=re(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),_e[t.TEXTURE_3D]=re(t.TEXTURE_3D,t.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ae(t.DEPTH_TEST),o.setFunc(so),je(!1),Ye(bm),ae(t.CULL_FACE),U(_r);function ae(I){u[I]!==!0&&(t.enable(I),u[I]=!0)}function De(I){u[I]!==!1&&(t.disable(I),u[I]=!1)}function Fe(I,ue){return h[I]!==ue?(t.bindFramebuffer(I,ue),h[I]=ue,I===t.DRAW_FRAMEBUFFER&&(h[t.FRAMEBUFFER]=ue),I===t.FRAMEBUFFER&&(h[t.DRAW_FRAMEBUFFER]=ue),!0):!1}function We(I,ue){let W=p,Q=!1;if(I){W=d.get(ue),W===void 0&&(W=[],d.set(ue,W));const pe=I.textures;if(W.length!==pe.length||W[0]!==t.COLOR_ATTACHMENT0){for(let he=0,ke=pe.length;he<ke;he++)W[he]=t.COLOR_ATTACHMENT0+he;W.length=pe.length,Q=!0}}else W[0]!==t.BACK&&(W[0]=t.BACK,Q=!0);Q&&t.drawBuffers(W)}function xt(I){return g!==I?(t.useProgram(I),g=I,!0):!1}const $e={[Hr]:t.FUNC_ADD,[YS]:t.FUNC_SUBTRACT,[KS]:t.FUNC_REVERSE_SUBTRACT};$e[$S]=t.MIN,$e[qS]=t.MAX;const Rt={[ZS]:t.ZERO,[QS]:t.ONE,[JS]:t.SRC_COLOR,[lh]:t.SRC_ALPHA,[sM]:t.SRC_ALPHA_SATURATE,[iM]:t.DST_COLOR,[tM]:t.DST_ALPHA,[eM]:t.ONE_MINUS_SRC_COLOR,[ch]:t.ONE_MINUS_SRC_ALPHA,[rM]:t.ONE_MINUS_DST_COLOR,[nM]:t.ONE_MINUS_DST_ALPHA,[oM]:t.CONSTANT_COLOR,[aM]:t.ONE_MINUS_CONSTANT_COLOR,[lM]:t.CONSTANT_ALPHA,[cM]:t.ONE_MINUS_CONSTANT_ALPHA};function U(I,ue,W,Q,pe,he,ke,Tt,Kt,ot){if(I===_r){v===!0&&(De(t.BLEND),v=!1);return}if(v===!1&&(ae(t.BLEND),v=!0),I!==jS){if(I!==m||ot!==T){if((f!==Hr||y!==Hr)&&(t.blendEquation(t.FUNC_ADD),f=Hr,y=Hr),ot)switch(I){case Ks:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Pm:t.blendFunc(t.ONE,t.ONE);break;case Lm:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Im:t.blendFuncSeparate(t.ZERO,t.SRC_COLOR,t.ZERO,t.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case Ks:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Pm:t.blendFunc(t.SRC_ALPHA,t.ONE);break;case Lm:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Im:t.blendFunc(t.ZERO,t.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}_=null,x=null,b=null,A=null,R.set(0,0,0),C=0,m=I,T=ot}return}pe=pe||ue,he=he||W,ke=ke||Q,(ue!==f||pe!==y)&&(t.blendEquationSeparate($e[ue],$e[pe]),f=ue,y=pe),(W!==_||Q!==x||he!==b||ke!==A)&&(t.blendFuncSeparate(Rt[W],Rt[Q],Rt[he],Rt[ke]),_=W,x=Q,b=he,A=ke),(Tt.equals(R)===!1||Kt!==C)&&(t.blendColor(Tt.r,Tt.g,Tt.b,Kt),R.copy(Tt),C=Kt),m=I,T=!1}function Fn(I,ue){I.side===Ln?De(t.CULL_FACE):ae(t.CULL_FACE);let W=I.side===wn;ue&&(W=!W),je(W),I.blending===Ks&&I.transparent===!1?U(_r):U(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),o.setFunc(I.depthFunc),o.setTest(I.depthTest),o.setMask(I.depthWrite),s.setMask(I.colorWrite);const Q=I.stencilWrite;a.setTest(Q),Q&&(a.setMask(I.stencilWriteMask),a.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),a.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),dt(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?ae(t.SAMPLE_ALPHA_TO_COVERAGE):De(t.SAMPLE_ALPHA_TO_COVERAGE)}function je(I){S!==I&&(I?t.frontFace(t.CW):t.frontFace(t.CCW),S=I)}function Ye(I){I!==VS?(ae(t.CULL_FACE),I!==P&&(I===bm?t.cullFace(t.BACK):I===WS?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):De(t.CULL_FACE),P=I}function be(I){I!==j&&(X&&t.lineWidth(I),j=I)}function dt(I,ue,W){I?(ae(t.POLYGON_OFFSET_FILL),(H!==ue||Y!==W)&&(t.polygonOffset(ue,W),H=ue,Y=W)):De(t.POLYGON_OFFSET_FILL)}function Ce(I){I?ae(t.SCISSOR_TEST):De(t.SCISSOR_TEST)}function w(I){I===void 0&&(I=t.TEXTURE0+ee-1),$!==I&&(t.activeTexture(I),$=I)}function M(I,ue,W){W===void 0&&($===null?W=t.TEXTURE0+ee-1:W=$);let Q=J[W];Q===void 0&&(Q={type:void 0,texture:void 0},J[W]=Q),(Q.type!==I||Q.texture!==ue)&&($!==W&&(t.activeTexture(W),$=W),t.bindTexture(I,ue||_e[I]),Q.type=I,Q.texture=ue)}function F(){const I=J[$];I!==void 0&&I.type!==void 0&&(t.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function Z(){try{t.compressedTexImage2D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function te(){try{t.compressedTexImage3D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function q(){try{t.texSubImage2D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Ae(){try{t.texSubImage3D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function fe(){try{t.compressedTexSubImage2D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ve(){try{t.compressedTexSubImage3D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function qe(){try{t.texStorage2D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function se(){try{t.texStorage3D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function xe(){try{t.texImage2D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Pe(){try{t.texImage3D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Ue(I){Je.equals(I)===!1&&(t.scissor(I.x,I.y,I.z,I.w),Je.copy(I))}function ye(I){K.equals(I)===!1&&(t.viewport(I.x,I.y,I.z,I.w),K.copy(I))}function Ke(I,ue){let W=c.get(ue);W===void 0&&(W=new WeakMap,c.set(ue,W));let Q=W.get(I);Q===void 0&&(Q=t.getUniformBlockIndex(ue,I.name),W.set(I,Q))}function He(I,ue){const Q=c.get(ue).get(I);l.get(ue)!==Q&&(t.uniformBlockBinding(ue,Q,I.__bindingPointIndex),l.set(ue,Q))}function ut(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),o.setReversed(!1),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),u={},$=null,J={},h={},d=new WeakMap,p=[],g=null,v=!1,m=null,f=null,_=null,x=null,y=null,b=null,A=null,R=new Le(0,0,0),C=0,T=!1,S=null,P=null,j=null,H=null,Y=null,Je.set(0,0,t.canvas.width,t.canvas.height),K.set(0,0,t.canvas.width,t.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:ae,disable:De,bindFramebuffer:Fe,drawBuffers:We,useProgram:xt,setBlending:U,setMaterial:Fn,setFlipSided:je,setCullFace:Ye,setLineWidth:be,setPolygonOffset:dt,setScissorTest:Ce,activeTexture:w,bindTexture:M,unbindTexture:F,compressedTexImage2D:Z,compressedTexImage3D:te,texImage2D:xe,texImage3D:Pe,updateUBOMapping:Ke,uniformBlockBinding:He,texStorage2D:qe,texStorage3D:se,texSubImage2D:q,texSubImage3D:Ae,compressedTexSubImage2D:fe,compressedTexSubImage3D:ve,scissor:Ue,viewport:ye,reset:ut}}function Rg(t,e,n,i){const r=YA(i);switch(n){case _v:return t*e;case xv:return t*e;case yv:return t*e*2;case Sv:return t*e/r.components*r.byteLength;case Qd:return t*e/r.components*r.byteLength;case Mv:return t*e*2/r.components*r.byteLength;case Jd:return t*e*2/r.components*r.byteLength;case vv:return t*e*3/r.components*r.byteLength;case ri:return t*e*4/r.components*r.byteLength;case ep:return t*e*4/r.components*r.byteLength;case $l:case ql:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Zl:case Ql:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Mh:case Th:return Math.max(t,16)*Math.max(e,8)/4;case Sh:case Eh:return Math.max(t,8)*Math.max(e,8)/2;case wh:case Ah:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Rh:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Ch:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case bh:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case Ph:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case Lh:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case Ih:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case Dh:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case Nh:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case Uh:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case Oh:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case Fh:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case kh:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case Bh:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case zh:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case Hh:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case Jl:case Gh:case Vh:return Math.ceil(t/4)*Math.ceil(e/4)*16;case Ev:case Wh:return Math.ceil(t/4)*Math.ceil(e/4)*8;case Xh:case jh:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function YA(t){switch(t){case Wi:case pv:return{byteLength:1,components:1};case Ma:case mv:case Ia:return{byteLength:2,components:1};case qd:case Zd:return{byteLength:2,components:4};case is:case $d:case Ui:return{byteLength:4,components:1};case gv:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${t}.`)}function KA(t,e,n,i,r,s,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new st,u=new WeakMap;let h;const d=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(w,M){return p?new OffscreenCanvas(w,M):bc("canvas")}function v(w,M,F){let Z=1;const te=Ce(w);if((te.width>F||te.height>F)&&(Z=F/Math.max(te.width,te.height)),Z<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const q=Math.floor(Z*te.width),Ae=Math.floor(Z*te.height);h===void 0&&(h=g(q,Ae));const fe=M?g(q,Ae):h;return fe.width=q,fe.height=Ae,fe.getContext("2d").drawImage(w,0,0,q,Ae),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+te.width+"x"+te.height+") to ("+q+"x"+Ae+")."),fe}else return"data"in w&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+te.width+"x"+te.height+")."),w;return w}function m(w){return w.generateMipmaps}function f(w){t.generateMipmap(w)}function _(w){return w.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?t.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?t.TEXTURE_2D_ARRAY:t.TEXTURE_2D}function x(w,M,F,Z,te=!1){if(w!==null){if(t[w]!==void 0)return t[w];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let q=M;if(M===t.RED&&(F===t.FLOAT&&(q=t.R32F),F===t.HALF_FLOAT&&(q=t.R16F),F===t.UNSIGNED_BYTE&&(q=t.R8)),M===t.RED_INTEGER&&(F===t.UNSIGNED_BYTE&&(q=t.R8UI),F===t.UNSIGNED_SHORT&&(q=t.R16UI),F===t.UNSIGNED_INT&&(q=t.R32UI),F===t.BYTE&&(q=t.R8I),F===t.SHORT&&(q=t.R16I),F===t.INT&&(q=t.R32I)),M===t.RG&&(F===t.FLOAT&&(q=t.RG32F),F===t.HALF_FLOAT&&(q=t.RG16F),F===t.UNSIGNED_BYTE&&(q=t.RG8)),M===t.RG_INTEGER&&(F===t.UNSIGNED_BYTE&&(q=t.RG8UI),F===t.UNSIGNED_SHORT&&(q=t.RG16UI),F===t.UNSIGNED_INT&&(q=t.RG32UI),F===t.BYTE&&(q=t.RG8I),F===t.SHORT&&(q=t.RG16I),F===t.INT&&(q=t.RG32I)),M===t.RGB_INTEGER&&(F===t.UNSIGNED_BYTE&&(q=t.RGB8UI),F===t.UNSIGNED_SHORT&&(q=t.RGB16UI),F===t.UNSIGNED_INT&&(q=t.RGB32UI),F===t.BYTE&&(q=t.RGB8I),F===t.SHORT&&(q=t.RGB16I),F===t.INT&&(q=t.RGB32I)),M===t.RGBA_INTEGER&&(F===t.UNSIGNED_BYTE&&(q=t.RGBA8UI),F===t.UNSIGNED_SHORT&&(q=t.RGBA16UI),F===t.UNSIGNED_INT&&(q=t.RGBA32UI),F===t.BYTE&&(q=t.RGBA8I),F===t.SHORT&&(q=t.RGBA16I),F===t.INT&&(q=t.RGBA32I)),M===t.RGB&&F===t.UNSIGNED_INT_5_9_9_9_REV&&(q=t.RGB9_E5),M===t.RGBA){const Ae=te?qc:Ze.getTransfer(Z);F===t.FLOAT&&(q=t.RGBA32F),F===t.HALF_FLOAT&&(q=t.RGBA16F),F===t.UNSIGNED_BYTE&&(q=Ae===ct?t.SRGB8_ALPHA8:t.RGBA8),F===t.UNSIGNED_SHORT_4_4_4_4&&(q=t.RGBA4),F===t.UNSIGNED_SHORT_5_5_5_1&&(q=t.RGB5_A1)}return(q===t.R16F||q===t.R32F||q===t.RG16F||q===t.RG32F||q===t.RGBA16F||q===t.RGBA32F)&&e.get("EXT_color_buffer_float"),q}function y(w,M){let F;return w?M===null||M===is||M===lo?F=t.DEPTH24_STENCIL8:M===Ui?F=t.DEPTH32F_STENCIL8:M===Ma&&(F=t.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===is||M===lo?F=t.DEPTH_COMPONENT24:M===Ui?F=t.DEPTH_COMPONENT32F:M===Ma&&(F=t.DEPTH_COMPONENT16),F}function b(w,M){return m(w)===!0||w.isFramebufferTexture&&w.minFilter!==dn&&w.minFilter!==pi?Math.log2(Math.max(M.width,M.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?M.mipmaps.length:1}function A(w){const M=w.target;M.removeEventListener("dispose",A),C(M),M.isVideoTexture&&u.delete(M)}function R(w){const M=w.target;M.removeEventListener("dispose",R),S(M)}function C(w){const M=i.get(w);if(M.__webglInit===void 0)return;const F=w.source,Z=d.get(F);if(Z){const te=Z[M.__cacheKey];te.usedTimes--,te.usedTimes===0&&T(w),Object.keys(Z).length===0&&d.delete(F)}i.remove(w)}function T(w){const M=i.get(w);t.deleteTexture(M.__webglTexture);const F=w.source,Z=d.get(F);delete Z[M.__cacheKey],o.memory.textures--}function S(w){const M=i.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),i.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(M.__webglFramebuffer[Z]))for(let te=0;te<M.__webglFramebuffer[Z].length;te++)t.deleteFramebuffer(M.__webglFramebuffer[Z][te]);else t.deleteFramebuffer(M.__webglFramebuffer[Z]);M.__webglDepthbuffer&&t.deleteRenderbuffer(M.__webglDepthbuffer[Z])}else{if(Array.isArray(M.__webglFramebuffer))for(let Z=0;Z<M.__webglFramebuffer.length;Z++)t.deleteFramebuffer(M.__webglFramebuffer[Z]);else t.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&t.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&t.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let Z=0;Z<M.__webglColorRenderbuffer.length;Z++)M.__webglColorRenderbuffer[Z]&&t.deleteRenderbuffer(M.__webglColorRenderbuffer[Z]);M.__webglDepthRenderbuffer&&t.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const F=w.textures;for(let Z=0,te=F.length;Z<te;Z++){const q=i.get(F[Z]);q.__webglTexture&&(t.deleteTexture(q.__webglTexture),o.memory.textures--),i.remove(F[Z])}i.remove(w)}let P=0;function j(){P=0}function H(){const w=P;return w>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+r.maxTextures),P+=1,w}function Y(w){const M=[];return M.push(w.wrapS),M.push(w.wrapT),M.push(w.wrapR||0),M.push(w.magFilter),M.push(w.minFilter),M.push(w.anisotropy),M.push(w.internalFormat),M.push(w.format),M.push(w.type),M.push(w.generateMipmaps),M.push(w.premultiplyAlpha),M.push(w.flipY),M.push(w.unpackAlignment),M.push(w.colorSpace),M.join()}function ee(w,M){const F=i.get(w);if(w.isVideoTexture&&be(w),w.isRenderTargetTexture===!1&&w.version>0&&F.__version!==w.version){const Z=w.image;if(Z===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{K(F,w,M);return}}n.bindTexture(t.TEXTURE_2D,F.__webglTexture,t.TEXTURE0+M)}function X(w,M){const F=i.get(w);if(w.version>0&&F.__version!==w.version){K(F,w,M);return}n.bindTexture(t.TEXTURE_2D_ARRAY,F.__webglTexture,t.TEXTURE0+M)}function ie(w,M){const F=i.get(w);if(w.version>0&&F.__version!==w.version){K(F,w,M);return}n.bindTexture(t.TEXTURE_3D,F.__webglTexture,t.TEXTURE0+M)}function L(w,M){const F=i.get(w);if(w.version>0&&F.__version!==w.version){re(F,w,M);return}n.bindTexture(t.TEXTURE_CUBE_MAP,F.__webglTexture,t.TEXTURE0+M)}const $={[xh]:t.REPEAT,[Ni]:t.CLAMP_TO_EDGE,[yh]:t.MIRRORED_REPEAT},J={[dn]:t.NEAREST,[xM]:t.NEAREST_MIPMAP_NEAREST,[nl]:t.NEAREST_MIPMAP_LINEAR,[pi]:t.LINEAR,[bu]:t.LINEAR_MIPMAP_NEAREST,[Kr]:t.LINEAR_MIPMAP_LINEAR},le={[EM]:t.NEVER,[bM]:t.ALWAYS,[TM]:t.LESS,[wv]:t.LEQUAL,[wM]:t.EQUAL,[CM]:t.GEQUAL,[AM]:t.GREATER,[RM]:t.NOTEQUAL};function we(w,M){if(M.type===Ui&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===pi||M.magFilter===bu||M.magFilter===nl||M.magFilter===Kr||M.minFilter===pi||M.minFilter===bu||M.minFilter===nl||M.minFilter===Kr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(w,t.TEXTURE_WRAP_S,$[M.wrapS]),t.texParameteri(w,t.TEXTURE_WRAP_T,$[M.wrapT]),(w===t.TEXTURE_3D||w===t.TEXTURE_2D_ARRAY)&&t.texParameteri(w,t.TEXTURE_WRAP_R,$[M.wrapR]),t.texParameteri(w,t.TEXTURE_MAG_FILTER,J[M.magFilter]),t.texParameteri(w,t.TEXTURE_MIN_FILTER,J[M.minFilter]),M.compareFunction&&(t.texParameteri(w,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(w,t.TEXTURE_COMPARE_FUNC,le[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===dn||M.minFilter!==nl&&M.minFilter!==Kr||M.type===Ui&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||i.get(M).__currentAnisotropy){const F=e.get("EXT_texture_filter_anisotropic");t.texParameterf(w,F.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,r.getMaxAnisotropy())),i.get(M).__currentAnisotropy=M.anisotropy}}}function Je(w,M){let F=!1;w.__webglInit===void 0&&(w.__webglInit=!0,M.addEventListener("dispose",A));const Z=M.source;let te=d.get(Z);te===void 0&&(te={},d.set(Z,te));const q=Y(M);if(q!==w.__cacheKey){te[q]===void 0&&(te[q]={texture:t.createTexture(),usedTimes:0},o.memory.textures++,F=!0),te[q].usedTimes++;const Ae=te[w.__cacheKey];Ae!==void 0&&(te[w.__cacheKey].usedTimes--,Ae.usedTimes===0&&T(M)),w.__cacheKey=q,w.__webglTexture=te[q].texture}return F}function K(w,M,F){let Z=t.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(Z=t.TEXTURE_2D_ARRAY),M.isData3DTexture&&(Z=t.TEXTURE_3D);const te=Je(w,M),q=M.source;n.bindTexture(Z,w.__webglTexture,t.TEXTURE0+F);const Ae=i.get(q);if(q.version!==Ae.__version||te===!0){n.activeTexture(t.TEXTURE0+F);const fe=Ze.getPrimaries(Ze.workingColorSpace),ve=M.colorSpace===or?null:Ze.getPrimaries(M.colorSpace),qe=M.colorSpace===or||fe===ve?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,M.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,qe);let se=v(M.image,!1,r.maxTextureSize);se=dt(M,se);const xe=s.convert(M.format,M.colorSpace),Pe=s.convert(M.type);let Ue=x(M.internalFormat,xe,Pe,M.colorSpace,M.isVideoTexture);we(Z,M);let ye;const Ke=M.mipmaps,He=M.isVideoTexture!==!0,ut=Ae.__version===void 0||te===!0,I=q.dataReady,ue=b(M,se);if(M.isDepthTexture)Ue=y(M.format===co,M.type),ut&&(He?n.texStorage2D(t.TEXTURE_2D,1,Ue,se.width,se.height):n.texImage2D(t.TEXTURE_2D,0,Ue,se.width,se.height,0,xe,Pe,null));else if(M.isDataTexture)if(Ke.length>0){He&&ut&&n.texStorage2D(t.TEXTURE_2D,ue,Ue,Ke[0].width,Ke[0].height);for(let W=0,Q=Ke.length;W<Q;W++)ye=Ke[W],He?I&&n.texSubImage2D(t.TEXTURE_2D,W,0,0,ye.width,ye.height,xe,Pe,ye.data):n.texImage2D(t.TEXTURE_2D,W,Ue,ye.width,ye.height,0,xe,Pe,ye.data);M.generateMipmaps=!1}else He?(ut&&n.texStorage2D(t.TEXTURE_2D,ue,Ue,se.width,se.height),I&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,se.width,se.height,xe,Pe,se.data)):n.texImage2D(t.TEXTURE_2D,0,Ue,se.width,se.height,0,xe,Pe,se.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){He&&ut&&n.texStorage3D(t.TEXTURE_2D_ARRAY,ue,Ue,Ke[0].width,Ke[0].height,se.depth);for(let W=0,Q=Ke.length;W<Q;W++)if(ye=Ke[W],M.format!==ri)if(xe!==null)if(He){if(I)if(M.layerUpdates.size>0){const pe=Rg(ye.width,ye.height,M.format,M.type);for(const he of M.layerUpdates){const ke=ye.data.subarray(he*pe/ye.data.BYTES_PER_ELEMENT,(he+1)*pe/ye.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,W,0,0,he,ye.width,ye.height,1,xe,ke)}M.clearLayerUpdates()}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,W,0,0,0,ye.width,ye.height,se.depth,xe,ye.data)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,W,Ue,ye.width,ye.height,se.depth,0,ye.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else He?I&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,W,0,0,0,ye.width,ye.height,se.depth,xe,Pe,ye.data):n.texImage3D(t.TEXTURE_2D_ARRAY,W,Ue,ye.width,ye.height,se.depth,0,xe,Pe,ye.data)}else{He&&ut&&n.texStorage2D(t.TEXTURE_2D,ue,Ue,Ke[0].width,Ke[0].height);for(let W=0,Q=Ke.length;W<Q;W++)ye=Ke[W],M.format!==ri?xe!==null?He?I&&n.compressedTexSubImage2D(t.TEXTURE_2D,W,0,0,ye.width,ye.height,xe,ye.data):n.compressedTexImage2D(t.TEXTURE_2D,W,Ue,ye.width,ye.height,0,ye.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):He?I&&n.texSubImage2D(t.TEXTURE_2D,W,0,0,ye.width,ye.height,xe,Pe,ye.data):n.texImage2D(t.TEXTURE_2D,W,Ue,ye.width,ye.height,0,xe,Pe,ye.data)}else if(M.isDataArrayTexture)if(He){if(ut&&n.texStorage3D(t.TEXTURE_2D_ARRAY,ue,Ue,se.width,se.height,se.depth),I)if(M.layerUpdates.size>0){const W=Rg(se.width,se.height,M.format,M.type);for(const Q of M.layerUpdates){const pe=se.data.subarray(Q*W/se.data.BYTES_PER_ELEMENT,(Q+1)*W/se.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,Q,se.width,se.height,1,xe,Pe,pe)}M.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,se.width,se.height,se.depth,xe,Pe,se.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,Ue,se.width,se.height,se.depth,0,xe,Pe,se.data);else if(M.isData3DTexture)He?(ut&&n.texStorage3D(t.TEXTURE_3D,ue,Ue,se.width,se.height,se.depth),I&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,se.width,se.height,se.depth,xe,Pe,se.data)):n.texImage3D(t.TEXTURE_3D,0,Ue,se.width,se.height,se.depth,0,xe,Pe,se.data);else if(M.isFramebufferTexture){if(ut)if(He)n.texStorage2D(t.TEXTURE_2D,ue,Ue,se.width,se.height);else{let W=se.width,Q=se.height;for(let pe=0;pe<ue;pe++)n.texImage2D(t.TEXTURE_2D,pe,Ue,W,Q,0,xe,Pe,null),W>>=1,Q>>=1}}else if(Ke.length>0){if(He&&ut){const W=Ce(Ke[0]);n.texStorage2D(t.TEXTURE_2D,ue,Ue,W.width,W.height)}for(let W=0,Q=Ke.length;W<Q;W++)ye=Ke[W],He?I&&n.texSubImage2D(t.TEXTURE_2D,W,0,0,xe,Pe,ye):n.texImage2D(t.TEXTURE_2D,W,Ue,xe,Pe,ye);M.generateMipmaps=!1}else if(He){if(ut){const W=Ce(se);n.texStorage2D(t.TEXTURE_2D,ue,Ue,W.width,W.height)}I&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,xe,Pe,se)}else n.texImage2D(t.TEXTURE_2D,0,Ue,xe,Pe,se);m(M)&&f(Z),Ae.__version=q.version,M.onUpdate&&M.onUpdate(M)}w.__version=M.version}function re(w,M,F){if(M.image.length!==6)return;const Z=Je(w,M),te=M.source;n.bindTexture(t.TEXTURE_CUBE_MAP,w.__webglTexture,t.TEXTURE0+F);const q=i.get(te);if(te.version!==q.__version||Z===!0){n.activeTexture(t.TEXTURE0+F);const Ae=Ze.getPrimaries(Ze.workingColorSpace),fe=M.colorSpace===or?null:Ze.getPrimaries(M.colorSpace),ve=M.colorSpace===or||Ae===fe?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,M.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,ve);const qe=M.isCompressedTexture||M.image[0].isCompressedTexture,se=M.image[0]&&M.image[0].isDataTexture,xe=[];for(let Q=0;Q<6;Q++)!qe&&!se?xe[Q]=v(M.image[Q],!0,r.maxCubemapSize):xe[Q]=se?M.image[Q].image:M.image[Q],xe[Q]=dt(M,xe[Q]);const Pe=xe[0],Ue=s.convert(M.format,M.colorSpace),ye=s.convert(M.type),Ke=x(M.internalFormat,Ue,ye,M.colorSpace),He=M.isVideoTexture!==!0,ut=q.__version===void 0||Z===!0,I=te.dataReady;let ue=b(M,Pe);we(t.TEXTURE_CUBE_MAP,M);let W;if(qe){He&&ut&&n.texStorage2D(t.TEXTURE_CUBE_MAP,ue,Ke,Pe.width,Pe.height);for(let Q=0;Q<6;Q++){W=xe[Q].mipmaps;for(let pe=0;pe<W.length;pe++){const he=W[pe];M.format!==ri?Ue!==null?He?I&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Q,pe,0,0,he.width,he.height,Ue,he.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Q,pe,Ke,he.width,he.height,0,he.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):He?I&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Q,pe,0,0,he.width,he.height,Ue,ye,he.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Q,pe,Ke,he.width,he.height,0,Ue,ye,he.data)}}}else{if(W=M.mipmaps,He&&ut){W.length>0&&ue++;const Q=Ce(xe[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,ue,Ke,Q.width,Q.height)}for(let Q=0;Q<6;Q++)if(se){He?I&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,xe[Q].width,xe[Q].height,Ue,ye,xe[Q].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Ke,xe[Q].width,xe[Q].height,0,Ue,ye,xe[Q].data);for(let pe=0;pe<W.length;pe++){const ke=W[pe].image[Q].image;He?I&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Q,pe+1,0,0,ke.width,ke.height,Ue,ye,ke.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Q,pe+1,Ke,ke.width,ke.height,0,Ue,ye,ke.data)}}else{He?I&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,Ue,ye,xe[Q]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Ke,Ue,ye,xe[Q]);for(let pe=0;pe<W.length;pe++){const he=W[pe];He?I&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Q,pe+1,0,0,Ue,ye,he.image[Q]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Q,pe+1,Ke,Ue,ye,he.image[Q])}}}m(M)&&f(t.TEXTURE_CUBE_MAP),q.__version=te.version,M.onUpdate&&M.onUpdate(M)}w.__version=M.version}function _e(w,M,F,Z,te,q){const Ae=s.convert(F.format,F.colorSpace),fe=s.convert(F.type),ve=x(F.internalFormat,Ae,fe,F.colorSpace),qe=i.get(M),se=i.get(F);if(se.__renderTarget=M,!qe.__hasExternalTextures){const xe=Math.max(1,M.width>>q),Pe=Math.max(1,M.height>>q);te===t.TEXTURE_3D||te===t.TEXTURE_2D_ARRAY?n.texImage3D(te,q,ve,xe,Pe,M.depth,0,Ae,fe,null):n.texImage2D(te,q,ve,xe,Pe,0,Ae,fe,null)}n.bindFramebuffer(t.FRAMEBUFFER,w),Ye(M)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,Z,te,se.__webglTexture,0,je(M)):(te===t.TEXTURE_2D||te>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&te<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,Z,te,se.__webglTexture,q),n.bindFramebuffer(t.FRAMEBUFFER,null)}function ae(w,M,F){if(t.bindRenderbuffer(t.RENDERBUFFER,w),M.depthBuffer){const Z=M.depthTexture,te=Z&&Z.isDepthTexture?Z.type:null,q=y(M.stencilBuffer,te),Ae=M.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,fe=je(M);Ye(M)?a.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,fe,q,M.width,M.height):F?t.renderbufferStorageMultisample(t.RENDERBUFFER,fe,q,M.width,M.height):t.renderbufferStorage(t.RENDERBUFFER,q,M.width,M.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,Ae,t.RENDERBUFFER,w)}else{const Z=M.textures;for(let te=0;te<Z.length;te++){const q=Z[te],Ae=s.convert(q.format,q.colorSpace),fe=s.convert(q.type),ve=x(q.internalFormat,Ae,fe,q.colorSpace),qe=je(M);F&&Ye(M)===!1?t.renderbufferStorageMultisample(t.RENDERBUFFER,qe,ve,M.width,M.height):Ye(M)?a.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,qe,ve,M.width,M.height):t.renderbufferStorage(t.RENDERBUFFER,ve,M.width,M.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function De(w,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(n.bindFramebuffer(t.FRAMEBUFFER,w),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Z=i.get(M.depthTexture);Z.__renderTarget=M,(!Z.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),ee(M.depthTexture,0);const te=Z.__webglTexture,q=je(M);if(M.depthTexture.format===$s)Ye(M)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,te,0,q):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,te,0);else if(M.depthTexture.format===co)Ye(M)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,te,0,q):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,te,0);else throw new Error("Unknown depthTexture format")}function Fe(w){const M=i.get(w),F=w.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==w.depthTexture){const Z=w.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),Z){const te=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,Z.removeEventListener("dispose",te)};Z.addEventListener("dispose",te),M.__depthDisposeCallback=te}M.__boundDepthTexture=Z}if(w.depthTexture&&!M.__autoAllocateDepthBuffer){if(F)throw new Error("target.depthTexture not supported in Cube render targets");De(M.__webglFramebuffer,w)}else if(F){M.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(n.bindFramebuffer(t.FRAMEBUFFER,M.__webglFramebuffer[Z]),M.__webglDepthbuffer[Z]===void 0)M.__webglDepthbuffer[Z]=t.createRenderbuffer(),ae(M.__webglDepthbuffer[Z],w,!1);else{const te=w.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,q=M.__webglDepthbuffer[Z];t.bindRenderbuffer(t.RENDERBUFFER,q),t.framebufferRenderbuffer(t.FRAMEBUFFER,te,t.RENDERBUFFER,q)}}else if(n.bindFramebuffer(t.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=t.createRenderbuffer(),ae(M.__webglDepthbuffer,w,!1);else{const Z=w.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,te=M.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,te),t.framebufferRenderbuffer(t.FRAMEBUFFER,Z,t.RENDERBUFFER,te)}n.bindFramebuffer(t.FRAMEBUFFER,null)}function We(w,M,F){const Z=i.get(w);M!==void 0&&_e(Z.__webglFramebuffer,w,w.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),F!==void 0&&Fe(w)}function xt(w){const M=w.texture,F=i.get(w),Z=i.get(M);w.addEventListener("dispose",R);const te=w.textures,q=w.isWebGLCubeRenderTarget===!0,Ae=te.length>1;if(Ae||(Z.__webglTexture===void 0&&(Z.__webglTexture=t.createTexture()),Z.__version=M.version,o.memory.textures++),q){F.__webglFramebuffer=[];for(let fe=0;fe<6;fe++)if(M.mipmaps&&M.mipmaps.length>0){F.__webglFramebuffer[fe]=[];for(let ve=0;ve<M.mipmaps.length;ve++)F.__webglFramebuffer[fe][ve]=t.createFramebuffer()}else F.__webglFramebuffer[fe]=t.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){F.__webglFramebuffer=[];for(let fe=0;fe<M.mipmaps.length;fe++)F.__webglFramebuffer[fe]=t.createFramebuffer()}else F.__webglFramebuffer=t.createFramebuffer();if(Ae)for(let fe=0,ve=te.length;fe<ve;fe++){const qe=i.get(te[fe]);qe.__webglTexture===void 0&&(qe.__webglTexture=t.createTexture(),o.memory.textures++)}if(w.samples>0&&Ye(w)===!1){F.__webglMultisampledFramebuffer=t.createFramebuffer(),F.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let fe=0;fe<te.length;fe++){const ve=te[fe];F.__webglColorRenderbuffer[fe]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,F.__webglColorRenderbuffer[fe]);const qe=s.convert(ve.format,ve.colorSpace),se=s.convert(ve.type),xe=x(ve.internalFormat,qe,se,ve.colorSpace,w.isXRRenderTarget===!0),Pe=je(w);t.renderbufferStorageMultisample(t.RENDERBUFFER,Pe,xe,w.width,w.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+fe,t.RENDERBUFFER,F.__webglColorRenderbuffer[fe])}t.bindRenderbuffer(t.RENDERBUFFER,null),w.depthBuffer&&(F.__webglDepthRenderbuffer=t.createRenderbuffer(),ae(F.__webglDepthRenderbuffer,w,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(q){n.bindTexture(t.TEXTURE_CUBE_MAP,Z.__webglTexture),we(t.TEXTURE_CUBE_MAP,M);for(let fe=0;fe<6;fe++)if(M.mipmaps&&M.mipmaps.length>0)for(let ve=0;ve<M.mipmaps.length;ve++)_e(F.__webglFramebuffer[fe][ve],w,M,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+fe,ve);else _e(F.__webglFramebuffer[fe],w,M,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0);m(M)&&f(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(Ae){for(let fe=0,ve=te.length;fe<ve;fe++){const qe=te[fe],se=i.get(qe);n.bindTexture(t.TEXTURE_2D,se.__webglTexture),we(t.TEXTURE_2D,qe),_e(F.__webglFramebuffer,w,qe,t.COLOR_ATTACHMENT0+fe,t.TEXTURE_2D,0),m(qe)&&f(t.TEXTURE_2D)}n.unbindTexture()}else{let fe=t.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(fe=w.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(fe,Z.__webglTexture),we(fe,M),M.mipmaps&&M.mipmaps.length>0)for(let ve=0;ve<M.mipmaps.length;ve++)_e(F.__webglFramebuffer[ve],w,M,t.COLOR_ATTACHMENT0,fe,ve);else _e(F.__webglFramebuffer,w,M,t.COLOR_ATTACHMENT0,fe,0);m(M)&&f(fe),n.unbindTexture()}w.depthBuffer&&Fe(w)}function $e(w){const M=w.textures;for(let F=0,Z=M.length;F<Z;F++){const te=M[F];if(m(te)){const q=_(w),Ae=i.get(te).__webglTexture;n.bindTexture(q,Ae),f(q),n.unbindTexture()}}}const Rt=[],U=[];function Fn(w){if(w.samples>0){if(Ye(w)===!1){const M=w.textures,F=w.width,Z=w.height;let te=t.COLOR_BUFFER_BIT;const q=w.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Ae=i.get(w),fe=M.length>1;if(fe)for(let ve=0;ve<M.length;ve++)n.bindFramebuffer(t.FRAMEBUFFER,Ae.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ve,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,Ae.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+ve,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,Ae.__webglMultisampledFramebuffer),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Ae.__webglFramebuffer);for(let ve=0;ve<M.length;ve++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(te|=t.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(te|=t.STENCIL_BUFFER_BIT)),fe){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,Ae.__webglColorRenderbuffer[ve]);const qe=i.get(M[ve]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,qe,0)}t.blitFramebuffer(0,0,F,Z,0,0,F,Z,te,t.NEAREST),l===!0&&(Rt.length=0,U.length=0,Rt.push(t.COLOR_ATTACHMENT0+ve),w.depthBuffer&&w.resolveDepthBuffer===!1&&(Rt.push(q),U.push(q),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,U)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,Rt))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),fe)for(let ve=0;ve<M.length;ve++){n.bindFramebuffer(t.FRAMEBUFFER,Ae.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ve,t.RENDERBUFFER,Ae.__webglColorRenderbuffer[ve]);const qe=i.get(M[ve]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,Ae.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+ve,t.TEXTURE_2D,qe,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Ae.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&l){const M=w.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[M])}}}function je(w){return Math.min(r.maxSamples,w.samples)}function Ye(w){const M=i.get(w);return w.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function be(w){const M=o.render.frame;u.get(w)!==M&&(u.set(w,M),w.update())}function dt(w,M){const F=w.colorSpace,Z=w.format,te=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||F!==go&&F!==or&&(Ze.getTransfer(F)===ct?(Z!==ri||te!==Wi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",F)),M}function Ce(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=H,this.resetTextureUnits=j,this.setTexture2D=ee,this.setTexture2DArray=X,this.setTexture3D=ie,this.setTextureCube=L,this.rebindTextures=We,this.setupRenderTarget=xt,this.updateRenderTargetMipmap=$e,this.updateMultisampleRenderTarget=Fn,this.setupDepthRenderbuffer=Fe,this.setupFrameBufferTexture=_e,this.useMultisampledRTT=Ye}function $A(t,e){function n(i,r=or){let s;const o=Ze.getTransfer(r);if(i===Wi)return t.UNSIGNED_BYTE;if(i===qd)return t.UNSIGNED_SHORT_4_4_4_4;if(i===Zd)return t.UNSIGNED_SHORT_5_5_5_1;if(i===gv)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===pv)return t.BYTE;if(i===mv)return t.SHORT;if(i===Ma)return t.UNSIGNED_SHORT;if(i===$d)return t.INT;if(i===is)return t.UNSIGNED_INT;if(i===Ui)return t.FLOAT;if(i===Ia)return t.HALF_FLOAT;if(i===_v)return t.ALPHA;if(i===vv)return t.RGB;if(i===ri)return t.RGBA;if(i===xv)return t.LUMINANCE;if(i===yv)return t.LUMINANCE_ALPHA;if(i===$s)return t.DEPTH_COMPONENT;if(i===co)return t.DEPTH_STENCIL;if(i===Sv)return t.RED;if(i===Qd)return t.RED_INTEGER;if(i===Mv)return t.RG;if(i===Jd)return t.RG_INTEGER;if(i===ep)return t.RGBA_INTEGER;if(i===$l||i===ql||i===Zl||i===Ql)if(o===ct)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===$l)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===ql)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Zl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Ql)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===$l)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===ql)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Zl)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Ql)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Sh||i===Mh||i===Eh||i===Th)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Sh)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Mh)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Eh)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Th)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===wh||i===Ah||i===Rh)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===wh||i===Ah)return o===ct?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Rh)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Ch||i===bh||i===Ph||i===Lh||i===Ih||i===Dh||i===Nh||i===Uh||i===Oh||i===Fh||i===kh||i===Bh||i===zh||i===Hh)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Ch)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===bh)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Ph)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Lh)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ih)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Dh)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Nh)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Uh)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Oh)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Fh)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===kh)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Bh)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===zh)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Hh)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Jl||i===Gh||i===Vh)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===Jl)return o===ct?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Gh)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Vh)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Ev||i===Wh||i===Xh||i===jh)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===Jl)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Wh)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Xh)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===jh)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===lo?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}class qA extends Gn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Bt extends jt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const ZA={type:"move"};class nf{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Bt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Bt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new k,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new k),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Bt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new k,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new k),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const v of e.hand.values()){const m=n.getJointPose(v,i),f=this._getHandJoint(c,v);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),p=.02,g=.005;c.inputState.pinching&&d>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(ZA)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new Bt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}const QA=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,JA=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class eR{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n,i){if(this.texture===null){const r=new pn,s=e.properties.get(r);s.__webglTexture=n.texture,(n.depthNear!=i.depthNear||n.depthFar!=i.depthFar)&&(this.depthNear=n.depthNear,this.depthFar=n.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,i=new xi({vertexShader:QA,fragmentShader:JA,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new Wt(new Oa(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class tR extends _o{constructor(e,n){super();const i=this;let r=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,d=null,p=null,g=null;const v=new eR,m=n.getContextAttributes();let f=null,_=null;const x=[],y=[],b=new st;let A=null;const R=new Gn;R.viewport=new At;const C=new Gn;C.viewport=new At;const T=[R,C],S=new qA;let P=null,j=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let re=x[K];return re===void 0&&(re=new nf,x[K]=re),re.getTargetRaySpace()},this.getControllerGrip=function(K){let re=x[K];return re===void 0&&(re=new nf,x[K]=re),re.getGripSpace()},this.getHand=function(K){let re=x[K];return re===void 0&&(re=new nf,x[K]=re),re.getHandSpace()};function H(K){const re=y.indexOf(K.inputSource);if(re===-1)return;const _e=x[re];_e!==void 0&&(_e.update(K.inputSource,K.frame,c||o),_e.dispatchEvent({type:K.type,data:K.inputSource}))}function Y(){r.removeEventListener("select",H),r.removeEventListener("selectstart",H),r.removeEventListener("selectend",H),r.removeEventListener("squeeze",H),r.removeEventListener("squeezestart",H),r.removeEventListener("squeezeend",H),r.removeEventListener("end",Y),r.removeEventListener("inputsourceschange",ee);for(let K=0;K<x.length;K++){const re=y[K];re!==null&&(y[K]=null,x[K].disconnect(re))}P=null,j=null,v.reset(),e.setRenderTarget(f),p=null,d=null,h=null,r=null,_=null,Je.stop(),i.isPresenting=!1,e.setPixelRatio(A),e.setSize(b.width,b.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){s=K,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){a=K,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(K){c=K},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return h},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(K){if(r=K,r!==null){if(f=e.getRenderTarget(),r.addEventListener("select",H),r.addEventListener("selectstart",H),r.addEventListener("selectend",H),r.addEventListener("squeeze",H),r.addEventListener("squeezestart",H),r.addEventListener("squeezeend",H),r.addEventListener("end",Y),r.addEventListener("inputsourceschange",ee),m.xrCompatible!==!0&&await n.makeXRCompatible(),A=e.getPixelRatio(),e.getSize(b),r.renderState.layers===void 0){const re={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,n,re),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),_=new rs(p.framebufferWidth,p.framebufferHeight,{format:ri,type:Wi,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let re=null,_e=null,ae=null;m.depth&&(ae=m.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,re=m.stencil?co:$s,_e=m.stencil?lo:is);const De={colorFormat:n.RGBA8,depthFormat:ae,scaleFactor:s};h=new XRWebGLBinding(r,n),d=h.createProjectionLayer(De),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),_=new rs(d.textureWidth,d.textureHeight,{format:ri,type:Wi,depthTexture:new Bv(d.textureWidth,d.textureHeight,_e,void 0,void 0,void 0,void 0,void 0,void 0,re),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),Je.setContext(r),Je.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function ee(K){for(let re=0;re<K.removed.length;re++){const _e=K.removed[re],ae=y.indexOf(_e);ae>=0&&(y[ae]=null,x[ae].disconnect(_e))}for(let re=0;re<K.added.length;re++){const _e=K.added[re];let ae=y.indexOf(_e);if(ae===-1){for(let Fe=0;Fe<x.length;Fe++)if(Fe>=y.length){y.push(_e),ae=Fe;break}else if(y[Fe]===null){y[Fe]=_e,ae=Fe;break}if(ae===-1)break}const De=x[ae];De&&De.connect(_e)}}const X=new k,ie=new k;function L(K,re,_e){X.setFromMatrixPosition(re.matrixWorld),ie.setFromMatrixPosition(_e.matrixWorld);const ae=X.distanceTo(ie),De=re.projectionMatrix.elements,Fe=_e.projectionMatrix.elements,We=De[14]/(De[10]-1),xt=De[14]/(De[10]+1),$e=(De[9]+1)/De[5],Rt=(De[9]-1)/De[5],U=(De[8]-1)/De[0],Fn=(Fe[8]+1)/Fe[0],je=We*U,Ye=We*Fn,be=ae/(-U+Fn),dt=be*-U;if(re.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(dt),K.translateZ(be),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),De[10]===-1)K.projectionMatrix.copy(re.projectionMatrix),K.projectionMatrixInverse.copy(re.projectionMatrixInverse);else{const Ce=We+be,w=xt+be,M=je-dt,F=Ye+(ae-dt),Z=$e*xt/w*Ce,te=Rt*xt/w*Ce;K.projectionMatrix.makePerspective(M,F,Z,te,Ce,w),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function $(K,re){re===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(re.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(r===null)return;let re=K.near,_e=K.far;v.texture!==null&&(v.depthNear>0&&(re=v.depthNear),v.depthFar>0&&(_e=v.depthFar)),S.near=C.near=R.near=re,S.far=C.far=R.far=_e,(P!==S.near||j!==S.far)&&(r.updateRenderState({depthNear:S.near,depthFar:S.far}),P=S.near,j=S.far),R.layers.mask=K.layers.mask|2,C.layers.mask=K.layers.mask|4,S.layers.mask=R.layers.mask|C.layers.mask;const ae=K.parent,De=S.cameras;$(S,ae);for(let Fe=0;Fe<De.length;Fe++)$(De[Fe],ae);De.length===2?L(S,R,C):S.projectionMatrix.copy(R.projectionMatrix),J(K,S,ae)};function J(K,re,_e){_e===null?K.matrix.copy(re.matrixWorld):(K.matrix.copy(_e.matrixWorld),K.matrix.invert(),K.matrix.multiply(re.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(re.projectionMatrix),K.projectionMatrixInverse.copy(re.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=Ea*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(d===null&&p===null))return l},this.setFoveation=function(K){l=K,d!==null&&(d.fixedFoveation=K),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=K)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(S)};let le=null;function we(K,re){if(u=re.getViewerPose(c||o),g=re,u!==null){const _e=u.views;p!==null&&(e.setRenderTargetFramebuffer(_,p.framebuffer),e.setRenderTarget(_));let ae=!1;_e.length!==S.cameras.length&&(S.cameras.length=0,ae=!0);for(let Fe=0;Fe<_e.length;Fe++){const We=_e[Fe];let xt=null;if(p!==null)xt=p.getViewport(We);else{const Rt=h.getViewSubImage(d,We);xt=Rt.viewport,Fe===0&&(e.setRenderTargetTextures(_,Rt.colorTexture,d.ignoreDepthValues?void 0:Rt.depthStencilTexture),e.setRenderTarget(_))}let $e=T[Fe];$e===void 0&&($e=new Gn,$e.layers.enable(Fe),$e.viewport=new At,T[Fe]=$e),$e.matrix.fromArray(We.transform.matrix),$e.matrix.decompose($e.position,$e.quaternion,$e.scale),$e.projectionMatrix.fromArray(We.projectionMatrix),$e.projectionMatrixInverse.copy($e.projectionMatrix).invert(),$e.viewport.set(xt.x,xt.y,xt.width,xt.height),Fe===0&&(S.matrix.copy($e.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),ae===!0&&S.cameras.push($e)}const De=r.enabledFeatures;if(De&&De.includes("depth-sensing")){const Fe=h.getDepthInformation(_e[0]);Fe&&Fe.isValid&&Fe.texture&&v.init(e,Fe,r.renderState)}}for(let _e=0;_e<x.length;_e++){const ae=y[_e],De=x[_e];ae!==null&&De!==void 0&&De.update(ae,re,c||o)}le&&le(K,re),re.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:re}),g=null}const Je=new Fv;Je.setAnimationLoop(we),this.setAnimationLoop=function(K){le=K},this.dispose=function(){}}}const Lr=new vi,nR=new Mt;function iR(t,e){function n(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function i(m,f){f.color.getRGB(m.fogColor.value,Nv(t)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function r(m,f,_,x,y){f.isMeshBasicMaterial||f.isMeshLambertMaterial?s(m,f):f.isMeshToonMaterial?(s(m,f),h(m,f)):f.isMeshPhongMaterial?(s(m,f),u(m,f)):f.isMeshStandardMaterial?(s(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,y)):f.isMeshMatcapMaterial?(s(m,f),g(m,f)):f.isMeshDepthMaterial?s(m,f):f.isMeshDistanceMaterial?(s(m,f),v(m,f)):f.isMeshNormalMaterial?s(m,f):f.isLineBasicMaterial?(o(m,f),f.isLineDashedMaterial&&a(m,f)):f.isPointsMaterial?l(m,f,_,x):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function s(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,n(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,n(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,n(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===wn&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,n(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===wn&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,n(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,n(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,n(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const _=e.get(f),x=_.envMap,y=_.envMapRotation;x&&(m.envMap.value=x,Lr.copy(y),Lr.x*=-1,Lr.y*=-1,Lr.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(Lr.y*=-1,Lr.z*=-1),m.envMapRotation.value.setFromMatrix4(nR.makeRotationFromEuler(Lr)),m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,n(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,n(f.aoMap,m.aoMapTransform))}function o(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,n(f.map,m.mapTransform))}function a(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,_,x){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*_,m.scale.value=x*.5,f.map&&(m.map.value=f.map,n(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,n(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,n(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,n(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function u(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function h(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,n(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,n(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,_){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,n(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,n(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,n(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,n(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,n(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===wn&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,n(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,n(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=_.texture,m.transmissionSamplerSize.value.set(_.width,_.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,n(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,n(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,n(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,n(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,n(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function v(m,f){const _=e.get(f).light;m.referencePosition.value.setFromMatrixPosition(_.matrixWorld),m.nearDistance.value=_.shadow.camera.near,m.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function rR(t,e,n,i){let r={},s={},o=[];const a=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function l(_,x){const y=x.program;i.uniformBlockBinding(_,y)}function c(_,x){let y=r[_.id];y===void 0&&(g(_),y=u(_),r[_.id]=y,_.addEventListener("dispose",m));const b=x.program;i.updateUBOMapping(_,b);const A=e.render.frame;s[_.id]!==A&&(d(_),s[_.id]=A)}function u(_){const x=h();_.__bindingPointIndex=x;const y=t.createBuffer(),b=_.__size,A=_.usage;return t.bindBuffer(t.UNIFORM_BUFFER,y),t.bufferData(t.UNIFORM_BUFFER,b,A),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,x,y),y}function h(){for(let _=0;_<a;_++)if(o.indexOf(_)===-1)return o.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(_){const x=r[_.id],y=_.uniforms,b=_.__cache;t.bindBuffer(t.UNIFORM_BUFFER,x);for(let A=0,R=y.length;A<R;A++){const C=Array.isArray(y[A])?y[A]:[y[A]];for(let T=0,S=C.length;T<S;T++){const P=C[T];if(p(P,A,T,b)===!0){const j=P.__offset,H=Array.isArray(P.value)?P.value:[P.value];let Y=0;for(let ee=0;ee<H.length;ee++){const X=H[ee],ie=v(X);typeof X=="number"||typeof X=="boolean"?(P.__data[0]=X,t.bufferSubData(t.UNIFORM_BUFFER,j+Y,P.__data)):X.isMatrix3?(P.__data[0]=X.elements[0],P.__data[1]=X.elements[1],P.__data[2]=X.elements[2],P.__data[3]=0,P.__data[4]=X.elements[3],P.__data[5]=X.elements[4],P.__data[6]=X.elements[5],P.__data[7]=0,P.__data[8]=X.elements[6],P.__data[9]=X.elements[7],P.__data[10]=X.elements[8],P.__data[11]=0):(X.toArray(P.__data,Y),Y+=ie.storage/Float32Array.BYTES_PER_ELEMENT)}t.bufferSubData(t.UNIFORM_BUFFER,j,P.__data)}}}t.bindBuffer(t.UNIFORM_BUFFER,null)}function p(_,x,y,b){const A=_.value,R=x+"_"+y;if(b[R]===void 0)return typeof A=="number"||typeof A=="boolean"?b[R]=A:b[R]=A.clone(),!0;{const C=b[R];if(typeof A=="number"||typeof A=="boolean"){if(C!==A)return b[R]=A,!0}else if(C.equals(A)===!1)return C.copy(A),!0}return!1}function g(_){const x=_.uniforms;let y=0;const b=16;for(let R=0,C=x.length;R<C;R++){const T=Array.isArray(x[R])?x[R]:[x[R]];for(let S=0,P=T.length;S<P;S++){const j=T[S],H=Array.isArray(j.value)?j.value:[j.value];for(let Y=0,ee=H.length;Y<ee;Y++){const X=H[Y],ie=v(X),L=y%b,$=L%ie.boundary,J=L+$;y+=$,J!==0&&b-J<ie.storage&&(y+=b-J),j.__data=new Float32Array(ie.storage/Float32Array.BYTES_PER_ELEMENT),j.__offset=y,y+=ie.storage}}}const A=y%b;return A>0&&(y+=b-A),_.__size=y,_.__cache={},this}function v(_){const x={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(x.boundary=4,x.storage=4):_.isVector2?(x.boundary=8,x.storage=8):_.isVector3||_.isColor?(x.boundary=16,x.storage=12):_.isVector4?(x.boundary=16,x.storage=16):_.isMatrix3?(x.boundary=48,x.storage=48):_.isMatrix4?(x.boundary=64,x.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),x}function m(_){const x=_.target;x.removeEventListener("dispose",m);const y=o.indexOf(x.__bindingPointIndex);o.splice(y,1),t.deleteBuffer(r[x.id]),delete r[x.id],delete s[x.id]}function f(){for(const _ in r)t.deleteBuffer(r[_]);o=[],r={},s={}}return{bind:l,update:c,dispose:f}}class sR{constructor(e={}){const{canvas:n=YM(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reverseDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=o;const g=new Uint32Array(4),v=new Int32Array(4);let m=null,f=null;const _=[],x=[];this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Pn,this.toneMapping=vr,this.toneMappingExposure=1;const y=this;let b=!1,A=0,R=0,C=null,T=-1,S=null;const P=new At,j=new At;let H=null;const Y=new Le(0);let ee=0,X=n.width,ie=n.height,L=1,$=null,J=null;const le=new At(0,0,X,ie),we=new At(0,0,X,ie);let Je=!1;const K=new ip;let re=!1,_e=!1;const ae=new Mt,De=new Mt,Fe=new k,We=new At,xt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let $e=!1;function Rt(){return C===null?L:1}let U=i;function Fn(E,D){return n.getContext(E,D)}try{const E={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${Yd}`),n.addEventListener("webglcontextlost",Q,!1),n.addEventListener("webglcontextrestored",pe,!1),n.addEventListener("webglcontextcreationerror",he,!1),U===null){const D="webgl2";if(U=Fn(D,E),U===null)throw Fn(D)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let je,Ye,be,dt,Ce,w,M,F,Z,te,q,Ae,fe,ve,qe,se,xe,Pe,Ue,ye,Ke,He,ut,I;function ue(){je=new uw(U),je.init(),He=new $A(U,je),Ye=new rw(U,je,e,He),be=new jA(U,je),Ye.reverseDepthBuffer&&d&&be.buffers.depth.setReversed(!0),dt=new dw(U),Ce=new LA,w=new KA(U,je,be,Ce,Ye,He,dt),M=new ow(y),F=new cw(y),Z=new yE(U),ut=new nw(U,Z),te=new fw(U,Z,dt,ut),q=new mw(U,te,Z,dt),Ue=new pw(U,Ye,w),se=new sw(Ce),Ae=new PA(y,M,F,je,Ye,ut,se),fe=new iR(y,Ce),ve=new DA,qe=new BA(je),Pe=new tw(y,M,F,be,q,p,l),xe=new WA(y,q,Ye),I=new rR(U,dt,Ye,be),ye=new iw(U,je,dt),Ke=new hw(U,je,dt),dt.programs=Ae.programs,y.capabilities=Ye,y.extensions=je,y.properties=Ce,y.renderLists=ve,y.shadowMap=xe,y.state=be,y.info=dt}ue();const W=new tR(y,U);this.xr=W,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const E=je.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=je.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return L},this.setPixelRatio=function(E){E!==void 0&&(L=E,this.setSize(X,ie,!1))},this.getSize=function(E){return E.set(X,ie)},this.setSize=function(E,D,B=!0){if(W.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}X=E,ie=D,n.width=Math.floor(E*L),n.height=Math.floor(D*L),B===!0&&(n.style.width=E+"px",n.style.height=D+"px"),this.setViewport(0,0,E,D)},this.getDrawingBufferSize=function(E){return E.set(X*L,ie*L).floor()},this.setDrawingBufferSize=function(E,D,B){X=E,ie=D,L=B,n.width=Math.floor(E*B),n.height=Math.floor(D*B),this.setViewport(0,0,E,D)},this.getCurrentViewport=function(E){return E.copy(P)},this.getViewport=function(E){return E.copy(le)},this.setViewport=function(E,D,B,z){E.isVector4?le.set(E.x,E.y,E.z,E.w):le.set(E,D,B,z),be.viewport(P.copy(le).multiplyScalar(L).round())},this.getScissor=function(E){return E.copy(we)},this.setScissor=function(E,D,B,z){E.isVector4?we.set(E.x,E.y,E.z,E.w):we.set(E,D,B,z),be.scissor(j.copy(we).multiplyScalar(L).round())},this.getScissorTest=function(){return Je},this.setScissorTest=function(E){be.setScissorTest(Je=E)},this.setOpaqueSort=function(E){$=E},this.setTransparentSort=function(E){J=E},this.getClearColor=function(E){return E.copy(Pe.getClearColor())},this.setClearColor=function(){Pe.setClearColor.apply(Pe,arguments)},this.getClearAlpha=function(){return Pe.getClearAlpha()},this.setClearAlpha=function(){Pe.setClearAlpha.apply(Pe,arguments)},this.clear=function(E=!0,D=!0,B=!0){let z=0;if(E){let N=!1;if(C!==null){const oe=C.texture.format;N=oe===ep||oe===Jd||oe===Qd}if(N){const oe=C.texture.type,de=oe===Wi||oe===is||oe===Ma||oe===lo||oe===qd||oe===Zd,Se=Pe.getClearColor(),Me=Pe.getClearAlpha(),Oe=Se.r,Be=Se.g,Ee=Se.b;de?(g[0]=Oe,g[1]=Be,g[2]=Ee,g[3]=Me,U.clearBufferuiv(U.COLOR,0,g)):(v[0]=Oe,v[1]=Be,v[2]=Ee,v[3]=Me,U.clearBufferiv(U.COLOR,0,v))}else z|=U.COLOR_BUFFER_BIT}D&&(z|=U.DEPTH_BUFFER_BIT),B&&(z|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear(z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",Q,!1),n.removeEventListener("webglcontextrestored",pe,!1),n.removeEventListener("webglcontextcreationerror",he,!1),ve.dispose(),qe.dispose(),Ce.dispose(),M.dispose(),F.dispose(),q.dispose(),ut.dispose(),I.dispose(),Ae.dispose(),W.dispose(),W.removeEventListener("sessionstart",hp),W.removeEventListener("sessionend",dp),wr.stop()};function Q(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),b=!0}function pe(){console.log("THREE.WebGLRenderer: Context Restored."),b=!1;const E=dt.autoReset,D=xe.enabled,B=xe.autoUpdate,z=xe.needsUpdate,N=xe.type;ue(),dt.autoReset=E,xe.enabled=D,xe.autoUpdate=B,xe.needsUpdate=z,xe.type=N}function he(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function ke(E){const D=E.target;D.removeEventListener("dispose",ke),Tt(D)}function Tt(E){Kt(E),Ce.remove(E)}function Kt(E){const D=Ce.get(E).programs;D!==void 0&&(D.forEach(function(B){Ae.releaseProgram(B)}),E.isShaderMaterial&&Ae.releaseShaderCache(E))}this.renderBufferDirect=function(E,D,B,z,N,oe){D===null&&(D=xt);const de=N.isMesh&&N.matrixWorld.determinant()<0,Se=px(E,D,B,z,N);be.setMaterial(z,de);let Me=B.index,Oe=1;if(z.wireframe===!0){if(Me=te.getWireframeAttribute(B),Me===void 0)return;Oe=2}const Be=B.drawRange,Ee=B.attributes.position;let et=Be.start*Oe,ft=(Be.start+Be.count)*Oe;oe!==null&&(et=Math.max(et,oe.start*Oe),ft=Math.min(ft,(oe.start+oe.count)*Oe)),Me!==null?(et=Math.max(et,0),ft=Math.min(ft,Me.count)):Ee!=null&&(et=Math.max(et,0),ft=Math.min(ft,Ee.count));const pt=ft-et;if(pt<0||pt===1/0)return;ut.setup(N,z,Se,B,Me);let _n,tt=ye;if(Me!==null&&(_n=Z.get(Me),tt=Ke,tt.setIndex(_n)),N.isMesh)z.wireframe===!0?(be.setLineWidth(z.wireframeLinewidth*Rt()),tt.setMode(U.LINES)):tt.setMode(U.TRIANGLES);else if(N.isLine){let Re=z.linewidth;Re===void 0&&(Re=1),be.setLineWidth(Re*Rt()),N.isLineSegments?tt.setMode(U.LINES):N.isLineLoop?tt.setMode(U.LINE_LOOP):tt.setMode(U.LINE_STRIP)}else N.isPoints?tt.setMode(U.POINTS):N.isSprite&&tt.setMode(U.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)tt.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(je.get("WEBGL_multi_draw"))tt.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{const Re=N._multiDrawStarts,Mi=N._multiDrawCounts,nt=N._multiDrawCount,$n=Me?Z.get(Me).bytesPerElement:1,ls=Ce.get(z).currentProgram.getUniforms();for(let An=0;An<nt;An++)ls.setValue(U,"_gl_DrawID",An),tt.render(Re[An]/$n,Mi[An])}else if(N.isInstancedMesh)tt.renderInstances(et,pt,N.count);else if(B.isInstancedBufferGeometry){const Re=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,Mi=Math.min(B.instanceCount,Re);tt.renderInstances(et,pt,Mi)}else tt.render(et,pt)};function ot(E,D,B){E.transparent===!0&&E.side===Ln&&E.forceSinglePass===!1?(E.side=wn,E.needsUpdate=!0,ka(E,D,B),E.side=Vi,E.needsUpdate=!0,ka(E,D,B),E.side=Ln):ka(E,D,B)}this.compile=function(E,D,B=null){B===null&&(B=E),f=qe.get(B),f.init(D),x.push(f),B.traverseVisible(function(N){N.isLight&&N.layers.test(D.layers)&&(f.pushLight(N),N.castShadow&&f.pushShadow(N))}),E!==B&&E.traverseVisible(function(N){N.isLight&&N.layers.test(D.layers)&&(f.pushLight(N),N.castShadow&&f.pushShadow(N))}),f.setupLights();const z=new Set;return E.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;const oe=N.material;if(oe)if(Array.isArray(oe))for(let de=0;de<oe.length;de++){const Se=oe[de];ot(Se,B,N),z.add(Se)}else ot(oe,B,N),z.add(oe)}),x.pop(),f=null,z},this.compileAsync=function(E,D,B=null){const z=this.compile(E,D,B);return new Promise(N=>{function oe(){if(z.forEach(function(de){Ce.get(de).currentProgram.isReady()&&z.delete(de)}),z.size===0){N(E);return}setTimeout(oe,10)}je.get("KHR_parallel_shader_compile")!==null?oe():setTimeout(oe,10)})};let Kn=null;function Si(E){Kn&&Kn(E)}function hp(){wr.stop()}function dp(){wr.start()}const wr=new Fv;wr.setAnimationLoop(Si),typeof self<"u"&&wr.setContext(self),this.setAnimationLoop=function(E){Kn=E,W.setAnimationLoop(E),E===null?wr.stop():wr.start()},W.addEventListener("sessionstart",hp),W.addEventListener("sessionend",dp),this.render=function(E,D){if(D!==void 0&&D.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(b===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),W.enabled===!0&&W.isPresenting===!0&&(W.cameraAutoUpdate===!0&&W.updateCamera(D),D=W.getCamera()),E.isScene===!0&&E.onBeforeRender(y,E,D,C),f=qe.get(E,x.length),f.init(D),x.push(f),De.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),K.setFromProjectionMatrix(De),_e=this.localClippingEnabled,re=se.init(this.clippingPlanes,_e),m=ve.get(E,_.length),m.init(),_.push(m),W.enabled===!0&&W.isPresenting===!0){const oe=y.xr.getDepthSensingMesh();oe!==null&&nu(oe,D,-1/0,y.sortObjects)}nu(E,D,0,y.sortObjects),m.finish(),y.sortObjects===!0&&m.sort($,J),$e=W.enabled===!1||W.isPresenting===!1||W.hasDepthSensing()===!1,$e&&Pe.addToRenderList(m,E),this.info.render.frame++,re===!0&&se.beginShadows();const B=f.state.shadowsArray;xe.render(B,E,D),re===!0&&se.endShadows(),this.info.autoReset===!0&&this.info.reset();const z=m.opaque,N=m.transmissive;if(f.setupLights(),D.isArrayCamera){const oe=D.cameras;if(N.length>0)for(let de=0,Se=oe.length;de<Se;de++){const Me=oe[de];mp(z,N,E,Me)}$e&&Pe.render(E);for(let de=0,Se=oe.length;de<Se;de++){const Me=oe[de];pp(m,E,Me,Me.viewport)}}else N.length>0&&mp(z,N,E,D),$e&&Pe.render(E),pp(m,E,D);C!==null&&(w.updateMultisampleRenderTarget(C),w.updateRenderTargetMipmap(C)),E.isScene===!0&&E.onAfterRender(y,E,D),ut.resetDefaultState(),T=-1,S=null,x.pop(),x.length>0?(f=x[x.length-1],re===!0&&se.setGlobalState(y.clippingPlanes,f.state.camera)):f=null,_.pop(),_.length>0?m=_[_.length-1]:m=null};function nu(E,D,B,z){if(E.visible===!1)return;if(E.layers.test(D.layers)){if(E.isGroup)B=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(D);else if(E.isLight)f.pushLight(E),E.castShadow&&f.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||K.intersectsSprite(E)){z&&We.setFromMatrixPosition(E.matrixWorld).applyMatrix4(De);const de=q.update(E),Se=E.material;Se.visible&&m.push(E,de,Se,B,We.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||K.intersectsObject(E))){const de=q.update(E),Se=E.material;if(z&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),We.copy(E.boundingSphere.center)):(de.boundingSphere===null&&de.computeBoundingSphere(),We.copy(de.boundingSphere.center)),We.applyMatrix4(E.matrixWorld).applyMatrix4(De)),Array.isArray(Se)){const Me=de.groups;for(let Oe=0,Be=Me.length;Oe<Be;Oe++){const Ee=Me[Oe],et=Se[Ee.materialIndex];et&&et.visible&&m.push(E,de,et,B,We.z,Ee)}}else Se.visible&&m.push(E,de,Se,B,We.z,null)}}const oe=E.children;for(let de=0,Se=oe.length;de<Se;de++)nu(oe[de],D,B,z)}function pp(E,D,B,z){const N=E.opaque,oe=E.transmissive,de=E.transparent;f.setupLightsView(B),re===!0&&se.setGlobalState(y.clippingPlanes,B),z&&be.viewport(P.copy(z)),N.length>0&&Fa(N,D,B),oe.length>0&&Fa(oe,D,B),de.length>0&&Fa(de,D,B),be.buffers.depth.setTest(!0),be.buffers.depth.setMask(!0),be.buffers.color.setMask(!0),be.setPolygonOffset(!1)}function mp(E,D,B,z){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[z.id]===void 0&&(f.state.transmissionRenderTarget[z.id]=new rs(1,1,{generateMipmaps:!0,type:je.has("EXT_color_buffer_half_float")||je.has("EXT_color_buffer_float")?Ia:Wi,minFilter:Kr,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ze.workingColorSpace}));const oe=f.state.transmissionRenderTarget[z.id],de=z.viewport||P;oe.setSize(de.z,de.w);const Se=y.getRenderTarget();y.setRenderTarget(oe),y.getClearColor(Y),ee=y.getClearAlpha(),ee<1&&y.setClearColor(16777215,.5),y.clear(),$e&&Pe.render(B);const Me=y.toneMapping;y.toneMapping=vr;const Oe=z.viewport;if(z.viewport!==void 0&&(z.viewport=void 0),f.setupLightsView(z),re===!0&&se.setGlobalState(y.clippingPlanes,z),Fa(E,B,z),w.updateMultisampleRenderTarget(oe),w.updateRenderTargetMipmap(oe),je.has("WEBGL_multisampled_render_to_texture")===!1){let Be=!1;for(let Ee=0,et=D.length;Ee<et;Ee++){const ft=D[Ee],pt=ft.object,_n=ft.geometry,tt=ft.material,Re=ft.group;if(tt.side===Ln&&pt.layers.test(z.layers)){const Mi=tt.side;tt.side=wn,tt.needsUpdate=!0,gp(pt,B,z,_n,tt,Re),tt.side=Mi,tt.needsUpdate=!0,Be=!0}}Be===!0&&(w.updateMultisampleRenderTarget(oe),w.updateRenderTargetMipmap(oe))}y.setRenderTarget(Se),y.setClearColor(Y,ee),Oe!==void 0&&(z.viewport=Oe),y.toneMapping=Me}function Fa(E,D,B){const z=D.isScene===!0?D.overrideMaterial:null;for(let N=0,oe=E.length;N<oe;N++){const de=E[N],Se=de.object,Me=de.geometry,Oe=z===null?de.material:z,Be=de.group;Se.layers.test(B.layers)&&gp(Se,D,B,Me,Oe,Be)}}function gp(E,D,B,z,N,oe){E.onBeforeRender(y,D,B,z,N,oe),E.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),N.onBeforeRender(y,D,B,z,E,oe),N.transparent===!0&&N.side===Ln&&N.forceSinglePass===!1?(N.side=wn,N.needsUpdate=!0,y.renderBufferDirect(B,D,z,N,E,oe),N.side=Vi,N.needsUpdate=!0,y.renderBufferDirect(B,D,z,N,E,oe),N.side=Ln):y.renderBufferDirect(B,D,z,N,E,oe),E.onAfterRender(y,D,B,z,N,oe)}function ka(E,D,B){D.isScene!==!0&&(D=xt);const z=Ce.get(E),N=f.state.lights,oe=f.state.shadowsArray,de=N.state.version,Se=Ae.getParameters(E,N.state,oe,D,B),Me=Ae.getProgramCacheKey(Se);let Oe=z.programs;z.environment=E.isMeshStandardMaterial?D.environment:null,z.fog=D.fog,z.envMap=(E.isMeshStandardMaterial?F:M).get(E.envMap||z.environment),z.envMapRotation=z.environment!==null&&E.envMap===null?D.environmentRotation:E.envMapRotation,Oe===void 0&&(E.addEventListener("dispose",ke),Oe=new Map,z.programs=Oe);let Be=Oe.get(Me);if(Be!==void 0){if(z.currentProgram===Be&&z.lightsStateVersion===de)return vp(E,Se),Be}else Se.uniforms=Ae.getUniforms(E),E.onBeforeCompile(Se,y),Be=Ae.acquireProgram(Se,Me),Oe.set(Me,Be),z.uniforms=Se.uniforms;const Ee=z.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Ee.clippingPlanes=se.uniform),vp(E,Se),z.needsLights=gx(E),z.lightsStateVersion=de,z.needsLights&&(Ee.ambientLightColor.value=N.state.ambient,Ee.lightProbe.value=N.state.probe,Ee.directionalLights.value=N.state.directional,Ee.directionalLightShadows.value=N.state.directionalShadow,Ee.spotLights.value=N.state.spot,Ee.spotLightShadows.value=N.state.spotShadow,Ee.rectAreaLights.value=N.state.rectArea,Ee.ltc_1.value=N.state.rectAreaLTC1,Ee.ltc_2.value=N.state.rectAreaLTC2,Ee.pointLights.value=N.state.point,Ee.pointLightShadows.value=N.state.pointShadow,Ee.hemisphereLights.value=N.state.hemi,Ee.directionalShadowMap.value=N.state.directionalShadowMap,Ee.directionalShadowMatrix.value=N.state.directionalShadowMatrix,Ee.spotShadowMap.value=N.state.spotShadowMap,Ee.spotLightMatrix.value=N.state.spotLightMatrix,Ee.spotLightMap.value=N.state.spotLightMap,Ee.pointShadowMap.value=N.state.pointShadowMap,Ee.pointShadowMatrix.value=N.state.pointShadowMatrix),z.currentProgram=Be,z.uniformsList=null,Be}function _p(E){if(E.uniformsList===null){const D=E.currentProgram.getUniforms();E.uniformsList=ec.seqWithValue(D.seq,E.uniforms)}return E.uniformsList}function vp(E,D){const B=Ce.get(E);B.outputColorSpace=D.outputColorSpace,B.batching=D.batching,B.batchingColor=D.batchingColor,B.instancing=D.instancing,B.instancingColor=D.instancingColor,B.instancingMorph=D.instancingMorph,B.skinning=D.skinning,B.morphTargets=D.morphTargets,B.morphNormals=D.morphNormals,B.morphColors=D.morphColors,B.morphTargetsCount=D.morphTargetsCount,B.numClippingPlanes=D.numClippingPlanes,B.numIntersection=D.numClipIntersection,B.vertexAlphas=D.vertexAlphas,B.vertexTangents=D.vertexTangents,B.toneMapping=D.toneMapping}function px(E,D,B,z,N){D.isScene!==!0&&(D=xt),w.resetTextureUnits();const oe=D.fog,de=z.isMeshStandardMaterial?D.environment:null,Se=C===null?y.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:go,Me=(z.isMeshStandardMaterial?F:M).get(z.envMap||de),Oe=z.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,Be=!!B.attributes.tangent&&(!!z.normalMap||z.anisotropy>0),Ee=!!B.morphAttributes.position,et=!!B.morphAttributes.normal,ft=!!B.morphAttributes.color;let pt=vr;z.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(pt=y.toneMapping);const _n=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,tt=_n!==void 0?_n.length:0,Re=Ce.get(z),Mi=f.state.lights;if(re===!0&&(_e===!0||E!==S)){const kn=E===S&&z.id===T;se.setState(z,E,kn)}let nt=!1;z.version===Re.__version?(Re.needsLights&&Re.lightsStateVersion!==Mi.state.version||Re.outputColorSpace!==Se||N.isBatchedMesh&&Re.batching===!1||!N.isBatchedMesh&&Re.batching===!0||N.isBatchedMesh&&Re.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&Re.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&Re.instancing===!1||!N.isInstancedMesh&&Re.instancing===!0||N.isSkinnedMesh&&Re.skinning===!1||!N.isSkinnedMesh&&Re.skinning===!0||N.isInstancedMesh&&Re.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&Re.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&Re.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&Re.instancingMorph===!1&&N.morphTexture!==null||Re.envMap!==Me||z.fog===!0&&Re.fog!==oe||Re.numClippingPlanes!==void 0&&(Re.numClippingPlanes!==se.numPlanes||Re.numIntersection!==se.numIntersection)||Re.vertexAlphas!==Oe||Re.vertexTangents!==Be||Re.morphTargets!==Ee||Re.morphNormals!==et||Re.morphColors!==ft||Re.toneMapping!==pt||Re.morphTargetsCount!==tt)&&(nt=!0):(nt=!0,Re.__version=z.version);let $n=Re.currentProgram;nt===!0&&($n=ka(z,D,N));let ls=!1,An=!1,So=!1;const mt=$n.getUniforms(),li=Re.uniforms;if(be.useProgram($n.program)&&(ls=!0,An=!0,So=!0),z.id!==T&&(T=z.id,An=!0),ls||S!==E){be.buffers.depth.getReversed()?(ae.copy(E.projectionMatrix),$M(ae),qM(ae),mt.setValue(U,"projectionMatrix",ae)):mt.setValue(U,"projectionMatrix",E.projectionMatrix),mt.setValue(U,"viewMatrix",E.matrixWorldInverse);const Yi=mt.map.cameraPosition;Yi!==void 0&&Yi.setValue(U,Fe.setFromMatrixPosition(E.matrixWorld)),Ye.logarithmicDepthBuffer&&mt.setValue(U,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(z.isMeshPhongMaterial||z.isMeshToonMaterial||z.isMeshLambertMaterial||z.isMeshBasicMaterial||z.isMeshStandardMaterial||z.isShaderMaterial)&&mt.setValue(U,"isOrthographic",E.isOrthographicCamera===!0),S!==E&&(S=E,An=!0,So=!0)}if(N.isSkinnedMesh){mt.setOptional(U,N,"bindMatrix"),mt.setOptional(U,N,"bindMatrixInverse");const kn=N.skeleton;kn&&(kn.boneTexture===null&&kn.computeBoneTexture(),mt.setValue(U,"boneTexture",kn.boneTexture,w))}N.isBatchedMesh&&(mt.setOptional(U,N,"batchingTexture"),mt.setValue(U,"batchingTexture",N._matricesTexture,w),mt.setOptional(U,N,"batchingIdTexture"),mt.setValue(U,"batchingIdTexture",N._indirectTexture,w),mt.setOptional(U,N,"batchingColorTexture"),N._colorsTexture!==null&&mt.setValue(U,"batchingColorTexture",N._colorsTexture,w));const Mo=B.morphAttributes;if((Mo.position!==void 0||Mo.normal!==void 0||Mo.color!==void 0)&&Ue.update(N,B,$n),(An||Re.receiveShadow!==N.receiveShadow)&&(Re.receiveShadow=N.receiveShadow,mt.setValue(U,"receiveShadow",N.receiveShadow)),z.isMeshGouraudMaterial&&z.envMap!==null&&(li.envMap.value=Me,li.flipEnvMap.value=Me.isCubeTexture&&Me.isRenderTargetTexture===!1?-1:1),z.isMeshStandardMaterial&&z.envMap===null&&D.environment!==null&&(li.envMapIntensity.value=D.environmentIntensity),An&&(mt.setValue(U,"toneMappingExposure",y.toneMappingExposure),Re.needsLights&&mx(li,So),oe&&z.fog===!0&&fe.refreshFogUniforms(li,oe),fe.refreshMaterialUniforms(li,z,L,ie,f.state.transmissionRenderTarget[E.id]),ec.upload(U,_p(Re),li,w)),z.isShaderMaterial&&z.uniformsNeedUpdate===!0&&(ec.upload(U,_p(Re),li,w),z.uniformsNeedUpdate=!1),z.isSpriteMaterial&&mt.setValue(U,"center",N.center),mt.setValue(U,"modelViewMatrix",N.modelViewMatrix),mt.setValue(U,"normalMatrix",N.normalMatrix),mt.setValue(U,"modelMatrix",N.matrixWorld),z.isShaderMaterial||z.isRawShaderMaterial){const kn=z.uniformsGroups;for(let Yi=0,Ki=kn.length;Yi<Ki;Yi++){const xp=kn[Yi];I.update(xp,$n),I.bind(xp,$n)}}return $n}function mx(E,D){E.ambientLightColor.needsUpdate=D,E.lightProbe.needsUpdate=D,E.directionalLights.needsUpdate=D,E.directionalLightShadows.needsUpdate=D,E.pointLights.needsUpdate=D,E.pointLightShadows.needsUpdate=D,E.spotLights.needsUpdate=D,E.spotLightShadows.needsUpdate=D,E.rectAreaLights.needsUpdate=D,E.hemisphereLights.needsUpdate=D}function gx(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(E,D,B){Ce.get(E.texture).__webglTexture=D,Ce.get(E.depthTexture).__webglTexture=B;const z=Ce.get(E);z.__hasExternalTextures=!0,z.__autoAllocateDepthBuffer=B===void 0,z.__autoAllocateDepthBuffer||je.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),z.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,D){const B=Ce.get(E);B.__webglFramebuffer=D,B.__useDefaultFramebuffer=D===void 0},this.setRenderTarget=function(E,D=0,B=0){C=E,A=D,R=B;let z=!0,N=null,oe=!1,de=!1;if(E){const Me=Ce.get(E);if(Me.__useDefaultFramebuffer!==void 0)be.bindFramebuffer(U.FRAMEBUFFER,null),z=!1;else if(Me.__webglFramebuffer===void 0)w.setupRenderTarget(E);else if(Me.__hasExternalTextures)w.rebindTextures(E,Ce.get(E.texture).__webglTexture,Ce.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Ee=E.depthTexture;if(Me.__boundDepthTexture!==Ee){if(Ee!==null&&Ce.has(Ee)&&(E.width!==Ee.image.width||E.height!==Ee.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");w.setupDepthRenderbuffer(E)}}const Oe=E.texture;(Oe.isData3DTexture||Oe.isDataArrayTexture||Oe.isCompressedArrayTexture)&&(de=!0);const Be=Ce.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Be[D])?N=Be[D][B]:N=Be[D],oe=!0):E.samples>0&&w.useMultisampledRTT(E)===!1?N=Ce.get(E).__webglMultisampledFramebuffer:Array.isArray(Be)?N=Be[B]:N=Be,P.copy(E.viewport),j.copy(E.scissor),H=E.scissorTest}else P.copy(le).multiplyScalar(L).floor(),j.copy(we).multiplyScalar(L).floor(),H=Je;if(be.bindFramebuffer(U.FRAMEBUFFER,N)&&z&&be.drawBuffers(E,N),be.viewport(P),be.scissor(j),be.setScissorTest(H),oe){const Me=Ce.get(E.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+D,Me.__webglTexture,B)}else if(de){const Me=Ce.get(E.texture),Oe=D||0;U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,Me.__webglTexture,B||0,Oe)}T=-1},this.readRenderTargetPixels=function(E,D,B,z,N,oe,de){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Se=Ce.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&de!==void 0&&(Se=Se[de]),Se){be.bindFramebuffer(U.FRAMEBUFFER,Se);try{const Me=E.texture,Oe=Me.format,Be=Me.type;if(!Ye.textureFormatReadable(Oe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ye.textureTypeReadable(Be)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=E.width-z&&B>=0&&B<=E.height-N&&U.readPixels(D,B,z,N,He.convert(Oe),He.convert(Be),oe)}finally{const Me=C!==null?Ce.get(C).__webglFramebuffer:null;be.bindFramebuffer(U.FRAMEBUFFER,Me)}}},this.readRenderTargetPixelsAsync=async function(E,D,B,z,N,oe,de){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Se=Ce.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&de!==void 0&&(Se=Se[de]),Se){const Me=E.texture,Oe=Me.format,Be=Me.type;if(!Ye.textureFormatReadable(Oe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ye.textureTypeReadable(Be))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(D>=0&&D<=E.width-z&&B>=0&&B<=E.height-N){be.bindFramebuffer(U.FRAMEBUFFER,Se);const Ee=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,Ee),U.bufferData(U.PIXEL_PACK_BUFFER,oe.byteLength,U.STREAM_READ),U.readPixels(D,B,z,N,He.convert(Oe),He.convert(Be),0);const et=C!==null?Ce.get(C).__webglFramebuffer:null;be.bindFramebuffer(U.FRAMEBUFFER,et);const ft=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await KM(U,ft,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,Ee),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,oe),U.deleteBuffer(Ee),U.deleteSync(ft),oe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,D=null,B=0){E.isTexture!==!0&&(Go("WebGLRenderer: copyFramebufferToTexture function signature has changed."),D=arguments[0]||null,E=arguments[1]);const z=Math.pow(2,-B),N=Math.floor(E.image.width*z),oe=Math.floor(E.image.height*z),de=D!==null?D.x:0,Se=D!==null?D.y:0;w.setTexture2D(E,0),U.copyTexSubImage2D(U.TEXTURE_2D,B,0,0,de,Se,N,oe),be.unbindTexture()},this.copyTextureToTexture=function(E,D,B=null,z=null,N=0){E.isTexture!==!0&&(Go("WebGLRenderer: copyTextureToTexture function signature has changed."),z=arguments[0]||null,E=arguments[1],D=arguments[2],N=arguments[3]||0,B=null);let oe,de,Se,Me,Oe,Be,Ee,et,ft;const pt=E.isCompressedTexture?E.mipmaps[N]:E.image;B!==null?(oe=B.max.x-B.min.x,de=B.max.y-B.min.y,Se=B.isBox3?B.max.z-B.min.z:1,Me=B.min.x,Oe=B.min.y,Be=B.isBox3?B.min.z:0):(oe=pt.width,de=pt.height,Se=pt.depth||1,Me=0,Oe=0,Be=0),z!==null?(Ee=z.x,et=z.y,ft=z.z):(Ee=0,et=0,ft=0);const _n=He.convert(D.format),tt=He.convert(D.type);let Re;D.isData3DTexture?(w.setTexture3D(D,0),Re=U.TEXTURE_3D):D.isDataArrayTexture||D.isCompressedArrayTexture?(w.setTexture2DArray(D,0),Re=U.TEXTURE_2D_ARRAY):(w.setTexture2D(D,0),Re=U.TEXTURE_2D),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,D.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,D.unpackAlignment);const Mi=U.getParameter(U.UNPACK_ROW_LENGTH),nt=U.getParameter(U.UNPACK_IMAGE_HEIGHT),$n=U.getParameter(U.UNPACK_SKIP_PIXELS),ls=U.getParameter(U.UNPACK_SKIP_ROWS),An=U.getParameter(U.UNPACK_SKIP_IMAGES);U.pixelStorei(U.UNPACK_ROW_LENGTH,pt.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,pt.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Me),U.pixelStorei(U.UNPACK_SKIP_ROWS,Oe),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Be);const So=E.isDataArrayTexture||E.isData3DTexture,mt=D.isDataArrayTexture||D.isData3DTexture;if(E.isRenderTargetTexture||E.isDepthTexture){const li=Ce.get(E),Mo=Ce.get(D),kn=Ce.get(li.__renderTarget),Yi=Ce.get(Mo.__renderTarget);be.bindFramebuffer(U.READ_FRAMEBUFFER,kn.__webglFramebuffer),be.bindFramebuffer(U.DRAW_FRAMEBUFFER,Yi.__webglFramebuffer);for(let Ki=0;Ki<Se;Ki++)So&&U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Ce.get(E).__webglTexture,N,Be+Ki),E.isDepthTexture?(mt&&U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Ce.get(D).__webglTexture,N,ft+Ki),U.blitFramebuffer(Me,Oe,oe,de,Ee,et,oe,de,U.DEPTH_BUFFER_BIT,U.NEAREST)):mt?U.copyTexSubImage3D(Re,N,Ee,et,ft+Ki,Me,Oe,oe,de):U.copyTexSubImage2D(Re,N,Ee,et,ft+Ki,Me,Oe,oe,de);be.bindFramebuffer(U.READ_FRAMEBUFFER,null),be.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else mt?E.isDataTexture||E.isData3DTexture?U.texSubImage3D(Re,N,Ee,et,ft,oe,de,Se,_n,tt,pt.data):D.isCompressedArrayTexture?U.compressedTexSubImage3D(Re,N,Ee,et,ft,oe,de,Se,_n,pt.data):U.texSubImage3D(Re,N,Ee,et,ft,oe,de,Se,_n,tt,pt):E.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,N,Ee,et,oe,de,_n,tt,pt.data):E.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,N,Ee,et,pt.width,pt.height,_n,pt.data):U.texSubImage2D(U.TEXTURE_2D,N,Ee,et,oe,de,_n,tt,pt);U.pixelStorei(U.UNPACK_ROW_LENGTH,Mi),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,nt),U.pixelStorei(U.UNPACK_SKIP_PIXELS,$n),U.pixelStorei(U.UNPACK_SKIP_ROWS,ls),U.pixelStorei(U.UNPACK_SKIP_IMAGES,An),N===0&&D.generateMipmaps&&U.generateMipmap(Re),be.unbindTexture()},this.copyTextureToTexture3D=function(E,D,B=null,z=null,N=0){return E.isTexture!==!0&&(Go("WebGLRenderer: copyTextureToTexture3D function signature has changed."),B=arguments[0]||null,z=arguments[1]||null,E=arguments[2],D=arguments[3],N=arguments[4]||0),Go('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,D,B,z,N)},this.initRenderTarget=function(E){Ce.get(E).__webglFramebuffer===void 0&&w.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?w.setTextureCube(E,0):E.isData3DTexture?w.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?w.setTexture2DArray(E,0):w.setTexture2D(E,0),be.unbindTexture()},this.resetState=function(){A=0,R=0,C=null,be.reset(),ut.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Oi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorspace=Ze._getDrawingBufferColorSpace(e),n.unpackColorSpace=Ze._getUnpackColorSpace()}}class oR extends jt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new vi,this.environmentIntensity=1,this.environmentRotation=new vi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}}class Wv extends xo{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new Le(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Pc=new k,Lc=new k,Cg=new Mt,Uo=new bv,El=new Ua,rf=new k,bg=new k;class aR extends jt{constructor(e=new yi,n=new Wv){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[0];for(let r=1,s=n.count;r<s;r++)Pc.fromBufferAttribute(n,r-1),Lc.fromBufferAttribute(n,r),i[r]=i[r-1],i[r]+=Pc.distanceTo(Lc);e.setAttribute("lineDistance",new _i(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,n){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),El.copy(i.boundingSphere),El.applyMatrix4(r),El.radius+=s,e.ray.intersectsSphere(El)===!1)return;Cg.copy(r).invert(),Uo.copy(e.ray).applyMatrix4(Cg);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=i.index,d=i.attributes.position;if(u!==null){const p=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let v=p,m=g-1;v<m;v+=c){const f=u.getX(v),_=u.getX(v+1),x=Tl(this,e,Uo,l,f,_);x&&n.push(x)}if(this.isLineLoop){const v=u.getX(g-1),m=u.getX(p),f=Tl(this,e,Uo,l,v,m);f&&n.push(f)}}else{const p=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let v=p,m=g-1;v<m;v+=c){const f=Tl(this,e,Uo,l,v,v+1);f&&n.push(f)}if(this.isLineLoop){const v=Tl(this,e,Uo,l,g-1,p);v&&n.push(v)}}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function Tl(t,e,n,i,r,s){const o=t.geometry.attributes.position;if(Pc.fromBufferAttribute(o,r),Lc.fromBufferAttribute(o,s),n.distanceSqToSegment(Pc,Lc,rf,bg)>i)return;rf.applyMatrix4(t.matrixWorld);const l=e.ray.origin.distanceTo(rf);if(!(l<e.near||l>e.far))return{distance:l,point:bg.clone().applyMatrix4(t.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:t}}const Pg=new k,Lg=new k;class lR extends aR{constructor(e,n){super(e,n),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[];for(let r=0,s=n.count;r<s;r+=2)Pg.fromBufferAttribute(n,r),Lg.fromBufferAttribute(n,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+Pg.distanceTo(Lg);e.setAttribute("lineDistance",new _i(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Xv extends pn{constructor(e,n,i,r,s,o,a,l,c){super(e,n,i,r,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}const wl=new k,Al=new k,sf=new k,Rl=new Vn;class cR extends yi{constructor(e=null,n=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:n},e!==null){const r=Math.pow(10,4),s=Math.cos(qs*n),o=e.getIndex(),a=e.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],u=["a","b","c"],h=new Array(3),d={},p=[];for(let g=0;g<l;g+=3){o?(c[0]=o.getX(g),c[1]=o.getX(g+1),c[2]=o.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);const{a:v,b:m,c:f}=Rl;if(v.fromBufferAttribute(a,c[0]),m.fromBufferAttribute(a,c[1]),f.fromBufferAttribute(a,c[2]),Rl.getNormal(sf),h[0]=`${Math.round(v.x*r)},${Math.round(v.y*r)},${Math.round(v.z*r)}`,h[1]=`${Math.round(m.x*r)},${Math.round(m.y*r)},${Math.round(m.z*r)}`,h[2]=`${Math.round(f.x*r)},${Math.round(f.y*r)},${Math.round(f.z*r)}`,!(h[0]===h[1]||h[1]===h[2]||h[2]===h[0]))for(let _=0;_<3;_++){const x=(_+1)%3,y=h[_],b=h[x],A=Rl[u[_]],R=Rl[u[x]],C=`${y}_${b}`,T=`${b}_${y}`;T in d&&d[T]?(sf.dot(d[T].normal)<=s&&(p.push(A.x,A.y,A.z),p.push(R.x,R.y,R.z)),d[T]=null):C in d||(d[C]={index0:c[_],index1:c[x],normal:sf.clone()})}}for(const g in d)if(d[g]){const{index0:v,index1:m}=d[g];wl.fromBufferAttribute(a,v),Al.fromBufferAttribute(a,m),p.push(wl.x,wl.y,wl.z),p.push(Al.x,Al.y,Al.z)}this.setAttribute("position",new _i(p,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class Zr extends xo{static get type(){return"MeshLambertMaterial"}constructor(e){super(),this.isMeshLambertMaterial=!0,this.color=new Le(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Le(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Tv,this.normalScale=new st(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new vi,this.combine=Kd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class jv extends jt{constructor(e,n=1){super(),this.isLight=!0,this.type="Light",this.color=new Le(e),this.intensity=n}dispose(){}copy(e,n){return super.copy(e,n),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const n=super.toJSON(e);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,this.groundColor!==void 0&&(n.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(n.object.distance=this.distance),this.angle!==void 0&&(n.object.angle=this.angle),this.decay!==void 0&&(n.object.decay=this.decay),this.penumbra!==void 0&&(n.object.penumbra=this.penumbra),this.shadow!==void 0&&(n.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(n.object.target=this.target.uuid),n}}const of=new Mt,Ig=new k,Dg=new k;class uR{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new st(512,512),this.map=null,this.mapPass=null,this.matrix=new Mt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ip,this._frameExtents=new st(1,1),this._viewportCount=1,this._viewports=[new At(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const n=this.camera,i=this.matrix;Ig.setFromMatrixPosition(e.matrixWorld),n.position.copy(Ig),Dg.setFromMatrixPosition(e.target.matrixWorld),n.lookAt(Dg),n.updateMatrixWorld(),of.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(of),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(of)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class fR extends uR{constructor(){super(new kv(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class hR extends jv{constructor(e,n){super(e,n),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(jt.DEFAULT_UP),this.updateMatrix(),this.target=new jt,this.shadow=new fR}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class dR extends jv{constructor(e,n){super(e,n),this.isAmbientLight=!0,this.type="AmbientLight"}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Yd}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Yd);const O={GRASS_TOP:0,GRASS_SIDE:1,DIRT:2,STONE:3,COBBLESTONE:4,MOSSY_COBBLESTONE:5,BEDROCK:6,SAND:7,GRAVEL:8,SANDSTONE_TOP:9,SANDSTONE_SIDE:10,OAK_LOG_SIDE:11,OAK_LOG_TOP:12,OAK_LEAVES:13,BIRCH_LOG_SIDE:14,BIRCH_LEAVES:15,OAK_PLANKS:16,COAL_ORE:17,IRON_ORE:18,GOLD_ORE:19,DIAMOND_ORE:20,GLASS:21,SNOW_TOP:22,SNOW_SIDE:23,CACTUS_SIDE:24,CACTUS_TOP:25,TALL_GRASS:26,FLOWER_RED:27,FLOWER_YELLOW:28,TORCH:29,CRAFTING_TABLE_TOP:30,CRAFTING_TABLE_SIDE:31,CRAFTING_TABLE_FRONT:32,FURNACE_FRONT:33,FURNACE_FRONT_LIT:34,FURNACE_SIDE:35,FURNACE_TOP:36,CHEST_FRONT:37,CHEST_SIDE:38,CHEST_TOP:39,HOPPER_TOP:40,HOPPER_SIDE:41,SPAWNER:42,WOOL:43,GLOWSTONE:44,WATER:45,LAVA:46,IRON_BLOCK:47,CRACK_0:48,CRACK_1:49,CRACK_2:50,CRACK_3:51,ITEM_STICK:52,ITEM_COAL:53,ITEM_CHARCOAL:54,ITEM_RAW_IRON:55,ITEM_IRON_INGOT:56,ITEM_GOLD_INGOT:57,ITEM_DIAMOND:58,ITEM_PICK_WOOD:59,ITEM_PICK_IRON:60,ITEM_PICK_DIAMOND:61,ITEM_SWORD_WOOD:62,ITEM_SWORD_IRON:63,ITEM_SWORD_DIAMOND:64,ITEM_MUTTON_RAW:65,ITEM_MUTTON_COOKED:66,ITEM_ARROW:67,ITEM_WHEAT:68},pR=32,Wo=1024,Te=32,V={AIR:0,STONE:1,GRASS:2,DIRT:3,COBBLESTONE:4,OAK_PLANKS:5,BEDROCK:6,SAND:7,GRAVEL:8,OAK_LOG:9,OAK_LEAVES:10,BIRCH_LOG:11,BIRCH_LEAVES:12,COAL_ORE:13,IRON_ORE:14,GOLD_ORE:15,DIAMOND_ORE:16,SANDSTONE:17,MOSSY_COBBLESTONE:18,GLASS:19,SNOW_GRASS:20,CACTUS:21,TALL_GRASS:22,FLOWER_RED:23,FLOWER_YELLOW:24,TORCH:25,CRAFTING_TABLE:26,CHEST_N:27,CHEST_S:28,CHEST_E:29,CHEST_W:30,FURNACE_N:31,FURNACE_S:32,FURNACE_E:33,FURNACE_W:34,FURNACE_LIT_N:35,FURNACE_LIT_S:36,FURNACE_LIT_E:37,FURNACE_LIT_W:38,HOPPER:39,SPAWNER:40,WOOL:41,GLOWSTONE:42,IRON_BLOCK:43,WATER_SRC:44,WATER_FLOW_7:45,WATER_FLOW_1:51,LAVA_SRC:52,LAVA_FLOW_3:53,LAVA_FLOW_1:55};function lt(t){return[t,t,t,t,t,t]}function as(t,e,n){return[e,e,t,n,e,e]}const Yv={solid:!0,opaque:!0,renderType:1,hardness:1,tool:"none",minTier:0,lightEmit:0,lightFilter:15,replaceable:!1,randomTicks:!1},Ic=new Array(256);function Ie(t,e,n,i={}){Ic[t]={...Yv,id:t,name:e,tiles:n,...i}}Ie(V.AIR,"Air",lt(0),{solid:!1,opaque:!1,renderType:0,hardness:-1,lightFilter:0,replaceable:!0});Ie(V.STONE,"Stone",lt(O.STONE),{hardness:1.5,tool:"pickaxe",minTier:1,drop:V.COBBLESTONE});Ie(V.GRASS,"Grass Block",as(O.GRASS_TOP,O.GRASS_SIDE,O.DIRT),{hardness:.6,drop:V.DIRT,randomTicks:!0});Ie(V.DIRT,"Dirt",lt(O.DIRT),{hardness:.5});Ie(V.COBBLESTONE,"Cobblestone",lt(O.COBBLESTONE),{hardness:2,tool:"pickaxe",minTier:1});Ie(V.OAK_PLANKS,"Oak Planks",lt(O.OAK_PLANKS),{hardness:2});Ie(V.BEDROCK,"Bedrock",lt(O.BEDROCK),{hardness:-1});Ie(V.SAND,"Sand",lt(O.SAND),{hardness:.5});Ie(V.GRAVEL,"Gravel",lt(O.GRAVEL),{hardness:.6});Ie(V.OAK_LOG,"Oak Log",as(O.OAK_LOG_TOP,O.OAK_LOG_SIDE,O.OAK_LOG_TOP),{hardness:2});Ie(V.OAK_LEAVES,"Oak Leaves",lt(O.OAK_LEAVES),{opaque:!1,renderType:2,hardness:.2,drop:-1,lightFilter:1,randomTicks:!0});Ie(V.BIRCH_LOG,"Birch Log",as(O.OAK_LOG_TOP,O.BIRCH_LOG_SIDE,O.OAK_LOG_TOP),{hardness:2});Ie(V.BIRCH_LEAVES,"Birch Leaves",lt(O.BIRCH_LEAVES),{opaque:!1,renderType:2,hardness:.2,drop:-1,lightFilter:1,randomTicks:!0});Ie(V.COAL_ORE,"Coal Ore",lt(O.COAL_ORE),{hardness:3,tool:"pickaxe",minTier:1,drop:257});Ie(V.IRON_ORE,"Iron Ore",lt(O.IRON_ORE),{hardness:3,tool:"pickaxe",minTier:1,drop:259});Ie(V.GOLD_ORE,"Gold Ore",lt(O.GOLD_ORE),{hardness:3,tool:"pickaxe",minTier:2,drop:V.GOLD_ORE});Ie(V.DIAMOND_ORE,"Diamond Ore",lt(O.DIAMOND_ORE),{hardness:3,tool:"pickaxe",minTier:2,drop:262});Ie(V.SANDSTONE,"Sandstone",as(O.SANDSTONE_TOP,O.SANDSTONE_SIDE,O.SANDSTONE_TOP),{hardness:.8,tool:"pickaxe",minTier:1});Ie(V.MOSSY_COBBLESTONE,"Mossy Cobblestone",lt(O.MOSSY_COBBLESTONE),{hardness:2,tool:"pickaxe",minTier:1});Ie(V.GLASS,"Glass",lt(O.GLASS),{opaque:!1,renderType:2,hardness:.3,drop:-1,lightFilter:0});Ie(V.SNOW_GRASS,"Snowy Grass",as(O.SNOW_TOP,O.SNOW_SIDE,O.DIRT),{hardness:.6,drop:V.DIRT});Ie(V.CACTUS,"Cactus",as(O.CACTUS_TOP,O.CACTUS_SIDE,O.CACTUS_TOP),{hardness:.4,opaque:!1,renderType:2});Ie(V.TALL_GRASS,"Tall Grass",lt(O.TALL_GRASS),{solid:!1,opaque:!1,renderType:3,hardness:.05,drop:-1,lightFilter:0,replaceable:!0});Ie(V.FLOWER_RED,"Poppy",lt(O.FLOWER_RED),{solid:!1,opaque:!1,renderType:3,hardness:.05,lightFilter:0});Ie(V.FLOWER_YELLOW,"Dandelion",lt(O.FLOWER_YELLOW),{solid:!1,opaque:!1,renderType:3,hardness:.05,lightFilter:0});Ie(V.TORCH,"Torch",lt(O.TORCH),{solid:!1,opaque:!1,renderType:3,hardness:.05,lightEmit:14,lightFilter:0});Ie(V.CRAFTING_TABLE,"Crafting Table",[O.CRAFTING_TABLE_SIDE,O.CRAFTING_TABLE_SIDE,O.CRAFTING_TABLE_TOP,O.OAK_PLANKS,O.CRAFTING_TABLE_FRONT,O.CRAFTING_TABLE_FRONT],{hardness:2.5});function Qc(t){const e=O.CHEST_FRONT,n=O.CHEST_SIDE,i=O.CHEST_TOP;return t==="n"?[n,n,i,i,n,e]:t==="s"?[n,n,i,i,e,n]:t==="e"?[e,n,i,i,n,n]:[n,e,i,i,n,n]}Ie(V.CHEST_N,"Chest",Qc("n"),{hardness:2.5});Ie(V.CHEST_S,"Chest",Qc("s"),{hardness:2.5,drop:V.CHEST_N});Ie(V.CHEST_E,"Chest",Qc("e"),{hardness:2.5,drop:V.CHEST_N});Ie(V.CHEST_W,"Chest",Qc("w"),{hardness:2.5,drop:V.CHEST_N});function Tr(t,e){const n=e?O.FURNACE_FRONT_LIT:O.FURNACE_FRONT,i=O.FURNACE_SIDE,r=O.FURNACE_TOP;return t==="n"?[i,i,r,r,i,n]:t==="s"?[i,i,r,r,n,i]:t==="e"?[n,i,r,r,i,i]:[i,n,r,r,i,i]}Ie(V.FURNACE_N,"Furnace",Tr("n",!1),{hardness:3.5,tool:"pickaxe",minTier:1,drop:V.FURNACE_N});Ie(V.FURNACE_S,"Furnace",Tr("s",!1),{hardness:3.5,tool:"pickaxe",minTier:1,drop:V.FURNACE_N});Ie(V.FURNACE_E,"Furnace",Tr("e",!1),{hardness:3.5,tool:"pickaxe",minTier:1,drop:V.FURNACE_N});Ie(V.FURNACE_W,"Furnace",Tr("w",!1),{hardness:3.5,tool:"pickaxe",minTier:1,drop:V.FURNACE_N});Ie(V.FURNACE_LIT_N,"Furnace",Tr("n",!0),{hardness:3.5,tool:"pickaxe",minTier:1,drop:V.FURNACE_N,lightEmit:13});Ie(V.FURNACE_LIT_S,"Furnace",Tr("s",!0),{hardness:3.5,tool:"pickaxe",minTier:1,drop:V.FURNACE_N,lightEmit:13});Ie(V.FURNACE_LIT_E,"Furnace",Tr("e",!0),{hardness:3.5,tool:"pickaxe",minTier:1,drop:V.FURNACE_N,lightEmit:13});Ie(V.FURNACE_LIT_W,"Furnace",Tr("w",!0),{hardness:3.5,tool:"pickaxe",minTier:1,drop:V.FURNACE_N,lightEmit:13});Ie(V.HOPPER,"Hopper",as(O.HOPPER_TOP,O.HOPPER_SIDE,O.HOPPER_SIDE),{hardness:3,tool:"pickaxe",minTier:1});Ie(V.SPAWNER,"Monster Spawner",lt(O.SPAWNER),{opaque:!1,renderType:2,hardness:5,tool:"pickaxe",minTier:1,drop:-1,lightFilter:0});Ie(V.WOOL,"Wool",lt(O.WOOL),{hardness:.8});Ie(V.GLOWSTONE,"Glowstone",lt(O.GLOWSTONE),{hardness:.3,lightEmit:15});Ie(V.IRON_BLOCK,"Iron Block",lt(O.IRON_BLOCK),{hardness:5,tool:"pickaxe",minTier:1});const Jc={solid:!1,opaque:!1,renderType:4,hardness:-1,drop:-1,replaceable:!0};Ie(V.WATER_SRC,"Water",lt(O.WATER),{...Jc,lightFilter:2});for(let t=0;t<7;t++)Ie(V.WATER_FLOW_7+t,"Flowing Water",lt(O.WATER),{...Jc,lightFilter:2});Ie(V.LAVA_SRC,"Lava",lt(O.LAVA),{...Jc,lightEmit:15,lightFilter:15});for(let t=0;t<3;t++)Ie(V.LAVA_FLOW_3+t,"Flowing Lava",lt(O.LAVA),{...Jc,lightEmit:15,lightFilter:15});for(let t=0;t<256;t++)Ic[t]||(Ic[t]={...Yv,id:t,name:"Unknown",tiles:lt(O.STONE),solid:!1,opaque:!1,renderType:0,lightFilter:0,replaceable:!0});function Kv(t){return t>=V.WATER_SRC&&t<=V.WATER_FLOW_1}function mR(t){return t>=V.LAVA_SRC&&t<=V.LAVA_FLOW_1}function Xo(t){return t>=V.WATER_SRC&&t<=V.LAVA_FLOW_1}function Ng(t){return t===V.WATER_SRC||t===V.LAVA_SRC?8:t>=V.WATER_FLOW_7&&t<=V.WATER_FLOW_1?7-(t-V.WATER_FLOW_7):t>=V.LAVA_FLOW_3&&t<=V.LAVA_FLOW_1?3-(t-V.LAVA_FLOW_3):0}function jo(t){return t>=V.CHEST_N&&t<=V.CHEST_W}function Kh(t){return t>=V.FURNACE_N&&t<=V.FURNACE_LIT_W}function gR(t){return jo(t)||Kh(t)||t===V.HOPPER}function _R(t){return gR(t)||t===V.CRAFTING_TABLE}function Lt(t){return Ic[t&255]}function vR(t){let e=1779033703^t.length;for(let n=0;n<t.length;n++)e=Math.imul(e^t.charCodeAt(n),3432918353),e=e<<13|e>>>19;return e=Math.imul(e^e>>>16,2246822507),e=Math.imul(e^e>>>13,3266489909),(e^=e>>>16)>>>0}function xR(t){let e=t>>>0;return function(){e|=0,e=e+1831565813|0;let n=Math.imul(e^e>>>15,1|e);return n=n+Math.imul(n^n>>>7,61|n)^n,((n^n>>>14)>>>0)/4294967296}}class yR{constructor(e,n,i,r){this.img=e,this.ox=n,this.oy=i,this.rand=r}px(e,n,i,r,s,o=255){if(e<0||e>=Te||n<0||n>=Te)return;const a=((this.oy+n)*Wo+this.ox+e)*4,l=this.img.data;l[a]=i,l[a+1]=r,l[a+2]=s,l[a+3]=o}noiseFill(e,n){for(let i=0;i<Te;i++)for(let r=0;r<Te;r++){const s=1+(this.rand()-.5)*n;this.px(r,i,e[0]*s,e[1]*s,e[2]*s)}}cellNoise(e,n,i=4){const r=Te/i,s=[];for(let o=0;o<r*r;o++)s.push(1+(this.rand()-.5)*n);for(let o=0;o<Te;o++)for(let a=0;a<Te;a++){const l=s[Math.floor(o/i)*r+Math.floor(a/i)]*(1+(this.rand()-.5)*n*.4);this.px(a,o,e[0]*l,e[1]*l,e[2]*l)}}speckle(e,n,i=2){for(let r=0;r<n;r++){const s=Math.floor(this.rand()*(Te-i)),o=Math.floor(this.rand()*(Te-i));for(let a=0;a<i;a++)for(let l=0;l<i;l++){const c=1+(this.rand()-.5)*.25;this.px(s+l,o+a,e[0]*c,e[1]*c,e[2]*c)}}}border(e,n=1){for(let i=0;i<Te;i++)for(let r=0;r<n;r++)this.px(i,r,e[0],e[1],e[2]),this.px(i,Te-1-r,e[0],e[1],e[2]),this.px(r,i,e[0],e[1],e[2]),this.px(Te-1-r,i,e[0],e[1],e[2])}grainV(e,n,i){this.noiseFill(e,.15);for(let r=0;r<i;r++){let s=Math.floor(this.rand()*Te);for(let o=0;o<Te;o++){this.rand()<.15&&(s+=this.rand()<.5?-1:1);const a=1+(this.rand()-.5)*.2;this.px((s+Te)%Te,o,n[0]*a,n[1]*a,n[2]*a)}}}clear(){for(let e=0;e<Te;e++)for(let n=0;n<Te;n++)this.px(n,e,0,0,0,0)}}const Cl=[106,170,64],af=[134,96,67],Vr=[125,125,125],SR=[219,207,163],MR=[156,127,78],lf=[58,121,39];function bl(t){t.noiseFill(MR,.12);for(const e of[7,15,23,31])for(let n=0;n<Te;n++)t.px(n,e,92,70,40);for(const[e,n]of[[15,0],[7,8],[23,16],[11,24]])for(let i=n;i<n+7;i++)t.px(e,i,92,70,40)}function Ug(t){return e=>{e.cellNoise(Vr,.35,8);for(let n=0;n<9;n++){const i=n%3*11+5+Math.floor(e.rand()*3),r=Math.floor(n/3)*11+5+Math.floor(e.rand()*3),s=4+e.rand()*2;for(let o=0;o<Te;o++)for(let a=0;a<Te;a++){const l=Math.hypot(a-i,o-r);l>s-1&&l<s+.5&&e.px(a,o,70,70,70)}}if(t)for(let n=0;n<60;n++){const i=Math.floor(e.rand()*Te),r=Math.floor(e.rand()*Te);e.px(i,r,80,120,50),e.px(i+1,r,70,110,45)}}}function Pl(t){return e=>{e.cellNoise(Vr,.3,4);for(let n=0;n<7;n++){const i=3+Math.floor(e.rand()*(Te-8)),r=3+Math.floor(e.rand()*(Te-8)),s=2+Math.floor(e.rand()*2);for(let o=0;o<s;o++)for(let a=0;a<s;a++){const l=1+(e.rand()-.5)*.3;e.px(i+a,r+o,t[0]*l,t[1]*l,t[2]*l)}}}}function Ts(t,e){return n=>{n.clear();const i=[120,90,50];if(e==="pick"){for(let r=4;r<24;r++)n.px(r,31-r,i[0],i[1],i[2]),n.px(r+1,31-r,i[0]*.8,i[1]*.8,i[2]*.8),n.px(r+2,31-r,0,0,0,0);for(let r=0;r<=28;r++){const s=Math.PI*.25+r/28*Math.PI*.5,o=Math.round(20+Math.cos(s)*11),a=Math.round(12-Math.sin(s)*11+4);for(let l=0;l<3;l++)n.px(o+l,a,t[0],t[1],t[2]),n.px(o+l,a+1,t[0]*.8,t[1]*.8,t[2]*.8)}}else{for(let r=0;r<18;r++){const s=10+r,o=21-r;n.px(s,o,t[0],t[1],t[2]),n.px(s+1,o,t[0]*1.1,t[1]*1.1,t[2]*1.1),n.px(s,o-1,t[0]*.85,t[1]*.85,t[2]*.85)}n.px(9,20,80,60,30),n.px(10,21,80,60,30),n.px(8,21,80,60,30),n.px(9,22,80,60,30);for(let r=0;r<7;r++)n.px(7-r+1,23+r,i[0],i[1],i[2]),n.px(7-r,23+r,i[0]*.8,i[1]*.8,i[2]*.8)}}}function Ll(t){return e=>{e.clear();const n=3+t*3;for(let i=0;i<n;i++){let r=Math.floor(e.rand()*Te),s=Math.floor(e.rand()*Te);const o=6+t*5;for(let a=0;a<o&&(e.px(r,s,20,16,12,200),r+=Math.floor(e.rand()*3)-1,s+=Math.floor(e.rand()*3)-1,!(r<0||r>=Te||s<0||s>=Te));a++);}}}const ER={[O.GRASS_TOP]:t=>{t.noiseFill(Cl,.22),t.speckle([90,150,50],26,1)},[O.GRASS_SIDE]:t=>{t.noiseFill(af,.2);for(let e=0;e<Te;e++){const n=4+Math.floor(t.rand()*4);for(let i=0;i<n;i++){const r=1+(t.rand()-.5)*.2;t.px(e,i,Cl[0]*r,Cl[1]*r,Cl[2]*r)}}},[O.DIRT]:t=>{t.noiseFill(af,.25),t.speckle([110,78,52],18,2)},[O.STONE]:t=>t.cellNoise(Vr,.22,4),[O.COBBLESTONE]:Ug(!1),[O.MOSSY_COBBLESTONE]:Ug(!0),[O.BEDROCK]:t=>t.cellNoise([60,60,60],.7,4),[O.SAND]:t=>{t.noiseFill(SR,.12),t.speckle([200,188,142],20,1)},[O.GRAVEL]:t=>t.cellNoise([118,110,105],.42,3),[O.SANDSTONE_TOP]:t=>{t.noiseFill([216,203,155],.08),t.border([196,183,135])},[O.SANDSTONE_SIDE]:t=>{t.noiseFill([216,203,155],.08);for(const e of[10,21])for(let n=0;n<Te;n++)t.px(n,e,190,176,128)},[O.OAK_LOG_SIDE]:t=>t.grainV([104,82,49],[80,62,36],7),[O.OAK_LOG_TOP]:t=>{t.noiseFill([104,82,49],.12);for(let e=2;e<15;e+=3)for(let n=0;n<360;n+=4){const i=Math.round(15.5+Math.cos(n*Math.PI/180)*e),r=Math.round(15.5+Math.sin(n*Math.PI/180)*e);t.px(i,r,156,127,78)}},[O.OAK_LEAVES]:t=>{t.clear();for(let e=0;e<Te;e++)for(let n=0;n<Te;n++)if(t.rand()<.82){const i=1+(t.rand()-.5)*.45;t.px(n,e,lf[0]*i,lf[1]*i,lf[2]*i)}},[O.BIRCH_LOG_SIDE]:t=>{t.grainV([214,210,200],[190,186,176],4);for(let e=0;e<7;e++){const n=Math.floor(t.rand()*28),i=Math.floor(t.rand()*30);for(let r=0;r<4;r++)t.px(n+r,i,40,38,34)}},[O.BIRCH_LEAVES]:t=>{t.clear();for(let e=0;e<Te;e++)for(let n=0;n<Te;n++)if(t.rand()<.8){const i=1+(t.rand()-.5)*.4;t.px(n,e,96*i,150*i,70*i)}},[O.OAK_PLANKS]:bl,[O.COAL_ORE]:Pl([38,38,38]),[O.IRON_ORE]:Pl([216,175,147]),[O.GOLD_ORE]:Pl([252,222,112]),[O.DIAMOND_ORE]:Pl([93,236,245]),[O.GLASS]:t=>{t.clear(),t.border([210,235,240],1);for(const[e,n]of[[6,6],[7,7],[8,8],[22,20],[23,21]])t.px(e,n,230,245,250,180)},[O.SNOW_TOP]:t=>t.noiseFill([240,246,250],.05),[O.SNOW_SIDE]:t=>{t.noiseFill(af,.2);for(let e=0;e<Te;e++)for(let n=0;n<8;n++)t.px(e,n,240,246,250)},[O.CACTUS_SIDE]:t=>{t.noiseFill([58,124,48],.15);for(let e=3;e<Te;e+=7)for(let n=0;n<Te;n++)t.px(e,n,38,90,32);t.speckle([150,180,120],8,1)},[O.CACTUS_TOP]:t=>{t.noiseFill([70,140,58],.12),t.border([48,104,40],2)},[O.TALL_GRASS]:t=>{t.clear();for(let e=0;e<9;e++){let n=4+e*3;for(let i=31;i>8+Math.floor(t.rand()*8);i--){const r=1+(t.rand()-.5)*.3;t.px(n,i,92*r,158*r,60*r),t.rand()<.25&&(n+=t.rand()<.5?-1:1)}}},[O.FLOWER_RED]:t=>{t.clear();for(let e=14;e<32;e++)t.px(15,e,58,110,40);t.px(14,20,58,110,40);for(let e=-3;e<=3;e++)for(let n=-3;n<=3;n++)Math.abs(n)+Math.abs(e)<=4&&t.px(15+n,10+e,214,48,40);t.px(15,10,40,30,20)},[O.FLOWER_YELLOW]:t=>{t.clear();for(let e=14;e<32;e++)t.px(16,e,58,110,40);for(let e=-3;e<=3;e++)for(let n=-3;n<=3;n++)n*n+e*e<=9&&t.px(16+n,10+e,240,214,70);t.px(16,10,180,140,30)},[O.TORCH]:t=>{t.clear();for(let e=12;e<32;e++)t.px(15,e,120,90,50),t.px(16,e,100,75,40);for(let e=0;e<5;e++)for(let n=-1;n<=2;n++)t.px(15+n,7+e,255,200-e*18,60);t.px(15,5,255,240,160),t.px(16,5,255,240,160)},[O.CRAFTING_TABLE_TOP]:t=>{bl(t),t.border([60,45,28],2);for(let e=8;e<24;e++)t.px(e,15,60,45,28),t.px(e,16,60,45,28),t.px(15,e,60,45,28),t.px(16,e,60,45,28)},[O.CRAFTING_TABLE_SIDE]:t=>{bl(t);for(let e=0;e<4;e++)for(let n=0;n<Te;n++)t.px(n,e,92,70,40)},[O.CRAFTING_TABLE_FRONT]:t=>{bl(t);for(let e=0;e<10;e++)t.px(8+e,18-e,60,45,28),t.px(20+e%3,12+e,70,50,30)},[O.FURNACE_FRONT]:t=>{t.cellNoise(Vr,.2,8);for(let e=18;e<28;e++)for(let n=10;n<22;n++)t.px(n,e,30,30,30)},[O.FURNACE_FRONT_LIT]:t=>{t.cellNoise(Vr,.2,8);for(let e=18;e<28;e++)for(let n=10;n<22;n++)t.rand()<.5?t.px(n,e,255,140+t.rand()*60,30):t.px(n,e,60,30,15)},[O.FURNACE_SIDE]:t=>t.cellNoise(Vr,.2,8),[O.FURNACE_TOP]:t=>{t.cellNoise(Vr,.18,8),t.border([95,95,95],2)},[O.CHEST_FRONT]:t=>{t.noiseFill([162,116,56],.1),t.border([110,78,38],2);for(let e=0;e<Te;e++)t.px(e,14,110,78,38);for(let e=12;e<18;e++)for(let n=14;n<18;n++)t.px(n,e,150,150,150)},[O.CHEST_SIDE]:t=>{t.noiseFill([162,116,56],.1),t.border([110,78,38],2);for(let e=0;e<Te;e++)t.px(e,14,110,78,38)},[O.CHEST_TOP]:t=>{t.noiseFill([170,124,62],.1),t.border([110,78,38],2)},[O.HOPPER_TOP]:t=>{t.noiseFill([72,72,72],.12),t.border([50,50,50],3);for(let e=12;e<20;e++)for(let n=12;n<20;n++)t.px(n,e,25,25,25)},[O.HOPPER_SIDE]:t=>{t.noiseFill([85,85,85],.12);for(let e=0;e<Te;e++){const n=Math.floor(e/2.5);for(let i=0;i<n;i++)t.px(i,e,40,40,40,(e>16,255)),t.px(Te-1-i,e,40,40,40)}},[O.SPAWNER]:t=>{t.clear(),t.noiseFill([28,38,48],.3);for(let e=0;e<Te;e++)for(let n=0;n<Te;n++)e%6>=3&&n%6>=3&&e>2&&e<29&&n>2&&n<29&&t.px(e,n,0,0,0,0)},[O.WOOL]:t=>{t.noiseFill([228,228,228],.1);for(let e=0;e<26;e++){const n=Math.floor(t.rand()*30),i=Math.floor(t.rand()*30);t.px(n,i,205,205,205),t.px(n+1,i+1,215,215,215)}},[O.GLOWSTONE]:t=>{t.cellNoise([220,180,90],.3,4),t.speckle([255,230,150],16,2)},[O.WATER]:t=>{for(let e=0;e<Te;e++)for(let n=0;n<Te;n++){const i=1+(t.rand()-.5)*.18;t.px(n,e,50*i,95*i,195*i,255)}},[O.LAVA]:t=>{t.cellNoise([207,90,25],.4,4),t.speckle([255,200,60],14,3),t.speckle([120,30,10],10,3)},[O.IRON_BLOCK]:t=>{t.noiseFill([216,216,216],.05),t.border([180,180,180],2)},[O.CRACK_0]:Ll(0),[O.CRACK_1]:Ll(1),[O.CRACK_2]:Ll(2),[O.CRACK_3]:Ll(3),[O.ITEM_STICK]:t=>{t.clear();for(let e=0;e<18;e++)t.px(8+e,24-e,120,90,50),t.px(9+e,24-e,100,75,40)},[O.ITEM_COAL]:t=>{t.clear();for(let e=-7;e<=7;e++)for(let n=-7;n<=7;n++)if(n*n+e*e<=49+t.rand()*8-4){const i=1+(t.rand()-.5)*.5;t.px(16+n,16+e,38*i,38*i,40*i)}},[O.ITEM_CHARCOAL]:t=>{t.clear();for(let e=-7;e<=7;e++)for(let n=-7;n<=7;n++)if(n*n+e*e<=49+t.rand()*8-4){const i=1+(t.rand()-.5)*.5;t.px(16+n,16+e,52*i,42*i,36*i)}},[O.ITEM_RAW_IRON]:t=>{t.clear();for(let e=-7;e<=7;e++)for(let n=-7;n<=7;n++)if(Math.abs(n)+Math.abs(e)<=9){const i=1+(t.rand()-.5)*.3;t.px(16+n,16+e,216*i,175*i,147*i)}},[O.ITEM_IRON_INGOT]:t=>Og(t,[222,222,222]),[O.ITEM_GOLD_INGOT]:t=>Og(t,[250,215,90]),[O.ITEM_DIAMOND]:t=>{t.clear();for(let e=-8;e<=8;e++){const n=8-Math.abs(e);for(let i=-n;i<=n;i++){const r=1+(t.rand()-.5)*.25;t.px(16+i,15+e,93*r,236*r,245*r)}}},[O.ITEM_PICK_WOOD]:Ts([140,110,70],"pick"),[O.ITEM_PICK_IRON]:Ts([216,216,216],"pick"),[O.ITEM_PICK_DIAMOND]:Ts([93,236,245],"pick"),[O.ITEM_SWORD_WOOD]:Ts([140,110,70],"sword"),[O.ITEM_SWORD_IRON]:Ts([216,216,216],"sword"),[O.ITEM_SWORD_DIAMOND]:Ts([93,236,245],"sword"),[O.ITEM_MUTTON_RAW]:t=>Fg(t,[226,100,90],[240,226,220]),[O.ITEM_MUTTON_COOKED]:t=>Fg(t,[160,100,60],[120,70,40]),[O.ITEM_ARROW]:t=>{t.clear();for(let e=0;e<18;e++)t.px(7+e,25-e,130,100,60);for(let e=0;e<4;e++)t.px(24+e,8-e,200,200,200),t.px(24,8-e,200,200,200),t.px(24+e,8,200,200,200);for(let e=0;e<4;e++)t.px(6+e,26,230,230,230),t.px(6,26-e,230,230,230)},[O.ITEM_WHEAT]:t=>{t.clear();for(let e=0;e<3;e++){const n=10+e*5;for(let i=30;i>10;i--)t.px(n,i,178,152,66);for(let i=10;i<16;i++)t.px(n-1,i,210,186,88),t.px(n+1,i,210,186,88)}}};function Og(t,e){t.clear();for(let n=0;n<8;n++)for(let i=0;i<18;i++){const r=1-n*.04;t.px(7+i+(7-n),14+n,e[0]*r,e[1]*r,e[2]*r)}for(let n=0;n<18;n++)t.px(14+n,13,e[0]*1.1,e[1]*1.1,e[2]*1.1)}function Fg(t,e,n){t.clear();for(let i=-8;i<=8;i++)for(let r=-6;r<=6;r++)if(r*r/36+i*i/64<=1){const s=1+(t.rand()-.5)*.2;t.px(14+r,14+i,e[0]*s,e[1]*s,e[2]*s)}for(let i=0;i<8;i++)t.px(20+i,24+Math.floor(i/3),n[0],n[1],n[2])}class TR{canvas;texture;iconCache=new Map;constructor(e){this.canvas=document.createElement("canvas"),this.canvas.width=Wo,this.canvas.height=Wo;const n=this.canvas.getContext("2d",{willReadFrequently:!0}),i=n.createImageData(Wo,Wo);for(const[r,s]of Object.entries(ER)){const o=Number(r),a=o%32*Te,l=Math.floor(o/32)*Te,c=new yR(i,a,l,xR(e^o*7919+17));s(c)}n.putImageData(i,0,0),this.texture=new Xv(this.canvas),this.texture.magFilter=dn,this.texture.minFilter=dn,this.texture.generateMipmaps=!1,this.texture.wrapS=Ni,this.texture.wrapT=Ni,this.texture.colorSpace=Pn,this.texture.needsUpdate=!0}icon(e){let n=this.iconCache.get(e);if(!n){const i=document.createElement("canvas");i.width=Te,i.height=Te;const r=i.getContext("2d");r.imageSmoothingEnabled=!1,r.drawImage(this.canvas,e%32*Te,Math.floor(e/32)*Te,Te,Te,0,0,Te,Te),n=i.toDataURL(),this.iconCache.set(e,n)}return n}}function wR(){return{uSunLevel:{value:1},uFogColor:{value:new Le(8893925)},uFogNear:{value:60},uFogFar:{value:120},uTime:{value:0},uSkyTint:{value:new Le(1,1,1)}}}const $v=`
attribute vec2 aUv;
attribute float aTile;
attribute float aShade;
attribute vec2 aLight;

varying vec2 vUv;
varying float vTile;
varying float vShade;
varying vec2 vLight;
varying float vDist;

void main() {
  vUv = aUv;
  vTile = aTile;
  vShade = aShade;
  vLight = aLight;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vDist = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`;function qv(t){return`
uniform sampler2D uAtlas;
uniform float uSunLevel;
uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;
uniform float uTime;
uniform vec3 uSkyTint;

varying vec2 vUv;
varying float vTile;
varying float vShade;
varying vec2 vLight;
varying float vDist;

const float TILES = ${pR.toFixed(1)};
const float HALF_TEXEL = 0.5 / 32.0; // half texel in tile space (32px tiles)

void main() {
  float tile = floor(vTile + 0.5);
  vec2 tileOrigin = vec2(mod(tile, TILES), floor(tile / TILES));
  ${t?"vec2 inTile = fract(vUv + vec2(uTime * 0.02, uTime * 0.045));":"vec2 inTile = fract(vUv);"}
  inTile.y = 1.0 - inTile.y;
  inTile = clamp(inTile, vec2(HALF_TEXEL), vec2(1.0 - HALF_TEXEL));
  vec2 atlasUv = (tileOrigin + inTile) / TILES;
  // Atlas rows grow downward.
  atlasUv.y = 1.0 - atlasUv.y;
  vec4 tex = texture2D(uAtlas, atlasUv);
  ${t?"":"if (tex.a < 0.5) discard;"}

  float sun = (vLight.x / 15.0) * uSunLevel;
  float block = vLight.y / 15.0;
  float l = max(sun, block);
  float brightness = pow(l, 1.45) * 0.96 + 0.04;
  // Blocklight carries a warm tint; sunlight follows the sky tint.
  vec3 lightColor = mix(uSkyTint, vec3(1.0, 0.85, 0.6), clamp(block - sun, 0.0, 1.0) * 0.55);

  vec3 col = tex.rgb * vShade * brightness * lightColor;
  float fogF = smoothstep(uFogNear, uFogFar, vDist);
  col = mix(col, uFogColor, fogF);
  ${t?`float shimmer = 0.92 + 0.08 * sin(uTime * 2.2 + vUv.x * 6.2831 + vUv.y * 4.0);
  gl_FragColor = vec4(col * shimmer, 0.72);`:"gl_FragColor = vec4(col, 1.0);"}
}
`}function AR(t,e){return new xi({uniforms:{uAtlas:{value:t},...e},vertexShader:$v,fragmentShader:qv(!1),side:Vi})}function RR(t,e){return new xi({uniforms:{uAtlas:{value:t},...e},vertexShader:$v,fragmentShader:qv(!0),transparent:!0,depthWrite:!1,side:Ln})}const vn=256,CR=255,sp=8,Zv=3840,op=12,Qv=61440,Ir=15;function Yo(t,e,n){return t+(n<<4)+(e<<8)}function bR(t,e,n){return t&255|(e&15)<<sp|(n&15)<<op}function Oo(t){return t&CR}function Dr(t){return(t&Zv)>>sp}function Nr(t){return(t&Qv)>>op}function cf(t,e){return t&~Zv|(e&15)<<sp}function uf(t,e){return t&~Qv|(e&15)<<op}function Ct(t,e){return t+32768<<16|e+32768&65535}function Il(t){return(t>>>16)-32768}function Dl(t){return(t&65535)-32768}const Nl=[1,-1,0,0,0,0],ws=[0,0,1,-1,0,0],Ul=[0,0,0,0,1,-1];class PR{chunks=new Map;dirty=new Set;onCellChanged=null;addQ=[];remQ=[];hasChunk(e,n){return this.chunks.has(Ct(e,n))}addChunk(e,n,i){this.chunks.set(Ct(e,n),i)}removeChunk(e,n){this.chunks.delete(Ct(e,n))}getChunk(e,n){return this.chunks.get(Ct(e,n))}getVoxel(e,n,i){if(n<0||n>=vn)return 0;const r=this.chunks.get(Ct(e>>4,i>>4));return r?r[Yo(e&15,n,i&15)]:0}getBlockId(e,n,i){return Oo(this.getVoxel(e,n,i))}getSun(e,n,i){return n>=vn?Ir:Dr(this.getVoxel(e,n,i))}getBlockLight(e,n,i){return Nr(this.getVoxel(e,n,i))}lightAt(e,n,i,r){const s=this.getVoxel(e,n,i);return Math.max(Math.floor(Dr(s)*r/15),Nr(s))}setRaw(e,n,i,r){if(n<0||n>=vn)return;const s=e>>4,o=i>>4,a=this.chunks.get(Ct(s,o));a&&(a[Yo(e&15,n,i&15)]=r,this.markDirtyAround(e,n,i,s,o))}write(e,n,i,r){const s=e>>4,o=i>>4,a=this.chunks.get(Ct(s,o));a&&(a[Yo(e&15,n,i&15)]=r,this.markDirtyAround(e,n,i,s,o),this.onCellChanged&&this.onCellChanged(e,n,i,r))}markDirtyAround(e,n,i,r,s){this.dirty.add(Ct(r,s));const o=e&15,a=i&15;o===0?this.dirty.add(Ct(r-1,s)):o===15&&this.dirty.add(Ct(r+1,s)),a===0?this.dirty.add(Ct(r,s-1)):a===15&&this.dirty.add(Ct(r,s+1))}skyVisible(e,n,i){for(let r=n+1;r<vn;r++){const s=Lt(Oo(this.getVoxel(e,r,i)));if(s.opaque||s.lightFilter>0)return!1}return!0}highestSolid(e,n){for(let i=vn-1;i>=0;i--)if(Lt(Oo(this.getVoxel(e,i,n))).solid)return i;return 0}setBlock(e,n,i,r){if(n<0||n>=vn)return!1;const s=this.chunks.get(Ct(e>>4,i>>4));if(!s)return!1;const o=Yo(e&15,n,i&15),a=s[o];if(Oo(a)===r)return!1;const c=Dr(a),u=Nr(a),h=Lt(r);if(this.write(e,n,i,r),u>0&&this.removeLight(e,n,i,u,!1),h.lightEmit>0&&(this.write(e,n,i,uf(this.getVoxel(e,n,i),h.lightEmit)),this.addQ.push(e,n,i),this.spreadLight(!1)),!h.opaque){for(let d=0;d<6;d++)this.addQ.push(e+Nl[d],n+ws[d],i+Ul[d]);this.spreadLight(!1)}if(c>0&&this.removeLight(e,n,i,c,!0),!h.opaque){h.lightFilter===0&&this.skyVisible(e,n,i)&&(this.write(e,n,i,cf(this.getVoxel(e,n,i),Ir)),this.addQ.push(e,n,i));for(let d=0;d<6;d++)this.addQ.push(e+Nl[d],n+ws[d],i+Ul[d]);this.spreadLight(!0)}return!0}removeLight(e,n,i,r,s){const o=this.remQ;o.push(e,n,i,r);let a=0;for(;a<o.length;){const l=o[a++],c=o[a++],u=o[a++],h=o[a++];for(let d=0;d<6;d++){const p=l+Nl[d],g=c+ws[d],v=u+Ul[d];if(g<0||g>=vn)continue;const m=this.getVoxel(p,g,v),f=s?Dr(m):Nr(m);if(f===0)continue;const _=s&&h===Ir&&ws[d]===-1&&f===Ir;f<h||_?(this.write(p,g,v,s?cf(m,0):uf(m,0)),o.push(p,g,v,_?Ir:f)):this.addQ.push(p,g,v)}}o.length=0,this.spreadLight(s)}spreadLight(e){const n=this.addQ;let i=0;for(;i<n.length;){const r=n[i++],s=n[i++],o=n[i++];if(s<0||s>=vn)continue;const a=this.getVoxel(r,s,o),l=e?Dr(a):Nr(a);if(!(l<=1))for(let c=0;c<6;c++){const u=r+Nl[c],h=s+ws[c],d=o+Ul[c];if(h<0||h>=vn||!this.chunks.has(Ct(u>>4,d>>4)))continue;const p=this.getVoxel(u,h,d),g=Lt(Oo(p));if(g.opaque)continue;let v;e&&l===Ir&&ws[c]===-1&&g.lightFilter===0?v=Ir:v=l-1-g.lightFilter;const m=e?Dr(p):Nr(p);v>m&&(this.write(u,h,d,e?cf(p,v):uf(p,v)),n.push(u,h,d))}}n.length=0}reconcileChunkLight(e,n){const i=e<<4,r=n<<4,s=(a,l,c)=>{const u=this.getVoxel(a,l,c);Dr(u)>1&&this.addQ.push(a,l,c)},o=(a,l,c)=>{const u=this.getVoxel(a,l,c);Nr(u)>1&&this.addQ.push(a,l,c)};for(const a of[0,1]){const l=a===0?s:o;for(let c=0;c<vn;c++)for(let u=0;u<16;u++)l(i+u,c,r),l(i+u,c,r-1),l(i+u,c,r+15),l(i+u,c,r+16),l(i,c,r+u),l(i-1,c,r+u),l(i+15,c,r+u),l(i+16,c,r+u);this.spreadLight(a===0)}}}const LR=18,ff=18*18,IR=18*18*258;class DR{world=new PR;records=new Map;genQueue=[];genInFlight=new Set;meshQueue=new Set;meshInFlight=0;scene;opaqueMaterial;waterMaterial;genWorker;meshWorker;onChunkReady=null;onChunkRemoved=null;centerX=0;centerZ=0;renderDistance=6;constructor(e,n,i,r,s){this.scene=e,this.opaqueMaterial=n,this.waterMaterial=i,this.genWorker=r,this.meshWorker=s,this.genWorker.onmessage=o=>this.handleGen(o.data),this.meshWorker.onmessage=o=>this.handleMesh(o.data)}stats(){return{chunks:this.records.size,pending:this.genQueue.length+this.genInFlight.size+this.meshQueue.size}}isReady(e,n){return this.records.get(Ct(e,n))?.state==="ready"}isMeshed(e,n){return this.records.get(Ct(e,n))?.meshed===!0}spawnProgress(e,n,i){let r=0,s=0;for(let o=-i;o<=i;o++)for(let a=-i;a<=i;a++)r++,this.isMeshed(e+a,n+o)&&s++;return r===0?1:s/r}update(e,n){this.centerX=e,this.centerZ=n;const i=e>>4,r=n>>4,s=this.renderDistance,o=s+1;this.genQueue.length=0;for(let a=0;a<=o;a++)for(let l=-a;l<=a;l++)for(let c=-a;c<=a;c++){if(Math.max(Math.abs(c),Math.abs(l))!==a)continue;const u=Ct(i+c,r+l);!this.records.has(u)&&!this.genInFlight.has(u)&&this.genQueue.push(u)}for(;this.genInFlight.size<6&&this.genQueue.length>0;){const a=this.genQueue.shift();this.genInFlight.add(a),this.genWorker.postMessage({t:"gen",cx:Il(a),cz:Dl(a)})}for(const a of this.world.dirty)this.records.get(a)?.state==="ready"&&this.meshQueue.add(a);if(this.world.dirty.clear(),this.meshInFlight<3&&this.meshQueue.size>0){const a=[...this.meshQueue].sort((l,c)=>{const u=Math.max(Math.abs(Il(l)-i),Math.abs(Dl(l)-r)),h=Math.max(Math.abs(Il(c)-i),Math.abs(Dl(c)-r));return u-h});for(const l of a){if(this.meshInFlight>=3)break;const c=Il(l),u=Dl(l);if(Math.max(Math.abs(c-i),Math.abs(u-r))>s){this.meshQueue.delete(l);continue}if(!this.neighborsReady(c,u))continue;const h=this.records.get(l);if(!h){this.meshQueue.delete(l);continue}this.meshQueue.delete(l),h.rev++;const d=this.buildPadded(c,u);this.meshWorker.postMessage({t:"mesh",cx:c,cz:u,rev:h.rev,data:d.buffer},[d.buffer]),this.meshInFlight++}}for(const[a,l]of this.records)Math.max(Math.abs(l.cx-i),Math.abs(l.cz-r))>o+1&&(this.disposeMeshes(l),this.records.delete(a),this.world.removeChunk(l.cx,l.cz),this.meshQueue.delete(a),this.onChunkRemoved&&this.onChunkRemoved(l.cx,l.cz))}neighborsReady(e,n){for(let i=-1;i<=1;i++)for(let r=-1;r<=1;r++)if(this.records.get(Ct(e+r,n+i))?.state!=="ready")return!1;return!0}handleGen(e){if(e.t!=="chunk")return;const n=Ct(e.cx,e.cz);this.genInFlight.delete(n);const i=new Uint16Array(e.data);this.world.addChunk(e.cx,e.cz,i),this.world.reconcileChunkLight(e.cx,e.cz),this.records.set(n,{cx:e.cx,cz:e.cz,state:"ready",rev:0,appliedRev:0,opaqueMesh:null,waterMesh:null,meshed:!1});for(let r=-1;r<=1;r++)for(let s=-1;s<=1;s++){const o=Ct(e.cx+s,e.cz+r);this.records.get(o)?.state==="ready"&&this.meshQueue.add(o)}if(this.onChunkReady){const r=i.slice().buffer;this.onChunkReady(e,r)}}handleMesh(e){this.meshInFlight--;const n=Ct(e.cx,e.cz),i=this.records.get(n);!i||e.rev<i.appliedRev||(i.appliedRev=e.rev,this.disposeMeshes(i),i.opaqueMesh=this.buildMesh(e.cx,e.cz,e.opaque,this.opaqueMaterial,!1),i.waterMesh=this.buildMesh(e.cx,e.cz,e.water,this.waterMaterial,!0),i.meshed=!0)}buildMesh(e,n,i,r,s){if(i.count===0)return null;const o=new yi;o.setAttribute("position",new nn(new Float32Array(i.pos),3)),o.setAttribute("aUv",new nn(new Float32Array(i.uv),2)),o.setAttribute("aTile",new nn(new Uint16Array(i.tile),1));const a=new nn(new Uint8Array(i.shade),1);a.normalized=!0,o.setAttribute("aShade",a),o.setAttribute("aLight",new nn(new Uint8Array(i.light),2)),o.setIndex(new nn(new Uint32Array(i.index),1)),o.boundingSphere=new Ua(new k(8,vn/2,8),Math.sqrt(8*8+vn/2*(vn/2)+8*8));const l=new Wt(o,r);return l.position.set(e*16,0,n*16),l.frustumCulled=!0,l.renderOrder=s?10:0,l.matrixAutoUpdate=!1,l.updateMatrix(),this.scene.add(l),l}disposeMeshes(e){for(const n of[e.opaqueMesh,e.waterMesh])n&&(this.scene.remove(n),n.geometry.dispose());e.opaqueMesh=null,e.waterMesh=null}buildPadded(e,n){const i=new Uint16Array(IR),r=bR(0,15,0),s=257*ff;for(let a=0;a<ff;a++)i[s+a]=r;const o=[];for(let a=-1;a<=1;a++)for(let l=-1;l<=1;l++)o.push(this.world.getChunk(e+l,n+a));for(let a=0;a<vn;a++){const l=(a+1)*ff;for(let c=-1;c<=16;c++){const u=c<0?0:c>15?2:1,h=c&15,d=l+(c+1)*LR;for(let p=-1;p<=16;p++){const g=p<0?0:p>15?2:1,v=o[u*3+g];i[d+p+1]=v?v[Yo(p&15,a,h)]:0}}}return i}dispose(){for(const e of this.records.values())this.disposeMeshes(e);this.records.clear()}}const NR=new Le(9356014),UR=new Le(461592),OR=new Le(14846030),FR=new Le(1,1,1),kR=new Le(1,.78,.62),BR=new Le(.66,.72,1);class zR{time;dayLengthSec;sun;ambient;skyColor=new Le;sunLevel=1;tmp=new Le;constructor(e){this.time=.05,this.dayLengthSec=e,this.sun=new hR(16777215,1.6),this.ambient=new dR(12175615,.9)}update(e,n,i,r,s){this.time=(this.time+e/this.dayLengthSec)%1;const o=this.time*Math.PI*2,a=Math.sin(o),l=jM.smoothstep(a,-.12,.18);this.sunLevel=.16+.84*l,n.uSunLevel.value=this.sunLevel;const c=Math.max(0,1-Math.abs(a)*5);this.skyColor.copy(UR).lerp(NR,l),this.tmp.copy(this.skyColor).lerp(OR,c*.7),this.skyColor.copy(this.tmp),i.background.copy(this.skyColor),n.uFogColor.value.copy(this.skyColor),n.uSkyTint.value.copy(BR).lerp(FR,l).lerp(kR,c*.6);const u=s*16;n.uFogFar.value=u*(.92-.1*(1-l)),n.uFogNear.value=n.uFogFar.value*.55;const h=a>-.04,d=h?o:o+Math.PI,p=r.position;this.sun.position.set(p.x+Math.cos(d)*120,Math.max(12,Math.sin(d)*160)+p.y,p.z+Math.sin(this.time*Math.PI*2*.5)*40),this.sun.target.position.copy(p),this.sun.target.updateMatrixWorld(),this.sun.intensity=h?.6+1.2*l:.25,this.sun.color.setHex(h?16774368:8952008),this.ambient.intensity=.35+.75*l}}const fi=1e-7,HR=5e-4;function Jv(t,e,n,i){return n<0?!0:n>=256?!1:Lt(t.getBlockId(e,n,i)).solid}function GR(t,e,n,i,r,s,o,a,l,c,u,h){let d,p;o>0?(d=c-(t+i),p=c+1-t):(d=c+1-t,p=c-(t+i));let g,v;a>0?(g=u-(e+r),v=u+1-e):(g=u+1-e,v=u-(e+r));let m,f;l>0?(m=h-(n+s),f=h+1-n):(m=h+1-n,f=h-(n+s));const _=o===0?-1/0:d/o,x=o===0?1/0:p/o,y=a===0?-1/0:g/a,b=a===0?1/0:v/a,A=l===0?-1/0:m/l,R=l===0?1/0:f/l;if(o===0&&(t+i<=c+fi||t>=c+1-fi)||a===0&&(e+r<=u+fi||e>=u+1-fi)||l===0&&(n+s<=h+fi||n>=h+1-fi))return null;const C=Math.max(_,y,A),T=Math.min(x,b,R);if(C>T||C>=1||C<-fi)return null;let S,P;return _>=y&&_>=A?(S=0,P=o>0?-1:1):y>=A?(S=1,P=a>0?-1:1):(S=2,P=l>0?-1:1),{t:Math.max(0,C),axis:S,sign:P}}function Ol(t,e,n,i,r,s,o,a,l,c){let u=e,h=n,d=i,p=a,g=l,v=c,m=!1,f=!1,_=!1,x=!1;for(let y=0;y<3&&!(p===0&&g===0&&v===0);y++){const b=Math.floor(Math.min(u,u+p)-.001),A=Math.floor(Math.max(u+r,u+r+p)+.001),R=Math.floor(Math.min(h,h+g)-.001),C=Math.floor(Math.max(h+s,h+s+g)+.001),T=Math.floor(Math.min(d,d+v)-.001),S=Math.floor(Math.max(d+o,d+o+v)+.001);let P=null;for(let Y=R;Y<=C;Y++)for(let ee=T;ee<=S;ee++)for(let X=b;X<=A;X++){if(!Jv(t,X,Y,ee))continue;const ie=GR(u,h,d,r,s,o,p,g,v,X,Y,ee);ie&&(!P||ie.t<P.t)&&(P=ie)}if(!P){u+=p,h+=g,d+=v;break}const j=Math.max(0,P.t-HR);u+=p*j,h+=g*j,d+=v*j;const H=1-j;p*=H,g*=H,v*=H,P.axis===0?(p=0,f=!0):P.axis===1?(P.sign===1&&l<0&&(m=!0),g=0,_=!0):(v=0,x=!0)}return{x:u,y:h,z:d,onGround:m,hitX:f,hitY:_,hitZ:x}}function ex(t,e,n,i,r,s,o){const a=Math.floor(e),l=Math.floor(e+r-fi),c=Math.floor(n),u=Math.floor(n+s-fi),h=Math.floor(i),d=Math.floor(i+o-fi);for(let p=c;p<=u;p++)for(let g=h;g<=d;g++)for(let v=a;v<=l;v++)if(Jv(t,v,p,g))return!0;return!1}function As(t,e,n,i,r,s,o){return ex(t,e,n-o,i,r,o,s)}function VR(t,e,n,i,r,s,o,a,l,c){const u=r,h=r;let d=e-u/2,p=i-h/2;if(c.sneak&&a<=0&&As(t,d,n,p,u,h,.05)){if(o!==0&&!As(t,d+o,n,p,u,h,.6)){let m=0,f=o;for(let _=0;_<5;_++){const x=(m+f)/2;As(t,d+x,n,p,u,h,.6)?m=x:f=x}o=m}if(l!==0&&!As(t,d+o,n,p+l,u,h,.6)){let m=0,f=l;for(let _=0;_<5;_++){const x=(m+f)/2;As(t,d+o,n,p+x,u,h,.6)?m=x:f=x}l=m}}let g=Ol(t,d,n,p,u,s,h,o,a,l);if(c.stepHeight>0&&(g.hitX||g.hitZ)&&(g.onGround||As(t,d,n,p,u,h,.05))){const v=Ol(t,d,n,p,u,s,h,0,c.stepHeight,0),m=v.y-n;if(m>.001){const f=Ol(t,v.x,v.y,v.z,u,s,h,o,0,l),_=Ol(t,f.x,f.y,f.z,u,s,h,0,-m,0),x=(f.x-d)*(f.x-d)+(f.z-p)*(f.z-p),y=(g.x-d)*(g.x-d)+(g.z-p)*(g.z-p);x>y+1e-8&&(g={x:_.x,y:_.y,z:_.z,onGround:_.onGround||_.hitY,hitX:f.hitX,hitY:g.hitY,hitZ:f.hitZ})}}return d=g.x,p=g.z,{cx:d+u/2,y:g.y,cz:p+h/2,onGround:g.onGround,hitX:g.hitX,hitY:g.hitY,hitZ:g.hitZ}}const WR=20,kg=1e3/WR,XR=62,zr=.6,Bg=1.8,jR=1.5,zg=1.62,YR=1.27,KR=4.32,$R=5.6,qR=1.3,ZR=8.6,Hg=3.2,Gg=4.8,Wr=20,Vg=-30,Wg=-60,QR=.55,Xg=2.2,JR=4.5,jg=3.2,eC=600,tC=6,nC=2,iC=16,rC=75;class sC{x=0;y=80;z=0;vx=0;vy=0;vz=0;yaw=0;pitch=0;onGround=!1;sneaking=!1;sprinting=!1;inWater=!1;inLava=!1;headInFluid=!1;fallPeak=0;eyeSmooth=zg;onFallDamage=null;get height(){return this.sneaking?jR:Bg}eyeHeight(){return this.eyeSmooth}teleport(e,n,i){this.x=e,this.y=n,this.z=i,this.vx=this.vy=this.vz=0,this.fallPeak=n}lookDir(){const e=Math.cos(this.pitch);return[-Math.sin(this.yaw)*e,Math.sin(this.pitch),-Math.cos(this.yaw)*e]}update(e,n,i){if(i.sneak)this.sneaking=!0;else if(this.sneaking){const g=zr;ex(n,this.x-g/2,this.y,this.z-g/2,g,Bg,g)||(this.sneaking=!1)}this.sprinting=i.sprint&&i.moveZ>.5&&!this.sneaking,this.sampleFluids(n);const r=this.sneaking?qR:this.sprinting?$R:KR,s=Math.sin(this.yaw),o=Math.cos(this.yaw);let a=(-s*i.moveZ+o*i.moveX)*r,l=(-o*i.moveZ-s*i.moveX)*r;const c=this.inWater||this.inLava;c&&(a*=.6,l*=.6);const u=this.onGround?14:c?6:4;this.vx+=(a-this.vx)*Math.min(1,u*e),this.vz+=(l-this.vz)*Math.min(1,u*e),c?(this.vy+=Vg*.18*e,this.vy-=this.vy*Math.min(1,JR*e),i.jump&&(this.vy+=26*e,this.vy>Hg&&(this.vy=Hg)),this.fallPeak=this.y):(i.jump&&this.onGround&&!this.sneaking&&(this.vy=ZR,this.onGround=!1),this.vy+=Vg*e,this.vy<Wg&&(this.vy=Wg)),this.applyFluidPush(n,e);const h=Math.max(1,Math.ceil(Math.hypot(this.vx,this.vy,this.vz)*e/.45));let d=!1;for(let g=0;g<h;g++){const v=e/h,m=VR(n,this.x,this.y,this.z,zr,this.height,this.vx*v,this.vy*v,this.vz*v,{stepHeight:this.onGround?QR:0,sneak:this.sneaking&&this.onGround});m.hitX&&(this.vx=0),m.hitZ&&(this.vz=0),m.hitY&&(this.vy<0&&(d=!0),this.vy=0),this.x=m.cx,this.y=m.y,this.z=m.cz,m.onGround&&(d=!0)}if(d&&!this.onGround){const g=this.fallPeak-this.y;g>jg&&!this.inWater&&this.onFallDamage&&this.onFallDamage(g-jg),this.fallPeak=this.y}!d&&this.y>this.fallPeak&&(this.fallPeak=this.y),d&&(this.fallPeak=this.y),this.onGround=d;const p=this.sneaking?YR:zg;this.eyeSmooth+=(p-this.eyeSmooth)*Math.min(1,18*e)}sampleFluids(e){this.inWater=!1,this.inLava=!1;const n=Math.floor(this.x-zr/2),i=Math.floor(this.x+zr/2),r=Math.floor(this.z-zr/2),s=Math.floor(this.z+zr/2),o=Math.floor(this.y),a=Math.floor(this.y+this.height*.7);for(let c=o;c<=a;c++)for(let u=r;u<=s;u++)for(let h=n;h<=i;h++){const d=e.getBlockId(h,c,u);Kv(d)?this.inWater=!0:mR(d)&&(this.inLava=!0)}const l=e.getBlockId(Math.floor(this.x),Math.floor(this.y+this.eyeSmooth),Math.floor(this.z));this.headInFluid=Xo(l)}applyFluidPush(e,n){const i=Math.floor(this.x),r=Math.floor(this.y+.3),s=Math.floor(this.z),o=e.getBlockId(i,r,s);if(!Xo(o))return;const a=Ng(o);let l=0,c=0;const u=[[1,0],[-1,0],[0,1],[0,-1]];for(const[d,p]of u){const g=e.getBlockId(i+d,r,s+p);if(Xo(g)){const v=Ng(g);v<a?(l+=d*(a-v),c+=p*(a-v)):v>a&&(l-=d*(v-a)*.5,c-=p*(v-a)*.5)}else!Lt(g).solid&&a<8&&(l+=d*.6,c+=p*.6)}const h=Math.hypot(l,c);if(h>.01){const d=Xg*n/h;this.vx+=l*d,this.vz+=c*d}a>=8&&Xo(e.getBlockId(i,r-1,s))&&(this.vy-=Xg*.4*n)}}const oC=12,Ne={STICK:256,COAL:257,CHARCOAL:258,RAW_IRON:259,IRON_INGOT:260,GOLD_INGOT:261,DIAMOND:262,WOOD_PICKAXE:263,IRON_PICKAXE:264,DIAMOND_PICKAXE:265,WOOD_SWORD:266,IRON_SWORD:267,DIAMOND_SWORD:268,RAW_MUTTON:269,COOKED_MUTTON:270,ARROW:271},$h=new Map;function on(t){$h.set(t.id,t)}on({id:Ne.STICK,name:"Stick",maxStack:64,icon:O.ITEM_STICK,fuelTicks:100});on({id:Ne.COAL,name:"Coal",maxStack:64,icon:O.ITEM_COAL,fuelTicks:1600});on({id:Ne.CHARCOAL,name:"Charcoal",maxStack:64,icon:O.ITEM_CHARCOAL,fuelTicks:1600});on({id:Ne.RAW_IRON,name:"Raw Iron",maxStack:64,icon:O.ITEM_RAW_IRON});on({id:Ne.IRON_INGOT,name:"Iron Ingot",maxStack:64,icon:O.ITEM_IRON_INGOT});on({id:Ne.GOLD_INGOT,name:"Gold Ingot",maxStack:64,icon:O.ITEM_GOLD_INGOT});on({id:Ne.DIAMOND,name:"Diamond",maxStack:64,icon:O.ITEM_DIAMOND});on({id:Ne.WOOD_PICKAXE,name:"Wooden Pickaxe",maxStack:1,icon:O.ITEM_PICK_WOOD,tool:{type:"pickaxe",tier:1,speed:2,damage:2,durability:60},fuelTicks:200});on({id:Ne.IRON_PICKAXE,name:"Iron Pickaxe",maxStack:1,icon:O.ITEM_PICK_IRON,tool:{type:"pickaxe",tier:2,speed:6,damage:3,durability:250}});on({id:Ne.DIAMOND_PICKAXE,name:"Diamond Pickaxe",maxStack:1,icon:O.ITEM_PICK_DIAMOND,tool:{type:"pickaxe",tier:3,speed:8,damage:4,durability:1561}});on({id:Ne.WOOD_SWORD,name:"Wooden Sword",maxStack:1,icon:O.ITEM_SWORD_WOOD,tool:{type:"sword",tier:1,speed:1.5,damage:5,durability:60},fuelTicks:200});on({id:Ne.IRON_SWORD,name:"Iron Sword",maxStack:1,icon:O.ITEM_SWORD_IRON,tool:{type:"sword",tier:2,speed:1.5,damage:7,durability:250}});on({id:Ne.DIAMOND_SWORD,name:"Diamond Sword",maxStack:1,icon:O.ITEM_SWORD_DIAMOND,tool:{type:"sword",tier:3,speed:1.5,damage:8,durability:1561}});on({id:Ne.RAW_MUTTON,name:"Raw Mutton",maxStack:64,icon:O.ITEM_MUTTON_RAW,food:4});on({id:Ne.COOKED_MUTTON,name:"Cooked Mutton",maxStack:64,icon:O.ITEM_MUTTON_COOKED,food:12});on({id:Ne.ARROW,name:"Arrow",maxStack:64,icon:O.ITEM_ARROW});const aC={},lC={[V.OAK_PLANKS]:300,[V.OAK_LOG]:300,[V.BIRCH_LOG]:300,[V.CRAFTING_TABLE]:300,[V.CHEST_N]:300};function yn(t){let e=$h.get(t);if(!e){const n=Lt(t);e={id:t,name:aC[t]??n.name,maxStack:64,icon:cC(t),block:t,fuelTicks:lC[t]},$h.set(t,e)}return e}function cC(t){const e=Lt(t);return t===V.GRASS||t===V.SNOW_GRASS,e.tiles[4]}function Ta(t){return t>0&&t<256}function Rs(t,e){const n=yn(t),i={id:t,count:e};return n.tool&&(i.dur=n.tool.durability),i}var Gt=(t=>(t[t.ITEM=0]="ITEM",t[t.ZOMBIE=1]="ZOMBIE",t[t.SKELETON=2]="SKELETON",t[t.CREEPER=3]="CREEPER",t[t.SHEEP=4]="SHEEP",t[t.VILLAGER=5]="VILLAGER",t[t.IRON_GOLEM=6]="IRON_GOLEM",t[t.ARROW=7]="ARROW",t))(Gt||{});const uC={0:{width:.25,height:.25,maxHp:5,speed:0,hostile:!1,attackDamage:0,attackRange:0,drops:[],eye:.125},1:{width:.6,height:1.95,maxHp:20,speed:2.7,hostile:!0,attackDamage:4,attackRange:1.5,drops:[[V.DIRT,0,0]],eye:1.74},2:{width:.6,height:1.99,maxHp:20,speed:3,hostile:!0,attackDamage:4,attackRange:12,drops:[[Ne.ARROW,0,2]],eye:1.74},3:{width:.6,height:1.7,maxHp:20,speed:2.6,hostile:!0,attackDamage:0,attackRange:3,drops:[[Ne.COAL,0,2]],eye:1.45},4:{width:.9,height:1.3,maxHp:8,speed:1.6,hostile:!1,attackDamage:0,attackRange:0,drops:[[V.WOOL,1,1],[Ne.RAW_MUTTON,1,2]],eye:1.1},5:{width:.6,height:1.95,maxHp:20,speed:2,hostile:!1,attackDamage:0,attackRange:0,drops:[],eye:1.62},6:{width:1.4,height:2.7,maxHp:100,speed:2.5,hostile:!1,attackDamage:12,attackRange:2.2,drops:[[Ne.IRON_INGOT,3,5],[V.FLOWER_RED,0,2]],eye:2.4},7:{width:.25,height:.25,maxHp:1,speed:28,hostile:!1,attackDamage:4,attackRange:0,drops:[],eye:.125}};var ra=(t=>(t[t.NONE=0]="NONE",t[t.BURNING=1]="BURNING",t[t.PANIC=2]="PANIC",t[t.ATTACKING=4]="ATTACKING",t[t.SHEARED=8]="SHEARED",t[t.BABY=16]="BABY",t))(ra||{});const Yg=new Map;function eu(t){let e=Yg.get(t);if(e)return e;const n=document.createElement("canvas");n.width=16,n.height=16;const i=n.getContext("2d"),r=o=>{i.fillStyle=o,i.fillRect(0,0,16,16)},s=(o,a,l,c,u)=>{i.fillStyle=u,i.fillRect(o,a,l,c)};switch(t){case"zombie":r("#44a044"),s(3,6,3,2,"#1c2c1c"),s(10,6,3,2,"#1c2c1c"),s(6,10,4,3,"#2a4a2a");break;case"skeleton":r("#bdbdbd"),s(3,6,3,2,"#3a3a3a"),s(10,6,3,2,"#3a3a3a"),s(5,11,6,2,"#7a7a7a");for(let o=5;o<11;o+=2)s(o,11,1,2,"#3a3a3a");break;case"creeper":r("#54c454"),s(3,5,4,4,"#101810"),s(9,5,4,4,"#101810"),s(6,8,4,5,"#101810"),s(5,11,2,4,"#101810"),s(9,11,2,4,"#101810");break;case"sheep":r("#e8d8d0"),s(3,7,3,2,"#1c1c2c"),s(10,7,3,2,"#1c1c2c"),s(6,12,4,2,"#caa");break;case"villager":r("#c8a078"),s(3,6,3,2,"#2c4c2c"),s(10,6,3,2,"#2c4c2c"),s(6,8,4,6,"#a07850");break;case"golem":r("#cfc6b8"),s(3,6,3,3,"#503830"),s(10,6,3,3,"#503830"),s(6,9,4,6,"#8a7a6a");break;case"player":r("#d8a888"),s(3,6,3,2,"#3858c8"),s(10,6,3,2,"#3858c8"),s(6,11,4,2,"#a87858"),s(0,0,16,4,"#5a3a22"),s(0,4,2,3,"#5a3a22"),s(14,4,2,3,"#5a3a22");break;default:r("#c88")}return e=new Xv(n),e.magFilter=dn,e.minFilter=dn,Yg.set(t,e),e}class fC{group=new Bt;entities=new Map;lastSnapAt=0;atlas;blockGeoCache=new Map;iconGeoCache=new Map;constructor(e){this.atlas=e}count(){return this.entities.size}applySnapshot(e,n){this.lastSnapAt=performance.now();for(const i of this.entities.values())i.seen=!1;for(let i=0;i<n;i++){const r=i*oC,s=e[r],o=e[r+1];let a=this.entities.get(s);(!a||a.type!==o)&&(a&&this.remove(a),a=this.create(s,o,e[r+2],e[r+3],e[r+4],e[r+5],e[r+10]),this.entities.set(s,a)),a.px=a.cx,a.py=a.cy,a.pz=a.cz,a.pyaw=a.cyaw,a.cx=e[r+2],a.cy=e[r+3],a.cz=e[r+4],a.cyaw=e[r+5],a.pitch=e[r+6],a.hp=e[r+7],a.hurt=e[r+8],a.anim=e[r+9],a.a=e[r+10],a.b=e[r+11],a.seen=!0}for(const i of[...this.entities.values()])i.seen||(this.remove(i),this.entities.delete(i.id))}update(e,n,i,r){const s=Math.min(1.2,(performance.now()-this.lastSnapAt)/50);for(const o of this.entities.values()){const a=o.px+(o.cx-o.px)*s,l=o.py+(o.cy-o.py)*s,c=o.pz+(o.cz-o.pz)*s;let u=o.cyaw-o.pyaw;u>Math.PI&&(u-=Math.PI*2),u<-Math.PI&&(u+=Math.PI*2);const h=o.pyaw+u*s;o.group.position.set(a,l,c),o.group.rotation.y=h;const d=e.getVoxel(Math.floor(a),Math.floor(l+.5),Math.floor(c)),p=(d>>8&15)/15,g=(d>>12&15)/15,v=Math.max(.06,Math.pow(Math.max(p*n,g),1.3)),m=o.hurt>0?1:0,f=o.type===Gt.CREEPER&&o.a>0?(Math.sin(performance.now()/60)*.5+.5)*o.a:0;for(let _=0;_<o.materials.length;_++){const x=o.materials[_],y=o.baseColors[_];x.color.setRGB(Math.min(1,y.r*v+f),Math.min(1,y.g*v+f),Math.min(1,y.b*v+f)),x.emissive.setRGB(m*.45,0,0),o.anim&ra.BURNING&&x.emissive.setRGB(.7,.3,.05)}this.animate(o,a,c,h,i,r,s)}}animate(e,n,i,r,s,o,a){const l=Math.hypot(e.cx-e.px,e.cz-e.pz)/.05;e.limbPhase+=l*o*2.2;const c=Math.sin(e.limbPhase)*Math.min(1,l/3)*.7,u=e.parts;u.legL&&(u.legL.rotation.x=c),u.legR&&(u.legR.rotation.x=-c),e.type===Gt.ZOMBIE?(u.armL&&(u.armL.rotation.x=-Math.PI/2+Math.sin(e.limbPhase*.7)*.1),u.armR&&(u.armR.rotation.x=-Math.PI/2-Math.sin(e.limbPhase*.7)*.1)):e.type===Gt.IRON_GOLEM&&e.anim&ra.ATTACKING?(u.armL&&(u.armL.rotation.x=-Math.PI*.8),u.armR&&(u.armR.rotation.x=-Math.PI*.8)):(u.armL&&(u.armL.rotation.x=-c),u.armR&&(u.armR.rotation.x=c)),e.type===Gt.SHEEP&&e.anim&ra.ATTACKING&&u.head?u.head.rotation.x=.9:u.head&&(u.head.rotation.x=e.pitch*.6),e.type===Gt.ITEM&&(e.group.rotation.y=e.itemId>=256?s:performance.now()/900,e.group.position.y+=.12+Math.sin(performance.now()/420+e.id)*.06),e.type===Gt.ARROW&&(e.group.rotation.order="YXZ",e.group.rotation.y=r,e.group.rotation.x=e.pitch)}pick(e,n,i,r,s,o,a){let l=null;for(const c of this.entities.values()){if(c.type===Gt.ITEM||c.type===Gt.ARROW)continue;const u=uC[c.type],h=u.width/2+.1,d=gC(e,n,i,r,s,o,c.cx-h,c.cy-.1,c.cz-h,c.cx+h,c.cy+u.height+.1,c.cz+h);d!==null&&d<=a&&(!l||d<l.dist)&&(l={id:c.id,dist:d})}return l}create(e,n,i,r,s,o,a){const l=new Bt,c={id:e,type:n,group:l,parts:{},materials:[],baseColors:[],px:i,py:r,pz:s,pyaw:o,cx:i,cy:r,cz:s,cyaw:o,hp:0,hurt:0,anim:0,a,b:0,pitch:0,limbPhase:Math.random()*10,seen:!0,itemId:a};switch(n){case Gt.ZOMBIE:tc(c,{skin:4497476,shirt:2911372,pants:3955852,face:"zombie"});break;case Gt.SKELETON:tc(c,{skin:12434877,shirt:10132122,pants:9079434,face:"skeleton",thin:!0});break;case Gt.VILLAGER:tc(c,{skin:13148280,shirt:8019012,pants:6046772,face:"villager",robe:!0});break;case Gt.CREEPER:hC(c);break;case Gt.SHEEP:dC(c);break;case Gt.IRON_GOLEM:pC(c);break;case Gt.ARROW:mC(c);break;case Gt.ITEM:this.buildItem(c,a);break}return l.position.set(i,r,s),this.group.add(l),c}buildItem(e,n){const i=yn(n);if(Ta(n)){let r=this.blockGeoCache.get(n);r||(r=ap(n),this.blockGeoCache.set(n,r));const s=new Zr({map:this.atlas.texture,alphaTest:.4}),o=new Wt(r,s);e.group.add(o),e.materials.push(s),e.baseColors.push(new Le(1,1,1))}else{let r=this.iconGeoCache.get(i.icon);r||(r=lp(i.icon),this.iconGeoCache.set(i.icon,r));const s=new Zr({map:this.atlas.texture,alphaTest:.3,side:Ln}),o=new Wt(r,s);e.group.add(o),e.materials.push(s),e.baseColors.push(new Le(1,1,1))}}remove(e){this.group.remove(e.group);for(const n of e.materials)n.dispose();e.group.traverse(n=>{n instanceof Wt&&!this.isCachedGeo(n.geometry)&&n.geometry.dispose()})}isCachedGeo(e){for(const n of this.blockGeoCache.values())if(n===e)return!0;for(const n of this.iconGeoCache.values())if(n===e)return!0;return!1}dispose(){for(const e of[...this.entities.values()])this.remove(e);this.entities.clear();for(const e of this.blockGeoCache.values())e.dispose();for(const e of this.iconGeoCache.values())e.dispose()}}function rn(t,e,n,i,r,s){const o=new Xi(e,n,i);let a;if(s){const l=new Zr({color:r}),c=new Zr({map:s});a=[l,l,l,l,l,c],t.materials.push(l,c),t.baseColors.push(new Le(r),new Le(1,1,1))}else a=new Zr({color:r}),t.materials.push(a),t.baseColors.push(new Le(r));return new Wt(o,a)}function tc(t,e){const n=e.thin?.12:.25,i=t.group,r=new Bt,s=rn(t,.5,.5,.5,e.skin,eu(e.face));s.position.y=.25,r.add(s),r.position.y=1.5,i.add(r);const o=rn(t,e.robe?.56:.5,.75,.3,e.shirt);o.position.y=1.5-.375,i.add(o);const a=c=>{const u=new Bt,h=rn(t,n,.75,n,e.robe?e.shirt:e.skin);return h.position.y=-.3,u.add(h),u.position.set(c*(.25+n/2+.02),1.45,0),i.add(u),u},l=c=>{const u=new Bt,h=rn(t,.22,.75,.22,e.pants);return h.position.y=-.375,u.add(h),u.position.set(c*.13,.75,0),i.add(u),u};t.parts.head=r,t.parts.body=o,t.parts.armL=a(-1),t.parts.armR=a(1),t.parts.legL=l(-1),t.parts.legR=l(1)}function hC(t){const e=t.group,n=new Bt,i=rn(t,.5,.5,.5,5555284,eu("creeper"));i.position.y=.25,n.add(i),n.position.y=1.2,e.add(n);const r=rn(t,.5,.9,.3,4630598);r.position.y=.75,e.add(r);for(const[s,o]of[[-.13,.18],[.13,.18],[-.13,-.18],[.13,-.18]]){const a=new Bt,l=rn(t,.22,.3,.24,3969084);l.position.y=-.15,a.add(l),a.position.set(s,.3,o),e.add(a),t.parts.legL?t.parts.legR||(t.parts.legR=a):t.parts.legL=a}t.parts.head=n}function dC(t){const e=t.group,n=(t.anim&ra.SHEARED)!==0,i=rn(t,.8,.7,1.2,n?14203040:15263976);i.position.y=.85,e.add(i);const r=new Bt,s=rn(t,.4,.4,.45,14207168,eu("sheep"));s.position.set(0,0,-.2),r.add(s),r.position.set(0,1.15,-.62),e.add(r);for(const[o,a]of[[-.22,.4],[.22,.4],[-.22,-.4],[.22,-.4]]){const l=new Bt,c=rn(t,.18,.5,.18,13154480);c.position.y=-.25,l.add(c),l.position.set(o,.5,a),e.add(l),t.parts.legL?t.parts.legR||(t.parts.legR=l):t.parts.legL=l}t.parts.head=r,t.parts.body=i}function pC(t){const e=t.group,n=new Bt,i=rn(t,.55,.6,.5,13616824,eu("golem"));i.position.y=.3,n.add(i),n.position.y=2.05,e.add(n);const r=rn(t,1.1,1.1,.65,12366500);r.position.y=1.5,e.add(r);const s=a=>{const l=new Bt,c=rn(t,.3,1.3,.3,12892840);return c.position.y=-.55,l.add(c),l.position.set(a*.75,1.95,0),e.add(l),l},o=a=>{const l=new Bt,c=rn(t,.35,1,.35,11182228);return c.position.y=-.5,l.add(c),l.position.set(a*.28,1,0),e.add(l),l};t.parts.head=n,t.parts.armL=s(-1),t.parts.armR=s(1),t.parts.legL=o(-1),t.parts.legR=o(1)}function mC(t){const e=rn(t,.04,.04,.5,10123850);t.group.add(e);const n=rn(t,.07,.07,.08,13421772);n.position.z=-.27,t.group.add(n)}function ap(t){const e=new Xi(.3,.3,.3);return tx(e,Lt(t).tiles),e}function lp(t){const e=new Oa(.4,.4),n=e.getAttribute("uv");return nx(n,0,t),e}function tx(t,e){const n=t.getAttribute("uv");for(let i=0;i<6;i++)nx(n,i*4,e[i]);n.needsUpdate=!0}function nx(t,e,n){const i=n%32,r=Math.floor(n/32),s=1/32,o=.06*s,a=i*s+o,l=(i+1)*s-o,c=1-r*s-o,u=1-(r+1)*s+o;t.setXY(e,a,c),t.setXY(e+1,l,c),t.setXY(e+2,a,u),t.setXY(e+3,l,u)}function gC(t,e,n,i,r,s,o,a,l,c,u,h){let d=0,p=1/0;const g=[t,e,n],v=[i,r,s],m=[o,a,l],f=[c,u,h];for(let _=0;_<3;_++)if(Math.abs(v[_])<1e-9){if(g[_]<m[_]||g[_]>f[_])return null}else{let x=(m[_]-g[_])/v[_],y=(f[_]-g[_])/v[_];if(x>y){const b=x;x=y,y=b}if(d=Math.max(d,x),p=Math.min(p,y),d>p)return null}return d}class _C{group=new Bt;parts={};materials=[];baseColors=[];limbPhase=0;swingT=1;heldMesh=null;heldItemId=-1;atlas;constructor(e){this.atlas=e,tc({group:this.group,parts:this.parts,materials:this.materials,baseColors:this.baseColors},{skin:14198920,shirt:2926760,pants:3951772,face:"player"})}swing(){this.swingT=0}update(e,n,i,r,s,o,a,l,c){this.group.position.set(n,i,r),this.group.rotation.y=s+Math.PI,this.limbPhase+=a*e*2.2,this.swingT=Math.min(1,this.swingT+e*2.8);const u=Math.sin(this.limbPhase)*Math.min(1,a/3)*.7;if(this.parts.legL&&(this.parts.legL.rotation.x=u),this.parts.legR&&(this.parts.legR.rotation.x=-u),this.parts.armL&&(this.parts.armL.rotation.x=-u*.8),this.parts.armR){const h=this.swingT<1?-Math.sin(this.swingT*Math.PI)*1.8:0;this.parts.armR.rotation.x=u*.8+h}this.parts.head&&(this.parts.head.rotation.x=-o*.8);for(let h=0;h<this.materials.length;h++){const d=this.materials[h],p=this.baseColors[h];d.color.setRGB(p.r*l,p.g*l,p.b*l)}this.updateHeld(c)}updateHeld(e){if(e===this.heldItemId||(this.heldItemId=e,this.heldMesh&&(this.parts.armR.remove(this.heldMesh),this.heldMesh.geometry.dispose(),this.heldMesh.material.dispose(),this.heldMesh=null),e<=0))return;const n=new Zr({map:this.atlas.texture,alphaTest:.3,side:Ln}),i=Ta(e)?ap(e):lp(yn(e).icon);this.heldMesh=new Wt(i,n),this.heldMesh.position.set(0,-.65,-.15),this.parts.armR.add(this.heldMesh)}dispose(){for(const e of this.materials)e.dispose()}}class vC{group=new Bt;mesh=null;itemId=-1;swingT=1;bobPhase=0;atlas;light={value:1};constructor(e,n){this.atlas=e,n.add(this.group),this.group.position.set(.42,-.42,-.7)}swing(){this.swingT=0}update(e,n,i,r){if(this.light.value=r,n!==this.itemId&&(this.itemId=n,this.mesh&&(this.group.remove(this.mesh),this.mesh.geometry.dispose(),this.mesh.material.dispose(),this.mesh=null),n>0)){const l=new Zr({map:this.atlas.texture,alphaTest:.3,side:Ln}),c=Ta(n)?ap(n):lp(yn(n).icon);this.mesh=new Wt(c,l),Ta(n)?(this.mesh.scale.setScalar(1.4),this.mesh.rotation.y=Math.PI/5):(this.mesh.rotation.y=Math.PI/7,this.mesh.rotation.z=-.25,this.mesh.scale.setScalar(1.5)),this.group.add(this.mesh)}if(!this.mesh)return;this.swingT=Math.min(1,this.swingT+e*3),this.bobPhase+=e*Math.min(10,4+i*1.4);const s=Math.abs(Math.sin(this.bobPhase))*.02*Math.min(1,i/3),o=this.swingT<1?Math.sin(this.swingT*Math.PI):0;this.group.position.set(.42-o*.25,-.42+s-o*.28,-.7-o*.12),this.group.rotation.set(-o*1.1,o*.6,0),this.mesh.material.color.setScalar(Math.max(.15,r))}}function hf(t,e,n,i,r,s,o,a){const l=Math.hypot(r,s,o);if(l===0)return null;r/=l,s/=l,o/=l;let c=Math.floor(e),u=Math.floor(n),h=Math.floor(i);const d=r>0?1:-1,p=s>0?1:-1,g=o>0?1:-1,v=r!==0?Math.abs(1/r):1/0,m=s!==0?Math.abs(1/s):1/0,f=o!==0?Math.abs(1/o):1/0;let _=r!==0?(r>0?c+1-e:e-c)*v:1/0,x=s!==0?(s>0?u+1-n:n-u)*m:1/0,y=o!==0?(o>0?h+1-i:i-h)*f:1/0,b=0,A=0,R=0,C=0;for(let T=0;T<256;T++){if(C>a)return null;const S=t.getBlockId(c,u,h);if(S!==0&&!Xo(S)&&Lt(S).hardness>=0&&C>0)return{x:c,y:u,z:h,nx:b,ny:A,nz:R,dist:C,id:S};_<x&&_<y?(C=_,_+=v,c+=d,b=-d,A=0,R=0):x<y?(C=x,x+=m,u+=p,b=0,A=-p,R=0):(C=y,y+=f,h+=g,b=0,A=0,R=-g)}return null}const Ve={moveX:0,moveZ:0,jump:!1,sneak:!1,sprint:!1,lookDX:0,lookDY:0,mineHeld:!1,useHeld:!1,useClicked:!1},Jt={w:!1,a:!1,s:!1,d:!1};let ix=0,rx=0,qh=!1,Zh=!1;function nc(){let t=(Jt.d?1:0)-(Jt.a?1:0),e=(Jt.w?1:0)-(Jt.s?1:0);t+=ix,e+=rx;const n=Math.hypot(t,e);n>1&&(t/=n,e/=n),Ve.moveX=t,Ve.moveZ=e}function xC(t,e){ix=t,rx=e,nc()}function yC(t,e){switch(t){case"jump":Zh=e,Ve.jump=Zh;break;case"sneak":qh=e,Ve.sneak=qh;break;case"attack":Ve.mineHeld=e;break;case"use":Ve.useHeld=e,e&&(Ve.useClicked=!0);break}}function SC(t,e){Ve.lookDX+=t,Ve.lookDY+=e}let ic=null;function MC(t){sx();const e=s=>{if(s.repeat){s.code.startsWith("F")&&s.preventDefault();return}switch(s.code){case"KeyW":Jt.w=!0;break;case"KeyA":Jt.a=!0;break;case"KeyS":Jt.s=!0;break;case"KeyD":Jt.d=!0;break;case"Space":t.isUIOpen()||s.preventDefault(),Ve.jump=!0;break;case"ShiftLeft":case"ShiftRight":Ve.sneak=!0;break;case"ControlLeft":case"ControlRight":Ve.sprint=!0;break;case"KeyE":t.onInventory();break;case"KeyQ":t.onDrop(s.ctrlKey);break;case"F5":s.preventDefault(),t.onToggleCamera();break;case"F3":s.preventDefault(),t.onToggleDebug();break;case"Escape":t.onEscape();break;default:if(s.code.startsWith("Digit")){const o=Number(s.code.slice(5));o>=1&&o<=9&&t.onHotbar(o-1)}}nc()},n=s=>{switch(s.code){case"KeyW":Jt.w=!1;break;case"KeyA":Jt.a=!1;break;case"KeyS":Jt.s=!1;break;case"KeyD":Jt.d=!1;break;case"Space":Ve.jump=Zh;break;case"ShiftLeft":case"ShiftRight":Ve.sneak=qh;break;case"ControlLeft":case"ControlRight":Ve.sprint=!1;break}nc()},i=s=>{t.isUIOpen()||t.onHotbarScroll(Math.sign(s.deltaY))},r=()=>{Jt.w=Jt.a=Jt.s=Jt.d=!1,Ve.jump=!1,Ve.sneak=!1,Ve.sprint=!1,Ve.mineHeld=!1,Ve.useHeld=!1,nc()};window.addEventListener("keydown",e),window.addEventListener("keyup",n),window.addEventListener("wheel",i,{passive:!0}),window.addEventListener("blur",r),ic=()=>{window.removeEventListener("keydown",e),window.removeEventListener("keyup",n),window.removeEventListener("wheel",i),window.removeEventListener("blur",r)}}function sx(){ic&&(ic(),ic=null)}const EC={},Kg=t=>{let e;const n=new Set,i=(u,h)=>{const d=typeof u=="function"?u(e):u;if(!Object.is(d,e)){const p=e;e=h??(typeof d!="object"||d===null)?d:Object.assign({},e,d),n.forEach(g=>g(e,p))}},r=()=>e,l={setState:i,getState:r,getInitialState:()=>c,subscribe:u=>(n.add(u),()=>n.delete(u)),destroy:()=>{(EC?"production":void 0)!=="production"&&console.warn("[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."),n.clear()}},c=e=t(i,r,l);return l},TC=t=>t?Kg(t):Kg;var ox={exports:{}},ax={},lx={exports:{}},cx={};/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var fo=Ra;function wC(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var AC=typeof Object.is=="function"?Object.is:wC,RC=fo.useState,CC=fo.useEffect,bC=fo.useLayoutEffect,PC=fo.useDebugValue;function LC(t,e){var n=e(),i=RC({inst:{value:n,getSnapshot:e}}),r=i[0].inst,s=i[1];return bC(function(){r.value=n,r.getSnapshot=e,df(r)&&s({inst:r})},[t,n,e]),CC(function(){return df(r)&&s({inst:r}),t(function(){df(r)&&s({inst:r})})},[t]),PC(n),n}function df(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!AC(t,n)}catch{return!0}}function IC(t,e){return e()}var DC=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?IC:LC;cx.useSyncExternalStore=fo.useSyncExternalStore!==void 0?fo.useSyncExternalStore:DC;lx.exports=cx;var NC=lx.exports;/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var tu=Ra,UC=NC;function OC(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var FC=typeof Object.is=="function"?Object.is:OC,kC=UC.useSyncExternalStore,BC=tu.useRef,zC=tu.useEffect,HC=tu.useMemo,GC=tu.useDebugValue;ax.useSyncExternalStoreWithSelector=function(t,e,n,i,r){var s=BC(null);if(s.current===null){var o={hasValue:!1,value:null};s.current=o}else o=s.current;s=HC(function(){function l(p){if(!c){if(c=!0,u=p,p=i(p),r!==void 0&&o.hasValue){var g=o.value;if(r(g,p))return h=g}return h=p}if(g=h,FC(u,p))return g;var v=i(p);return r!==void 0&&r(g,v)?g:(u=p,h=v)}var c=!1,u,h,d=n===void 0?null:n;return[function(){return l(e())},d===null?void 0:function(){return l(d())}]},[e,n,i,r]);var a=kC(t,s[0],s[1]);return zC(function(){o.hasValue=!0,o.value=a},[a]),GC(a),a};ox.exports=ax;var VC=ox.exports;const WC=Jg(VC),ux={},{useDebugValue:XC}=en,{useSyncExternalStoreWithSelector:jC}=WC;let $g=!1;const YC=t=>t;function KC(t,e=YC,n){(ux?"production":void 0)!=="production"&&n&&!$g&&(console.warn("[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"),$g=!0);const i=jC(t.subscribe,t.getState,t.getServerState||t.getInitialState,e,n);return XC(i),i}const qg=t=>{(ux?"production":void 0)!=="production"&&typeof t!="function"&&console.warn("[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`.");const e=typeof t=="function"?TC(t):t,n=(i,r)=>KC(e,i,r);return Object.assign(n,e),n},$C=t=>t?qg(t):qg,fx="voxelcraft.settings.v1";function qC(){const t={renderDistance:tC,fov:rC,quality:1,dayLengthSec:eC,sensitivity:1,thirdPerson:!1,touchMode:typeof window<"u"&&window.matchMedia?.("(pointer: coarse)").matches===!0,showDebug:!1};try{const e=localStorage.getItem(fx);if(e)return{...t,...JSON.parse(e)}}catch{}return t}const rt=$C((t,e)=>({phase:"title",seedText:"",loadProgress:0,screen:"none",health:Wr,breathe:10,hotbarIndex:0,inventory:new Array(36).fill(null),cursor:null,craftGrid:new Array(9).fill(null),craftSize:2,craftResult:null,container:null,settings:qC(),debug:{fps:0,chunks:0,pending:0,entities:0,tickMs:0,x:0,y:0,z:0},timeOfDay:.3,toast:null,breakProgress:0,set:n=>t(n),setSettings:n=>{const i={...e().settings,...n};try{localStorage.setItem(fx,JSON.stringify(i))}catch{}t({settings:i})}})),me={get:rt.getState,set:t=>rt.getState().set(t),subscribe:rt.subscribe};let Qh=null;function ZC(t){Qh=t}function it(){if(!Qh)throw new Error("Game bridge not registered yet");return Qh}function Ht(t){return t?{...t}:null}function hx(t,e){return!(!t||!e||t.id!==e.id||t.dur!==void 0||e.dur!==void 0)}function Ur(t,e,n=0,i=t.length){const r=yn(e.id).maxStack;let s=e.count;if(r>1)for(let a=n;a<i&&s>0;a++){const l=t[a];if(l&&hx(l,e)&&l.count<r){const c=Math.min(r-l.count,s);l.count+=c,s-=c}}for(let a=n;a<i&&s>0;a++)if(!t[a]){const l=Math.min(r,s),c={id:e.id,count:l};e.dur!==void 0&&(c.dur=e.dur),t[a]=c,s-=l}if(s<=0)return null;const o={id:e.id,count:s};return e.dur!==void 0&&(o.dur=e.dur),o}function Zg(t,e){const n=t[e];n&&(n.count--,n.count<=0&&(t[e]=null))}function Qg(t,e,n,i){const r=t[e];if(!n){if(!r)return null;if(i===0)return t[e]=null,r;const o=Math.ceil(r.count/2),a={id:r.id,count:o};return r.dur!==void 0&&(a.dur=r.dur),r.count-=o,r.count<=0&&(t[e]=null),a}const s=yn(n.id).maxStack;if(!r){if(i===0)return t[e]=n,null;const o={id:n.id,count:1};return n.dur!==void 0&&(o.dur=n.dur),t[e]=o,n.count--,n.count>0?n:null}if(hx(r,n)&&r.count<s){const o=i===0?n.count:1,a=Math.min(s-r.count,o);return r.count+=a,n.count-=a,n.count>0?n:null}return i===0?(t[e]=n,r):n}function an(t,e,n,i=1){const r=t.length,s=Math.max(...t.map(a=>a.length)),o=[];for(let a=0;a<r;a++)for(let l=0;l<s;l++){const c=t[a][l]??" ";o.push(c===" "?0:e[c])}return{w:s,h:r,cells:o,result:n,count:i}}function pf(t,e,n=1){return{w:0,h:0,cells:t.slice().sort((i,r)=>i-r),result:e,count:n,shapeless:!0}}const QC=[pf([V.OAK_LOG],V.OAK_PLANKS,4),pf([V.BIRCH_LOG],V.OAK_PLANKS,4),an(["P","P"],{P:V.OAK_PLANKS},Ne.STICK,4),an(["PP","PP"],{P:V.OAK_PLANKS},V.CRAFTING_TABLE,1),an(["C","S"],{C:Ne.COAL,S:Ne.STICK},V.TORCH,4),an(["C","S"],{C:Ne.CHARCOAL,S:Ne.STICK},V.TORCH,4),an(["SS","SS"],{S:V.SAND},V.SANDSTONE,1),pf([V.IRON_BLOCK],Ne.IRON_INGOT,9),an(["PPP","P P","PPP"],{P:V.OAK_PLANKS},V.CHEST_N,1),an(["CCC","C C","CCC"],{C:V.COBBLESTONE},V.FURNACE_N,1),an(["I I","ICI"," I "],{I:Ne.IRON_INGOT,C:V.CHEST_N},V.HOPPER,1),an(["PPP"," S "," S "],{P:V.OAK_PLANKS,S:Ne.STICK},Ne.WOOD_PICKAXE,1),an(["III"," S "," S "],{I:Ne.IRON_INGOT,S:Ne.STICK},Ne.IRON_PICKAXE,1),an(["DDD"," S "," S "],{D:Ne.DIAMOND,S:Ne.STICK},Ne.DIAMOND_PICKAXE,1),an(["P","P","S"],{P:V.OAK_PLANKS,S:Ne.STICK},Ne.WOOD_SWORD,1),an(["I","I","S"],{I:Ne.IRON_INGOT,S:Ne.STICK},Ne.IRON_SWORD,1),an(["D","D","S"],{D:Ne.DIAMOND,S:Ne.STICK},Ne.DIAMOND_SWORD,1),an(["III","III","III"],{I:Ne.IRON_INGOT},V.IRON_BLOCK,1)];function JC(t,e){let n=e,i=e,r=-1,s=-1;const o=[];for(let c=0;c<e;c++)for(let u=0;u<e;u++){const h=t[c*e+u];h!==0&&(o.push(h),u<n&&(n=u),u>r&&(r=u),c<i&&(i=c),c>s&&(s=c))}if(r<0)return null;const a=r-n+1,l=s-i+1;e:for(const c of QC){if(c.shapeless){if(c.cells.length!==o.length)continue;const u=o.slice().sort((h,d)=>h-d);for(let h=0;h<u.length;h++)if(u[h]!==c.cells[h])continue e;return c}if(!(c.w!==a||c.h!==l)&&!(c.w>e||c.h>e)){for(let u=0;u<l;u++)for(let h=0;h<a;h++)if(t[(i+u)*e+(n+h)]!==c.cells[u*c.w+h])continue e;return c}}return null}const e2=[.6,1,0];class t2{canvas;renderer;scene;camera;atlas;env;chunks;world;dayNight;player=new sC;entityRenderer;character;heldView;genWorker;meshWorker;logicWorker;outline;crackMesh;crackGeos=[];running=!1;lastFrame=0;fpsEMA=60;tickAccum=0;statsAccum=0;patchOut=[];mineTarget=null;mineProgress=0;useRepeat=0;attackCooldown=0;eatCooldown=0;prevMineHeld=!1;lavaTimer=0;fireTicks=0;regenTimer=0;shake=0;spawn=null;spawnChunkSearched=!1;toastTimer=null;workerStats={entities:0,tickMs:0};constructor(e){this.canvas=e,ZC({startWorld:n=>this.start(n),respawn:()=>this.respawn(),quitToTitle:()=>window.location.reload(),openScreen:n=>this.openScreen(n),closeScreen:()=>this.closeScreen(),invClick:(n,i,r)=>this.invClick(n,i,r),craftGridClick:(n,i,r)=>this.craftGridClick(n,i,r),craftResultClick:n=>this.craftResultClick(n),containerClick:(n,i,r,s)=>this.sendLogic({t:"click",area:n,slot:i,button:r,shift:s}),selectHotbar:n=>me.set({hotbarIndex:n}),dropHeldItem:n=>this.dropHeldItem(n),setPaused:n=>this.setPaused(n),applySettings:()=>this.applySettings(),touchMove:(n,i)=>xC(n,i),touchLook:(n,i)=>SC(n,i),touchButton:(n,i)=>yC(n,i),iconFor:n=>this.atlas.icon(yn(n).icon)})}start(e){const n=/^-?\d+$/.test(e.trim())?Number(e.trim())>>>0:vR(e.trim()===""?String(Date.now()):e.trim());me.set({phase:"loading",loadProgress:0}),this.renderer=new sR({canvas:this.canvas,antialias:!1,powerPreference:"high-performance"}),this.renderer.setSize(window.innerWidth,window.innerHeight),this.scene=new oR,this.scene.background=new Le(8893925);const i=me.get().settings;this.camera=new Gn(i.fov,window.innerWidth/window.innerHeight,.06,600),this.scene.add(this.camera),this.atlas=new TR(n),this.env=wR();const r=AR(this.atlas.texture,this.env),s=RR(this.atlas.texture,this.env);this.genWorker=new Worker(new URL(""+new URL("gen.worker-B9Pw68IM.js",import.meta.url).href,import.meta.url),{type:"module"}),this.meshWorker=new Worker(new URL(""+new URL("mesh.worker-DpgcR36X.js",import.meta.url).href,import.meta.url),{type:"module"}),this.logicWorker=new Worker(new URL(""+new URL("logic.worker-C5rSiktd.js",import.meta.url).href,import.meta.url),{type:"module"}),this.genWorker.postMessage({t:"init",seed:n}),this.logicWorker.postMessage({t:"init",seed:n}),this.logicWorker.onmessage=a=>this.handleLogic(a.data),this.chunks=new DR(this.scene,r,s,this.genWorker,this.meshWorker),this.world=this.chunks.world,this.world.onCellChanged=(a,l,c,u)=>{this.patchOut.push(a,l,c,u)},this.chunks.onChunkReady=(a,l)=>{this.logicWorker.postMessage({t:"chunk",cx:a.cx,cz:a.cz,data:l,blockEntities:a.blockEntities,mobs:a.mobs,village:a.village},[l])},this.chunks.onChunkRemoved=(a,l)=>{this.sendLogic({t:"unchunk",cx:a,cz:l})},this.chunks.renderDistance=i.renderDistance,this.dayNight=new zR(i.dayLengthSec),this.scene.add(this.dayNight.sun),this.scene.add(this.dayNight.sun.target),this.scene.add(this.dayNight.ambient),this.entityRenderer=new fC(this.atlas),this.scene.add(this.entityRenderer.group),this.character=new _C(this.atlas),this.character.group.visible=!1,this.scene.add(this.character.group),this.heldView=new vC(this.atlas,this.camera);const o=new cR(new Xi(1.002,1.002,1.002));this.outline=new lR(o,new Wv({color:1118481})),this.outline.visible=!1,this.scene.add(this.outline);for(let a=0;a<4;a++){const l=new Xi(1.004,1.004,1.004),c=[O.CRACK_0,O.CRACK_1,O.CRACK_2,O.CRACK_3][a];tx(l,[c,c,c,c,c,c]),this.crackGeos.push(l)}this.crackMesh=new Wt(this.crackGeos[0],new np({map:this.atlas.texture,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1})),this.crackMesh.visible=!1,this.scene.add(this.crackMesh),this.player.teleport(8.5,120,8.5),this.player.onFallDamage=a=>this.damagePlayer(Math.floor(a),0,0,"fall"),this.attachDOM(),this.applySettings(),this.giveStarterItems(),this.running=!0,this.lastFrame=performance.now(),requestAnimationFrame(a=>this.loop(a))}giveStarterItems(){const e=new Array(36).fill(null);e[0]=Rs(Ne.WOOD_PICKAXE,1),e[1]=Rs(Ne.WOOD_SWORD,1),e[2]=Rs(V.TORCH,16),e[3]=Rs(V.OAK_PLANKS,24),me.set({inventory:e})}attachDOM(){MC({onHotbar:e=>me.set({hotbarIndex:e}),onHotbarScroll:e=>{const n=me.get();n.screen==="none"&&me.set({hotbarIndex:(n.hotbarIndex+e+9)%9})},onInventory:()=>{const e=me.get();e.phase==="playing"&&(e.screen==="none"?this.openScreen("inventory"):this.closeScreen())},onDrop:e=>this.dropHeldItem(e),onToggleCamera:()=>{const e=me.get();e.setSettings({thirdPerson:!e.settings.thirdPerson})},onToggleDebug:()=>{const e=me.get();e.setSettings({showDebug:!e.settings.showDebug})},onEscape:()=>{const e=me.get();e.phase==="playing"&&(e.screen==="none"?this.openScreen("pause"):this.closeScreen())},isUIOpen:()=>me.get().screen!=="none"}),this.canvas.addEventListener("mousedown",e=>{const n=me.get();if(!(n.phase!=="playing"||n.screen!=="none")&&!n.settings.touchMode){if(document.pointerLockElement!==this.canvas){this.canvas.requestPointerLock();return}e.button===0&&(Ve.mineHeld=!0),e.button===2&&(Ve.useHeld=!0,Ve.useClicked=!0)}}),window.addEventListener("mouseup",e=>{e.button===0&&(Ve.mineHeld=!1),e.button===2&&(Ve.useHeld=!1)}),window.addEventListener("mousemove",e=>{if(document.pointerLockElement!==this.canvas)return;const n=me.get().settings.sensitivity*.0023;this.player.yaw-=e.movementX*n,this.player.pitch-=e.movementY*n,this.player.pitch=Math.max(-1.55,Math.min(1.55,this.player.pitch))}),document.addEventListener("pointerlockchange",()=>{const e=me.get();document.pointerLockElement!==this.canvas&&e.phase==="playing"&&e.screen==="none"&&!e.settings.touchMode&&this.openScreen("pause")}),this.canvas.addEventListener("contextmenu",e=>e.preventDefault()),window.addEventListener("resize",()=>{this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(window.innerWidth,window.innerHeight)})}loop(e){if(!this.running)return;requestAnimationFrame(r=>this.loop(r));const n=Math.min(.1,(e-this.lastFrame)/1e3);this.lastFrame=e,this.fpsEMA=this.fpsEMA*.95+(n>0?1/n:60)*.05;const i=me.get();for(this.chunks.update(Math.floor(this.player.x),Math.floor(this.player.z)),i.phase==="loading"?this.updateLoading():(i.phase==="playing"||i.phase==="dead")&&this.updatePlaying(n,i.phase==="playing"),this.dayNight.dayLengthSec=i.settings.dayLengthSec,this.dayNight.update(n,this.env,this.scene,this.camera,this.chunks.renderDistance),this.env.uTime.value=e/1e3,this.player.headInFluid&&(this.env.uFogNear.value=2,this.env.uFogFar.value=this.player.inLava?6:24,this.env.uFogColor.value.setHex(this.player.inLava?12601352:1589408)),this.entityRenderer.update(this.world,this.dayNight.sunLevel,this.player.yaw,n),this.tickAccum+=n*1e3;this.tickAccum>=kg;)this.tickAccum-=kg,this.sendLogic({t:"player",x:this.player.x,y:this.player.y,z:this.player.z,yaw:this.player.yaw,sneak:this.player.sneaking,time:this.dayNight.time,health:me.get().health});if(this.flushPatches(),this.statsAccum+=n,this.statsAccum>=.2){this.statsAccum=0;const r=this.chunks.stats();me.set({timeOfDay:this.dayNight.time,debug:{fps:Math.round(this.fpsEMA),chunks:r.chunks,pending:r.pending,entities:this.workerStats.entities,tickMs:this.workerStats.tickMs,x:Math.round(this.player.x*10)/10,y:Math.round(this.player.y*10)/10,z:Math.round(this.player.z*10)/10}})}this.renderer.render(this.scene,this.camera)}updateLoading(){if(!this.spawnChunkSearched&&this.chunks.isReady(0,0)&&(this.spawnChunkSearched=!0,this.spawn=this.findSpawn(),this.player.teleport(this.spawn[0],this.spawn[1],this.spawn[2])),this.spawn){const e=this.chunks.spawnProgress(Math.floor(this.spawn[0])>>4,Math.floor(this.spawn[2])>>4,2);me.set({loadProgress:e}),e>=1&&me.set({phase:"playing",loadProgress:1})}else me.set({loadProgress:this.chunks.isReady(0,0)?.4:.1})}findSpawn(){for(let e=0;e<4;e++)for(let n=-e;n<=e;n++)for(let i=-e;i<=e;i++){if(Math.max(Math.abs(i),Math.abs(n))!==e||!this.chunks.isReady(i,n))continue;const r=i*16+8,s=n*16+8,o=this.world.highestSolid(r,s),a=this.world.getBlockId(r,o,s);if(o>XR&&!Kv(a)&&Lt(a).solid)return[r+.5,o+1.05,s+.5]}return[8.5,this.world.highestSolid(8,8)+1.05,8.5]}updatePlaying(e,n){const i=me.get(),r=i.screen!=="none";if(Ve.lookDX!==0||Ve.lookDY!==0){const o=i.settings.sensitivity*.003;this.player.yaw-=Ve.lookDX*o,this.player.pitch-=Ve.lookDY*o,this.player.pitch=Math.max(-1.55,Math.min(1.55,this.player.pitch)),Ve.lookDX=0,Ve.lookDY=0}const s=r||!n?{...Ve,moveX:0,moveZ:0,jump:!1,sneak:!1,sprint:!1}:Ve;this.player.update(e,this.world,s),this.updateHazards(e,n),n&&!r?(this.updateMining(e),this.updateUse(e)):this.stopMining(),this.attackCooldown=Math.max(0,this.attackCooldown-e),this.eatCooldown=Math.max(0,this.eatCooldown-e),this.prevMineHeld=Ve.mineHeld,this.updateCamera(e)}updateHazards(e,n){if(!n)return;if(this.player.inLava)this.lavaTimer+=e,this.fireTicks=3,this.lavaTimer>=.5&&(this.lavaTimer=0,this.damagePlayer(4,0,0,"fire"));else if(this.lavaTimer=0,this.fireTicks>0)if(this.player.inWater)this.fireTicks=0;else{const r=Math.ceil(this.fireTicks);this.fireTicks-=e,Math.ceil(this.fireTicks)<r&&this.damagePlayer(1,0,0,"fire")}const i=me.get().health;i>0&&i<Wr&&(this.regenTimer+=e,this.regenTimer>=4&&(this.regenTimer=0,me.set({health:Math.min(Wr,i+1)})))}eyePos(){return[this.player.x,this.player.y+this.player.eyeHeight(),this.player.z]}updateMining(e){const[n,i,r]=this.eyePos(),[s,o,a]=this.player.lookDir(),l=hf(this.world,n,i,r,s,o,a,Gg);if(l?(this.outline.visible=!0,this.outline.position.set(l.x+.5,l.y+.5,l.z+.5)):this.outline.visible=!1,Ve.mineHeld&&!this.prevMineHeld){const m=this.entityRenderer.pick(n,i,r,s,o,a,3.6);if(m&&(!l||m.dist<l.dist)&&this.attackCooldown<=0){this.attackEntity(m.id);return}}if(!Ve.mineHeld||!l){this.stopMining();return}(!this.mineTarget||this.mineTarget.x!==l.x||this.mineTarget.y!==l.y||this.mineTarget.z!==l.z)&&(this.mineTarget=l,this.mineProgress=0);const c=Lt(l.id);if(c.hardness<0){me.set({breakProgress:0});return}const u=this.heldStack(),h=u?yn(u.id).tool:void 0,d=h&&c.tool===h.type,p=c.minTier===0||h?.type==="pickaxe"&&h.tier>=c.minTier;let g=c.hardness*1.5;d&&(g/=h.speed),p||(g*=3.3),g=Math.max(.05,g),this.mineProgress+=e/g,me.set({breakProgress:Math.min(1,this.mineProgress)});const v=Math.min(3,Math.floor(this.mineProgress*4));this.crackMesh.visible=!0,this.crackMesh.geometry=this.crackGeos[v],this.crackMesh.position.set(l.x+.5,l.y+.5,l.z+.5),Math.random()<e*8&&this.heldView.swing(),this.mineProgress>=1&&(this.breakBlock(l,p),this.stopMining())}stopMining(){this.mineTarget=null,this.mineProgress=0,this.crackMesh.visible=!1,me.get().breakProgress!==0&&me.set({breakProgress:0})}breakBlock(e,n){const i=Lt(e.id);if((jo(e.id)||Kh(e.id)||e.id===V.HOPPER||e.id===V.SPAWNER)&&this.sendLogic({t:"breakBE",x:e.x,y:e.y,z:e.z}),this.world.setBlock(e.x,e.y,e.z,V.AIR),n&&i.drop!==-1){const r=i.drop??e.id;this.sendLogic({t:"spawnItem",x:e.x+.5,y:e.y+.3,z:e.z+.5,stack:Rs(r,1),vx:(Math.random()-.5)*1.5,vy:2.4,vz:(Math.random()-.5)*1.5})}this.useTool(1),this.heldView.swing(),this.character.swing()}attackEntity(e){this.attackCooldown=.4;const n=this.heldStack(),i=n?yn(n.id).tool:void 0,r=i?i.damage:1,[s,,o]=this.player.lookDir(),a=Math.hypot(s,o)||1;this.sendLogic({t:"attack",entityId:e,damage:r,kx:s/a*7,kz:o/a*7}),i?.type==="sword"&&this.useTool(1),this.heldView.swing(),this.character.swing()}useTool(e){const n=me.get(),i=n.inventory.map(Ht),r=i[n.hotbarIndex];!r||r.dur===void 0||(r.dur-=e,r.dur<=0&&(i[n.hotbarIndex]=null,this.toast(`${yn(r.id).name} broke!`)),me.set({inventory:i}))}updateUse(e){this.useRepeat-=e;const n=Ve.useClicked||Ve.useHeld&&this.useRepeat<=0;if(Ve.useClicked=!1,!n)return;this.useRepeat=.24;const[i,r,s]=this.eyePos(),[o,a,l]=this.player.lookDir(),c=hf(this.world,i,r,s,o,a,l,Gg);if(c&&!this.player.sneaking&&_R(c.id)){this.interactWith(c);return}const u=this.heldStack();if(!u)return;const h=yn(u.id);if(h.food&&this.eatCooldown<=0&&me.get().health<Wr){this.eatCooldown=1,me.set({health:Math.min(Wr,me.get().health+h.food)}),this.consumeHeld(),this.heldView.swing();return}c&&Ta(u.id)&&this.tryPlace(c,u.id)}interactWith(e){if(e.id===V.CRAFTING_TABLE){this.openScreen("crafting");return}const n=me.get();this.sendLogic({t:"open",x:e.x,y:e.y,z:e.z,inv:n.inventory.map(Ht)})}tryPlace(e,n){const i=e.x+e.nx,r=e.y+e.ny,s=e.z+e.nz;if(r<0||r>=255)return;const o=this.world.getBlockId(i,r,s);if(!Lt(o).replaceable)return;let a=n;const l=Lt(n);if(l.renderType===3){const c=this.world.getBlockId(i,r-1,s);if(n===V.TORCH){if(!(Lt(c).solid||Lt(this.world.getBlockId(i+1,r,s)).solid||Lt(this.world.getBlockId(i-1,r,s)).solid||Lt(this.world.getBlockId(i,r,s+1)).solid||Lt(this.world.getBlockId(i,r,s-1)).solid))return}else if(c!==V.GRASS&&c!==V.DIRT&&c!==V.SNOW_GRASS)return}if(l.solid){const c=zr/2,u=this.player.height;if(i+1>this.player.x-c&&i<this.player.x+c&&s+1>this.player.z-c&&s<this.player.z+c&&r+1>this.player.y&&r<this.player.y+u)return}if(n===V.FURNACE_N||jo(n)){const c=(this.player.yaw%(Math.PI*2)+Math.PI*2)%(Math.PI*2),u=Math.round(c/(Math.PI/2))%4,h=["s","e","n","w"][u];a=(jo(n)?V.CHEST_N:V.FURNACE_N)+{n:0,s:1,e:2,w:3}[h]}this.world.setBlock(i,r,s,a),(jo(a)||Kh(a)||a===V.HOPPER)&&this.sendLogic({t:"placeBE",x:i,y:r,z:s,blockId:a}),this.consumeHeld(),this.heldView.swing(),this.character.swing()}consumeHeld(){const e=me.get(),n=e.inventory.map(Ht);Zg(n,e.hotbarIndex),me.set({inventory:n})}heldStack(){const e=me.get();return e.inventory[e.hotbarIndex]}updateCamera(e){const n=me.get(),i=this.player.y+this.player.eyeHeight();this.shake=Math.max(0,this.shake-e*3);const r=this.shake>0?(Math.random()-.5)*this.shake*.3:0,s=this.shake>0?(Math.random()-.5)*this.shake*.3:0;if(this.camera.rotation.order="YXZ",this.camera.rotation.set(this.player.pitch+s,this.player.yaw+r,0),n.settings.thirdPerson){const[o,a,l]=this.player.lookDir();let c=4;const u=hf(this.world,this.player.x,i,this.player.z,-o,-a,-l,4.2);u&&(c=Math.max(.5,u.dist-.3)),this.camera.position.set(this.player.x-o*c,i-a*c,this.player.z-l*c),this.character.group.visible=!0;const h=Math.hypot(this.player.vx,this.player.vz),d=this.world.getVoxel(Math.floor(this.player.x),Math.floor(this.player.y+1),Math.floor(this.player.z)),p=Math.max(.12,Math.max((d>>8&15)/15*this.dayNight.sunLevel,(d>>12&15)/15));this.character.update(e,this.player.x,this.player.y,this.player.z,this.player.yaw,this.player.pitch,h,p,this.heldStack()?.id??0),this.heldView.group.visible=!1}else{this.camera.position.set(this.player.x+r,i,this.player.z+s),this.character.group.visible=!1,this.heldView.group.visible=!0;const o=this.world.getVoxel(Math.floor(this.player.x),Math.floor(i),Math.floor(this.player.z)),a=Math.max(.15,Math.max((o>>8&15)/15*this.dayNight.sunLevel,(o>>12&15)/15));this.heldView.update(e,this.heldStack()?.id??0,Math.hypot(this.player.vx,this.player.vz),a)}}handleLogic(e){switch(e.t){case"snap":this.entityRenderer.applySnapshot(new Float32Array(e.buf),e.count);break;case"blocks":{const n=new Int32Array(e.cells);for(let i=0;i<n.length;i+=4)this.world.setBlock(n[i],n[i+1],n[i+2],n[i+3]);break}case"give":{const n=me.get();if(n.container)break;const i=n.inventory.map(Ht),r=Ur(i,e.stack);me.set({inventory:i}),r&&this.sendLogic({t:"spawnItem",x:this.player.x,y:this.player.y+.5,z:this.player.z,stack:r,vx:0,vy:.5,vz:0});break}case"damage":this.damagePlayer(e.amount,e.kx,e.kz,e.cause);break;case"containerSync":{me.set({container:{kind:e.kind,x:e.x,y:e.y,z:e.z,slots:e.slots,fuel:e.fuel,cook:e.cook},inventory:e.inv,cursor:e.cursor,screen:"container"}),document.exitPointerLock?.();break}case"containerClosed":{const n=e.inv.map(Ht),i=Ht(e.cursor);if(i){const r=Ur(n,i);r&&this.sendLogic({t:"spawnItem",x:this.player.x,y:this.player.y+.5,z:this.player.z,stack:r,vx:0,vy:1,vz:0})}me.set({inventory:n,cursor:null,container:null});break}case"explosion":{const n=Math.hypot(e.x-this.player.x,e.y-this.player.y,e.z-this.player.z);this.shake=Math.max(this.shake,Math.min(1.5,e.radius*3/Math.max(2,n)));break}case"stats":this.workerStats={entities:e.entities,tickMs:e.tickMs};break}}damagePlayer(e,n,i,r){if(e<=0)return;const s=me.get();if(s.phase!=="playing")return;const o=Math.max(0,s.health-e);me.set({health:o}),this.player.vx+=n,this.player.vz+=i,(n!==0||i!==0)&&(this.player.vy+=3),this.shake=Math.max(this.shake,.5),o<=0&&this.die()}die(){const e=me.get();for(const n of[...e.inventory,e.cursor])n&&this.sendLogic({t:"spawnItem",x:this.player.x,y:this.player.y+.8,z:this.player.z,stack:n,vx:(Math.random()-.5)*4,vy:2+Math.random()*2,vz:(Math.random()-.5)*4});me.set({phase:"dead",inventory:new Array(36).fill(null),cursor:null,screen:"none"}),document.exitPointerLock?.()}respawn(){const e=this.spawn??[8.5,90,8.5];this.player.teleport(e[0],e[1],e[2]),this.fireTicks=0,me.set({phase:"playing",health:Wr})}sendLogic(e){this.logicWorker.postMessage(e)}flushPatches(){if(this.patchOut.length===0)return;const e=new Int32Array(this.patchOut);this.patchOut.length=0,this.logicWorker.postMessage({t:"patch",cells:e.buffer},[e.buffer])}openScreen(e){if(me.get().phase!=="playing")return;const i=e==="crafting"?3:2;me.set({screen:e,craftSize:i,craftGrid:new Array(9).fill(null),craftResult:null}),document.exitPointerLock?.(),this.stopMining()}closeScreen(){const e=me.get();if(e.screen==="container")this.sendLogic({t:"close"}),me.set({screen:"none",container:null});else{const n=e.inventory.map(Ht),i=r=>{if(!r)return;const s=Ur(n,r);s&&this.sendLogic({t:"spawnItem",x:this.player.x,y:this.player.y+.5,z:this.player.z,stack:s,vx:0,vy:1,vz:0})};for(const r of e.craftGrid)i(r);i(e.cursor),me.set({screen:"none",inventory:n,cursor:null,craftGrid:new Array(9).fill(null),craftResult:null})}!me.get().settings.touchMode&&me.get().phase==="playing"&&this.canvas.requestPointerLock()}setPaused(e){e?this.openScreen("pause"):this.closeScreen()}invClick(e,n,i){const r=me.get();if(r.screen==="container"){this.sendLogic({t:"click",area:1,slot:e,button:n,shift:i});return}const s=r.inventory.map(Ht);let o=Ht(r.cursor);if(i&&s[e]){const a=s[e];s[e]=null;const l=e<9?Ur(s,a,9,36):Ur(s,a,0,9);l&&(s[e]=l)}else o=Qg(s,e,o,n);me.set({inventory:s,cursor:o})}craftGridClick(e,n,i){const r=me.get(),s=r.craftSize;if(e>=s*s)return;const o=r.craftGrid.map(Ht);let a=Ht(r.cursor);if(i&&o[e]){const l=r.inventory.map(Ht),c=Ur(l,o[e]);o[e]=c,me.set({inventory:l})}else a=Qg(o,e,a,n);me.set({craftGrid:o,cursor:a,craftResult:this.computeCraft(o,s)})}computeCraft(e,n){const i=new Array(n*n).fill(0);for(let s=0;s<n*n;s++)i[s]=e[s]?.id??0;const r=JC(i,n);return r?Rs(r.result,r.count):null}craftResultClick(e){const n=me.get(),i=n.craftSize;let r=n.craftGrid.map(Ht),s=this.computeCraft(r,i);if(!s)return;const o=n.inventory.map(Ht);let a=Ht(n.cursor);const l=()=>{for(let c=0;c<i*i;c++)r[c]&&Zg(r,c)};if(e){let c=256;for(;s&&c-- >0&&!Ur(o,{...s});)l(),s=this.computeCraft(r,i)}else{const c=yn(s.id).maxStack;if(a&&(a.id!==s.id||a.count+s.count>c||a.dur!==void 0))return;a?a.count+=s.count:a={...s},l()}r=r.map(Ht),me.set({inventory:o,cursor:a,craftGrid:r,craftResult:this.computeCraft(r,i)})}dropHeldItem(e){const n=me.get();if(n.phase!=="playing"||n.screen!=="none")return;const i=n.inventory.map(Ht),r=i[n.hotbarIndex];if(!r)return;const s=e?r.count:1;r.count-=s,r.count<=0&&(i[n.hotbarIndex]=null);const[o,a,l]=this.player.lookDir(),c={id:r.id,count:s};r.dur!==void 0&&(c.dur=r.dur),this.sendLogic({t:"spawnItem",x:this.player.x+o,y:this.player.y+1.3,z:this.player.z+l,stack:c,vx:o*5,vy:a*5+1.5,vz:l*5}),me.set({inventory:i})}applySettings(){const e=me.get().settings;this.chunks.renderDistance=e.renderDistance,this.camera.fov=e.fov,this.camera.updateProjectionMatrix();const n=e2[e.quality]||window.devicePixelRatio||1;this.renderer.setPixelRatio(Math.min(n===0?window.devicePixelRatio:n,2.5)),this.dayNight.dayLengthSec=e.dayLengthSec}toast(e){me.set({toast:e}),this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>me.set({toast:null}),2500)}dispose(){this.running=!1,sx(),this.genWorker?.terminate(),this.meshWorker?.terminate(),this.logicWorker?.terminate(),this.chunks?.dispose(),this.entityRenderer?.dispose(),this.renderer?.dispose()}}function n2(t){return new t2(t)}function i2(){const t=rt(a=>a.inventory),e=rt(a=>a.hotbarIndex),n=rt(a=>a.health),i=rt(a=>a.breakProgress),r=rt(a=>a.toast),s=rt(a=>a.screen),o=t[e]?yn(t[e].id).name:null;return G.jsxs("div",{className:"absolute inset-0 pointer-events-none font-game",children:[s==="none"&&G.jsxs("div",{className:"absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",children:[G.jsxs("div",{className:"relative w-5 h-5 opacity-80",children:[G.jsx("div",{className:"absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-white mix-blend-difference"}),G.jsx("div",{className:"absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-white mix-blend-difference"})]}),i>0&&G.jsxs("svg",{className:"absolute -left-4 -top-4 w-13 h-13",width:"52",height:"52",viewBox:"0 0 52 52",children:[G.jsx("circle",{cx:"26",cy:"26",r:"20",fill:"none",stroke:"#00000060",strokeWidth:"5"}),G.jsx("circle",{cx:"26",cy:"26",r:"20",fill:"none",stroke:"#ffffffc0",strokeWidth:"5",strokeDasharray:`${i*125.6} 125.6`,transform:"rotate(-90 26 26)"})]})]}),G.jsx("div",{className:"absolute bottom-[76px] left-1/2 -translate-x-1/2 flex gap-0.5",children:Array.from({length:Wr/2},(a,l)=>{const c=n-l*2;return G.jsx("span",{className:"text-lg leading-none",style:{color:c>=2?"#e83030":c>=1?"#e87878":"#3a3a3a",textShadow:"1px 1px 0 #000"},children:"♥"},l)})}),o&&s==="none"&&G.jsx("div",{className:"absolute bottom-[120px] left-1/2 -translate-x-1/2 text-white text-sm px-2 py-0.5 bg-black/40 rounded",style:{textShadow:"1px 1px 0 #000"},children:o}),G.jsx("div",{className:"absolute bottom-3 left-1/2 -translate-x-1/2 flex pointer-events-auto bg-black/40 p-1 rounded",children:t.slice(0,9).map((a,l)=>G.jsx("div",{className:`relative w-12 h-12 m-0.5 border-2 ${l===e?"border-white bg-white/20":"border-gray-600 bg-black/30"}`,onMouseDown:c=>{c.preventDefault(),it().selectHotbar(l)},children:a&&G.jsxs(G.Fragment,{children:[G.jsx("img",{src:it().iconFor(a.id),alt:"",className:"absolute inset-0 m-auto w-9 h-9 pointer-events-none",style:{imageRendering:"pixelated"},draggable:!1}),a.count>1&&G.jsx("span",{className:"absolute bottom-0 right-0.5 text-white text-sm font-bold pointer-events-none",style:{textShadow:"1px 1px 0 #3f3f3f"},children:a.count})]})},l))}),r&&G.jsx("div",{className:"absolute top-16 left-1/2 -translate-x-1/2 text-white bg-black/60 px-4 py-2 rounded text-sm",style:{textShadow:"1px 1px 0 #000"},children:r}),n<=6&&n>0&&G.jsx("div",{className:"absolute inset-0 animate-pulse-fast",style:{boxShadow:"inset 0 0 120px 40px rgba(200,0,0,0.45)"}})]})}function r2(){const t=rt(i=>i.debug),e=rt(i=>i.settings.showDebug),n=rt(i=>i.timeOfDay);return e?G.jsx("div",{className:"absolute top-2 left-2 text-xs text-white font-mono bg-black/50 p-2 rounded pointer-events-none whitespace-pre leading-relaxed",children:`FPS ${t.fps}  tick ${t.tickMs}ms
XYZ ${t.x.toFixed(1)} / ${t.y.toFixed(1)} / ${t.z.toFixed(1)}
chunks ${t.chunks} (queued ${t.pending})
entities ${t.entities}
time ${(n*24).toFixed(1)}h`}):null}function Li({stack:t,onClickSlot:e,size:n=44,highlight:i=!1}){const r=a=>{a.preventDefault(),a.stopPropagation(),(a.button===0||a.button===2)&&e(a.button,a.shiftKey)},s=t?yn(t.id):null,o=t&&t.dur!==void 0&&s?.tool?t.dur/s.tool.durability:null;return G.jsx("div",{className:`relative border-2 select-none ${i?"bg-white/40 border-white/70":"bg-black/25 border-t-mc-slot-dark border-l-mc-slot-dark border-b-white/60 border-r-white/60"}`,style:{width:n,height:n},onMouseDown:r,onContextMenu:a=>a.preventDefault(),children:t&&s&&G.jsxs(G.Fragment,{children:[G.jsx("img",{src:it().iconFor(t.id),alt:s.name,title:s.name,className:"absolute inset-0 m-auto pointer-events-none",style:{width:n-10,height:n-10,imageRendering:"pixelated"},draggable:!1}),t.count>1&&G.jsx("span",{className:"absolute bottom-0 right-0.5 text-white font-bold pointer-events-none",style:{fontSize:n*.38,textShadow:"1px 1px 0 #3f3f3f"},children:t.count}),o!==null&&o<1&&G.jsx("div",{className:"absolute bottom-0.5 left-1 right-1 h-1 bg-black/70 pointer-events-none",children:G.jsx("div",{className:"h-full",style:{width:`${Math.max(3,o*100)}%`,background:o>.5?"#3ddb3d":o>.2?"#dbc63d":"#db3d3d"}})})]})})}function cp({stack:t}){const[e,n]=en.useState([0,0]);return en.useEffect(()=>{const i=r=>n([r.clientX,r.clientY]);return window.addEventListener("mousemove",i),()=>window.removeEventListener("mousemove",i)},[]),t?G.jsxs("div",{className:"fixed pointer-events-none z-[100]",style:{left:e[0]-18,top:e[1]-18},children:[G.jsx("img",{src:it().iconFor(t.id),alt:"",style:{width:36,height:36,imageRendering:"pixelated"},draggable:!1}),t.count>1&&G.jsx("span",{className:"absolute bottom-0 right-0 text-white font-bold",style:{fontSize:15,textShadow:"1px 1px 0 #3f3f3f"},children:t.count})]}):null}function up({title:t,children:e}){return G.jsx("div",{className:"absolute inset-0 flex items-center justify-center bg-black/55 pointer-events-auto",onMouseDown:n=>{n.target===n.currentTarget&&it().closeScreen()},children:G.jsxs("div",{className:"bg-mc-panel border-4 border-t-white border-l-white border-b-mc-slot-dark border-r-mc-slot-dark p-4 rounded-sm shadow-2xl",children:[G.jsxs("div",{className:"flex items-center justify-between mb-2",children:[G.jsx("h2",{className:"text-mc-slot-dark font-bold",children:t}),G.jsx("button",{className:"text-mc-slot-dark font-bold px-2 hover:text-red-700",onMouseDown:n=>{n.preventDefault(),it().closeScreen()},children:"✕"})]}),e]})})}function fp({slots:t,area:e,container:n}){const i=r=>(s,o)=>{n?it().containerClick(e,r,s,o):it().invClick(r,s,o)};return G.jsxs("div",{children:[G.jsx("div",{className:"grid grid-cols-9 gap-0.5",children:Array.from({length:27},(r,s)=>{const o=s+9;return G.jsx(Li,{stack:t[o],onClickSlot:i(o)},o)})}),G.jsx("div",{className:"grid grid-cols-9 gap-0.5 mt-2",children:Array.from({length:9},(r,s)=>G.jsx(Li,{stack:t[s],onClickSlot:i(s)},s))})]})}function dx({size:t}){const e=rt(i=>i.craftGrid),n=rt(i=>i.craftResult);return G.jsxs("div",{className:"flex items-center gap-3 mb-3 justify-center",children:[G.jsx("div",{className:`grid gap-0.5 ${t===2?"grid-cols-2":"grid-cols-3"}`,children:Array.from({length:t*t},(i,r)=>G.jsx(Li,{stack:e[r],onClickSlot:(s,o)=>it().craftGridClick(r,s,o)},r))}),G.jsx("span",{className:"text-2xl text-mc-slot-dark font-bold",children:"→"}),G.jsx(Li,{stack:n,highlight:n!==null,onClickSlot:(i,r)=>it().craftResultClick(r),size:52})]})}function s2(){const t=rt(n=>n.inventory),e=rt(n=>n.cursor);return G.jsxs(up,{title:"Inventory",children:[G.jsx(dx,{size:2}),G.jsx(fp,{slots:t,area:1,container:!1}),G.jsx(cp,{stack:e})]})}function o2(){const t=rt(n=>n.inventory),e=rt(n=>n.cursor);return G.jsxs(up,{title:"Crafting Table",children:[G.jsx(dx,{size:3}),G.jsx(fp,{slots:t,area:1,container:!1}),G.jsx(cp,{stack:e})]})}function a2(){const t=rt(r=>r.container),e=rt(r=>r.inventory),n=rt(r=>r.cursor);if(!t)return null;let i="Chest";return t.kind==="furnace"&&(i="Furnace"),t.kind==="hopper"&&(i="Hopper"),G.jsxs(up,{title:i,children:[t.kind==="chest"&&G.jsx("div",{className:"grid grid-cols-9 gap-0.5 mb-3",children:t.slots.map((r,s)=>G.jsx(Li,{stack:r,onClickSlot:(o,a)=>it().containerClick(0,s,o,a)},s))}),t.kind==="hopper"&&G.jsx("div",{className:"flex justify-center gap-0.5 mb-3",children:t.slots.map((r,s)=>G.jsx(Li,{stack:r,onClickSlot:(o,a)=>it().containerClick(0,s,o,a)},s))}),t.kind==="furnace"&&G.jsxs("div",{className:"flex items-center justify-center gap-4 mb-3",children:[G.jsxs("div",{className:"flex flex-col items-center gap-1",children:[G.jsx(Li,{stack:t.slots[0],onClickSlot:(r,s)=>it().containerClick(0,0,r,s)}),G.jsxs("div",{className:"w-8 h-8 relative flex items-end justify-center",children:[G.jsx("div",{className:"w-6 bg-gradient-to-t from-orange-600 to-yellow-300",style:{height:`${Math.round(t.fuel*100)}%`}}),G.jsx("span",{className:"absolute inset-0 text-center text-lg pointer-events-none",children:"🔥"})]}),G.jsx(Li,{stack:t.slots[1],onClickSlot:(r,s)=>it().containerClick(0,1,r,s)})]}),G.jsxs("div",{className:"w-20 h-5 bg-black/30 relative rounded",children:[G.jsx("div",{className:"h-full bg-white/80 rounded",style:{width:`${Math.round(t.cook*100)}%`}}),G.jsx("span",{className:"absolute inset-0 text-center text-mc-slot-dark text-sm leading-5 pointer-events-none",children:"▶▶"})]}),G.jsx(Li,{stack:t.slots[2],size:56,onClickSlot:(r,s)=>it().containerClick(0,2,r,s)})]}),G.jsx(fp,{slots:e,area:1,container:!0}),G.jsx(cp,{stack:n})]})}const wa="block w-72 mx-auto my-2 py-2.5 px-4 bg-[#6f6f6f] hover:bg-[#7f8fb0] text-white font-bold border-2 border-t-[#a8a8a8] border-l-[#a8a8a8] border-b-[#3f3f3f] border-r-[#3f3f3f] active:border-t-[#3f3f3f] active:border-b-[#a8a8a8] select-none";function l2(){const t=rt(n=>n.seedText),e=rt(n=>n.set);return G.jsxs("div",{className:"absolute inset-0 bg-gradient-to-b from-[#10131f] to-[#2c3a26] flex flex-col items-center justify-center pointer-events-auto font-game",children:[G.jsx("h1",{className:"text-6xl font-extrabold text-white mb-1 tracking-wider",style:{textShadow:"4px 4px 0 #3f3f3f"},children:"VOXELCRAFT"}),G.jsx("p",{className:"text-yellow-300 mb-10 italic",style:{textShadow:"2px 2px 0 #3f3f3f"},children:"100% browser-native voxel engine"}),G.jsx("input",{className:"w-72 px-3 py-2 mb-2 bg-black/60 text-white border-2 border-[#a8a8a8] outline-none text-center",placeholder:"World seed (blank = random)",value:t,onChange:n=>e({seedText:n.target.value}),onKeyDown:n=>{n.key==="Enter"&&it().startWorld(t)}}),G.jsx("button",{className:wa,onClick:()=>it().startWorld(t),children:"Create World"}),G.jsxs("div",{className:"mt-8 text-gray-300 text-xs text-center leading-5 max-w-md",children:["WASD move · Space jump · Shift sneak · Ctrl sprint · E inventory · Q drop",G.jsx("br",{}),"Left-click mine / attack · Right-click place / interact · F5 camera · F3 debug"]})]})}function c2(){const t=rt(e=>e.loadProgress);return G.jsxs("div",{className:"absolute inset-0 bg-[#10131f] flex flex-col items-center justify-center pointer-events-auto font-game",children:[G.jsx("h2",{className:"text-2xl text-white mb-6",style:{textShadow:"2px 2px 0 #3f3f3f"},children:"Generating world…"}),G.jsx("div",{className:"w-80 h-4 bg-black/70 border-2 border-[#a8a8a8]",children:G.jsx("div",{className:"h-full bg-green-500 transition-all duration-200",style:{width:`${Math.round(t*100)}%`}})}),G.jsx("p",{className:"text-gray-400 text-sm mt-3",children:"Carving caves, planting villages, waking up mobs…"})]})}function Fo({label:t,value:e,min:n,max:i,step:r,format:s,onChange:o}){return G.jsxs("label",{className:"block w-72 mx-auto my-3 text-white text-sm",children:[G.jsxs("span",{className:"flex justify-between mb-1",children:[G.jsx("span",{children:t}),G.jsx("span",{className:"text-yellow-300",children:s(e)})]}),G.jsx("input",{type:"range",className:"w-full accent-green-500",min:n,max:i,step:r,value:e,onChange:a=>o(Number(a.target.value))})]})}function u2(){const t=rt(i=>i.settings),e=rt(i=>i.setSettings),n=i=>{e(i),it().applySettings()};return G.jsxs("div",{className:"absolute inset-0 bg-black/65 flex flex-col items-center justify-center pointer-events-auto font-game overflow-y-auto py-6",children:[G.jsx("h2",{className:"text-3xl text-white font-bold mb-4",style:{textShadow:"2px 2px 0 #3f3f3f"},children:"Game Paused"}),G.jsx("button",{className:wa,onClick:()=>it().closeScreen(),children:"Back to Game"}),G.jsxs("div",{className:"bg-black/40 rounded p-4 mt-4",children:[G.jsx(Fo,{label:"Render Distance",value:t.renderDistance,min:nC,max:iC,step:1,format:i=>`${i} chunks`,onChange:i=>n({renderDistance:i})}),G.jsx(Fo,{label:"Field of View",value:t.fov,min:50,max:110,step:1,format:i=>`${i}°`,onChange:i=>n({fov:i})}),G.jsx(Fo,{label:"Graphics Quality",value:t.quality,min:0,max:2,step:1,format:i=>["Fast","Balanced","Fancy"][i],onChange:i=>n({quality:i})}),G.jsx(Fo,{label:"Day Length",value:t.dayLengthSec,min:120,max:1800,step:60,format:i=>`${Math.round(i/60)} min`,onChange:i=>n({dayLengthSec:i})}),G.jsx(Fo,{label:"Mouse Sensitivity",value:t.sensitivity,min:.2,max:2.5,step:.1,format:i=>`${Math.round(i*100)}%`,onChange:i=>n({sensitivity:i})}),G.jsxs("label",{className:"flex w-72 mx-auto my-3 text-white text-sm justify-between items-center",children:[G.jsx("span",{children:"Touch Controls"}),G.jsx("input",{type:"checkbox",className:"w-5 h-5 accent-green-500",checked:t.touchMode,onChange:i=>n({touchMode:i.target.checked})})]})]}),G.jsx("button",{className:wa,onClick:()=>it().quitToTitle(),children:"Quit to Title"})]})}function f2(){return G.jsxs("div",{className:"absolute inset-0 bg-red-900/60 flex flex-col items-center justify-center pointer-events-auto font-game",children:[G.jsx("h2",{className:"text-5xl text-white font-bold mb-8",style:{textShadow:"3px 3px 0 #3f1010"},children:"You died!"}),G.jsx("button",{className:wa,onClick:()=>it().respawn(),children:"Respawn"}),G.jsx("button",{className:wa,onClick:()=>it().quitToTitle(),children:"Quit to Title"})]})}const ei=64;function h2(){const t=en.useRef(!1),[e,n]=en.useState(!1),i=en.useRef(null),r=en.useRef(null),s=en.useRef([0,0]),o=en.useRef([0,0]),[a,l]=en.useState(null),[c,u]=en.useState([0,0]),h=m=>{for(let f=0;f<m.changedTouches.length;f++){const _=m.changedTouches[f];_.clientX<window.innerWidth*.45&&_.clientY>window.innerHeight*.4&&i.current===null?(i.current=_.identifier,s.current=[_.clientX,_.clientY],l([_.clientX,_.clientY]),u([0,0])):r.current===null&&(r.current=_.identifier,o.current=[_.clientX,_.clientY])}},d=m=>{for(let f=0;f<m.changedTouches.length;f++){const _=m.changedTouches[f];if(_.identifier===i.current){let x=_.clientX-s.current[0],y=_.clientY-s.current[1];const b=Math.hypot(x,y);b>ei&&(x=x/b*ei,y=y/b*ei),u([x,y]),it().touchMove(x/ei,-y/ei)}else if(_.identifier===r.current){const x=_.clientX-o.current[0],y=_.clientY-o.current[1];o.current=[_.clientX,_.clientY],it().touchLook(x*2.4,y*2.4)}}},p=m=>{for(let f=0;f<m.changedTouches.length;f++){const _=m.changedTouches[f];_.identifier===i.current?(i.current=null,l(null),it().touchMove(0,0)):_.identifier===r.current&&(r.current=null)}},g=m=>({onTouchStart:f=>{f.stopPropagation(),it().touchButton(m,!0)},onTouchEnd:f=>{f.stopPropagation(),it().touchButton(m,!1)}}),v="absolute w-16 h-16 rounded-full bg-white/25 border-2 border-white/50 text-white text-xl flex items-center justify-center select-none active:bg-white/50 pointer-events-auto";return G.jsxs("div",{className:"absolute inset-0 pointer-events-auto touch-none select-none",onTouchStart:h,onTouchMove:d,onTouchEnd:p,onTouchCancel:p,children:[a&&G.jsx("div",{className:"absolute rounded-full border-2 border-white/40 bg-white/10 pointer-events-none",style:{left:a[0]-ei,top:a[1]-ei,width:ei*2,height:ei*2},children:G.jsx("div",{className:"absolute w-12 h-12 rounded-full bg-white/50",style:{left:ei-24+c[0],top:ei-24+c[1]}})}),G.jsx("div",{className:v,style:{right:24,bottom:120},...g("jump"),children:"⬆"}),G.jsx("div",{className:`${v} ${e?"bg-green-500/60":""}`,style:{right:104,bottom:70},onTouchStart:m=>{m.stopPropagation(),t.current=!t.current,n(t.current),it().touchButton("sneak",t.current)},children:"🐢"}),G.jsx("div",{className:v,style:{right:24,bottom:220},...g("attack"),children:"⛏"}),G.jsx("div",{className:v,style:{right:104,bottom:170},...g("use"),children:"🧱"}),G.jsx("button",{className:"absolute top-3 right-3 w-12 h-12 rounded bg-white/25 border-2 border-white/50 text-white text-xl pointer-events-auto",onTouchStart:m=>{m.stopPropagation(),it().openScreen("inventory")},children:"🎒"}),G.jsx("button",{className:"absolute top-3 right-[68px] w-12 h-12 rounded bg-white/25 border-2 border-white/50 text-white text-xl pointer-events-auto",onTouchStart:m=>{m.stopPropagation(),it().openScreen("pause")},children:"⚙"}),G.jsx(d2,{})]})}function d2(){return rt(t=>t.screen),null}function p2(){const t=en.useRef(null),e=en.useRef(null),n=rt(a=>a.phase),i=rt(a=>a.screen),r=rt(a=>a.settings.touchMode),[s,o]=en.useState(!1);return en.useEffect(()=>(t.current&&!e.current&&(e.current=n2(t.current),o(!0)),()=>{e.current?.dispose(),e.current=null}),[]),G.jsxs("div",{className:"fixed inset-0 overflow-hidden bg-mc-dark",children:[G.jsx("canvas",{ref:t,className:"absolute inset-0 w-full h-full"}),s&&G.jsxs(G.Fragment,{children:[n==="title"&&G.jsx(l2,{}),n==="loading"&&G.jsx(c2,{}),(n==="playing"||n==="dead")&&G.jsxs(G.Fragment,{children:[G.jsx(i2,{}),G.jsx(r2,{}),n==="playing"&&i==="none"&&r&&G.jsx(h2,{}),i==="inventory"&&G.jsx(s2,{}),i==="crafting"&&G.jsx(o2,{}),i==="container"&&G.jsx(a2,{}),i==="pause"&&G.jsx(u2,{}),n==="dead"&&G.jsx(f2,{})]})]})]})}mf.createRoot(document.getElementById("root")).render(G.jsx(en.StrictMode,{children:G.jsx(p2,{})}));
