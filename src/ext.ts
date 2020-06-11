
Number.prototype.toFixed2 = function (n: number) {
    // return this.toFixed(n)
    if (Math.floor(this as number) == (this as number)) return this.toString()
    return this.toFixed(n)
}