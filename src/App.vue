<template>
  <v-app>
    <v-app-bar app color="indigo" dark>
      <v-toolbar-title>SEL Viewer</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="switch_page('sel')">SEL</v-btn>
      <v-btn icon @click="switch_page('sdr')">SDR</v-btn>
      <v-btn icon @click="switch_page('help')">Help</v-btn>
    </v-app-bar>

    <v-main>
      <div v-show="page=='sel'">
        <Sel :bag="bag" />
      </div>
      <div v-show="page=='sdr'">
        <Sdr :bag="bag" />
      </div>
      <div v-show="page=='help'">
        <Help />
      </div>
    </v-main>

    <v-footer color="indigo" app>
      <span class="white--text">&copy; {{ new Date().getFullYear() }} by bj</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Sel from "./components/Sel.vue";
import Sdr from "./components/Sdr.vue";
import Help from "./components/Help.vue";
import { SelRecord, SdrRecord } from "./ipmi";
import { sel_row } from "./components/Sel.vue";
import { Bag } from "./components/Common";

export default Vue.extend({
  name: "App",

  components: {
    Sel,
    Sdr,
    Help
  },

  data: () => ({
    loading: false,
    page: "sel",
    bag: {} as Bag
  }),
  methods: {
    switch_page(page: string) {
      this.page = page;
    }
  },
  created() {
    // test slow loading
    // setTimeout(() => {
    //   this.loading = false
    // }, 5000);
  }
});
</script>
