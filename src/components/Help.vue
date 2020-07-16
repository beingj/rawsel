<template>
    <v-container fluid>
        <h3>SEL</h3>
        <div>
            Two SEL formats are supported:
            <ul>
                <li>
                    A SEL raw file downloaded from BMC web, with name like
                    <strong>RawSELLog</strong>
                </li>
                <li>
                    A SEL bin file <strong>sel.bin</strong> dumped by ipmitool
                    command:
                    <code>ipmitool sel writeraw sel.bin</code>
                </li>
            </ul>
        </div>

        <h3 class="pt-3">SDR</h3>
        <div>
            A SDR bin file is dumped by ipmitool command:
            <code>ipmitool sdr dump sdr.bin</code>
        </div>

        <h3 class="pt-3">SEL and SDR</h3>
        <div>
            When both SEL and SDR files are provided, sensor names and sensor
            readings in SEL will be updated with SDR info.
        </div>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
    name: "Help",

    data: () => ({})
})
</script>
