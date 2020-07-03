(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./index", "./index", "./index"], factory);
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
    const index_2 = require("./index");
    const index_3 = require("./index");
    let SelRecord = /** @class */ (() => {
        class SelRecord {
            constructor(a) {
                this.timezone = SelRecord.timezone;
                //  0e37h|   02h| 5ecd80fbh |  20h|   00h|   04h|   07h|     92h|   83h|  01h|  ffh|  ffh|
                this.id = a[0];
                this.record_type = index_2.name_of_sel_rt(a[1]);
                this.time_seconds = a[2];
                this.timestamp = SelRecord.timestamp_with_timezone(this.time_seconds, this.timezone);
                this.generator = (a[3] + a[4] * 0x100).toHexh(4);
                this.event_receiver = a[5].toHexh();
                this.sensor_type = index_2.name_of_st(a[6]);
                this.sensor_num = a[7];
                this.event_direction = ((a[8] >> 7) & 1) == 0 ? 'Assert' : 'Deassert';
                this.event_type = index_2.name_of_et(a[8]);
                this.event_data_field = index_2.p_edf(a[8], a[9]);
                this.event = index_2.p_event(a[8], a[9], a[6]);
                this.event_data2 = a[10];
                this.event_data3 = a[11];
                const st = a[6];
                const et_offset = a[9] & 0xf;
                const need_parse = this.event_data_field.includes('sensor-specific event extension code');
                if (need_parse &&
                    (st in index_1.ipmi.event_data) &&
                    (et_offset in index_1.ipmi.event_data[st])) {
                    const x = index_1.ipmi.event_data[st][et_offset](this);
                    this.event_data2_parsed = x.d2;
                    this.event_data3_parsed = x.d3;
                }
                // console.log(this.event_data2_parsed)
            }
            static from_str(str) {
                //  0e37h|   02h| 5ecd80fbh |  20h|   00h|   04h|   07h|     92h|   83h|  01h|  ffh|  ffh|
                if (str.match(/[0-9a-f]{4}h\| +[0-9a-f]{2}h\| +[0-9a-f]{8}h \|( +[0-9a-f]{2}h\|){8}/)) {
                    return SelRecord.from_raw(str);
                }
                else {
                    const ab = index_3.str2ArrayBuffer(str);
                    const dv = new DataView(ab);
                    if (dv.getUint8(9) == 4) {
                        // this check is not safe
                        return SelRecord.from_bin(ab);
                    }
                    else {
                        return [];
                    }
                }
            }
            static from_ArrayBuffer(ab) {
                const dv = new DataView(ab);
                if (dv.getUint8(9) == 4) {
                    // this check is not safe
                    return SelRecord.from_bin(ab);
                }
                else {
                    return SelRecord.from_raw(index_3.ArrayBuffer2str(ab));
                }
            }
            static from_bin(bin) {
                const dv = new DataView(bin);
                const len = dv.byteLength;
                let offset = 0;
                const x = [];
                while (offset < len) {
                    //  0e37h|   02h| 5ecd80fbh |  20h|   00h|   04h|   07h|     92h|   83h|  01h|  ffh|  ffh|
                    const a = [];
                    a[0] = dv.getUint16(offset, true);
                    a[1] = dv.getUint8(offset + 2);
                    a[2] = dv.getUint32(offset + 3, true);
                    for (let i = 3; i < 12; i++) {
                        a[i] = dv.getUint8(offset + 7 + i - 3);
                    }
                    x.push(new SelRecord(a));
                    offset += 16;
                }
                return x;
            }
            static from_raw(raw) {
                const x = [];
                //  0e37h|   02h| 5ecd80fbh |  20h|   00h|   04h|   07h|     92h|   83h|  01h|  ffh|  ffh|
                raw.split('\n').forEach(i => {
                    if (i.match(/^ *[0-9a-f]{4}h\| +[0-9a-f]{2}h\| +[0-9a-f]{8}h \|( +[0-9a-f]{2}h\|){8}/)) {
                        const a = i.split('|').map(j => parseInt(j.trim(), 16));
                        x.push(new SelRecord(a));
                    }
                });
                return x;
            }
            change_timezone(tz) {
                this.timezone = tz;
                this.timestamp = SelRecord.timestamp_with_timezone(this.time_seconds, this.timezone);
            }
            static timestamp_with_timezone(t, tz) {
                if (t == 0xffffffff) {
                    return t.toHexh();
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