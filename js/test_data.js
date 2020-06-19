(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./ipmi/index"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test_data = void 0;
    const index_1 = require("./ipmi/index");
    const test_data = {
        sdr: sdr_data(),
        sel: `
       | Record |           | GenID | GenID  |        | Sensor |          | EvtDir | Event | Event | Event |
    ID | Type   | TimeStamp | (Low) | (High) | EvMRev | Type   | Sensor # | Type   | Data1 | Data2 | Data3 |
     0 |      1 |         2 |     3 |      4 |      5 | 6      | 7        |      8 |     9 |    10 |    11 |
 0109h | 02h    | 5ed08d86h | 20h   | 00h    | 04h    | 01h    | 33h      | 81h    | 57h   | 27h   | 28h   |
 0e35h | 02h    | 00000001h | 20h   | 00h    | 04h    | 07h    | 92h      | 83h    | 01h   | ffh   | ffh   |
 0e35h | 02h    | 5ecd80f5h | 20h   | 00h    | 04h    | 07h    | 94h      | 02h    | a1h   | ffh   | ffh   |
 0e35h | 02h    | 5ecd80f5h | 20h   | 00h    | 04h    | 21h    | 62h      | 6fh    | 09h   | 08h   | 04h   |
 0e35h | 02h    | 5ecd80f5h | 20h   | 00h    | 04h    | 04h    | 64h      | 6fh    | 01h   | ffh   | ffh   |
`
    };
    exports.test_data = test_data;
    function sdr_data() {
        const hex = `
00000000:	0100	5101	3520	0001
00000008:	0300	7f68	0101	800a
00000010:	807a	3838	0001	0000
00000018:	0600	0000	00f0	0797
00000020:	ff00	ff00	4d4b	4200
00000028:	8388	0000	0000	00ca
00000030:	496e	6c65	745f	5465
00000038:	6d70	0200	5101	3620
00000040:	0002	0300	7f68	0101
00000048:	800a	807a	3838	0001
00000050:	0000	0600	0000	00f0
00000058:	0797	ff00	ff00	7f7d
00000060:	7500	8388	0000	0000
00000068:	00cb	4f75	746c	6574
00000070:	5f54	656d	7003	0051
00000078:	0134	2000	0303	007f
00000080:	6801	0180	0a80	7a38
00000088:	3800	0100	0005	0000
00000090:	0000	f007	97ff	00ff
00000098:	007f	afaa	0000	0000
000000a0:	0000	0000	c943	5055
000000a8:	305f	5465	6d70
`;
        const ns = [];
        hex.split('\n')
            .filter(i => i.startsWith('0000'))
            .forEach(j => j.split(/\s+/).slice(1)
            .forEach(k => {
            ns.push(parseInt(k.substr(0, 2), 16));
            ns.push(parseInt(k.substr(2, 2), 16));
        }));
        const ab = new ArrayBuffer(ns.length);
        const ua = new Uint8Array(ab);
        ns.forEach((v, i) => {
            ua[i] = ns[i];
        });
        return ab;
        // return repeat_sdr(ab)
    }
    function repeat_sdr(bin) {
        // there are 3 records in sdr_data above
        // we need total 54=18*3
        const ua1 = new Uint8Array(bin);
        const len = bin.byteLength;
        const ab = new ArrayBuffer(len * 18);
        const ua2 = new Uint8Array(ab);
        for (let i = 0; i < 18; i++) {
            ua1.forEach((b, j) => {
                ua2[i * len + j] = b;
            });
        }
        const x = index_1.SdrRecord.from(ab);
        x.forEach((sdr, idx) => {
            sdr.record_id = idx + 1;
            sdr.sensor_num = idx + 1;
            sdr.m = 3;
            sdr.b = 3;
            sdr.bexp = 3;
            sdr.rexp = 3;
        });
        let idx = 0;
        // total 54= 2*3*3*3
        for (let m of [1, 2]) {
            x[idx].m = m;
            for (let b of [0, 1, 2]) {
                x[idx].b = m;
                for (let bexp of [0, 1, 2]) {
                    x[idx].bexp = bexp;
                    for (let rexp of [0, 1, 2]) {
                        x[idx].rexp = rexp;
                        x[idx].reading_formula = index_1.SdrRecordType1.get_reading_formula_text(x[idx]);
                        idx++;
                    }
                }
            }
        }
        return x;
    }
});
//# sourceMappingURL=test_data.js.map