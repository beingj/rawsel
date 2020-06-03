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
    const test = `
      |Record|           |GenID|GenID |      |Sensor|        |EvtDir|Event|Event|Event|
  ID  | Type | TimeStamp |(Low)|(High)|EvMRev| Type |Sensor #| Type |Data1|Data2|Data3|
     0|     1|          2|    3|     4|     5|     6|       7|     8|    9|   10|   11|
GenID
 0e37h|   02h| 00000001h |  00h|   01h|   04h|   07h|     92h|   83h|  01h|  ffh|  ffh|
Event type
 0e36h|   02h| 00000001h |  20h|   00h|   04h|   05h|     92h|   00h|  01h|  ffh|  ffh|
 0e36h|   02h| 5ecd80f9h |  20h|   00h|   04h|   05h|     92h|   01h|  01h|  ffh|  ffh|
 0e36h|   02h| 5ecd80f9h |  20h|   00h|   04h|   05h|     92h|   02h|  01h|  ffh|  ffh|
 0e36h|   02h| 5ecd80f9h |  20h|   00h|   04h|   05h|     92h|   03h|  01h|  ffh|  ffh|
 0e36h|   02h| 5ecd80f9h |  20h|   00h|   04h|   05h|     92h|   04h|  01h|  ffh|  ffh|
 0e36h|   02h| 5ecd80f9h |  20h|   00h|   04h|   05h|     92h|   04h|  01h|  ffh|  ffh|
 0e36h|   02h| 5ecd80f9h |  20h|   00h|   04h|   05h|     92h|   04h|  01h|  ffh|  ffh|
 0e36h|   02h| 5ecd80f9h |  20h|   00h|   04h|   05h|     92h|   05h|  01h|  ffh|  ffh|
 0e36h|   02h| 5ecd80f9h |  20h|   00h|   04h|   05h|     92h|   06h|  01h|  ffh|  ffh|
 0e36h|   02h| 5ecd80f9h |  20h|   00h|   04h|   05h|     92h|   07h|  01h|  ffh|  ffh|
 0e36h|   02h| 5ecd80f9h |  20h|   00h|   04h|   05h|     92h|   08h|  01h|  ffh|  ffh|
 0e36h|   02h| 5ecd80f9h |  20h|   00h|   04h|   05h|     92h|   09h|  01h|  ffh|  ffh|
 0e36h|   02h| 5ecd80f9h |  20h|   00h|   04h|   05h|     92h|   0ah|  01h|  ffh|  ffh|
 0e36h|   02h| 5ecd80f9h |  20h|   00h|   04h|   05h|     92h|   0bh|  01h|  ffh|  ffh|
 0e36h|   02h| 5ecd80f9h |  20h|   00h|   04h|   05h|     92h|   0ch|  01h|  ffh|  ffh|
 0e36h|   02h| 5ecd80f9h |  20h|   00h|   04h|   05h|     92h|   0dh|  01h|  ffh|  ffh|
 0e36h|   02h| 5ecd80f9h |  20h|   00h|   04h|   05h|     92h|   6fh|  01h|  ffh|  ffh|
 0e36h|   02h| 5ecd80f9h |  20h|   00h|   04h|   05h|     92h|   70h|  01h|  ffh|  ffh|
 0e36h|   02h| 5ecd80f9h |  20h|   00h|   04h|   05h|     92h|   7fh|  01h|  ffh|  ffh|
 0e36h|   02h| 5ecd80f9h |  20h|   00h|   04h|   05h|     92h|   8fh|  01h|  ffh|  ffh|
Generic event
 0e35h|   02h| 00000001h |  20h|   00h|   04h|   07h|     92h|   83h|  01h|  ffh|  ffh|
 0e34h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     92h|   03h|  01h|  ffh|  ffh|
 0cbfh|   02h| 5ecd735fh |  20h|   00h|   04h|   01h|     2ch|   81h|  59h|  2ch|  2dh|
 0102h|   02h| 5ed00c55h |  21h|   00h|   04h|   0ch|     e6h|   6fh|  a5h|  02h|  60h|
 0101h|   02h| 5ed00c55h |  21h|   00h|   04h|   0ch|     e6h|   6fh|  a5h|  02h|  60h|
 0100h|   02h| 5ed00c55h |  21h|   00h|   04h|   0ch|     e6h|   6fh|  a5h|  02h|  60h|
 0cbeh|   02h| 5ecd735dh |  20h|   00h|   04h|   01h|     2ch|   01h|  59h|  2dh|  2dh|
`;
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
                let x = null;
                try {
                    x = [];
                    this.raw.split('\n').forEach(i => i.match('^ *[0-9a-f]{4}h') ? x.push(new sel_1.SelRecord(i)) : null);
                }
                catch (error) {
                }
                if (x !== null) {
                    this.srs = x;
                }
            }
        }
    });
    app.raw = test;
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
