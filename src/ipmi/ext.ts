// https://stackoverflow.com/a/59499895
// https://my.oschina.net/tearlight/blog/3059568

interface Number {
    toFixed2(n: number): string
    toHex(width?: number): string
    toHexh(width?: number): string
    toDecHexh(width?: number): string
}

Number.prototype.toFixed2 = function(n: number) {
    if (Math.floor(this as number) === (this as number)) {
        // int
        return this.toString()
    }
    // float
    return this.toFixed(n)
}

Number.prototype.toHex = function(width?: number) {
    if (Math.floor(this as number) === (this as number)) {
        // int
        if (width === undefined) {
            width = 2
        }
        return this.toString(16).padStart(width, "0")
    }
    // float
    return this.toString()
}

Number.prototype.toHexh = function(width?: number) {
    return this.toHex(width) + "h"
}

Number.prototype.toDecHexh = function(width?: number) {
    return this.toString() + " / " + this.toHex(width) + "h"
}

interface DateConstructor {
    today: () => Date
}

Date.today = () => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
}
interface Date {
    format(fmt: string): string
}

Date.prototype.format = function(fmt: string) {
    // https://blog.csdn.net/vbangle/article/details/5643091
    // https://stackoverflow.com/questions/36467469/is-key-value-pair-available-in-typescript/50167055#50167055
    const o: { [key: string]: number } = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours() % 12 === 0 ? 12 : this.getHours() % 12, // 小时
        "H+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        S: this.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        )
    }
    for (const k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1
                    ? o[k].toString()
                    : ("00" + o[k]).substr(("" + o[k]).length)
            )
        }
    }
    return fmt
}

interface Array<T> {
    indexOfOr(n: number, def: T): T
}
Array.prototype.indexOfOr = function<T>(n: number, def: T) {
    return indexOfOr<T>(this, n, def)
}
function indexOfOr<T>(x: T[], n: number, def: T) {
    if (n < 0 || n >= x.length) {
        return def
    }
    return x[n]
}

interface Array<T> {
    bitsOr(n: number, def: T): T[]
}
Array.prototype.bitsOr = function<T>(n: number, def: T) {
    return bitsOr<T>(this, n, def)
}
function bitsOr<T>(x: T[], n: number, def: T) {
    const len = x.length
    let bit_n = 0
    const bits: T[] = []
    while (n > 0) {
        if (bit_n < len) {
            if ((n & 1) === 1) {
                bits.push(x[bit_n])
            }
        } else {
            bits.push(def)
        }
        n = n >> 1
        bit_n++
    }
    return bits
}
