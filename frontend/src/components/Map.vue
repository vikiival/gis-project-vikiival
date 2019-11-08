<template>
  <div>
    <vl-map
      :load-tiles-while-animating="true"
      :load-tiles-while-interacting="true"
      style="height: 80vh"
      data-projection="EPSG:4326"
      @click="handleCordinateClick"
    >
      <vl-view :zoom.sync="zoom" :center.sync="center" :rotation.sync="rotation"></vl-view>

      <Interaction :selectedFeatures="selectedFeatures" @selected="handleSelectedElement" />

      <vl-geoloc @update:position="handlePosition">
        <vl-feature id="position-feature">
          <vl-geom-point :coordinates="[ 17.064152399999998, 48.1587654 ]"></vl-geom-point>
          <vl-style-box>
            <vl-style-icon src="../assets/marker.png" :scale="0.4" :anchor="[0.5, 1]"></vl-style-icon>
          </vl-style-box>
        </vl-feature>
      </vl-geoloc>
      
      <MapElementList :mapElements="points" />
      <MapElementList :mapElements="pois" />

      <vl-layer-tile id="osm">
        <vl-source-osm></vl-source-osm>
      </vl-layer-tile>
    </vl-map>
    <CordinationCard
      :zoom="zoom"
      :center="center"
      :rotation="rotation"
      :geolocPosition="geolocPosition"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CordinationCard from "./CordinationCard.vue";
import MapElementList from "./MapElementList.vue";
import Interaction from "./Interaction.vue";
import axios from "axios";
import { CoordinateList } from "@/types";
import debounce from "debounce";

@Component({
  components: {
    CordinationCard,
    MapElementList,
    Interaction
  }
})
export default class HelloWorld extends Vue {
  private zoom = 17;
  private geolocPosition = null;
  private center = [17.064152399999998, 48.1587654];
  private rotation = 0;
  private points: any[] = [];
  private clickCoordinate: any;
  private geoloc: any;
  selectedFeatures: any = [];
  private pois: any = [];
  // private yyy = debounce(this.xxx, 1500)

  handlePosition(event: any) {
    console.log(event);

    this.geolocPosition = event;
  }

  mounted() {
    axios.get("http://localhost:8080/api/hotels").then(
      response =>
        (this.points = response.data.map(({ name, geo }: any) => ({
          name,
          geo: JSON.parse(geo)
        })))
    );
  }

  handleSelectedElement(coordinates: CoordinateList) {
    const { zoom } = this;
    axios
      .post("http://localhost:8080/api/pois", {
        coordinates,
        zoom
      })
      .then(response => {
        console.log(response.data);

        this.pois = response.data.map(({ name, geo }: any) => ({
          name,
          geo: JSON.parse(geo),
          isPOI: true
        }));
      });
  }

  handleCordinateClick(event: any) {
    console.log(event);
  }

  xxx(event: any) {
    console.log(event);
  }
}
</script>

