const APromise = require('./APromise')

test('接收一个执行器函数并立即调用', () => {
  const executor = jest.fn()
  const promise = new APromise(executor)
  expect(executor.mock.calls.length).toBe(1)
  expect(typeof executor.mock.calls[0][0]).toBe('function')
  expect(typeof executor.mock.calls[0][1]).toBe('function')
})

test('PENDING  state', () => {
  const promise = new APromise(function executor(resolve, reject) {})
  expect(promise.state).toBe('PENDING')
})

test('变更到 resolve 状态并返回值', () => {
  const value = 'resolveValue'
  const promise = new APromise((resolve, reject) => {
    resolve(value)
  })
  expect(promise.state).toBe('RESOLVE')
})

test('变更到 reject 状态并返回', () => {
  const reason = 'rejectValue'
  const promise = new APromise((resolve, reject) => {
    reject(reason)
  })
  expect(promise.state).toBe('REJECTED')
})

test('then 方法', () => {
  const promise = new APromise(() => {})
  expect(typeof promise.then).toBe('function')
})

test('当 promise resolve 的时候调用 onResolve 方法', () => {
  const value = 'onResolve resolve'
  const onResolved = jest.fn()
  const promise = new APromise((resolve, reject) => {
    resolve(value)
  }).then(onResolved)
  expect(onResolved.mock.calls.length).toBe(1)
  expect(onResolved.mock.calls[0][0]).toBe(value) // 第一次调用的第一个参数
})

test('当 promise reject 的时候调用 onReject 方法', () => {
  const reason = 'onReject reason'
  const onRejected = jest.fn()
  const promise = new APromise((resolve, reject) => {
    reject(reason)
  }).then(null, onRejected)
  expect(onRejected.mock.calls.length).toBe(1)
  expect(onRejected.mock.calls[0][0]).toBe(reason)
})

test('当 promise resolved 以后不能再次被  rejected', () => {
  const value = 'resolved'
  const reason = 'rejected'
  const onResolved = jest.fn()
  const onRejected = jest.fn()
  const promise = new APromise((resolve, reject) => {
    resolve(value)
    reject(reason)
  })
  promise.then(onResolved, onRejected)

  expect(onResolved.mock.calls.length).toBe(1)
  expect(onRejected.mock.calls.length).toBe(0)
  expect(promise.state).toBe('RESOLVE')
  expect(promise.value).toBe(value)
})

test('当 promise rejected 以后不能再次被  resolved', () => {
  const value = 'resolved'
  const reason = 'rejected'
  const onResolved = jest.fn()
  const onRejected = jest.fn()
  const promise = new APromise((resolve, reject) => {
    reject(reason)
    resolve(value)
  })
  promise.then(onResolved, onRejected)

  expect(onResolved.mock.calls.length).toBe(0)
  expect(onRejected.mock.calls.length).toBe(1)
  expect(promise.state).toBe('REJECTED')
  expect(promise.value).toBe(reason)
})

test('当执行器中有错误的时候，promise 应该将状态转换为 rejected', () => {
  const reason = new Error('error rejected')
  const onRejected = jest.fn()
  const promise = new APromise((resolve, reject) => {
    throw reason
  })
  promise.then(null, onRejected)
  expect(promise.state).toBe('REJECTED')
  expect(onRejected.mock.calls.length).toBe(1)
  expect(onRejected.mock.calls[0][0]).toBe(reason)
})

test('当 promise 没有立即决议的时候将回调入队', () => {
  const value = 'async resolve'
  const promise = new APromise((resolve, reject) => {
    setTimeout(resolve, 1, value)
  })

  const onFulfilled = jest.fn()

  promise.then(onFulfilled)

  setTimeout(() => {
    // 应该被调用 1 次
    expect(onFulfilled).toHaveBeenCalledTimes(1)
    expect(onFulfilled.mock.calls[0][0]).toBe(value)
    promise.then(onFulfilled)
  }, 5)

  // 应该没有被调用
  expect(onFulfilled.mock.calls.length).toBe(0)

  setTimeout(() => {
    // 应该被调用两次
    expect(onFulfilled.mock.calls.length).toBe(2)
    expect(onFulfilled.mock.calls[1][0]).toBe(value)
  }, 10)
})

test('当 promise 没有立即拒绝的时候将回调入队', () => {
  const reason = 'async rejected'
  const promise = new APromise((resolve, reject) => {
    setTimeout(reject, 1, reason)
  })

  const onRejected = jest.fn()

  promise.then(null, onRejected)

  setTimeout(() => {
    // 应该被调用 1 次
    expect(onRejected.mock.calls.length).toBe(1)
    expect(onRejected.mock.calls[0][0]).toBe(reason)
    promise.then(null, onRejected)
  }, 5)

  // 应该没有被调用
  expect(onRejected.mock.calls.length).toBe(0)

  setTimeout(() => {
    // 应该被调用两次
    expect(onRejected.mock.calls.length).toBe(2)
    expect(onRejected.mock.calls[1][0]).toBe(reason)
  }, 10)
})

test('then 方法应该返回一个 promise', () => {
  expect(function() {
    const qOnFulfilled = jest.fn()
    const rOnFulfilled = jest.fn()
    const p = new APromise(fulfill => fulfill())
    const q = p.then(qOnFulfilled)
    const r = q.then(rOnFulfilled)
  }).not.toThrow()
})

test('当 then 方法的 onResolved 方法被调用，它应该转换到 resolved 状态', () => {
  const value = 'resolved'
  const f1 = jest.fn()
  new APromise(fulfill => fulfill()).then(() => value).then(f1)
  expect(f1.mock.calls.length).toBe(1)
  expect(f1.mock.calls[0][0]).toBe(value)
})

test('当 then 方法的 onRejected 方法被调用，它应该被转换到 resolved 状态', () => {
  const value = 'resolved'
  const f1 = jest.fn()
  new APromise((fulfill, reject) => reject()).then(null, () => value).then(f1)
  expect(f1.mock.calls.length).toBe(1)
  expect(f1.mock.calls[0][0]).toBe(value)
})

test('当 then 方法的 onResolved 方法被调用并且有错误，它应该被转换到 rejected 状态', () => {
  const reason = new Error('fail')
  const f1 = jest.fn()
  new APromise(fulfill => fulfill())
    .then(() => {
      throw reason
    })
    .then(null, f1)

  expect(f1.mock.calls.length).toBe(1)
  expect(f1.mock.calls[0][0]).toBe(reason)
})

test('当 then 方法的 onRejected 方法被调用并且有错误，它应该被转换到 rejected 状态', () => {
  const reason = new Error('fail')
  const f1 = jest.fn()
  new APromise((fulfill, reject) => reject())
    .then(null, () => {
      throw reason
    })
    .then(null, f1)

  expect(f1.mock.calls.length).toBe(1)
  expect(f1.mock.calls[0][0]).toBe(reason)
})

test('异步处理程序，如果一个 handler 返回了一个 promise，前一个 promise 应该采用这个返回的 promise 的状态', () => {
  const value = 'resolve'
  const f1 = jest.fn()
  new APromise(fulfill => fulfill())
    .then(() => new APromise(resolve => resolve(value)))
    .then(f1)

  expect(f1.mock.calls.length).toBe(1)
  expect(f1.mock.calls[0][0]).toBe(value)
})

test('异步处理程序，如果一个 handler 在将来返回了一个 promise，那么过去的 promise 应该采用未来返回的 promise 的状态', () => {
  const value = 'resolve'
  const f1 = jest.fn()
  new APromise(fulfill => fulfill())
    .then(() => new APromise(resolve => setTimeout(resolve, 0, value)))
    .then(f1)
  setTimeout(() => {
    expect(f1.mock.calls.length).toBe(1)
    expect(f1.mock.calls[0][0]).toBe(value)
  }, 10)
})

test('catch', () => {
  const reason = new Error('fail')
  const f1 = jest.fn()
  new APromise(fulfill => {
    throw reason
  }).catch(f1)
  expect(f1).toHaveBeenCalledTimes(1)
})

test('promise.all 所有都通过', () => {
  let value = 'resolve'
  let promiseArr = []
  for (let i = 0; i < 3; i++) {
    promiseArr.push(new APromise(resolve => resolve(value)))
  }
  let result = APromise.all(promiseArr)
  result.then(res => {
    expect(res.length).toBe(3)
    expect(res[0]).toBe(value)
    expect(res[1]).toBe(value)
    expect(res[2]).toBe(value)
  })
})

test('promise.all 部分不通过', () => {
  let value = 'resolve'
  let reason = 'rejected'
  let promiseArr = []
  for (let i = 0; i < 3; i++) {
    promiseArr.push(new APromise(resolve => resolve(value)))
  }
  promiseArr.push(new APromise((resolve, reject) => reject(reason)))
  let result = APromise.all(promiseArr)
  result.then(res => {
    expect(res.length).toBe(4)
    expect(res[0]).toBe(value)
    expect(res[1]).toBe(value)
    expect(res[2]).toBe(value)
    expect(res[3]).toBe(reason)
  })
})
