function flat(arr) {
    // 验证 arr 中，还有没有深层数组
    const isDeep = arr.some(item => item instanceof Array)
    if(isDeep) {
        return arr
    }

    const res = Array.prototype.concat.apply([], arr)
    return flat(arr) // 递归
}