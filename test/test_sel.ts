import { expect } from 'chai'
import { SelRecord } from '../src/ipmi'

describe('sel', () => {
    it('id', () => {
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
    it('record type', () => {
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
        expect(srs[0].record_type).to.equal('unspecified')
        expect(srs[1].record_type).to.equal('system event')
        expect(srs[2].record_type).to.equal('unspecified')
        expect(srs[3].record_type).to.equal('OEM timestamped')
        expect(srs[4].record_type).to.equal('OEM timestamped')
        expect(srs[5].record_type).to.equal('OEM non-timestamped')
        expect(srs[6].record_type).to.equal('OEM non-timestamped')
    });
    it('timestamp', () => {
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

        srs[4].change_timezone(9)
        expect(srs[4].timestamp).to.equal('2020/05/27-12:51:59')
    });
    it('generator id', () => {
        const raw = `
      |Record|           |GenID|GenID |      |Sensor|        |EvtDir|Event|Event|Event|
  ID  | Type | TimeStamp |(Low)|(High)|EvMRev| Type |Sensor #| Type |Data1|Data2|Data3|
     0|     1|          2|    3|     4|     5|     6|       7|     8|    9|   10|   11|
Generic event
 0001h|   00h| 00000000h |  20h|   00h|   04h|   07h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   10h|   04h|   07h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  02h|   01h|   04h|   07h|     92h|   83h|  01h|  ffh|  ffh|
 `
        const srs = SelRecord.from_raw(raw)
        expect(srs[0].generator).to.equal('0020h')
        expect(srs[1].generator).to.equal('1030h')
        expect(srs[2].generator).to.equal('0102h')
    })
    it('sensor type', () => {
        const raw = `
      |Record|           |GenID|GenID |      |Sensor|        |EvtDir|Event|Event|Event|
  ID  | Type | TimeStamp |(Low)|(High)|EvMRev| Type |Sensor #| Type |Data1|Data2|Data3|
     0|     1|          2|    3|     4|     5|     6|       7|     8|    9|   10|   11|
Generic event
 0001h|   00h| 00000000h |  20h|   00h|   04h|   00h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   01h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   02h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   03h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   04h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   05h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   06h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   07h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   08h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   09h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   0ah|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   0bh|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   0ch|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   0dh|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   0eh|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   0fh|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   10h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   11h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   12h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   13h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   14h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   15h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   16h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   17h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   18h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   19h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   1ah|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   1bh|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   1ch|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   1dh|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   1eh|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   1fh|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   20h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   21h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   22h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   23h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   24h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   25h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   26h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   27h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   28h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   29h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   2ah|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   2bh|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   2ch|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   2dh|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   c0h|     92h|   83h|  01h|  ffh|  ffh|
 0001h|   02h| 00000001h |  30h|   00h|   04h|   ffh|     92h|   83h|  01h|  ffh|  ffh|
 `
        const srs = SelRecord.from_raw(raw)
        expect(srs[0].sensor_type).to.equal('reserved')
        expect(srs[1].sensor_type).to.equal('Temperature')
        expect(srs[2].sensor_type).to.equal('Voltage')
        expect(srs[3].sensor_type).to.equal('Current')
        expect(srs[4].sensor_type).to.equal('Fan')
        expect(srs[5].sensor_type).to.equal('Physical Security')
        expect(srs[6].sensor_type).to.equal('Platform Security Violation Attempt')
        expect(srs[7].sensor_type).to.equal('Processor')
        expect(srs[8].sensor_type).to.equal('Power Supply')
        expect(srs[9].sensor_type).to.equal('Power Unit')
        expect(srs[10].sensor_type).to.equal('Cooling Device')
        expect(srs[11].sensor_type).to.equal('Other Units-based Sensor')
        expect(srs[12].sensor_type).to.equal('Memory')
        expect(srs[13].sensor_type).to.equal('Drive Slot (Bay)')
        expect(srs[14].sensor_type).to.equal('POST Memory Resize')
        expect(srs[15].sensor_type).to.equal('System Firmware Progress')
        expect(srs[16].sensor_type).to.equal('Event Logging Disabled')
        expect(srs[17].sensor_type).to.equal('Watchdog 1')
        expect(srs[18].sensor_type).to.equal('System Event')
        expect(srs[19].sensor_type).to.equal('Critical Interrupt')
        expect(srs[20].sensor_type).to.equal('Button / Switch')
        expect(srs[21].sensor_type).to.equal('Module / Board')
        expect(srs[22].sensor_type).to.equal('Microcontroller / Coprocessor')
        expect(srs[23].sensor_type).to.equal('Add-in Card')
        expect(srs[24].sensor_type).to.equal('Chassis')
        expect(srs[25].sensor_type).to.equal('Chip Set')
        expect(srs[26].sensor_type).to.equal('Other FRU')
        expect(srs[27].sensor_type).to.equal('Cable / Interconnect')
        expect(srs[28].sensor_type).to.equal('Terminator')
        expect(srs[29].sensor_type).to.equal('System Boot / Restart Initiated')
        expect(srs[30].sensor_type).to.equal('Boot Error')
        expect(srs[31].sensor_type).to.equal('Base OS Boot / Installation Status')
        // 20h
        expect(srs[32].sensor_type).to.equal('OS Stop / Shutdown')
        expect(srs[33].sensor_type).to.equal('Slot / Connector')
        expect(srs[34].sensor_type).to.equal('System ACPI Power State')
        expect(srs[35].sensor_type).to.equal('Watchdog 2')
        expect(srs[36].sensor_type).to.equal('Platform Alert')
        expect(srs[37].sensor_type).to.equal('Entity Presence')
        expect(srs[38].sensor_type).to.equal('Monitor ASIC / IC')
        expect(srs[39].sensor_type).to.equal('LAN')
        expect(srs[40].sensor_type).to.equal('Management Subsystem Health')
        expect(srs[41].sensor_type).to.equal('Battery')
        // 2ah
        expect(srs[42].sensor_type).to.equal('Session Audit')
        expect(srs[43].sensor_type).to.equal('Version Change')
        expect(srs[44].sensor_type).to.equal('FRU State')
        // 2dh
        expect(srs[45].sensor_type).to.equal('reserved')
        // c0h, ffh
        expect(srs[46].sensor_type).to.equal('OEM')
        expect(srs[47].sensor_type).to.equal('OEM')
    })
    it('sensor number', () => {
        const raw = `
      |Record|           |GenID|GenID |      |Sensor|        |EvtDir|Event|Event|Event|
  ID  | Type | TimeStamp |(Low)|(High)|EvMRev| Type |Sensor #| Type |Data1|Data2|Data3|
     0|     1|          2|    3|     4|     5|     6|       7|     8|    9|   10|   11|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     33h|   00h|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     ffh|   01h|  01h|  ffh|  ffh|
 `
        const srs = SelRecord.from_raw(raw)
        expect(srs[0].sensor_num).to.equal(0x33)
        expect(srs[1].sensor_num).to.equal(0xff)
    })
    it('event dir', () => {
        const raw = `
      |Record|           |GenID|GenID |      |Sensor|        |EvtDir|Event|Event|Event|
  ID  | Type | TimeStamp |(Low)|(High)|EvMRev| Type |Sensor #| Type |Data1|Data2|Data3|
     0|     1|          2|    3|     4|     5|     6|       7|     8|    9|   10|   11|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     33h|   00h|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     ffh|   81h|  01h|  ffh|  ffh|
 `
        const srs = SelRecord.from_raw(raw)
        expect(srs[0].event_direction).to.equal('Assert')
        expect(srs[1].event_direction).to.equal('Deassert')
    })
    it('generic event type codes', () => {
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
        expect(srs[0].event_type).to.equal('unspecified')
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
        expect(srs[13].event_type).to.equal('reserved')
        expect(srs[14].event_type).to.equal('reserved')
        // 6fh
        expect(srs[15].event_type).to.equal('sensor-specific')
        // 70h, 7fh
        expect(srs[16].event_type).to.equal('OEM')
        expect(srs[17].event_type).to.equal('OEM')
    });
    it('generic and sensor-specific events', () => {
        const raw = `
      |Record|           |GenID|GenID |      |Sensor|        |EvtDir|Event|Event|Event|
  ID  | Type | TimeStamp |(Low)|(High)|EvMRev| Type |Sensor #| Type |Data1|Data2|Data3|
     0|     1|          2|    3|     4|     5|     6|       7|     8|    9|   10|   11|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     33h|   01h|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     ffh|   6fh|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     ffh|   00h|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     ffh|   0dh|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     ffh|   03h|  02h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   00h|     ffh|   6fh|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   04h|     ffh|   6fh|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   2dh|     ffh|   6fh|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   ffh|     ffh|   6fh|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   05h|     ffh|   6fh|  09h|  ffh|  ffh|
 `
        const srs = SelRecord.from_raw(raw)
        expect(srs[0].event).to.equal('Lower Non-critical - going high')
        expect(srs[1].event).to.equal('Thermal Trip')
        // event type 0
        expect(srs[2].event).to.equal('unspecified')
        // event type dh
        expect(srs[3].event).to.equal('reserved')
        // event type 3h with offset out of range
        expect(srs[4].event).to.equal('unspecified')
        // sensor-specific with sensor type 0
        expect(srs[5].event).to.equal('reserved')
        // sensor-specific with sensor type 4 (<= 4)
        expect(srs[6].event).to.equal('Fan')
        // sensor-specific with sensor type 2dh (> 2ch)
        expect(srs[7].event).to.equal('reserved')
        // sensor-specific with sensor type ffh
        expect(srs[8].event).to.equal('OEM')
        // sensor-specific with sensor type 05, offset out of range
        expect(srs[9].event).to.equal('unspecified')
    })
    it('event data 2&3', () => {
        const raw = `
      |Record|           |GenID|GenID |      |Sensor|        |EvtDir|Event|Event|Event|
  ID  | Type | TimeStamp |(Low)|(High)|EvMRev| Type |Sensor #| Type |Data1|Data2|Data3|
     0|     1|          2|    3|     4|     5|     6|       7|     8|    9|   10|   11|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     33h|   01h|  51h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     ffh|   02h|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     ffh|   03h|  41h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     ffh|   04h|  a1h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     ffh|   0ch|  f1h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     ffh|   6fh|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     ffh|   6fh|  41h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     ffh|   6fh|  a1h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     ffh|   6fh|  f1h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     ffh|   7fh|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     ffh|   7fh|  41h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     ffh|   7fh|  a1h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     ffh|   7fh|  f1h|  ffh|  ffh|
 `
        const srs = SelRecord.from_raw(raw)
        // threshold
        expect(srs[0].event_data23).to.equal('trigger reading in byte 2, trigger threshold value in byte 3')
        // discrete: 0, 4, ah, fh
        expect(srs[1].event_data23).to.equal('unspecified byte 2, unspecified byte 3')
        expect(srs[2].event_data23).to.equal('previous state and/or severity in byte 2, unspecified byte 3')
        expect(srs[3].event_data23).to.equal('OEM code in byte 2, OEM code in byte 3')
        expect(srs[4].event_data23).to.equal('sensor-specific event extension code in byte 2, sensor-specific event extension code in byte 3')
        // sensor-specific: 0, 4, ah, fh
        expect(srs[5].event_data23).to.equal('unspecified byte 2, unspecified byte 3')
        expect(srs[6].event_data23).to.equal('previous state and/or severity in byte 2, unspecified byte 3')
        expect(srs[7].event_data23).to.equal('OEM code in byte 2, OEM code in byte 3')
        expect(srs[8].event_data23).to.equal('sensor-specific event extension code in byte 2, sensor-specific event extension code in byte 3')
        // OEM: 0, 4, ah, fh
        expect(srs[9].event_data23).to.equal('unspecified byte 2, unspecified byte 3')
        expect(srs[10].event_data23).to.equal('previous state and/or severity in byte 2, unspecified byte 3')
        expect(srs[11].event_data23).to.equal('OEM code in byte 2, OEM code in byte 3')
        expect(srs[12].event_data23).to.equal('reserved, reserved')
    })
    it('event data 2&3 parse', () => {
        const raw = `
      |Record|           |GenID|GenID |      |Sensor|        |EvtDir|Event|Event|Event|
  ID  | Type | TimeStamp |(Low)|(High)|EvMRev| Type |Sensor #| Type |Data1|Data2|Data3|
     0|     1|          2|    3|     4|     5|     6|       7|     8|    9|   10|   11|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   01h|     33h|   01h|  f1h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   05h|     ffh|   6fh|  f4h|  02h|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   05h|     ffh|   05h|  f2h|  02h|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   2bh|     ffh|   6fh|  f7h|  00h|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   2bh|     ffh|   6fh|  f7h|  32h|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   2bh|     ffh|   6fh|  f0h|  32h|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   3bh|     ffh|   6fh|  f0h|  32h|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   2ah|     ffh|   6fh|  f3h|  32h|  13h|
 // no sensor-specified in data23
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   2ah|     ffh|   6fh|  03h|  32h|  13h|
//  event disable
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   10h|     ffh|   6fh|  f1h|  02h|  23h|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   10h|     ffh|   6fh|  f1h|  02h|  11h|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   10h|     ffh|   6fh|  f1h|  02h|  02h|
 `
        const srs = SelRecord.from_raw(raw)

        expect(srs[0].event_data2_parsed).to.equal(undefined)
        expect(srs[1].event_data2_parsed).to.equal('network controller #2')
        expect(srs[2].event_data2_parsed).to.equal(undefined)
        expect(srs[3].event_data2_parsed).to.equal('unspecified')
        expect(srs[4].event_data2_parsed).to.equal('reserved')
        expect(srs[5].event_data2_parsed).to.equal(undefined)
        expect(srs[6].event_data2_parsed).to.equal(undefined)
        expect(srs[7].event_data3_parsed).to.equal('Session deactivated by Close Session command, channel #3')

        // no need to parse
        expect(srs[8].event_data2_parsed).to.equal(undefined)
        expect(srs[8].event_data3_parsed).to.equal(undefined)

        //  event disable
        expect(srs[9].event_data2_parsed).to.equal('DMI-based Usage State')
        expect(srs[9].event_data3_parsed).to.equal('logging has been disabled for all events of given type')
        expect(srs[10].event_data2_parsed).to.equal('DMI-based Usage State')
        expect(srs[10].event_data3_parsed).to.equal('logging is disabled for assert: Transition to Active')
        expect(srs[11].event_data2_parsed).to.equal('DMI-based Usage State')
        expect(srs[11].event_data3_parsed).to.equal('logging is disabled for deassert: Transition to Busy')
    })
})