function query(name) {
    const search = location.search.substr(1)

    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
    const res = search.match(reg)

    if (res == null) {
        return null
    }
    return res[2]
}

// URLSearchParams

function query2(name) {
    const search = location.search
    const p = new URLSearchParams(search)
    return p.get(name)
}
