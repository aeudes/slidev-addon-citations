import { defineConfig } from 'vite'

export default defineConfig({
    optimizeDeps: {
     include: [ '@citation-js/core > @citation-js/date','@citation-js/core > @citation-js/name','@citation-js/plugin-csl > citeproc','moo'],//,'@citation-js/name','@citation-js/date'],// 'fetch-ponyfill','moo','sync-fetch' ], //, 'sync-fetch','fetch-ponyfill','moo'],
     //include: [ '@citation-js/name','citeproc','@citation-js/date', 'fetch-ponyfill','moo','sync-fetch' ], //, 'sync-fetch','fetch-ponyfill','moo'],
    // exclude: ['@citation-js/core']
  },
})
