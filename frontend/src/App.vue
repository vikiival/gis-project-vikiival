<template>
  <div id="app">
    <Navbar />
    <div class="columns">
      <div class="column is-one-fifth">
        <Sidebar />
      </div>
      <div class="column">
        <Map />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Map from "./components/Map.vue";
import Navbar from "./components/Navbar.vue";
import Sidebar from "./components/Sidebar.vue";

@Component({
  components: {
    Map,
    Navbar,
    Sidebar
  }
})
export default class App extends Vue {

}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}
.column {
  padding: 0.75rem 0;
}

.column.is-one-fifth {
  padding-left: 0.5rem;
}
</style>
