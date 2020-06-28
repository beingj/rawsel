function name_of(myEnum: any, n: number): string {
    // https://stackoverflow.com/questions/18111657/how-to-get-names-of-enum-entries/18112157#18112157
    let ns = n.toString(10)
    for (let enumMember in myEnum) {
        if (enumMember == ns) {
            return myEnum[enumMember]
        }
    }
    return n.toHexh()
}

function two_complement(v: number, bits: number = 8) {
    if ((v >> (bits - 1)) == 0) {
        // positive
        return v
    }
    else {
        // negative
        return v - (1 << bits)
    }
}

function hex2ArrayBuffer(hex: string, offset: number = 0) {
    let ns: number[] = []
    hex.split('\n')
        .filter(i => i.startsWith('0000'))
        .forEach(j => j.split(/\s+/).slice(1)
            .forEach(k => {
                ns.push(parseInt(k.substr(0, 2), 16))
                ns.push(parseInt(k.substr(2, 2), 16))
            })
        )
    if (offset != 0) {
        ns = ns.slice(offset)
    }
    const ab = new ArrayBuffer(ns.length)
    const ua = new Uint8Array(ab)
    ns.forEach((_, i) => {
        ua[i] = ns[i]
    })
    return ab
}

export { name_of, hex2ArrayBuffer, two_complement }
