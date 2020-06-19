function name_of(myEnum: any, n: number): string {
    // https://stackoverflow.com/questions/18111657/how-to-get-names-of-enum-entries/18112157#18112157
    let ns = n.toString(10)
    for (let enumMember in myEnum) {
        if (enumMember == ns) {
            return myEnum[enumMember]
        }
    }
    return `${n.toString(16).padStart(2, '0')}h`
}

export { name_of }
