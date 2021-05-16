import { initMixin } from "./init"
import { lifecycleMixin } from "./lifecycle";
import { renderMixin } from "./render";

function Vue(options) {
    // options 为用户传入的选项
    this._init(options); //初始化操作， 组件
}
// 扩展原型
initMixin(Vue)

renderMixin(Vue) //_render

lifecycleMixin(Vue) //_update



export default Vue;