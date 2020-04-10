# handwritten-JS
JS面试 手写代码系列

* [手写一个new](#手写一个new)
* [手写一个call、apply](#手写一个call、apply)
* [手写一个bind](#手写一个bind)
* [手写一个instanceof](#手写一个instanceof)
* [手写一个ajax](#手写一个ajax)
* [手写一个继承](#手写一个继承)
* [手写一个函数柯里化](#手写一个函数柯里化currying)
* [手写一个节流](#手写一个节流throttle)
* [手写一个防抖](#手写一个防抖debounce)
* [手写一个深拷贝](#手写一个深拷贝)
* [手写一个数组扁平化](#手写一个数组扁平化)
* [手写一个promise](#手写一个promise)

## 手写一个new

`new`操作符做了哪些事情？
+ 创建一个新的对象
+ 新对象会被执行`[[Prototype]]`连接，关联到构造函数的`.prototype`对象上
+ 新对象会绑定到函数调用的`this`
+ 如果函数没有返回其他对象，那么`new`表达式中的函数会调用自动返回这个新对象

```js
function mockNew(func) {
    if (typeof func !== 'function') {
        throw Error('func is not a constructor')
    }
    let obj = {}
    Object.setPrototypeOf(obj, func.prototype)
    let tempObj = func.apply(obj, Array.prototype.slice.call(arguments, 1))
    if (typeof tempObj === 'object' || (typeof tempObj === 'function' && tempObj !== null)) {
        return tempObj
    } else {
        return obj
    }
}
```

## 手写一个call、apply

`Function.prototype.call`是如何工作的哪？实现原理是怎样的？

+ 指定调用时的第一个参数为`this`指向的对象
+ 如果传入一个原始值来当作`this`的绑定对象，这个原始值会被“装箱转换”成包装对象。
+ 实现原理是利用隐式绑定时`this`指向调用函数的上下文来将`this`转移到指定的对象上

`Function.ptototype.apply`与`Function.prototype.call`类似，只是前者接收参数数组，后者接收参数列表

```js
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
```

## 手写一个bind

`Function.prototype.bind`方法创建一个新的函数，在被调用的时候，这个新的函数的`this`被指定为`bind()`的第一个参数，而其余的参数将作为新函数的初始参数，供调用时使用。

实现思路：
+ 利用闭包保存调用`bind`时的`this`，这时的`this`就是原函数
+ 使用`call/apply`指定`this`
+ 返回一个绑定函数
+ 当返回的绑定函数被`new`运算符调用的时候，绑定的上下文指向`new`运算符创建的对象
+ 将绑定函数的`prototype`修改为原函数的`prototype`

```js
Function.prototype.mockBind = function(contextObj, ...initArgs) {
    let fn = this
    let bindFn = function(...args) {
        return fn.call(this instanceof bindFn ? this : contextObj, ...initArgs, ...args)
    }
    bindFn.prototype = Object.create(fn.prototype)
    return bindfn
}
```

## 手写一个instanceof

`instanceof`运算符用来检测构造函数的`prototype`属性是否出现在左侧实例对象的原型链上，是就返回`true`，否则返回`false`

```js
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
```

## 手写一个ajax

readyState的几个状态：
+ 0 （未初始化）还没有调用 send 方法
+ 1 （载入）已调用 send 方法，正在发送请求
+ 2 （载入完成）send 方法执行完成，已经接收到全部响应内容
+ 3 （交互）正在解析响应内容
+ 4 （完成）响应内容解析完成，可以在客户端调用

```js
const xhr = new XMLHttpRequest()
xhr.open('GET', '/data/test.json', true) // true 表示异步，false 表示同步
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        alert(xhr.responseText)
    }
}

const postData = {
    username: 'zhangsan',
    password: 'xxx'
}
xhr.send(JSON.stringify(postData))
```

## 手写一个节流throttle

在一些需要高频触发事件的地方，可以使用节流来做性能优化。一般来说窗口的滚动事件，鼠标的移动，在不进行节流的情况下是非常耗费性能的。使用节流可以让事件以一定的频率触发（减少事件触发的频率），从而达到在满足需求的情况下提升性能的目的。

```js
function throttle(fn, delay = 100) {
    let timer = null
    return function(...args) {
        if (timer) {
            return
        }
        timer = setTimeout(() => {
            fn.apply(this, args)
            timer = null
        }, delay)
    }
}

```

## 手写一个防抖debounce

用户多次点击一个按钮，使用防抖的话，仅仅会在最后一次触发——一个典型的性能优化场景。

```js
function debounce(fn, delay = 500) {
    let timer = null
    return function(...args) {
        if (timer) {
            clearTimeout(timer)
        } else {
            timer = setTimeout(() => {
                fn.apply(this, args)
                timer = null
            }, delay)
        }
    }
}

```

## 手写一个继承

```js
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
```
## 手写一个函数柯里化currying
所谓的柯里化函数，就是封装一系列的处理步骤，通过闭包将参数集中起来计算，最后再把需要处理的参数传进去。

实现原理：用闭包把传入的参数保存起来，当出入参数的数量足够执行函数时，就开始执行函数。

```js
function currying(fn, length) {
  length = length || fn.length
  return function(...args) {
    return args.length >= length ?
      fn.apply(this, args):
      currying(fn.bind(this, ...args), length - args.length)
  }
}
```

## 手写一个深拷贝

```js
function deepClone(obj = {}) {
    if (typeof obj !== 'object' || obj == null) {
        return obj // obj 是 null，或者不是对象和数组，直接返回
    }

    // 初始化返回结果
    let result
    if (obj instanceof Array) {
        result = []
    } else {
        result = {}
    }

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            // 保证 key 不是原型或原型链的数据
            result[key] = deepClone(obj[key])
        }
    }

    return result
}
```

## 手写一个数组扁平化

```js
function flat(arr) {
    // 验证 arr 中，还有没有深层数组
    const isDeep = arr.some(item => item instanceof Array)
    if(isDeep) {
        return arr
    }

    const res = Array.prototype.concat.apply([], arr)
    return flat(arr) // 递归
}
```

## 手写一个promise

流程：
+ 实现 promise 的基本框架
+ 增加状态机
+ 实现 then 方法
+ 实现异步调用
+ 实现 then 的链式调用
+ 实现 catch 的异常处理

```js
const PENDING = 'PENDING'
const RESOLVE = 'RESOLVE'
const REJECTED = 'REJECTED'

class APromise {
  constructor(executor) {
    this.state = PENDING
    // .then handler queue
    this.queue = []

    doResolve(this, executor)
  }

  then(onResolved, onRejected) {
    const promise = new APromise(() => {})
    // store the promise as well
    handle(this, { promise, onResolved, onRejected })
    return promise
  }
  catch(func) {
    this.then.call(this, null, func)
  }

  // 实现 Promise.all
  static all(arr) {
    return new Promise((fulfill, rejected) => {
      let result = []
      for (let i = 0; i < arr.length; i++) {
        arr[i].then(res => {
          result[i] = res
          if (result.length === arr.length) {
            fulfill(result)
          }
        }, rejected)
      }
    })
  }

  // 实现 Promise.race
  static race(arr) {
    return new Promise((fulfill, rejected) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i].then(fulfill, rejected)
      }
    })
  }
}

function resolve(promise, value) {
  promise.state = RESOLVE
  promise.value = value
  finale(promise)
}

function reject(promise, reason) {
  promise.state = REJECTED
  promise.value = reason
  finale(promise)
}

function doResolve(promise, executor) {
  let called = false

  function wrapResolve(value) {
    if (called) {
      return
    }
    called = true
    resolve(promise, value)
  }

  function wrapReject(reason) {
    if (called) {
      return
    }
    called = true
    reject(promise, reason)
  }

  try {
    executor(wrapResolve, wrapReject)
  } catch (err) {
    wrapReject(err)
  }
}

// 检查 promise 的状态
function handle(promise, handler) {
  while (promise.value instanceof APromise) {
    promise = promise.value
  }
  if (promise.state === PENDING) {
    // 等待状态入队
    promise.queue.push(handler)
  } else {
    // 立即执行
    handleResolved(promise, handler)
  }
}

// 调用所有的handler
function finale(promise) {
  const length = promise.queue.length
  for (let i = 0; i < length; i++) {
    handle(promise, promise.queue[i])
  }
}

function handleResolved(promise, handler) {
  const cb = promise.state === RESOLVE ? handler.onResolved : handler.onRejected
  try {
    const value = cb(promise.value)
    resolve(handler.promise, value)
  } catch (err) {
    reject(handler.promise, err)
  }
}
```
