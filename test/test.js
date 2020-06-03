(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "chai", "../sel"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const chai_1 = require("chai");
    const sel_1 = require("../sel");
    describe('SelRecord', () => {
        it('is undefined when event types out of range', () => {
            const s = [1, 2, 3];
            chai_1.expect(s.length).to.equal(3);
            const sr = new sel_1.SelRecord(' 0e36h|   02h| 5ecd80f9h |  20h|   00h|   04h|   05h|     92h|   8fh|  01h|  ffh|  ffh|');
            chai_1.expect(sr.event).to.equal('undefined');
        });
    });
});
