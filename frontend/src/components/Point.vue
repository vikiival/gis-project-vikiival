<template>
  <vl-feature>
    <vl-geom-point :coordinates="[38.726634,9.003391]"></vl-geom-point>
  </vl-feature>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Point extends Vue {}
</script>