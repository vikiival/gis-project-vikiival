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
      <vl-feature id="polygon" :properties="{prop: 'value', prop2: 'value'}">
        <vl-geom-polygon
          :coordinates="[[[17.0283064,48.1426274999035],[17.0294762,48.1421362999036],[17.0310753,48.1415983999037],[17.0327913,48.1413122999038],[17.0341707,48.1412478999038],[17.0357606,48.1412153999038],[17.0363706,48.1412868999038],[17.0368312,48.1414581999038],[17.0349843,48.1415402999037],[17.0326666,48.1416709999037],[17.0309181,48.1419875999036],[17.0283064,48.1426274999035]]]"
        ></vl-geom-polygon>
      </vl-feature>
      <MapElementList :mapElements="points" />

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

        this.points = response.data.map(({ name, geo }: any) => ({
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

