<template>
  <b-navbar>
    <template slot="brand">
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <h1 class="title is-1">Rental Dock</h1>
      </b-navbar-item>
    </template>
    <template slot="start">
      <b-navbar-item href="#">Home</b-navbar-item>
      <b-navbar-item href="#">Documentation</b-navbar-item>
      <b-navbar-item>
        <b-input v-model="name"></b-input>
      </b-navbar-item>
    </template>

    <template slot="end">
      <b-navbar-item tag="div">
        <div class="buttons">
          <a class="button is-primary">
            <strong>Sign up</strong>
          </a>
          <a class="button is-light">Log in</a>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Navbar extends Vue {
  private name = "test";
}
</script>