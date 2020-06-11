var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./sel", "./sdr", "./uploader", "vue", "./test_data"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const sel_1 = require("./sel");
    const sdr_1 = require("./sdr");
    const uploader_1 = require("./uploader");
    const vue_1 = __importDefault(require("vue"));
    const test_data_1 = require("./test_data");
    const app = new vue_1.default({
        el: '#app',
        data: {
            loading: false,
            sel: {
                show: true,
                timezone: sel_1.SelRecord.timezone,
                raw: '',
                sels: [],
                files: [],
                done_files: [],
                emsg: ''
            },
            sdr: {
                show: true,
                files: [],
                done_files: [],
                sdrs: [],
                raw: [],
                default_raw: 100 // default raw value of sensor reading
            }
        },
        methods: {
            update_sel_with_sdr: function () {
                const type1s = this.sdr.sdrs.filter((i) => i instanceof sdr_1.SdrRecordType1);
                this.sel.sels.forEach((selr, idx) => {
                    const sdrr = type1s.find((i) => i.sensor_num == selr.sensor_num);
                    if (sdrr) {
                        selr.sdr = sdrr;
                    }
                });
            }
        },
        watch: {
            "sel.timezone": function () {
                this.sel.sels.forEach((i) => i.change_timezone(this.sel.timezone));
            },
            "sel.raw": function () {
                if (this.sel.raw == '')
                    return;
                const x = sel_1.SelRecord.from_raw(this.sel.raw);
                if (x.length == 0) {
                    this.sel.emsg = 'no raw sel in file';
                }
                else {
                    this.sel.emsg = '';
                    this.sel.sels = x;
                }
            }
        },
        filters: {
            record_type: function (sdr) {
                return sdr_1.SdrRecord.record_type_of(sdr.record_type);
            },
            toHex: function (n) {
                // return n ? (Number.isNaN(n) ? n.toString() : (n.toString(16).padStart(2, '0') + 'h')) : ''
                if (!n)
                    return '';
                if (Number.isNaN(n))
                    return n.toString();
                return n.toString(16).padStart(2, '0') + 'h';
            },
        }
    });
    app.sel.raw = `
    | Record |           | GenID | GenID |      | Sensor |        | EvtDir | Event | Event | Event |
    ID | Type | TimeStamp | (Low) | (High) | EvMRev | Type | Sensor # | Type | Data1 | Data2 | Data3 |
        0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
        0109h | 02h | 5ed08d86h | 20h | 00h | 04h | 01h | 01h | 81h | 57h | 27h | 28h |
            0e35h | 02h | 00000001h | 20h | 00h | 04h | 07h | 92h | 83h | 01h | ffh | ffh |
                0e35h | 02h | 5ecd80f5h | 20h | 00h | 04h | 07h | ffh | 02h | a1h | ffh | ffh |
                    0e35h | 02h | 5ecd80f5h | 20h | 00h | 04h | 07h | ffh | 0ch | f1h | ffh | ffh |
                        0e35h | 02h | 5ecd80f5h | 20h | 00h | 04h | 04h | ffh | 6fh | 01h | ffh | ffh |
                            `;
    new uploader_1.Uploader('sel_raw_file', (files) => {
        // console.log('clear list')
        const o = app.sel;
        while (o.files.length > 0)
            o.files.pop();
        for (let i = 0; i < files.length; i++) {
            o.files.push(files[i].name);
        }
        o.raw = '';
        while (o.done_files.length > 0)
            o.done_files.pop();
    }, (_, name, data) => {
        // console.log('on_file: ' + index + ', ' + name)
        const o = app.sel;
        o.done_files.push(name);
        o.raw += data;
    });
    new uploader_1.Uploader('sdr_bin_file', (files) => {
        // console.log('clear list')
        const o = app.sdr;
        while (o.files.length > 0)
            o.files.pop();
        for (let i = 0; i < files.length; i++) {
            o.files.push(files[i].name);
        }
        while (o.done_files.length > 0)
            o.done_files.pop();
        while (o.sdrs.length > 0)
            o.sdrs.pop();
        while (o.raw.length > 0)
            o.raw.pop();
    }, (_, name, data) => {
        // console.log(`on_file: ${ name } `)
        const o = app.sdr;
        o.done_files.push(name);
        // console.log(typeof data)
        if (data instanceof ArrayBuffer) {
            sdr_1.SdrRecord.from(data).forEach(sdr => {
                o.sdrs.push(sdr);
                o.raw.push(o.default_raw);
            });
        }
        else {
        }
    }, false);
    sdr_1.SdrRecord.from(test_data_1.test_data()).forEach(sdr => {
        app.sdr.sdrs.push(sdr);
        app.sdr.raw.push(app.sdr.default_raw);
    });
});
//# sourceMappingURL=app.js.map