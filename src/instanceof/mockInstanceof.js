function mockInstanceof(obj, constructorFunc) {
    let proto = obj.__proto__
    let prototype = constructorFunc.prototype
    while (true) {
        if (proto === null) {
            return false
        }
        if (proto === prototype) {
            return true
        }
        proto = proto.__proto__
    }
}

module.exports = mockInstanceof
