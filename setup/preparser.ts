import { definePreparserSetup } from '@slidev/types'

export default definePreparserSetup(() => {
  return [
    {
      transformRawLines(lines) {
        let i = 0
        while (i < lines.length) {
          const l = lines[i]
          let citations = l.match(/\[\@[^\]]*\]/g)
	        if (citations) {
            let lnew = l
	          for ( let cit of citations) {
              lnew = lnew.replace(cit, "<Cite bref=\""+cit.slice(2,-1) + "\" />")
	          }
            lines[i] = lnew;
            continue
	        }
        i++
        }
      }
    },
  ]
})




