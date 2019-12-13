<template>
  <div>
    <b-field>
        <b-input v-model="filterModel.name" placeholder="POI Name" rounded expanded></b-input>
      </b-field>
      <b-field>
        <b-taginput
          v-model="filterModel.options"
          :data="tags"
          autocomplete
          :open-on-focus="true"
          field="tag"
          placeholder="Tourism"
        ></b-taginput>
      </b-field>
      <b-field v-if="tags.length" label="In range (km)">
        <b-slider v-model="filterModel.distance" :min="1" :max="10" ticks lazy></b-slider>
      </b-field>
      <b-button type="is-primary" class="submit-button" rounded @click="handleConfirm">Submit</b-button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";
import axios from "axios";

@Component
export default class SearchFilter extends Vue {
  private filterModel = {
    name: null,
    options: null,
    distance: 2,
  }
  private tags: Array<string> = [];

  mounted() {
    axios
      .get("http://localhost:8080/api/category/tourism")
      .then(response => (this.tags = response.data));
  }

  @Emit("confirm")
  handleConfirm() {
    console.log('confirm', this.filterModel);
    return this.filterModel;
  }
}
</script>

<style scoped>
  
</style>
