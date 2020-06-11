"use strict";
Number.prototype.toFixed2 = function (n) {
    // return this.toFixed(n)
    if (Math.floor(this) == this)
        return this.toString();
    return this.toFixed(n);
};
//# sourceMappingURL=ext.js.map