<template>
  <div>
    <vl-map
      :load-tiles-while-animating="true"
      :load-tiles-while-interacting="true"
      style="height: 80vh"
      data-projection="EPSG:4326"
      @click="handleCordinateClick"
      ref="map"
    >
      <vl-view ref="view"
      :zoom.sync="zoom"
      :center.sync="center"
      :rotation.sync="rotation"
      @mounted="viewMounted"
      ></vl-view>

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

      <vl-layer-tile id="osm">
        <vl-source-osm></vl-source-osm>
      </vl-layer-tile>
    </vl-map>
    <CordinationCard
      :zoom="zoom"
      :center="center"
      :rotation="rotation"
      :extent="extent"
      :geolocPosition="geolocPosition"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import CordinationCard from "./CordinationCard.vue";
import MapElementList from "./MapElementList.vue";
import Interaction from "./Interaction.vue";
import axios from "axios";
import { CoordinateList } from "../types";
import debounce from "debounce";
// import {fromLonLat} from 'ol/proj';
import bus from '../bus'
import {transformExtent} from 'ol/proj';

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
  private selectedHotel: CoordinateList = null;
  private path: any = [];
  private extent: any = [];
  private hotelName = null;
    private snackbarTypes = {
    success: {
      type: 'is-success',
      actionText: 'Cool!',
    },
    info: {
      type: 'is-info',
      actionText: 'OK',
    },
    danger: {
      type: 'is-danger',
      actionText: 'Oh no!',
    },
  };
  
  private yyy = debounce(this.updateExtent, 700)

  handlePosition(event: any) {
    console.log(event);

    this.geolocPosition = event;
  }

  created() {
    bus.$on("trip", this.handleSelectedPois);
    bus.$on('search', this.handleSearch);
    bus.$on('hotelname', this.searchByHotelName)
  }


  handleSelectedElement(feature: any) {
    const { zoom } = this;
    const { coordinates } = feature.geometry
    
    this.selectedHotel = feature
    bus.$emit('select', {...feature})
  }

  handleSearch(params: any) {
      axios
      .post("http://localhost:8080/api/search", params)
      .then(response => {
        console.log(response.data);
        this.pois = response.data;
      });
  }

  handleCordinateClick(event: any) {
    console.log(event);
    // console.log(fromLonLat([17.064152399999998, 48.1587654]));  
  }

  findHotels() {
    axios
    .post("http://localhost:8080/api/hotels", { extent: this.extent, hotelName: this.hotelName })
    .then(({data}) => this.points = data)
  }

  searchByHotelName(hotelName: any) {
    this.hotelName = hotelName
    this.findHotels()
  }

  handleAddedPoi(poi: any) {
    console.log(poi);
    bus.$emit('add', {...poi})
  }

  handleSelectedPois(payload: any) {
    const { selectedHotel, zoom } = this;
    console.log('selected hotel,', payload);
    this.showNotification('Looking for path please wait')

    Promise.all(payload.pois.map(poi => axios.post("http://localhost:8080/api/path", {
      coordinates: payload.coordinates,
      pois: [poi]
    })))
    .then(res => res.map((r: any) => r.data))
    .then(mapped => {
      this.path = mapped.reduce((a, b) => [...a, ...b])
      if (this.path.length) {
          this.showNotification('Path found', this.snackbarTypes.success)
        } else {
          this.showNotification('Path not found :(', this.snackbarTypes.danger)
        }
    })
    
    // axios
    //   .post("http://localhost:8080/api/path", {
    //     ...payload,
    //     zoom,
    //   })
    //   .then(({data}) => {
    //     console.log('path',data.length);
    //     this.path = data;
    //     if (data.length) {
    //       this.showNotification('Path found', this.snackbarTypes.success)
    //     } else {
    //       this.showNotification('Path not found :(', this.snackbarTypes.danger)
    //     }
    //   });
  }

  viewMounted() {
    this.updateExtent(true)
  }

  @Watch('center')
  xxx() {
    this.yyy()
  }

  updateExtent(xx: boolean) {
    	const olView = (this.$refs.view as any).$view
      if (olView == null) return
    
      this.extent = transformExtent(olView.calculateExtent(), 'EPSG:3857', 'EPSG:4326')
      !xx && this.findHotels()
    }

   private showNotification(message: string | null, params = this.snackbarTypes.info) {
    this.$buefy.snackbar.open({
      duration: 5000,
      message,
      type: 'is-success',
      position: 'is-top-right',
      actionText: 'OK',
      queue: false,
      ...params,
    });
  } 


}
</script>

