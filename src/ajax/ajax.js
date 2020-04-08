const xhr = new XMLHttpRequest()
xhr.open('GET', '/data/test.json', true) // true 表示异步，false 表示同步

/**
 * readyState
 * 0 （未初始化）还没有调用 send 方法
 * 1 （载入）已调用 send 方法，正在发送请求
 * 2 （载入完成）send 方法执行完成，已经接收到全部响应内容
 * 3 （交互）正在解析响应内容
 * 4 （完成）响应内容解析完成，可以在客户端调用
 *
 * status
 * 2xx 表示成功处理请求，如 200
 * 3xx 需要重定向，浏览器直接跳转，如 301 永久重定向 302 临时重定向 304 资源未改变
 * 4xx 客户端请求错误， 404 请求地址错误 403 客户端没有权限
 * 5xx 服务器端错误
 */
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
