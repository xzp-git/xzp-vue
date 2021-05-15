let oldArrayPrototype = Array.prototype
export let arrayMethods = Object.create(Array.prototype)
// arratMethods.__proto__ = Array.prototype

let methods = [
    'push',
    'pop',
    'unshift',
    'shift',
    'reverse',
    'sort',
    'splice'
]

methods.forEach(method => {
    // 用户调用时如果是以上七个方法 会用我自己重写的， 否则用原来的数组方法
    arrayMethods[method] = function (...args) {
        console.log('数组发生变化');
        oldArrayPrototype[method].call(this,...args)
        let inserted = null
        let ob = this.__ob__
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args ;
                break;
            case 'splice':
                inserted = args.slice(2)
            default:
                break;
        }
        // 如果有新增的内容要进行继续劫持， 我需要观测数组的每一项
        if (inserted) ob.observeArray(inserted)
    } 
})
