"use strict";var precacheConfig=[["/timer-loop/index.html","1670081feb710ba30397d7b746808b60"],["/timer-loop/static/css/main.a420b1fd.css","171d7dad4cbf0bdbc7706cb965f669fe"],["/timer-loop/static/js/main.92e9f08c.js","b278d94fef462105af8aed759cbc7674"],["/timer-loop/static/media/bell.995017a2.mp3","995017a25d43e5f866904efa32b1d6ec"],["/timer-loop/static/media/bellx2.f5768095.mp3","f5768095e060c86c0a20afd02c96597f"],["/timer-loop/static/media/edit.eb9cee0e.svg","eb9cee0e7537ce82a5a526f1f1d3f09a"],["/timer-loop/static/media/pause.31b7654b.svg","31b7654bf5c122deacf4bec6c4a62029"],["/timer-loop/static/media/play.1cc909e8.svg","1cc909e8daccf720d5ec3688694f4185"],["/timer-loop/static/media/plus.be9a8c9e.svg","be9a8c9e2c5b045fc26e11cdf6860c69"],["/timer-loop/static/media/save.e27ab5a5.svg","e27ab5a5c8e1b0c78ff015f4a8fa17d6"],["/timer-loop/static/media/step-backward.6a33ae2d.svg","6a33ae2dfd7aa53a1b85c2a93e29dbc1"],["/timer-loop/static/media/step-forward.7e131474.svg","7e131474929f9c109a49fcc3f0b0c9bd"],["/timer-loop/static/media/stop.d4d69ca3.svg","d4d69ca38b25f29e1f3ea2a4fad2666a"],["/timer-loop/static/media/times-circle.6832fc6d.svg","6832fc6da443cf11654ee34291e334e0"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,t){var a=new URL(e);return"/"===a.pathname.slice(-1)&&(a.pathname+=t),a.toString()},cleanResponse=function(t){return t.redirected?("body"in t?Promise.resolve(t.body):t.blob()).then(function(e){return new Response(e,{headers:t.headers,status:t.status,statusText:t.statusText})}):Promise.resolve(t)},createCacheKey=function(e,t,a,r){var n=new URL(e);return r&&n.pathname.match(r)||(n.search+=(n.search?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(a)),n.toString()},isPathWhitelisted=function(e,t){if(0===e.length)return!0;var a=new URL(t).pathname;return e.some(function(e){return a.match(e)})},stripIgnoredUrlParameters=function(e,a){var t=new URL(e);return t.hash="",t.search=t.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(t){return a.every(function(e){return!e.test(t[0])})}).map(function(e){return e.join("=")}).join("&"),t.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var t=e[0],a=e[1],r=new URL(t,self.location),n=createCacheKey(r,hashParamName,a,/\.\w{8}\./);return[r.toString(),n]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(r){return setOfCachedUrls(r).then(function(a){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(t){if(!a.has(t)){var e=new Request(t,{credentials:"same-origin"});return fetch(e).then(function(e){if(!e.ok)throw new Error("Request for "+t+" returned a response with status "+e.status);return cleanResponse(e).then(function(e){return r.put(t,e)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var a=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(t){return t.keys().then(function(e){return Promise.all(e.map(function(e){if(!a.has(e.url))return t.delete(e)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(t){if("GET"===t.request.method){var e,a=stripIgnoredUrlParameters(t.request.url,ignoreUrlParametersMatching),r="index.html";(e=urlsToCacheKeys.has(a))||(a=addDirectoryIndex(a,r),e=urlsToCacheKeys.has(a));var n="/timer-loop/index.html";!e&&"navigate"===t.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],t.request.url)&&(a=new URL(n,self.location).toString(),e=urlsToCacheKeys.has(a)),e&&t.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(a)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(e){return console.warn('Couldn\'t serve response for "%s" from cache: %O',t.request.url,e),fetch(t.request)}))}});