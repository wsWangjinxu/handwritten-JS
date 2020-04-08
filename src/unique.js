function unique(arr) {
    const res = []
    arr.forEach((element) => {
        if (~res.indexOf(element)) {
            res.push(element)
        }
    })
    return res
}
