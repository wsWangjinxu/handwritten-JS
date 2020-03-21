const addMockBind = require('./mockBind')

let person = {
    name: 'zhangsan'
}

function sayName(...args) {
    return {
        ctx: this,
        args
    }
}

addMockBind()

test('should mockBind return a function which bind this to the context', () => {
    let bindSayName = sayName.bind(person)
    expect(typeof bindSayName).toBe('function')
    let res = bindSayName()
    expect(res.ctx).toEqual(person)
    expect(res.ctx.name).toBe('zhangsan')
})

test('should mockBind does not use context object when bindFn used by new operator', () => {
    let bindSayName = sayName.bind(person)
    let bindObj = new bindSayName()
    expect(bindObj.ctx).not.toEqual(person)
    expect(bindObj.ctx instanceof sayName).toBeTruthy()
})
