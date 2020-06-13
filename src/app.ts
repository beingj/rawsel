import { SelRecord } from './sel'
import { SdrRecord, SdrRecordType1 } from './sdr'
import { Uploader } from './uploader'
import Vue from 'vue'
import { test_data } from './test_data'

const app = new Vue({
    el: '#app',
    data: {
        loading: true,
        sel: {
            show: true,
            timezone: SelRecord.timezone,
            raw: '',
            sels: [] as SelRecord[],
            files: [] as string[],
            done_files: [] as string[],
            emsg: ''
        },
        sdr: {
            show: true,
            files: [] as string[],
            done_files: [] as string[],
            bin: null as (ArrayBuffer | SdrRecord[] | null),
            sdrs: [] as SdrRecord[],
            raw_reading: [] as number[],
            default_raw_reading: 100, // default raw value of sensor reading
            emsg: '',
            show_formula: true
        }
    },
    methods: {
        update_sel_with_sdr: function () {
            const type1s = this.sdr.sdrs.filter((i: SdrRecord) => i instanceof SdrRecordType1) as SdrRecordType1[]
            this.sel.sels.forEach((selr: SelRecord, idx: number) => {
                const sdrr = type1s.find((i) => i.sensor_num == selr.sensor_num)
                if (sdrr) {
                    selr.sdr = sdrr
                }
            })
        },
        bind_uploader: function () {
            new Uploader('sel_raw_file', (files) => {
                // console.log('clear list')
                const o = this.sel
                while (o.files.length > 0) o.files.pop()
                for (let i = 0; i < files.length; i++) {
                    o.files.push(files[i].name)
                }
                while (o.done_files.length > 0) o.done_files.pop()
                o.raw = ''
            }, (_, name, data) => {
                // console.log('on_file: ' + index + ', ' + name)
                const o = this.sel
                o.done_files.push(name)
                o.raw += data
            })

            new Uploader('sdr_bin_file', (files) => {
                // console.log('clear list')
                const o = this.sdr
                while (o.files.length > 0) o.files.pop()
                for (let i = 0; i < files.length; i++) {
                    o.files.push(files[i].name)
                }
                while (o.done_files.length > 0) o.done_files.pop()
                o.bin = null
            }, (_, name, data) => {
                // console.log(`on_file: ${ name } `)
                const o = this.sdr
                o.done_files.push(name)
                if (data instanceof ArrayBuffer) {
                    o.bin = data
                }
            }, false)
        },
        update_mathjax: function () {
            this.$nextTick(() => {
                // ReferenceError: "MathJax" is not defined
                // https://stackoverflow.com/questions/858181/how-to-check-a-not-defined-variable-in-javascript
                if (typeof MathJax !== "undefined") {
                    // if (typeof MathJax.Hub !== "undefined") {
                    if (MathJax.Hub) {
                        MathJax.Hub.Queue(["Typeset", MathJax.Hub, "math"]);
                    }
                }
            })
        }
    },
    watch: {
        "sel.timezone": function () {
            this.sel.sels.forEach((i: SelRecord) => i.change_timezone(this.sel.timezone))
        },
        "sel.raw": function () {
            const o = this.sel
            if (o.raw == '') return
            const x = SelRecord.from_raw(o.raw)
            if (x.length == 0) {
                o.emsg = 'no raw sel in file'
            } else {
                o.emsg = ''
                o.sels = x
            }
        },
        "sdr.bin": function () {
            const o = this.sdr
            if (!o.bin) return
            let x: SdrRecord[]
            if (o.bin instanceof ArrayBuffer) {
                x = SdrRecord.from(o.bin)
            }
            else {
                x = o.bin
            }

            if (x.length == 0) {
                o.emsg = 'no sdr in file'
            } else {
                o.emsg = ''

                // force formula td re-render to remove the children mathjax elements
                this.sdr.show_formula = false
                o.sdrs = x
                this.sdr.show_formula = true
                this.update_mathjax()

                while (o.raw_reading.length > 0) o.raw_reading.pop()
                x.forEach((i) => {
                    o.raw_reading.push(o.default_raw_reading)
                })
            }
        }
    },
    filters: {
        record_type: function (sdr: SdrRecord) {
            return SdrRecord.record_type_of(sdr.record_type)
        },
        toHex: function (n: number) {
            if ((n == undefined) || (n == null)) return ''
            if (Number.isNaN(n)) return n.toString()
            return n.toString(16).padStart(2, '0') + 'h'
        },
        toDecHex: function (n: number) {
            if ((n == undefined) || (n == null)) return ''
            if (Number.isNaN(n)) return n.toString()
            return `${n.toString(10)} / ${n.toString(16).padStart(2, '0')}h`
        }
    },
    created: function () {
        this.loading = false
    },
    mounted: function () {
        this.sdr.bin = test_data.sdr
        this.sel.raw = test_data.sel
        this.bind_uploader()

        // the following code will not run
        // they are put here to let vscode/tsc intelisense options of MathJax.Hub.Config
        // so we can copy to the Mathjax object in index.html
        if (false) {
            MathJax.Hub.Config({
                // "displayAlign": "left",
                // "skipStartupTypeset": true,
                "showMathMenu": false,
                "styles": {
                    "table#math td span.MJXc-display": {
                        "margin": 0,
                        "color": "blue",
                    }
                }
            })
        }

        // // test slow loading
        // window.setTimeout(() => {
        //     this.loading = false
        //     this.$nextTick(() => {
        //         this.bind_uploader()
        //     })
        // }, 3000)
    }
})
