<template>
  <div class="card">
  <header class="card-header">
    <p class="card-header-title">
      Cordinations
    </p>
  </header>
  <div class="card-content">
    <div class="content">
      Zoom: {{ zoom }}
      <br />
      Extent: {{ extent }}
      <br />
      Center: {{ center }}
      <br />
      Rotation: {{ rotation }}
      <br />
      My geolocation: {{ geolocPosition }}
  </div>
</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class CordinationCard extends Vue {
  @Prop() zoom!: number
  @Prop() center!: number[]
  @Prop() rotation!: number
  @Prop() geolocPosition!: number[]
  @Prop() extent!: number[]
}
</script>