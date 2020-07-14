// import './index'
import { SelRecord } from './index'
import { EventType } from './index'
import { SdrRecordType } from './index'
import { Linearization } from './index'
import { two_complement } from './index'
import { name_of_unit, name_of_linear, name_of_st, p_event } from './index'

export class SdrRecord {
    public static from(bin: ArrayBuffer | SharedArrayBuffer) {
        const dv = new DataView(bin)
        const buf_len = dv.byteLength
        let offset = 0
        const sdrs = [] as SdrRecord[]
        while (offset < buf_len) {
            if (dv.getUint8(offset + 2) !== 0x51) {
                // sdr_version invalid
                break
            }
            let sdr: SdrRecord
            const rt = dv.getUint8(offset + 3)
            if (rt === SdrRecordType.Full) {
                sdr = new SdrRecordType1(dv, offset)
            } else if (rt === SdrRecordType.Compact) {
                sdr = new SdrRecordType2(dv, offset)
            } else if (rt === SdrRecordType.EventOnly) {
                sdr = new SdrRecordType3(dv, offset)
            } else if (rt === SdrRecordType.FruDeviceLocator) {
                sdr = new SdrRecordType11(dv, offset)
            } else if (rt === SdrRecordType.ManagementControllerDeviceLocator) {
                sdr = new SdrRecordType12(dv, offset)
            } else if (rt === SdrRecordType.OEM) {
                sdr = new SdrRecordTypeC0(dv, offset)
            } else {
                sdr = new SdrRecord(dv, offset)
            }
            sdrs.push(sdr)
            offset = sdr.next_record
        }
        return sdrs
    }
    public static get_id_string(dv: DataView, offset: number) {
        const len = dv.getUint8(offset) & 0x1f
        const ns: number[] = []
        for (let i = offset + 1; i < offset + 1 + len; i++) {
            ns.push(dv.getUint8(i))
        }
        return String.fromCharCode.apply(null, ns)
    }
    public dv: DataView
    public offset: number
    public record_id: number
    public sdr_version: number
    public record_type: SdrRecordType
    public record_length: number
    public next_record: number

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
    public toString() {
        let s = `id: ${this.record_id}, offset: ${this.offset.toHexh()}, length: ${this.record_length.toHexh()}, rt: ${this.record_type.toHexh()}`
        if ((this instanceof SdrRecordType1) || (this instanceof SdrRecordType2)) {
            s += `, et: ${this.event_type.toHexh()}, st: ${this.sensor_type_n.toHexh()}, num: ${this.sensor_num.toHexh()}, name(${this.sensor_name.length}): ${this.sensor_name}`
        }
        return s
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
    public sensor_num: number
    public sensor_name: string
    public sensor_type_n: number
    public sensor_type: string
    public event_type: EventType
    public unit1: number
    public signed: boolean
    public unit: string
    public linear: Linearization
    public m: number
    public b: number
    public rexp: number
    public bexp: number
    public reading: (x: number | string) => string
    public reading_formula: string
    public threshold?: Thresholds
    public event?: Array<{ v: number, s: string }>

    constructor(dv: DataView, offset: number = 0) {
        super(dv, offset)
        this.record_type = SdrRecordType.Full
        this.sensor_num = dv.getUint8(offset + 7)
        this.sensor_type_n = dv.getUint8(offset + 12)
        this.sensor_type = name_of_st(dv.getUint8(offset + 12))
        this.event_type = dv.getUint8(offset + 13)
        this.unit1 = (dv.getUint8(offset + 20) >> 6) & 3
        this.signed = (this.unit1 === 1) || (this.unit1 === 2)
        this.unit = name_of_unit(dv.getUint8(offset + 21))
        this.linear = dv.getUint8(offset + 23)
        this.m = two_complement(dv.getUint8(offset + 24) + (((dv.getUint8(offset + 25) >> 6) & 3) << 8))
        this.b = two_complement(dv.getUint8(offset + 26) + ((dv.getUint8(offset + 27) >> 6) & 3) << 8)
        this.rexp = two_complement((dv.getUint8(offset + 29) >> 4) & 0xf, 4)
        this.bexp = two_complement(dv.getUint8(offset + 29) & 0xf, 4)
        if (this.event_type === EventType.threshold) {
            this.threshold = {}
            const threshold_mask = dv.getUint16(offset + 18, true)
            if (((threshold_mask >> 13) & 1) === 1) {
                const v = dv.getUint8(offset + 36)
                this.threshold.unr = { v, s: '' }
            }
            if (((threshold_mask >> 12) & 1) === 1) {
                const v = dv.getUint8(offset + 37)
                this.threshold.uc = { v, s: '' }
            }
            if (((threshold_mask >> 11) & 1) === 1) {
                const v = dv.getUint8(offset + 38)
                this.threshold.unc = { v, s: '' }
            }
            if (((threshold_mask >> 10) & 1) === 1) {
                const v = dv.getUint8(offset + 39)
                this.threshold.lnr = { v, s: '' }
            }
            if (((threshold_mask >> 9) & 1) === 1) {
                const v = dv.getUint8(offset + 40)
                this.threshold.lc = { v, s: '' }
            }
            if (((threshold_mask >> 8) & 1) === 1) {
                const v = dv.getUint8(offset + 41)
                this.threshold.lnc = { v, s: '' }
            }
        } else {
            const v: Array<{ v: number, s: string }> = []
            const x = dv.getUint16(offset + 14, true)
            for (let i = 0; i < 16; i++) {
                if (((x >> i) & 1) === 1) {
                    v.push({
                        v: i,
                        s: p_event(this.event_type, i, this.sensor_type_n),
                    })
                }
            }
            this.event = v
        }
        this.reading = this.get_reading_formula()
        this.reading_formula = this.get_reading_formula_text()
        this.update_threshold()

        this.sensor_name = SdrRecord.get_id_string(dv, offset + 47) // offset of 'id string type/length code'
    }
    public update_formula() {
        // change m/b/bexp/rexp after init, then call this method to update reading formula
        this.reading = this.get_reading_formula()
        this.reading_formula = this.get_reading_formula_text()
        this.update_threshold()
    }
    public update_threshold() {
        const t = this.threshold
        if (t === undefined) { return }
        const thresholds = [t.unr, t.uc, t.unc, t.lnr, t.lc, t.lnc]
        thresholds.forEach((i) => {
            if (i !== undefined) {
                i.s = this.reading(i.v)
            }
        })
    }
    public get_reading_formula_text_full() {
        const sdr = this
        // const f = SdrRecord.linear_of(sdr.linear)
        // return `${f}[(${sdr.m} * x + (${sdr.b} * 10 ^ (${sdr.bexp}))) * 10 ^ (${sdr.rexp})]`
        return `(${sdr.m}x + (${sdr.b} \\\\times 10 ^ {${sdr.bexp}})) \\\\times 10 ^ {${sdr.rexp}}`
    }
    public get_reading_formula_text() {
        const sdr = this
        const f = name_of_linear(sdr.linear)
        // return `${f}[(${sdr.m} * x + (${sdr.b} * 10 ^ (${sdr.bexp}))) * 10 ^ (${sdr.rexp})]`
        // return `$$${f}[(${sdr.m} x + (${sdr.b}  \\times 10 ^ {${sdr.bexp}})) \\times 10 ^ {${sdr.rexp}}]$$`
        const f1 = `$$${f}[(${sdr.m} x + (${sdr.b} \\times 10 ^ {${sdr.bexp}})) \\times 10 ^ {${sdr.rexp}}]$$`

        let m: string = ''
        // m=1
        if (sdr.m === 1) {
            m = `x`
        } else {
            m = `${sdr.m}x`
        }

        let b_bexp: string = ''
        // b=0,1
        // bexp=0,1
        if (sdr.b === 0) {
            b_bexp = ''
        } else {
            if (sdr.bexp === 0) {
                // b x 1
                if (sdr.b < 0) {
                    b_bexp = `(${sdr.b})`
                } else {
                    b_bexp = `${sdr.b}`
                }
            } else if (sdr.bexp === 1) {
                // b x 10
                if (sdr.b === 1) {
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
                if (sdr.b === 1) {
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
        if (sdr.b === 0) {
            m_b_bexp = m
        } else {
            m_b_bexp = `${m} + ${b_bexp}`
        }

        let rexp = ''
        // rexp=0,1
        if (sdr.rexp === 0) {
            rexp = ''
        } else if (sdr.rexp === 1) {
            rexp = `10`
        } else {
            rexp = `10 ^ {${sdr.rexp}}`
        }

        let m_b_bexp_r_rexp = ''
        if (sdr.rexp === 0) {
            m_b_bexp_r_rexp = m_b_bexp
        } else {
            if (sdr.b === 0 && sdr.m === 1) {
                m_b_bexp_r_rexp = `${m_b_bexp} \\times ${rexp}`
            } else {
                m_b_bexp_r_rexp = `(${m_b_bexp}) \\times ${rexp}`
            }
        }

        let f2: string
        if (f === 'linear') {
            f2 = `$$${m_b_bexp_r_rexp}$$`
        } else {
            f2 = `$$${f}[${m_b_bexp_r_rexp}]$$`
        }
        // return `${f1} \\(\\Rightarrow\\) ${f2}`
        // return `${f1} $$=$$ ${f2}`
        return f2
    }
    public get_reading_formula() {
        const sdr = this
        return (raw: number | string) => {
            let x: number
            if (typeof raw === 'string') {
                x = parseInt(raw, undefined)
            } else {
                x = raw
            }
            if (sdr.unit1 === 2) {
                x = two_complement(x)
            }
            // y=L((m*x+(b*power(10,bexp))*power(10,r))
            let y: number = x
            x = (sdr.m * x + (sdr.b * Math.pow(10, sdr.bexp))) * Math.pow(10, sdr.rexp)
            // linear, ln, log10, log2, e, exp10, exp2, reciprocal, sqr, cube, sqrt, cubeByNegOne
            if (sdr.linear === Linearization.linear) {
                y = x
            } else if (sdr.linear === Linearization.ln) {
                y = Math.log(x)
            } else if (sdr.linear === Linearization.log10) {
                y = Math.log10(x)
            } else if (sdr.linear === Linearization.log2) {
                y = Math.log2(x)
            } else if (sdr.linear === Linearization.e) {
                y = Math.exp(x)
            } else if (sdr.linear === Linearization.exp10) {
                y = Math.pow(10, x)
            } else if (sdr.linear === Linearization.exp2) {
                y = Math.pow(2, x)
            } else if (sdr.linear === Linearization.reciprocal) {
                y = Math.pow(x, -1)
            } else if (sdr.linear === Linearization.sqr) {
                // sqrt = square root.
                // sqr = square.
                // sqrt(9) = 3, while sqr(9) = 81.
                y = Math.pow(x, 2)
            } else if (sdr.linear === Linearization.cube) {
                y = Math.pow(x, 3)
            } else if (sdr.linear === Linearization.sqrt) {
                y = Math.sqrt(x)
            } else if (sdr.linear === Linearization.cubeByNegOne) {
                y = Math.pow(Math.pow(x, 3), -1)
            } else {
                y = x
            }
            return y.toFixed2(2)
        }
    }
}

export class SdrRecordType2 extends SdrRecord {
    public sensor_num: number
    public sensor_name: string
    public sensor_type_n: number
    public sensor_type: string
    public event_type: EventType
    public unit: string
    public event?: Array<{ v: number, s: string }>
    constructor(dv: DataView, offset: number = 0) {
        super(dv, offset)
        this.record_type = SdrRecordType.Compact
        this.sensor_num = dv.getUint8(offset + 7)
        this.sensor_type_n = dv.getUint8(offset + 12)
        this.sensor_type = name_of_st(dv.getUint8(offset + 12))
        this.event_type = dv.getUint8(offset + 13)
        if (this.event_type !== EventType.threshold) {
            const v: Array<{ v: number, s: string }> = []
            const x = dv.getUint16(offset + 14, true)
            for (let i = 0; i < 16; i++) {
                if (((x >> i) & 1) === 1) {
                    v.push({
                        v: i,
                        s: p_event(this.event_type, i, this.sensor_type_n),
                    })
                }
            }
            this.event = v
        } else {
            throw new Error('event_type of SdrRecordType2 should not be threshold');
        }

        this.unit = name_of_unit(dv.getUint8(offset + 21))
        this.sensor_name = SdrRecord.get_id_string(dv, offset + 31) // offset of 'id string type/length code'
    }
}

export class SdrRecordType3 extends SdrRecord {
    public sensor_num: number
    public sensor_name: string
    public sensor_type: string
    public event_type: EventType
    constructor(dv: DataView, offset: number = 0) {
        super(dv, offset)
        this.record_type = SdrRecordType.EventOnly
        this.sensor_num = dv.getUint8(offset + 7)
        this.sensor_type = name_of_st(dv.getUint8(offset + 10))
        this.event_type = dv.getUint8(offset + 11)
        this.sensor_name = SdrRecord.get_id_string(dv, offset + 16) // offset of 'id string type/length code'
    }
}
export class SdrRecordType11 extends SdrRecord {
    public sensor_name: string
    constructor(dv: DataView, offset: number = 0) {
        super(dv, offset)
        this.record_type = SdrRecordType.FruDeviceLocator
        this.sensor_name = SdrRecord.get_id_string(dv, offset + 15) // offset of 'id string type/length code'
    }
}
export class SdrRecordType12 extends SdrRecord {
    public sensor_name: string
    constructor(dv: DataView, offset: number = 0) {
        super(dv, offset)
        this.record_type = SdrRecordType.ManagementControllerDeviceLocator
        this.sensor_name = SdrRecord.get_id_string(dv, offset + 15) // offset of 'id string type/length code'
    }
}
export class SdrRecordTypeC0 extends SdrRecord {
    public sensor_name: string
    constructor(dv: DataView, offset: number = 0) {
        super(dv, offset)
        this.record_type = SdrRecordType.OEM
        // const a = new Uint8Array(dv.buffer, offset + 5, 3)
        const a = new Uint8Array(dv.buffer, offset + 5, this.next_record - offset - 5)
        const h: string[] = []
        a.forEach((i) => h.push(i.toHex()))
        // this.sensor_name = h.join(' ')
        this.sensor_name = `${h.slice(0, 3).join(' ')} / ${h.slice(3).join(' ')}`
    }
}
