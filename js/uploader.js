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
    exports.Uploader = void 0;
    class Uploader {
        constructor(ele_id, on_before, on_data, as_text = true) {
            const ele = document.getElementById(ele_id);
            if (!ele)
                return;
            console.log(`add onchange to ${ele_id}`);
            console.log(ele);
            ele.addEventListener('change', e => {
                this.on_change(e, on_before, this.read_file, on_data, as_text);
            });
        }
        on_change(e, on_before, read_file, on_data, as_text = true) {
            const t = e.target;
            if (!t)
                return;
            const files = t.files;
            if (!files || !files.length) {
                return;
            }
            // console.log('upload files:')
            // console.log(files)
            on_before(files);
            for (let i = 0; i < files.length; i++) {
                read_file(i, files[i], on_data, as_text);
            }
        }
        read_file(index, file, on_data, as_text = true) {
            const reader = new FileReader();
            reader.onload = function (e) {
                // https://github.com/Microsoft/TypeScript/issues/4163
                // or http://definitelytyped.org/guides/best-practices.html => Extending built-in types
                if (!reader.result)
                    return;
                on_data(index, file.name, reader.result);
            };
            if (as_text) {
                reader.readAsText(file);
            }
            else {
                reader.readAsArrayBuffer(file);
            }
        }
    }
    exports.Uploader = Uploader;
});
//# sourceMappingURL=uploader.js.map