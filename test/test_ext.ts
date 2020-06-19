import { expect } from 'chai';
import '../src/ipmi'

describe('ext', () => {
    it('number.toFixed2', () => {
        expect((1).toFixed2(2)).to.equal('1')
        expect((1 / 3).toFixed2(2)).to.equal('0.33')
        expect((1 / 3).toFixed2(3)).to.equal('0.333')
        expect((10 / 6).toFixed2(3)).to.equal('1.667')
    })
    it('Date.today', () => {
        const date = new Date()
        date.setHours(0, 0, 0, 0);
        expect(Date.today().toString()).to.equal(date.toString())
    })
    it('Array.indexOfOr', () => {
        const a = ['a', 'b', 'c']
        expect(a.indexOfOr(0, 'null')).to.equal('a')
        expect(a.indexOfOr(4, 'null')).to.equal('null')
    })
    it('Array.bitsOr', () => {
        const a = ['a', 'b', 'c']
        expect(a.bitsOr(3, 'null').join(', ')).to.equal('a, b')
        expect(a.bitsOr(8, 'null').join(', ')).to.equal('null')
    })
})