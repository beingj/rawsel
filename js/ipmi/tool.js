(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.two_complement = exports.hex2ArrayBuffer = exports.name_of = void 0;
    function name_of(myEnum, n) {
        // https://stackoverflow.com/questions/18111657/how-to-get-names-of-enum-entries/18112157#18112157
        let ns = n.toString(10);
        for (let enumMember in myEnum) {
            if (enumMember == ns) {
                return myEnum[enumMember];
            }
        }
        return n.toHexh();
    }
    exports.name_of = name_of;
    function two_complement(v, bits = 8) {
        if ((v >> (bits - 1)) == 0) {
            // positive
            return v;
        }
        else {
            // negative
            return v - (1 << bits);
        }
    }
    exports.two_complement = two_complement;
    function hex2ArrayBuffer(hex, offset = 0) {
        let ns = [];
        hex.split('\n')
            .filter(i => i.startsWith('0000'))
            .forEach(j => j.split(/\s+/).slice(1)
            .forEach(k => {
            ns.push(parseInt(k.substr(0, 2), 16));
            ns.push(parseInt(k.substr(2, 2), 16));
        }));
        if (offset != 0) {
            ns = ns.slice(offset);
        }
        const ab = new ArrayBuffer(ns.length);
        const ua = new Uint8Array(ab);
        ns.forEach((_, i) => {
            ua[i] = ns[i];
        });
        return ab;
    }
    exports.hex2ArrayBuffer = hex2ArrayBuffer;
});
//# sourceMappingURL=tool.js.map