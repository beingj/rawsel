import { expect } from 'chai';
import { hex2ArrayBuffer, name_of, EventType, two_complement } from '../src/ipmi';

describe('tool', () => {
    it('name_of', () => {
        expect(name_of(EventType, 1)).to.equal('threshold')
    })
    it('hex2ArrayBuffer', () => {
        const hex = `
00000508:	6f77	6572	1700	5102
00000510:	2620	0070	0600	6740
00000518:	076f	ab08	0000	ab08
00000520:	c000	0000	0000	0000
00000528:	0000	00cb	4350	5530
00000530:	5f53	7461	7475	7318
`
        let dv = new DataView(hex2ArrayBuffer(hex, 4))
        expect(dv.getUint16(0, true)).to.equal(0x17)
        expect(dv.getUint8(2)).to.equal(0x51)

        dv = new DataView(hex2ArrayBuffer(hex))
        expect(dv.getUint16(4, true)).to.equal(0x17)
        expect(dv.getUint8(2)).to.equal(0x65)
    })
    it('two_complement', () => {
        expect(two_complement(0x00)).to.equal(0)
        expect(two_complement(0x80)).to.equal(-128)
        expect(two_complement(0x80, 16)).to.equal(0x80)
        expect(two_complement(0x8000, 16)).to.equal(-32768)
    })
})