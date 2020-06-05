interface IOn_before {
    (files: FileList): void
}
interface IOn_data {
    (index: number, name: string, data: string): void
}

export class Uploader {
    constructor(ele_id: string,
        on_before: IOn_before,
        on_data: IOn_data) {
        const ele = document.getElementById(ele_id)
        if (!ele) return

        ele.addEventListener('change', e => {
            this.on_change(e, on_before, this.read_file, on_data)
        })
    }
    on_change(e: Event,
        on_before: IOn_before,
        read_file: (index: number, file: File, cb: IOn_data) => void,
        on_data: IOn_data) {
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
            read_file(i, files[i], on_data)
        }
    }
    read_file(index: number, file: File,
        on_data: IOn_data) {
        const reader = new FileReader()
        reader.onload = function (e) {
            // https://github.com/Microsoft/TypeScript/issues/4163
            // or http://definitelytyped.org/guides/best-practices.html => Extending built-in types
            const result = reader.result as string
            if (!result) return
            // result = result as string
            let data: string
            if (result == 'data:') {
                data = ''
            }
            else {
                data = atob(result.split(';')[1].split(',')[1])
            }
            on_data(index, file.name, data)
        }
        reader.readAsDataURL(file)
    }
}