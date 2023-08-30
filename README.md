### slidev-addon-citations   

Add bibliography and citation features for Slidev
PowerBy <img alt="Citation.js" src="https://citation.js.org/favicon.png" />[citation-js](https://citation.js.org)


The addon allows Json and Bibtex input bibliography by default.
An example is provided in this repository (see citations-addon-exemple.md)

# Install   
You only need to add "slidev-addon-citations" in the addon section of the frontmatter of your presentation

```
addons:
- slidev-addon-citations
```

Configuration is done in the presentation configuration (frontmatter of first slide) by using the tag *biblio*

Input is declared as follow:   
```
biblio:
  filename: foo.bib
```
or 
```
biblio:
  filename:
    - foo.bib
    - bar.json
```
The input files **foo.bib** and **bar.json** will be read into the "public/biblio" folder of the presentation

# Usage   
Reference could be cite by to way.

Using the Cite component:
```
<Cite bref="myref" />
```
Or using directly the markdown pre-processor 
```
[@myref]
```

The bibliography list could be display with:
```
<Cite show-bib />
```
or using the layout
```
---
layout: biblio
---
```


# Style & configuration   
## bibliography formatting
It is possible to configure the output format provided by citation-js and under the hood citeproc
passing the locale and template format for bibliography (apa,harvard1,vancouver).

```
biblio:
  #-template; apa
  #- template: harvard1
  - template: vanvouver
  - locale: 'en-US' 
  - numerical_ref: false
```
*numerical_ref* could be used to force the reference to be a numeric reference.

Additional options are provided by the addon for formatting the bibliography:
those customization of the bibliography could be setup globally (in first slide) or localy(in frontmatter of one slide) for only one slide bibliography list.

```
biblio:
  - item_per_page: 2
  - show_id: true
  - show_full_bib: true
```
- *item_per_page* : limit the number of biblio entry per page in the bibliography   
- *show_full_bib* : show all bibliography item from input files event if it is not reference in the presentation   
- *show_id* : force to show reference cite id regardless of style configuration

Some CSS tag are introduced to customize the display of bibliography list


## Reference formatting

Those customization of the reference formatting could be setup globally (in first slide) or localy(in frontmatter of one slide) for only one slide bibliography list.
```
biblio:
- tooltips: true
- footnotes: 'none' # true false short full
```
- *tooltips*: enable tooltips where the reference is cite, show full bibliography on mouse over the biblio
- *footnotes*: provide addition reference list as footnote on the slide.   
This parameter is disable if set to 'none' or false, provide a short reference with 'short' or complete one with 'full'.

# Extension (WIP)   
The underline citation-js could customize to add other input type or format via load plugin or customize citation-js/plugin-csl format output.

Example:  
```
npm i citation-js/plugin-doi
```
Load the plugin in the setup/main.ts entry point of the presentation.   
notes:    
- It could be not enough to just install and import plugin, but need to register the plugin manually
- It did not work with global install at the moment.
```
import { defineAppSetup } from '@slidev/types'


import {plugins}  from "@citation-js/core"
import {ref as doiref,formats as doiformats} from "@citation-js/plugin-doi"

export default defineAppSetup(({ app, router }) => {
     /* Vue App*/
     console.log("plugmain",plugins.list())
     plugins.add(doiref, {
        input: doiformats
     })
     console.log("plugmain",plugins.list())
})
```

# TODO list & know issues
- [ ] Improve documentation
- [ ] Fix temporaries id not repeatable on load (from doi,wiki...)
- [ ] Allow to separate biblio by section (using toc)
- [ ] add link between ref&biblio (with comes back to easy)
- [ ] add/impove css&rendering
- [ ] change from preparser to parser to avoid problem with online editor
- [ ] provide entry point to load custom csl format without need to write extension


