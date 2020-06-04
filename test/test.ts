import { expect } from 'chai'
import { SelRecord } from '../sel'

describe('SelRecord', () => {
    it('ID', () => {
        const raw = `
      |Record|           |GenID|GenID |      |Sensor|        |EvtDir|Event|Event|Event|
  ID  | Type | TimeStamp |(Low)|(High)|EvMRev| Type |Sensor #| Type |Data1|Data2|Data3|
     0|     1|          2|    3|     4|     5|     6|       7|     8|    9|   10|   11|
Generic event
 0001h|   02h| 00000001h |  20h|   00h|   04h|   07h|     92h|   83h|  01h|  ffh|  ffh|
 0002h|   02h| 00000001h |  20h|   00h|   04h|   07h|     92h|   83h|  01h|  ffh|  ffh|
 0100h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     92h|   03h|  01h|  ffh|  ffh|
 ffffh|   02h| 5ecd735fh |  20h|   00h|   04h|   01h|     2ch|   81h|  59h|  2ch|  2dh|
 `
        const srs = SelRecord.from_raw(raw)
        expect(srs[0].id).to.equal(1)
        expect(srs[1].id).to.equal(2)
        expect(srs[2].id).to.equal(0x100)
        expect(srs[3].id).to.equal(0xffff)
    });
    it('Record type', () => {
        const raw = `
      |Record|           |GenID|GenID |      |Sensor|        |EvtDir|Event|Event|Event|
  ID  | Type | TimeStamp |(Low)|(High)|EvMRev| Type |Sensor #| Type |Data1|Data2|Data3|
     0|     1|          2|    3|     4|     5|     6|       7|     8|    9|   10|   11|
Generic event
 0001h|   00h| 00000001h |  20h|   00h|   04h|   07h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  20h|   00h|   04h|   07h|     92h|   83h|  01h|  ffh|  ffh|
 0002h|   bfh| 00000001h |  20h|   00h|   04h|   07h|     92h|   83h|  01h|  ffh|  ffh|
 0002h|   c0h| 00000001h |  20h|   00h|   04h|   07h|     92h|   83h|  01h|  ffh|  ffh|
 0100h|   dfh| 5ecd80f5h |  20h|   00h|   04h|   07h|     92h|   03h|  01h|  ffh|  ffh|
 ffffh|   e0h| 5ecd735fh |  20h|   00h|   04h|   01h|     2ch|   81h|  59h|  2ch|  2dh|
 ffffh|   ffh| 5ecd735fh |  20h|   00h|   04h|   01h|     2ch|   81h|  59h|  2ch|  2dh|
 `
        const srs = SelRecord.from_raw(raw)
        expect(srs[0].record_type).to.equal('undefined')
        expect(srs[1].record_type).to.equal('system event')
        expect(srs[2].record_type).to.equal('undefined')
        expect(srs[3].record_type).to.equal('OEM timestamped')
        expect(srs[4].record_type).to.equal('OEM timestamped')
        expect(srs[5].record_type).to.equal('OEM non-timestamped')
        expect(srs[6].record_type).to.equal('OEM non-timestamped')
    });
    it('Timestamp', () => {
        const raw = `
      |Record|           |GenID|GenID |      |Sensor|        |EvtDir|Event|Event|Event|
  ID  | Type | TimeStamp |(Low)|(High)|EvMRev| Type |Sensor #| Type |Data1|Data2|Data3|
     0|     1|          2|    3|     4|     5|     6|       7|     8|    9|   10|   11|
Generic event
 0001h|   00h| 00000000h |  20h|   00h|   04h|   07h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  20h|   00h|   04h|   07h|     92h|   83h|  01h|  ffh|  ffh|
 0002h|   bfh| 20000000h |  20h|   00h|   04h|   07h|     92h|   83h|  01h|  ffh|  ffh|
 0002h|   bfh| 20000001h |  20h|   00h|   04h|   07h|     92h|   83h|  01h|  ffh|  ffh|
 ffffh|   e0h| 5ecd735fh |  20h|   00h|   04h|   01h|     2ch|   81h|  59h|  2ch|  2dh|
 0100h|   dfh| ffffffffh |  20h|   00h|   04h|   07h|     92h|   03h|  01h|  ffh|  ffh|
 `
        const srs = SelRecord.from_raw(raw)
        // 0x00000000 through 0x20000000 are used for timestamping events that occur after the initialization of the
        // System Event Log device up to the time that the timestamp is set with the system time value. Thus, these
        // timestamp values are relative to the completion of the SEL device’s initialization, not January 1, 1970.
        expect(srs[0].timestamp).to.equal('0s')
        expect(srs[1].timestamp).to.equal('1s')
        expect(srs[2].timestamp).to.equal(0x20000000 + 's')

        // valid timestamp
        expect(srs[3].timestamp).to.equal('1987/01/06-10:48:33')
        expect(srs[4].timestamp).to.equal('2020/05/27-11:51:59')

        // 0xFFFFFFFF indicates an invalid or unspecified time value.
        expect(srs[5].timestamp).to.equal('ffffffffh')
    });
    it('generic events', () => {
        const raw = `
      |Record|           |GenID|GenID |      |Sensor|        |EvtDir|Event|Event|Event|
  ID  | Type | TimeStamp |(Low)|(High)|EvMRev| Type |Sensor #| Type |Data1|Data2|Data3|
     0|     1|          2|    3|     4|     5|     6|       7|     8|    9|   10|   11|
Generic event
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     92h|   00h|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     92h|   01h|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     92h|   02h|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     92h|   03h|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     92h|   04h|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     92h|   05h|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     92h|   06h|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     92h|   07h|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     92h|   08h|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     92h|   09h|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     92h|   0ah|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     92h|   0bh|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     92h|   0ch|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     92h|   0dh|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     92h|   6eh|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     92h|   6fh|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     92h|   70h|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     92h|   7fh|  01h|  ffh|  ffh|
 `
        const srs = SelRecord.from_raw(raw)
        expect(srs[0].event_type).to.equal('undefined')
        expect(srs[1].event_type).to.equal('threshold')
        expect(srs[2].event_type).to.equal('DMI-based Usage State')
        // 3-6
        expect(srs[3].event_type).to.equal('digital Discrete')
        expect(srs[4].event_type).to.equal('digital Discrete')
        expect(srs[5].event_type).to.equal('digital Discrete')
        expect(srs[6].event_type).to.equal('digital Discrete')
        // 7
        expect(srs[7].event_type).to.equal('severity')
        // 8-ah
        expect(srs[8].event_type).to.equal('availability')
        expect(srs[9].event_type).to.equal('availability')
        expect(srs[10].event_type).to.equal('availability')
        // bh
        expect(srs[11].event_type).to.equal('redundancy')
        // ch
        expect(srs[12].event_type).to.equal('ACPI Device Power')
        // dh-6eh
        expect(srs[13].event_type).to.equal('undefined')
        expect(srs[14].event_type).to.equal('undefined')
        // 6fh
        expect(srs[15].event_type).to.equal('sensor-specific')
        // 70h, 7fh
        expect(srs[16].event_type).to.equal('OEM')
        expect(srs[17].event_type).to.equal('OEM')
    });
})