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
