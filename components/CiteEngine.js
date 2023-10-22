import { ref } from 'vue'

import {Cite as Citejs,plugins}  from "@citation-js/core"
import "@citation-js/plugin-bibtex"
import "@citation-js/plugin-csl"
import "@citation-js/plugin-doi"
import sliconfig from "/@slidev/configs"


export const citation_state = 
{
   default_config:
   {
      template: 'vancouver',
      locale: 'en-US',
      numerical_ref: false,
      tooltips: false,
      footnotes: 'none',
      item_per_page: undefined,
      show_full_bib: false,
      show_id: undefined,
      csl_template_file: undefined,
      csl_locales_file: undefined
   },
   state: {
    cite: undefined,
    nitem: 1,
    uref_item: [],
    is_init: false,
    init_start: false,
    bibprop: {},
    version: ref(0),
    config: {},
    process_all: false,
  },
  getURefItem(input)
  {
    const idx = this.state.uref_item.indexOf(input)
    if (idx != -1)
    {
       return idx +1 // first id == 1
    } else {
      this.state.uref_item.push(input)
      return this.state.uref_item.length
    }
  },
  init() {
         if (this.state.init_start) 
           return  Promise.resolve( this.state.cite  )  
         
         this.state.init_start = true

         const config = sliconfig?.biblio 
         this.state.config = { ... this.default_config , ...config}
       
         console.log('init')
         console.log("citation-js parser loaded:", plugins.list())

         if (this.state.config.csl_template_file)
         {
           fetch("biblio/"+this.state.config.csl_template_file)
           .then( r=> {if (r.ok) {return r.json() } })
           .then( t =>{ 
             let config = plugins.config.get('@csl')
             Object.entries(t).map( ([templateName, template]) => {

              config.templates.add(templateName, template)
              console.log("load template: " + templateName)
              }
             )
             this.update_full_bib()
           })
           .catch(e => {console.error("invalid template file biblio/"+ this.state.config.csl_template_file +":"+e)})
         }

         if (this.state.config.csl_locales_file)
         {
           fetch("biblio/"+this.state.config.csl_locales_file)
          .then( r=> {if (r.ok) {return r.text() } })
          .then( t =>{ 
            let config = plugins.config.get('@csl')
            for (const [langName,lang] in Object.entries(t)) {
              config.locales.add(langName, lang)
            }
            this.update_full_bib()
          })
          .catch(e => {console.error("invalid locales file biblio/"+ this.state.config.csl_locales_file +":"+e)})
         }



         let filenames = []
      	 if (Array.isArray(config.filename)) {
	         filenames = config.filename
	       }
	       else{
	         filenames = [config.filename]
	       }

	       const load_func = f => {console.log("biblio load : ",f); return fetch("biblio/"+f+"?raw")
                .then(r => { if( ! r.ok) { throw new Error("invalid file"+f);  } else { return r.text()} })
		            .then( t => this.add_ref(t))
	              .catch( err => {console.log(err); return Promise.resolve(this.state.cite) } )
	       }
	       return Promise.all(filenames.map(load_func))
             .then( () => { 
               this.state.is_init = true
               console.log("init done")
               this.update_full_bib()
               return this.state.cite
             })
  },
  add_input(input, id){
    //console.log("add_input",input)
    plugins.input.chainAsync(input)
      .then(csl => {
        csl[0]["id"] = id
        this.add_ref(csl)
        this.update_full_bib()
        //console.log("end add input",input)
    })
    .catch(err => {console.log("error : ",input,"invalid")})
  },
  add_ref(input){
    //console.log("add_ref")
    if (this.state.cite)
      this.state.cite = this.state.cite.add(input)
    else
      this.state.cite = Citejs(input)
  },
  update_full_bib(){
    if (!this.state.cite)
      return
    
    this.state.bib_other = {}
    // update full bib
    const bib_ids = this.state.cite.getIds()
    let bib_id_order = []
    bib_ids.forEach((k,bidx) => {
      let v = this.state.bibprop?.[k] ?? {'pages': [0], 'idx': 1e30};
      let order = Number(v.pages[0])*(this.state.nitem+10) + v.idx
      bib_id_order.push({'id': k, 'bidx': bidx,'order': order}) 
    })
    bib_id_order.sort((a,b) => a.order - b.order)
    
    let nknow =  bib_id_order.findIndex(a => a.order == 1e30)
    if ( !this.state.process_all)
      bib_id_order.splice(nknow)
    
    let biblios = this.state.cite.format('bibliography',{ entry: bib_id_order.map(u => u.id), 
      template: this.state.config.template,
      lang:  this.state.config.locale,
      asEntryArray: true,
      nosort: false 
    })
    let mbiblios = Object.fromEntries(biblios)

    this.state.biborder_full = biblios.map( x => x[0] )
    this.state.biborder = this.state.biborder_full.filter(x => x in this.state.bibprop )
    bib_id_order.forEach( (order,i) => 
    {
      const id = order.id
      const bidx = order.bidx
      const bib = mbiblios[id]
      let x = this.state.cite.data[bidx]
      const etal = (x.author.length <= 1 )? "" : " et al."
      const short_bib = x.author[0].given[0] + ". " + x.author[0].family + etal +" , " + x.title
      
      if (i < nknow)
      {
         this.state.bibprop[id]["full_bib"] = bib
         this.state.bibprop[id]["short_bib"] = short_bib
         this.state.bibprop[id]["id"] = id
         if (this.state.config.numerical_ref){
           this.state.bibprop[id]["cite_id"] = "["+i+"]"
         }else {
	         this.state.bibprop[id]["cite_id"] = this.state.cite.format("citation",
		       { entry: id
	         , template: this.state.config.template
           , citationsPre: bib_id_order.slice(0,i).map( x => x.id) } 
	       )}
      }
      else {
        this.state.bib_other[id] = {'full_bib': bib, 'short_bib': short_bib , 'cite_id': '['+id+']', 'id': id }
      }
    })
    if (this.state.is_init)
      this.state.version.value += 1
  },
  add(id, page, input) {
   //console.log("add",id,page,input) 
   if (id == null) {
     if (input != null)
     {
      id = "Tid" + this.getURefItem(input)
     }
    else{return null}
   }
   
   let changed = false
   let prop = this.state.bibprop?.[id]
   if (prop == undefined)
   {
     this.state.bibprop[id] = {"pages": [page], "idx": this.state.nitem}
     prop = this.state.bibprop[id]
     changed = true
   }
   
   if (input != null && prop?.id == undefined){
      this.add_input(input, id)
      changed = true
   }
   if ( page && !(prop.pages.includes(page)))
   { // TODO sorted insert ?
       if (prop.pages.length == 0 || prop.pages[0] < page  ){
           prop.pages.push(page)
       }
       else {
           prop.pages.push(prop.pages[0])
           prop.pages[0] = page
           prop.idx = this.state.nitem
           changed = true
       }
   }
   
   this.state.nitem += 1
   if (changed) {
     this.update_full_bib() // TODO only update id
   }
   
   return id
  },
  process_all()
  {
    this.state.process_all = true
    this.update_full_bib()
  },
  get(id) {
    return this.state.bibprop[id] ?? this.state.bib_other[id] ?? undefined
  },
  get_know_ids()
  {
    return this.state.biborder
  },
  get_all_ids()
  {
    return this.state.biborder_full
  },
  get_bibpage(){
    return this.state.bibprop['bib'].pages[0]
  },
  get_allbibinpage(page){
    let same_page_id = []
    let same_page_idx = []
    for ( const [k,v] of Object.entries(this.state.bibprop))
    {
        if (v.pages.includes(page)){
          same_page_id.push(k)
          same_page_idx.push(v.idx)
        }
    }
    return [same_page_idx,same_page_id]
  }
}

