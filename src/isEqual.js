const obj1 = {
    a: 100,
    b: {
        x: 10,
        y: 1000
    }
}

const obj2 = {
    a: 100,
    b: {
        x: 10,
        y: 10000
    }
}

// 判断是否是对象或数组
function isObject(obj) {
    return typeof obj === 'object' && obj !== null
}

function isEqual(obj1, obj2) {
    if (!isObject(obj1) || !isObject(obj2)) {
        // 值类型（注意，参与 equal 的一般不会是函数）
        return obj1 === obj2
    }
    if (obj1 === obj2) {
        return true
    }

    // 两个都是引用类型，而且地址不相等
    const obj1Keys = Object.keys(obj1)
    const obj2Keys = Object.keys(obj2)
    if (obj1Keys.length === obj2Keys.length) {
        for (let key in obj1) {
            let res = isEqual(obj1[key], obj2[key])
            if (!res) {
                return false
            }
        }
        return true
    } else {
        return false
    }
}

isEqual(obj1, obj2)
