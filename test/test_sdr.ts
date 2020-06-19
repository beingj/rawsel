import { expect } from 'chai';
import { SdrRecord, SdrRecordType1, SdrRecordType2 } from '../src/ipmi'
import { SdrRecordType, Linearization, name_of } from '../src/ipmi'
import fs from 'fs'
import '../src/ipmi'

const bin_file = 'test/sdr.bin'

function to_ArrayBuffer(buf: Buffer) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}

describe('sdr', () => {
    it('new', () => {
        const dv = new DataView(to_ArrayBuffer(fs.readFileSync(bin_file)))
        let sdr = new SdrRecord(dv)
        // '01 00 51 01 35'
        expect(sdr.record_id).to.equal(1);
        expect(sdr.sdr_version).to.equal(0x51);
        expect(sdr.record_type).to.equal(SdrRecordType.Full);
        expect(sdr.record_length).to.equal(0x35);

        sdr = new SdrRecord(dv, 5 + 0x35)
        // '02 00 51 01 36'
        expect(sdr.record_id).to.equal(2);
        expect(sdr.sdr_version).to.equal(0x51);
        expect(sdr.record_type).to.equal(SdrRecordType.Full);
        expect(sdr.record_length).to.equal(0x36);
    })
    it('show sdr', () => {
        const buf = to_ArrayBuffer(fs.readFileSync(bin_file))
        const sdrs = SdrRecord.from(buf)

        sdrs.forEach(sdr => {
            console.log(sdr.toString())
            if ((sdr instanceof SdrRecordType1) || (sdr instanceof SdrRecordType2)) {
                console.log(`id: ${sdr.record_id}, offset: ${sdr.offset.toString(16)}h, rt: ${sdr.record_type}, num: ${sdr.sensor_num.toString(16)}h, name(${sdr.sensor_name.length}): ${sdr.sensor_name}`)
            }
        })
    })
    it('from', () => {
        const buf = to_ArrayBuffer(fs.readFileSync(bin_file))
        const a = new Uint8Array(buf)
        a[3] = 0xff // record type

        const sdrs = SdrRecord.from(buf)
        expect(sdrs[sdrs.length - 1].record_id).to.equal(0x61)

        let sdr = sdrs[0]
        // '01 00 51 01 35'
        expect(sdr.record_id).to.equal(1);
        expect(sdr.sdr_version).to.equal(0x51);
        expect(sdr.record_type).to.equal(0xff);
        expect(sdr.record_length).to.equal(0x35);

        sdr = sdrs[1]
        // '02 00 51 01 36'
        expect(sdr.record_id).to.equal(2);
        expect(sdr.sdr_version).to.equal(0x51);
        expect(sdr.record_type).to.equal(SdrRecordType.Full);
        expect(sdr.record_length).to.equal(0x36);

        sdr = sdrs[22]
        // '17 00 51 01 26'
        expect(sdr.record_id).to.equal(23);
        expect(sdr.sdr_version).to.equal(0x51);
        expect(sdr.record_type).to.equal(SdrRecordType.Compact);
        expect(sdr.record_length).to.equal(0x26);

    })
    it('reading formula', () => {
        const buf = to_ArrayBuffer(fs.readFileSync(bin_file))
        const sdrs = SdrRecord.from(buf)
            .filter(i => i instanceof SdrRecordType1) as SdrRecordType1[]

        let sdr = sdrs[0]
        // 20 21 22 / 23 24 25 26 27 28 29 30 31
        // 00 01 00 / 00 06 00 00 00 00 f0 07 97
        expect(sdr.unit1).to.equal(0);
        expect(sdr.linear).to.equal(Linearization.linear);
        expect(sdr.m).to.equal(6);
        expect(sdr.b).to.equal(0);
        expect(sdr.rexp).to.equal(-1);
        expect(sdr.bexp).to.equal(0);

        expect(sdr.reading(100)).to.equal('60')
        expect(sdr.reading('0x64')).to.equal('60')

        sdr.unit1 = 2
        // expect(sdr.reading(0xff)).to.equal(-0.60)
        // expected -0.6000000000000001 to equal -0.6
        expect(sdr.reading(0xff)).to.equal('-0.60')
        sdr.unit1 = 1

        // linear, ln, log10, log2, e, exp10, exp2, reciprocal, sqr, cube, sqrt, cubeByNegOne
        sdr.linear = Linearization.ln
        expect(sdr.reading(100)).to.equal(Math.log(60).toFixed2(2))
        sdr.linear = Linearization.log10
        expect(sdr.reading(100)).to.equal(Math.log10(60).toFixed2(2))
        sdr.linear = Linearization.log2
        expect(sdr.reading(100)).to.equal(Math.log2(60).toFixed2(2))
        sdr.linear = Linearization.e
        expect(sdr.reading(100)).to.equal(Math.exp(60).toFixed2(2))
        sdr.linear = Linearization.exp10
        expect(sdr.reading(100)).to.equal(Math.pow(10, 60).toFixed2(2))
        sdr.linear = Linearization.exp2
        expect(sdr.reading(100)).to.equal(Math.pow(2, 60).toFixed2(2))
        sdr.linear = Linearization.reciprocal
        expect(sdr.reading(100)).to.equal(Math.pow(60, -1).toFixed2(2))
        sdr.linear = Linearization.sqr
        expect(sdr.reading(100)).to.equal(Math.pow(60, 2).toFixed2(2))
        sdr.linear = Linearization.cube
        expect(sdr.reading(100)).to.equal(Math.pow(60, 3).toFixed2(2))
        sdr.linear = Linearization.sqrt
        expect(sdr.reading(100)).to.equal(Math.sqrt(60).toFixed2(2))
        sdr.linear = Linearization.cubeByNegOne
        expect(sdr.reading(100)).to.equal(Math.pow(Math.pow(60, 3), -1).toFixed2(2))

        sdr.linear = 0xff
        expect(sdr.reading(100)).to.equal('60')
    })
    it('formula mathjax', () => {
        // TODO: test mathjax
    })
    it('threshold', () => {
        // TODO: test threshold
    })
    it('event offsets', () => {
        // TODO: test event offset
    })
    it('unit_of', () => {
        expect(SdrRecord.unit_of(0x01)).to.equal('degrees C');
        expect(SdrRecord.unit_of(0xff)).to.equal('ffh');
    })
    it('name_of', () => {
        expect(name_of(SdrRecordType, SdrRecordType.Full)).to.equal('Full')
        expect(name_of(SdrRecordType, 0xff)).to.equal('ffh')
    })
    it('record_type_of', () => {
        expect(SdrRecord.record_type_of(SdrRecordType.Full)).to.equal('Full')
        expect(SdrRecord.record_type_of(0xff)).to.equal('ffh')
    })
    it('linear_of', () => {
        expect(SdrRecord.linear_of(Linearization.linear)).to.equal('linear')
        expect(SdrRecord.linear_of(0xff)).to.equal('ffh')
    })

    it("test hex to bin", () => {
        const test_data = `
00000000:	0100	5101	3520	0001
00000008:	0300	7f68	0101	800a
00000010:	807a	3838	0001	0000
`
        const ns: number[] = []
        const hex = test_data.split('\n')
            .filter(i => i.startsWith('0000'))
            .forEach(j => j.split(/\s+/).slice(1)
                .forEach(k => {
                    ns.push(parseInt(k.substr(0, 2), 16))
                    ns.push(parseInt(k.substr(2, 2), 16))
                })
            )
        const bin = String.fromCharCode.apply(null, ns)
        // console.log(bin)
        expect(bin[0]).to.equal('\x01')
        expect(bin[8]).to.equal('\x03')
        expect(bin[11]).to.equal('\x68')
        expect(bin[16]).to.equal('\x80')
        expect(bin[23]).to.equal('\x00')
    })
})