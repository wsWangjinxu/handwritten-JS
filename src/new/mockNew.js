function mockNew(func) {
    if (typeof func !== 'function') {
        throw Error('func is not a constructor')
    }
    let obj = {}
    Object.setPrototypeOf(obj, func.prototype)
    let tempObj = func.apply(obj, Array.prototype.slice.call(arguments, 1))
    if (typeof tempObj === 'object' || (typeof tempObj === 'function' && tempObj !== null)) {
        return tempObj
    } else {
        return obj
    }
}

module.exports = mockNew
