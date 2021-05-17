
import { patch } from "./vdom/patch";
import Watcher from "./observer/watcher";
export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        // 既有初始化 又有更新
        const vm = this
        vm.$el = patch(vm.$el, vnode)
  
    }
}
 

//后续每个组件渲染的时候都有一个watcher
export function mountComponent(vm, el) {
    // 更新函数 数据变化后 会再次调用此函数
    let updateComponent = () => {
        // 调用render函数 生成虚拟DOM
        vm._update(vm._render()) //后续更新可以调用updateComponent方法
        // 用虚拟dom生成真实dom
    }
    // 观察者模式   属性是被观察者    刷新页面 是 观察者
    // updateComponent();

    new Watcher(vm, updateComponent, () => {
        console.log('更新视图了');
    }, true ) //他是一个渲染watcher 后续有其他的watcher
}