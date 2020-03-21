const mockNew = require('./mockNew')

test('should mockNew accept a function return an object', () => {
    function Person(name) {
        this.name = name
    }
    let p1 = mockNew(Person, 'foo')
    let p2 = new Person('foo')
    expect(typeof p1).toBe('object')
    expect(typeof p2).toBe('object')
    expect(p1 instanceof Person).toBeTruthy()
    expect(p1.name).toEqual(p2.name)
    expect(p1.__proto__ === p2.__proto__).toBeTruthy()
    expect(p1.__proto__ === Person.prototype).toBeTruthy()
})
