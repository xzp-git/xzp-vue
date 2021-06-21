import { observe } from "./observer/index"; //node_resolve_plugin
import { isFunction } from "./utils";
import Watcher from "./observer/watcher"
import Dep from "./observer/dep"
export function stateMixin(Vue){
    Vue.prototype.$watch = function (key, handler, options = {}) {
        options.user = true
        let wacth = new Watcher(this, key, handler, options)
        if (options.immediate) {
            handler(wacth.value)
        }
    }
}


export function initState(vm){
    const opts = vm.$options
    if(opts.data){
        initData(vm)
    }
    if(opts.computed){
        initComputed(vm, opts.computed)
    }
    if(opts.watch){  //初始化watch
        initWatch(vm, opts.watch)
    }
}

function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
        get () {
            return vm[source][key]
        },
        set (newValue) {
            vm[source][key] = newValue
        }
    })
}

function initData(vm){
    let data = vm.$options.data
    // vue2中会将data中的所有数据劫持Object.defineProperty
    // 这个时候vm和data没有任何关系 通过_data进行关联
    data = vm._data =  isFunction(data) ? data.call(vm) : data
    // 用户去vm.xxx => vm._data.xxx
    for(let key in data){
        proxy(vm, "_data", key)
    }

    observe(data)
}

function initWatch(vm, watch){
    for (let key in watch) {
        let handler = watch[key]
        if(Array.isArray(handler)){
            for(let i = 0; i < handler.length; i++) {
                createWatch(vm, handler[i], key)
            }
        } else {
            createWatch(vm, handler, key)
        }
    }
}

function createWatch (vm, handler, key) {
    vm.$watch(key, handler)
}

function initComputed(vm, computed){
    const watchers = vm._computedWatchers = {}
    for(let key in computed){
        const userDef = computed[key]
        // 依赖的属性变化就重新取值
      let getter =   typeof userDef == 'function'? userDef : userDef.get
      //每个计算属性就是watcher 

    //   将watcher与属性做一个映射
      watchers[key] = new Watcher(vm, getter ,() => {},{lazy:true}) //默认不执行

      //将key 定义在vm上
      defineComputed(vm, key, userDef)
    }
}

function createComputedGetter(key){

    return function computedGetter(){ //去计算属性的值 走的是这个函数
        // 所有的计算属性与watcher的对应关系  这个watcher中包含getter
        let watcher = this._computedWatchers[key]
        if (watcher.dirty) {  //脏 调用getter 不脏 不调用 getter
            watcher.evaluate()
        }
        // 如果当前取完值Dep.target还有值需要继续向上收集
        if (Dep.target) {
            //计算属性watcher内部 有两个dep firstName lastName
            watcher.depend() //watcher 里 对应了多个dep
        }
        return watcher.value
    }

}

function defineComputed(vm, key, userDef){
    let sharedProperty = {}
    if(typeof userDef == 'function'){
        sharedProperty.get = createComputedGetter(key)
    }else{
        sharedProperty.get = createComputedGetter(key)
        sharedProperty.set = userDef.set
    }
    Object.defineProperty(vm, key, sharedProperty)
}