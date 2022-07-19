import Dep, { popTarget, pushTarget } from "./dep";
import { queueWatcher } from "./scheduler";
let id = 0;

class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm;
    this.exprOrFn = exprOrFn;
    this.cb = cb;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.dirty = options.lazy; //如果时计算属性 lazy为 true dirty 为 true
    this.options = options;
    this.id = id++;
    // 默认应该让exprOrFn执行 exprOrFn 方法做了什么？ render （去vm上取值）
    if (typeof exprOrFn == "string") {
      this.getter = function () {
        //需要将表达式转化成函数
        // 当我取值时， 会进行依赖收集
        let path = exprOrFn.split("."); //[age,n]
        let obj = vm;

        for (let i = 0; i < path.length; i++) {
          obj = obj[path[i]];
        }
        return obj; //走getter
      };
    } else {
      this.getter = exprOrFn;
    }
    this.deps = [];
    this.depsId = new Set();
    this.value = this.lazy ? undefined : this.get(); //默认初始化 要取值
  }
  get() {
    //稍后用户更新时可以重新调用get
    // 这个getter 在渲染的时候 会去vm中取值触发
    // defineProperty.get , 每个属性可以收集自己的watcher
    // 我们希望一个属性可以对应多个watcher， 同时一个watcher 可以对应多个属性
    pushTarget(this); //Dep.target = watcher
    const value = this.getter.call(this.vm);
    popTarget();
    return value;
  }

  addDep(dep) {
    let id = dep.id;
    if (!this.depsId.has(id)) {
      this.depsId.add(id);
      this.deps.push(dep);
      dep.addSub(this);
    }
  }

  update() {
    //vue中的更新操作是异步的
    // 每次更新时 this

    if (this.lazy) {
      this.dirty = true;
    } else {
      queueWatcher(this); //多次调用update 我希望先将watcher缓存下来等一会一起更新
    }
  }

  run() {
    let newValue = this.get();
    let oldValue = this.value;

    this.valvue = newValue; //为了保证下一次更新 时上次的新值是下一次的老值
    if (this.user) {
      this.cb.call(this.vm, newValue, oldValue);
    }
  }
  evaluate() {
    this.dirty = false; //为false表示去过了
    this.value = this.get(); //用户的getter 执行
  }
  depend() {
    let i = this.deps.length;
    while (i--) {
      this.deps[i].depend(); //让计算属性依赖的值去收集渲染watcher
    }
  }
}
// watcher  和  dep
// 我们将更新的功能封装了一个watcher
// 渲染页面前会将当前watche放到 Dep的静态属性 上
// 在vue中页面渲染时使用的属性，需要进行依赖收集  收集对象的渲染watcher
// 取值时给每个属性都加了dep 属性，用于存储这个渲染watcher （同一个watcher 会对应多个dep）
// 每个属性可能对应多个视图（多个视图对应多个watcher） 一个属性要对应多个watcher
// dep.depend（） => 通知dep存放watcher => Dep.target.addDep() => 通知watcher存放dep
// 双向存储
export default Watcher;
