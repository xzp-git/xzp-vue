import { isObject } from "../utils";
import Dep, { popTarget, pushTarget } from "./dep";
import { arrayMethods } from "./array";

// 1.如果数据是对象  会将对象不停的递归 进行劫持
// 2.如果是数组，会劫持数组的方法，并对数组中不是基本数据类型的进行检测

//检测数据变化  类有类型， 对象无类型

// 如果给对象新增一个属性不会触发视图更新   set (给对象本身也增加一个dep  dep中存watcher，如果增加一个属性后，我就手动的触发watcher的更新)
class Observer{
    
    constructor(data){
        this.dep = new Dep()  //数据可能是数组或者对象
        //所有被劫持过的属性都有__ob__
        Object.defineProperty(data,'__ob__',{
            value:this,
            enumerable:false
        })
         
        // 对对象中的所有属性，进行劫持
        if (Array.isArray(data)) { //我希望数组的变化 可以触发视图更新
            // 数组劫持的逻辑
            // 对数组原来的方法进行改写，切片编程，高阶函数
            data.__proto__ = arrayMethods
            // 若果是数组中的数据是对象类型，需要监控对象的变化
            this.observeArray(data)
        }else{
            this.walk(data) //对对象劫持的逻辑
        }
        
    }

    observeArray(data){ //对我们数组的数组 和数组中的对象再次劫持 递归
        data.forEach( item => observe(item))
        // 如果数组里放的是对象 也做了观测  
    }
    
    walk (data){

        Object.keys(data).forEach(key => {
            defineReactive(data, key, data[key])
        })

    }
}

function dependArray(value) {

    for (let i = 0; i < value.length; i++) {
        let current = value[i];
        current.__ob__ && current.__ob__.dep.depend();

        if (Array.isArray(current)) {
            dependArray(current)
        }
    }

}

// vue2会对对象进行遍历，将每个属性用defineProperty 重新定义 性能差
function defineReactive (data,key,value) {
    let childOb =  observe(value)  //本身用户默认值是对象套对象
    let dep = new Dep()  //每个属性都有一个dep
    Object.defineProperty(data, key, {

        get(){
            //  取值时我们希望吧dep  与 watcher  对应起来
            if (Dep.target) { //此值是在模板中取值的
                dep.depend()  //让dep记住Watcher 
                if (childOb) {
                    childOb.dep.depend() //让数组和对象 也有dep
                    //可能是数组 可能是对象  对象也要收集依赖  后续写$set方法是需要触发自己的更新操作
                    if (Array.isArray(value)) { //取外层数组要将数组里面的也进行依赖收集
                        dependArray(value)
                    }
                }
            }
            return value
        },

        set(newV){
            if(newV !== value){
                observe(newV)  //如果用户赋值一个新对象，需要将这个对象进行劫持
                value = newV
                dep.notify()
            }
        }
        
    })
}

export function observe (data) {
    // 如果是对象才观测
    if (!isObject(data)) {
        return
    }
    if (data.__ob__) {
        return data.__ob__
    }
    // 默认最外层的data必须是一个对象
    return new Observer(data)
}
