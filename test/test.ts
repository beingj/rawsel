import { expect } from 'chai'
import { SelRecord } from '../sel'

describe('SelRecord', () => {
    it('is undefined when event types out of range', () => {
        const s = [1, 2, 3]
        expect(s.length).to.equal(3)
        const sr = new SelRecord(' 0e36h|   02h| 5ecd80f9h |  20h|   00h|   04h|   05h|     92h|   8fh|  01h|  ffh|  ffh|')
        expect(sr.event).to.equal('undefined')
    });
})