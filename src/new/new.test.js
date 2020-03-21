const mockNew = require('./new')

test('should mockNew accept a function return an object', () => {
    function Person(name) {
        this.name = name
    }
    let p1 = mockNew(Person, 'foo')
    let p2 = new Person('foo')
    expect(typeof p1).toBe('object')
    expect(typeof p2).toBe('object')
    expect(p1 instanceof Person).toBe(true)
    expect(p1.name).toBe(p2.name)
    expect(p1.__proto__ === p2.__proto__).toBe(true)
    expect(p1.__proto__ === Person.prototype).toBe(true)
})
