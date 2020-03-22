const mockInstanceof = require('./mockInstanceof')
class Car {
    constructor(make, model, year) {
        this.make = make
        this.model = model
        this.year = year
    }
}
const auto = new Car('Honda', 'Accord', 1998)

test('should auto instanceof Car toBeTruthy ', () => {
    let obj = {}
    expect(mockInstanceof(auto, Car)).toBeTruthy()
    expect(mockInstanceof(obj, Car)).toBeFalsy()
})
