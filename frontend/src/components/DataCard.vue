<template>
  <div class="card data-card__wrapper">
    <header class="card-header">
      <p class="card-header-title">{{ item.properties.name }}</p>
      <a class="card-header-icon" title="Close" @click="handleClose">
        <b-icon icon="close"></b-icon>
      </a>
    </header>
    <div class="card-content">
      <div class="content">
        <div>
          <b>Type:</b>
          {{ item.geometry.type }}
        </div>
        <div>
          <b>Coordinates:</b>
          {{ item.geometry.coordinates }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";

@Component
export default class DataCard extends Vue {
  @Prop() item!: any;

  @Emit("close")
  handleClose() {
    console.log('close');
    return this.item.id;
  }
}
</script>

<style scoped>
  .data-card__wrapper {
    margin: 0.5em 0;
  }
</style>
