(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./index", "./index", "./index", "./index", "./index"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SdrRecordTypeC0 = exports.SdrRecordType12 = exports.SdrRecordType11 = exports.SdrRecordType3 = exports.SdrRecordType2 = exports.SdrRecordType1 = exports.SdrRecord = void 0;
    // import './index'
    const index_1 = require("./index");
    const index_2 = require("./index");
    const index_3 = require("./index");
    const index_4 = require("./index");
    const index_5 = require("./index");
    const SensorUnitTypeCodes = [
        "unspecified",
        "degrees C",
        "degrees F",
        "degrees K",
        "Volts",
        "Amps",
        "Watts",
        "Joules",
        "Coulombs",
        "VA",
        "Nits",
        "lumen",
        "lux",
        "Candela",
        "kPa",
        "PSI",
        "Newton",
        "CFM",
        "RPM",
        "Hz",
        "microsecond",
        "millisecond",
        "second",
        "minute",
        "hour",
        "day",
        "week",
        "mil",
        "inches",
        "feet",
        "cu in",
        "cu feet",
        "mm",
        "cm",
        "m",
        "cu cm",
        "cu m",
        "liters",
        "fluid ounce",
        "radians",
        "steradians",
        "revolutions",
        "cycles",
        "gravities",
        "ounce",
        "pound",
        "ft-lb",
        "oz-in",
        "gauss",
        "gilberts",
        "henry",
        "millihenry",
        "farad",
        "microfarad",
        "ohms",
        "siemens",
        "mole",
        "becquerel",
        "PPM",
        "reserved",
        "Decibels",
        "DbA",
        "DbC",
        "gray",
        "sievert",
        "color temp deg K",
        "bit",
        "kilobit",
        "megabit",
        "gigabit",
        "byte",
        "kilobyte",
        "megabyte",
        "gigabyte",
        "word",
        "dword",
        "qword",
        "line",
        "hit",
        "miss",
        "retry",
        "reset",
        "overrun / overflow",
        "underrun",
        "collision",
        "packets",
        "messages",
        "characters",
        "error",
        "correctable error",
        "uncorrectable error",
        "fatal error",
        "grams"
    ];
    class SdrRecord {
        constructor(dv, offset = 0) {
            this.dv = dv;
            this.offset = offset;
            // this.record_id = buf[offset] + buf[offset + 1] * 0x100
            this.record_id = dv.getUint16(offset, true);
            this.sdr_version = dv.getUint8(offset + 2);
            this.record_type = dv.getUint8(offset + 3);
            this.record_length = dv.getUint8(offset + 4);
            this.next_record = offset + 5 + this.record_length;
        }
        static from(bin) {
            const dv = new DataView(bin);
            let buf_len = dv.byteLength;
            let offset = 0;
            let sdrs = [];
            while (offset < buf_len) {
                if (dv.getUint8(offset + 2) != 0x51) {
                    // sdr_version invalid
                    break;
                }
                let sdr;
                let rt = dv.getUint8(offset + 3);
                if (rt == index_3.SdrRecordType.Full) {
                    sdr = new SdrRecordType1(dv, offset);
                }
                else if (rt == index_3.SdrRecordType.Compact) {
                    sdr = new SdrRecordType2(dv, offset);
                }
                else if (rt == index_3.SdrRecordType.EventOnly) {
                    sdr = new SdrRecordType3(dv, offset);
                }
                else if (rt == index_3.SdrRecordType.FruDeviceLocator) {
                    sdr = new SdrRecordType11(dv, offset);
                }
                else if (rt == index_3.SdrRecordType.ManagementControllerDeviceLocator) {
                    sdr = new SdrRecordType12(dv, offset);
                }
                else if (rt == index_3.SdrRecordType.OEM) {
                    sdr = new SdrRecordTypeC0(dv, offset);
                }
                else {
                    sdr = new SdrRecord(dv, offset);
                }
                sdrs.push(sdr);
                offset = sdr.next_record;
            }
            return sdrs;
        }
        static unit_of(n) {
            if (n >= SensorUnitTypeCodes.length) {
                return n.toHexh();
            }
            return SensorUnitTypeCodes[n];
        }
        static record_type_of(n) {
            return index_5.name_of(index_3.SdrRecordType, n);
        }
        static linear_of(n) {
            return index_5.name_of(index_4.Linearization, n);
        }
        static get_id_string(dv, offset) {
            let len = dv.getUint8(offset) & 0x1f;
            let ns = [];
            for (let i = offset + 1; i < offset + 1 + len; i++) {
                ns.push(dv.getUint8(i));
            }
            return String.fromCharCode.apply(null, ns);
        }
        toString() {
            let s = `id: ${this.record_id}, offset: ${this.offset.toHexh()}, length: ${this.record_length.toHexh()}, rt: ${this.record_type.toHexh()}`;
            if ((this instanceof SdrRecordType1) || (this instanceof SdrRecordType2)) {
                s += `, et: ${this.event_type.toHexh()}, st: ${this.sensor_type_n.toHexh()}, num: ${this.sensor_num.toHexh()}, name(${this.sensor_name.length}): ${this.sensor_name}`;
            }
            return s;
        }
    }
    exports.SdrRecord = SdrRecord;
    class SdrRecordType1 extends SdrRecord {
        constructor(dv, offset = 0) {
            super(dv, offset);
            this.record_type = index_3.SdrRecordType.Full;
            this.sensor_num = dv.getUint8(offset + 7);
            this.sensor_type_n = dv.getUint8(offset + 12);
            this.sensor_type = index_1.SelRecord.sensor_type_of(dv.getUint8(offset + 12));
            this.event_type = dv.getUint8(offset + 13);
            this.unit1 = (dv.getUint8(offset + 20) >> 6) & 3;
            this.unit = SdrRecord.unit_of(dv.getUint8(offset + 21));
            this.linear = dv.getUint8(offset + 23);
            this.m = this.two_complement(dv.getUint8(offset + 24) + (((dv.getUint8(offset + 25) >> 6) & 3) << 8));
            this.b = this.two_complement(dv.getUint8(offset + 26) + ((dv.getUint8(offset + 27) >> 6) & 3) << 8);
            this.rexp = this.two_complement((dv.getUint8(offset + 29) >> 4) & 0xf, 4);
            this.bexp = this.two_complement(dv.getUint8(offset + 29) & 0xf, 4);
            this.reading = SdrRecordType1.get_reading_formula(this);
            this.reading_formula = SdrRecordType1.get_reading_formula_text(this);
            if (this.event_type === index_2.EventType.threshold) {
                this.threshold = {};
                const threshold_mask = dv.getUint16(offset + 18, true);
                if (((threshold_mask >> 13) & 1) === 1) {
                    const v = dv.getUint8(offset + 36);
                    this.threshold.unr = { v: v, s: this.reading(v) };
                }
                if (((threshold_mask >> 12) & 1) === 1) {
                    const v = dv.getUint8(offset + 37);
                    this.threshold.uc = { v: v, s: this.reading(v) };
                }
                if (((threshold_mask >> 11) & 1) === 1) {
                    const v = dv.getUint8(offset + 38);
                    this.threshold.unc = { v: v, s: this.reading(v) };
                }
                if (((threshold_mask >> 10) & 1) === 1) {
                    const v = dv.getUint8(offset + 39);
                    this.threshold.lnr = { v: v, s: this.reading(v) };
                }
                if (((threshold_mask >> 9) & 1) === 1) {
                    const v = dv.getUint8(offset + 40);
                    this.threshold.lc = { v: v, s: this.reading(v) };
                }
                if (((threshold_mask >> 8) & 1) === 1) {
                    const v = dv.getUint8(offset + 41);
                    this.threshold.lnc = { v: v, s: this.reading(v) };
                }
            }
            else {
                const v = [];
                const x = dv.getUint16(offset + 14, true);
                for (let i = 0; i < 16; i++) {
                    if (((x >> i) & 1) === 1)
                        v.push({
                            v: i,
                            s: index_1.SelRecord.event_of(this.event_type, i, this.sensor_type_n)
                        });
                }
                this.event = v;
            }
            this.sensor_name = SdrRecord.get_id_string(dv, offset + 47); // offset of 'id string type/length code'
        }
        two_complement(v, bits = 8) {
            if ((v >> (bits - 1)) == 0) {
                // positive
                return v;
            }
            else {
                // negative
                return v - (1 << bits);
            }
        }
        static get_reading_formula_text_full(sdr) {
            // const f = SdrRecord.linear_of(sdr.linear)
            // return `${f}[(${sdr.m} * x + (${sdr.b} * 10 ^ (${sdr.bexp}))) * 10 ^ (${sdr.rexp})]`
            return `(${sdr.m}x + (${sdr.b} \\\\times 10 ^ {${sdr.bexp}})) \\\\times 10 ^ {${sdr.rexp}}`;
        }
        static get_reading_formula_text(sdr) {
            const f = SdrRecord.linear_of(sdr.linear);
            // return `${f}[(${sdr.m} * x + (${sdr.b} * 10 ^ (${sdr.bexp}))) * 10 ^ (${sdr.rexp})]`
            // return `$$${f}[(${sdr.m} x + (${sdr.b}  \\times 10 ^ {${sdr.bexp}})) \\times 10 ^ {${sdr.rexp}}]$$`
            const f1 = `$$${f}[(${sdr.m} x + (${sdr.b} \\times 10 ^ {${sdr.bexp}})) \\times 10 ^ {${sdr.rexp}}]$$`;
            let m = '';
            // m=1
            if (sdr.m == 1) {
                m = `x`;
            }
            else {
                m = `${sdr.m}x`;
            }
            let b_bexp = '';
            // b=0,1
            // bexp=0,1
            if (sdr.b == 0) {
                b_bexp = '';
            }
            else {
                if (sdr.bexp == 0) {
                    // b x 1
                    if (sdr.b < 0) {
                        b_bexp = `(${sdr.b})`;
                    }
                    else {
                        b_bexp = `${sdr.b}`;
                    }
                }
                else if (sdr.bexp == 1) {
                    // b x 10
                    if (sdr.b == 1) {
                        b_bexp = `10`;
                    }
                    else {
                        if (sdr.b < 0) {
                            b_bexp = `((${sdr.b}) \\times 10)`;
                        }
                        else {
                            // b can't be float
                            // it's safe to transfer: b x 10 => b0
                            // but I don't do it this time
                            b_bexp = `(${sdr.b} \\times 10)`;
                        }
                    }
                }
                else {
                    if (sdr.b == 1) {
                        // 1 x 10 x ?
                        b_bexp = `10 ^ {${sdr.bexp}}`;
                    }
                    else {
                        if (sdr.b < 0) {
                            b_bexp = `((${sdr.b}) \\times 10 ^ {${sdr.bexp}})`;
                        }
                        else {
                            b_bexp = `(${sdr.b} \\times 10 ^ {${sdr.bexp}})`;
                        }
                    }
                }
            }
            let m_b_bexp;
            if (sdr.b == 0) {
                m_b_bexp = m;
            }
            else {
                m_b_bexp = `${m} + ${b_bexp}`;
            }
            let rexp = '';
            // rexp=0,1
            if (sdr.rexp == 0) {
                rexp = '';
            }
            else if (sdr.rexp == 1) {
                rexp = `10`;
            }
            else {
                rexp = `10 ^ {${sdr.rexp}}`;
            }
            let m_b_bexp_r_rexp = '';
            if (sdr.rexp == 0) {
                m_b_bexp_r_rexp = m_b_bexp;
            }
            else {
                if (sdr.b == 0 && sdr.m === 1) {
                    m_b_bexp_r_rexp = `${m_b_bexp} \\times ${rexp}`;
                }
                else {
                    m_b_bexp_r_rexp = `(${m_b_bexp}) \\times ${rexp}`;
                }
            }
            let f2;
            if (f == 'linear') {
                f2 = `$$${m_b_bexp_r_rexp}$$`;
            }
            else {
                f2 = `$$${f}[${m_b_bexp_r_rexp}]$$`;
            }
            // return `${f1} \\(\\Rightarrow\\) ${f2}`
            // return `${f1} $$=$$ ${f2}`
            return f2;
        }
        static get_reading_formula(sdr) {
            return (raw) => {
                let x;
                if (typeof raw == 'string') {
                    x = parseInt(raw);
                }
                else {
                    x = raw;
                }
                if (sdr.unit1 == 2) {
                    x = sdr.two_complement(x);
                }
                // y=L((m*x+(b*power(10,bexp))*power(10,r))
                let y = x;
                x = (sdr.m * x + (sdr.b * Math.pow(10, sdr.bexp))) * Math.pow(10, sdr.rexp);
                // linear, ln, log10, log2, e, exp10, exp2, reciprocal, sqr, cube, sqrt, cubeByNegOne
                if (sdr.linear == index_4.Linearization.linear) {
                    y = x;
                }
                else if (sdr.linear == index_4.Linearization.ln) {
                    y = Math.log(x);
                }
                else if (sdr.linear == index_4.Linearization.log10) {
                    y = Math.log10(x);
                }
                else if (sdr.linear == index_4.Linearization.log2) {
                    y = Math.log2(x);
                }
                else if (sdr.linear == index_4.Linearization.e) {
                    y = Math.exp(x);
                }
                else if (sdr.linear == index_4.Linearization.exp10) {
                    y = Math.pow(10, x);
                }
                else if (sdr.linear == index_4.Linearization.exp2) {
                    y = Math.pow(2, x);
                }
                else if (sdr.linear == index_4.Linearization.reciprocal) {
                    y = Math.pow(x, -1);
                }
                else if (sdr.linear == index_4.Linearization.sqr) {
                    // sqrt = square root.
                    // sqr = square.
                    // sqrt(9) = 3, while sqr(9) = 81.
                    y = Math.pow(x, 2);
                }
                else if (sdr.linear == index_4.Linearization.cube) {
                    y = Math.pow(x, 3);
                }
                else if (sdr.linear == index_4.Linearization.sqrt) {
                    y = Math.sqrt(x);
                }
                else if (sdr.linear == index_4.Linearization.cubeByNegOne) {
                    y = Math.pow(Math.pow(x, 3), -1);
                }
                else {
                    y = x;
                }
                return y.toFixed2(2);
            };
        }
    }
    exports.SdrRecordType1 = SdrRecordType1;
    class SdrRecordType2 extends SdrRecord {
        constructor(dv, offset = 0) {
            super(dv, offset);
            this.record_type = index_3.SdrRecordType.Compact;
            this.sensor_num = dv.getUint8(offset + 7);
            this.sensor_type_n = dv.getUint8(offset + 12);
            this.sensor_type = index_1.SelRecord.sensor_type_of(dv.getUint8(offset + 12));
            this.event_type = dv.getUint8(offset + 13);
            if (this.event_type !== index_2.EventType.threshold) {
                const v = [];
                const x = dv.getUint16(offset + 14, true);
                for (let i = 0; i < 16; i++) {
                    if (((x >> i) & 1) === 1)
                        v.push({
                            v: i,
                            s: index_1.SelRecord.event_of(this.event_type, i, this.sensor_type_n)
                        });
                }
                this.event = v;
            }
            else {
                throw new Error('event_type of SdrRecordType2 should not be threshold');
            }
            this.unit = SdrRecord.unit_of(dv.getUint8(offset + 21));
            this.sensor_name = SdrRecord.get_id_string(dv, offset + 31); // offset of 'id string type/length code'
        }
    }
    exports.SdrRecordType2 = SdrRecordType2;
    class SdrRecordType3 extends SdrRecord {
        constructor(dv, offset = 0) {
            super(dv, offset);
            this.record_type = index_3.SdrRecordType.EventOnly;
            this.sensor_num = dv.getUint8(offset + 7);
            this.sensor_type = index_1.SelRecord.sensor_type_of(dv.getUint8(offset + 10));
            this.event_type = dv.getUint8(offset + 11);
            this.sensor_name = SdrRecord.get_id_string(dv, offset + 16); // offset of 'id string type/length code'
        }
    }
    exports.SdrRecordType3 = SdrRecordType3;
    class SdrRecordType11 extends SdrRecord {
        constructor(dv, offset = 0) {
            super(dv, offset);
            this.record_type = index_3.SdrRecordType.FruDeviceLocator;
            this.sensor_name = SdrRecord.get_id_string(dv, offset + 15); // offset of 'id string type/length code'
        }
    }
    exports.SdrRecordType11 = SdrRecordType11;
    class SdrRecordType12 extends SdrRecord {
        constructor(dv, offset = 0) {
            super(dv, offset);
            this.record_type = index_3.SdrRecordType.ManagementControllerDeviceLocator;
            this.sensor_name = SdrRecord.get_id_string(dv, offset + 15); // offset of 'id string type/length code'
        }
    }
    exports.SdrRecordType12 = SdrRecordType12;
    class SdrRecordTypeC0 extends SdrRecord {
        constructor(dv, offset = 0) {
            super(dv, offset);
            this.record_type = index_3.SdrRecordType.OEM;
            // const a = new Uint8Array(dv.buffer, offset + 5, 3)
            const a = new Uint8Array(dv.buffer, offset + 5, this.next_record - offset - 5);
            const h = [];
            a.forEach(i => h.push(i.toHex()));
            // this.sensor_name = h.join(' ')
            this.sensor_name = `${h.slice(0, 3).join(' ')} / ${h.slice(3).join(' ')}`;
        }
    }
    exports.SdrRecordTypeC0 = SdrRecordTypeC0;
});
//# sourceMappingURL=sdr.js.map