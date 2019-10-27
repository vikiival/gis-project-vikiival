
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
                    <p>
                      Overlay popup content for Feature with ID
                      <strong>{{ feature.id }}</strong>
                    </p>
                    <p>Popup: {{ JSON.stringify(popup) }}</p>
                    <p>Feature: {{ JSON.stringify({ id: feature.id, properties: feature.properties }) }}</p>
                  </div>
                </div>
              </section>
            </template>
          </vl-overlay>
          <!--// selected popup -->
        </template>
      </vl-interaction-select>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from "vue-property-decorator";
import MapElement from './MapElement.vue'
import {
  createProj,
  addProj,
  findPointOnSurface,
  createStyle,
  createMultiPointGeom,
  loadingBBox
} from "vuelayers/lib/ol-ext";

@Component({
  components: {
    MapElement
  },
  methods: {
    pointOnSurface: findPointOnSurface
  }
})
export default class Interaction extends Vue {
  @PropSync('selectedFeatures') syncedElements!: any[]

}
</script>