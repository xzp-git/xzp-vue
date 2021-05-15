import { observe } from "./observer/index"; //node_resolve_plugin
import { isFunction } from "./utils";


export function initState(vm){
    const opts = vm.$options
    if(opts.data){
        initData(vm)
    }
    // if(opts.computed){
    //     initComputed()
    // }
    // if(opts.watch){
    //     initWatch()
    // }

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