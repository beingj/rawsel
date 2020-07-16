import { SdrRecord } from "@/ipmi"

export interface Bag {
    sdrs?: SdrRecord[]
    update?: () => void
}

type IOn_data = (
    index: number,
    name: string,
    data: string | ArrayBuffer
) => void

export function read_file(
    files: File | File[] | FileList,
    on_data: IOn_data,
    as_text: boolean = true
) {
    // console.log(files)
    if (!files) {
        return
    }
    if (files instanceof File) {
        files = [files]
    }
    // console.log(files.length)
    // console.log(files)
    for (let i = 0; i < files.length; i++) {
        // read_file(i, files[i], on_data, as_text);
        const file = files[i]
        const reader = new FileReader()
        reader.onload = (_) => {
            // https://github.com/Microsoft/TypeScript/issues/4163
            // or http://definitelytyped.org/guides/best-practices.html => Extending built-in types
            if (!reader.result) {
                return
            }
            on_data(i, file.name, reader.result)
        }
        if (as_text) {
            reader.readAsText(file)
        } else {
            reader.readAsArrayBuffer(file)
        }
    }
}
