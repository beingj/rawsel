var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./sel", "./uploader", "vue"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const sel_1 = require("./sel");
    const uploader_1 = require("./uploader");
    const vue_1 = __importDefault(require("vue"));
    const app = new vue_1.default({
        el: '#app',
        data: {
            timezone: sel_1.SelRecord.timezone,
            raw: '',
            srs: [],
            files: []
        },
        watch: {
            timezone: function () {
                this.srs.forEach((i) => i.change_timezone(this.timezone));
            },
            raw: function () {
                let x = [];
                try {
                    this.raw.split('\n').forEach(i => i.match('^ *[0-9a-f]{4}h') ? x.push(new sel_1.SelRecord(i)) : null);
                }
                catch (error) {
                }
                if (x.length > 0) {
                    this.srs = x;
                }
            }
        }
    });
    app.raw = `
      |Record|           |GenID|GenID |      |Sensor|        |EvtDir|Event|Event|Event|
  ID  | Type | TimeStamp |(Low)|(High)|EvMRev| Type |Sensor #| Type |Data1|Data2|Data3|
     0|     1|          2|    3|     4|     5|     6|       7|     8|    9|   10|   11|
 0109h|   02h| 5ed08d86h |  20h|   00h|   04h|   01h|     2ch|   81h|  57h|  27h|  28h|
 0e35h|   02h| 00000001h |  20h|   00h|   04h|   07h|     92h|   83h|  01h|  ffh|  ffh|
`;
    new uploader_1.Uploader('raw_file', () => {
        // console.log('clear list')
        while (app.files.length > 0)
            app.files.pop();
        app.raw = '';
    }, (_, name, data) => {
        // console.log('on_file: ' + index + ', ' + name)
        app.files.push(name);
        app.raw += data;
    });
});
