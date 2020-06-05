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
        constructor(ele_id, on_before, on_data) {
            const ele = document.getElementById(ele_id);
            if (!ele)
                return;
            ele.addEventListener('change', e => {
                this.on_change(e, on_before, this.read_file, on_data);
            });
        }
        on_change(e, on_before, read_file, on_data) {
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
                read_file(i, files[i], on_data);
            }
        }
        read_file(index, file, on_data) {
            const reader = new FileReader();
            reader.onload = function (e) {
                // https://github.com/Microsoft/TypeScript/issues/4163
                // or http://definitelytyped.org/guides/best-practices.html => Extending built-in types
                const result = reader.result;
                if (!result)
                    return;
                // result = result as string
                let data;
                if (result == 'data:') {
                    data = '';
                }
                else {
                    data = atob(result.split(';')[1].split(',')[1]);
                }
                on_data(index, file.name, data);
            };
            reader.readAsDataURL(file);
        }
    }
    exports.Uploader = Uploader;
});
