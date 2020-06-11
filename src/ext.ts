// https://stackoverflow.com/questions/57132428/augmentations-for-the-global-scope-can-only-be-directly-nested-in-external-modul
// https://my.oschina.net/tearlight/blog/3059568

interface Number {
    toFixed2(n: number): string
}

interface DateConstructor {
    today: () => Date
}

Number.prototype.toFixed2 = function (n: number) {
    if (Math.floor(this as number) == (this as number)) {
        // int
        return this.toString()
    }
    // float
    return this.toFixed(n)
}

Date.today = function () {
    let date = new Date;
    date.setHours(0, 0, 0, 0);
    return date;
}
