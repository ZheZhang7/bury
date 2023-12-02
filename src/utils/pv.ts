// pv 页面访问量
/**
 * 主要监听history 和 hash
 * history api go back forward pushState replaceState
 * pushState replaceState 方法不会触发 popstate事件，需要重写
 * 
 * hash 使用hashchange监听
 */

// 重写 pushState replaceState 
export const createHistoryEvent = <T extends keyof History>(type: T) => {
    const origin = history[type];

    return function (this: any) {
        const res = origin.apply(this, arguments);
        const e = new Event(type);

        // dispatchevent 派发事件
        // addeventListener 监听事件
        // removeeventListener  删除  发布订阅模式
        window.dispatchEvent(e);
        return res;
    }
}