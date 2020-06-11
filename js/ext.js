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
Date.prototype.format = function (fmt) {
    // https://blog.csdn.net/vbangle/article/details/5643091
    // https://stackoverflow.com/questions/36467469/is-key-value-pair-available-in-typescript/50167055#50167055
    const o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12,
        "H+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds() //毫秒         
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k].toString()) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};
//# sourceMappingURL=ext.js.map