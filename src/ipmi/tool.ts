function name_of(myEnum: any, n: number): string {
    // https://stackoverflow.com/questions/18111657/how-to-get-names-of-enum-entries/18112157#18112157
    const ns = n.toString(10)
    for (const enumMember in myEnum) {
        if (enumMember === ns) {
            return myEnum[enumMember]
        }
    }
    return n.toHexh()
}

function two_complement(v: number, bits: number = 8) {
    if ((v >> (bits - 1)) === 0) {
        // positive
        return v
    } else {
        // negative
        return v - (1 << bits)
    }
}

function hex2ArrayBuffer(hex: string, offset: number = 0) {
    let ns: number[] = []
    hex.split('\n')
        .filter((i) => i.startsWith('0000'))
        .forEach((j) => j.split(/\s+/).slice(1)
            .forEach((k) => {
                ns.push(parseInt(k.substr(0, 2), 16))
                ns.push(parseInt(k.substr(2, 2), 16))
            })
        )
    if (offset !== 0) {
        ns = ns.slice(offset)
    }
    const ab = new ArrayBuffer(ns.length)
    const ua = new Uint8Array(ab)
    ns.forEach((_, i) => {
        ua[i] = ns[i]
    })
    return ab
}

function str2ArrayBuffer(str: string) {
    // https://stackoverflow.com/questions/6965107/converting-between-strings-and-arraybuffers/11058858#11058858
    const buf = new ArrayBuffer(str.length)
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

function ArrayBuffer2str(ab: ArrayBuffer) {
    // https://stackoverflow.com/questions/26754486/how-to-convert-arraybuffer-to-string/38306880#38306880
    // https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder
    return new TextDecoder("ascii").decode(new Uint8Array(ab))
}

export { name_of, two_complement, hex2ArrayBuffer, str2ArrayBuffer, ArrayBuffer2str }
