export function isFunction(data) {
    return typeof data === 'function'
}
export function isObject(val) {
    return typeof val == 'object' && val !== null
}


const callbacks = []
function flushCallbacks() {
    callbacks.forEach(cb => cb())
    waiting = false
}


let waiting = false

function timer(flushCallbacks) {
    let timerFn = function () { }
    // 微任务
    if (Promise) {
        timerFn = () => {
            Promise.resolve().then(flushCallbacks)
        }
    // 微任务
    }else if (MutationObserver) {
        let textNode = document.createTextNode(1)
        let observe = new MutationObserver(flushCallbacks)
        observe.observe(textNode,{
            characterData:true
        })
        timerFn = () => {
            textNode.textContent = 3
        }

    }else if (setImmediate) {
        timerFn = () => {
            setImmediate(flushCallbacks)
        }
    }else{
        timerFn = () => {
            setTimeout(flushCallbacks, 0);
        }
    }
    timerFn()
}
export function nextTick(cb) {
    callbacks.push(cb)

    if (!waiting) {
        timer(flushCallbacks)  //vue2 中 考虑了兼容性问题  vue3里面考虑了兼容性
        waiting = true
    }
}
let lifeCycleHooks = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed'
]
let strats = {} //存放各种策略
function mergeHook(parentVal, childVal) {
    if (childVal) {
        if (parentVal) {
            return parentVal.concat(childVal)
        }else{
            return [childVal]
        }
    }else{
        return parentVal
    }
}
lifeCycleHooks.forEach(hook => {
    strats[hook] = mergeHook
})
strats.components = function (parent, child) {
    let options =  Object.create(parent) //根据父对象构造一个新对象
    if (child) {
        for (let key in child) {
            options[key] = child[key]
         }
    } 
    return options
}
// {a:1} {b:2}
export function mergeOptions(parent, child) {
    const options = {}  //合并后的结果

    for (const key in parent) {
        mergeField(key)
    }

    for (const key in child) {
        if (parent.hasOwnProperty(key)) {
            continue
        }
        mergeField(key)
    }

    function mergeField(key) {
        let parentVal = parent[key]

        let childVal = child[key]

        // 策略模式
        if (strats[key]) { //如果有对应的策略就调用对应的策略即可
            options[key] = strats[key](parentVal, childVal)
        }else{
            if (isObject(parentVal) && isObject(childVal)) {
                options[key] = {...parentVal, ...childVal}
            }else{
                // 父亲有 儿子没

                options[key] = child[key] || parent[key]
            }
        }
    }
    return options
}


export function isReservedTag(tag){
    let str = 'a,div,span,p,img,button,ul,li'
    return str.includes(tag)
}