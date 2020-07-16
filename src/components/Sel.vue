<template>
    <v-container fluid>
        <h2>SEL</h2>
        <div @drop.prevent="add_drop_file" @dragover.prevent>
            <v-file-input
                show-size
                dense
                label="raw SEL file"
                multiple
                chips
                v-model="files"
            ></v-file-input>
        </div>
        <v-data-table
            :headers="headers"
            :items="rows"
            :items-per-page="5000"
            hide-default-footer
            dense
            class="elevation-1"
        >
            <template v-slot:item.sn="{ item }">
                <v-tooltip v-if="item.sm !== undefined" top>
                    <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on">{{ item.sm }}</span>
                    </template>
                    <span>{{ item.sn }}</span>
                </v-tooltip>
                <span v-if="item.sm === undefined">{{ item.sn }}</span>
            </template>
            <template v-slot:item.ed2="{ item }">
                <v-tooltip v-if="item.ed2p !== undefined" top>
                    <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on">{{ item.ed2p }}</span>
                    </template>
                    <span>{{ item.ed2 }}</span>
                </v-tooltip>
                <span v-if="item.ed2p === undefined">{{ item.ed2 }}</span>
            </template>
            <template v-slot:item.ed3="{ item }">
                <v-tooltip v-if="item.ed3p !== undefined" top>
                    <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on">{{ item.ed3p }}</span>
                    </template>
                    <span>{{ item.ed3 }}</span>
                </v-tooltip>
                <span v-if="item.ed3p === undefined">{{ item.ed3 }}</span>
            </template>
        </v-data-table>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue"
import { read_file, Bag } from "./Common"
import { SelRecord, SdrRecord, SdrRecordType1 } from "../ipmi"

export interface sel_row {
    id: number
    rt: string
    ts: string
    ge: string
    st: string
    sn: string
    sm?: string
    ed: string
    et: string
    e: string
    edf: string
    ed2: string
    ed3: string
    ed2p?: string
    ed3p?: string
}

export default Vue.extend({
    name: "Sel",
    props: ["bag"],

    data: () => ({
        headers: [
            {
                text: "ID",
                align: "start",
                sortable: true,
                value: "id"
            },
            { text: "Record Type", value: "rt" },
            { text: "Timestamp", value: "ts" },
            { text: "Generator", value: "ge" },
            { text: "Sensor Type", value: "st" },
            { text: "Sensor # / Name", value: "sn" },
            { text: "Event Dir", value: "ed" },
            { text: "Event Type", value: "et" },
            { text: "Event", value: "e" },
            { text: "Event Data Field", value: "edf" },
            { text: "Event Data 2", value: "ed2" },
            { text: "Event Data 3", value: "ed3" }
        ],
        rows: [] as sel_row[],
        files: [] as File[]
    }),
    methods: {
        add_drop_file(e: DragEvent) {
            // https://github.com/vuetifyjs/vuetify/issues/7836
            // vuetify not support input file drag
            if (e.dataTransfer) {
                this.files = Array.from(e.dataTransfer.files)
            }
        },
        update_sel_with_sdr(
            sels: SelRecord[],
            sdrs: SdrRecord[],
            rows: sel_row[]
        ) {
            // could be type1/2/3, but use type1 for short
            const sdr_has_sensor_num = sdrs.filter(
                (i: SdrRecord) => Object.keys(i).indexOf("sensor_num") >= 0
            ) as SdrRecordType1[]
            //   console.log('update_sel called');
            sels.forEach((selr: SelRecord, index: number) => {
                const sdrr = sdr_has_sensor_num.find(
                    (i) => i.sensor_num === selr.sensor_num
                )
                if (sdrr) {
                    const r = rows[index]
                    //   r.sm = sdrr.sensor_name
                    this.$set(r, "sm", sdrr.sensor_name) // TODO: this line forceupdate, but why. should find a nice way
                    //   console.log(`sname update by set: ${r.sn} => ${r.sm}`);
                    if (selr.event_type === "threshold" && sdrr.reading) {
                        r.ed2p = sdrr.reading(selr.event_data2)
                        r.ed3p = sdrr.reading(selr.event_data3)
                    }
                }
            })
        }
    },
    watch: {
        files() {
            const rows = this.rows
            while (rows.length > 0) {
                rows.pop()
            }
            const bag = this.bag as Bag
            bag.update = undefined

            const on_data = (
                _: number,
                __: string,
                data: string | ArrayBuffer
            ) => {
                // console.log(`index: ${index}, name: ${name}`);
                if (data instanceof ArrayBuffer) {
                    // should not go here, since we read file as_text
                } else {
                    //   console.log(data.substr(0, 100));
                    const sels = SelRecord.from_str(data)

                    sels.forEach((i) => {
                        rows.push({
                            id: i.id,
                            rt: i.record_type,
                            ts: i.timestamp,
                            ge: i.generator,
                            st: i.sensor_type,
                            sn: i.sensor_num.toHexh(),
                            ed: i.event_direction,
                            et: i.event_type,
                            e: i.event,
                            edf: i.event_data_field,
                            ed2: i.event_data2_parsed
                                ? i.event_data2_parsed
                                : i.event_data2.toDecHexh(),
                            ed3: i.event_data3_parsed
                                ? i.event_data3_parsed
                                : i.event_data3.toDecHexh()
                        })
                    })

                    bag.update = () => {
                        if (bag.sdrs) {
                            this.update_sel_with_sdr(sels, bag.sdrs, rows)
                        }
                    }
                    bag.update()
                }
            }

            read_file(this.files, on_data, true)
        }
    }
})
</script>
