(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./index"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SelRecord = void 0;
    //       |Record|           |GenID|GenID |      |Sensor|        |EvtDir|Event|Event|Event|
    //   ID  | Type | TimeStamp |(Low)|(High)|EvMRev| Type |Sensor #| Type |Data1|Data2|Data3|
    //  0e37h|   02h| 5ecd80fbh |  20h|   00h|   04h|   07h|     92h|   83h|  01h|  ffh|  ffh|
    //      0|     1|          2|    3|     4|     5|     6|       7|     8|    9|   10|   11|
    const index_1 = require("./index");
    let SelRecord = /** @class */ (() => {
        class SelRecord {
            constructor(raw) {
                this.timezone = SelRecord.timezone;
                //  0e37h|   02h| 5ecd80fbh |  20h|   00h|   04h|   07h|     92h|   83h|  01h|  ffh|  ffh|
                const a = raw.split('|').map(i => parseInt(i.trim(), 16));
                this.id = a[0];
                this.record_type = SelRecord.record_type_of(a[1]);
                this.time_seconds = a[2];
                this.timestamp = SelRecord.timestamp_with_timezone(this.time_seconds, this.timezone);
                this.generator = SelRecord.int_to_hex(a[3] + a[4] * 0x100);
                this.event_receiver = a[5];
                this.sensor_type = SelRecord.sensor_type_of(a[6]);
                this.sensor_num = a[7];
                this.event_direction = ((a[8] >> 7) & 1) == 0 ? 'Assert' : 'Deassert';
                this.event_type = SelRecord.event_type_of(a[8]);
                this.event_data23 = SelRecord.event_data23_of(a[8], a[9]);
                this.event = SelRecord.event_of(a[8], a[9], a[6]);
                this.event_data2 = a[10];
                this.event_data3 = a[11];
                const st = a[6];
                const et_offset = a[9] & 0xf;
                if ((this.event_type == 'sensor-specific') &&
                    (st in index_1.ipmi.event_data) &&
                    (et_offset in index_1.ipmi.event_data[st])) {
                    const x = index_1.ipmi.event_data[st][et_offset](this);
                    this.event_data2_parsed = x.d2;
                    this.event_data3_parsed = x.d3;
                }
                // console.log(this.event_data2_parsed)
            }
            static from_raw(raw) {
                const x = [];
                raw.split('\n').forEach(i => i.match('^ *[0-9a-f]{4}h') ? x.push(new SelRecord(i)) : null);
                return x;
            }
            static int_to_hex(n) {
                return (n < 16 ? '0' : '') + n.toString(16) + 'h';
            }
            static record_type_of(n) {
                if (n == 2) {
                    return 'system event';
                }
                if ((n >= 0xc0) && (n <= 0xdf)) {
                    return 'OEM timestamped';
                }
                if ((n >= 0xe0) && (n <= 0xff)) {
                    return 'OEM non-timestamped';
                }
                return 'unspecified';
            }
            static sensor_type_of(n) {
                if (n < index_1.ipmi.sensor_type_codes.length) {
                    return Object.keys(index_1.ipmi.sensor_type_codes[n])[0];
                }
                if ((n >= 0xc0) && (n <= 0xff)) {
                    return 'OEM';
                }
                return 'reserved';
            }
            static event_type_of(n) {
                n = n & 0x7f;
                if (n == 0) {
                    return 'unspecified';
                }
                if (n == 1) {
                    return 'threshold';
                }
                if ((n >= 0x2) && (n <= 0xc)) {
                    return Object.keys(index_1.ipmi.generic_event_type_codes[n])[0];
                }
                if (n == 0x6f) {
                    return 'sensor-specific';
                }
                if ((n >= 0x70) && (n <= 0x7f)) {
                    return 'OEM';
                }
                // 0dh-6eh
                return 'reserved';
            }
            static event_data23_of(et, n) {
                et = et & 0x7f;
                let k;
                if (et == 1) {
                    k = 'threshold';
                }
                else if ((et >= 0x2) && (et <= 0xc)) {
                    k = 'discrete';
                }
                else if (et == 0x6f) {
                    k = 'discrete';
                }
                else {
                    k = 'OEM';
                }
                const b76 = (n >> 6) & 0x3;
                const b54 = (n >> 4) & 0x3;
                // console.log('n ' + (n >> 4) + ', k ' + k + ', b76 ' + b76 + ', b54 ' + b54)
                return index_1.ipmi.event_data23[k]['b76'][b76] + ', ' + index_1.ipmi.event_data23[k]['b54'][b54];
            }
            static event_of(n, offset, sensor_type) {
                n = n & 0x7f;
                offset = offset & 0xf;
                if (n == 0) {
                    return "unspecified";
                }
                if ((n >= 0x1) && (n <= 0xc)) {
                    return SelRecord.generic_event_of(n, offset);
                }
                if (n == 0x6f) {
                    return SelRecord.sensor_event_of(sensor_type, offset);
                }
                if ((n >= 0x70) && (n <= 0x7f)) {
                    return 'OEM';
                }
                else {
                    // [0xd, 0x6e]
                    return 'reserved';
                }
            }
            static generic_event_of(n, offset) {
                const x = index_1.ipmi.generic_event_type_codes[n];
                const name = Object.keys(x)[0];
                const values = Object.values(x)[0];
                if (offset >= values.length) {
                    return 'unspecified';
                }
                return values[offset];
            }
            static sensor_event_of(n, offset) {
                if (n == 0) {
                    return 'reserved';
                }
                if ((n >= index_1.ipmi.sensor_type_codes.length) && (n <= 0xc0)) {
                    return 'reserved';
                }
                if ((n >= 0xc0) && (n <= 0xff)) {
                    return 'OEM';
                }
                // [01h, IPMI_Spec.sensor_type_codes.length)
                const x = index_1.ipmi.sensor_type_codes[n];
                const name = Object.keys(x)[0];
                const values = Object.values(x)[0];
                if ((n >= 1) && (n <= 4)) {
                    return name;
                }
                // [05h, IPMI_Spec.sensor_type_codes.length)
                if (offset >= values.length) {
                    return 'unspecified';
                }
                return values[offset];
            }
            change_timezone(tz) {
                this.timezone = tz;
                this.timestamp = SelRecord.timestamp_with_timezone(this.time_seconds, this.timezone);
            }
            static timestamp_with_timezone(t, tz) {
                if (t == 0xffffffff) {
                    return t.toString(16) + 'h';
                } // invalid
                if (t <= 0x20000000) {
                    return t + 's';
                } // initialization
                return new Date((t + (tz * 3600)) * 1000).format("yyyy/MM/dd-hh:mm:ss");
            }
        }
        SelRecord.timezone = 0 - (new Date().getTimezoneOffset() / 60);
        return SelRecord;
    })();
    exports.SelRecord = SelRecord;
});
//# sourceMappingURL=sel.js.map