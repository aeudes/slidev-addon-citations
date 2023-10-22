---
theme: seriph
background: https://source.unsplash.com/collection/94734566/1920x1080
class: 'text-center'
highlighter: shiki
monaco: true
info: |
  ## Bibliography addon for slidev
  Powered by [citation-js](https://citation.js.org)
#addons:
#  - slidev-addon-citations
biblio:
 filename:
   - ig2022.bib
   - ig2022.json
 footnotes: false
 #template: vancouver
 #template: apa
 #template: harvard1
 csl_template_file: style.json # for ieee
 template: ieee
 #numerical_ref: false
---

# Bibliography addon for slidev

A small addon to cite them all

---

# Features

- **Input** load bibtex and csl files with [citation-js](https://citation.js.org)
- **Citation** Display citation id from handle
- **Bibliography** Display bibliography list in various format

- **Mardown**  provide makdown pre-parser rules
- **Extendable**  could easly extend to all format use by citation-js plugins

---

# Exemples
We need ref

All those references are laureat of [IGnobel 2022](https://improbable.com/ig/2022-ceremony)

- Raw citation from "ig2022.bib"   
**Cardiology** <Cite bref="IG2022CARDIOLOGY"/>, **Biology** <Cite bref="IG2022BIOLOGY" />   
- Using markdown preparser '['+'@'+refid+']'    
**Literature** [@IG2022LITERATURE] , **Medicine** [@IG2022ARTHISTORY]   
- Same from json file format "ig2022.json"    
**Peace** [@IG2022PEACE-json]
- And with DOI input    
some IG2023 preview:  **Nutrition** <Cite input="doi.org/10.1145/1959826.1959860" />,**Psychology** <Cite input="10.1037/h0028070" bref="doi1" />

---
biblio:
  footnotes: true
---

# With footnotes
<small><mingcute-foot-fill /> <mingcute-foot-fill /> <mingcute-foot-fill /></small>

Reference could be display with additionnal footnotes:   
In **Safety** [@IG2022SAFETY] And **Engineering** [@IG2022ENGINEERING]


Ref to citation with input field is then possible:   
**Psychology** don't look up : <Cite bref="doi1" />, [@doi1]

---
biblio:
  tooltips: true
  footnotes: full
---
# Add tooltips

to tooltips or not tooltips...

Display biblio reference on mouse over : **Economics** [@IG2022ECONOMICS]

this slides have also full reference in footnotes (and it's too long)

---
---
# Know issues & TODO list

TODOS:   
- Improve documentation
- Allow to separate biblio by section (using toc)
- add link between ref&biblio (with comes back link)
- add/impove css&rendering
- change from preparser to parser to avoid problem with online editor
- allow to load more csl format loading

---
layout: center
---
# Enjoy !
Slide after provide biblio reference lists

---
layout: biblio
biblio:
  item_per_page: 3
---

---
layout: biblio
biblio:
  item_per_page: 4
  show_full_bib: true
  #show_id: false
---
# Full Biblio (even not cited items)!
