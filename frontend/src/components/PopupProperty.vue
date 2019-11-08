<template>
  <div class="message-body">
    <strong>{{label}}</strong>:
    <span>{{ value }}</span>
  </div>
</template>


<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";

@Component
export default class Interaction extends Vue {
  @Prop() label!: string;
  @Prop() value!: any;
}
</script>