<script setup lang="ts">

const props = defineProps({
});

</script>

<template>
	<div class="slidev-layout biblio">
           <slot>
	   <h1 class="text-center" >Bibliography</h1>
	   </slot>
	   <BiblioList />
	</div>
</template>


