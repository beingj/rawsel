import { SdrRecord, SdrRecordType1, hex2ArrayBuffer } from "./ipmi/index"

export { test_data }

const test_data = {
    sdr: sdr_data(),
    sel: `
      |Record|           |GenID|GenID |      |Sensor|        |EvtDir|Event|Event|Event|
  ID  | Type | TimeStamp |(Low)|(High)|EvMRev| Type |Sensor #| Type |Data1|Data2|Data3|
------|------|-----------|-----|------|------|------|--------|------|-----|-----|-----|
     0|    1 |         2 |   3 |    4 |    5 |    6 |      7 |    8 |   9 |  10 |  11 |
 0109h|   02h| 5ed08d86h |  20h|   00h|   04h|   01h|     33h|   81h|  57h|  27h|  28h|
 0e35h|   02h| 00000001h |  20h|   00h|   04h|   07h|     92h|   83h|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     94h|   02h|  a1h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   21h|     62h|   6fh|  09h|  08h|  04h|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   04h|     64h|   6fh|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   10h|     ffh|   6fh|  f1h|  02h|  23h|
 0e35h|   02h| 5ecd80f5h |  20h|   00h|   04h|   10h|     ffh|   6fh|  f1h|  02h|  11h|
`
}

function sdr_data() {
    const hex = `
00000000:	0100	5101	3520	0001
00000008:	0300	7f68	0101	800a
00000010:	807a	3838	0001	0000
00000018:	0600	0000	00f0	0797
00000020:	ff00	ff00	4d4b	4200
00000028:	8388	0000	0000	00ca
00000030:	496e	6c65	745f	5465
00000038:	6d70	0200	5101	3620
00000040:	0002	0300	7f68	0101
00000048:	800a	807a	3838	0001
00000050:	0000	0600	0000	00f0
00000058:	0797	ff00	ff00	7f7d
00000060:	7500	8388	0000	0000
00000068:	00cb	4f75	746c	6574
00000070:	5f54	656d	7003	0051
00000078:	0134	2000	0303	007f
00000080:	6801	0180	0a80	7a38
00000088:	3800	0100	0005	0000
00000090:	0000	f007	97ff	00ff
00000098:	007f	afaa	0000	0000
000000a0:	0000	0000	c943	5055
000000a8:	305f	5465	6d70
`
    const ab = hex2ArrayBuffer(hex)
    return ab
    // return repeat_sdr(ab)
}

// @ts-ignore
function repeat_sdr(bin: ArrayBuffer) {
    // there are 3 records in sdr_data above
    // we need total 72(2*4*3*3), so repeat=72/3=24
    const repeat = 24
    const ua1 = new Uint8Array(bin)
    const len = bin.byteLength
    const ab = new ArrayBuffer(len * repeat)
    const ua2 = new Uint8Array(ab)
    for (let i = 0; i < repeat; i++) {
        ua1.forEach((b, j) => {
            ua2[i * len + j] = b
        })
    }

    const x = SdrRecord.from(ab) as SdrRecordType1[]
    x.forEach((r, i) => {
        r.record_id = i + 1
        r.sensor_num = i + 1
        r.m = 6
        r.b = 7
        r.bexp = 8
        r.rexp = 9
    })

    let idx = 0
    // total 72= 2*4*3*3
    let sdr = x[idx]
    for (const m of [1, 2]) {
        for (const b of [0, 1, 3.4, -3.5]) {
            for (const bexp of [0, 1, 4]) {
                for (const rexp of [0, 1, 5]) {
                    sdr.m = m
                    sdr.b = b
                    sdr.bexp = bexp
                    sdr.rexp = rexp
                    sdr.update_formula()
                    idx++
                    sdr = x[idx]
                }
            }
        }
    }

    return x
}
