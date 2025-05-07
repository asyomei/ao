import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware((ctx, next) => {
  // wtf chromium
  if (ctx.url.pathname.startsWith('/.well-known/appspecific/com.chrome.devtools')) {
    return new Response(null, { status: 204 })
  }

  return next()
})
