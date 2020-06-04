(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./ipmi_spec"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //       |Record|           |GenID|GenID |      |Sensor|        |EvtDir|Event|Event|Event|
    //   ID  | Type | TimeStamp |(Low)|(High)|EvMRev| Type |Sensor #| Type |Data1|Data2|Data3|
    //  0e37h|   02h| 5ecd80fbh |  20h|   00h|   04h|   07h|     92h|   83h|  01h|  ffh|  ffh|
    //      0|     1|          2|    3|     4|     5|     6|       7|     8|    9|   10|   11|
    const ipmi_spec_1 = require("./ipmi_spec");
    class SelRecord {
        constructor(raw) {
            this.timezone = SelRecord.timezone;
            //  0e37h|   02h| 5ecd80fbh |  20h|   00h|   04h|   07h|     92h|   83h|  01h|  ffh|  ffh|
            const a = raw.split('|').map(i => parseInt(i.trim(), 16));
            this.id = a[0];
            this.record_type = this.record_type_of(a[1]);
            this.time_seconds = a[2];
            this.timestamp = this.timestamp_with_timezone(this.time_seconds, this.timezone);
            this.generator = this.int_to_hex(a[3] + a[4] * 0x100);
            this.event_receiver = a[5];
            this.sensor_type = (a[6] < ipmi_spec_1.IPMI_Spec.sensor_type_codes.length) ? Object.keys(ipmi_spec_1.IPMI_Spec.sensor_type_codes[a[6]])[0] : 'undefined';
            this.sensor_num = this.int_to_hex(a[7]);
            this.event_direction = ((a[8] >> 7) & 1) == 0 ? 'Assert' : 'Deassert';
            this.event_type = this.event_type_of(a[8] & 0x7f);
            this.event_data23 = this.event_data23_of(a[9]);
            this.event = this.event_of(a[8] & 0x7f, a[9] & 0xf, a[6]);
            this.event_data2 = a[10];
            this.event_data3 = a[11];
        }
        static from_raw(raw) {
            const x = [];
            raw.split('\n').forEach(i => i.match('^ *[0-9a-f]{4}h') ? x.push(new SelRecord(i)) : null);
            return x;
        }
        int_to_hex(n) {
            return (n < 16 ? '0' : '') + n.toString(16) + 'h';
        }
        record_type_of(n) {
            if (n == 2) {
                return 'system event';
            }
            if ((n >= 0xc0) && (n <= 0xdf)) {
                return 'OEM timestamped';
            }
            if ((n >= 0xe0) && (n <= 0xff)) {
                return 'OEM non-timestamped';
            }
            return 'undefined';
        }
        event_type_of(n) {
            if (n == 1) {
                return 'threshold';
            }
            if ((n >= 0x2) && (n <= 0xc)) {
                return Object.keys(ipmi_spec_1.IPMI_Spec.generic_event_type_codes[n])[0];
            }
            if (n == 0x6f) {
                return 'sensor-specific';
            }
            if ((n >= 0x70) && (n <= 0x7f)) {
                return 'OEM';
            }
            return 'undefined';
        }
        event_data23_of(n) {
            const b76 = (n >> 6) & 0x3;
            const b54 = (n >> 4) & 0x3;
            let k = 'threshold';
            if (this.event_type != 'threshold') {
                k = 'discrete';
            }
            return ipmi_spec_1.IPMI_Spec.event_data23[k]['b76'][b76] + ', ' + ipmi_spec_1.IPMI_Spec.event_data23[k]['b54'][b54];
        }
        event_of(n, offset, sensor_type) {
            if ((n >= 0x1) && (n <= 0xc)) {
                return this.generic_event_of(n, offset);
            }
            if (n == 0x6f) {
                if (sensor_type >= ipmi_spec_1.IPMI_Spec.sensor_type_codes.length) {
                    return 'undefined';
                }
                return this.sensor_event_of(sensor_type, offset);
            }
            return 'undefined';
        }
        generic_event_of(n, offset) {
            if ((n == 0) || (n >= ipmi_spec_1.IPMI_Spec.generic_event_type_codes.length)) {
                return 'undefined';
            }
            const x = ipmi_spec_1.IPMI_Spec.generic_event_type_codes[n];
            const name = Object.keys(x)[0];
            const values = Object.values(x)[0];
            if (offset > values.length) {
                return name + ': undefined';
            }
            return values[offset];
        }
        sensor_event_of(n, offset) {
            if ((n <= 4) || (n >= ipmi_spec_1.IPMI_Spec.sensor_type_codes.length)) {
                return 'undefined';
            }
            const x = ipmi_spec_1.IPMI_Spec.sensor_type_codes[n];
            const name = Object.keys(x)[0];
            const values = Object.values(x)[0];
            if (offset > values.length) {
                return name + ': undefined';
            }
            return values[offset];
        }
        change_timezone(tz) {
            this.timezone = tz;
            this.timestamp = this.timestamp_with_timezone(this.time_seconds, this.timezone);
        }
        timestamp_with_timezone(t, tz) {
            if (t == 0xffffffff) {
                return t.toString(16) + 'h';
            } // invalid
            if (t <= 0x20000000) {
                return t + 's';
            } // initialization
            // return new Date((t + (tz * 3600)) * 1000).pattern("yyyy/MM/dd-hh:mm:ss")
            return this.format_date(new Date((t + (tz * 3600)) * 1000), ("yyyy/MM/dd-hh:mm:ss"));
        }
        format_date(d, fmt) {
            // https://stackoverflow.com/questions/36467469/is-key-value-pair-available-in-typescript/50167055#50167055
            const o = {
                "M+": d.getMonth() + 1,
                "d+": d.getDate(),
                "h+": d.getHours() % 12 == 0 ? 12 : d.getHours() % 12,
                "H+": d.getHours(),
                "m+": d.getMinutes(),
                "s+": d.getSeconds(),
                "q+": Math.floor((d.getMonth() + 3) / 3),
                "S": d.getMilliseconds() //毫秒         
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (let k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k].toString()) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            return fmt;
        }
    }
    SelRecord.timezone = 0 - (new Date().getTimezoneOffset() / 60);
    exports.SelRecord = SelRecord;
});
