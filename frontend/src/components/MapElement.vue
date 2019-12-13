
<template>
  <vl-feature :properties="element">
    <component :is="elementType[element.geo.type]" :coordinates="element.geo.coordinates" />
    <component :is="getStyle(element)" />
  </vl-feature>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import LineStyle from './styles/LineStyle.vue'
import PointStyle from './styles/PointStyle.vue'
import PointPoiStyle from './styles/PointPoiStyle.vue'

@Component({
  components: {
    LineStyle,
    PointPoiStyle,
    PointStyle
  }
})
export default class MapElement extends Vue {
  @Prop() element!: any;
  private elementType = {
    Point: "vl-geom-point",
    Polygon: "vl-geom-polygon",
    Road: "vl-geom-line-string",
    LineString: "vl-geom-line-string"
  };

  private getStyle(element: any) {
    if (element.geo.type === 'Point') {
      return element.isPOI ? PointPoiStyle : PointStyle
    } else if (element.geo.type === 'LineString') {
      return LineStyle
    } 
  }

}
</script>