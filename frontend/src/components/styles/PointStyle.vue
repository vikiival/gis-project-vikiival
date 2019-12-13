<template>
   <vl-style-box>
      <vl-style-circle :radius="5">
          <vl-style-fill color="blue"></vl-style-fill>
          <vl-style-stroke color="silver"></vl-style-stroke>
        </vl-style-circle>
    </vl-style-box>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class PointStyle extends Vue {
 
}
</script>