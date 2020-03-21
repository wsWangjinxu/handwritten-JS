const addMockCallApply = require('./addMockCallApply')
addMockCallApply()
let person = { name: 'zhangsan' }
let arr = [1, 2, 3]
function sayName(...args) {
    return {
        ctx: this,
        args
    }
}

test('should mockCall change this to context object', () => {
    let res = sayName.mockCall(person)
    expect(res.ctx.name).toBe(person.name)
})

test("should mockCall's this be window when context was fasly", () => {
    expect(sayName.mockCall().ctx).toBe(window)
})

test("should sayName's args be an array when use mockCall", () => {
    let res = sayName.mockCall(person, ...arr)
    expect(res.args.length).toBe(3)
})

test("should sayName's args[0] be an array when use mockApply", () => {
    let arr = [1, 2, 3]
    let res = sayName.mockApply(person, arr)
    expect(res.args[0].length).toEqual(3)
})
