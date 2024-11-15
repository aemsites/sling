(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["MyLibrary"] = factory();
	else
		root["MyLibrary"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 196:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
function _slicedToArray(t,e){return _arrayWithHoles(t)||_iterableToArrayLimit(t,e)||_unsupportedIterableToArray(t,e)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _iterableToArrayLimit(t,e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t)){var n=[],r=!0,o=!1,a=void 0;try{for(var i,u=t[Symbol.iterator]();!(r=(i=u.next()).done)&&(n.push(i.value),!e||n.length!==e);r=!0);}catch(t){o=!0,a=t}finally{try{r||null==u.return||u.return()}finally{if(o)throw a}}return n}}function _arrayWithHoles(t){if(Array.isArray(t))return t}function _createForOfIteratorHelper(t){if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(t=_unsupportedIterableToArray(t))){var e=0,n=function(){};return{s:n,n:function(){return e>=t.length?{done:!0}:{done:!1,value:t[e++]}},e:function(t){throw t},f:n}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var r,o,a=!0,i=!1;return{s:function(){r=t[Symbol.iterator]()},n:function(){var t=r.next();return a=t.done,t},e:function(t){i=!0,o=t},f:function(){try{a||null==r.return||r.return()}finally{if(i)throw o}}}}function _unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return _arrayLikeToArray(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(n):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_arrayLikeToArray(t,e):void 0}}function _arrayLikeToArray(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}!function a(i,u,c){function f(e,t){if(!u[e]){if(!i[e]){var n=undefined;if(!t&&n)return require(e,!0);if(s)return s(e,!0);var r=new Error("Cannot find module '"+e+"'");throw r.code="MODULE_NOT_FOUND",r}var o=u[e]={exports:{}};i[e][0].call(o.exports,function(t){return f(i[e][1][t]||t)},o,o.exports,a,i,u,c)}return u[e].exports}for(var s=undefined,t=0;t<c.length;t++)f(c[t]);return f}({1:[function(t,wn,En){(function(On){(function(){function n(t,e){for(var n=-1,r=null==t?0:t.length,o=0,a=[];++n<r;){var i=t[n];e(i,n,t)&&(a[o++]=i)}return a}function a(t,e){for(var n=-1,r=null==t?0:t.length,o=Array(r);++n<r;)o[n]=e(t[n],n,t);return o}function f(t,e){for(var n=-1,r=e.length,o=t.length;++n<r;)t[o+n]=e[n];return t}function b(t,e){for(var n=-1,r=null==t?0:t.length;++n<r;)if(e(t[n],n,t))return!0;return!1}function o(t,e,n){var r=t.length;for(n+=-1;++n<r;)if(e(t[n],n,t))return n;return-1}function i(t){return t!=t}function t(e){return function(t){return e(t)}}function h(t){var n=-1,r=Array(t.size);return t.forEach(function(t,e){r[++n]=[e,t]}),r}function e(e){var n=Object;return function(t){return e(n(t))}}function v(t){var e=-1,n=Array(t.size);return t.forEach(function(t){n[++e]=t}),n}function r(){}function u(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}function c(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}function s(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}function d(t){var e=-1,n=null==t?0:t.length;for(this.__data__=new s;++e<n;)this.add(t[e])}function g(t){this.size=(this.__data__=new c(t)).size}function l(t,e){var n=hn(t),r=!n&&bn(t),o=!n&&!r&&vn(t),a=!n&&!r&&!o&&_n(t);if(n=n||r||o||a){r=t.length;for(var i=String,u=-1,c=Array(r);++u<r;)c[u]=i(u);r=c}else r=[];var f;i=r.length;for(f in t)!e&&!be.call(t,f)||n&&("length"==f||o&&("offset"==f||"parent"==f)||a&&("buffer"==f||"byteLength"==f||"byteOffset"==f)||Q(f,i))||r.push(f);return r}function _(t,e,n){(n===Mt||ft(t[e],n))&&(n!==Mt||e in t)||j(t,e,n)}function y(t,e,n){var r=t[e];be.call(t,e)&&ft(r,n)&&(n!==Mt||e in t)||j(t,e,n)}function p(t,e){for(var n=t.length;n--;)if(ft(t[n][0],e))return n;return-1}function j(t,e,n){"__proto__"==e&&xe?xe(t,e,{configurable:!0,enumerable:!0,value:n,writable:!0}):t[e]=n}function m(n,r,o,t,e,a){var i,u=1&r,c=2&r,f=4&r;if(o&&(i=e?o(n,t,e,a):o(n)),i!==Mt)return i;if(!bt(n))return n;if(t=hn(n)){if(i=function(t){var e=t.length,n=new t.constructor(e);return e&&"string"==typeof t[0]&&be.call(t,"index")&&(n.index=t.index,n.input=t.input),n}(n),!u)return U(n,i)}else{var s=nn(n),l="[object Function]"==s||"[object GeneratorFunction]"==s;if(vn(n))return M(n,u);if("[object Object]"==s||"[object Arguments]"==s||l&&!e){if(i=c||l?{}:Y(n),!u)return c?function(t,e){return P(t,en(t),e)}(n,function(t,e){return t&&P(e,St(e),t)}(i,n)):function(t,e){return P(t,tn(t),e)}(n,function(t,e){return t&&P(e,Lt(e),t)}(i,n))}else{if(!Kt[s])return e?n:{};i=function(t,e,n){var r=t.constructor;switch(e){case"[object ArrayBuffer]":return z(t);case"[object Boolean]":case"[object Date]":return new r(+t);case"[object DataView]":return e=n?z(t.buffer):t.buffer,new t.constructor(e,t.byteOffset,t.byteLength);case"[object Float32Array]":case"[object Float64Array]":case"[object Int8Array]":case"[object Int16Array]":case"[object Int32Array]":case"[object Uint8Array]":case"[object Uint8ClampedArray]":case"[object Uint16Array]":case"[object Uint32Array]":return C(t,n);case"[object Map]":return new r;case"[object Number]":case"[object String]":return new r(t);case"[object RegExp]":return(e=new t.constructor(t.source,Ht.exec(t))).lastIndex=t.lastIndex,e;case"[object Set]":return new r;case"[object Symbol]":return qe?Object(qe.call(t)):{}}}(n,s,u)}}if(e=(a=a||new g).get(n))return e;if(a.set(n,i),gn(n))return n.forEach(function(t){i.add(m(t,r,o,t,n,a))}),i;if(dn(n))return n.forEach(function(t,e){i.set(e,m(t,r,o,e,n,a))}),i;c=f?c?B:H:c?St:Lt;var p=t?Mt:c(n);return function(t,e){for(var n=-1,r=null==t?0:t.length;++n<r&&!1!==e(t[n],n,t););}(p||n,function(t,e){p&&(t=n[e=t]),y(i,e,m(t,r,o,e,n,a))}),i}function A(t,e){for(var n=0,r=(e=F(e,t)).length;null!=t&&n<r;)t=t[nt(e[n++])];return n&&n==r?t:Mt}function O(t,e,n){return e=e(t),hn(t)?e:f(e,n(t))}function w(t){if(null==t)t=t===Mt?"[object Undefined]":"[object Null]";else if(Te&&Te in Object(t)){var e=be.call(t,Te),n=t[Te];try{t[Te]=Mt;var r=!0}catch(t){}var o=ve.call(t);r&&(e?t[Te]=n:delete t[Te]),t=o}else t=ve.call(t);return t}function E(t,e){return null!=t&&be.call(t,e)}function L(t,e){return null!=t&&e in Object(t)}function S(t){return ht(t)&&"[object Arguments]"==w(t)}function T(t,e,n,r,o){if(t===e)e=!0;else if(null==t||null==e||!ht(t)&&!ht(e))e=t!=t&&e!=e;else t:{var a,i,u=hn(t),c=hn(e),f="[object Object]"==(a="[object Arguments]"==(a=u?"[object Array]":nn(t))?"[object Object]":a);c="[object Object]"==(i="[object Arguments]"==(i=c?"[object Array]":nn(e))?"[object Object]":i);if((i=a==i)&&vn(t)){if(!vn(e)){e=!1;break t}f=!(u=!0)}if(i&&!f)o=o||new g,e=u||_n(t)?V(t,e,n,r,T,o):function(t,e,n,r,o,a,i){switch(n){case"[object DataView]":if(t.byteLength!=e.byteLength||t.byteOffset!=e.byteOffset)break;t=t.buffer,e=e.buffer;case"[object ArrayBuffer]":if(t.byteLength!=e.byteLength||!a(new me(t),new me(e)))break;return!0;case"[object Boolean]":case"[object Date]":case"[object Number]":return ft(+t,+e);case"[object Error]":return t.name==e.name&&t.message==e.message;case"[object RegExp]":case"[object String]":return t==e+"";case"[object Map]":var u=h;case"[object Set]":if(u=u||v,t.size!=e.size&&!(1&r))break;return(n=i.get(t))?n==e:(r|=2,i.set(t,e),e=V(u(t),u(e),r,o,a,i),i.delete(t),e);case"[object Symbol]":if(qe)return qe.call(t)==qe.call(e)}return!1}(t,e,a,n,r,T,o);else{if(!(1&n)&&(u=f&&be.call(t,"__wrapped__"),a=c&&be.call(e,"__wrapped__"),u||a)){e=T(t=u?t.value():t,e=a?e.value():e,n,r,o=o||new g);break t}if(i)e:if(o=o||new g,u=1&n,a=H(t),c=a.length,i=H(e).length,c==i||u){for(f=c;f--;){var s=a[f];if(!(u?s in e:be.call(e,s))){e=!1;break e}}if((i=o.get(t))&&o.get(e))e=i==e;else{i=!0,o.set(t,e),o.set(e,t);for(var l=u;++f<c;){var p=t[s=a[f]],y=e[s];if(r)var b=u?r(y,p,s,e,t,o):r(p,y,s,t,e,o);if(b===Mt?p!==y&&!T(p,y,n,r,o):!b){i=!1;break}l=l||"constructor"==s}i&&!l&&((n=t.constructor)!=(r=e.constructor)&&"constructor"in t&&"constructor"in e&&!("function"==typeof n&&n instanceof n&&"function"==typeof r&&r instanceof r)&&(i=!1)),o.delete(t),o.delete(e),e=i}}else e=!1;else e=!1}}return e}function x(t){return"function"==typeof t?t:null==t?It:"object"==_typeof(t)?hn(t)?function(n,r){return X(n)&&r==r&&!bt(r)?tt(nt(n),r):function(t){var e=wt(t,n);return e===Mt&&e===r?Et(t,n):T(r,e,3)}}(t[0],t[1]):function(e){var n=function(t){for(var e=Lt(t),n=e.length;n--;){var r=e[n],o=t[r];e[n]=[r,o,o==o&&!bt(o)]}return e}(e);return 1==n.length&&n[0][2]?tt(n[0][0],n[0][1]):function(t){return t===e||function(t,e){var n=e.length,r=n;if(null==t)return!r;for(t=Object(t);n--;){if((o=e[n])[2]?o[1]!==t[o[0]]:!(o[0]in t))return!1}for(;++n<r;){var o,a=(o=e[n])[0],i=t[a],u=o[1];if(o[2]){if(i===Mt&&!(a in t))return!1}else if(o=new g,void 0!==Mt||!T(u,i,3,void 0,o))return!1}return!0}(t,n)}}(t):Nt(t)}function I(t){if(!Z(t))return Ne(t);var e,n=[];for(e in Object(t))be.call(t,e)&&"constructor"!=e&&n.push(e);return n}function k(s,l,p,y,b){s!==l&&Xe(l,function(t,e){if(bt(t)){var n=b=b||new g,r="__proto__"==e?Mt:s[e],o="__proto__"==e?Mt:l[e];if(f=n.get(o))_(s,e,f);else{var a=(f=y?y(r,o,e+"",s,l,n):Mt)===Mt;if(a){var i=hn(o),u=!i&&vn(o),c=!i&&!u&&_n(o),f=o;i||u||c?f=hn(r)?r:lt(r)?U(r):u?M(o,!(a=!1)):c?C(o,!(a=!1)):[]:vt(o)||bn(o)?bn(f=r)?f=At(r):(!bt(r)||p&&pt(r))&&(f=Y(o)):a=!1}a&&(n.set(o,f),k(f,o,p,y,n),n.delete(o)),_(s,e,f)}}else(n=y?y("__proto__"==e?Mt:s[e],t,e+"",s,l,b):Mt)===Mt&&(n=t),_(s,e,n)},St)}function N(t){if("string"==typeof t)return t;if(hn(t))return a(t,N)+"";if(gt(t))return Je?Je.call(t):"";var e=t+"";return"0"==e&&1/t==-zt?"-0":e}function D(t,e){var n;if((e=F(e,t)).length<2)n=t;else{var r=0,o=-1,a=-1,i=(n=e).length;for(r<0&&(r=i<-r?0:i+r),(o=i<o?i:o)<0&&(o+=i),i=o<r?0:o-r>>>0,r>>>=0,o=Array(i);++a<i;)o[a]=n[a+r];n=A(t,o)}null==(t=n)||delete t[nt(it(e))]}function F(t,e){return hn(t)?t:X(t,e)?[t]:ln(Ot(t))}function M(t,e){if(e)return t.slice();var n=t.length;n=Ae?Ae(n):new t.constructor(n);return t.copy(n),n}function z(t){var e=new t.constructor(t.byteLength);return new me(e).set(new me(t)),e}function C(t,e){return new t.constructor(e?z(t.buffer):t.buffer,t.byteOffset,t.length)}function U(t,e){var n=-1,r=t.length;for(e=e||Array(r);++n<r;)e[n]=t[n];return e}function P(t,e,n){var r=!n;n=n||{};for(var o=-1,a=e.length;++o<a;){var i=e[o],u=Mt;u===Mt&&(u=t[i]),r?j(n,i,u):y(n,i,u)}return n}function R(f){return function(t){return sn(et(t,void 0,It),t+"")}(function(t,e){var n,r=-1,o=e.length,a=1<o?e[o-1]:Mt,i=2<o?e[2]:Mt;a=3<f.length&&"function"==typeof a?(o--,a):Mt;if(n=i){n=e[0];var u=e[1];if(bt(i)){var c=_typeof(u);n=!!("number"==c?st(i)&&Q(u,i.length):"string"==c&&u in i)&&ft(i[u],n)}else n=!1}for(n&&(a=o<3?Mt:a,o=1),t=Object(t);++r<o;)(i=e[r])&&f(t,i,r,a);return t})}function $(t){return vt(t)?Mt:t}function V(t,e,n,r,o,a){var i=1&n,u=t.length;if(u!=(c=e.length)&&!(i&&u<c))return!1;if((c=a.get(t))&&a.get(e))return c==e;var c=-1,f=!0,s=2&n?new d:Mt;for(a.set(t,e),a.set(e,t);++c<u;){var l=t[c],p=e[c];if(r)var y=i?r(p,l,c,e,t,a):r(l,p,c,t,e,a);if(y!==Mt){if(y)continue;f=!1;break}if(s){if(!b(e,function(t,e){if(!s.has(e)&&(l===t||o(l,t,n,r,a)))return s.push(e)})){f=!1;break}}else if(l!==p&&!o(l,p,n,r,a)){f=!1;break}}return a.delete(t),a.delete(e),f}function H(t){return O(t,Lt,tn)}function B(t){return O(t,St,en)}function W(t,e){var n=(n=r.iteratee||kt)===kt?x:n;return arguments.length?n(t,e):n}function G(t,e){var n=t.__data__,r=_typeof(e);return("string"==r||"number"==r||"symbol"==r||"boolean"==r?"__proto__"!==e:null===e)?n["string"==typeof e?"string":"hash"]:n.map}function q(t,e){var n=null==t?Mt:t[e];return!bt(n)||he&&he in n||!(pt(n)?ge:Gt).test(rt(n))?Mt:n}function J(t,e,n){for(var r=-1,o=(e=F(e,t)).length,a=!1;++r<o;){var i=nt(e[r]);if(!(a=null!=t&&n(t,i)))break;t=t[i]}return a||++r!=o?a:!!(o=null==t?0:t.length)&&yt(o)&&Q(i,o)&&(hn(t)||bn(t))}function Y(t){return"function"!=typeof t.constructor||Z(t)?{}:Ye(Oe(t))}function K(t){return hn(t)||bn(t)||!!(Se&&t&&t[Se])}function Q(t,e){var n=_typeof(t);return!!(e=null==e?9007199254740991:e)&&("number"==n||"symbol"!=n&&Jt.test(t))&&-1<t&&0==t%1&&t<e}function X(t,e){if(hn(t))return!1;var n=_typeof(t);return!("number"!=n&&"symbol"!=n&&"boolean"!=n&&null!=t&&!gt(t))||Pt.test(t)||!Ut.test(t)||null!=e&&t in Object(e)}function Z(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||le)}function tt(e,n){return function(t){return null!=t&&t[e]===n&&(n!==Mt||e in Object(t))}}function et(o,a,i){return a=De(a===Mt?o.length-1:a,0),function(){for(var t=arguments,e=-1,n=De(t.length-a,0),r=Array(n);++e<n;)r[e]=t[a+e];for(e=-1,n=Array(a+1);++e<a;)n[e]=t[e];return n[a]=i(r),function(t,e,n){switch(n.length){case 0:return t.call(e);case 1:return t.call(e,n[0]);case 2:return t.call(e,n[0],n[1]);case 3:return t.call(e,n[0],n[1],n[2])}return t.apply(e,n)}(o,this,n)}}function nt(t){if("string"==typeof t||gt(t))return t;var e=t+"";return"0"==e&&1/t==-zt?"-0":e}function rt(t){if(null==t)return"";try{return ye.call(t)}catch(t){}return t+""}function ot(t,e,n){var r=null==t?0:t.length;return r?((n=null==n?0:jt(n))<0&&(n=De(r+n,0)),o(t,W(e,3),n)):-1}function at(t){return null!=t&&t.length?function t(e,n,r,o,a){var i=-1,u=e.length;for(r=r||K,a=a||[];++i<u;){var c=e[i];0<n&&r(c)?1<n?t(c,n-1,r,o,a):f(a,c):o||(a[a.length]=c)}return a}(t,1):[]}function it(t){var e=null==t?0:t.length;return e?t[e-1]:Mt}function ut(r,o){function a(){var t=arguments,e=o?o.apply(this,t):t[0],n=a.cache;return n.has(e)?n.get(e):(t=r.apply(this,t),a.cache=n.set(e,t)||n,t)}if("function"!=typeof r||null!=o&&"function"!=typeof o)throw new TypeError("Expected a function");return a.cache=new(ut.Cache||s),a}function ct(e){if("function"!=typeof e)throw new TypeError("Expected a function");return function(){var t=arguments;switch(t.length){case 0:return!e.call(this);case 1:return!e.call(this,t[0]);case 2:return!e.call(this,t[0],t[1]);case 3:return!e.call(this,t[0],t[1],t[2])}return!e.apply(this,t)}}function ft(t,e){return t===e||t!=t&&e!=e}function st(t){return null!=t&&yt(t.length)&&!pt(t)}function lt(t){return ht(t)&&st(t)}function pt(t){return!!bt(t)&&("[object Function]"==(t=w(t))||"[object GeneratorFunction]"==t||"[object AsyncFunction]"==t||"[object Proxy]"==t)}function yt(t){return"number"==typeof t&&-1<t&&0==t%1&&t<=9007199254740991}function bt(t){var e=_typeof(t);return null!=t&&("object"==e||"function"==e)}function ht(t){return null!=t&&"object"==_typeof(t)}function vt(t){return!(!ht(t)||"[object Object]"!=w(t))&&(null===(t=Oe(t))||"function"==typeof(t=be.call(t,"constructor")&&t.constructor)&&t instanceof t&&ye.call(t)==de)}function dt(t){return"string"==typeof t||!hn(t)&&ht(t)&&"[object String]"==w(t)}function gt(t){return"symbol"==_typeof(t)||ht(t)&&"[object Symbol]"==w(t)}function _t(t){return t?(t=mt(t))===zt||t===-zt?17976931348623157e292*(t<0?-1:1):t==t?t:0:0===t?t:0}function jt(t){var e=(t=_t(t))%1;return t==t?e?t-e:t:0}function mt(t){if("number"==typeof t)return t;if(gt(t))return Ct;if(bt(t)&&(t=bt(t="function"==typeof t.valueOf?t.valueOf():t)?t+"":t),"string"!=typeof t)return 0===t?t:+t;t=t.replace($t,"");var e=Wt.test(t);return e||qt.test(t)?Xt(t.slice(2),e?2:8):Bt.test(t)?Ct:+t}function At(t){return P(t,St(t))}function Ot(t){return null==t?"":N(t)}function wt(t,e,n){return(t=null==t?Mt:A(t,e))===Mt?n:t}function Et(t,e){return null!=t&&J(t,e,L)}function Lt(t){return st(t)?l(t):I(t)}function St(t){if(st(t))t=l(t,!0);else if(bt(t)){var e,n=Z(t),r=[];for(e in t)("constructor"!=e||!n&&be.call(t,e))&&r.push(e);t=r}else{if(e=[],null!=t)for(n in Object(t))e.push(n);t=e}return t}function Tt(t){return null==t?[]:function(e,t){return a(t,function(t){return e[t]})}(t,Lt(t))}function xt(t){return function(){return t}}function It(t){return t}function kt(t){return x("function"==typeof t?t:m(t,1))}function Nt(t){return X(t)?function(e){return function(t){return null==t?Mt:t[e]}}(nt(t)):function(e){return function(t){return A(t,e)}}(t)}function Dt(){return[]}function Ft(){return!1}var Mt,zt=1/0,Ct=NaN,Ut=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,Pt=/^\w*$/,Rt=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,$t=/^\s+|\s+$/g,Vt=/\\(\\)?/g,Ht=/\w*$/,Bt=/^[-+]0x[0-9a-f]+$/i,Wt=/^0b[01]+$/i,Gt=/^\[object .+?Constructor\]$/,qt=/^0o[0-7]+$/i,Jt=/^(?:0|[1-9]\d*)$/,Yt={};Yt["[object Float32Array]"]=Yt["[object Float64Array]"]=Yt["[object Int8Array]"]=Yt["[object Int16Array]"]=Yt["[object Int32Array]"]=Yt["[object Uint8Array]"]=Yt["[object Uint8ClampedArray]"]=Yt["[object Uint16Array]"]=Yt["[object Uint32Array]"]=!0,Yt["[object Arguments]"]=Yt["[object Array]"]=Yt["[object ArrayBuffer]"]=Yt["[object Boolean]"]=Yt["[object DataView]"]=Yt["[object Date]"]=Yt["[object Error]"]=Yt["[object Function]"]=Yt["[object Map]"]=Yt["[object Number]"]=Yt["[object Object]"]=Yt["[object RegExp]"]=Yt["[object Set]"]=Yt["[object String]"]=Yt["[object WeakMap]"]=!1;var Kt={};Kt["[object Arguments]"]=Kt["[object Array]"]=Kt["[object ArrayBuffer]"]=Kt["[object DataView]"]=Kt["[object Boolean]"]=Kt["[object Date]"]=Kt["[object Float32Array]"]=Kt["[object Float64Array]"]=Kt["[object Int8Array]"]=Kt["[object Int16Array]"]=Kt["[object Int32Array]"]=Kt["[object Map]"]=Kt["[object Number]"]=Kt["[object Object]"]=Kt["[object RegExp]"]=Kt["[object Set]"]=Kt["[object String]"]=Kt["[object Symbol]"]=Kt["[object Uint8Array]"]=Kt["[object Uint8ClampedArray]"]=Kt["[object Uint16Array]"]=Kt["[object Uint32Array]"]=!0,Kt["[object Error]"]=Kt["[object Function]"]=Kt["[object WeakMap]"]=!1;var Qt,Xt=parseInt,Zt="object"==_typeof(On)&&On&&On.Object===Object&&On,te="object"==("undefined"==typeof self?"undefined":_typeof(self))&&self&&self.Object===Object&&self,ee=Zt||te||Function("return this")(),ne="object"==_typeof(En)&&En&&!En.nodeType&&En,re=ne&&"object"==_typeof(wn)&&wn&&!wn.nodeType&&wn,oe=re&&re.exports===ne,ae=oe&&Zt.process;t:{try{Qt=ae&&ae.binding&&ae.binding("util");break t}catch(t){}Qt=void 0}var ie,ue=Qt&&Qt.isMap,ce=Qt&&Qt.isSet,fe=Qt&&Qt.isTypedArray,se=Array.prototype,le=Object.prototype,pe=ee["__core-js_shared__"],ye=Function.prototype.toString,be=le.hasOwnProperty,he=(ie=/[^.]+$/.exec(pe&&pe.keys&&pe.keys.IE_PROTO||""))?"Symbol(src)_1."+ie:"",ve=le.toString,de=ye.call(Object),ge=RegExp("^"+ye.call(be).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),_e=oe?ee.Buffer:Mt,je=ee.Symbol,me=ee.Uint8Array,Ae=_e?_e.a:Mt,Oe=e(Object.getPrototypeOf),we=Object.create,Ee=le.propertyIsEnumerable,Le=se.splice,Se=je?je.isConcatSpreadable:Mt,Te=je?je.toStringTag:Mt,xe=function(){try{var t=q(Object,"defineProperty");return t({},"",{}),t}catch(t){}}(),Ie=Object.getOwnPropertySymbols,ke=_e?_e.isBuffer:Mt,Ne=e(Object.keys),De=Math.max,Fe=Date.now,Me=q(ee,"DataView"),ze=q(ee,"Map"),Ce=q(ee,"Promise"),Ue=q(ee,"Set"),Pe=q(ee,"WeakMap"),Re=q(Object,"create"),$e=rt(Me),Ve=rt(ze),He=rt(Ce),Be=rt(Ue),We=rt(Pe),Ge=je?je.prototype:Mt,qe=Ge?Ge.valueOf:Mt,Je=Ge?Ge.toString:Mt,Ye=function(t){return bt(t)?we?we(t):(Ke.prototype=t,t=new Ke,Ke.prototype=Mt,t):{}};function Ke(){}u.prototype.clear=function(){this.__data__=Re?Re(null):{},this.size=0},u.prototype.delete=function(t){return t=this.has(t)&&delete this.__data__[t],this.size-=t?1:0,t},u.prototype.get=function(t){var e=this.__data__;return Re?"__lodash_hash_undefined__"===(t=e[t])?Mt:t:be.call(e,t)?e[t]:Mt},u.prototype.has=function(t){var e=this.__data__;return Re?e[t]!==Mt:be.call(e,t)},u.prototype.set=function(t,e){var n=this.__data__;return this.size+=this.has(t)?0:1,n[t]=Re&&e===Mt?"__lodash_hash_undefined__":e,this},c.prototype.clear=function(){this.__data__=[],this.size=0},c.prototype.delete=function(t){var e=this.__data__;return!((t=p(e,t))<0||(t==e.length-1?e.pop():Le.call(e,t,1),--this.size,0))},c.prototype.get=function(t){var e=this.__data__;return(t=p(e,t))<0?Mt:e[t][1]},c.prototype.has=function(t){return-1<p(this.__data__,t)},c.prototype.set=function(t,e){var n=this.__data__,r=p(n,t);return r<0?(++this.size,n.push([t,e])):n[r][1]=e,this},s.prototype.clear=function(){this.size=0,this.__data__={hash:new u,map:new(ze||c),string:new u}},s.prototype.delete=function(t){return t=G(this,t).delete(t),this.size-=t?1:0,t},s.prototype.get=function(t){return G(this,t).get(t)},s.prototype.has=function(t){return G(this,t).has(t)},s.prototype.set=function(t,e){var n=G(this,t),r=n.size;return n.set(t,e),this.size+=n.size==r?0:1,this},d.prototype.add=d.prototype.push=function(t){return this.__data__.set(t,"__lodash_hash_undefined__"),this},d.prototype.has=function(t){return this.__data__.has(t)},g.prototype.clear=function(){this.__data__=new c,this.size=0},g.prototype.delete=function(t){var e=this.__data__;return t=e.delete(t),this.size=e.size,t},g.prototype.get=function(t){return this.__data__.get(t)},g.prototype.has=function(t){return this.__data__.has(t)},g.prototype.set=function(t,e){var n=this.__data__;if(n instanceof c){var r=n.__data__;if(!ze||r.length<199)return r.push([t,e]),this.size=++n.size,this;n=this.__data__=new s(r)}return n.set(t,e),this.size=n.size,this};var Qe=function(t,e){if(null==t)return t;if(!st(t))return function(t,e){return t&&Xe(t,e,Lt)}(t,e);for(var n=t.length,r=-1,o=Object(t);++r<n&&!1!==e(o[r],r,o););return t},Xe=function(t,e,n){for(var r=-1,o=Object(t),a=(n=n(t)).length;a--;){var i=n[++r];if(!1===e(o[i],i,o))break}return t},Ze=xe?function(t,e){return xe(t,"toString",{configurable:!0,enumerable:!1,value:xt(e),writable:!0})}:It,tn=Ie?function(e){return null==e?[]:(e=Object(e),n(Ie(e),function(t){return Ee.call(e,t)}))}:Dt,en=Ie?function(t){for(var e=[];t;)f(e,tn(t)),t=Oe(t);return e}:Dt,nn=w;(Me&&"[object DataView]"!=nn(new Me(new ArrayBuffer(1)))||ze&&"[object Map]"!=nn(new ze)||Ce&&"[object Promise]"!=nn(Ce.resolve())||Ue&&"[object Set]"!=nn(new Ue)||Pe&&"[object WeakMap]"!=nn(new Pe))&&(nn=function(t){var e=w(t);if(t=(t="[object Object]"==e?t.constructor:Mt)?rt(t):"")switch(t){case $e:return"[object DataView]";case Ve:return"[object Map]";case He:return"[object Promise]";case Be:return"[object Set]";case We:return"[object WeakMap]"}return e});var rn,on,an,un,cn,fn,sn=(un=Ze,fn=cn=0,function(){var t=Fe(),e=16-(t-fn);if(fn=t,0<e){if(800<=++cn)return arguments[0]}else cn=0;return un.apply(Mt,arguments)}),ln=(an=(on=ut(on=function(t){var o=[];return 46===t.charCodeAt(0)&&o.push(""),t.replace(Rt,function(t,e,n,r){o.push(n?r.replace(Vt,"$1"):e||t)}),o},function(t){return 500===an.size&&an.clear(),t})).cache,on),pn=(rn=ot,function(t,e,n){var r=Object(t);if(!st(t)){var o=W(e,3);t=Lt(t),e=function(t){return o(r[t],t,r)}}return-1<(e=rn(t,e,n))?r[o?t[e]:e]:Mt});ut.Cache=s;var yn,bn=S(function(){return arguments}())?S:function(t){return ht(t)&&be.call(t,"callee")&&!Ee.call(t,"callee")},hn=Array.isArray,vn=ke||Ft,dn=ue?t(ue):function(t){return ht(t)&&"[object Map]"==nn(t)},gn=ce?t(ce):function(t){return ht(t)&&"[object Set]"==nn(t)},_n=fe?t(fe):function(t){return ht(t)&&yt(t.length)&&!!Yt[w(t)]},jn=R(function(t,e,n){k(t,e,n)}),mn=R(function(t,e,n,r){k(t,e,n,r)}),An=sn(et(yn=function(e,t){var n={};if(null==e)return n;var r=!1;t=a(t,function(t){return t=F(t,e),r=r||1<t.length,t}),P(e,B(e),n),r&&(n=m(n,7,$));for(var o=t.length;o--;)D(n,t[o]);return n},Mt,at),yn+"");r.constant=xt,r.flatten=at,r.iteratee=kt,r.keys=Lt,r.keysIn=St,r.memoize=ut,r.merge=jn,r.mergeWith=mn,r.negate=ct,r.omit=An,r.property=Nt,r.reject=function(t,e){return(hn(t)?n:function(t,r){var o=[];return Qe(t,function(t,e,n){r(t,e,n)&&o.push(t)}),o})(t,ct(W(e,3)))},r.toPlainObject=At,r.values=Tt,r.cloneDeep=function(t){return m(t,5)},r.cloneDeepWith=function(t,e){return m(t,5,e="function"==typeof e?e:Mt)},r.eq=ft,r.find=pn,r.findIndex=ot,r.get=wt,r.has=function(t,e){return null!=t&&J(t,e,E)},r.hasIn=Et,r.identity=It,r.includes=function(t,e,n,r){if(t=st(t)?t:Tt(t),n=n&&!r?jt(n):0,r=t.length,n<0&&(n=De(r+n,0)),dt(t))t=n<=r&&-1<t.indexOf(e,n);else{if(r=!!r){if(e==e)t:{for(n-=1,r=t.length;++n<r;)if(t[n]===e){t=n;break t}t=-1}else t=o(t,i,n);r=-1<t}t=r}return t},r.isArguments=bn,r.isArray=hn,r.isArrayLike=st,r.isArrayLikeObject=lt,r.isBuffer=vn,r.isEmpty=function(t){if(null==t)return!0;if(st(t)&&(hn(t)||"string"==typeof t||"function"==typeof t.splice||vn(t)||_n(t)||bn(t)))return!t.length;var e=nn(t);if("[object Map]"==e||"[object Set]"==e)return!t.size;if(Z(t))return!I(t).length;for(var n in t)if(be.call(t,n))return!1;return!0},r.isEqual=function(t,e){return T(t,e)},r.isFunction=pt,r.isLength=yt,r.isMap=dn,r.isNull=function(t){return null===t},r.isObject=bt,r.isObjectLike=ht,r.isPlainObject=vt,r.isSet=gn,r.isString=dt,r.isSymbol=gt,r.isTypedArray=_n,r.last=it,r.stubArray=Dt,r.stubFalse=Ft,r.toFinite=_t,r.toInteger=jt,r.toNumber=mt,r.toString=Ot,r.VERSION="4.17.5",re&&((re.exports=r)._=r,ne._=r)}).call(this)}).call(this,"undefined"!=typeof __webpack_require__.g?__webpack_require__.g:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],2:[function(t,e,n){e.exports={itemType:{DATA:"data",FCTN:"fctn",EVENT:"event",LISTENER_ON:"listenerOn",LISTENER_OFF:"listenerOff"},dataLayerEvent:{CHANGE:"adobeDataLayer:change",EVENT:"adobeDataLayer:event"},listenerScope:{PAST:"past",FUTURE:"future",ALL:"all"}}},{}],3:[function(t,e,n){var r=t("../custom-lodash"),c=t("../version.json").version,l=r.cloneDeep,p=r.get,y=t("./item"),b=t("./listener"),h=t("./listenerManager"),v=t("./constants"),d=t("./utils/customMerge");e.exports=function(t){var f,e=t||{},n=[],r=[],o={},a={getState:function(){return o},getDataLayer:function(){return n}};function i(t){o=d(o,t.data)}function u(t){t.valid?{data:function(t){i(t),f.triggerListeners(t)},fctn:function(t){t.config.call(n,n)},event:function(t){t.data&&i(t),f.triggerListeners(t)},listenerOn:function(t){var e=b(t);switch(e.scope){case v.listenerScope.PAST:var n,r=_createForOfIteratorHelper(c(t));try{for(r.s();!(n=r.n()).done;){var o=n.value;f.triggerListener(e,o)}}catch(t){r.e(t)}finally{r.f()}break;case v.listenerScope.FUTURE:f.register(e);break;case v.listenerScope.ALL:if(f.register(e)){var a,i=_createForOfIteratorHelper(c(t));try{for(i.s();!(a=i.n()).done;){var u=a.value;f.triggerListener(e,u)}}catch(t){i.e(t)}finally{i.f()}}}},listenerOff:function(t){f.unregister(b(t))}}[t.type](t):s(t);function c(t){return 0===n.length||t.index>n.length-1?[]:n.slice(0,t.index).map(function(t){return y(t)})}}function s(t){var e="The following item cannot be handled by the data layer because it does not have a valid format: "+JSON.stringify(t.config);console.error(e)}return function(){Array.isArray(e.dataLayer)||(e.dataLayer=[]);r=e.dataLayer.splice(0,e.dataLayer.length),(n=e.dataLayer).version=c,o={},f=h(a)}(),n.push=function(t){var n=arguments,r=arguments;if(Object.keys(n).forEach(function(t){var e=y(n[t]);switch(e.valid||(s(e),delete r[t]),e.type){case v.itemType.DATA:case v.itemType.EVENT:u(e);break;case v.itemType.FCTN:delete r[t],u(e);break;case v.itemType.LISTENER_ON:case v.itemType.LISTENER_OFF:delete r[t]}}),r[0])return Array.prototype.push.apply(this,r)},n.getState=function(t){return t?p(l(o),t):l(o)},n.addEventListener=function(t,e,n){u(y({on:t,handler:e,scope:n&&n.scope,path:n&&n.path}))},n.removeEventListener=function(t,e){u(y({off:t,handler:e}))},function(){for(var t=0;t<r.length;t++)n.push(r[t])}(),a}},{"../custom-lodash":1,"../version.json":14,"./constants":2,"./item":5,"./listener":7,"./listenerManager":8,"./utils/customMerge":10}],4:[function(t,e,n){var r={Manager:t("./dataLayerManager")};window.adobeDataLayer=window.adobeDataLayer||[],window.adobeDataLayer.version?console.warn("Adobe Client Data Layer v".concat(window.adobeDataLayer.version," has already been imported/initialized on this page. You may be erroneously loading it a second time.")):r.Manager({dataLayer:window.adobeDataLayer}),e.exports=r},{"./dataLayerManager":3}],5:[function(t,e,n){var r=t("../custom-lodash"),i=r.isPlainObject,u=r.isEmpty,c=r.omit,f=r.find,s=t("./utils/dataMatchesContraints"),l=t("./itemConstraints"),p=t("./constants");e.exports=function(t,e){var n=t,r=e,o=f(Object.keys(l),function(t){return s(n,l[t])})||"function"==typeof n&&p.itemType.FCTN||i(n)&&p.itemType.DATA,a=function(){var t=c(n,Object.keys(l.event));if(!u(t))return t}();return{config:n,type:o,data:a,valid:!!o,index:r}}},{"../custom-lodash":1,"./constants":2,"./itemConstraints":6,"./utils/dataMatchesContraints":11}],6:[function(t,e,n){e.exports={event:{event:{type:"string"},eventInfo:{optional:!0}},listenerOn:{on:{type:"string"},handler:{type:"function"},scope:{type:"string",values:["past","future","all"],optional:!0},path:{type:"string",optional:!0}},listenerOff:{off:{type:"string"},handler:{type:"function",optional:!0},scope:{type:"string",values:["past","future","all"],optional:!0},path:{type:"string",optional:!0}}}},{}],7:[function(t,e,n){var r=t("./constants");e.exports=function(t){return{event:t.config.on||t.config.off,handler:t.config.handler||null,scope:t.config.scope||t.config.on&&r.listenerScope.ALL||null,path:t.config.path||null}}},{"./constants":2}],8:[function(t,e,n){var u=t("../custom-lodash").cloneDeep,c=t("./constants"),f=t("./utils/listenerMatch"),s=t("./utils/indexOfListener");e.exports=function(t){var o={},r=t,a=s.bind(null,o);function i(t,e){if(f(t,e)){var n=[u(e.config)];t.handler.apply(r.getDataLayer(),n)}}return{register:function(t){var e=t.event;return Object.prototype.hasOwnProperty.call(o,e)?-1===a(t)&&(o[t.event].push(t),!0):(o[t.event]=[t],!0)},unregister:function(t){var e=t.event;if(Object.prototype.hasOwnProperty.call(o,e))if(t.handler||t.scope||t.path){var n=a(t);-1<n&&o[e].splice(n,1)}else o[e]=[]},triggerListeners:function(r){(function(t){var e=[];switch(t.type){case c.itemType.DATA:e.push(c.dataLayerEvent.CHANGE);break;case c.itemType.EVENT:e.push(c.dataLayerEvent.EVENT),t.data&&e.push(c.dataLayerEvent.CHANGE),t.config.event!==c.dataLayerEvent.CHANGE&&e.push(t.config.event)}return e})(r).forEach(function(t){if(Object.prototype.hasOwnProperty.call(o,t)){var e,n=_createForOfIteratorHelper(o[t]);try{for(n.s();!(e=n.n()).done;){i(e.value,r)}}catch(t){n.e(t)}finally{n.f()}}})},triggerListener:function(t,e){i(t,e)}}}},{"../custom-lodash":1,"./constants":2,"./utils/indexOfListener":12,"./utils/listenerMatch":13}],9:[function(t,e,n){var r=t("../../custom-lodash"),o=r.has,a=r.get;e.exports=function(t,e){for(var n=e.substring(0,e.lastIndexOf("."));n;){if(o(t,n)){var r=a(t,n);if(null==r)return!0}n=n.substring(0,n.lastIndexOf("."))}return!1}},{"../../custom-lodash":1}],10:[function(t,e,n){var r=t("../../custom-lodash"),s=r.cloneDeepWith,l=r.isObject,p=r.isArray,y=r.reject,o=r.mergeWith,a=r.isNull;e.exports=function(t,e){return o(t,e,function(t,e,n,r){if(null==e)return null}),t=function(t,e){return s(t,function(f){return function e(t,n,r,o){if(l(t)){if(p(t))return y(t,f).map(function(t){return s(t,e)});for(var a={},i=0,u=Object.keys(t);i<u.length;i++){var c=u[i];f(t[c])||(a[c]=s(t[c],e))}return a}}}(1<arguments.length&&void 0!==e?e:function(t){return!t}))}(t,a)}},{"../../custom-lodash":1}],11:[function(t,e,n){var r=t("../../custom-lodash"),o=r.find,s=r.includes;e.exports=function(c,f){return void 0===o(Object.keys(f),function(t){var e=f[t].type,n=t&&f[t].values,r=!f[t].optional,o=c[t],a=_typeof(o),i=e&&a!==e,u=n&&!s(n,o);return r?!o||i||u:o&&(i||u)})}},{"../../custom-lodash":1}],12:[function(t,e,n){var c=t("../../custom-lodash").isEqual;e.exports=function(t,e){var n=e.event;if(Object.prototype.hasOwnProperty.call(t,n)){var r,o=_createForOfIteratorHelper(t[n].entries());try{for(o.s();!(r=o.n()).done;){var a=_slicedToArray(r.value,2),i=a[0],u=a[1];if(c(u.handler,e.handler))return i}}catch(t){o.e(t)}finally{o.f()}}return-1}},{"../../custom-lodash":1}],13:[function(t,e,n){var r=t("../../custom-lodash").has,a=t("../constants"),o=t("./ancestorRemoved");function i(t,e){return!e.data||!t.path||(r(e.data,t.path)||o(e.data,t.path))}e.exports=function(t,e){var n=t.event,r=e.config,o=!1;return e.type===a.itemType.DATA?n===a.dataLayerEvent.CHANGE&&(o=i(t,e)):e.type===a.itemType.EVENT&&(n!==a.dataLayerEvent.EVENT&&n!==r.event||(o=i(t,e)),e.data&&n===a.dataLayerEvent.CHANGE&&(o=i(t,e))),o}},{"../../custom-lodash":1,"../constants":2,"./ancestorRemoved":9}],14:[function(t,e,n){e.exports={version:"2.0.2"}},{}]},{},[4]);
//# sourceMappingURL=adobe-client-data-layer.min.js.map


/***/ }),

/***/ 633:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _typeof = (__webpack_require__(738)["default"]);
function _regeneratorRuntime() {
  "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
  module.exports = _regeneratorRuntime = function _regeneratorRuntime() {
    return exports;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  var exports = {},
    Op = Object.prototype,
    hasOwn = Op.hasOwnProperty,
    defineProperty = Object.defineProperty || function (obj, key, desc) {
      obj[key] = desc.value;
    },
    $Symbol = "function" == typeof Symbol ? Symbol : {},
    iteratorSymbol = $Symbol.iterator || "@@iterator",
    asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
    toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }
  try {
    define({}, "");
  } catch (err) {
    define = function define(obj, key, value) {
      return obj[key] = value;
    };
  }
  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
      generator = Object.create(protoGenerator.prototype),
      context = new Context(tryLocsList || []);
    return defineProperty(generator, "_invoke", {
      value: makeInvokeMethod(innerFn, self, context)
    }), generator;
  }
  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }
  exports.wrap = wrap;
  var ContinueSentinel = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
    NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }
  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if ("throw" !== record.type) {
        var result = record.arg,
          value = result.value;
        return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }
      reject(record.arg);
    }
    var previousPromise;
    defineProperty(this, "_invoke", {
      value: function value(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }
        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(innerFn, self, context) {
    var state = "suspendedStart";
    return function (method, arg) {
      if ("executing" === state) throw new Error("Generator is already running");
      if ("completed" === state) {
        if ("throw" === method) throw arg;
        return doneResult();
      }
      for (context.method = method, context.arg = arg;;) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }
        if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
          if ("suspendedStart" === state) throw state = "completed", context.arg;
          context.dispatchException(context.arg);
        } else "return" === context.method && context.abrupt("return", context.arg);
        state = "executing";
        var record = tryCatch(innerFn, self, context);
        if ("normal" === record.type) {
          if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
          return {
            value: record.arg,
            done: context.done
          };
        }
        "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
      }
    };
  }
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method,
      method = delegate.iterator[methodName];
    if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }
  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }
  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }
  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;
      if (!isNaN(iterable.length)) {
        var i = -1,
          next = function next() {
            for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
            return next.value = undefined, next.done = !0, next;
          };
        return next.next = next;
      }
    }
    return {
      next: doneResult
    };
  }
  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), defineProperty(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (val) {
    var object = Object(val),
      keys = [];
    for (var key in object) keys.push(key);
    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function reset(skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
    },
    stop: function stop() {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function dispatchException(exception) {
      if (this.done) throw exception;
      var context = this;
      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
          record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");
        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
            hasFinally = hasOwn.call(entry, "finallyLoc");
          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }
      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function complete(record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
}
module.exports = _regeneratorRuntime, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 738:
/***/ ((module) => {

function _typeof(obj) {
  "@babel/helpers - typeof";

  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(obj);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 756:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// TODO(Babel 8): Remove this file.

var runtime = __webpack_require__(633)();
module.exports = runtime;

// Copied from https://github.com/facebook/regenerator/blob/main/packages/runtime/runtime.js#L736=
try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";

;// ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
;// ./node_modules/@babel/runtime/helpers/esm/typeof.js
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}
;// ./node_modules/@babel/runtime/helpers/esm/toPrimitive.js

function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
;// ./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js


function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
;// ./node_modules/@babel/runtime/helpers/esm/createClass.js

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
;// ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
;// ./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
;// ./node_modules/@babel/runtime/helpers/esm/iterableToArray.js
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
;// ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
;// ./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
;// ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js




function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
// EXTERNAL MODULE: ./node_modules/@adobe/adobe-client-data-layer/dist/adobe-client-data-layer.min.js
var adobe_client_data_layer_min = __webpack_require__(196);
;// ./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
;// ./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
;// ./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
;// ./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js
function _iterableToArrayLimit(arr, i) {
  var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
  if (null != _i) {
    var _s,
      _e,
      _x,
      _r,
      _arr = [],
      _n = !0,
      _d = !1;
    try {
      if (_x = (_i = _i.call(arr)).next, 0 === i) {
        if (Object(_i) !== _i) return;
        _n = !1;
      } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
    } catch (err) {
      _d = !0, _e = err;
    } finally {
      try {
        if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return;
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
}
;// ./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
;// ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js




function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
;// ./node_modules/@babel/runtime/helpers/esm/defineProperty.js

function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
;// ./src/config/eventNames.json
const eventNames_namespaceObject = /*#__PURE__*/JSON.parse('{"screenLoad":"screen_load","cartStep":{"account":"cart_step_account","products":"cart_step_products","billing":"cart_step_billing","confirm":"cart_step_confirm","restartBilling":"restart_step_billing","restartProducts":"restart_step_products","changeProducts":"change_step_products","changeBilling":"change_step_billing"},"form":{"complete":"form_complete","error":"form_error","interaction":"form_field_interaction","start":"form_start"},"order":{"create":"sub_create","change":"sub_change","upgrade":"sub_upgrade","downgrade":"sub_downgrade","restart":"sub_restart"},"userLogin":"user_login","userLogout":"user_logout","userRegister":"user_register","cancelTenure":"cancel_tenure","uiInteraction":"ui_click","modal":{"modalOpen":"modal_open","modalClose":"modal_close"},"search":{"begin":"search","complete":"search_complete"},"cartSelection":{"add":"cart_add","remove":"cart_remove"},"pause":{"start":"pause_start","end":"sub_pause"}}');
;// ./src/config/validSteps.json
const validSteps_namespaceObject = /*#__PURE__*/JSON.parse('{"cancelStart":"cancel_start","cancelUpdate":"cancel_step_update","cancelReason":"cancel_step_reason","cancelRebuttal":"cancel_step_upsell","cancelComplete":"cancel_complete"}');
;// ./src/config/stepPageTypeOverrides.json
const stepPageTypeOverrides_namespaceObject = /*#__PURE__*/JSON.parse('{"cancelStart":"cancel","cancelUpdate":"cancel","cancelReason":"cancel","cancelRebuttal":"cancel","cancelComplete":"cancel"}');
;// ./package.json
const package_namespaceObject = /*#__PURE__*/JSON.parse('{"name":"@sling/analytics-js","version":"7.0.38","description":"Sling analytics engine for JavaScript","main":"lib/index.js","author":"Stephen Roberts <stephen.roberts@dish.com>, Yusef Marra <yusef.marra@dish.com>","license":"MIT","devDependencies":{"@adobe/adobe-client-data-layer":"^2.0.2","@babel/cli":"^7.0.0","@babel/core":"^7.26.0","@babel/plugin-proposal-class-properties":"^7.0.0","@babel/plugin-proposal-decorators":"^7.0.0","@babel/plugin-proposal-do-expressions":"^7.0.0","@babel/plugin-proposal-export-default-from":"^7.0.0","@babel/plugin-proposal-export-namespace-from":"^7.0.0","@babel/plugin-proposal-function-bind":"^7.0.0","@babel/plugin-proposal-function-sent":"^7.0.0","@babel/plugin-proposal-json-strings":"^7.0.0","@babel/plugin-proposal-logical-assignment-operators":"^7.0.0","@babel/plugin-proposal-nullish-coalescing-operator":"^7.0.0","@babel/plugin-proposal-numeric-separator":"^7.0.0","@babel/plugin-proposal-optional-chaining":"^7.0.0","@babel/plugin-proposal-pipeline-operator":"^7.0.0","@babel/plugin-proposal-throw-expressions":"^7.0.0","@babel/plugin-syntax-dynamic-import":"^7.0.0","@babel/plugin-syntax-import-meta":"^7.0.0","@babel/plugin-transform-runtime":"^7.13.15","@babel/preset-env":"^7.26.0","@semantic-release/changelog":"4.0.0","@semantic-release/gitlab":"3.1.2","@testing-library/jest-dom":"^5.1.1","babel-core":"^7.0.0-bridge.0","babel-jest":"^23.4.2","babel-loader":"^9.2.1","eslint":"^7.5.0","eslint-config-airbnb":"^15.1.0","eslint-plugin-import":"^2.2.0","http-server":"^0.11.1","jest":"^23.6.0","jsdoc":"^3.6.3","jsdom":"16.7.0","npm-publish-git-tag":"^3.0.3","pre-commit":"^1.2.2","pre-push":"^0.1.1","semantic-release":"15.13.3","watch":"^1.0.2","webpack":"^5.96.1","webpack-cli":"^5.1.4"},"scripts":{"build":"babel src -d lib --copy-files","build:watch":"babel src --watch --out-dir lib","doc:build":"jsdoc -c .jsdoc.json -r src/AnalyticsADL.js ./README.md","doc:build:watch":"watch \'yarn doc:build\' src","lint":"eslint --ext .js src","lint:fix":"eslint --ext .js --fix src test","test":"jest","test:coverage":"jest --coverage","test:watch":"jest --watch","dev:build":"babel src -d lib && if [ -d lib/resources ]; then rm -rf lib/resources; fi && cp -R src/resources lib/resources && webpack","dev:deploy":"http-server ./dist","start":"http-server -o ./docs"},"pre-commit":["lint","test"],"pre-push":["lint","test"],"jest":{"coveragePathIgnorePatterns":["/src/Providers/google/loadGA","/src/Providers/google/loadGTM"],"testRegex":"(src|test)/.*\\\\.(spec|test)\\\\.(js|jsx)$","testEnvironment":"jsdom"},"peerDependencies":{"@adobe/adobe-client-data-layer":"^2.0.2"},"repository":{"type":"git","url":"https://gitlab.com/dish-cloud/sling/sling-it/customer-portal/analytics-js.git"},"release":{"plugins":["@semantic-release/commit-analyzer","@semantic-release/release-notes-generator","@semantic-release/changelog",["@semantic-release/gitlab",{"gitlabUrl":"https://gitlab.com/dish-cloud/sling/sling-it/customer-portal/analytics-js.git"}]]},"engines":{"node":">= 12"},"packageManager":"yarn@3.4.1","dependencies":{"@sling/fetch":"^2.3.0"}}');
;// ./src/config/queryParameters.json
const queryParameters_namespaceObject = /*#__PURE__*/JSON.parse('{"media":["utm_medium","utm_source","utm_campaign","utm_content","utm_site","utm_term","matchtype"],"convertro":["cvosrc","cvo_crid","cvo_cid","cvo_pid","cvo_keyword","cvo_creative"],"referral":["bp_e"],"affiliate":["affiliate"],"partner":["partner"],"easy_code":["easy_code"],"easy_device":["easy_device"]}');
;// ./src/AnalyticsADL.js






var _excluded = ["localsComponentZip"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }





var SIMPLE_TYPES = ['text', 'hidden', 'radio', 'number', 'textarea', 'radio'];
function analyticsWarn(msg) {
  // eslint-disable-next-line no-console
  console.warn("[Analytics Warning] ".concat(msg));
}
function analyticsError(msg) {
  // eslint-disable-next-line no-console
  console.error(new Error("[Analytics Error] ".concat(msg)));
}

/**
 * TODO Major TODOs (not listed below, though not exhaustive).
 *   - Handle persistent data
 *      - When to load it? Analytics init?
 *      - When to save it? On every call in a DL handler?
 *      - Refs: EventLog.loadPersistentData(), EventLog.savePersistentData().
 *   - Verify if the cookies for user info are needed, see EventLog.writeOldCookies().
 */
var AnalyticsADL = /*#__PURE__*/function () {
  /**
   * THIS SHOULD NEVER BE DIRECTLY CALLED OUTSIDE ANALYTICS-JS!
   *
   * @param {string} appName - The name of the application using analytics-js
   *                           (passed to debug report)
   *
   * @param {any[]} dataLayer - The data layer instance to use.
   *
   * @returns {AnalyticsADL}
   *
   * @example
   * const analytics = new Analytics('the app');
   */
  function AnalyticsADL(appName, dataLayer) {
    _classCallCheck(this, AnalyticsADL);
    this.screenLoadFired = false;
    this.formStartFired = {};
    this.appName = appName;
    this.dataLayer = dataLayer;
    var debugACDL = localStorage.getItem('debugACDL');
    if (debugACDL === 'true') {
      this.dataLayer.addEventListener('adobeDataLayer:change',
      // eslint-disable-next-line prefer-arrow-callback
      function printACDLDebug(dl) {
        // eslint-disable-next-line no-console
        console.log(JSON.stringify(dl, null, '  '));
      });
    }
  }

  /**
   * Update debug info into the data layer. This should only be called once per page load.
   * Calling this multiple times may add records to the data layer, but has no impact on the
   * effective data layer.
   *
   * @example
   * analytics.updateDebugData();
   */
  return _createClass(AnalyticsADL, [{
    key: "updateDebugData",
    value: function updateDebugData() {
      var data = {
        web: {
          webPageDetails: {
            platform: 'web',
            // TODO what should this be?
            _sling: {
              appName: this.appName,
              analyticsVersion: package_namespaceObject.version
            }
          }
        }
      };
      this.dataLayer.push(data);
    }

    /**
     * @typedef {Object} AnalyticsPageInfo
     * @type {Object}
     * @property {?string} name - the page name.
     *    Defaults to `window.location.pathname`.
     * @property {?string} lineOfBusiness - the line of business for this page.
     * @property {?string} classification - the classification for this page,
     *    Defaults to local storage value 'cart_classification.
     * @property {?string} type - the screen type (TODO check is this should be in page data).
     * @property {?string|?boolean} lang - the language for this page.
     *    Defaults to the "language" part of the html-element's lang attribute.
     * @property {?string} domain - the channel for the page.
     *    Defaults to the page hostname's first segment of the hostname (the part before first ".")
     */

    /**
     * Update page info into the data layer. This should only be called once per page load.
     *
     * @param {AnalyticsPageInfo} pageInfo - the page params
     *
     * @example
     * analytics.updatePageData({
     *   lob: 'domestic',
     *   classification: 'us'
     * });
     */
  }, {
    key: "updatePageData",
    value: function updatePageData(_ref) {
      var _document$documentEle, _document$documentEle2, _document$documentEle3;
      var _ref$name = _ref.name,
        name = _ref$name === void 0 ? window.location.pathname === '/' ? 'home' : window.location.pathname : _ref$name,
        lineOfBusiness = _ref.lineOfBusiness,
        classification = _ref.classification,
        _ref$type = _ref.type,
        type = _ref$type === void 0 ? 'generic' : _ref$type,
        _ref$lang = _ref.lang,
        lang = _ref$lang === void 0 ? (_document$documentEle = (_document$documentEle2 = document.documentElement) === null || _document$documentEle2 === void 0 ? void 0 : (_document$documentEle3 = _document$documentEle2.lang) === null || _document$documentEle3 === void 0 ? void 0 : _document$documentEle3.substr(0, 2)) !== null && _document$documentEle !== void 0 ? _document$documentEle : false : _ref$lang,
        _ref$domain = _ref.domain,
        domain = _ref$domain === void 0 ? window.location.hostname : _ref$domain;
      var qsp = window.location.search.slice(1);
      var pageTitle = document.title;
      var pageErrorName;
      if (pageTitle === '404') {
        pageErrorName = pageTitle;
      }
      var data = {
        web: {
          webPageDetails: {
            name: name,
            type: type,
            qsp: qsp,
            language: lang,
            siteSection: lineOfBusiness,
            // TODO verify this is ok
            siteSubSection: classification,
            // TODO verify this is ok
            siteSubSubSection: undefined,
            // TODO what should this be?
            domain: domain,
            pageErrorName: pageErrorName
          }
        }
      };
      this.dataLayer.push(data);
    }

    /**
     * @typedef {Object} AnalyticsUserInfo
     * @type {Object}
     * @property {?string} classification - The user's classification
     * @property {?string} guid - The user's guid
     * @property {?string} lineOfBusiness - The user's line of business
     * @property {?string[]} packages - The user's packages
     * @property {?string} plan - The user's plan
     * @property {?string} status - The user's account status (active, expired, lead)
     * @property {?string} uuid - The user's uuid
     * @property {?string} zipCode - The user's zip code
     */

    /**
     * Update user info into the data layer.
     *
     * @param {AnalyticsUserInfo} userInfo - the page params
     *
     * @example
     * TODO
     */
  }, {
    key: "updateUserData",
    value: function updateUserData(userData) {
      var guid = userData.guid,
        email = userData.email,
        emailSha256 = userData.emailSha256,
        offerIdentifier = userData.offerIdentifier,
        packages = userData.packages,
        plan = userData.plan,
        planOffer = userData.planOffer,
        status = userData.status,
        subscribedPackages = userData.subscribedPackages,
        uuid = userData.uuid,
        classification = userData.classification,
        lineOfBusiness = userData.lineOfBusiness,
        zipCode = userData.zipCode;
      var packagesArray = Array.isArray(packages) ? packages : [packages];

      // If email is null or undefined, contactInfo will be an empty object
      var contactInfo = email ? {
        contact: {
          email: email,
          hashed: {
            sha256: {
              email: emailSha256
            }
          }
        }
      } : {};
      var data = {
        web: {
          user: _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({
            guid: guid
          }, contactInfo), status && {
            accountStatus: status
          }), offerIdentifier && {
            offerIdentifier: offerIdentifier
          }), plan && {
            plan: plan
          }), planOffer && {
            planOffer: planOffer
          }), subscribedPackages && {
            subscribedPackages: subscribedPackages
          }), {}, {
            zipCode: zipCode,
            _sling: {
              packageNames: packagesArray,
              uuid: uuid,
              // TODO should this be the subscriberId?
              classification: classification,
              lineOfBusiness: lineOfBusiness
            }
          })
        }
      };
      this.dataLayer.push(data);
      localStorage.setItem('adobeDataLayer.web.user', JSON.stringify(userData));
    }

    /**
     * Update performance info into the data layer. This should only be called once per page load.
     * Calling this multiple times may add records to the data layer, but has no impact on the
     * effective data layer.
     *
     * NOTE: This must be called after the performance data is recorded (aka page is finished loading).
     * This can be accomplished by putting the call to updatePerformanceData in a setTimeout()
     *
     * @example
     * window.addEventListener('load', () => {
     *   analytics.updatePerformanceData();
     * });
     */
  }, {
    key: "updatePerformanceData",
    value: function updatePerformanceData() {
      var _window$performance$g, _window, _window$performance, _window$performance$g2, _window$performance$g3, _window$performance$g4;
      var millis = Math.round((_window$performance$g = (_window = window) === null || _window === void 0 ? void 0 : (_window$performance = _window.performance) === null || _window$performance === void 0 ? void 0 : (_window$performance$g2 = _window$performance.getEntriesByType) === null || _window$performance$g2 === void 0 ? void 0 : (_window$performance$g3 = _window$performance$g2.call(_window$performance, 'navigation')) === null || _window$performance$g3 === void 0 ? void 0 : (_window$performance$g4 = _window$performance$g3[0]) === null || _window$performance$g4 === void 0 ? void 0 : _window$performance$g4.domComplete) !== null && _window$performance$g !== void 0 ? _window$performance$g : 0);
      var seconds = Math.floor(millis / 1000);
      var bucket = seconds > 10 ? '10+sec' : "".concat(seconds, "-").concat(seconds + 1, "sec");
      var data = {
        web: {
          webPageDetails: {
            loadTime: millis,
            _sling: {
              loadTimeBucket: bucket
            }
          }
        }
      };
      this.dataLayer.push(data);
    }

    /**
     * Update page access info into the data layer. This should only be called once per page load.
     * Calling this multiple times may add records to the data layer, but has no impact on the
     * effective data layer.
     *
     * @example
     * analytics.updatePageAccessInfo();
     */
  }, {
    key: "updatePageAccessInfo",
    value: function updatePageAccessInfo() {
      var pageViewDayOfWeek = new Date().toLocaleString('en-US', {
        timeZone: 'America/Denver',
        weekday: 'short'
      }).toLowerCase();
      var data = {
        web: {
          webPageDetails: {
            _sling: {
              pageViewDayOfWeek: pageViewDayOfWeek
            }
          }
        }
      };
      this.dataLayer.push(data);
    }

    /**
     * Update params info into the data layer. This needs to be called on page load and when  the params
     * change, but the page does not reload.
     * @example
     * analytics.addPageData();
     */
  }, {
    key: "updateUrlParamsData",
    value: function updateUrlParamsData(urlSearchParams) {
      // TODO should this be part of pageData?
      // TODO does this need to be called when we change params but don't reload?
      // TODO handle reading from local storage

      var urlParamsArray = Array.from(urlSearchParams.entries());
      var fromEntriesToObject = function fromEntriesToObject(prev, cur) {
        // eslint-disable-next-line no-param-reassign
        prev[cur[0]] = cur[1];
        return prev;
      };

      /**
       * @type {Object.<string, Array.<string>>}
       */
      var simpleParamConfig = queryParameters_namespaceObject;
      var isSimpleParam = function isSimpleParam(paramName) {
        return Object.entries(simpleParamConfig)
        // true if it is in one of the groups in the config
        .filter(function (_ref2) {
          var _ref3 = _slicedToArray(_ref2, 2),
            groupMembers = _ref3[1];
          return groupMembers.includes(paramName);
        })
        // reduce down to a single true/false value
        .reduce(function (cur, next) {
          return cur || next;
        }, false);
      };
      var simpleParams = urlParamsArray.filter(function (_ref4) {
        var _ref5 = _slicedToArray(_ref4, 1),
          paramName = _ref5[0];
        return isSimpleParam(paramName);
      }).reduce(fromEntriesToObject, {});

      // This is very special handling to convert roku_code into easy_code + easy_device
      var rokuCodeParams = {};
      var rokuCodeValue = urlSearchParams.get('roku_code');
      if (rokuCodeValue) {
        rokuCodeParams.easy_code = rokuCodeValue;
        rokuCodeParams.easy_device = 'roku';
      }
      // end special handling for roku

      var data = {
        web: {
          webPageDetails: {
            _sling: {
              urlParams: _objectSpread(_objectSpread({}, simpleParams), rokuCodeParams)
            }
          }
        }
      };
      this.dataLayer.push(data);
    }

    /**
     * Update the locals zip code for the locals component.
     *
     * @param {number} localsComponentZip - the zip code.
     *
     * @example
     * analytics.updateLocalsZipCode(12345);
     */
  }, {
    key: "updateLocalsZipCode",
    value: function updateLocalsZipCode(localsComponentZip) {
      if (!localsComponentZip) {
        analyticsWarn('Zip code was not provided');
        return;
      }
      var data = {
        web: {
          user: {
            zipCode: localsComponentZip
          }
        }
      };
      this.dataLayer.push(data);
    }

    /**
     * Dispatch this event when the page loads.
     *
     * **NOTE:** Using this with page params or a zip code is deprecated.
     *
     * @param {*} o
     * @param {?number} o.localsComponentZip - Deprecated: the locals zip.
     *    Use `analytics.updateLocalsZipCode()` instead.
     * @param {?AnalyticsPageInfo} o.pageData - Deprecated: the page data.
     *    Use `analytics.updatePageData()` instead.
     * @example
     * analytics.screenLoad('account', 'latino', 'latino', 'home', 'es');
     */
  }, {
    key: "screenLoad",
    value: function screenLoad(_ref6) {
      var localsComponentZip = _ref6.localsComponentZip,
        pageData = _objectWithoutProperties(_ref6, _excluded);
      if (this.screenLoadFired) {
        analyticsWarn('screenLoad was called twice, not calling again.');
        return;
      }
      this.screenLoadFired = true;

      // TODO ensure this waits until page load time data is set
      //  This may not be a problem, just noting here to verify
      this.updatePageData(pageData);
      this.updateLocalsZipCode(localsComponentZip);
      var data = {
        event: eventNames_namespaceObject.screenLoad,
        screenLoadFired: true,
        web: {
          currentEvent: eventNames_namespaceObject.screenLoad
        }
      };
      this.dataLayer.push(data);
    }

    /**
     * Get the value of the form field element. Value will be the type-dependent value. If there are
     * multiple values, value will be a comma-separated list of the values. If the type is a checkbox,
     * the value will be 'checked' or 'unchecked'. If the form element isn't marked with
     * 'data-sling-analytics-capture', its value will be the constant 'untracked'.
     *
     * The value will only be collected
     *
     * @param {?FormField} field - a form field
     *
     * @returns {string}
     */
  }, {
    key: "updateFormData",
    value:
    /**
     * @typedef {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | RadioNodeList} FormField
     */

    /**
     * @typedef UpdateFormDataParams
     * @type {Object}
     * @property {?HTMLFormElement} form
     * @property {?FormField} field
     * @property {?string} fieldName
     * @property {?string} name - Identifier for the form
     * @property {?string} error - Error Key (or human readable description)
     */

    /**
     * Updates the form data for this form. If the field is not marked with the attribute
     * `data-sling-analytics-capture`, the value will always show as 'untracked`
     *
     * @param {UpdateFormDataParams} params
     */
    function updateFormData(_ref7) {
      var _ref8, _ref9, _form$elements$fieldN, _form$elements, _form$elements2, _field$form, _field$form$elements;
      var form = _ref7.form,
        field = _ref7.field,
        fieldName = _ref7.fieldName,
        name = _ref7.name,
        error = _ref7.error;
      var normalizedField = (_ref8 = (_ref9 = (_form$elements$fieldN = form === null || form === void 0 ? void 0 : (_form$elements = form.elements) === null || _form$elements === void 0 ? void 0 : _form$elements[fieldName]) !== null && _form$elements$fieldN !== void 0 ? _form$elements$fieldN : form === null || form === void 0 ? void 0 : (_form$elements2 = form.elements) === null || _form$elements2 === void 0 ? void 0 : _form$elements2[field === null || field === void 0 ? void 0 : field.name]) !== null && _ref9 !== void 0 ? _ref9 : field === null || field === void 0 ? void 0 : (_field$form = field.form) === null || _field$form === void 0 ? void 0 : (_field$form$elements = _field$form.elements) === null || _field$form$elements === void 0 ? void 0 : _field$form$elements[field === null || field === void 0 ? void 0 : field.name]) !== null && _ref8 !== void 0 ? _ref8 : field;
      var formField;
      if (normalizedField || fieldName) {
        var normalizedFieldName = fieldName || normalizedField.name || normalizedField.id;
        var normalizedFieldValue = AnalyticsADL.getFormFieldValue(field);
        if (normalizedFieldName) {
          formField = {
            name: normalizedFieldName,
            value: normalizedFieldValue
          };
        } else {
          analyticsWarn("Not tracking field with value because there is no field name or ID");
        }
      }

      // intentional use of || because name and id will be empty strings, not null/undefined
      var formName = name !== null && name !== void 0 ? name : form.name || form.id || 'form name not found';
      var data = {
        form: {
          formDetails: {
            formName: formName,
            _sling: {
              formField: formField
            },
            errorDetails: error
          }
        }
      };
      this.dataLayer.push(data);
    }

    /**
     * Dispatch this event when the user completes a form
     *
     * @param {*} o - the params
     * @param {HTMLFormElement} o.element - Da form
     * @param {?string} o.name - Identifier for the form
     *
     * To capture input values, a data tag must be set on the input element
     * data-sling-analytics-capture=true
     * Be certain that you should capture the inputs before you add the tag
     *
     * @example
     * analytics.formComplete({element: document.getElementById('some-form')});
     * analytics.formComplete({name: 'some-form'});
     */
  }, {
    key: "formComplete",
    value: function formComplete(_ref10) {
      var element = _ref10.element,
        name = _ref10.name;
      this.updateFormData({
        form: element,
        name: name
      });
      var data = {
        event: eventNames_namespaceObject.form.complete,
        web: {
          currentEvent: eventNames_namespaceObject.form.complete
        }
      };
      this.dataLayer.push(data);
    }

    /**
     * Dispatch this event when an error occurs on any form (user error or API/technical error)
     *
     * @param {*} o
     * @param {HTMLFormElement} o.element - Da form
     * @param {?string} o.name - Identifier for the form
     * @param {string} o.error - Error Key (or human readable description)
     *
     * @example
     * analytics.formError({element: document.getElementById('some-form'), error: 'PEBCAK'});
     * analytics.formError({name: 'some-form', error: 'ID-Ten-Tee'});
     */
  }, {
    key: "formError",
    value: function formError(_ref11) {
      var element = _ref11.element,
        name = _ref11.name,
        error = _ref11.error;
      this.updateFormData({
        form: element,
        name: name,
        error: error
      });
      var data = {
        event: eventNames_namespaceObject.form.error,
        web: {
          currentEvent: eventNames_namespaceObject.form.error
        }
      };
      this.dataLayer.push(data);
    }

    /**
     * Dispatch this event when the user interacts w/ a form element (usually on `blur`)
     *
     * @param {*} form
     * @param {HTMLFormElement} form.element - Da form
     * @param {string} form.name -  Identifier for the form
     * @param {*} input
     * @param {HTMLFormElement} input.inputElement - The input
     * @param {string} input.inputName - The input name
     *
     * To capture input values, a data tag must be set on the input element
     * data-sling-analytics-capture=true
     * Be certain that you should capture the inputs before you add the tag
     *
     * @example
     * analytics.formInteraction(
     *   {element: document.getElementById('some-form')},
     *   {inputElement: document.getElementById('a-textarea-or-something')}
     * );
     * analytics.formInteraction(
     *   {name: 'some-form'},
     *   {inputName: 'a-textarea-or-something'}
     * );
     * analytics.formInteraction(
     *   {element: document.getElementById('mix-and-match')},
     *   {inputName: 'a-checkbox-maybe'}
     * );
     */
  }, {
    key: "formInteraction",
    value: function formInteraction(_ref12, _ref13) {
      var element = _ref12.element,
        name = _ref12.name;
      var inputElement = _ref13.inputElement,
        inputName = _ref13.inputName;
      // Call formStart(), which checks if already fired for this form.
      this.formStart({
        element: element,
        name: name
      });
      this.updateFormData({
        form: element,
        field: inputElement,
        fieldName: inputName,
        name: name
      });
      var data = {
        event: eventNames_namespaceObject.form.interaction,
        web: {
          currentEvent: eventNames_namespaceObject.form.interaction
        }
      };
      this.dataLayer.push(data);
    }

    /**
     * Dispatch this event when the user first interacts w/ a specific form
     * (first time an element is `focus`ed, usually)
     *
     * @param {*} form
     * @param {HTMLFormElement} form.element - Da form
     * @param {string} form.name -  Identifier for the form
     *
     * @example
     * analytics.formStart({element: document.getElementById('some-form')});
     * analytics.formStart({name: 'some-form'});
     */
  }, {
    key: "formStart",
    value: function formStart(_ref14) {
      var element = _ref14.element,
        name = _ref14.name;
      var formId = name || (element === null || element === void 0 ? void 0 : element.name) || (element === null || element === void 0 ? void 0 : element.id);
      if (!formId) {
        analyticsWarn('The form id was not found.');
        return;
      }
      if (this.formStartFired[formId]) {
        // Already called form start for this form
        return;
      }
      this.formStartFired[formId] = true;
      this.updateFormData({
        form: element,
        name: name
      });
      var data = {
        event: eventNames_namespaceObject.form.start,
        web: {
          currentEvent: eventNames_namespaceObject.form.start
        }
      };
      this.dataLayer.push(data);
    }

    /**
     * Dispatch this event when the user logs into their account
     *
     * @param {AnalyticsUserInfo} userInfo - The user info
     *
     * @example
     * analytics.userLogin({'us', '11131', 'domestic',
     *  ['sling-orange', 'sling-blue'], 'one-week-free', 'active', '1222'});
     */
  }, {
    key: "userLogin",
    value: function userLogin(userInfo) {
      this.updateUserData(userInfo);
      var data = {
        event: eventNames_namespaceObject.userLogin,
        web: {
          user: {
            authState: 'logged_in'
          },
          currentEvent: eventNames_namespaceObject.userLogin
        }
      };
      this.dataLayer.push(data);
    }

    /**
     * Dispatch this event when the user signs out of their account
     *
     * @example
     * analytics.userLogout();
     */
  }, {
    key: "userLogout",
    value: function userLogout() {
      var data = {
        event: eventNames_namespaceObject.userLogout,
        web: {
          user: {
            authState: 'logged_out'
          },
          currentEvent: eventNames_namespaceObject.userLogout
        }
      };
      this.dataLayer.push(data);
    }

    /**
     * @typedef {Object} userCancelTenureInfo
     * @type {Object}
     * @property {?string} refundStatus
     */

    /**
     * Dispatch this event when the user cancels so that we can capture the cancel tenure.
     *
     * @param {userCancelTenureInfo} data
     *
     * @example
     * const data = { refundStatus: 'same_day_refunded' };
     * analytics.userCancelTenure(data);
     */
  }, {
    key: "userCancelTenure",
    value: function userCancelTenure(_ref15) {
      var accountStatus = _ref15.accountStatus,
        refundStatus = _ref15.refundStatus,
        offerIdentifier = _ref15.offerIdentifier,
        plan = _ref15.plan,
        planOffer = _ref15.planOffer,
        subscribedPackages = _ref15.subscribedPackages;
      if (!refundStatus) {
        analyticsWarn('Could not find "refundStatus" argument in userCancelTenure');
        return;
      }
      var data = {
        event: eventNames_namespaceObject.cancelTenure,
        web: {
          user: _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, accountStatus && {
            accountStatus: accountStatus
          }), {}, {
            cancelTenure: refundStatus
          }, offerIdentifier && {
            offerIdentifier: offerIdentifier
          }), plan && {
            plan: plan
          }), planOffer && {
            planOffer: planOffer
          }), subscribedPackages && {
            subscribedPackages: subscribedPackages
          })
        }
      };
      this.dataLayer.push(data);
      localStorage.removeItem('adobeDataLayer.web.user');
    }

    /**
     * Dispatch this event when the user creates a new account
     *
     * @param {AnalyticsUserInfo} userInfo - The user info
     *
     * @example
     *  analytics.userRegister('us', '12324241212', 'domestic', ['sling-orange', 'sling-blue'],
     *  'one-stair-step', 'lead', 'free trial', '2343243232')
     */
  }, {
    key: "userRegister",
    value: function userRegister(userInfo) {
      this.updateUserData(userInfo);
      var data = {
        event: eventNames_namespaceObject.userRegister,
        web: {
          currentEvent: eventNames_namespaceObject.userRegister
        }
      };
      this.dataLayer.push(data);
    }

    /**
     * @typedef {Object} AnalyticsCartInfo
     * @type {Object}
     * @property {string}  category cart step category
     * @property {string}  subCategory cart step sub-category
     * @property {string}  referrer cart step referrer (source page)
     * @property {string}  planName cart step plan name
     * @property {string}  offerName cart step plan offer name
     * @property {string}  deviceBundle device bundle type for cart
     * @property {string}  subType derived from cart type plan, default value is "paid"
     * @property {?string[]}  basePreselect base package from cart
     * @property {?string[]}  extrasPreselect extras package from cart
     */

    /**
     * Update cart data to the data layer.
     *
     * @param {AnalyticsCartInfo} cartData analytics data from cart
     */
  }, {
    key: "updateCartData",
    value: function updateCartData(_ref16) {
      var _ref16$category = _ref16.category,
        category = _ref16$category === void 0 ? 'unknown' : _ref16$category,
        _ref16$subCategory = _ref16.subCategory,
        subCategory = _ref16$subCategory === void 0 ? 'unknown' : _ref16$subCategory,
        referrer = _ref16.referrer,
        _ref16$planName = _ref16.planName,
        planName = _ref16$planName === void 0 ? 'unknown' : _ref16$planName,
        _ref16$offerName = _ref16.offerName,
        offerName = _ref16$offerName === void 0 ? 'unknown' : _ref16$offerName,
        deviceBundle = _ref16.deviceBundle,
        _ref16$subType = _ref16.subType,
        subType = _ref16$subType === void 0 ? 'unknown' : _ref16$subType,
        _ref16$basePreselect = _ref16.basePreselect,
        basePreselect = _ref16$basePreselect === void 0 ? [] : _ref16$basePreselect,
        _ref16$extrasPreselec = _ref16.extrasPreselect,
        extrasPreselect = _ref16$extrasPreselec === void 0 ? [] : _ref16$extrasPreselec;
      var packagePreselect = [].concat(_toConsumableArray(basePreselect), _toConsumableArray(extrasPreselect));
      var formattedPackagePreselect = packagePreselect.join('|');
      var data = {
        commerce: {
          cart: {
            _sling: {
              category: category,
              subCategory: subCategory,
              referrer: referrer,
              planName: planName,
              offerName: offerName,
              deviceBundle: deviceBundle,
              subType: subType,
              basePreselect: basePreselect,
              extrasPreselect: extrasPreselect,
              packagePreselect: packagePreselect,
              // Normally we would pass in the raw array of data for this, but it was requested that
              //  packagePreselect be the same format as it was in tealium (pipe separated values).
              formattedPackagePreselect: formattedPackagePreselect
            }
          }
        }
      };
      this.dataLayer.push(data);
    }

    /**
     * Report when a user selects/deselects an item in the cart.
     *
     * @param {string} type event type (e.g. add, remove)
     * @param {AnalyticsProductInfo[]} cartData analytics data from cart
     *
     *  @example
     * analytics.cartSelection('add', cartData)
     */
  }, {
    key: "cartSelection",
    value: function cartSelection(type, cartData) {
      var eventName = eventNames_namespaceObject.cartSelection[type];
      if (!eventName) {
        // eslint-disable-next-line no-console
        analyticsWarn('Unknown event name in cart selection');
        return;
      }
      this.updateProductListItems(cartData);
      var data = {
        event: eventName,
        web: {
          currentEvent: eventName
        }
      };
      this.dataLayer.push(data);
    }

    /**
     * Dispatch this event when a *cart* page loads
     *
     * @param {string} stepName the name of the cart step (e.g. accounts, products, billing, etc)
     * @param {AnalyticsCartInfo} cartData analytics data from cart
     * @param {AnalyticsPageInfo}  pageData analytics data from current page user is on
     *
     *  @example
     * analytics.cartStep('products', cartData, pageData, false)
     */
  }, {
    key: "cartStep",
    value: function cartStep(stepName, cartData, pageData) {
      var cartEventName = eventNames_namespaceObject.cartStep[stepName];
      if (!cartEventName) {
        analyticsWarn('Unknown event name in cart step');
        return;
      }

      // TODO remove the need to update pageData
      this.updatePageData(pageData);
      this.updateCartData(cartData);
      var data = {
        event: cartEventName,
        web: {
          currentEvent: cartEventName
        }
      };
      this.dataLayer.push(data);
    }

    /**
     * @typedef {Object} AnalyticsInteractionInfo
     * @type {Object}
     * @property {HTMLElement} element - The source HTML element the user interacted with
     * @property {string} [name=element.textContent.replace(/\s+/g,'-').toLowerCase()] - Kebab-case
     *   text on clicked element
     * @property {string} [component=element.tagName.toLowerCase()] - The type of element being
     *   interacted with
     * @property {string} [parent=element.parentNode.tagName.toLowerCase()] - The parent component of
     *   the target element
     * @property {string} [target=element.getAttribute('href')] - The href value of the clicked element
     */

    /**
     * Dispatch this event when the user interacts w/ a UI element
     *
     * @param {AnalyticsInteractionInfo} props
     *
     * @example
     * analytics.uiInteraction({ element: document.getElementById('homepage-cta') });
     */
  }, {
    key: "uiInteraction",
    value: function uiInteraction(params) {
      var _ref17, _name, _element$textContent, _element$textContent$, _ref18, _component, _element$tagName, _element$tagName$toLo, _ref19, _parent, _element$parentNode, _element$parentNode$t, _element$parentNode$t2, _ref20, _target, _element$getAttribute;
      var element = params.element;
      var name = params.name,
        component = params.component,
        parent = params.parent,
        target = params.target;

      // Handle empty string defaults grab defaults for the values
      name = (_ref17 = (_name = name) !== null && _name !== void 0 ? _name : element === null || element === void 0 ? void 0 : (_element$textContent = element.textContent) === null || _element$textContent === void 0 ? void 0 : (_element$textContent$ = _element$textContent.replace) === null || _element$textContent$ === void 0 ? void 0 : _element$textContent$.call(_element$textContent, /\s+/g, '-')) !== null && _ref17 !== void 0 ? _ref17 : '';
      component = (_ref18 = (_component = component) !== null && _component !== void 0 ? _component : element === null || element === void 0 ? void 0 : (_element$tagName = element.tagName) === null || _element$tagName === void 0 ? void 0 : (_element$tagName$toLo = _element$tagName.toLowerCase) === null || _element$tagName$toLo === void 0 ? void 0 : _element$tagName$toLo.call(_element$tagName)) !== null && _ref18 !== void 0 ? _ref18 : '';
      parent = (_ref19 = (_parent = parent) !== null && _parent !== void 0 ? _parent : element === null || element === void 0 ? void 0 : (_element$parentNode = element.parentNode) === null || _element$parentNode === void 0 ? void 0 : (_element$parentNode$t = (_element$parentNode$t2 = _element$parentNode.tagName).toLowerCase) === null || _element$parentNode$t === void 0 ? void 0 : _element$parentNode$t.call(_element$parentNode$t2)) !== null && _ref19 !== void 0 ? _ref19 : '';
      target = (_ref20 = (_target = target) !== null && _target !== void 0 ? _target : element === null || element === void 0 ? void 0 : (_element$getAttribute = element.getAttribute) === null || _element$getAttribute === void 0 ? void 0 : _element$getAttribute.call(element, 'href')) !== null && _ref20 !== void 0 ? _ref20 : '';

      // Check the data values for truthy values, so we can warn when none are truthy.
      // Keep only values that have a truthy value.
      var goodData = [name, component, parent].filter(function (v) {
        return !!v;
      });

      // Warn and skip the call if there were no truthy values.
      if (!goodData.length) {
        analyticsWarn("UIInteraction: No data was passed in for {name, component, parent} and no element was provided");
        return;
      }
      var interactionName = "".concat(parent, "|").concat(component, "|").concat(name);
      var data = {
        event: eventNames_namespaceObject.uiInteraction,
        web: {
          webInteraction: {
            // clickLocation: undefined, // TODO what should this be?
            name: name,
            type: 'other',
            // TODO revisit this later.
            _sling: {
              component: component,
              parent: parent,
              interactionName: interactionName,
              target: target
            }
          },
          currentEvent: eventNames_namespaceObject.uiInteraction
        }
      };
      this.dataLayer.push(data);
    }

    /**
     * @typedef {Object} AnalyticsModalInfo
     * @type {Object}
     * @property {?string} name - The source HTML element the user interacted with
     */

    /**
     * Dispatch this event whenever user opens a modal
     *
     * @param {AnalyticsModalInfo} data
     *
     * @example
     * const data = { name: 'cancel_subscription_modal' };
     * analytics.modalOpen(data);
     */
  }, {
    key: "modalOpen",
    value: function modalOpen(_ref21) {
      var name = _ref21.name;
      if (!name) {
        analyticsWarn('Could not find "name" argument in modalOpen');
        return;
      }
      var data = {
        event: eventNames_namespaceObject.modal.modalOpen,
        web: {
          webInteraction: {
            _sling: {
              modalName: name
            }
          },
          currentEvent: eventNames_namespaceObject.modal.modalOpen
        }
      };
      this.dataLayer.push(data);
    }

    /**
     * Dispatch this event whenever user closes a modal
     *
     * @param {AnalyticsModalInfo} data
     *
     * @example
     * const data = { name: 'cancel_subscription_modal' };
     * analytics.modalClose(data);
     */
  }, {
    key: "modalClose",
    value: function modalClose() {
      var _ref22 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        name = _ref22.name;
      if (!name) {
        analyticsWarn('Could not find "name" argument in modalClose');
        return;
      }
      var data = {
        event: eventNames_namespaceObject.modal.modalClose,
        web: {
          webInteraction: {
            _sling: {
              modalName: name
            }
          },
          currentEvent: eventNames_namespaceObject.modal.modalClose
        }
      };
      this.dataLayer.push(data);
    }

    /**
     * @typedef {Object} AnalyticsOrderInfo
     * @type {Object}
     * @property {string} orderId the order id
     * @property {string} subtotal the subtotal of the user's order
     * @property {string} total the total of the user's order
     * @property {string} tax the tax on the subscription order
     * @property {string} currency the currency identifier on the subscription order
     * @property {string} cartName the cart name on the subscription order
     * @property {string} planName the plan name for the subscription order
     * @property {string} offerName the plan offer name for the subscription order
     * @property {string} promoCode the promo code on the subscription order
     * @property {string} giftCard the gift card code for the subscription order
     * @property {string} type order type (options: sub-create, sub-change, sub-restart)
     */

    /**
     * @typedef {Object} AnalyticsProductInfo
     * @type {Object}
     * @property {string} id - product identifier
     * @property {string} name - name of product
     * @property {?string} quantity - quantity of the product
     * @property {string} guid - sku of product
     * @property {string} unitPrice - unit price of the product
     * @property {string} category - category of the product
     */

    /**
     * Update productListItems in the data layer
     * @param {AnalyticsProductInfo[]} products
     */
  }, {
    key: "updateProductListItems",
    value: function updateProductListItems(products) {
      var productListItems = products.map(function (product) {
        var _rawPrice$toString;
        var id = product.id,
          name = product.name,
          rawQuantity = product.quantity,
          rawPrice = product.unitPrice,
          guid = product.guid,
          category = product.category;

        // XXX Data fix to be removed later XXX
        // intentional use of || instead of ??
        var quantity = (rawQuantity || '1').toString();
        var priceTotal = rawPrice === null || rawPrice === void 0 ? void 0 : (_rawPrice$toString = rawPrice.toString) === null || _rawPrice$toString === void 0 ? void 0 : _rawPrice$toString.call(rawPrice);
        // XXX End data fix

        return {
          name: name,
          quantity: quantity,
          priceTotal: priceTotal,
          _sling: {
            id: id,
            guid: guid,
            category: category
          },
          _prodMerchandising: {
            merchcategory1: name,
            merchcategory2: guid,
            merchcategory3: category
          }
        };
      });
      var data = {
        productListItems: productListItems
      };
      this.dataLayer.push(data);
    }

    /* eslint-disable max-len */
    /**
     * Dispatch this event when the user completes an order (i.e. buys something)
     *
     * @param {string} eventName the subscription step (create, change, upgrade, downgrade, restart)
     * @param {AnalyticsUserInfo} userData
     * @param {AnalyticsOrderInfo} orderData
     * @param {AnalyticsProductInfo[]} productData
     *
     * @example
     * const userData = {'2343aa2343', '2343aa2343', 'logged-in', 'lead', 'paid', 'one-stair-step',
     *                  'sling-orange', 'domestic' 'us'}
     * const orderData = {'123456', '9.9', '13.99',
     *                   '4.0', 'USD', 'alacarte',
     *                   'one-stair-step', 'MASCT881146', 'AVQ2QPYHRHQGJKPH8', 'sub-create'};
     * const productData = [{'12312', 'name', '1111', '11.00'}];
     * analytics.order('create', orderData, productData)
     * analytics.cartStep('products', cartData, pageData) //See cartStep docs for values
     *
     * //eslint-enable max-len
     */
  }, {
    key: "order",
    value: function order(eventName, userData, _ref23, productData) {
      var _subtotalOriginal$toS, _totalOriginal$toStri, _taxOriginal$toString, _orderIdOriginal$toSt;
      var orderIdOriginal = _ref23.orderId,
        subtotalOriginal = _ref23.subtotal,
        totalOriginal = _ref23.total,
        taxOriginal = _ref23.tax,
        currency = _ref23.currency,
        cartName = _ref23.cartName,
        planName = _ref23.planName,
        offerName = _ref23.offerName,
        promoCode = _ref23.promoCode,
        giftCardOriginal = _ref23.giftCard,
        type = _ref23.type;
      var subStepName = eventNames_namespaceObject.order[eventName];
      var subscriptionChangeEvents = ['sub_change', 'sub_upgrade', 'sub_downgrade'].reduce(function (prev, cur) {
        return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, cur, cur.replace('_', '-')));
      }, {});
      if (!subStepName) {
        analyticsWarn('Unknown event name in order subscription event');
        return;
      }
      if (!productData) {
        analyticsWarn('Either order data or product data is undefined');
        return;
      }

      // The API is not called with the same param names, so fixing it here
      //   then passing the info along to the update function.
      var fixedUserData = _objectSpread({
        guid: userData.userGuid,
        status: userData.accountStatus
      }, userData);
      this.updateUserData(fixedUserData);
      this.updateProductListItems(productData);
      var orderSubChangeType = subscriptionChangeEvents[subStepName];

      // XXX Data fix to be removed later XXX
      var giftCard = giftCardOriginal;
      if (Array.isArray(giftCard)) {
        giftCard = giftCard.join(',');
      }
      var subtotal = subtotalOriginal === null || subtotalOriginal === void 0 ? void 0 : (_subtotalOriginal$toS = subtotalOriginal.toString) === null || _subtotalOriginal$toS === void 0 ? void 0 : _subtotalOriginal$toS.call(subtotalOriginal);
      var total = totalOriginal === null || totalOriginal === void 0 ? void 0 : (_totalOriginal$toStri = totalOriginal.toString) === null || _totalOriginal$toStri === void 0 ? void 0 : _totalOriginal$toStri.call(totalOriginal);
      var tax = taxOriginal === null || taxOriginal === void 0 ? void 0 : (_taxOriginal$toString = taxOriginal.toString) === null || _taxOriginal$toString === void 0 ? void 0 : _taxOriginal$toString.call(taxOriginal);
      var orderId = orderIdOriginal === null || orderIdOriginal === void 0 ? void 0 : (_orderIdOriginal$toSt = orderIdOriginal.toString) === null || _orderIdOriginal$toSt === void 0 ? void 0 : _orderIdOriginal$toSt.call(orderIdOriginal);
      // XXX End data fix

      var dataForOrder = {
        event: subStepName,
        commerce: {
          order: {
            orderTax: tax,
            shippingAmount: undefined,
            // TODO currently not tracked
            // activationFeesAmount: undefined, // not used
            discountAmount: undefined,
            //  TODO currently not tracked
            // serviceFees: undefined, //  not used
            purchaseID: orderId,
            hashedPurchaseID: orderId,
            // TODO verify if this is ok
            promoCode: promoCode,
            _sling: {
              subtotal: subtotal,
              total: total,
              currency: currency,
              cartName: cartName,
              giftCard: giftCard,
              planName: planName,
              offerName: offerName,
              orderType: type,
              orderSubChangeType: orderSubChangeType
            }
          }
        },
        web: {
          currentEvent: subStepName
        }
      };
      this.dataLayer.push(dataForOrder);
    }

    /**
     * Dispatch this event when a "step" page loads.
     * A "step" page is a generic concept very similar to the cart "step" page(s).
     *
     * @param {string} name - The name of the step
     * @param {*} eventData - Plain Object containing the event data.
     *
     * @see {@linkcode validSteps}
     *
     * @example
     * const data = {
     *   name: 'cancel-rebuttal-page',
     *   lineOfBusiness: 'domestic',
     *   classification: 'domestic',
     *   type: 'cancel',
     *   lang: 'en'
     * };
     * analytics.step('cancelStart', data, false);
     */
  }, {
    key: "step",
    value: function step(name, eventData) {
      var _stepPageTypeOverride, _validSteps$name;
      if (typeof validSteps_namespaceObject[name] === 'undefined') {
        analyticsWarn("Event \"".concat(name, "\" is not a valid event"));
        return;
      }
      var pageData = _objectSpread(_objectSpread({}, eventData), {}, {
        type: (_stepPageTypeOverride = stepPageTypeOverrides_namespaceObject[name]) !== null && _stepPageTypeOverride !== void 0 ? _stepPageTypeOverride : eventData.type
      });
      this.updatePageData(pageData);
      var eventName = (_validSteps$name = validSteps_namespaceObject[name]) !== null && _validSteps$name !== void 0 ? _validSteps$name : eventNames_namespaceObject.screenLoad;

      // This is essentially a screen load event, so nothing beyond that is needed.
      var data = {
        event: eventName,
        web: {
          currentEvent: eventName
        }
      };
      this.dataLayer.push(data);
    }

    /**
     * Dispatch this event when a search starts
     * @example
     * analytics.searchStart();
     */
  }, {
    key: "searchStart",
    value: function searchStart() {
      var data = {
        event: eventNames_namespaceObject.search.begin,
        web: {
          currentEvent: eventNames_namespaceObject.search.begin
        }
      };
      this.dataLayer.push(data);
    }

    /**
     * Dispatch this event when user click on serch
     * @param {*} obj
     * @param {String} obj.searchValue
     *
     * @example
     * const obj = {
     * searchValue: "test"
     * }
     * analytics.searchComplete(obj);
     */
  }, {
    key: "searchComplete",
    value: function searchComplete(_ref24) {
      var searchValue = _ref24.searchValue;
      if (!searchValue) {
        analyticsWarn('Could not find "searchValue" argument in searchComplete');
        return;
      }
      var data = {
        event: eventNames_namespaceObject.search.complete,
        search: {
          searchDetails: {
            searchTerm: searchValue,
            searchResults: undefined // TODO do we need this?
          }
        },
        web: {
          currentEvent: eventNames_namespaceObject.search.complete
        }
      };
      this.dataLayer.push(data);
    }
    /**
     * Dispatch this event when a pause starts
     * @example
     * analytics.pauseStart()
     */
  }, {
    key: "pauseStart",
    value: function pauseStart() {
      var data = {
        event: eventNames_namespaceObject.pause.start,
        web: {
          currentEvent: eventNames_namespaceObject.pause.start
        }
      };
      this.dataLayer.push(data);
    }

    /**
     * Dispatch this event when a sub pause confirm
     * @example
     * analytics.confirmSubPause()
     */
  }, {
    key: "confirmSubPause",
    value: function confirmSubPause(_ref25) {
      var pauseDuration = _ref25.pauseDuration;
      var data = {
        event: eventNames_namespaceObject.pause.end,
        web: {
          currentEvent: eventNames_namespaceObject.pause.end,
          user: {
            _sling: {
              pauseDuration: pauseDuration
            }
          }
        }
      };
      this.dataLayer.push(data);
    }
  }], [{
    key: "getFormFieldValue",
    value: function getFormFieldValue(field) {
      var _el$dataset;
      /** @type {(HTMLInputElement |HTMLTextAreaElement | HTMLSelectElement)} */
      var el = field instanceof RadioNodeList ? field[0] : field;
      var dataset = (_el$dataset = el === null || el === void 0 ? void 0 : el.dataset) !== null && _el$dataset !== void 0 ? _el$dataset : {};
      var value = 'untracked';
      if ('slingAnalyticsCapture' in dataset) {
        if (el instanceof HTMLSelectElement) {
          value = Array.from(el.selectedOptions).map(function (op) {
            return op.value;
          }).join(',');
        } else if (el.type === 'checkbox') {
          value = el.checked ? 'checked' : 'unchecked';
        } else if (SIMPLE_TYPES.includes(el.type)) {
          value = el.value;
        } else {
          var _ref26, _el$form$name, _el$form, _el$form2;
          analyticsWarn("Unsupported field type. form: ".concat((_ref26 = (_el$form$name = el === null || el === void 0 ? void 0 : (_el$form = el.form) === null || _el$form === void 0 ? void 0 : _el$form.name) !== null && _el$form$name !== void 0 ? _el$form$name : el === null || el === void 0 ? void 0 : (_el$form2 = el.form) === null || _el$form2 === void 0 ? void 0 : _el$form2.id) !== null && _ref26 !== void 0 ? _ref26 : 'id missing', "\n          , field: ").concat(el === null || el === void 0 ? void 0 : el.name, ", type: ").concat(el === null || el === void 0 ? void 0 : el.type));
          value = 'unsupported field type';
        }
      }
      return value;
    }
  }]);
}();
var instance;

/**
 * Get an instance of AnalyticsADL. It may return a singleton.
 *
 * @param {string} appName
 * @returns {AnalyticsADL}
 */
function getInstance(appName) {
  if (!instance) {
    var _window$adobeDataLaye;
    var handler = {
      get: function get(target, prop) {
        var fn = target[prop];
        if (!fn) {
          analyticsError("Property ".concat(prop, " accessed, but does not exist.") + ' If this is a function call, it will silently fail as a no-op.' + ' This needs to be fixed in the calling code.');
          return function () {/* intentionally empty */};
        }
        return function () {
          try {
            return target[prop].apply(target, arguments);
          } catch (e) {
            analyticsError(e);
          }
          return undefined;
        };
      }
    };
    window.adobeDataLayer = (_window$adobeDataLaye = window.adobeDataLayer) !== null && _window$adobeDataLaye !== void 0 ? _window$adobeDataLaye : [];
    instance = new Proxy(new AnalyticsADL(appName, window.adobeDataLayer), handler);

    // Add debug data to the data layer
    instance.updateDebugData();

    // Set the page-defaults
    instance.updatePageData({
      name: 'unknown',
      lineOfBusiness: 'unknown',
      classification: 'unknown',
      type: 'generic',
      lang: 'en',
      domain: window.location.hostname
    });
    instance.updatePageAccessInfo();
    var urlSearchParams = new URLSearchParams(window.location.search);
    instance.updateUrlParamsData(urlSearchParams);
    if (localStorage.getItem('adobeDataLayer.web.user')) {
      try {
        instance.updateUserData(JSON.parse(localStorage.getItem('adobeDataLayer.web.user')));
      } catch (e) {
        analyticsError(e);
      }
    }

    // Set up a listener
    window.addEventListener('load', function () {
      instance.updatePerformanceData();
    });
  }
  return instance;
}
;// ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
// EXTERNAL MODULE: ./node_modules/@babel/runtime/regenerator/index.js
var regenerator = __webpack_require__(756);
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator);
;// ./src/launch-utils/target-with-launch.js



var TARGET_HIDER_ID = 'sling-target-hider';
var TARGET_EVENT = 'slingTargetEvent';

/**
 * A a function to resolve the promise targetComplete, so that we can use this like jQuery.Deferred()
 * @type {function}
 */
var resolveTargetComplete;

/**
 * A promise that resolves when target is ready
 * @type {Promise<unknown>}
 */
var targetComplete = new Promise(function (resolve) {
  resolveTargetComplete = resolve;
});

/**
 * A promise that resolves when the dom is ready
 * @type {Promise<unknown>}
 */
var domReady = new Promise(function (resolve) {
  document.addEventListener('DOMContentLoaded', resolve);
});

/**
 * A promise that resolves when both domReady and targetComplete are resolved
 * @type {Promise<*[]>}
 */
var initReady = Promise.all([targetComplete, domReady]);

/**
 *
 * @param initFn
 * @param alwaysFn
 * @returns {Promise<void>}
 */
function initWithLaunch(_x, _x2) {
  return _initWithLaunch.apply(this, arguments);
}
function _initWithLaunch() {
  _initWithLaunch = _asyncToGenerator(/*#__PURE__*/regenerator_default().mark(function _callee2(initFn, alwaysFn) {
    return regenerator_default().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          document.addEventListener(TARGET_EVENT, /*#__PURE__*/function () {
            var _ref4 = _asyncToGenerator(/*#__PURE__*/regenerator_default().mark(function _callee(e) {
              var detail;
              return regenerator_default().wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    detail = e.detail;
                    if (!detail) {
                      _context.next = 5;
                      break;
                    }
                    _context.next = 4;
                    return initReady;
                  case 4:
                    initFn(detail);
                    // TODO should this be called?
                    // alwaysFn();
                  case 5:
                  case "end":
                    return _context.stop();
                }
              }, _callee);
            }));
            return function (_x9) {
              return _ref4.apply(this, arguments);
            };
          }());
          _context2.next = 3;
          return initReady;
        case 3:
          try {
            // TODO replace jquery usage
            initFn === null || initFn === void 0 ? void 0 : initFn($(document));
          } finally {
            alwaysFn === null || alwaysFn === void 0 ? void 0 : alwaysFn();
          }
        case 4:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _initWithLaunch.apply(this, arguments);
}
function findTarget(id) {
  var _target, _target$classList, _target$classList$con;
  var target = document.querySelector("#".concat(id));
  if ((_target = target) !== null && _target !== void 0 && (_target$classList = _target.classList) !== null && _target$classList !== void 0 && (_target$classList$con = _target$classList.contains) !== null && _target$classList$con !== void 0 && _target$classList$con.call(_target$classList, 'container--anchor-hack-child')) {
    target = target.closest('.container');
  }

  // TODO replace jquery usage
  return target ? $(target) : null;
}
function fetchContent(_x3) {
  return _fetchContent.apply(this, arguments);
}
function _fetchContent() {
  _fetchContent = _asyncToGenerator(/*#__PURE__*/regenerator_default().mark(function _callee3(url) {
    var processedUrl, res, newUrl, html, $html;
    return regenerator_default().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          processedUrl = url;
          if (!processedUrl.includes('.content.')) {
            processedUrl = processedUrl.slice(0, -5) + '.content.html';
          }
          _context3.next = 4;
          return fetch(processedUrl);
        case 4:
          res = _context3.sent;
          if (!res.redirected) {
            _context3.next = 11;
            break;
          }
          if (!(res.url !== processedUrl && res.url.includes(url.slice(0, -5) + '/') && !res.url.includes('.content.'))) {
            _context3.next = 11;
            break;
          }
          newUrl = res.url.slice(0, -5) + '.content.html';
          _context3.next = 10;
          return fetch(newUrl);
        case 10:
          res = _context3.sent;
        case 11:
          if (res.ok) {
            _context3.next = 13;
            break;
          }
          throw new Error("Status code ".concat(res.status, " received from requesting ").concat(res.url));
        case 13:
          _context3.next = 15;
          return res.text();
        case 15:
          html = _context3.sent;
          // TODO replace with non-jquery parsing
          $html = $(html);
          if ($html.length) {
            _context3.next = 19;
            break;
          }
          throw new Error("No content received from requesting ".concat(res.url));
        case 19:
          return _context3.abrupt("return", $html);
        case 20:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _fetchContent.apply(this, arguments);
}
function insertEFrag(_x4) {
  return _insertEFrag.apply(this, arguments);
}
function _insertEFrag() {
  _insertEFrag = _asyncToGenerator(/*#__PURE__*/regenerator_default().mark(function _callee4(_ref) {
    var url, before, after, id, location, $insertion, $insertTarget, $clone;
    return regenerator_default().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          url = _ref.url, before = _ref.before, after = _ref.after;
          id = before !== null && before !== void 0 ? before : after;
          location = before ? 'before' : 'after';
          _context4.next = 5;
          return fetchContent(url);
        case 5:
          $insertion = _context4.sent;
          _context4.next = 8;
          return domReady;
        case 8:
          $insertTarget = findTarget(id);
          $clone = $insertion.clone();
          if (!$insertTarget) {
            _context4.next = 13;
            break;
          }
          if (location === 'before') {
            $clone.insertBefore($insertTarget);
          } else {
            $clone.insertAfter($insertTarget);
          }
          return _context4.abrupt("return", $clone);
        case 13:
          return _context4.abrupt("return", null);
        case 14:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return _insertEFrag.apply(this, arguments);
}
function replaceEFrag(_x5) {
  return _replaceEFrag.apply(this, arguments);
}
function _replaceEFrag() {
  _replaceEFrag = _asyncToGenerator(/*#__PURE__*/regenerator_default().mark(function _callee5(_ref2) {
    var url, id, $replacement, $replaceTarget, $clone;
    return regenerator_default().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          url = _ref2.url, id = _ref2.replace;
          _context5.next = 3;
          return fetchContent(url);
        case 3:
          $replacement = _context5.sent;
          _context5.next = 6;
          return domReady;
        case 6:
          $replaceTarget = findTarget(id);
          $clone = $replacement.clone();
          if (!$replaceTarget) {
            _context5.next = 11;
            break;
          }
          $replaceTarget.replaceWith($clone);
          return _context5.abrupt("return", $clone);
        case 11:
          return _context5.abrupt("return", null);
        case 12:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return _replaceEFrag.apply(this, arguments);
}
function deleteContent(_x6) {
  return _deleteContent.apply(this, arguments);
}
function _deleteContent() {
  _deleteContent = _asyncToGenerator(/*#__PURE__*/regenerator_default().mark(function _callee6(_ref3) {
    var _document$querySelect3, _document$querySelect4;
    var id;
    return regenerator_default().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          id = _ref3["delete"];
          _context6.next = 3;
          return domReady;
        case 3:
          (_document$querySelect3 = document.querySelector("#".concat(id))) === null || _document$querySelect3 === void 0 ? void 0 : (_document$querySelect4 = _document$querySelect3.remove) === null || _document$querySelect4 === void 0 ? void 0 : _document$querySelect4.call(_document$querySelect3);
        case 4:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return _deleteContent.apply(this, arguments);
}
var targetFunctions = {
  'aem.insertEFrag': insertEFrag,
  'aem.replaceEFrag': replaceEFrag,
  'aem.deleteContent': deleteContent
};
function addTargetHider() {
  /* Use of document.write: javascript cannot locate the body until after this line has executed, and timeout/onload leaves potential for flicker */
  document.write("<style id=\"".concat(TARGET_HIDER_ID, "\" type=\"text/css\">body {visibility: hidden;}</style>"));
}
function removeTargetHider() {
  var _document$querySelect, _document$querySelect2;
  (_document$querySelect = document.querySelector("#".concat(TARGET_HIDER_ID))) === null || _document$querySelect === void 0 ? void 0 : (_document$querySelect2 = _document$querySelect.remove) === null || _document$querySelect2 === void 0 ? void 0 : _document$querySelect2.call(_document$querySelect);
}
function replaceTargetTestedComponents(_x7) {
  return _replaceTargetTestedComponents.apply(this, arguments);
}
function _replaceTargetTestedComponents() {
  _replaceTargetTestedComponents = _asyncToGenerator(/*#__PURE__*/regenerator_default().mark(function _callee8(propositions) {
    var results;
    return regenerator_default().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          results =
          // filter, to ensure it is only our mbox
          propositions.filter(function (prop) {
            return (prop === null || prop === void 0 ? void 0 : prop.scope) === 'sling-global-mbox';
          })
          // drill down into the data (next 2 lines)
          .flatMap(function (prop) {
            var _prop$items;
            return (_prop$items = prop === null || prop === void 0 ? void 0 : prop.items) !== null && _prop$items !== void 0 ? _prop$items : [];
          }).map(function (propItem) {
            var _propItem$data$conten, _propItem$data;
            return (_propItem$data$conten = propItem === null || propItem === void 0 ? void 0 : (_propItem$data = propItem.data) === null || _propItem$data === void 0 ? void 0 : _propItem$data.content) !== null && _propItem$data$conten !== void 0 ? _propItem$data$conten : {};
          })
          // split up each test type, so we can continue the chain
          .flatMap(function (tests) {
            return Object.entries(tests);
          })
          // split each test, so we can continue the chain
          .flatMap(function (_ref5) {
            var _ref6 = _slicedToArray(_ref5, 2),
              testType = _ref6[0],
              testData = _ref6[1];
            return testData.map(function (test) {
              return [targetFunctions[testType], test];
            });
          })
          // execute the target function on the test
          .map(function (_ref7) {
            var _ref8 = _slicedToArray(_ref7, 2),
              targetFn = _ref8[0],
              testData = _ref8[1];
            return targetFn === null || targetFn === void 0 ? void 0 : targetFn(testData);
          })
          // post-process, triggering the event to render any react components.
          .map(/*#__PURE__*/function () {
            var _ref9 = _asyncToGenerator(/*#__PURE__*/regenerator_default().mark(function _callee7($resultPromise) {
              var $result;
              return regenerator_default().wrap(function _callee7$(_context7) {
                while (1) switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.next = 2;
                    return $resultPromise;
                  case 2:
                    $result = _context7.sent;
                    if ($result) {
                      document.dispatchEvent(new CustomEvent('slingTargetInsert', {
                        detail: $result
                      }));
                    }
                  case 4:
                  case "end":
                    return _context7.stop();
                }
              }, _callee7);
            }));
            return function (_x10) {
              return _ref9.apply(this, arguments);
            };
          }()); // Wait until they are all done
          _context8.next = 3;
          return Promise.allSettled(results);
        case 3:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return _replaceTargetTestedComponents.apply(this, arguments);
}
var sanityCheckTime = 3000;
function executeWithLaunch(_x8) {
  return _executeWithLaunch.apply(this, arguments);
}
function _executeWithLaunch() {
  _executeWithLaunch = _asyncToGenerator(/*#__PURE__*/regenerator_default().mark(function _callee10(alloyTargetTest) {
    var alloyPromise, sanityCheck, promises, _yield$Promise$race, propositions;
    return regenerator_default().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          alloyPromise = alloyTargetTest.promise;
          addTargetHider();
          _context10.prev = 2;
          sanityCheck = new Promise(/*#__PURE__*/function () {
            var _ref10 = _asyncToGenerator(/*#__PURE__*/regenerator_default().mark(function _callee9(_, reject) {
              var rejectFn;
              return regenerator_default().wrap(function _callee9$(_context9) {
                while (1) switch (_context9.prev = _context9.next) {
                  case 0:
                    _context9.next = 2;
                    return domReady;
                  case 2:
                    rejectFn = function rejectFn() {
                      return reject(new Error('alloy took too long, bailing out'));
                    };
                    setTimeout(rejectFn, sanityCheckTime);
                  case 4:
                  case "end":
                    return _context9.stop();
                }
              }, _callee9);
            }));
            return function (_x11, _x12) {
              return _ref10.apply(this, arguments);
            };
          }());
          promises = [];
          if (alloyPromise) {
            promises.push(alloyPromise);
            promises.push(sanityCheck);
          } else {
            console.warn('Alloy JS did not');
            promises.push(domReady);
          }
          _context10.next = 8;
          return Promise.race(promises);
        case 8:
          _yield$Promise$race = _context10.sent;
          propositions = _yield$Promise$race.propositions;
          if (!propositions) {
            _context10.next = 13;
            break;
          }
          _context10.next = 13;
          return replaceTargetTestedComponents(propositions);
        case 13:
          _context10.next = 18;
          break;
        case 15:
          _context10.prev = 15;
          _context10.t0 = _context10["catch"](2);
          // eslint-disable-next-line no-console
          console.error(_context10.t0);
        case 18:
          _context10.prev = 18;
          // trigger target ready
          resolveTargetComplete();
          removeTargetHider();
          return _context10.finish(18);
        case 22:
        case "end":
          return _context10.stop();
      }
    }, _callee10, null, [[2, 15, 18, 22]]);
  }));
  return _executeWithLaunch.apply(this, arguments);
}
;// ./src/index.js



var _window$slingUtils, _slingUtils$lazy, _lazyUtil$registerCom, _map$map$filter$map, _window$slingUtils2;




// Intentionally not using default export, to force clients to fix themselves
/**
 * Get an instance of AnalyticsADL
 *
 * @type {function(string): AnalyticsADL}
 */
// eslint-disable-next-line import/prefer-default-export
var getAnalyticsInstance = getInstance;

/* slingUtils setup */
window.slingUtils = (_window$slingUtils = window.slingUtils) !== null && _window$slingUtils !== void 0 ? _window$slingUtils : {};
var slingUtils = window.slingUtils;
window.slingUtils.lazy = (_slingUtils$lazy = slingUtils.lazy) !== null && _slingUtils$lazy !== void 0 ? _slingUtils$lazy : {};
var lazyUtil = window.slingUtils.lazy;
window.slingUtils.lazy.registerComponent = (_lazyUtil$registerCom = lazyUtil === null || lazyUtil === void 0 ? void 0 : lazyUtil.registerComponent) !== null && _lazyUtil$registerCom !== void 0 ? _lazyUtil$registerCom : function registerComponent() {};

/*
    lazy.js
*/

/**
 * Do Next:
 * Ratchet down safe load distance
 * Re-evaluate queue order every `k` times
 * Move lazy image handling in here
 * Package cards use js to lazy images again
 *
 * Ideas:
 * LazyLoad non-components (e.g. analytics)
 * Critical vs Non Critical
 * `nice` concept
 * `bored` - replace lazy images w/ not lazy images
 */

var queue = [];
var lastQueue = [];
var reactLibs = [];
var hasReactLibs = false;
var reactLibsInitialized = false;
var hash = (_map$map$filter$map = _toConsumableArray(document.querySelectorAll('script')).map(function (script) {
  return script.src;
}).map(function (src) {
  return /\/etc.clientlibs\/sling-tv\/clientlibs\/reactlibs\/utils\.min\.(.*)\.js/.exec(src);
}).filter(function (res) {
  return res === null || res === void 0 ? void 0 : res.length;
}).map(function (res) {
  return res === null || res === void 0 ? void 0 : res[1];
})) === null || _map$map$filter$map === void 0 ? void 0 : _map$map$filter$map[0];

/**
 * @private
 *
 * TODO: Remove dependence on jQuery
 */
function fetchReact() {
  if (!window.$) {
    setTimeout(fetchReact, 1);
    return;
  }
  var script = document.createElement('script');
  script.src = "/etc.clientlibs/sling-tv/clientlibs/reactlibs/react.".concat(hash, ".js");
  script.type = 'text/javascript';
  document.getElementsByTagName('head')[0].appendChild(script);
}

/**
 * @private
 *
 * @param {string} libName
 */
function fetchReactLib(libName) {
  if (!window.React || !window.ReactDOM) {
    setTimeout(function () {
      return fetchReactLib(libName);
    }, 1);
    return;
  }
  if (reactLibs.includes(libName)) {
    return;
  }
  reactLibs.push(libName);
  var script = document.createElement('script');
  script.src = "/etc.clientlibs/sling-tv/clientlibs/reactlibs/".concat(libName, ".").concat(hash, ".js");
  script.type = 'text/javascript';
  document.getElementsByTagName('head')[0].appendChild(script);
}

/**
 * Execute callbacks in last queue in order
 */
function executeLastQueue() {
  while (lastQueue && lastQueue.length) {
    var call = lastQueue.shift();
    if (typeof call === 'function') {
      call();
    }
  }
}

/**
 * @private
 *
 * Do the next component in the queue
 */
function next() {
  var component = queue.pop();
  if (!component) {
    if (!hasReactLibs || reactLibsInitialized) {
      // Only execute the last queue if react components have loaded (and not just kicked off AJAX)
      executeLastQueue();
    }
    return; // Done
  }
  if (!$(document).find(component.element)) {
    setTimeout(next, 1);
    return; // Doesn't exist anymore
  }
  setTimeout(function () {
    try {
      component.initFunction($(component.element));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
    next();
  }, 1);
}

/**
 * Sorts components by visible, rect.top, rect.left
 *
 * @param a
 * @param b
 */
function sortComponents(a, b) {
  if (a.visible == b.visible) {
    if (a.rect.top == b.rect.top) {
      return b.rect.left - a.rect.left;
    }
    return b.rect.top - a.rect.top;
  }
  if (a.visible) {
    return 1;
  }
  return -1;
}
var LazyScheduler = /*#__PURE__*/function () {
  function LazyScheduler() {
    _classCallCheck(this, LazyScheduler);
  }
  return _createClass(LazyScheduler, [{
    key: "registerComponent",
    value:
    /**
     * Register a classic-style component
     *
     * @param {string} className - The CSS class to look for (prepends `js-`)
     * @param {function} initFunction - The function to initialize the component.  Called as `initFunction($(element))`.
     */
    // eslint-disable-next-line class-methods-use-this
    function registerComponent(className, initFunction) {
      window.slingUtils.abTest.initWithTarget(function (root) {
        var list = root.find('.js-' + className).toArray();
        if (!list.length) {
          return;
        }
        queue.push.apply(queue, _toConsumableArray(list.map(function (element) {
          return {
            element: element,
            initFunction: initFunction,
            rect: element.getBoundingClientRect(),
            visible: $(element).is(':visible')
          };
        })));
        queue.sort(sortComponents);
        next();
      });
    }

    /**
     * Schedule a function after all components are lazy loaded
     *
     * @param {function} callback
     */
    // eslint-disable-next-line class-methods-use-this
  }, {
    key: "loadLast",
    value: function loadLast(callback) {
      lastQueue.push(callback);
      next();
    }

    /**
     * Register a react-style component
     *
     * TODO: Remove dependence on jQuery
     *
     * @param {string} className - The CSS class to look for (prepends `js-react-`)
     * @param {function} initFunction - The function to initialize the component.  Called as `initFunction(element, data)`.
     */
  }, {
    key: "registerReact",
    value: function registerReact(className, _initFunction) {
      var _this = this;
      if (!window.$) {
        setTimeout(function () {
          return _this.registerReact(className, _initFunction);
        }, 1);
        return;
      }
      window.slingUtils.abTest.initWithTarget(function (root) {
        var list = root.find('.js-react-' + className).toArray();
        if (!list.length) {
          return;
        }
        hasReactLibs = true;
        if (typeof _initFunction === 'string') {
          fetchReactLib(_initFunction);
          return;
        }
        queue.push.apply(queue, _toConsumableArray(list.map(function (element) {
          return {
            element: element,
            initFunction: function initFunction() {
              if (element.dataset.slingDataPath) {
                $.ajax('/bin/page/contentservice.json' + element.dataset.slingDataPath, {
                  success: function success(data) {
                    _initFunction(element, data);
                    reactLibsInitialized = true;
                  }
                });
              } else {
                _initFunction(element, element.dataset);
                reactLibsInitialized = true;
              }
            },
            rect: element.getBoundingClientRect(),
            visible: $(element).is(':visible')
          };
        })));
        queue.sort(sortComponents);
        next();
      });
    }
  }]);
}(); // All pages have react, but still fetching w/ jQuery for async
fetchReact();
var lazy = new LazyScheduler();

/**
 * Downloads the appropriate clientlib when the CSS class is on the page
 * @type {string[]}
 */
var componentList = ['account-form', 'account-promo-code', 'action-component', 'activate', 'anchor-arrow', 'available-on-device-ribbon', 'banner', 'base-service-cards', 'billing-history', 'bin-cards', 'browser-player-cart-redirect', 'cancel-flow-feedback', 'cancel-flow-qualtrics-feedback', 'cancel-flow-sub-reason', 'cancel-form', 'cancel-subscription-button', 'carousel', 'ccpa-preference', 'change-password-modal', 'change-password', 'channel-details', 'channel-shopper', 'channels', 'chat', 'checkout-form-and-ledger', 'checkout-subscription-summary', 'classification-selector', 'confirmation', 'current-subscription-ledger', 'custom-embed-component', 'customer-feedback-survey', 'device-list', 'display-preference', 'dynamic-offer-ac', 'dynamic-offer', 'email-capture', 'error-message', 'extend-with-bitpay', 'faq', 'feedback-tab', 'footer', 'forgot-password', 'forgot-username', 'franchise-details', 'gamefinder', 'gift-card', 'global-search', 'google-handoff', 'graphql-client', 'header', 'highlight-banner', 'homepage-base-cards', 'ledger', 'ledgerized-checkout-button-persistent', 'loading-spinner', 'locals-aware', 'locals', 'manage-subscription-ledger', 'manage-subscription-ledger-v2', 'marquee-template', 'offer-card-template', 'offer-cards', 'one-change-at-a-time', 'ota-component', 'package-cards', 'package-optimizer', 'pause-subscription-button', 'pause-subscription-form', 'pay-per-view', 'payment-information', 'personal-info', 'predictive-search-bar', 'predictive-search', 'preference-center', 'progress-bar', 'qualtrics-cancel-survey', 'redirect', 'refer-a-friend-v2', 'regional-price-message-box', 'reset-password', 'rich-text', 'search', 'select-markets-modal', 'service-cards-base-pack', 'service-cards-base-pack-v2', 'service-cards-full-page-loader', 'service-cards-dvr', 'service-cards-extra', 'service-cards-hbo', 'service-cards-header-main', 'service-cards-header-step', 'service-cards-ledger-cta', 'service-cards-nba', 'service-cards-popular-shelf', 'service-cards-premium', 'service-tiles', 'signout-of-all-devices', 'simplified-homepage', 'sling-diagnostics', 'sling-rewards-info', 'spacer', 'sports', 'standalone-content-explorer', 'store-locator', 'success-message', 'tabbed-faq', 'view-all-channels', 'winback', 'year-in-review', 'zip-accuracy', 'zip-collection', 'zip-locals-banner', 'zip-locals'];
// list of commerce components implemented with apolloclient
var commerceComponents = ['account-form', 'account-promo-code', 'action-component', 'base-service-cards', 'billing-history', 'cancel-flow-feedback', 'cancel-flow-qualtrics-feedback', 'cancel-flow-sub-reason', 'cancel-form', 'cancel-subscription-button', 'ccpa-preference', 'checkout-form-and-ledger', 'checkout-subscription-summary', 'confirmation', 'current-subscription-ledger', 'customer-feedback-survey', 'device-list', 'display-preference', 'forgot-password', 'gamefinder', 'gift-card', 'google-handoff', 'header', 'homepage-base-cards', 'ledger', 'manage-subscription-ledger', 'manage-subscription-ledger-v2', 'package-cards', 'pause-subscription-button', 'pause-subscription-form', 'pay-per-view', 'payment-information', 'personal-info', 'preference-center', 'refer-a-friend-v2', 'rich-text', 'service-cards-base-pack', 'service-cards-base-pack-v2', 'service-cards-dvr', 'service-cards-extra', 'service-cards-hbo', 'service-cards-ledger-cta', 'service-cards-nba', 'service-cards-popular-shelf', 'service-cards-premium', 'signout-of-all-devices', 'winback', 'zip-locals-banner'];

// List of all V2 components that need to fallback to the Legacy version,
// (these should also be listed commerceComponents)
var acV2List = ['js-react-manage-subscription-ledger-v2', 'js-react-service-cards-base-pack-v2'];
var componentSet = new Set(componentList);
var commerceComponentsSet = new Set(commerceComponents);
function init() {
  var acEnabledForThisPage = true; // auto set true for Adobe Edge

  // Fallback to legacy for V2 components
  if (!acEnabledForThisPage && document.querySelectorAll('[class*="-v2"]')) {
    acV2List.forEach(function (className) {
      var elements = document.querySelectorAll(".".concat(className));
      elements.forEach(function (element) {
        var legacy = className.slice(0, -3);
        element.classList.remove(className);
        element.classList.add(legacy);
      });
    });
  }

  // get all react components in the order they appear on the page
  var list = Array.from(document.querySelectorAll('.js-react'));
  var filterComponentsReducer = function filterComponentsReducer(acc, component) {
    if (componentSet.has(component) && !acc.map[component]) {
      acc.map[component] = true;
      acc.ordered.push(component);
    }
    return acc;
  };

  // sanitize, dedupe, and filter list of component names
  var filteredComponents = list.map(function (e) {
    var _e$className$match;
    return (_e$className$match = e.className.match(/js-react-([0-9a-zA-Z-]*)/)) === null || _e$className$match === void 0 ? void 0 : _e$className$match[1];
  }).reduce(filterComponentsReducer, {
    map: {},
    ordered: []
  });
  var sortedComponents = componentList.reduce(filterComponentsReducer, filteredComponents).ordered;
  sortedComponents.forEach(function (className) {
    var libName = className;
    if (acEnabledForThisPage && commerceComponentsSet.has(className)) {
      libName = "".concat(className, "-adobe-commerce");
    }
    lazy.registerReact(className, libName);
  });
  window.slingUtils.lazy = lazy || {};
}
init();

/* 
    analytics.js
 */

// allow always for Adobe Edge
window.useAcFeatures = 'always';
var isCommerceEnabledForThisPageLoad = function isCommerceEnabledForThisPageLoad() {
  return window.useAcFeatures === 'always';
  //|| (window.useAcFeatures === 'conditionally' && isCommerceSessionValid());   <----- checking commerce session disabled
};
var analytics = getAnalyticsInstance('aem-marketing-site');

// TODO move to a common location?
var classifications = {
  arabic: 'arabic',
  bangla: 'bangla',
  bengali: 'bengali',
  brazilian: 'brazilian',
  cantonese: 'cantonese',
  caribe: 'caribe',
  centroamerica: 'centroamerica',
  espana: 'espana',
  french: 'french',
  german: 'german',
  greek: 'greek',
  hindi: 'hindi',
  internationalSports: 'international-sports',
  italian: 'italian',
  kannada: 'kannada',
  latino: 'latino',
  malayalam: 'malayalam',
  mandarin: 'mandarin',
  mexico: 'mexico',
  marathi: 'marathi',
  polish: 'polish',
  punjabi: 'punjabi',
  sudamerica: 'sudamerica',
  taiwanese: 'taiwanese',
  tamil: 'tamil',
  telugu: 'telugu',
  urdu: 'urdu',
  us: 'us',
  vietnamese: 'vietnamese',
  worldCricket: 'world-cricket'
};
function getPageData() {
  var pathname = window.location.pathname;
  var isHomePage = pathname === '/';
  var data = {
    name: isHomePage ? 'home' : pathname
  };
  if (isHomePage) {
    data.type = 'home';
    data.lineOfBusiness = 'domestic';
    data.classification = 'us';
  } else {
    var firstDir = pathname.split('/')[1];
    if (firstDir.includes('account')) {
      data.type = 'account';
    } else if (firstDir.includes('latino')) {
      data.lineOfBusiness = 'latino';
    } else if (firstDir.includes('whatson')) {
      data.type = 'blog';
    } else if (firstDir.includes('help')) {
      data.type = 'help';
    } else if (firstDir.includes('international')) {
      data.lineOfBusiness = 'international';
    } else {
      data.lineOfBusiness = 'domestic';
    }
    data.classification = Object.values(classifications).find(function (val) {
      return pathname.includes(val);
    });
    if (pathname.includes('cricket') && !pathname.includes('world-cricket')) {
      data.classification = classifications.worldCricket;
    }
  }
  return data;
}
setTimeout(function () {
  var _document$querySelect;
  var data = getPageData();
  var skipAnalytics = !!document.querySelector('.skipAnalytics');
  var cancelStep = ((_document$querySelect = document.querySelector('meta[name="cancel-step"]')) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.content) || 'screen_load';
  window.slingUtils.lazy.loadLast(function () {
    if (!skipAnalytics) {
      if (cancelStep !== 'screen_load') {
        console.log('STEP EVENT');
        analytics.step(cancelStep, data);
      } else {
        console.log('SCREEN LOAD EVENT');
        analytics.screenLoad(data);
      }
    }
  });
}, 0);

/* 
    init-target.js
 */

window.slingUtils = (_window$slingUtils2 = window.slingUtils) !== null && _window$slingUtils2 !== void 0 ? _window$slingUtils2 : {};
slingUtils.abTest = {};
var abTest = slingUtils.abTest;
abTest.initWithTarget = initWithLaunch;
var alloyTargetTest = {
  promise: null,
  resolve: function resolve() {/* intentional empty */},
  reject: function reject() {/* intentional empty */}
};
alloyTargetTest.promise = new Promise(function (resolve, reject) {
  alloyTargetTest.resolve = resolve;
  alloyTargetTest.reject = reject;
});
window.alloyTargetTest = alloyTargetTest;

// TODO Investigate this required method.
executeWithLaunch(window.alloyTargetTest);

// SlingAnalytics is for externalization in webpack and must exist with this exact name
window.SlingAnalytics = {
  getAnalyticsInstance: getAnalyticsInstance
};
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});