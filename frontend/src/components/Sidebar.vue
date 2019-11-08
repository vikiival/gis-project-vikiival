<template>
  <div class="sidebar-wrapper">
    <header class="card-header">
      <p class="card-header-title">Filters</p>
    </header>
    <div class="filter-wrapper">
      <b-field>
        <b-input v-model="name" placeholder="Hotel Name" rounded expanded></b-input>
      </b-field>
      <b-field>
        <b-taginput
          v-model="selectedOptions"
          :data="tags"
          autocomplete
          :open-on-focus="true"
          field="tag"
          placeholder="Tourism"
        ></b-taginput>
      </b-field>
      <b-field v-if="tags.length" label="In range">
        <b-slider :value="20"></b-slider>
      </b-field>
      <b-button type="is-primary" class="submit-button" rounded>Submit</b-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import axios from "axios";

@Component
export default class Sidebar extends Vue {
  private name: string = "";
  private tags: Array<string> = [];
  private selectedOptions = [];

  mounted() {
    axios
      .get("http://localhost:8080/api/category/tourism")
      .then(response => (this.tags = response.data));
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