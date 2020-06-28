//       |Record|           |GenID|GenID |      |Sensor|        |EvtDir|Event|Event|Event|
//   ID  | Type | TimeStamp |(Low)|(High)|EvMRev| Type |Sensor #| Type |Data1|Data2|Data3|
//  0e37h|   02h| 5ecd80fbh |  20h|   00h|   04h|   07h|     92h|   83h|  01h|  ffh|  ffh|
//      0|     1|          2|    3|     4|     5|     6|       7|     8|    9|   10|   11|
import { ipmi } from './index'
import { SdrRecordType1 } from './index'
import { name_of_sel_rt, name_of_st, name_of_et, p_edf, p_event } from './index'

export class SelRecord {
    static timezone = 0 - (new Date().getTimezoneOffset() / 60)
    static from_raw(raw: string) {
        const x = [] as SelRecord[]
        raw.split('\n').forEach(i => i.match('^ *[0-9a-f]{4}h') ? x.push(new SelRecord(i)) : null)
        return x
    }

    id: number
    record_type: string
    time_seconds: number
    timestamp: string
    generator: string
    event_receiver: string
    sensor_type: string
    sensor_num: number
    event_direction: string
    event_type: string
    event_data_field: string
    event: string
    event_data2: number
    event_data3: number
    event_data2_parsed?: string
    event_data3_parsed?: string
    sdr?: SdrRecordType1
    timezone = SelRecord.timezone

    constructor(raw: string) {
        //  0e37h|   02h| 5ecd80fbh |  20h|   00h|   04h|   07h|     92h|   83h|  01h|  ffh|  ffh|
        const a = raw.split('|').map(i => parseInt(i.trim(), 16))
        this.id = a[0]
        this.record_type = name_of_sel_rt(a[1])
        this.time_seconds = a[2]
        this.timestamp = SelRecord.timestamp_with_timezone(this.time_seconds, this.timezone)
        this.generator = (a[3] + a[4] * 0x100).toHexh(4)
        this.event_receiver = a[5].toHexh()
        this.sensor_type = name_of_st(a[6])
        this.sensor_num = a[7]
        this.event_direction = ((a[8] >> 7) & 1) == 0 ? 'Assert' : 'Deassert'
        this.event_type = name_of_et(a[8])
        this.event_data_field = p_edf(a[8], a[9])
        this.event = p_event(a[8], a[9], a[6])
        this.event_data2 = a[10]
        this.event_data3 = a[11]
        const st = a[6]
        const et_offset = a[9] & 0xf
        const need_parse = this.event_data_field.includes('sensor-specific event extension code')
        if (need_parse &&
            (st in ipmi.event_data) &&
            (et_offset in ipmi.event_data[st])) {
            const x = ipmi.event_data[st][et_offset](this)
            this.event_data2_parsed = x.d2
            this.event_data3_parsed = x.d3
        }
        // console.log(this.event_data2_parsed)
    }
    change_timezone(tz: number) {
        this.timezone = tz
        this.timestamp = SelRecord.timestamp_with_timezone(this.time_seconds, this.timezone)
    }
    static timestamp_with_timezone(t: number, tz: number) {
        if (t == 0xffffffff) { return t.toHexh() } // invalid
        if (t <= 0x20000000) { return t + 's' } // initialization
        return new Date((t + (tz * 3600)) * 1000).format("yyyy/MM/dd-hh:mm:ss")
    }
}
