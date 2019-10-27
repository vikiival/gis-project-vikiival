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
        <b-taginput maxlength="10" :value="['Bulma', 'Vue', 'Buefy']"></b-taginput>
      </b-field>
      <b-field v-if="tags.length" label="In range">
            <b-slider :value="20">
            </b-slider>
        </b-field>
      <b-button type="is-primary" class="submit-button" rounded>Expanded</b-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Sidebar extends Vue {
  private name: string = "";
  private tags: string[] = [];
}
</script>

<style scoped>
.submit-button {
  margin: auto;
}

.filter-wrapper {
  padding: 0.75rem;
}
</style>