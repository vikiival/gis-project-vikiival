<template>
   <vl-style-box>
          <vl-style-fill color="white"></vl-style-fill>
          <vl-style-stroke color="gray" :width="4"></vl-style-stroke>
    </vl-style-box>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class LineStyle extends Vue {
 
}
</script>