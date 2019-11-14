<template>
  <div>
    <vl-map
      :load-tiles-while-animating="true"
      :load-tiles-while-interacting="true"
      style="height: 80vh"
      data-projection="EPSG:4326"
      @click="handleCordinateClick"
      ref="mapMap"
    >
      <vl-view ref="mapMapMap" :zoom.sync="zoom" :center.sync="center" :rotation.sync="rotation"></vl-view>

      <Interaction :selectedFeatures="selectedFeatures" @selected="handleSelectedElement" @add:poi="handleAddedPoi" />

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
      <MapElementList :mapElements="path" />
<!-- 
      <vl-feature>
      <vl-geom-line-string :coordinates="[[17.1515631,48.1495842],[17.1516648,48.1492922]]"></vl-geom-line-string>
    </vl-feature>
      <vl-feature>
      <vl-geom-line-string :coordinates="[[17.1516648, 48.1492922], [17.152561, 48.149423]]"></vl-geom-line-string>
    </vl-feature>
     <vl-feature>
      <vl-geom-line-string :coordinates="[[17.152561, 48.149423], [17.1531377, 48.1495]]"></vl-geom-line-string>
    </vl-feature>
     <vl-feature>
      <vl-geom-line-string :coordinates="[[17.1531377, 48.1495], [17.1530975, 48.149645]]"></vl-geom-line-string>
    </vl-feature> -->


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
import { CoordinateList } from "../types";
import debounce from "debounce";
// import {fromLonLat} from 'ol/proj';
import bus from '../bus'

@Component({
  components: {
    CordinationCard,
    MapElementList,
    Interaction
  }
})
export default class HelloWorld extends Vue {
  private zoom = 15;
  private geolocPosition = null;
  private center = [17.064152399999998, 48.1587654];
  // private center =[17.1515631,48.1495842];
  private rotation = 0;
  private points: any[] = [];
  private clickCoordinate: any;
  private geoloc: any;
  selectedFeatures: any = [];
  private pois: any = [];
  private selectedHotel: CoordinateList = [null, null];
  private path: any = []
  
  // private yyy = debounce(this.xxx, 1500)

  handlePosition(event: any) {
    console.log(event);

    this.geolocPosition = event;
  }

  created() {
    bus.$on("add", this.handleSelectedPois);
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
    this.selectedHotel = coordinates
    axios
      .post("http://localhost:8080/api/pois", {
        coordinates,
        zoom
      })
      .then(response => {
        console.log(response.data);

        this.pois = response.data.map(({ name, osm_id,  geo }: any) => ({
          name,
          id: osm_id,
          geo: JSON.parse(geo),
          isPOI: true
        }));
      });
  }

  handleCordinateClick(event: any) {
    console.log(event);
    // console.log(fromLonLat([17.064152399999998, 48.1587654]));  
  }

  xxx(event: any) {
    console.log(event);
  }

  handleAddedPoi(poi: any) {
    console.log(poi);
    bus.$emit('add', {...poi})
  }

  handleSelectedPois({geometry}: any) {
    const { selectedHotel, zoom } = this;
    console.log('selected hotel,', selectedHotel, geometry.coordinates);
    const pois = geometry.coordinates
    
    axios
      .post("http://localhost:8080/api/path", {
        coordinates: selectedHotel,
        zoom,
        pois
      })
      .then(response => {
        console.log(response.data);

        this.path = response.data.map(({ seq, node, name,  geo }: any) => ({
          name: name || seq,
          id: node,
          geo: JSON.parse(geo),
        }));
      });
  }
}
</script>

