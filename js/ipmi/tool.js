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
    exports.name_of = void 0;
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
});
//# sourceMappingURL=tool.js.map