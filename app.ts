import { SelRecord } from './sel'
import { Uploader } from './uploader'
import Vue from 'vue'

const app = new Vue({
    el: '#app',
    data: {
        timezone: SelRecord.timezone,
        raw: '',
        srs: [] as SelRecord[],
        files: [] as string[],
        emsg: ''
    },
    watch: {
        timezone: function () {
            this.srs.forEach((i: SelRecord) => i.change_timezone(this.timezone))
        },
        raw: function () {
            const x = SelRecord.from_raw(this.raw)
            if (x.length == 0) {
                this.emsg = 'no raw sel in file'
            } else {
                this.emsg = ''
                this.srs = x
            }
        }
    }
})

app.raw = `
      |Record|           |GenID|GenID |      |Sensor|        |EvtDir|Event|Event|Event|
  ID  | Type | TimeStamp |(Low)|(High)|EvMRev| Type |Sensor #| Type |Data1|Data2|Data3|
     0|     1|          2|    3|     4|     5|     6|       7|     8|    9|   10|   11|
 0109h|   02h| 5ed08d86h |  20h|   00h|   04h|   01h|     2ch|   81h|  57h|  27h|  28h|
 0e35h|   02h| 00000001h |  20h|   00h|   04h|   07h|     92h|   83h|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     ffh|   02h|  a1h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     ffh|   0ch|  f1h|  ffh|  ffh|
`

new Uploader('raw_file', () => {
    // console.log('clear list')
    while (app.files.length > 0) app.files.pop()
    app.raw = ''
}, (_, name, data) => {
    // console.log('on_file: ' + index + ', ' + name)
    app.files.push(name)
    app.raw += data
}
)