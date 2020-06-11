import { SelRecord } from './sel'
import { SdrRecord, SdrRecordType1 } from './sdr'
import { Uploader } from './uploader'
import Vue from 'vue'
import { test_data } from './test_data'

const app = new Vue({
    el: '#app',
    data: {
        loading: false,
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
            show: false,
            files: [] as string[],
            done_files: [] as string[],
            sdrs: [] as SdrRecord[],
            raw: [] as number[],
            default_raw: 100 // default raw value of sensor reading
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
        }
    },
    filters: {
        record_type: function (sdr: SdrRecord) {
            return SdrRecord.record_type_of(sdr.record_type)
        },
        sensor_num: function (sdr: SdrRecordType1) {
            return sdr.sensor_num ? sdr.sensor_num.toString(16).padStart(2, '0') + 'h' : ''
        },
        formula: function (sdr: SdrRecordType1) {
            // y=L((m*x+(b*power(10,bexp))*power(10,r))
            const f = SdrRecord.linear_of(sdr.linear)
            return `${f}[(${sdr.m}*x + (${sdr.b} * 10^(${sdr.bexp}))) * 10^(${sdr.rexp})]`
        },
        toFixed: function (v: number) {
            if (Number.isNaN(v)) {
                return '-'
            }
            else {
                if (Math.floor(v) == v) return v
                return v.toFixed(2)
            }
        }
    }
})

app.sel.raw = `
      |Record|           |GenID|GenID |      |Sensor|        |EvtDir|Event|Event|Event|
  ID  | Type | TimeStamp |(Low)|(High)|EvMRev| Type |Sensor #| Type |Data1|Data2|Data3|
     0|     1|          2|    3|     4|     5|     6|       7|     8|    9|   10|   11|
 0109h|   02h| 5ed08d86h |  20h|   00h|   04h|   01h|     2ch|   81h|  57h|  27h|  28h|
 0e35h|   02h| 00000001h |  20h|   00h|   04h|   07h|     92h|   83h|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     ffh|   02h|  a1h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     ffh|   0ch|  f1h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   04h|     ffh|   6fh|  01h|  ffh|  ffh|
`

new Uploader('sel_raw_file', (files) => {
    // console.log('clear list')
    const o = app.sel
    while (o.files.length > 0) o.files.pop()
    for (let i = 0; i < files.length; i++) {
        o.files.push(files[i].name)
    }
    o.raw = ''
    while (o.done_files.length > 0) o.done_files.pop()
}, (_, name, data) => {
    // console.log('on_file: ' + index + ', ' + name)
    const o = app.sel
    o.done_files.push(name)
    o.raw += data
})

new Uploader('sdr_bin_file', (files) => {
    // console.log('clear list')
    const o = app.sdr
    while (o.files.length > 0) o.files.pop()
    for (let i = 0; i < files.length; i++) {
        o.files.push(files[i].name)
    }
    while (o.done_files.length > 0) o.done_files.pop()
    while (o.sdrs.length > 0) o.sdrs.pop()
    while (o.raw.length > 0) o.raw.pop()
}, (_, name, data) => {
    // console.log(`on_file: ${name}`)
    const o = app.sdr
    o.done_files.push(name)
    // console.log(typeof data)
    if (data instanceof ArrayBuffer) {
        SdrRecord.from(data).forEach(sdr => {
            o.sdrs.push(sdr)
            o.raw.push(o.default_raw)
        })
    } else {
    }
}, false)

SdrRecord.from(test_data()).forEach(sdr => {
    app.sdr.sdrs.push(sdr)
    app.sdr.raw.push(app.sdr.default_raw)
})