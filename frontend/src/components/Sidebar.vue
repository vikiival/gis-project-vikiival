<template>
  <div class="sidebar-wrapper">
    <header class="card-header">
      <p class="card-header-title">Filters</p>
    </header>
    <div class="filter-wrapper">
      <DataCard v-if="selectedHotel" :item="selectedHotel" @close="handleHotelClose" />
      <SearchFilter v-if="selectedHotel" @confirm="handleSearch"/>
      <DataCard v-for="(poi, index) in addedPois" :key="index" :item="poi" @close="handlePoiClose" />
      <!-- <PopupProperty v-for="(poi, index) in addedPois" :key="index" label="hotel" :value="poi.properties.name" /> -->
      <b-button type="is-secondary" @click="handleTrip" v-if="addedPois.length" class="submit-button" rounded>Go Trip</b-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import bus from "../bus";
import PopupProperty from './PopupProperty.vue'
import DataCard from './DataCard.vue'
import SearchFilter from './Filter.vue'

@Component({
  components: {
    PopupProperty,
    DataCard,
    SearchFilter
  }
})
export default class Sidebar extends Vue {
  private name: string = "";
  private selectedOptions = [];
  private addedPois = [];
  private selectedHotel: any = null;

  created() {
    bus.$on("add", poi => {
      console.log('poi', poi);
      this.addedPois = [...this.addedPois, poi]
    });

    bus.$on("select", feature => {
      console.log('select', feature);
      this.selectedHotel = feature;
    });
  }

  handleTrip() {
    bus.$emit('trip', {
      coordinates: this.selectedHotel.geometry.coordinates,
      pois: this.addedPois.map((poi: any) => poi.geometry.coordinates)
    })
  }

  handleSearch(searchParams: any) {
    console.log('searchParams', searchParams);
    bus.$emit('search', { 
      coordinates: this.selectedHotel.geometry.coordinates,
      searchParams
     })
    
  }

  handleHotelClose(id: string) {
    this.selectedHotel = null;
  }

  handlePoiClose(id: string) {
    this.addedPois = this.addedPois.filter((poi: any) => poi.id !== id);
  }
}
</script>

<style scoped>
.submit-button {
  margin: auto;
  width: 100%;
}

.filter-wrapper {
  padding: 0.75rem;
}
</style>