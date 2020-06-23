// import './index'
import { SelRecord } from './index'
import { EventType } from './index'
import { SdrRecordType } from './index'
import { Linearization } from './index'
import { name_of } from './index'

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
]


export class SdrRecord {
    dv: DataView
    offset: number
    record_id: number
    sdr_version: number
    record_type: SdrRecordType
    record_length: number
    next_record: number
    static from(bin: ArrayBuffer | SharedArrayBuffer) {
        const dv = new DataView(bin)
        let buf_len = dv.byteLength
        let offset = 0
        let sdrs = [] as SdrRecord[]
        while (offset < buf_len) {
            if (dv.getUint8(offset + 2) != 0x51) {
                // sdr_version invalid
                break
            }
            let sdr: SdrRecord
            let rt = dv.getUint8(offset + 3)
            if (rt == SdrRecordType.Full) {
                sdr = new SdrRecordType1(dv, offset)
            }
            else if (rt == SdrRecordType.Compact) {
                sdr = new SdrRecordType2(dv, offset)
            }
            else if (rt == SdrRecordType.EventOnly) {
                sdr = new SdrRecordType3(dv, offset)
            }
            else if (rt == SdrRecordType.FruDeviceLocator) {
                sdr = new SdrRecordType11(dv, offset)
            }
            else if (rt == SdrRecordType.ManagementControllerDeviceLocator) {
                sdr = new SdrRecordType12(dv, offset)
            }
            else if (rt == SdrRecordType.OEM) {
                sdr = new SdrRecordTypeC0(dv, offset)
            }
            else {
                sdr = new SdrRecord(dv, offset)
            }
            sdrs.push(sdr)
            offset = sdr.next_record
        }
        return sdrs
    }

    constructor(dv: DataView, offset: number = 0) {
        this.dv = dv
        this.offset = offset
        // this.record_id = buf[offset] + buf[offset + 1] * 0x100
        this.record_id = dv.getUint16(offset, true)
        this.sdr_version = dv.getUint8(offset + 2)
        this.record_type = dv.getUint8(offset + 3)
        this.record_length = dv.getUint8(offset + 4)
        this.next_record = offset + 5 + this.record_length
    }
    static unit_of(n: number) {
        if (n >= SensorUnitTypeCodes.length) {
            return n.toHexh()
        }
        return SensorUnitTypeCodes[n]
    }
    static record_type_of(n: number) {
        return name_of(SdrRecordType, n)
    }
    static linear_of(n: number) {
        return name_of(Linearization, n)
    }
    static get_id_string(dv: DataView, offset: number) {
        let len = dv.getUint8(offset) & 0x1f
        let ns: number[] = []
        for (let i = offset + 1; i < offset + 1 + len; i++) {
            ns.push(dv.getUint8(i))
        }
        return String.fromCharCode.apply(null, ns)
    }
    public toString() {
        return `id: ${this.record_id}, offset: ${this.offset.toHexh()}, length: ${this.record_length}h, rt: ${this.record_type}`
    }
}
interface Thresholds {
    unr?: { v: number, s: string }
    uc?: { v: number, s: string }
    unc?: { v: number, s: string }
    lnr?: { v: number, s: string }
    lc?: { v: number, s: string }
    lnc?: { v: number, s: string }
}

export class SdrRecordType1 extends SdrRecord {
    sensor_num: number
    sensor_name: string
    sensor_type_n: number
    sensor_type: string
    event_type: EventType
    unit1: number
    unit: string
    linear: Linearization
    m: number
    b: number
    rexp: number
    bexp: number
    reading: (x: number | string) => string
    reading_formula: string
    threshold?: Thresholds
    event?: { v: number, s: string }[]

    constructor(dv: DataView, offset: number = 0) {
        super(dv, offset)
        this.record_type = SdrRecordType.Full
        this.sensor_num = dv.getUint8(offset + 7)
        this.sensor_type_n = dv.getUint8(offset + 12)
        this.sensor_type = SelRecord.sensor_type_of(dv.getUint8(offset + 12))
        this.event_type = dv.getUint8(offset + 13)
        this.unit1 = (dv.getUint8(offset + 20) >> 6) & 3
        this.unit = SdrRecord.unit_of(dv.getUint8(offset + 21))
        this.linear = dv.getUint8(offset + 23)
        this.m = this.two_complement(dv.getUint8(offset + 24) + (((dv.getUint8(offset + 25) >> 6) & 3) << 8))
        this.b = this.two_complement(dv.getUint8(offset + 26) + ((dv.getUint8(offset + 27) >> 6) & 3) << 8)
        this.rexp = this.two_complement((dv.getUint8(offset + 29) >> 4) & 0xf, 4)
        this.bexp = this.two_complement(dv.getUint8(offset + 29) & 0xf, 4)
        this.reading = SdrRecordType1.get_reading_formula(this)
        this.reading_formula = SdrRecordType1.get_reading_formula_text(this)
        if (this.event_type === EventType.threshold) {
            this.threshold = {}
            const threshold_mask = dv.getUint16(offset + 18, true)
            if (((threshold_mask >> 13) & 1) === 1) {
                const v = dv.getUint8(offset + 36)
                this.threshold.unr = { v: v, s: this.reading(v) }
            }
            if (((threshold_mask >> 12) & 1) === 1) {
                const v = dv.getUint8(offset + 37)
                this.threshold.uc = { v: v, s: this.reading(v) }
            }
            if (((threshold_mask >> 11) & 1) === 1) {
                const v = dv.getUint8(offset + 38)
                this.threshold.unc = { v: v, s: this.reading(v) }
            }
            if (((threshold_mask >> 10) & 1) === 1) {
                const v = dv.getUint8(offset + 39)
                this.threshold.lnr = { v: v, s: this.reading(v) }
            }
            if (((threshold_mask >> 9) & 1) === 1) {
                const v = dv.getUint8(offset + 40)
                this.threshold.lc = { v: v, s: this.reading(v) }
            }
            if (((threshold_mask >> 8) & 1) === 1) {
                const v = dv.getUint8(offset + 41)
                this.threshold.lnc = { v: v, s: this.reading(v) }
            }
        } else {
            const v: { v: number, s: string }[] = []
            const x = dv.getUint16(offset + 14, true)
            for (let i = 0; i < 16; i++) {
                if (((x >> i) & 1) === 1) v.push({
                    v: i,
                    s: SelRecord.event_of(this.event_type, i, this.sensor_type_n)
                })
            }
            this.event = v
        }
        this.sensor_name = SdrRecord.get_id_string(dv, offset + 47) // offset of 'id string type/length code'
    }
    two_complement(v: number, bits: number = 8) {
        if ((v >> (bits - 1)) == 0) {
            // positive
            return v
        }
        else {
            // negative
            return v - (1 << bits)
        }
    }
    static get_reading_formula_text_full(sdr: SdrRecordType1) {
        const f = SdrRecord.linear_of(sdr.linear)
        // return `${f}[(${sdr.m} * x + (${sdr.b} * 10 ^ (${sdr.bexp}))) * 10 ^ (${sdr.rexp})]`
        // return `(${sdr.m} \\times x + (${sdr.b} \\times 10 ^ (${sdr.bexp}))) \\times 10 ^ (${sdr.rexp})`
        return `(${sdr.m}x + (${sdr.b} \\\\times 10 ^ {${sdr.bexp}})) \\\\times 10 ^ {${sdr.rexp}}`
    }
    static get_reading_formula_text(sdr: SdrRecordType1) {
        const f = SdrRecord.linear_of(sdr.linear)
        // return `${f}[(${sdr.m} * x + (${sdr.b} * 10 ^ (${sdr.bexp}))) * 10 ^ (${sdr.rexp})]`
        // return `$$${f}[(${sdr.m} x + (${sdr.b}  \\times 10 ^ {${sdr.bexp}})) \\times 10 ^ {${sdr.rexp}}]$$`
        const f1 = `$$${f}[(${sdr.m} x + (${sdr.b} \\times 10 ^ {${sdr.bexp}})) \\times 10 ^ {${sdr.rexp}}]$$`

        let m: string = ''
        // m=1
        if (sdr.m == 1) {
            m = `x`
        } else {
            m = `${sdr.m}x`
        }

        let b_bexp: string = ''
        // b=0,1
        // bexp=0,1
        if (sdr.b == 0) {
            b_bexp = ''
        } else {
            if (sdr.bexp == 0) {
                // b x 1
                if (sdr.b < 0) {
                    b_bexp = `(${sdr.b})`
                } else {
                    b_bexp = `${sdr.b}`
                }
            } else if (sdr.bexp == 1) {
                // b x 10
                if (sdr.b == 1) {
                    b_bexp = `10`
                } else {
                    if (sdr.b < 0) {
                        b_bexp = `((${sdr.b}) \\times 10)`
                    } else {
                        // b can't be float
                        // it's safe to transfer: b x 10 => b0
                        // but I don't do it this time
                        b_bexp = `(${sdr.b} \\times 10)`
                    }
                }
            } else {
                if (sdr.b == 1) {
                    // 1 x 10 x ?
                    b_bexp = `10 ^ {${sdr.bexp}}`
                } else {
                    if (sdr.b < 0) {
                        b_bexp = `((${sdr.b}) \\times 10 ^ {${sdr.bexp}})`
                    } else {
                        b_bexp = `(${sdr.b} \\times 10 ^ {${sdr.bexp}})`
                    }
                }
            }
        }
        let m_b_bexp: string
        if (sdr.b == 0) {
            m_b_bexp = m
        } else {
            m_b_bexp = `${m} + ${b_bexp}`
        }

        let rexp = ''
        // rexp=0,1
        if (sdr.rexp == 0) {
            rexp = ''
        } else if (sdr.rexp == 1) {
            rexp = `10`
        } else {
            rexp = `10 ^ {${sdr.rexp}}`
        }

        let m_b_bexp_r_rexp = ''
        if (sdr.rexp == 0) {
            m_b_bexp_r_rexp = m_b_bexp
        } else {
            if (sdr.b == 0 && sdr.m === 1) {
                m_b_bexp_r_rexp = `${m_b_bexp} \\times ${rexp}`
            } else {
                m_b_bexp_r_rexp = `(${m_b_bexp}) \\times ${rexp}`
            }
        }

        let f2: string
        if (f == 'linear') {
            f2 = `$$${m_b_bexp_r_rexp}$$`
        } else {
            f2 = `$$${f}[${m_b_bexp_r_rexp}]$$`
        }
        // return `${f1} \\(\\Rightarrow\\) ${f2}`
        // return `${f1} $$=$$ ${f2}`
        return f2
    }
    static get_reading_formula(sdr: SdrRecordType1) {
        return (raw: number | string) => {
            let x: number
            if (typeof raw == 'string') {
                x = parseInt(raw)
            } else {
                x = raw
            }
            if (sdr.unit1 == 2) {
                x = sdr.two_complement(x)
            }
            // y=L((m*x+(b*power(10,bexp))*power(10,r))
            let y: number = x
            x = (sdr.m * x + (sdr.b * Math.pow(10, sdr.bexp))) * Math.pow(10, sdr.rexp)
            // linear, ln, log10, log2, e, exp10, exp2, reciprocal, sqr, cube, sqrt, cubeByNegOne
            if (sdr.linear == Linearization.linear) {
                y = x
            } else if (sdr.linear == Linearization.ln) {
                y = Math.log(x)
            } else if (sdr.linear == Linearization.log10) {
                y = Math.log10(x)
            } else if (sdr.linear == Linearization.log2) {
                y = Math.log2(x)
            } else if (sdr.linear == Linearization.e) {
                y = Math.exp(x)
            } else if (sdr.linear == Linearization.exp10) {
                y = Math.pow(10, x)
            } else if (sdr.linear == Linearization.exp2) {
                y = Math.pow(2, x)
            } else if (sdr.linear == Linearization.reciprocal) {
                y = Math.pow(x, -1)
            } else if (sdr.linear == Linearization.sqr) {
                // sqrt = square root.
                // sqr = square.
                // sqrt(9) = 3, while sqr(9) = 81.
                y = Math.pow(x, 2)
            } else if (sdr.linear == Linearization.cube) {
                y = Math.pow(x, 3)
            } else if (sdr.linear == Linearization.sqrt) {
                y = Math.sqrt(x)
            } else if (sdr.linear == Linearization.cubeByNegOne) {
                y = Math.pow(Math.pow(x, 3), -1)
            } else {
                y = x
            }
            return y.toFixed2(2)
        }
    }
}

export class SdrRecordType2 extends SdrRecord {
    sensor_num: number
    sensor_name: string
    sensor_type_n: number
    sensor_type: string
    event_type: EventType
    unit: string
    event?: { v: number, s: string }[]
    constructor(dv: DataView, offset: number = 0) {
        super(dv, offset)
        this.record_type = SdrRecordType.Compact
        this.sensor_num = dv.getUint8(offset + 7)
        this.sensor_type_n = dv.getUint8(offset + 12)
        this.sensor_type = SelRecord.sensor_type_of(dv.getUint8(offset + 12))
        this.event_type = dv.getUint8(offset + 13)
        if (this.event_type !== EventType.threshold) {
            const v: { v: number, s: string }[] = []
            const x = dv.getUint16(offset + 14, true)
            for (let i = 0; i < 16; i++) {
                if (((x >> i) & 1) === 1) v.push({
                    v: i,
                    s: SelRecord.event_of(this.event_type, i, this.sensor_type_n)
                })
            }
            this.event = v
        }

        this.unit = SdrRecord.unit_of(dv.getUint8(offset + 21))
        this.sensor_name = SdrRecord.get_id_string(dv, offset + 31) // offset of 'id string type/length code'
    }
}

export class SdrRecordType3 extends SdrRecord {
    sensor_num: number
    sensor_name: string
    sensor_type: string
    event_type: EventType
    constructor(dv: DataView, offset: number = 0) {
        super(dv, offset)
        this.record_type = SdrRecordType.EventOnly
        this.sensor_num = dv.getUint8(offset + 7)
        this.sensor_type = SelRecord.sensor_type_of(dv.getUint8(offset + 10))
        this.event_type = dv.getUint8(offset + 11)
        this.sensor_name = SdrRecord.get_id_string(dv, offset + 16) // offset of 'id string type/length code'
    }
}
export class SdrRecordType11 extends SdrRecord {
    sensor_name: string
    constructor(dv: DataView, offset: number = 0) {
        super(dv, offset)
        this.record_type = SdrRecordType.FruDeviceLocator
        this.sensor_name = SdrRecord.get_id_string(dv, offset + 15) // offset of 'id string type/length code'
    }
}
export class SdrRecordType12 extends SdrRecord {
    sensor_name: string
    constructor(dv: DataView, offset: number = 0) {
        super(dv, offset)
        this.record_type = SdrRecordType.ManagementControllerDeviceLocator
        this.sensor_name = SdrRecord.get_id_string(dv, offset + 15) // offset of 'id string type/length code'
    }
}
export class SdrRecordTypeC0 extends SdrRecord {
    sensor_name: string
    constructor(dv: DataView, offset: number = 0) {
        super(dv, offset)
        this.record_type = SdrRecordType.OEM
        // const a = new Uint8Array(dv.buffer, offset + 5, 3)
        const a = new Uint8Array(dv.buffer, offset + 5, this.next_record - offset - 5)
        const h: string[] = []
        a.forEach(i => h.push(i.toHex()))
        // this.sensor_name = h.join(' ')
        this.sensor_name = `${h.slice(0, 3).join(' ')} / ${h.slice(3).join(' ')}`
    }
}