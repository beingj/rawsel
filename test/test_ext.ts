import { expect } from 'chai';
import '../src/ext'

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
})