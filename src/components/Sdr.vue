<template>
  <v-container fluid>
    <h2>SDR</h2>
    <v-text-field label="Raw" v-model="raw"></v-text-field>
    <div @drop.prevent="add_drop_file" @dragover.prevent>
      <v-file-input show-size dense label="bin SDR file" multiple chips v-model="files"></v-file-input>
    </div>
    <v-data-table
      :headers="headers"
      :items="rows"
      :items-per-page="5000"
      hide-default-footer
      dense
      class="elevation-1"
      id="math"
    >
      <template v-slot:item.raw="{ item }">
        <v-text-field v-if="item.raw!==undefined" v-model="item.raw"></v-text-field>
      </template>
      <template v-slot:item.re="{ item }">
        <span v-if="item.rd && item.raw!==''">{{ item.rd(item.raw)}}</span>
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

import { read_file, Bag } from "./Common";
import {
  SdrRecord,
  SdrRecordType1,
  name_of_sdr_rt,
  name_of_et,
  SdrRecordType2,
  SdrRecordType,
  SdrRecordType3,
  SdrRecordType12
} from "../ipmi";

type IReading = (x: number) => string;
interface sdr_row {
  id: number;
  rt: string;
  sn: string;
  sm: string;
  st: string;
  et: string;
  raw?: string;
  si: string;
  fo: string;
  re: string;
  un: string;
  th: string;
  rd?: IReading;
}

export default Vue.extend({
  name: "Sdr",
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
      { text: "Sensor #", value: "sn" },
      { text: "Sensor Name", value: "sm" },
      { text: "Sensor Type", value: "st" },
      { text: "Event Type", value: "et" },
      { text: "Raw", value: "raw" },
      { text: "Signed", value: "si" },
      { text: "Formula", value: "fo" },
      { text: "Reading", value: "re" },
      { text: "Unit", value: "un" },
      { text: "Threshold / Event", value: "th" }
    ],
    rows: [] as sdr_row[],
    files: [] as File[],
    default_raw_reading: 100, // default raw value of sensor reading
    raw: "100"
  }),
  methods: {
    add_drop_file(e: DragEvent) {
      // https://github.com/vuetifyjs/vuetify/issues/7836
      // vuetify not support input file drag
      if (e.dataTransfer) {
        this.files = Array.from(e.dataTransfer.files);
      }
    },
    sorted_threshold(sdr: SdrRecordType1) {
      if (!sdr.threshold) {
        return [];
      }
      const t = sdr.threshold;
      const ts = [t.unr, t.uc, t.unc, t.lnc, t.lc, t.lnr];
      const vs: Array<{ v: number; s: string }> = [];
      ts.forEach((i) => {
        vs.push(i ? i : { v: NaN, s: "-" });
      });
      return vs;
    },
    update_mathjax() {
      this.$nextTick(() => {
        // console.log("update_mathjax")
        // ReferenceError: "MathJax" is not defined
        // https://stackoverflow.com/questions/858181/how-to-check-a-not-defined-variable-in-javascript
        if (typeof MathJax !== "undefined") {
          // if (typeof MathJax.Hub !== "undefined") {
          if (MathJax.Hub) {
            //   console.log('update_mathjax queue');
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, "math"]);
          }
        }
      });
    }
  },
  watch: {
    raw() {
      //   console.log(this.raw);
      this.rows.forEach((r) => {
        if (r.raw !== undefined) {
          r.raw = this.raw;
        }
      });
    },
    files() {
      const rows = this.rows;
      while (rows.length > 0) {
        rows.pop();
      }
      const bag = this.bag as Bag
      bag.sdrs = undefined

      const on_data = (
        index: number,
        name: string,
        data: string | ArrayBuffer
      ) => {
        // console.log(`index: ${index}, name: ${name}`);
        if (data instanceof ArrayBuffer) {
          const sdrs = SdrRecord.from(data);
          bag.sdrs = sdrs
          if (bag.update) {
            // console.log("called from sdr");
            bag.update()
          }

          sdrs.forEach((i) => {
            const row: sdr_row = {
              id: i.record_id,
              rt: name_of_sdr_rt(i.record_type),
              sn: "",
              sm: "",
              st: "",
              et: "",
              si: "",
              fo: "",
              re: "",
              un: "",
              th: ""
            };

            if (
              i instanceof SdrRecordType1 ||
              i instanceof SdrRecordType2 ||
              i instanceof SdrRecordType3
            ) {
              row.sn = i.sensor_num.toHexh();
              row.sm = i.sensor_name;
              row.st = i.sensor_type;
              row.et = name_of_et(i.event_type);

              if (i instanceof SdrRecordType1 || i instanceof SdrRecordType2) {
                if (i.event) {
                  row.th = i.event.map((j) => j.s).join(" | ");
                }

                if (i instanceof SdrRecordType1) {
                  row.un = i.unit;
                  row.raw = this.default_raw_reading.toString(10);
                  row.si = i.signed ? "signed" : "unsigned";
                  row.fo = i.get_reading_formula_text();
                  row.re = i.reading(row.raw);
                  row.rd = i.reading;
                  if (i.threshold) {
                    row.th = this.sorted_threshold(i)
                      .map((j) => j.s)
                      .join(" | ");
                  }
                }
              }
            }

            rows.push(row);
          });

          this.update_mathjax();
        }
      };

      read_file(this.files, on_data, false);
    }
  }
});
</script>
