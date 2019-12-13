<template>
   <vl-style-box>
      <vl-style-circle :radius="5">
          <vl-style-fill color="white"></vl-style-fill>
          <vl-style-stroke color="red"></vl-style-stroke>
        </vl-style-circle>
    </vl-style-box>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class PointPoiStyle extends Vue {
 
}
</script>