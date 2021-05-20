import { mergeOptions } from "../utils";


export function initGlobalApi (Vue) {
    Vue.options = {

    } //用来存放全局变量 , 每个组件初始化的时候都会和options选项进行合并
    Vue.mixin = function (options) {
        this.options = mergeOptions(this.options, options)
        console.log(this.options);
        return this
    }
}