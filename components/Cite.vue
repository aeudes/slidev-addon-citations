<script setup lang="ts">
import { ref, inject, watch } from 'vue'
import {citation_state} from "./CiteEngine"
import sliconfig from "/@slidev/configs"
import {injectionRoute } from "@slidev/client/constants.ts"

const props = defineProps({
   bref:{type: String, default: null},
   input:{type: String, default: null},
});

const slidevRoute = inject(injectionRoute)
const my_page =slidevRoute.path
const frontmatter = slidevRoute.meta.slide.frontmatter

const reftext = ref("")
const refnum = ref("")
const footpage_bib = ref("")

let bibSlideConfig = {... citation_state.default_config, ... sliconfig?.biblio, ...frontmatter?.biblio}
const show_tooltips = ref(bibSlideConfig.tooltips)
const footpage_bibtype = get_footpage_type()
const show_id = bibSlideConfig.show_id || (footpage_bibtype ==="short" || bibSlideConfig.numerical_ref) && (bibSlideConfig.show_id ?? true)

let myid = citation_state.add(props.bref, my_page, props.input)

function get_footpage_type()
{
  let foottype = bibSlideConfig.footnotes //ref("none")
  if(foottype == true) {foottype = "short"}
  if(foottype == false) {foottype = "none"}
  return foottype
}

function update_bib() 
{
    if (!citation_state.state.is_init)
      return

    if (myid == null) {
      refnum.value ="(#Noid)"
      return
    }

    const my_bib_data = citation_state.get(myid)
    const ref_error = !("cite_id" in my_bib_data)
   
    if (ref_error)
    {
      refnum.value =  "(#RefErr)"
      reftext.value = props.bref + ": ERROR ref not found"
      show_tooltips.value = true
    }
    else
    {
      refnum.value =  my_bib_data.cite_id
      reftext.value = my_bib_data.full_bib
      show_tooltips.value = bibSlideConfig.tooltips
    }
  
    let idx_id = citation_state.get_allbibinpage(my_page)
    if (Math.min(...idx_id[0]) === my_bib_data.idx)
    {
      footpage_bib.value = idx_id[1].map( v => citation_state.get(v)).filter( v => v?.id )
    }  
}

watch( citation_state.state.version, (version,old_version) => {
      //console.log("watch",old_version,"=>",version,":",props.bref, fullBib, citation_state.state.is_init)
      update_bib()
    }
)


citation_state.init().then( (cite) => 
{
  update_bib()
})
</script>

<template>
  <a class="biblio_tooltips" v-if="refnum && show_tooltips" :title="reftext">{{refnum}}</a>
  <span class="biblio_ref" v-if="refnum && !show_tooltips">{{refnum}}</span>

  <div v-if="footpage_bib !== '' && footpage_bibtype!='none'" class="biblio_foot" >
    <li class="biblio_foot_elm" v-for="elm in footpage_bib"  >
     <span class="biblio_id" v-if="show_id" >{{ elm.cite_id }} : </span>
     <span class="biblio_shortref" v-if="footpage_bibtype === 'short'">{{elm.short_bib}}</span>
     <span class="biblio_fullref" v-if="footpage_bibtype === 'full'">{{elm.full_bib}}</span>
    </li>
  </div>
</template>

<style>
.biblio_foot
{ 
  position: absolute;
  bottom: 2.5rem;
  left: 2.5rem;
  opacity: 0.5;
  white-space: nowrap;
}
.biblio_foot .biblio_fullref
{
  white-space: pre-wrap;
}
</style>
