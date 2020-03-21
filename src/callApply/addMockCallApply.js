function addMockCallApply() {
    Function.prototype.mockCall = function(contextObj = window, ...args) {
        contextObj = Object(contextObj)
        const key = Symbol()
        contextObj[key] = this
        let result = contextObj[key](...args)
        delete contextObj[key]
        return result
    }

    Function.prototype.mockApply = function(contextObj = window, args) {
        contextObj = new Object(contextObj)
        const key = Symbol()
        contextObj[key] = this
        let result = args.length ? contextObj[key](args) : contextObj[key]()
        delete contextObj[key]
        return result
    }
}

module.exports = addMockCallApply
