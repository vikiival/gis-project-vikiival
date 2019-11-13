
<template>
  <vl-interaction-select :features.sync="syncedElements">
    <template slot-scope="select">
      <!-- select styles -->
      <vl-style-box>
        <vl-style-stroke color="#423e9e" :width="7"></vl-style-stroke>
        <vl-style-fill :color="[254, 178, 76, 0.7]"></vl-style-fill>
        <vl-style-circle :radius="5">
          <vl-style-stroke color="#423e9e" :width="7"></vl-style-stroke>
          <vl-style-fill :color="[254, 178, 76, 0.7]"></vl-style-fill>
        </vl-style-circle>
      </vl-style-box>
      <vl-style-box :z-index="1">
        <vl-style-stroke color="#d43f45" :width="2"></vl-style-stroke>
        <vl-style-circle :radius="5">
          <vl-style-stroke color="#d43f45" :width="2"></vl-style-stroke>
        </vl-style-circle>
      </vl-style-box>
      <!--// select styles -->

      <!-- selected feature popup -->
      <vl-overlay
        class="feature-popup"
        v-for="feature in select.features"
        :key="feature.id"
        :id="feature.id"
        :position="pointOnSurface(feature.geometry)"
        :auto-pan="true"
        :auto-pan-animation="{ duration: 300 }"
      >
        <template slot-scope="popup">
          <section class="card">
            <header class="card-header">
              <p class="card-header-title">Feature ID {{ feature.id }}</p>
              <a
                class="card-header-icon"
                title="Close"
                @click="syncedElements = syncedElements.filter(f => f.id !== feature.id)"
              >
                <b-icon icon="close"></b-icon>
              </a>
            </header>
            <div class="card-content">
              <div class="content">
                <PopupProperty label="Name" :value="feature.properties.name" />
                <PopupProperty label="OSM Id" :value="feature.properties.id" />
                <PopupProperty label="Popup position" :value="popup.position" />
                <!-- <p>Popup: {{ JSON.stringify(popup) }}</p> -->
                <!-- <p>Feature: {{ JSON.stringify({ id: feature.id, properties: feature.properties }) }}</p> -->
              </div>
            </div>
            <footer class="card-footer">
              <a @click="handleSelected(feature)" class="card-footer-item">{{ featureName(feature) }}</a>
            </footer>
          </section>
        </template>
      </vl-overlay>
      <!--// selected popup -->
    </template>
  </vl-interaction-select>
</template>

<script lang="ts">
import { Component, PropSync, Vue, Emit } from "vue-property-decorator";
import MapElement from "./MapElement.vue";
import { findPointOnSurface } from "vuelayers/lib/ol-ext";
import PopupProperty from './PopupProperty.vue'

@Component({
  components: {
    MapElement,
    PopupProperty
  },
  methods: {
    pointOnSurface: findPointOnSurface
  }
})
export default class Interaction extends Vue {
  @PropSync("selectedFeatures") syncedElements!: any[];
    
  
  handleSelected(feature: any) {
    feature.properties.isPOI 
    ? this.addedPoi(feature)
    : this.selectedPoint(feature);
  }

  @Emit("selected")
  selectedPoint(feature: any) {
    console.log(feature);
    return feature.geometry.coordinates;
  }

  @Emit("add:poi")
  addedPoi(feature: any) {
    return feature
  } 

  featureName(feature: any): string {
    return feature.properties.isPOI ? 'Add to List' : 'Show nearest';
  }
}
</script>
