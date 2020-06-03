const test = `
 0e37h|   02h| 5ecd80fbh |  20h|   00h|   04h|   07h|     92h|   83h|  01h|  ffh|  ffh|
 0e36h|   02h| 5ecd80f9h |  20h|   00h|   04h|   05h|     92h|   03h|  01h|  ffh|  ffh|
 0e35h|   02h| 5ecd80f7h |  20h|   00h|   04h|   07h|     92h|   83h|  01h|  ffh|  ffh|
 0e34h|   02h| 5ecd80f5h |  20h|   00h|   04h|   07h|     92h|   03h|  01h|  ffh|  ffh|
 0cbfh|   02h| 5ecd735fh |  20h|   00h|   04h|   01h|     2ch|   81h|  59h|  2ch|  2dh|
 0102h|   02h| 5ed00c55h |  21h|   00h|   04h|   0ch|     e6h|   6fh|  a5h|  02h|  60h|
 0101h|   02h| 5ed00c55h |  21h|   00h|   04h|   0ch|     e6h|   6fh|  a5h|  02h|  60h|
 0100h|   02h| 5ed00c55h |  21h|   00h|   04h|   0ch|     e6h|   6fh|  a5h|  02h|  60h|
 0cbeh|   02h| 5ecd735dh |  20h|   00h|   04h|   01h|     2ch|   01h|  59h|  2dh|  2dh|
`

var app = new Vue({
    el: '#app',
    data: {
        timezone: SelRecord.timezone,
        raw: '',
        srs: [],
        files: []
    },
    watch: {
        timezone: function () {
            this.srs.forEach(i => i.change_timezone(this.timezone))
        },
        raw: function () {
            var x = null
            try {
                x = []
                this.raw.split('\n').forEach(i => i.match('^ *[0-9a-f]{4}h') ? x.push(new SelRecord(i)) : null)
            } catch (error) {

            }
            if (x !== null) {
                this.srs = x
            }
        }
    }
})

app.raw = test

new Uploader('raw_file', () => {
    // console.log('clear list')
    while (app.files.length > 0) app.files.pop()
    app.raw = ''
}, (_, name, data) => {
    // console.log('on_file: ' + index + ', ' + name)
    app.files.push(name)
    app.raw += data
}
)