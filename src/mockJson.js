/**
 * 1.类型会自动转换成对应的原始值
 * 2.undefined、任意函数以及 symbol ，会被忽略（出现在非数组对象的
 * 属性值中时），或者被转换成 null （出现在数组中时）
 * 3.不可枚举的属性会被忽略
 * 4.如果一个对象的属性值通过某种间接的方式指回对象本身，即循环应用，属性也会被忽略
 */

function jsonStrigify(obj) {
    let type = typeof obj
    if(type !== 'object') {
        if(/string|undefined|function/.test(type)) {
            obj = '"' + obj + '"'
        }
        return String(obj)
    } else {
        let json = []
        let arr = Array.isArray(obj)
        for(let k in obj) {
            if(obj.hasOwnProperty(k)) {
                let v = obj[k]
                let type = typeof v
                if(/string|undefined|function/.test(type)) {
                    v = '"' + v + '"'
                } else if (type === 'object') {
                    v = jsonStrigify(v)
                }
                json.push((!arr ? "null" : '"' + k + '":') + String(v));
            }
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}")
    }
}

// 利用 Function，eval 都有着动态编译 js 代码的作用
function jsonParse(objString) {
    return new Function('return ' + objString)
}

function jsonParse2(objString) {
    return eval('(' + objString + ')')
}

module.exports = {
    jsonStrigify,
    jsonParse,
    jsonParse2
}
