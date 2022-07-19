import { isReservedTag, isObject } from "../utils";

export function createElement(vm, tag, data = {}, ...children) {
  // 如果tag是组件 应该渲染一个组件的vnode
  if (isReservedTag(tag)) {
    return vnode(vm, tag, data, data.key, children, undefined);
  } else {
    const Ctor = vm.$options.components[tag];
    return createComponent(vm, tag, data, data.key, children, Ctor);
  }
}

export function createTextElement(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text);
}

function vnode(vm, tag, data, key, children, text, componentOptions) {
  return {
    vm,
    tag,
    data,
    key,
    children,
    text,
    componentOptions,
  };
}
// 创建组件的虚拟节点
function createComponent(vm, tag, data, key, children, Ctor) {
  // 组件的构造函数
  if (isObject(Ctor)) {
    Ctor = vm.$options._base.extend(Ctor);
  }
  data.hook = {
    //等会渲染组件时需要调用此初始化方法
    init(vnode) {
      let vm = (vnode.componentInstance = new Ctor({ _isComponent: true })); //new Sub  会用此选项和组件的配置进行合并
      vm.$mount();
    },
  };

  return vnode(vm, `vue-component-${tag}`, data, key, undefined, undefined, {
    Ctor,
    children,
  });
}
