import { nextTick } from "../utils";

let queue = [];
let has = {}; //做列表维护 存放了哪些watcher
let pending = false;

function flushSchedulerQueue() {
  for (let i = 0; i < queue.length; i++) {
    queue[i].run();
  }
  queue = [];
  has = {};
  pending = false;
}

// 要等待同步代码 执行完毕后 才执行异步逻辑
export function queueWatcher(watcher) {
  //当前执行栈中代码执行完毕后，会先清空微任务， 在清空 宏任务
  const id = watcher.id; //name 和 age 的id 是一个对应的 watcher

  if (has[id] == null) {
    queue.push(watcher);
    has[id] = true;
    // 开启一次更新操作 批处理  （防抖）

    if (!pending) {
      nextTick(flushSchedulerQueue);
      pending = true;
    }
  }
}
