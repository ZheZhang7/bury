(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.bury = factory());
})(this, (function () { 'use strict';

    // 定义用户上传类型
    // 版本
    var trackConfig;
    (function (trackConfig) {
        trackConfig["version"] = "1.0.0";
    })(trackConfig || (trackConfig = {}));

    // pv 页面访问量
    /**
     * 主要监听history 和 hash
     * history api go back forward pushState replaceState
     * pushState replaceState 方法不会触发 popstate事件，需要重写
     *
     * hash 使用hashchange监听
     */
    // 重写 pushState replaceState 
    const createHistoryEvent = (type) => {
        const origin = history[type];
        return function () {
            const res = origin.apply(this, arguments);
            const e = new Event(type);
            // dispatchevent 派发事件
            // addeventListener 监听事件
            // removeeventListener  删除  发布订阅模式
            window.dispatchEvent(e);
            return res;
        };
    };

    const eventList = ['click', 'dblclick', 'contextmenu', 'mousedown', 'mouseup', 'mouseenter', 'mouseout', 'mouseover'];
    class bury {
        constructor(options) {
            this.data = Object.assign(this.initDef(), options);
            this.initBury();
        }
        // 合并js和promise报错
        jsError() {
            this.errorEvent();
            this.promiseReject();
        }
        // 监听js报错
        errorEvent() {
            window.addEventListener('error', (error) => {
                this.reportBury({
                    event: 'jsError',
                    targetKey: 'message',
                    message: error
                });
            });
        }
        // 监听promise报错
        promiseReject() {
            window.addEventListener('unhandledrejection', (event) => {
                event.promise.catch(error => {
                    this.reportBury({
                        event: 'promiseError',
                        targetKey: 'message',
                        message: error
                    });
                });
            });
        }
        // 监听dom
        targetKeyReport() {
            eventList.forEach(ev => {
                window.addEventListener(ev, e => {
                    const target = e.target;
                    const targetKey = target.getAttribute('target-key');
                    if (targetKey) {
                        this.reportBury({
                            event: ev,
                            targetKey,
                        });
                    }
                });
            });
        }
        // 兜底逻辑 用户未传递相关参数
        initDef() {
            // 修改history路由
            window.history['pushState'] = createHistoryEvent('pushState');
            window.history['replaceState'] = createHistoryEvent('replaceState');
            return {
                // 默认参数
                sdkVersion: trackConfig.version,
                historyTrack: false,
                hashTrack: false,
                domTrack: false,
                jsError: false
            };
        }
        // uv 独立访问，用户的唯一表示
        // 可以再登录之后通过接口返回的id进行设置
        // 另一种可以采用canvas进行指纹追踪（设备，操作系统，浏览器三合一形成唯一的uuid）
        setUserId(uuid) {
            this.data.uuid = uuid;
        }
        setExtra(extra) {
            this.data.extra = extra;
        }
        // 在这里uuid采用sendBeacon上报
        // 上报
        // sendbeacon与xhr对比，navigator.sendBeacon即使是页面关闭了也会完成请求，而xhr不一定
        reportBury(data) {
            const params = Object.assign(this.data, data, { time: new Date().getTime() });
            let headers = {
                type: 'application/x-www-form-urlencoded'
            };
            let blob = new Blob([JSON.stringify(params)], headers);
            navigator.sendBeacon(this.data.requestUrl, blob);
        }
        // 手动上报
        sendBury(data) {
            this.reportBury(data);
        }
        // 自动上报
        captureEvents(mouseEventList, targetKey, data) {
            let count = 0;
            mouseEventList.forEach(event => {
                window.addEventListener(event, () => {
                    count++;
                    console.log('监听success');
                    console.log('跳转次数：', count);
                    this.reportBury({
                        event,
                        targetKey,
                        data
                    });
                });
            });
        }
        // 初始化上报
        initBury() {
            if (this.data.historyTrack) {
                this.captureEvents(['pushState', 'replaceState', 'popstate'], 'history-pv');
            }
            if (this.data.hashTrack) {
                this.captureEvents(['hashchange'], 'hash-pv');
            }
            if (this.data.domTrack) {
                this.targetKeyReport();
            }
            if (this.data.jsError) {
                this.jsError();
            }
        }
    }

    return bury;

}));
