if(!self.define){let e,i={};const s=(s,c)=>(s=new URL(s+".js",c).href,i[s]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=i,document.head.appendChild(e)}else e=s,importScripts(s),i()})).then((()=>{let e=i[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(c,a)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(i[n])return;let t={};const r=e=>s(e,n),f={module:{uri:n},exports:t,require:r};i[n]=Promise.all(c.map((e=>f[e]||r(e)))).then((e=>(a(...e),t)))}}define(["./workbox-07a7b4f2"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"e652a589a8376487a9c1a0e9318edb16"},{url:"/_next/static/chunks/139.fe45b3ace6e64ab4.js",revision:"fe45b3ace6e64ab4"},{url:"/_next/static/chunks/5860-aea608d4781487de.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/6648-a69e7e4aaa14f364.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/7023-02f4dfbe295f8ef2.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/8100-427847e01361435e.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/8275-be34a04092b265c4.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/8635-d5937fb1f2da42b8.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/8762-829f1be55fc2d4e4.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/8e1d74a4-540ff64f03d7b55a.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/9118-ddbc9ab99be32655.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/998-55f61abd1200d00a.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/app/_not-found/page-3925aec3d46c50a4.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/app/layout-55e70f9ca7aa9aa4.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/app/modificar-solicitud-cliente/%5Bid_solicitud%5D/page-f8c118463f38a6b2.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/app/modificar-solicitud-cliente/page-f4df3f0fcef49e40.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/app/page-52102600d87ef50b.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/app/perfil/page-11731dc361952cc0.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/app/plataforma-especialista/page-64ecbf01e385681d.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/app/plataforma/page-70288bd6cfe14d3b.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/app/registro-de-especialista/page-1c7bc1ee6619de26.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/app/registro-de-solicitudes/%5Bcategoria%5D/page-0eb678b40f0a4ba4.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/app/registro-de-solicitudes/page-cbb999e885269fd9.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/app/registro-quejas/page-9fef22378aff2edf.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/app/registro/page-9ddfca35b2dfc1d4.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/app/valoracion-cliente/%5Bid_solicitud%5D/page-a3bda8a1d7cd2c8e.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/app/valoracion-cliente/page-752d9f706c87c204.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/app/valoracion-especialista/%5Bid_solicitud%5D/page-9ee1cea0658e7e87.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/app/valoracion-especialista/page-092b21ca11e041cd.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/app/visualizacion-ofertas/%5Bid_oferta%5D/page-7c2dfe7bf2b341aa.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/app/visualizacion-ofertas/page-5ccda3b6e9417ce1.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/app/visualizacion-solicitud-proceso-cliente/%5Bid_solicitud%5D/page-478ede3a4e2ff9d1.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/app/visualizacion-solicitud-proceso-cliente/page-4aa65b12bf9eae50.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/app/visualizacion-solicitud-proceso-especialista/%5Bid_solicitud%5D/page-7832704d77765f15.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/app/visualizacion-solicitud-proceso-especialista/page-fd16ba8f66c19751.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/app/visualizacion-solicitudes-especialista/page-b258a6216a262d9a.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/app/visualizacion-solicitudes/page-17467b81800823fd.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/d0deef33-bf2197886ef04671.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/fd9d1056-8fd6bfc843bcfa60.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/framework-8e0e0f4a6b83a956.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/main-6eb988579038b653.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/main-app-ce0d3b436282914f.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/pages/_app-f870474a17b7f2fd.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/pages/_error-c66a4e8afc46f17b.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/_next/static/chunks/webpack-b99d598fd7c8b6e9.js",revision:"u03cFimXZqOXQxmjlH-ef"},{url:"/_next/static/css/2f71e0d51b6954c9.css",revision:"2f71e0d51b6954c9"},{url:"/_next/static/css/4ac522a26d1150c4.css",revision:"4ac522a26d1150c4"},{url:"/_next/static/css/60477c4ae6c6b930.css",revision:"60477c4ae6c6b930"},{url:"/_next/static/css/800215bb8ce49402.css",revision:"800215bb8ce49402"},{url:"/_next/static/css/9cbe6bf69e3f9cef.css",revision:"9cbe6bf69e3f9cef"},{url:"/_next/static/css/b26a1f6328a29379.css",revision:"b26a1f6328a29379"},{url:"/_next/static/css/ba6811bfcf65204a.css",revision:"ba6811bfcf65204a"},{url:"/_next/static/css/d3df112486f97f47.css",revision:"d3df112486f97f47"},{url:"/_next/static/media/05a31a2ca4975f99-s.woff2",revision:"f1b44860c66554b91f3b1c81556f73ca"},{url:"/_next/static/media/513657b02c5c193f-s.woff2",revision:"c4eb7f37bc4206c901ab08601f21f0f2"},{url:"/_next/static/media/51ed15f9841b9f9d-s.woff2",revision:"bb9d99fb9bbc695be80777ca2c1c2bee"},{url:"/_next/static/media/c9a5bc6a7c948fb0-s.p.woff2",revision:"74c3556b9dad12fb76f84af53ba69410"},{url:"/_next/static/media/d6b16ce4a6175f26-s.woff2",revision:"dd930bafc6297347be3213f22cc53d3e"},{url:"/_next/static/media/ec159349637c90ad-s.woff2",revision:"0e89df9522084290e01e4127495fae99"},{url:"/_next/static/media/fd4db3eb5472fc27-s.woff2",revision:"71f3fcaf22131c3368d9ec28ef839831"},{url:"/_next/static/media/layers-2x.9859cd12.png",revision:"9859cd12"},{url:"/_next/static/media/layers.ef6db872.png",revision:"ef6db872"},{url:"/_next/static/media/marker-icon.d577052a.png",revision:"d577052a"},{url:"/_next/static/u03cFimXZqOXQxmjlH-ef/_buildManifest.js",revision:"3e2d62a10f4d6bf0b92e14aecf7836f4"},{url:"/_next/static/u03cFimXZqOXQxmjlH-ef/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/buscar.png",revision:"5a49bb5009043edee76253a68dd0b515"},{url:"/calificar.png",revision:"8787cc5e69e003523798835d36cdbdb1"},{url:"/icons/android-chrome-192x192.png",revision:"cceed453c2f287b32f40f0189a2ec4f6"},{url:"/icons/android-chrome-256x256.png",revision:"4cf8e4771d1d66663f957eee3b528af6"},{url:"/icons/apple-touch-icon.png",revision:"9be6a7286804e2d43125c938ca510379"},{url:"/icons/browserconfig.xml",revision:"68c9044fa4a08749efb85bb2a4edaede"},{url:"/icons/favicon-16x16.png",revision:"83794b62d068c9a02692c8eee5dbfdee"},{url:"/icons/favicon-32x32.png",revision:"11ff762eb623f969cc70ff05ffa7586e"},{url:"/icons/favicon.ico",revision:"63a7b3dbe6f56a25516c3be0d4372d04"},{url:"/icons/icon-144x144.png",revision:"cceed453c2f287b32f40f0189a2ec4f6"},{url:"/icons/mstile-150x150.png",revision:"cf4ac82d846e8726bbe2ac761a490059"},{url:"/icons/safari-pinned-tab.svg",revision:"effde286af3c20388936bea1105b6ead"},{url:"/icons/site.webmanifest",revision:"a924998e01926bb4188583fc8835471b"},{url:"/inicio/inicio.jpg",revision:"7837d26c5d87b14cd919a7511ac260e2"},{url:"/inicio/video.mp4",revision:"b0841f69e40c8c426938044f9d0a6008"},{url:"/login/bg-1.jpg",revision:"29ba73e3f49f16f69d7f510f38c473a4"},{url:"/logo_work.png",revision:"8df42e7ad2ca33119e28addf1bf7b75d"},{url:"/manifest.json",revision:"95084831e4600252bfa5f382917c38b8"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/profile.png",revision:"338715d97933a815340992b879f843b2"},{url:"/terminada.png",revision:"83130a8382fd432967072ac1db72dd8c"},{url:"/trabajando.png",revision:"f8a1f2f4a26d3272643c63c926583c3d"},{url:"/vercel.svg",revision:"61c6b19abff40ea7acd577be818f3976"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:i,event:s,state:c})=>i&&"opaqueredirect"===i.type?new Response(i.body,{status:200,statusText:"OK",headers:i.headers}):i}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const i=e.pathname;return!i.startsWith("/api/auth/")&&!!i.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
