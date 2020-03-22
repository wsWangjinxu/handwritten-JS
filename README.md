# handwritten-JS
JS面试 手写代码系列

## 手写一个 new

`new`操作符做了哪些事情？
+ 创建一个新的对象
+ 新对象会被执行`[[Prototype]]`连接，关联到构造函数的`.prototype`对象上
+ 新对象会绑定到函数调用的`this`
+ 如果函数没有返回其他对象，那么`new`表达式中的函数会调用自动返回这个新对象

## 手写一个 call、apply

`Function.prototype.call`是如何工作的哪？实现原理是怎样的？

+ 指定调用时的第一个参数为`this`指向的对象
+ 如果传入一个原始值来当作`this`的绑定对象，这个原始值会被“装箱转换”成包装对象。
+ 实现原理是利用隐式绑定时`this`指向调用函数的上下文来将`this`转移到指定的对象上

`Function.ptototype.apply`与`Function.prototype.call`类似，只是前者接收参数数组，后者接收参数列表

## 手写一个 bind

`Function.prototype.bind`方法创建一个新的函数，在被调用的时候，这个新的函数的`this`被指定为`bind()`的第一个参数，而其余的参数将作为新函数的初始参数，供调用时使用。

实现思路：
+ 利用闭包保存调用`bind`时的`this`，这时的`this`就是原函数
+ 使用`call/apply`指定`this`
+ 返回一个绑定函数
+ 当返回的绑定函数被`new`运算符调用的时候，绑定的上下文指向`new`运算符创建的对象
+ 将绑定函数的`prototype`修改为原函数的`prototype`

## 手写一个 instanceof

`instanceof`运算符用来检测构造函数的`prototype`属性是否出现在左侧实例对象的原型链上，是就返回`true`，否则返回`false`

## 手写一个 ajax
