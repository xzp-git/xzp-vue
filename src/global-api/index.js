export function initGlobalApi (Vue) {
    Vue.options = {} //用来存放全局变量
    Vue.mixin = function (options) {
        console.log(options)
    }
}