function debounce(fn, delay = 500) {
    let timer = null
    return function(...args) {
        if (timer) {
            clearTimeout(timer)
        } else {
            timer = setTimeout(() => {
                fn.apply(this, args)
                timer = null
            }, delay)
        }
    }
}
