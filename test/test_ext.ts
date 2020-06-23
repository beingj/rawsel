import { expect } from 'chai';
import '../src/ipmi'

describe('ext', () => {
    it('number.toFixed2', () => {
        expect((1).toFixed2(2)).to.equal('1')
        expect((1 / 3).toFixed2(2)).to.equal('0.33')
        expect((1 / 3).toFixed2(3)).to.equal('0.333')
        expect((10 / 6).toFixed2(3)).to.equal('1.667')
    })
    it('number.toHex', () => {
        expect((1).toHex()).to.equal('01')
        expect((18).toHex()).to.equal('12')
        expect((1).toHex(2)).to.equal('01')
        expect((18).toHex(4)).to.equal('0012')
        expect((1.8).toHex(4)).to.equal('1.8')
    })
    it('number.toHexh', () => {
        expect((1).toHexh()).to.equal('01h')
        expect((18).toHexh()).to.equal('12h')
        expect((1).toHexh(2)).to.equal('01h')
        expect((18).toHexh(4)).to.equal('0012h')
    })
    it('Date.format', () => {
        const date = new Date(2020,6,2)
        date.setHours(0, 0, 0, 0);
        // month start with 0
        expect(date.format('yyyy/MM/dd-HH:mm:ss')).to.equal('2020/07/02-00:00:00')
        expect(date.format('yyyy/M/dd-HH:mm:ss')).to.equal('2020/7/02-00:00:00')
        expect(date.format('yyyy/M/d-HH:mm:ss')).to.equal('2020/7/2-00:00:00')
        expect(date.format('M/d-HH:mm:ss')).to.equal('7/2-00:00:00')
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