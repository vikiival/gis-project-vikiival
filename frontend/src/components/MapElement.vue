
<template>
  <vl-feature :properties="element">
    <vl-geom-point :coordinates="element.geo.coordinates"></vl-geom-point>
  </vl-feature>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class MapElement extends Vue {
  @Prop() element!: any;
}
</script>