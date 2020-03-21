function addMockBind() {
    Function.prototype.mockBind = function(contextObj, ...initArgs) {
        let fn = this
        let bindFn = function(...args) {
            return fn.call(this instanceof bindFn ? this : contextObj, ...initArgs, ...args)
        }
        bindFn.prototype = Object.create(fn.prototype)
        return bindfn
    }
}

module.exports = addMockBind
