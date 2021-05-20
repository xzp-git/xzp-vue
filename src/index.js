import { initMixin } from "./init"
import { lifecycleMixin } from "./lifecycle";
import { renderMixin } from "./render";
import { stateMixin } from "./state"
import { initGlobalApi } from "./global-api/index"
function Vue(options) {
    // options 为用户传入的选项
    this._init(options); //初始化操作， 组件
}
// 扩展原型
initMixin(Vue)

renderMixin(Vue) //_render

lifecycleMixin(Vue) //_update

stateMixin(Vue)

// 在类上扩展的 Vue.mixin
initGlobalApi(Vue)

export default Vue;