
<template>
  <div>
    <MapElement
      v-for="(mapElement, index) in mapElements"
      :key="index"
      :element="mapElement"
      />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import MapElement from './MapElement.vue'

@Component({
  components: {
    MapElement
  }
})
export default class MapElementList extends Vue {
  @Prop() mapElements!: any[]

}
</script>