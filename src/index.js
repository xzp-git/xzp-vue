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

import { compileToFunction } from "./compiler/index";
import { createElm, patch } from "./vdom/patch";
// diff 核心
let oldTemplate = `<div style="color:red">{{message}}</div>`

let vm1 = new Vue({data:{message:'hello world'}})
const render1 = compileToFunction(oldTemplate)
const oldVnode = render1.call(vm1)  //虚拟dom
document.body.appendChild(createElm(oldVnode))

let newTemplate = `<div style="color:blue">{{message}}</div>`

let vm2 = new Vue({data:{message:'xzp'}})
const render2 = compileToFunction(newTemplate)
const newVnode = render2.call(vm2)  //虚拟dom
//根据新的虚拟节点更新老的节点，老的能复用尽量复用

patch(oldVnode, newVnode)



export default Vue;