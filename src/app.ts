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
            emsg: ''
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
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "math"]);
                }
            })
        }
    },
    watch: {
        "sel.timezone": function () {
            this.sel.sels.forEach((i: SelRecord) => i.change_timezone(this.sel.timezone))
        },
        "sel.raw": function () {
            if (this.sel.raw == '') return
            const x = SelRecord.from_raw(this.sel.raw)
            if (x.length == 0) {
                this.sel.emsg = 'no raw sel in file'
            } else {
                this.sel.emsg = ''
                this.sel.sels = x
            }
        },
        "sdr.bin": function () {
            if (!this.sdr.bin) return
            let x: SdrRecord[]
            if (this.sdr.bin instanceof ArrayBuffer) {
                x = SdrRecord.from(this.sdr.bin)
            }
            else {
                x = this.sdr.bin
            }

            if (x.length == 0) {
                this.sdr.emsg = 'no sdr in file'
            } else {
                this.sdr.emsg = ''
                const o = this.sdr
                while (o.raw_reading.length > 0) o.raw_reading.pop()
                this.sdr.sdrs = x
                this.sdr.sdrs.forEach((_) => {
                    this.sdr.raw_reading.push(this.sdr.default_raw_reading)
                })
                this.update_mathjax()
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

        // the following code will not run, cause MathJax === "undefined" at this monent
        // they are put here to let vscode/tsc intelisense options of MathJax.Hub.Config
        // so we can copy the options from here to MathJax.Hub.Config in index.html
        if (typeof MathJax !== "undefined") {
            MathJax.Hub.Config({
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
