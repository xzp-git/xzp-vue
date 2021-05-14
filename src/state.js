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

function initData(vm){
    let data = vm.$options.data
    console.log(data)
}