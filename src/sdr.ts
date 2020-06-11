import './ext'

export enum SdrRecordType {
    Full = 1,
    Compact = 2,
    EventOnly = 3,
    FruDeviceLocator = 0x11,
    ManagementControllerDeviceLocator = 0x12,
    OEM = 0xc0
}

export enum EventType {
    threshold = 1,
}

export function name_of(myEnum: any, n: number) {
    // https://stackoverflow.com/questions/18111657/how-to-get-names-of-enum-entries/18112157#18112157
    let ns = n.toString(10)
    for (let enumMember in myEnum) {
        if (enumMember == ns) {
            return myEnum[enumMember]
        }
    }
    return `${n.toString(16).padStart(2, '0')}h`
}

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

export enum Linearization {
    linear, ln, log10, log2, e, exp10, exp2, reciprocal, sqr, cube, sqrt, cubeByNegOne
}

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
            return n.toString(16).padStart(2, '0') + 'h'
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
        return `id: ${this.record_id}, offset: ${this.offset.toString(16)}h, length: ${this.record_length}h, rt: ${this.record_type}`
    }
}

export class SdrRecordType1 extends SdrRecord {
    sensor_num: number
    sensor_name: string
    event_type: EventType
    unit1: number
    unit: string
    linear: Linearization
    m: number
    b: number
    rexp: number
    bexp: number
    reading: (x: number | string) => (number | string)
    reading_formula: string

    constructor(dv: DataView, offset: number = 0) {
        super(dv, offset)
        this.record_type = SdrRecordType.Full
        this.sensor_num = dv.getUint8(offset + 7)
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
    static get_reading_formula_text(sdr: SdrRecordType1) {
        const f = SdrRecord.linear_of(sdr.linear)
        return `${f}[(${sdr.m} * x + (${sdr.b} * 10 ^ (${sdr.bexp}))) * 10 ^ (${sdr.rexp})]`
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
            if (Math.floor(y) == y) return y
            // return y.toFixed(2)
            return y.toFixed2(2)
        }
    }
}

export class SdrRecordType2 extends SdrRecord {
    sensor_num: number
    sensor_name: string
    event_type: EventType
    unit: string
    constructor(dv: DataView, offset: number = 0) {
        super(dv, offset)
        this.record_type = SdrRecordType.Compact
        this.sensor_num = dv.getUint8(offset + 7)
        this.event_type = dv.getUint8(offset + 13)
        this.unit = SdrRecord.unit_of(dv.getUint8(offset + 21))
        this.sensor_name = SdrRecord.get_id_string(dv, offset + 31) // offset of 'id string type/length code'
    }
}

export class SdrRecordType3 extends SdrRecord {
    sensor_num: number
    sensor_name: string
    constructor(dv: DataView, offset: number = 0) {
        super(dv, offset)
        this.record_type = SdrRecordType.EventOnly
        this.sensor_num = dv.getUint8(offset + 7)
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
        a.forEach(i => h.push(i.toString(16).padStart(2, '0')))
        // this.sensor_name = h.join(' ')
        this.sensor_name = `${h.slice(0, 3).join(' ')} / ${h.slice(3).join(' ')}`
    }
}