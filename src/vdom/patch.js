

export function patch(oldVnode, vnode) {
    if (!oldVnode) {
        return createElm(vnode)
    }
    if (oldVnode.nodeType == 1) {

        // 用vnode 来生成真实dom 替换原本的dom元素

        const parentElm = oldVnode.parentNode //找到他的父元素

        let elm = createElm(vnode) //根据虚拟节点 创建元素
        // 在第一次渲染后 删掉节点后， 下次在使用的时候无法获取
        parentElm.insertBefore(elm, oldVnode.nextSibling)
        parentElm.removeChild(oldVnode)

        return elm
    } else {
        // 如果标签的名称不一样 直接删掉老的 换成新的
        if (oldVnode.tag !== vnode.tag) {
            // 可以通过vnode.el属性 获取现在真实的dom元素
            return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el)
        }


        let el = vnode.el = oldVnode.el  //表示当前节点复用 旧节点
        // 如果两个虚拟节点是文本节点比较文本节点
        if (vnode.tag == undefined) {
            if (oldVnode.text !== vnode.text) {
                return el.textContent = vnode.text
            }
        }
        // 如果标签一样比较属性`/7
        let oldProps = oldVnode.data
        patchProps(vnode, oldProps)
        // 属性可能有删除的情况 

        
        let oldChildren = oldVnode.children || {}
        let newChildren = vnode.children || {}

        if (oldChildren.length > 0 && newChildren.length > 0) {
            patchChildren(el, oldChildren, newChildren)
        } else if (newChildren.length > 0) {
            for (let i = 0; i < newChildren.length; i++) {
                const child = createElm(newChildren[i]);
                el.appendChild(child)

            }
         //一方有儿子， 一方没儿子   
        } else if (oldChildren.length > 0) {
            el.innerHTML = ``
        }

        return el

        // 双方都有
    }
}

function patchChildren(el, oldChildren, newChildren) {
    let oldStartIndex = 0
    let oldStartVnode = oldChildren[0]
    let oldEndIndex = oldChildren.length - 1
    let oldEndVnode = oldChildren[oldEndIndex]

    let newStartIndex = 0
    let newStartVnode = newChildren[0]
    let newEndIndex = newChildren.length - 1
    let newEndVnode = newChildren[newEndIndex]
    const makeIndexKey = (children) => {
        return  children.reduce((memo, current,index) => {
            if (current.key) {
                memo[current.key] = index
            }
            return memo
        },{})
    } 
    const keysMap = makeIndexKey(oldChildren)
    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        // 优化了向后添加  向前添加  尾巴移动到头部  头部移动到尾部  反转
        if (!oldStartVnode) { //已经被移动走了
            oldStartVnode = oldChildren[++oldStartIndex]
        }else if (!oldEndVnode) {
            oldEndVnode = oldChildren[--oldEndIndex]
        }

        // 同时循环新的节点和老的节点 有一方循环完毕就结束
        if (isSameVnode(oldStartVnode, newStartVnode)) { //头头一致 发下标签一致
            patch(oldStartVnode, newStartVnode)
            oldStartVnode = oldChildren[++oldStartIndex]
            newStartVnode = newChildren[++newStartIndex]
        } else if (isSameVnode(oldEndVnode, newEndVnode)) {
            patch(oldEndVnode, newEndVnode)
            oldEndVnode = oldChildren[--newEndIndex]
            newEndVnode = newChildren[--newEndVnode]
        }else if (isSameVnode(oldStartVnode, newEndVnode)) {
             //头尾比较
             patch(oldStartVnode, newEndVnode)
             el.insertBefore(oldStartVnode.el,oldEndVnode.el.nextSibling)
             oldStartVnode = oldChildren[++oldStartIndex]
             newEndVnode = newChildren[--newEndIndex]

        }else if (isSameVnode(oldEndVnode, newStartVnode)) {
            //尾头比较
            patch(oldEndVnode, newStartVnode)
            el.insertBefore(oldEndVnode.el,oldStartVnode.el)
            oldEndVnode = oldChildren[--oldEndIndex]
            newStartVnode = newChildren[++newStartIndex]
       }else{
           //乱序比对  核心diff
           //1. 需要根据key' 和对应的索引将老的内容生成映射表
           let moveIndex = keysMap[newStartVnode.key] //用新的去老的中查找
           if (moveIndex == undefined) { //如果不能服用直接创建新的插入到老的节点开头处
               el.insertBefore(createElm(newStartVnode),oldStartVnode.el)
           } else{
               let moveNode = oldChildren[moveIndex]
               oldChildren[moveIndex] = null  //此节点已经被移动走了
               el.insertBefore(moveNode.el, oldStartVnode.el)
               patch(moveNode,newStartVnode) //比较两个节点的属性
           }

           newStartVnode = newChildren[++newStartIndex]  
       }
       
    }
    // 如果追加了一个
    if (newStartIndex <= newEndIndex) {
        for (let i = newStartIndex; i <= newStartIndex; i++) {
            //    el.appendChild(createElm(newChildren[i]))
            //    insertBefore方法 他可以appendChild功能 insertBefore(节点，null) 

            // 看一下尾指针的下一个元素是否存在
            let anchor = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el
            el.insertBefore(createElm(newChildren[i]), anchor)

        }
    }
    if (oldStartIndex <= oldEndIndex) {
        for (let i = newStartIndex; i <= oldEndIndex; i++) {
            //如果老的多将老节点删除 但是可能里面有null的情况
            if (oldChildren[i] !== null) el.removeChild(oldChildren[i].el)

        }
    }



}
function isSameVnode(oldVnode, newVnode) {
    return (oldVnode.tag == newVnode.tag) && (oldVnode.key == newVnode.key)
}
function patchProps(vnode, oldProps = {}) { //初次渲染调用此方法，后续更新也可以调用此方法
    let newProps = vnode.data || {}
    let el = vnode.el
    let newStyle = newProps.style || {}
    let oldStyle = oldProps.style || {}
    for (const key in oldStyle) {
        if (!newStyle[key]) { //新的里面不存在
            el.style[key] = ''
        }
    }
    // 如果老的属性有 新的没有直接删除
    for (const key in oldProps) {
        if (!newProps[key]) {
            el.removeAttribute(key)
        }
    }
    for (let key in newProps) {
        if (key === 'style') {
            for (let styleName in newProps.style) {
                el.style[styleName] = newProps.style[styleName]
            }
        } else {
            el.setAttribute(key, newProps[key])
        }

    }
}

function createComponent(vnode) {
    let i = vnode.data
    if ((i = i.hook) && (i = i.init)) {
        i(vnode) //调用init方法
    }
    if (vnode.componentInstance) {  //有属性说明子组件new完毕，并且组件对应的真实DOM挂载到了componentInstance.$el
        return true
    }
}
export function createElm(vnode) {
    let { tag, data, children, text, vm } = vnode
    if (typeof tag === 'string') {
        if (createComponent(vnode)) {
            // 返回组件对应的真实节点
            return vnode.componentInstance.$el
        }

        vnode.el = document.createElement(tag)  //虚拟节点会有一个了el属性 对应真实节点
        patchProps(vnode)
        children.forEach(child => {
            vnode.el.appendChild(createElm(child))
        });


    } else {
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}