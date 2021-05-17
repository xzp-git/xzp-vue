import Dep, { popTarget, pushTarget } from "./dep";
let id = 0;

class Watcher {
    constructor(vm, exprOrFn, cb, options){
        this.vm = vm;
        this.exprOrFn = exprOrFn
        this.cb = cb
        this.options = options
        this.id = id++;
        // 默认应该让exprOrFn执行 exprOrFn 方法做了什么？ render （去vm上取值）
        this.getter = exprOrFn
        this.deps = []
        this.get()  //默认初始化 要取值
    }
    get(){//稍后用户更新时可以重新调用get
        // 这个getter 在渲染的时候 会去vm中取值触发
        // defineProperty.get , 每个属性可以收集自己的watcher
        // 我们希望一个属性可以对应多个watcher， 同时一个watcher 可以对应多个属性
        pushTarget(this) //Dep.target = watcher
        this.getter()
        popTarget()
    }

    addDep(dep){
 
    }
}

export default Watcher