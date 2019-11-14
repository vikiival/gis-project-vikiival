
<template>
  <vl-feature :properties="element">
    <component :is="elementType[element.geo.type]" :coordinates="element.geo.coordinates" />
  </vl-feature>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class MapElement extends Vue {
  @Prop() element!: any;
  private elementType = {
    Point: "vl-geom-point",
    Polygon: "vl-geom-polygon",
    Road: "vl-geom-line-string",
    LineString: "vl-geom-line-string"
  };
}
</script>