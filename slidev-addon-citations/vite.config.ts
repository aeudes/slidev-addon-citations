import { defineConfig } from 'vite'

export default defineConfig({
    optimizeDeps: {
     include: [ '@citation-js/core > @citation-js/date','@citation-js/core > @citation-js/name','@citation-js/plugin-csl > citeproc','moo','sync-fetch','fetch-ponyfill','slidev-addon-citations > @citation-js/name','slidev-addon-citations > @citation-js/date','slidev-addon-citations > citeproc','slidev-addon-citations > fetch-ponyfill','slidev-addon-citations > sync-fetch','slidev-addon-citations > moo'],//,'@citation-js/name','@citation-js/date'],// 'fetch-ponyfill','moo','sync-fetch' ],
     //include: [ '@citation-js/name','citeproc','@citation-js/date', 'fetch-ponyfill','moo','sync-fetch' ], //, 'sync-fetch','fetch-ponyfill','moo'],
    // exclude: ['@citation-js/core']
  },
})
