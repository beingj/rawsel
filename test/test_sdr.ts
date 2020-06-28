import { expect } from 'chai';
import { SdrRecord, SdrRecordType1, SdrRecordType2, SdrRecordType3, SdrRecordType11, SdrRecordTypeC0, SdrRecordType12, EventType } from '../src/ipmi'
import { SdrRecordType, Linearization, name_of_linear } from '../src/ipmi'
import { hex2ArrayBuffer } from '../src/ipmi'

import '../src/ipmi'

import fs from 'fs'

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
    it('show sdr', () => {
        const buf = to_ArrayBuffer(fs.readFileSync(bin_file))
        const sdrs = SdrRecord.from(buf)
        // sdrs.forEach(sdr => {
        //     console.log(sdr.toString())
        // })
    })
    it('new SdrRecordType1', () => {
        const hex = `
00000000:	0100	5101	3520	0001
00000008:	0300	7f68	0101	800a
00000010:	807a	3838	0001	0000
00000018:	0600	0000	00f0	0797
00000020:	ff00	ff00	4d4b	4200
00000028:	8388	0000	0000	00ca
00000030:	496e	6c65	745f	5465
00000038:	6d70	0200	5101	3620
`
        const dv = new DataView(hex2ArrayBuffer(hex, 0))
        let sdr = new SdrRecord(dv)
        expect(sdr.record_id).to.equal(1);
        expect(sdr.sdr_version).to.equal(0x51);
        expect(sdr.record_type).to.equal(SdrRecordType.Full);
        expect(sdr.record_length).to.equal(0x35);
        let s = 'id: 1, offset: 00h, length: 35h, rt: 01h'
        expect(sdr.toString()).to.equal(s);

        s += ', et: 01h, st: 01h, num: 01h, name(10): Inlet_Temp'
        sdr = new SdrRecordType1(dv)
        expect(sdr.toString()).to.equal(s);
        sdr = new SdrRecordType1(dv, 0)
        expect(sdr.toString()).to.equal(s);
    })
    it('new SdrRecordType2', () => {
        const hex = `
00000508:	6f77	6572	1700	5102
00000510:	2620	0070	0600	6740
00000518:	076f	ab08	0000	ab08
00000520:	c000	0000	0000	0000
00000528:	0000	00cb	4350	5530
00000530:	5f53	7461	7475	7318
`
        const dv = new DataView(hex2ArrayBuffer(hex, 4))
        const sdr = new SdrRecordType2(dv)
        expect(sdr.record_id).to.equal(0x17);
        expect(sdr.sdr_version).to.equal(0x51);
        expect(sdr.record_type).to.equal(SdrRecordType.Compact);
        expect(sdr.record_length).to.equal(0x26);
    })
    it('new SdrRecordType3', () => {
        const hex = `
00000b38:	723b	0051	0316	2000
00000b40:	fe31	0013	6f00	0000
00000b48:	00ca	5043	4945	5f41
00000b50:	6c65	7274
`
        const dv = new DataView(hex2ArrayBuffer(hex, 1))
        const sdr = new SdrRecordType3(dv)
        expect(sdr.record_id).to.equal(0x3b);
        expect(sdr.sdr_version).to.equal(0x51);
        expect(sdr.record_type).to.equal(SdrRecordType.EventOnly);
        expect(sdr.record_length).to.equal(0x16);
    })
    it('new SdrRecordType11', () => {
        const hex = `
00000b78:	0000	0002	4e4d	3e00
00000b80:	5111	1220	0087	0000
00000b88:	0802	0700	00c7	4d42
00000b90:	5f46	5255	30
`
        const dv = new DataView(hex2ArrayBuffer(hex, 6))
        const sdr = new SdrRecordType11(dv)
        expect(sdr.record_id).to.equal(0x3e);
        expect(sdr.sdr_version).to.equal(0x51);
        expect(sdr.record_type).to.equal(SdrRecordType.FruDeviceLocator);
        expect(sdr.record_length).to.equal(0x12);
    })
    it('new SdrRecordType12', () => {
        const hex = `
00000b50:	6c65	7274	3c00	5112
00000b58:	1220	0000	ff00	0000
00000b60:	0000	00c7	4153	5432
00000b68:	3530	303d	0051	c00e
`
        const dv = new DataView(hex2ArrayBuffer(hex, 4))
        const sdr = new SdrRecordType12(dv)
        expect(sdr.record_id).to.equal(0x3c);
        expect(sdr.sdr_version).to.equal(0x51);
        expect(sdr.record_type).to.equal(SdrRecordType.ManagementControllerDeviceLocator);
        expect(sdr.record_length).to.equal(0x12);
    })
    it('new SdrRecordTypeC0', () => {
        const hex = `
00000b68:	3530	303d	0051	c00e
00000b70:	5701	000d	012c	6000
00000b78:	0000	0002	4e4d	3e00
`
        const dv = new DataView(hex2ArrayBuffer(hex, 3))
        const sdr = new SdrRecordTypeC0(dv)
        expect(sdr.record_id).to.equal(0x3d);
        expect(sdr.sdr_version).to.equal(0x51);
        expect(sdr.record_type).to.equal(SdrRecordType.OEM);
        expect(sdr.record_length).to.equal(0x0e);
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

        // sdr_version invalid
        a[2] = 0
        const sdrs2 = SdrRecord.from(buf)
        expect(sdrs2.length).to.equal(0)
        a[2] = 0x51

        a[sdrs[1].next_record + 2] = 0
        const sdrs3 = SdrRecord.from(buf)
        expect(sdrs3.length).to.equal(2)
    })
    it('reading formula', () => {
        const hex = `
00000000:	0100	5101	3520	0001
00000008:	0300	7f68	0101	800a
00000010:	807a	3838	0001	0000
00000018:	0600	0000	00f0	0797
00000020:	ff00	ff00	4d4b	4200
00000028:	8388	0000	0000	00ca
00000030:	496e	6c65	745f	5465
00000038:	6d70	0200	5101	3620
`
        const dv = new DataView(hex2ArrayBuffer(hex, 0))
        const sdr = new SdrRecordType1(dv)
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
    it('formula text full', () => {
        const hex = `
00000000:	0100	5101	3520	0001
00000008:	0300	7f68	0101	800a
00000010:	807a	3838	0001	0000
00000018:	0600	0000	00f0	0797
00000020:	ff00	ff00	4d4b	4200
00000028:	8388	0000	0000	00ca
00000030:	496e	6c65	745f	5465
00000038:	6d70	0200	5101	3620
`
        const dv = new DataView(hex2ArrayBuffer(hex, 0))
        let sdr = new SdrRecordType1(dv)

        sdr.m = 1; sdr.b = 0; sdr.bexp = 0; sdr.rexp = 0
        // (1x + (0 \\times 10 ^ {0})) \\times 10 ^ {0}
        expect(sdr.get_reading_formula_text_full()).to.equal(`(1x + (0 \\\\times 10 ^ {0})) \\\\times 10 ^ {0}`)
    })
    it('formula mathjax', () => {
        const hex = `
00000000:	0100	5101	3520	0001
00000008:	0300	7f68	0101	800a
00000010:	807a	3838	0001	0000
00000018:	0600	0000	00f0	0797
00000020:	ff00	ff00	4d4b	4200
00000028:	8388	0000	0000	00ca
00000030:	496e	6c65	745f	5465
00000038:	6d70	0200	5101	3620
`
        const dv = new DataView(hex2ArrayBuffer(hex, 0))
        const sdr = new SdrRecordType1(dv)

        // const ms = [1, 2]
        // const bs = [0, 1, 2]
        // const bes = [0, 1, 2]
        // const res = [0, 1, 2]
        // ms.forEach(m => {
        //     bs.forEach(b => {
        //         bes.forEach(be => {
        //             res.forEach(re => {
        //                 sdr.m = m; sdr.b = b; sdr.bexp = be; sdr.rexp = re
        //                 const ff = SdrRecordType1.get_reading_formula_text_full(sdr)
        //                 console.log(`sdr.m=${m};sdr.b=${b};sdr.bexp=${be};sdr.rexp=${re}`);
        //                 console.log(`// ${ff}`);
        //                 console.log(`expect(sdr.get_reading_formula_text()).to.equal(\`$$${ff}$$\`)`);
        //             })
        //         })
        //     })
        // });

        sdr.m = 1; sdr.b = 0; sdr.bexp = 0; sdr.rexp = 0
        // (1x + (0 \\times 10 ^ {0})) \\times 10 ^ {0}
        expect(sdr.get_reading_formula_text()).to.equal(`$$x$$`)
        sdr.m = 1; sdr.b = 0; sdr.bexp = 0; sdr.rexp = 1
        // (1x + (0 \\times 10 ^ {0})) \\times 10 ^ {1}
        expect(sdr.get_reading_formula_text()).to.equal(`$$x \\times 10$$`)
        sdr.m = 1; sdr.b = 0; sdr.bexp = 0; sdr.rexp = 2
        // (1x + (0 \\times 10 ^ {0})) \\times 10 ^ {2}
        expect(sdr.get_reading_formula_text()).to.equal(`$$x \\times 10 ^ {2}$$`)
        sdr.m = 1; sdr.b = 0; sdr.bexp = 1; sdr.rexp = 0
        // (1x + (0 \\times 10 ^ {1})) \\times 10 ^ {0}
        expect(sdr.get_reading_formula_text()).to.equal(`$$x$$`)
        sdr.m = 1; sdr.b = 0; sdr.bexp = 1; sdr.rexp = 1
        // (1x + (0 \\times 10 ^ {1})) \\times 10 ^ {1}
        expect(sdr.get_reading_formula_text()).to.equal(`$$x \\times 10$$`)
        sdr.m = 1; sdr.b = 0; sdr.bexp = 1; sdr.rexp = 2
        // (1x + (0 \\times 10 ^ {1})) \\times 10 ^ {2}
        expect(sdr.get_reading_formula_text()).to.equal(`$$x \\times 10 ^ {2}$$`)
        sdr.m = 1; sdr.b = 0; sdr.bexp = 2; sdr.rexp = 0
        // (1x + (0 \\times 10 ^ {2})) \\times 10 ^ {0}
        expect(sdr.get_reading_formula_text()).to.equal(`$$x$$`)
        sdr.m = 1; sdr.b = 0; sdr.bexp = 2; sdr.rexp = 1
        // (1x + (0 \\times 10 ^ {2})) \\times 10 ^ {1}
        expect(sdr.get_reading_formula_text()).to.equal(`$$x \\times 10$$`)
        sdr.m = 1; sdr.b = 0; sdr.bexp = 2; sdr.rexp = 2
        // (1x + (0 \\times 10 ^ {2})) \\times 10 ^ {2}
        expect(sdr.get_reading_formula_text()).to.equal(`$$x \\times 10 ^ {2}$$`)
        sdr.m = 1; sdr.b = 1; sdr.bexp = 0; sdr.rexp = 0
        // (1x + (1 \\times 10 ^ {0})) \\times 10 ^ {0}
        expect(sdr.get_reading_formula_text()).to.equal(`$$x + 1$$`)
        sdr.m = 1; sdr.b = 1; sdr.bexp = 0; sdr.rexp = 1
        // (1x + (1 \\times 10 ^ {0})) \\times 10 ^ {1}
        expect(sdr.get_reading_formula_text()).to.equal(`$$(x + 1) \\times 10$$`)
        sdr.m = 1; sdr.b = 1; sdr.bexp = 0; sdr.rexp = 2
        // (1x + (1 \\times 10 ^ {0})) \\times 10 ^ {2}
        expect(sdr.get_reading_formula_text()).to.equal(`$$(x + 1) \\times 10 ^ {2}$$`)
        sdr.m = 1; sdr.b = 1; sdr.bexp = 1; sdr.rexp = 0
        // (1x + (1 \\times 10 ^ {1})) \\times 10 ^ {0}
        expect(sdr.get_reading_formula_text()).to.equal(`$$x + 10$$`)
        sdr.m = 1; sdr.b = 1; sdr.bexp = 1; sdr.rexp = 1
        // (1x + (1 \\times 10 ^ {1})) \\times 10 ^ {1}
        expect(sdr.get_reading_formula_text()).to.equal(`$$(x + 10) \\times 10$$`)
        sdr.m = 1; sdr.b = 1; sdr.bexp = 1; sdr.rexp = 2
        // (1x + (1 \\times 10 ^ {1})) \\times 10 ^ {2}
        expect(sdr.get_reading_formula_text()).to.equal(`$$(x + 10) \\times 10 ^ {2}$$`)
        sdr.m = 1; sdr.b = 1; sdr.bexp = 2; sdr.rexp = 0
        // (1x + (1 \\times 10 ^ {2})) \\times 10 ^ {0}
        expect(sdr.get_reading_formula_text()).to.equal(`$$x + 10 ^ {2}$$`)
        sdr.m = 1; sdr.b = 1; sdr.bexp = 2; sdr.rexp = 1
        // (1x + (1 \\times 10 ^ {2})) \\times 10 ^ {1}
        expect(sdr.get_reading_formula_text()).to.equal(`$$(x + 10 ^ {2}) \\times 10$$`)
        sdr.m = 1; sdr.b = 1; sdr.bexp = 2; sdr.rexp = 2
        // (1x + (1 \\times 10 ^ {2})) \\times 10 ^ {2}
        expect(sdr.get_reading_formula_text()).to.equal(`$$(x + 10 ^ {2}) \\times 10 ^ {2}$$`)
        sdr.m = 1; sdr.b = 2; sdr.bexp = 0; sdr.rexp = 0
        // (1x + (2 \\times 10 ^ {0})) \\times 10 ^ {0}
        expect(sdr.get_reading_formula_text()).to.equal(`$$x + 2$$`)
        sdr.m = 1; sdr.b = 2; sdr.bexp = 0; sdr.rexp = 1
        // (1x + (2 \\times 10 ^ {0})) \\times 10 ^ {1}
        expect(sdr.get_reading_formula_text()).to.equal(`$$(x + 2) \\times 10$$`)
        sdr.m = 1; sdr.b = 2; sdr.bexp = 0; sdr.rexp = 2
        // (1x + (2 \\times 10 ^ {0})) \\times 10 ^ {2}
        expect(sdr.get_reading_formula_text()).to.equal(`$$(x + 2) \\times 10 ^ {2}$$`)
        sdr.m = 1; sdr.b = 2; sdr.bexp = 1; sdr.rexp = 0
        // (1x + (2 \\times 10 ^ {1})) \\times 10 ^ {0}
        expect(sdr.get_reading_formula_text()).to.equal(`$$x + (2 \\times 10)$$`)
        sdr.m = 1; sdr.b = 2; sdr.bexp = 1; sdr.rexp = 1
        // (1x + (2 \\times 10 ^ {1})) \\times 10 ^ {1}
        expect(sdr.get_reading_formula_text()).to.equal(`$$(x + (2 \\times 10)) \\times 10$$`)
        sdr.m = 1; sdr.b = 2; sdr.bexp = 1; sdr.rexp = 2
        // (1x + (2 \\times 10 ^ {1})) \\times 10 ^ {2}
        expect(sdr.get_reading_formula_text()).to.equal(`$$(x + (2 \\times 10)) \\times 10 ^ {2}$$`)
        sdr.m = 1; sdr.b = 2; sdr.bexp = 2; sdr.rexp = 0
        // (1x + (2 \\times 10 ^ {2})) \\times 10 ^ {0}
        expect(sdr.get_reading_formula_text()).to.equal(`$$x + (2 \\times 10 ^ {2})$$`)
        sdr.m = 1; sdr.b = 2; sdr.bexp = 2; sdr.rexp = 1
        // (1x + (2 \\times 10 ^ {2})) \\times 10 ^ {1}
        expect(sdr.get_reading_formula_text()).to.equal(`$$(x + (2 \\times 10 ^ {2})) \\times 10$$`)
        sdr.m = 1; sdr.b = 2; sdr.bexp = 2; sdr.rexp = 2
        // (1x + (2 \\times 10 ^ {2})) \\times 10 ^ {2}
        expect(sdr.get_reading_formula_text()).to.equal(`$$(x + (2 \\times 10 ^ {2})) \\times 10 ^ {2}$$`)
        sdr.m = 2; sdr.b = 0; sdr.bexp = 0; sdr.rexp = 0
        // (2x + (0 \\times 10 ^ {0})) \\times 10 ^ {0}
        expect(sdr.get_reading_formula_text()).to.equal(`$$2x$$`)
        sdr.m = 2; sdr.b = 0; sdr.bexp = 0; sdr.rexp = 1
        // (2x + (0 \\times 10 ^ {0})) \\times 10 ^ {1}
        expect(sdr.get_reading_formula_text()).to.equal(`$$(2x) \\times 10$$`)
        sdr.m = 2; sdr.b = 0; sdr.bexp = 0; sdr.rexp = 2
        // (2x + (0 \\times 10 ^ {0})) \\times 10 ^ {2}
        expect(sdr.get_reading_formula_text()).to.equal(`$$(2x) \\times 10 ^ {2}$$`)
        sdr.m = 2; sdr.b = 0; sdr.bexp = 1; sdr.rexp = 0
        // (2x + (0 \\times 10 ^ {1})) \\times 10 ^ {0}
        expect(sdr.get_reading_formula_text()).to.equal(`$$2x$$`)
        sdr.m = 2; sdr.b = 0; sdr.bexp = 1; sdr.rexp = 1
        // (2x + (0 \\times 10 ^ {1})) \\times 10 ^ {1}
        expect(sdr.get_reading_formula_text()).to.equal(`$$(2x) \\times 10$$`)
        sdr.m = 2; sdr.b = 0; sdr.bexp = 1; sdr.rexp = 2
        // (2x + (0 \\times 10 ^ {1})) \\times 10 ^ {2}
        expect(sdr.get_reading_formula_text()).to.equal(`$$(2x) \\times 10 ^ {2}$$`)
        sdr.m = 2; sdr.b = 0; sdr.bexp = 2; sdr.rexp = 0
        // (2x + (0 \\times 10 ^ {2})) \\times 10 ^ {0}
        expect(sdr.get_reading_formula_text()).to.equal(`$$2x$$`)
        sdr.m = 2; sdr.b = 0; sdr.bexp = 2; sdr.rexp = 1
        // (2x + (0 \\times 10 ^ {2})) \\times 10 ^ {1}
        expect(sdr.get_reading_formula_text()).to.equal(`$$(2x) \\times 10$$`)
        sdr.m = 2; sdr.b = 0; sdr.bexp = 2; sdr.rexp = 2
        // (2x + (0 \\times 10 ^ {2})) \\times 10 ^ {2}
        expect(sdr.get_reading_formula_text()).to.equal(`$$(2x) \\times 10 ^ {2}$$`)
        sdr.m = 2; sdr.b = 1; sdr.bexp = 0; sdr.rexp = 0
        // (2x + (1 \\times 10 ^ {0})) \\times 10 ^ {0}
        expect(sdr.get_reading_formula_text()).to.equal(`$$2x + 1$$`)
        sdr.m = 2; sdr.b = 1; sdr.bexp = 0; sdr.rexp = 1
        // (2x + (1 \\times 10 ^ {0})) \\times 10 ^ {1}
        expect(sdr.get_reading_formula_text()).to.equal(`$$(2x + 1) \\times 10$$`)
        sdr.m = 2; sdr.b = 1; sdr.bexp = 0; sdr.rexp = 2
        // (2x + (1 \\times 10 ^ {0})) \\times 10 ^ {2}
        expect(sdr.get_reading_formula_text()).to.equal(`$$(2x + 1) \\times 10 ^ {2}$$`)
        sdr.m = 2; sdr.b = 1; sdr.bexp = 1; sdr.rexp = 0
        // (2x + (1 \\times 10 ^ {1})) \\times 10 ^ {0}
        expect(sdr.get_reading_formula_text()).to.equal(`$$2x + 10$$`)
        sdr.m = 2; sdr.b = 1; sdr.bexp = 1; sdr.rexp = 1
        // (2x + (1 \\times 10 ^ {1})) \\times 10 ^ {1}
        expect(sdr.get_reading_formula_text()).to.equal(`$$(2x + 10) \\times 10$$`)
        sdr.m = 2; sdr.b = 1; sdr.bexp = 1; sdr.rexp = 2
        // (2x + (1 \\times 10 ^ {1})) \\times 10 ^ {2}
        expect(sdr.get_reading_formula_text()).to.equal(`$$(2x + 10) \\times 10 ^ {2}$$`)
        sdr.m = 2; sdr.b = 1; sdr.bexp = 2; sdr.rexp = 0
        // (2x + (1 \\times 10 ^ {2})) \\times 10 ^ {0}
        expect(sdr.get_reading_formula_text()).to.equal(`$$2x + 10 ^ {2}$$`)
        sdr.m = 2; sdr.b = 1; sdr.bexp = 2; sdr.rexp = 1
        // (2x + (1 \\times 10 ^ {2})) \\times 10 ^ {1}
        expect(sdr.get_reading_formula_text()).to.equal(`$$(2x + 10 ^ {2}) \\times 10$$`)
        sdr.m = 2; sdr.b = 1; sdr.bexp = 2; sdr.rexp = 2
        // (2x + (1 \\times 10 ^ {2})) \\times 10 ^ {2}
        expect(sdr.get_reading_formula_text()).to.equal(`$$(2x + 10 ^ {2}) \\times 10 ^ {2}$$`)
        sdr.m = 2; sdr.b = 2; sdr.bexp = 0; sdr.rexp = 0
        // (2x + (2 \\times 10 ^ {0})) \\times 10 ^ {0}
        expect(sdr.get_reading_formula_text()).to.equal(`$$2x + 2$$`)
        sdr.m = 2; sdr.b = 2; sdr.bexp = 0; sdr.rexp = 1
        // (2x + (2 \\times 10 ^ {0})) \\times 10 ^ {1}
        expect(sdr.get_reading_formula_text()).to.equal(`$$(2x + 2) \\times 10$$`)
        sdr.m = 2; sdr.b = 2; sdr.bexp = 0; sdr.rexp = 2
        // (2x + (2 \\times 10 ^ {0})) \\times 10 ^ {2}
        expect(sdr.get_reading_formula_text()).to.equal(`$$(2x + 2) \\times 10 ^ {2}$$`)
        sdr.m = 2; sdr.b = 2; sdr.bexp = 1; sdr.rexp = 0
        // (2x + (2 \\times 10 ^ {1})) \\times 10 ^ {0}
        expect(sdr.get_reading_formula_text()).to.equal(`$$2x + (2 \\times 10)$$`)
        sdr.m = 2; sdr.b = 2; sdr.bexp = 1; sdr.rexp = 1
        // (2x + (2 \\times 10 ^ {1})) \\times 10 ^ {1}
        expect(sdr.get_reading_formula_text()).to.equal(`$$(2x + (2 \\times 10)) \\times 10$$`)
        sdr.m = 2; sdr.b = 2; sdr.bexp = 1; sdr.rexp = 2
        // (2x + (2 \\times 10 ^ {1})) \\times 10 ^ {2}
        expect(sdr.get_reading_formula_text()).to.equal(`$$(2x + (2 \\times 10)) \\times 10 ^ {2}$$`)
        sdr.m = 2; sdr.b = 2; sdr.bexp = 2; sdr.rexp = 0
        // (2x + (2 \\times 10 ^ {2})) \\times 10 ^ {0}
        expect(sdr.get_reading_formula_text()).to.equal(`$$2x + (2 \\times 10 ^ {2})$$`)
        sdr.m = 2; sdr.b = 2; sdr.bexp = 2; sdr.rexp = 1
        // (2x + (2 \\times 10 ^ {2})) \\times 10 ^ {1}
        expect(sdr.get_reading_formula_text()).to.equal(`$$(2x + (2 \\times 10 ^ {2})) \\times 10$$`)
        sdr.m = 2; sdr.b = 2; sdr.bexp = 2; sdr.rexp = 2
        // (2x + (2 \\times 10 ^ {2})) \\times 10 ^ {2}
        expect(sdr.get_reading_formula_text()).to.equal(`$$(2x + (2 \\times 10 ^ {2})) \\times 10 ^ {2}$$`)

        // b <0
        sdr.m = 2; sdr.b = -2; sdr.bexp = 2; sdr.rexp = 2
        // (2x + ((-2) \\times 10 ^ {2})) \\times 10 ^ {2}
        expect(sdr.get_reading_formula_text()).to.equal(`$$(2x + ((-2) \\times 10 ^ {2})) \\times 10 ^ {2}$$`)
        sdr.m = 2; sdr.b = -2; sdr.bexp = 1; sdr.rexp = 2
        // (2x + ((-2) \\times 10 ^ {1})) \\times 10 ^ {2}
        expect(sdr.get_reading_formula_text()).to.equal(`$$(2x + ((-2) \\times 10)) \\times 10 ^ {2}$$`)
        sdr.m = 2; sdr.b = -2; sdr.bexp = 0; sdr.rexp = 2
        // (2x + ((-2) \\times 10 ^ {0})) \\times 10 ^ {2}
        expect(sdr.get_reading_formula_text()).to.equal(`$$(2x + (-2)) \\times 10 ^ {2}$$`)

        // non-linear
        sdr.m = 2; sdr.b = -2; sdr.bexp = 0; sdr.rexp = 2
        sdr.linear = Linearization.cube
        // (2x + ((-2) \\times 10 ^ {0})) \\times 10 ^ {2}
        expect(sdr.get_reading_formula_text()).to.equal(`$$${name_of_linear(sdr.linear)}[(2x + (-2)) \\times 10 ^ {2}]$$`)

    })
    it('threshold', () => {
        const hex = `
00000000:	0100	5101	3520	0001
00000008:	0300	7f68	0101	800a
00000010:	807a	3838	0001	0000
00000018:	0600	0000	00f0	0797
00000020:	ff00	ff00	4d4b	4200
00000028:	8388	0000	0000	00ca
00000030:	496e	6c65	745f	5465
00000038:	6d70	0200	5101	3620
`
        const dv = new DataView(hex2ArrayBuffer(hex, 0))
        dv.setUint8(13, EventType.threshold)
        dv.setUint16(18, 0x3f00, true) // bits: 13~8
        dv.setUint8(36, 0x66) // unr
        dv.setUint8(37, 0x55) // uc
        dv.setUint8(38, 0x44) // unc
        dv.setUint8(39, 0x33) // lnr
        dv.setUint8(40, 0x22) // lc
        dv.setUint8(41, 0x11) // lnc

        const sdr = new SdrRecordType1(dv)
        sdr.linear = Linearization.linear
        sdr.m = 1
        sdr.b = 0
        sdr.bexp = 0
        sdr.rexp = 0
        // y=x
        sdr.update_formula()

        expect(sdr.threshold!.unr!.v).to.equal(0x66)
        expect(sdr.threshold!.unr!.s).to.equal('102')
        expect(sdr.threshold!.uc!.v).to.equal(0x55)
        expect(sdr.threshold!.uc!.s).to.equal('85')
        expect(sdr.threshold!.unc!.v).to.equal(0x44)
        expect(sdr.threshold!.unc!.s).to.equal('68')
        expect(sdr.threshold!.lnr!.v).to.equal(0x33)
        expect(sdr.threshold!.lnr!.s).to.equal('51')
        expect(sdr.threshold!.lc!.v).to.equal(0x22)
        expect(sdr.threshold!.lc!.s).to.equal('34')
        expect(sdr.threshold!.lnc!.v).to.equal(0x11)
        expect(sdr.threshold!.lnc!.s).to.equal('17')
    })
    it('event offsets SdrRecordType1', () => {
        const hex = `
00000000:	0100	5101	3520	0001
00000008:	0300	7f68	0101	800a
00000010:	807a	3838	0001	0000
00000018:	0600	0000	00f0	0797
00000020:	ff00	ff00	4d4b	4200
00000028:	8388	0000	0000	00ca
00000030:	496e	6c65	745f	5465
00000038:	6d70	0200	5101	3620
`
        const dv = new DataView(hex2ArrayBuffer(hex, 0))
        dv.setUint8(13, EventType.sensor_specific)
        dv.setUint8(12, 0x23) // watchdog2
        dv.setUint16(14, 0x06, true) // event offset 1, 2
        const sdr = new SdrRecordType1(dv)
        expect(sdr.event?.map(i => i.v).join(',')).to.equal('1,2')
        expect(sdr.event?.map(i => i.s).join(',')).to.equal('Hard Reset,Power Down')
    })
    it('event offsets SdrRecordType2', () => {
        const hex = `
00000508:	6f77	6572	1700	5102
00000510:	2620	0070	0600	6740
00000518:	076f	ab08	0000	ab08
00000520:	c000	0000	0000	0000
00000528:	0000	00cb	4350	5530
00000530:	5f53	7461	7475	7318
`
        const dv = new DataView(hex2ArrayBuffer(hex, 4))
        dv.setUint8(13, EventType.sensor_specific)
        dv.setUint8(12, 0x23) // watchdog2
        dv.setUint16(14, 0x06, true) // event offset 1, 2
        const sdr = new SdrRecordType2(dv)
        expect(sdr.event?.map(i => i.v).join(',')).to.equal('1,2')
        expect(sdr.event?.map(i => i.s).join(',')).to.equal('Hard Reset,Power Down')
    })
    it('event_type threshold SdrRecordType2', () => {
        const hex = `
00000508:	6f77	6572	1700	5102
00000510:	2620	0070	0600	6740
00000518:	076f	ab08	0000	ab08
00000520:	c000	0000	0000	0000
00000528:	0000	00cb	4350	5530
00000530:	5f53	7461	7475	7318
`
        const dv = new DataView(hex2ArrayBuffer(hex, 4))
        dv.setUint8(13, EventType.threshold)
        // https://stackoverflow.com/questions/21587122/mocha-chai-expect-to-throw-not-catching-thrown-errors/22340179#22340179
        expect(() => new SdrRecordType2(dv)).to.throw('event_type of SdrRecordType2 should not be threshold')
    })
})