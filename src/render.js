
import { createElement, createTextElement } from "./vdom/index";


export function renderMixin(Vue) {
    Vue.prototype._c = function () {
       return createElement(this,...arguments)
    }

    Vue.prototype._v = function (text) {
        return createTextElement(this,text)
    }

    Vue.prototype._s = function (val) {
        if (typeof val == 'object') {
            return JSON.stringify(val)
        }
        return val
    }


    Vue.prototype._render = function () {
        const vm = this
        let render =  vm.$options.render  //就是我们解析出来的render方法，同时也有可能使用户写的
        let vnode = render.call(vm)
        return vnode
    }
}