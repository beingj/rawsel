<template>
  <v-container fluid>
    <h3>SEL</h3>
    <p>A SEL raw file is downloaded from BMC web, with name like "<strong>RawSELLog</strong>".</p>
    <h3>SDR</h3>
    <p>A SDR bin file is dumped by ipmitool command: <code>ipmitool sdr dump sdr.bin</code></p>
    <h3>SEL and SDR</h3>
    <p>When both SEL and SDR files are provided, sensor names and sensor readings in SEL will be updated with SDR info.</p>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Help",

  data: () => ({
  }),
});
</script>
