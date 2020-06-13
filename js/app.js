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
            loading: true,
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
                bin: null,
                sdrs: [],
                raw_reading: [],
                default_raw_reading: 100,
                emsg: '',
                show_formula: true
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
            },
            bind_uploader: function () {
                new uploader_1.Uploader('sel_raw_file', (files) => {
                    // console.log('clear list')
                    const o = this.sel;
                    while (o.files.length > 0)
                        o.files.pop();
                    for (let i = 0; i < files.length; i++) {
                        o.files.push(files[i].name);
                    }
                    while (o.done_files.length > 0)
                        o.done_files.pop();
                    o.raw = '';
                }, (_, name, data) => {
                    // console.log('on_file: ' + index + ', ' + name)
                    const o = this.sel;
                    o.done_files.push(name);
                    o.raw += data;
                });
                new uploader_1.Uploader('sdr_bin_file', (files) => {
                    // console.log('clear list')
                    const o = this.sdr;
                    while (o.files.length > 0)
                        o.files.pop();
                    for (let i = 0; i < files.length; i++) {
                        o.files.push(files[i].name);
                    }
                    while (o.done_files.length > 0)
                        o.done_files.pop();
                    o.bin = null;
                }, (_, name, data) => {
                    // console.log(`on_file: ${ name } `)
                    const o = this.sdr;
                    o.done_files.push(name);
                    if (data instanceof ArrayBuffer) {
                        o.bin = data;
                    }
                }, false);
            },
            update_mathjax: function () {
                this.$nextTick(() => {
                    // ReferenceError: "MathJax" is not defined
                    // https://stackoverflow.com/questions/858181/how-to-check-a-not-defined-variable-in-javascript
                    if (typeof MathJax !== "undefined") {
                        // if (typeof MathJax.Hub !== "undefined") {
                        if (MathJax.Hub) {
                            MathJax.Hub.Queue(["Typeset", MathJax.Hub, "math"]);
                        }
                    }
                });
            }
        },
        watch: {
            "sel.timezone": function () {
                this.sel.sels.forEach((i) => i.change_timezone(this.sel.timezone));
            },
            "sel.raw": function () {
                const o = this.sel;
                if (o.raw == '')
                    return;
                const x = sel_1.SelRecord.from_raw(o.raw);
                if (x.length == 0) {
                    o.emsg = 'no raw sel in file';
                }
                else {
                    o.emsg = '';
                    o.sels = x;
                }
            },
            "sdr.bin": function () {
                const o = this.sdr;
                if (!o.bin)
                    return;
                let x;
                if (o.bin instanceof ArrayBuffer) {
                    x = sdr_1.SdrRecord.from(o.bin);
                }
                else {
                    x = o.bin;
                }
                if (x.length == 0) {
                    o.emsg = 'no sdr in file';
                }
                else {
                    o.emsg = '';
                    // force formula td re-render to remove the children mathjax elements
                    this.sdr.show_formula = false;
                    o.sdrs = x;
                    while (o.raw_reading.length > 0)
                        o.raw_reading.pop();
                    x.forEach((i) => {
                        o.raw_reading.push(o.default_raw_reading);
                    });
                    this.$nextTick(() => {
                        this.sdr.show_formula = true;
                        this.update_mathjax();
                    });
                }
            }
        },
        filters: {
            record_type: function (sdr) {
                return sdr_1.SdrRecord.record_type_of(sdr.record_type);
            },
            toHex: function (n) {
                if ((n == undefined) || (n == null))
                    return '';
                if (Number.isNaN(n))
                    return n.toString();
                return n.toString(16).padStart(2, '0') + 'h';
            },
            toDecHex: function (n) {
                if ((n == undefined) || (n == null))
                    return '';
                if (Number.isNaN(n))
                    return n.toString();
                return `${n.toString(10)} / ${n.toString(16).padStart(2, '0')}h`;
            },
            rmTex: function (s) {
                return s.substring(2, s.length - 2);
            }
        },
        created: function () {
            this.loading = false;
        },
        mounted: function () {
            this.sdr.bin = test_data_1.test_data.sdr;
            this.sel.raw = test_data_1.test_data.sel;
            this.bind_uploader();
            // the following code will not run
            // they are put here to let vscode/tsc intelisense options of MathJax.Hub.Config
            // so we can copy to the Mathjax object in index.html
            if (false) {
                MathJax.Hub.Config({
                    // "displayAlign": "left",
                    // "skipStartupTypeset": true,
                    "showMathMenu": false,
                    "styles": {
                        "table#math td span.MJXc-display": {
                            "margin": 0,
                            "color": "blue",
                        }
                    }
                });
            }
            // // test slow loading
            // window.setTimeout(() => {
            //     this.loading = false
            //     this.$nextTick(() => {
            //         this.bind_uploader()
            //     })
            // }, 3000)
        }
    });
});
//# sourceMappingURL=app.js.map