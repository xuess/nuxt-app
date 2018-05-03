importScripts('/_nuxt/workbox.3de3418b.js')

const workboxSW = new self.WorkboxSW({
  "cacheId": "nuxt-app",
  "clientsClaim": true,
  "directoryIndex": "/"
})

workboxSW.precache([
  {
    "url": "/_nuxt/app.d8e44789f29d0246af5b.js",
    "revision": "e18b4054c0fd179b6694c4e07ffcd059"
  },
  {
    "url": "/_nuxt/layouts/default.668d6631c86602d38e3a.js",
    "revision": "7ca8508fbc8ea19e9b4611fbf887134b"
  },
  {
    "url": "/_nuxt/manifest.cb9f395ee19ca8a6c0cc.js",
    "revision": "6375b935eacfea77c41d7f36e94b31c2"
  },
  {
    "url": "/_nuxt/pages/aaa.b1430506407b86061b8b.js",
    "revision": "d53fbda7e9923081c7a8e7113510c7a0"
  },
  {
    "url": "/_nuxt/pages/act/index.d5133f0c1e1f5d784d50.js",
    "revision": "9b4ee996ae890fd269ee77d533ad9944"
  },
  {
    "url": "/_nuxt/pages/index.e8d721a91fd429dbedab.js",
    "revision": "149cf7f3bf4f97c2df2a6ec6ce420acb"
  },
  {
    "url": "/_nuxt/pages/index2.80b50bff67d718e1098e.js",
    "revision": "9d39bd3692f91bc3ef3126286051a342"
  },
  {
    "url": "/_nuxt/vendor.f4802afae0ac0608d802.js",
    "revision": "febb7a0fe1112b5f2018c729b5dffa8c"
  }
])


workboxSW.router.registerRoute(new RegExp('/_nuxt/.*'), workboxSW.strategies.cacheFirst({}), 'GET')

workboxSW.router.registerRoute(new RegExp('/.*'), workboxSW.strategies.networkFirst({}), 'GET')

