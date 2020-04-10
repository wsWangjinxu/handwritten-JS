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