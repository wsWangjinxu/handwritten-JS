function Animal (name, color) {
    this.name = name
    this.color = color
}

Animal.prototype.say = function() {
    console.log("say")
}

Animal.prototype.sayName = function() {
    console.log(this.name)
}

function Dog() {
    Animal.apply(this, arguments)
}

Object.setPrototypeOf(Dog.prototype, Animal.prototype)