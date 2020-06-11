"use strict";
// https://stackoverflow.com/questions/57132428/augmentations-for-the-global-scope-can-only-be-directly-nested-in-external-modul
// https://my.oschina.net/tearlight/blog/3059568
Number.prototype.toFixed2 = function (n) {
    if (Math.floor(this) == this) {
        // int
        return this.toString();
    }
    // float
    return this.toFixed(n);
};
Date.today = function () {
    let date = new Date;
    date.setHours(0, 0, 0, 0);
    return date;
};
//# sourceMappingURL=ext.js.map