interface IOn_before {
    (files: FileList): void
}
interface IOn_data {
    (index: number, name: string, data: string | ArrayBuffer): void
}

export class Uploader {
    constructor(ele_id: string,
        on_before: IOn_before,
        on_data: IOn_data, as_text: boolean = true) {
        const ele = document.getElementById(ele_id)
        if (!ele) return

        // console.log(`add onchange to ${ele_id}`)
        // console.log(ele)
        ele.addEventListener('change', e => {
            this.on_change(e, on_before, this.read_file, on_data, as_text)
        })
    }
    on_change(e: Event,
        on_before: IOn_before,
        read_file: (index: number, file: File, cb: IOn_data, as_text: boolean) => void,
        on_data: IOn_data, as_text: boolean = true) {
        const t = e.target as HTMLInputElement
        if (!t) return
        const files = t.files
        if (!files || !files.length) {
            return
        }
        // console.log('upload files:')
        // console.log(files)
        on_before(files)
        for (let i = 0; i < files.length; i++) {
            read_file(i, files[i], on_data, as_text)
        }
    }
    read_file(index: number, file: File,
        on_data: IOn_data, as_text: boolean = true) {
        const reader = new FileReader()
        reader.onload = function (e) {
            // https://github.com/Microsoft/TypeScript/issues/4163
            // or http://definitelytyped.org/guides/best-practices.html => Extending built-in types
            if (!reader.result) return
            on_data(index, file.name, reader.result)
        }

        if (as_text) {
            reader.readAsText(file)
        }
        else {
            reader.readAsArrayBuffer(file)
        }
    }
}