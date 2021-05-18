export function isFunction(data) {
    return typeof data === 'function'
}
export function isObject(val) {
    return typeof val == 'object' && val !== null
}


const callbacks = []
function flushCallbacks(params) {
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