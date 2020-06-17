//       |Record|           |GenID|GenID |      |Sensor|        |EvtDir|Event|Event|Event|
//   ID  | Type | TimeStamp |(Low)|(High)|EvMRev| Type |Sensor #| Type |Data1|Data2|Data3|
//  0e37h|   02h| 5ecd80fbh |  20h|   00h|   04h|   07h|     92h|   83h|  01h|  ffh|  ffh|
//      0|     1|          2|    3|     4|     5|     6|       7|     8|    9|   10|   11|
import { IPMI_Spec } from './ipmi_spec'
import { SdrRecordType1 } from './sdr'
import './ext'
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
    event_receiver: number
    sensor_type: string
    sensor_num: number
    event_direction: string
    event_type: string
    event_data23: string
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
        this.record_type = this.record_type_of(a[1])
        this.time_seconds = a[2]
        this.timestamp = this.timestamp_with_timezone(this.time_seconds, this.timezone)
        this.generator = this.int_to_hex(a[3] + a[4] * 0x100)
        this.event_receiver = a[5]
        this.sensor_type = this.sensor_type_of(a[6])
        this.sensor_num = a[7]
        this.event_direction = ((a[8] >> 7) & 1) == 0 ? 'Assert' : 'Deassert'
        this.event_type = this.event_type_of(a[8])
        this.event_data23 = this.event_data23_of(a[8], a[9])
        this.event = this.event_of(a[8], a[9], a[6])
        this.event_data2 = a[10]
        this.event_data3 = a[11]
        const st = a[6]
        const et_offset = a[9] & 0xf
        if ((this.event_type == 'sensor-specific') &&
            (st in IPMI_Spec.event_data) &&
            (et_offset in IPMI_Spec.event_data[st])) {
            const x = IPMI_Spec.event_data[st][et_offset](this)
            this.event_data2_parsed = x.d2
            this.event_data3_parsed = x.d3
        }
        // console.log(this.event_data2_parsed)
    }
    int_to_hex(n: number) {
        return (n < 16 ? '0' : '') + n.toString(16) + 'h'
    }
    record_type_of(n: number) {
        if (n == 2) { return 'system event' }
        if ((n >= 0xc0) && (n <= 0xdf)) { return 'OEM timestamped' }
        if ((n >= 0xe0) && (n <= 0xff)) { return 'OEM non-timestamped' }
        return 'unspecified'
    }
    sensor_type_of(n: number) {
        if (n < IPMI_Spec.sensor_type_codes.length) {
            return Object.keys(IPMI_Spec.sensor_type_codes[n])[0]
        }
        if ((n >= 0xc0) && (n <= 0xff)) { return 'OEM' }
        return 'reserved'
    }
    event_type_of(n: number) {
        n = n & 0x7f
        if (n == 0) { return 'unspecified' }
        if (n == 1) { return 'threshold' }
        if ((n >= 0x2) && (n <= 0xc)) { return Object.keys(IPMI_Spec.generic_event_type_codes[n])[0] }
        if (n == 0x6f) { return 'sensor-specific' }
        if ((n >= 0x70) && (n <= 0x7f)) { return 'OEM' }
        // 0dh-6eh
        return 'reserved'
    }
    event_data23_of(et: number, n: number) {
        et = et & 0x7f
        let k: string
        if (et == 1) {
            k = 'threshold'
        } else if ((et >= 0x2) && (et <= 0xc)) {
            k = 'discrete'
        } else if (et == 0x6f) {
            k = 'discrete'
        } else {
            k = 'OEM'
        }
        const b76 = (n >> 6) & 0x3
        const b54 = (n >> 4) & 0x3
        // console.log('n ' + (n >> 4) + ', k ' + k + ', b76 ' + b76 + ', b54 ' + b54)
        return IPMI_Spec.event_data23[k]['b76'][b76] + ', ' + IPMI_Spec.event_data23[k]['b54'][b54]
    }
    event_of(n: number, offset: number, sensor_type: number) {
        n = n & 0x7f
        offset = offset & 0xf

        if (n == 0) {
            return "unspecified"
        }
        if ((n >= 0x1) && (n <= 0xc)) {
            return this.generic_event_of(n, offset)
        }
        if (n == 0x6f) {
            return this.sensor_event_of(sensor_type, offset)
        }

        if ((n >= 0x70) && (n <= 0x7f)) {
            return 'OEM'
        } else {
            // [0xd, 0x6e]
            return 'reserved'
        }
    }
    generic_event_of(n: number, offset: number) {
        const x = IPMI_Spec.generic_event_type_codes[n]
        const name = Object.keys(x)[0]
        const values = Object.values(x)[0]
        if (offset >= values.length) { return 'unspecified' }
        return values[offset]
    }
    sensor_event_of(n: number, offset: number) {
        if (n == 0) { return 'reserved' }
        if ((n >= IPMI_Spec.sensor_type_codes.length) && (n <= 0xc0)) { return 'reserved' }
        if ((n >= 0xc0) && (n <= 0xff)) { return 'OEM' }

        // [01h, IPMI_Spec.sensor_type_codes.length)
        const x = IPMI_Spec.sensor_type_codes[n]
        const name = Object.keys(x)[0]
        const values = Object.values(x)[0]
        if ((n >= 1) && (n <= 4)) { return name }
        // [05h, IPMI_Spec.sensor_type_codes.length)
        if (offset >= values.length) { return 'unspecified' }
        return values[offset]
    }
    change_timezone(tz: number) {
        this.timezone = tz
        this.timestamp = this.timestamp_with_timezone(this.time_seconds, this.timezone)
    }
    timestamp_with_timezone(t: number, tz: number) {
        if (t == 0xffffffff) { return t.toString(16) + 'h' } // invalid
        if (t <= 0x20000000) { return t + 's' } // initialization
        return new Date((t + (tz * 3600)) * 1000).format("yyyy/MM/dd-hh:mm:ss")
    }
}
