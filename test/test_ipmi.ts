import { expect } from 'chai';
import { SdrRecordType, name_of_sdr_rt, name_of_linear, name_of_unit, Linearization, name_of_sel_rt, name_of_et, name_of_st, p_edf } from '../src/ipmi'

describe('ipmi', () => {
    it('name_of_sdr_rt', () => {
        expect(name_of_sdr_rt(SdrRecordType.Full)).to.equal('Full')
        expect(name_of_sdr_rt(0xff)).to.equal('ffh')
    })
    it('name_of_linear', () => {
        expect(name_of_linear(Linearization.linear)).to.equal('linear')
        expect(name_of_linear(0xff)).to.equal('ffh')
    })
    it('name_of_unit', () => {
        expect(name_of_unit(0x01)).to.equal('degrees C');
        expect(name_of_unit(0xff)).to.equal('ffh');
    })
    it('name_of_sel_rt', () => {
        expect(name_of_sel_rt(0x01)).to.equal('unspecified');
        expect(name_of_sel_rt(0x02)).to.equal('system event');
        expect(name_of_sel_rt(0xc0)).to.equal('OEM timestamped');
        expect(name_of_sel_rt(0xd2)).to.equal('OEM timestamped');
        expect(name_of_sel_rt(0xdf)).to.equal('OEM timestamped');
        expect(name_of_sel_rt(0xe0)).to.equal('OEM non-timestamped');
        expect(name_of_sel_rt(0xfe)).to.equal('OEM non-timestamped');
        expect(name_of_sel_rt(0xff)).to.equal('OEM non-timestamped');
    })
    it('name_of_et', () => {
        expect(name_of_et(0x00)).to.equal('unspecified');
        expect(name_of_et(0x80)).to.equal('unspecified');
        expect(name_of_et(0x01)).to.equal('threshold');
        expect(name_of_et(0x02)).to.equal('DMI-based Usage State');
        expect(name_of_et(0x03)).to.equal('digital Discrete');
        expect(name_of_et(0x0c)).to.equal('ACPI Device Power');
        expect(name_of_et(0x60)).to.equal('reserved');
        expect(name_of_et(0x6f)).to.equal('sensor-specific');
        expect(name_of_et(0x7f)).to.equal('OEM');
    })
    it('name_of_st', () => {
        expect(name_of_st(0x04)).to.equal('Fan');
        expect(name_of_st(0xbb)).to.equal('reserved');
        expect(name_of_st(0xdd)).to.equal('OEM');
    })
    it('p_edf', () => {
        const et_ed1: [number, number][] = [
            // [event_type, event_data1]
            [0x01, 0x51],
            [0x02, 0x01],
            [0x03, 0x41],
            [0x04, 0xa1],
            [0x0c, 0xf1],
            [0x6f, 0x01],
            [0x6f, 0x41],
            [0x6f, 0xa1],
            [0x6f, 0xf1],
            [0x7f, 0x01],
            [0x7f, 0x41],
            [0x7f, 0xa1],
            [0x7f, 0xf1]
        ]
        // threshold
        expect(p_edf(...et_ed1[0])).to.equal('trigger reading in byte 2, trigger threshold value in byte 3')
        // discrete: 0, 4, ah, fh
        expect(p_edf(...et_ed1[1])).to.equal('unspecified byte 2, unspecified byte 3')
        expect(p_edf(...et_ed1[2])).to.equal('previous state and/or severity in byte 2, unspecified byte 3')
        expect(p_edf(...et_ed1[3])).to.equal('OEM code in byte 2, OEM code in byte 3')
        expect(p_edf(...et_ed1[4])).to.equal('sensor-specific event extension code in byte 2, sensor-specific event extension code in byte 3')
        // sensor-specific: 0, 4, ah, fh
        expect(p_edf(...et_ed1[5])).to.equal('unspecified byte 2, unspecified byte 3')
        expect(p_edf(...et_ed1[6])).to.equal('previous state and/or severity in byte 2, unspecified byte 3')
        expect(p_edf(...et_ed1[7])).to.equal('OEM code in byte 2, OEM code in byte 3')
        expect(p_edf(...et_ed1[8])).to.equal('sensor-specific event extension code in byte 2, sensor-specific event extension code in byte 3')
        // OEM: 0, 4, ah, fh
        expect(p_edf(...et_ed1[9])).to.equal('unspecified byte 2, unspecified byte 3')
        expect(p_edf(...et_ed1[10])).to.equal('previous state and/or severity in byte 2, unspecified byte 3')
        expect(p_edf(...et_ed1[11])).to.equal('OEM code in byte 2, OEM code in byte 3')
        expect(p_edf(...et_ed1[12])).to.equal('reserved, reserved')
    })
    // other parts of ipmi.ts are covered by test_sel.ts
})