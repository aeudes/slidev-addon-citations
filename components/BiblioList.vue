<script setup lang="ts">
import { ref, inject, watch } from 'vue'
import {citation_state} from "./CiteEngine"
import sliconfig from "/@slidev/configs"
import {injectionRoute } from "@slidev/client/constants.ts"

const props = defineProps({
   showFullBib:{type: Boolean, default:  false},
   itemPerPage: {type: Number, default:  undefined},
});

const slidevRoute = inject(injectionRoute)
const my_page =slidevRoute.path
const frontmatter = slidevRoute.meta.slide.frontmatter

const biblio = ref([])

let bibSlideConfig = {... citation_state.default_config, ... sliconfig?.biblio, ...frontmatter?.biblio}
const maxItem = props.itemPerPage ?? bibSlideConfig.item_per_page
const fullBib = props.showFullBib || bibSlideConfig.show_full_bib
const showid  = bibSlideConfig.show_id || (fullBib || bibSlideConfig.numerical_ref) && (bibSlideConfig.show_id ?? true) 

function update_bib() 
{
  if (!citation_state.state.is_init)
   return

    const show_entry = fullBib? citation_state.get_all_ids(): citation_state.get_know_ids()
    let nelm = maxItem ?? bibSlideConfig?.item_per_page ?? show_entry.length 
    let nshunk = Math.ceil( (show_entry?.length ?? 0) /nelm)
    biblio.value = []
    for (let i=0; i<nshunk;++i)
    {
      let start = i*nelm
      let end = (i+1)*nelm
      biblio.value.push(
        show_entry.slice(start,end).map( v => citation_state.get(v)) 
      )
    }
}

watch( citation_state.state.version, (version,old_version) => {
      //console.log("watch",old_version,"=>",version,":",props.bref, fullBib, citation_state.state.is_init)
      update_bib()
    }
)

citation_state.add("bib", my_page)
if (fullBib) {citation_state.process_all();}

citation_state.init().then( (cite) => 
{
  update_bib()
  //console.log("bib:", my_page, "full:",fullBib, "proc:", citation_state.state.process_all)
})
</script>

<template>
  <div class="biblio_graphy">
     <template v-for="(bibshunk,index) in biblio"  >
     <ul class="biblio_list" v-if='$slidev.nav.clicks == index'  >
       <li class="biblio_line" v-for="elm in bibshunk"  >
          <span class="biblio_id" v-if="showid">[{{elm.id}}] </span>
          <span class="biblio_fullref">{{elm.full_bib}}</span>
          <span class="biblio_pageref" v-if="elm.pages?.length" >
            (<template v-for="(page, index) in elm.pages">
               <template v-if="index != 0">,&nbsp;</template><Link :to="page" >{{page}}</Link>
             </template>)
          </span>
       </li>
       <p v-if="biblio.length > 1">page  {{index+1}} / {{biblio.length}} </p>
     </ul>
     </template>
     <!-- hack to have correct number of click -->
     <template v-if="biblio.length>1" v-for="index in Array(biblio.length-1).keys()"  >
     <div v-click></div>
     </template>
  </div>
 </template>

<style>
</style>
