<template>
  <b-navbar>
    <template slot="brand">
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <h1 class="title is-1">Path Advisor</h1>
      </b-navbar-item>
    </template>
    <!-- <template slot="start">
      <b-navbar-item href="#">Home</b-navbar-item>
      <b-navbar-item href="#">Documentation</b-navbar-item>
    </template> -->

    <template slot="end">
      <b-navbar-item tag="div">
        <b-input v-model="hotelName" lazy placeholder="Hotel Name"></b-input>
        <div class="buttons">
          <a class="button is-primary" @click="handleHotelName">
            <strong>Search for Hotel</strong>
          </a>
          <a class="button is-light" target="_blank" href="https://github.com/fiit-pdt-2019/gis-project-vikiival">Github</a>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import bus from '../bus'

@Component
export default class Navbar extends Vue {
  private hotelName = null;

  handleHotelName() {
    console.log('handleHotelName');
    
    bus.$emit('hotelname', this.hotelName)
  }
}
</script>

<style scoped>

</style>