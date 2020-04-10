function currying(fn, length) {
    length = length || fn.length
    return function(...args) {
        args.length >= length ?
        fn.aplly(this, args) :
        currying(fn.bind(this, ...args), length - args.length)
    }
}