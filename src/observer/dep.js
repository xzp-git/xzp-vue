let id = 0;

class Dep{ //每个属性都给他分配一个dep dep可以来存放watcher  watcher中还要存放这个dep

    constructor(){
        this.id = id++
        this.subs = [] //用来存放的watcher
    }

    depend(){
        // dep 里面要存放watcher watcher要存放dep  多对多的关系
        if (Dep.target) {
            Dep.target.addDep(this)
        } 
    }
    addSub(watcher){
        this.subs.push(watcher)
    }
    notify(){
        this.subs.forEach(watcher => watcher.update())
    }
}
Dep.target = null
let stack = []
export function pushTarget(watcher) {
    Dep.target = watcher  
    stack.push(watcher)
}


export function popTarget() {
    stack.pop()
    Dep.target = stack[stack.length-1]
}




























export default Dep