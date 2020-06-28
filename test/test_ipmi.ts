import { expect } from 'chai';
import { name_of, SdrRecordType, name_of_sdr_rt, name_of_linear, name_of_unit, Linearization } from '../src/ipmi'

describe('ipmi', () => {
    it('name_of', () => {
        expect(name_of(SdrRecordType, SdrRecordType.Full)).to.equal('Full')
        expect(name_of(SdrRecordType, 0xff)).to.equal('ffh')
    })
    it('name_of_unit', () => {
        expect(name_of_unit(0x01)).to.equal('degrees C');
        expect(name_of_unit(0xff)).to.equal('ffh');
    })
    it('name_of_sdr_rt', () => {
        expect(name_of_sdr_rt(SdrRecordType.Full)).to.equal('Full')
        expect(name_of_sdr_rt(0xff)).to.equal('ffh')
    })
    it('name_of_linear', () => {
        expect(name_of_linear(Linearization.linear)).to.equal('linear')
        expect(name_of_linear(0xff)).to.equal('ffh')
    })
})