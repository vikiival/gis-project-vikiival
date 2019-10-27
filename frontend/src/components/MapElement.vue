
<template>
  <vl-feature :properties="{prop: 'value', prop2: 'value'}">
    <vl-geom-point :coordinates="[ 17.064152399999998, 48.1587654 ]"></vl-geom-point>
  </vl-feature>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class MapElement extends Vue {
  @Prop() element!: any;
}
</script>