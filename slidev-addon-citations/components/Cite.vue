<script setup lang="ts">
import { ref, inject, watch } from 'vue'
import {citation_state} from "./CiteEngine"
import sliconfig from "/@slidev/configs"
import {injectionRoute } from "@slidev/client/constants.ts"

const props = defineProps({
   bref:{type: String, default: null},
   showBib:{type: Boolean, default:  false},
   showFullBib:{type: Boolean, default:  false},
   itemPerPage: {type: Number, default:  undefined},
});

const slidevRoute = inject(injectionRoute)
const my_page =slidevRoute.path
const frontmatter = slidevRoute.meta.slide.frontmatter

const reftext = ref("")
const refnum = ref("")
const footpage_bib = ref("")
const biblio = ref([])

let bibSlideConfig = {... citation_state.default_config, ... sliconfig?.biblio, ...frontmatter?.biblio}
const show_tooltips = bibSlideConfig.tooltips
const footpage_bibtype = get_footpage_type()
const maxItem = props.itemPerPage ?? bibSlideConfig.item_per_page
const fullBib = props.showFullBib || bibSlideConfig.show_full_bib
const showid  = bibSlideConfig.show_id || fullBib && (bibSlideConfig.show_id ?? true)

function get_footpage_type()
{
  let foottype = bibSlideConfig.footnotes //ref("none")
  if(foottype == true) {foottype = "short"}
  if(foottype == false) {foottype = "none"}
  return foottype
}

function update_bib() 
{
  if (!citation_state.state.is_init || !citation_state.state.cite)
   return

  if (props.showBib) {
    const show_entry = fullBib? citation_state.get_all_ids(): citation_state.get_know_ids()
    let nelm = maxItem ?? bibSlideConfig?.item_per_page ?? show_entry.length 
    let nshunk = Math.ceil(show_entry.length/nelm)
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

  if (props.bref != null) {
    const my_bib_data = citation_state.get(props.bref)
    refnum.value =  my_bib_data?.cite_id
    reftext.value = my_bib_data?.full_bib
  
    let idx_id = citation_state.get_allbibinpage(my_page)
    if (Math.min(...idx_id[0]) === my_bib_data.idx)
    {
      footpage_bib.value = idx_id[1].map( v => citation_state.get(v)) 
    }
  }
}

watch( citation_state.state.version, (version,old_version) => {
      //console.log("watch",old_version,"=>",version,":",props.bref, fullBib, citation_state.state.is_init)
      update_bib()
    }
)

citation_state.add(props.bref == null?"bib":props.bref, my_page)
if (props.showBib && fullBib) {citation_state.process_all();}

citation_state.init().then( (cite) => 
{
  update_bib()
})
</script>

<template>
  <div class="biblio_graphy" v-if="showBib">
     <template v-for="(bibshunk,index) in biblio"  >
     <ul class="biblio_list" v-if='$slidev.nav.clicks == index'  >
       <li class="biblio_line" v-for="elm in bibshunk"  >
          <span class="biblio_id" v-if="showid">[{{elm.id}}] </span>
          <span class="biblio_fullref">{{elm.full_bib}}</span>
          <span class="biblio_pageref" v-if="elm.pages?.length" >
            (<template v-for="page in elm.pages">
               <Link :to="page" >{{page}}</Link>
             </template>)
          </span>
       </li>
       <p>page  {{index+1}} / {{biblio.length}} </p>
     </ul>
     </template>
     <!-- hack to have correct number of click -->
     <template v-if="biblio.length>1" v-for="index in Array(biblio.length-1).keys()"  >
     <div v-click></div>
     </template>
  </div>
  
  <a class="biblio_tooltips" v-if="refnum && show_tooltips" :title="reftext">{{refnum}}</a>
  <span class="biblio_ref" v-if="refnum && !show_tooltips">{{refnum}}</span>

  <div v-if="footpage_bib !== '' && footpage_bibtype!='none'" class="biblio_foot" >
    <li class="biblio_foot_elm" v-for="elm in footpage_bib"  >
     <span class="biblio_id">{{ elm.cite_id }} : </span>
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
</style>
